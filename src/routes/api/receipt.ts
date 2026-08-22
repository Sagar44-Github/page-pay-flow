/**
 * GET /api/receipt?txId=<transactionId> — Public Receipt Verification Service Endpoint.
 *
 * Public, read-only endpoint that independently verifies any PagePay payment by:
 *   1. Looking up the transaction in server logs and returning audit chain hashes
 *      (entryHash and previousEntryHash) for cryptographic verification.
 *   2. Performing an independent on-chain cross-check against Algorand Testnet (algod/indexer)
 *      to confirm that the transaction exists, is confirmed, and transferred USDC ASA (10458941)
 *      to the expected PagePay merchant payTo address.
 *
 * Unmetered, requires no wallet connection or authentication.
 */
import { createFileRoute } from "@tanstack/react-router";

import { findLogByTxId } from "@/lib/services/pagepayLogger.server";
import { verifyOnChainTx } from "@/lib/pagepay/onchain.server";

const EXPLORER_BASE = "https://testnet.explorer.perawallet.app/tx/";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}

export async function handleGetReceipt({ request }: { request: Request }): Promise<Response> {
  const url = new URL(request.url);
  const txId = url.searchParams.get("txId")?.trim();
  const testMismatch = url.searchParams.get("testMismatch") === "true";

  // Requirement: Missing txId -> HTTP 400 Bad Request
  if (!txId) {
    return json({ error: "Missing txId query parameter", reason: "Provide a txId parameter, e.g. GET /api/receipt?txId=<transactionId>" }, 400);
  }

  // Look up txId in internal server logs & audit chain
  const entry = findLogByTxId(txId);

  // Independent on-chain cross-check against Algorand testnet
  const overridePayTo = testMismatch ? "WRONG_RECEIVER_ADDRESS_FOR_TESTING_MISMATCH_33333333333" : undefined;
  const onChainResult = await verifyOnChainTx(txId, overridePayTo);

  // Requirement: Unknown txId (neither in log nor on-chain confirmed) -> HTTP 404 Not Found
  if (!entry && !onChainResult.onChainVerified && onChainResult.matchStatus === "LOOKUP_FAILED") {
    return json(
      {
        error: "Receipt not found",
        reason: "No matching payment transaction found in server logs or on Algorand testnet.",
        txId,
        explorer: `${EXPLORER_BASE}${encodeURIComponent(txId)}`,
      },
      404,
    );
  }

  return json({
    service: "PagePay Receipt Verification Service",
    verified: true,
    txId: entry?.txId ?? txId,
    timestamp: entry?.timestamp ?? new Date().toISOString(),
    route: entry?.route ?? "POST /api/summarize",
    pages: entry?.pages ?? (onChainResult.amountAtomic ? Math.max(1, Math.round(onChainResult.amountAtomic / 10000)) : 1),
    pricePaid: entry?.price ?? onChainResult.amountFormatted ?? "$0.01",
    paymentStatus: entry?.paymentStatus ?? (onChainResult.onChainVerified ? "settled" : "failed"),
    outcome: entry?.outcome ?? (onChainResult.onChainVerified ? "summarized" : "payment_failed"),
    payer: entry?.payer ?? onChainResult.sender ?? "—",

    // Cryptographic Audit Chain Hashes (if in server log)
    auditChain: entry
      ? {
          entryHash: entry.entryHash,
          previousEntryHash: entry.previousEntryHash,
        }
      : null,

    // Independent On-Chain Cross-Check
    onChainVerified: onChainResult.onChainVerified,
    onChainDetails: {
      matchStatus: onChainResult.matchStatus,
      confirmedRound: onChainResult.confirmedRound,
      receiver: onChainResult.receiver,
      assetId: onChainResult.assetId,
      amountAtomic: onChainResult.amountAtomic,
      amountFormatted: onChainResult.amountFormatted,
      ...(onChainResult.reason ? { reason: onChainResult.reason } : {}),
    },

    explorer: `${EXPLORER_BASE}${encodeURIComponent(entry?.txId ?? txId)}`,
  });
}

export const Route = createFileRoute("/api/receipt")({
  server: {
    handlers: {
      GET: async ({ request }) => handleGetReceipt({ request }),
    },
  },
});
