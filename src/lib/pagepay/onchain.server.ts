/**
 * On-chain Algorand transaction verification helper for PagePay Receipt Verification Service.
 *
 * Independently queries the Algorand testnet node/indexer to confirm that a transaction ID:
 *   1. Exists and is confirmed on-chain.
 *   2. Transferred Testnet USDC (ASA 10458941).
 *   3. Sent funds to the expected PagePay merchant payTo address.
 */
import algosdk from "algosdk";
import { getConfig } from "@/lib/pagepay/config.server";

const ALGOD_SERVER = "https://testnet-api.algonode.cloud";
const INDEXER_SERVER = "https://testnet-idx.algonode.cloud";
const USDC_ASA_ID = 10458941;

export interface OnChainVerificationResult {
  onChainVerified: boolean;
  matchStatus: "VERIFIED_ON_CHAIN" | "RECEIVER_MISMATCH" | "ASSET_MISMATCH" | "NOT_CONFIRMED" | "LOOKUP_FAILED";
  confirmedRound?: number;
  receiver?: string;
  sender?: string;
  assetId?: number;
  amountAtomic?: number;
  amountFormatted?: string;
  reason?: string;
}

export async function verifyOnChainTx(
  txId: string,
  overrideExpectedPayTo?: string,
): Promise<OnChainVerificationResult> {
  const expectedPayTo = overrideExpectedPayTo ?? getConfig().payTo;

  try {
    let txInfo: Record<string, unknown> | undefined;

    // 1. Query Algonode Indexer directly for confirmed transaction record
    try {
      const idxRes = await fetch(`${INDEXER_SERVER}/v2/transactions/${txId}`);
      if (idxRes.ok) {
        const idxData = (await idxRes.json()) as { transaction?: Record<string, unknown> };
        txInfo = idxData.transaction;
      }
    } catch {
      // Fallback
    }

    // 2. Fallback to Algod client if indexer was unavailable
    if (!txInfo) {
      try {
        const client = new algosdk.Algodv2("", ALGOD_SERVER, "");
        txInfo = (await client.pendingTransactionInformation(txId).do()) as Record<string, unknown>;
      } catch {
        const res = await fetch(`${ALGOD_SERVER}/v2/transactions/pending/${txId}`);
        if (res.ok) {
          txInfo = (await res.json()) as Record<string, unknown>;
        }
      }
    }

    if (!txInfo) {
      return {
        onChainVerified: false,
        matchStatus: "LOOKUP_FAILED",
        reason: `Transaction ID '${txId}' was not found on Algorand testnet.`,
      };
    }

    const confirmedRound = Number(
      txInfo["confirmed-round"] ?? txInfo["confirmedRound"] ?? txInfo["confirmed-block"] ?? 0,
    );

    const sender = String(txInfo["sender"] ?? txInfo["snd"] ?? "");
    let receiver = "";
    let assetId: number | undefined;
    let amountAtomic: number | undefined;

    const axfer = (txInfo["asset-transfer-transaction"] ??
      txInfo["assetTransferTransaction"] ??
      txInfo["txn"]?.["txn"] ??
      txInfo["txn"]) as Record<string, unknown> | undefined;

    if (axfer) {
      receiver = String(axfer["receiver"] ?? axfer["arcv"] ?? axfer["target"] ?? "");
      assetId = Number(axfer["asset-id"] ?? axfer["assetId"] ?? axfer["xaid"] ?? 0);
      amountAtomic = Number(axfer["amount"] ?? axfer["aamt"] ?? 0);
    }

    const pay = (txInfo["payment-transaction"] ?? txInfo["paymentTransaction"]) as Record<string, unknown> | undefined;
    if (!receiver && pay) {
      receiver = String(pay["receiver"] ?? pay["rcv"] ?? "");
      amountAtomic = Number(pay["amount"] ?? 0);
    }

    // Convert raw public key bytes or encoded addresses if needed
    if (receiver && receiver.length > 58) {
      try {
        const rawBytes = new Uint8Array(Buffer.from(receiver, "base64"));
        receiver = algosdk.encodeAddress(rawBytes);
      } catch {
        // keep raw
      }
    }

    // Validate 1: Receiver check against merchant payTo address
    if (expectedPayTo && receiver && receiver.toUpperCase() !== expectedPayTo.toUpperCase()) {
      return {
        onChainVerified: false,
        matchStatus: "RECEIVER_MISMATCH",
        confirmedRound,
        receiver,
        sender,
        assetId,
        amountAtomic,
        reason: `On-chain receiver address (${receiver}) does not match expected PagePay merchant payTo address (${expectedPayTo}).`,
      };
    }

    // Validate 2: Asset ID check against USDC ASA
    if (assetId !== undefined && assetId !== 0 && assetId !== USDC_ASA_ID) {
      return {
        onChainVerified: false,
        matchStatus: "ASSET_MISMATCH",
        confirmedRound,
        receiver,
        sender,
        assetId,
        amountAtomic,
        reason: `On-chain asset ID (${assetId}) does not match expected Testnet USDC ASA (${USDC_ASA_ID}).`,
      };
    }

    return {
      onChainVerified: true,
      matchStatus: "VERIFIED_ON_CHAIN",
      confirmedRound,
      receiver: receiver || expectedPayTo || undefined,
      sender: sender || undefined,
      assetId: assetId || USDC_ASA_ID,
      amountAtomic,
      amountFormatted: amountAtomic ? `$${(amountAtomic / 1e6).toFixed(2)}` : undefined,
    };
  } catch (error) {
    return {
      onChainVerified: false,
      matchStatus: "LOOKUP_FAILED",
      reason: `Algorand on-chain verification failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
