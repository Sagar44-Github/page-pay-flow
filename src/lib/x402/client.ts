/**
 * Browser-side x402 payment flow for PagePay (Algorand Testnet).
 *
 * Uses the official @x402-avm client packages: the server's 402 response is decoded
 * into PaymentRequirements, the connected wallet signs the exact-AVM payment, and the
 * request is retried with the X-PAYMENT header.
 */
import { registerExactAvmScheme } from "@x402-avm/avm/exact/client";
import { x402Client, x402HTTPClient } from "@x402-avm/core/client";
import type { PaymentRequired, SettleResponse } from "@x402-avm/core/types";

export const ALGOD_URL = "https://testnet-api.algonode.cloud";

export interface WalletSigner {
  address: string;
  signTransactions(txns: Uint8Array[], indexesToSign?: number[]): Promise<(Uint8Array | null)[]>;
}

export function createPagePayHttpClient(signer: WalletSigner): x402HTTPClient {
  const core = new x402Client();
  registerExactAvmScheme(core, {
    signer,
    algodConfig: { algodUrl: ALGOD_URL, algodToken: "" },
  });
  return new x402HTTPClient(core);
}

/** Verbatim capture of an HTTP exchange, shown in the UI as protocol proof. */
export interface RawExchange {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

async function capture(response: Response): Promise<RawExchange> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return {
    status: response.status,
    statusText: response.statusText,
    headers,
    body: await response.text(),
  };
}

export interface PaidRequestResult {
  ok: boolean;
  unpaid: RawExchange;
  paymentRequired?: PaymentRequired;
  paid?: RawExchange;
  settlement?: SettleResponse;
  result?: unknown;
  error?: string;
}

/**
 * Perform an x402 request: send once (expect 402), sign, then retry with payment.
 */
export async function payAndFetch(
  url: string,
  init: RequestInit,
  signer: WalletSigner,
): Promise<PaidRequestResult> {
  const first = await fetch(url, init);
  const unpaid = await capture(first);

  if (first.status !== 402) {
    return {
      ok: first.ok,
      unpaid,
      result: safeJson(unpaid.body),
      ...(first.ok ? {} : { error: `Server returned ${first.status}` }),
    };
  }

  const httpClient = createPagePayHttpClient(signer);

  let paymentRequired: PaymentRequired;
  try {
    paymentRequired = httpClient.getPaymentRequiredResponse(
      (name) => unpaid.headers[name.toLowerCase()],
      safeJson(unpaid.body),
    );
  } catch (error) {
    return { ok: false, unpaid, error: `Could not read payment requirements: ${message(error)}` };
  }

  let paymentHeaders: Record<string, string> | null;
  try {
    paymentHeaders = await httpClient.handlePaymentRequired(paymentRequired);
  } catch (error) {
    return { ok: false, unpaid, paymentRequired, error: `Wallet signing failed: ${message(error)}` };
  }
  if (!paymentHeaders) {
    return { ok: false, unpaid, paymentRequired, error: "Payment was cancelled." };
  }

  const retryHeaders = new Headers(init.headers);
  for (const [key, value] of Object.entries(paymentHeaders)) retryHeaders.set(key, value);

  const second = await fetch(url, { ...init, headers: retryHeaders });
  const paid = await capture(second);

  let settlement: SettleResponse | undefined;
  try {
    settlement = httpClient.getPaymentSettleResponse((name) => paid.headers[name.toLowerCase()]);
  } catch {
    settlement = undefined;
  }

  return {
    ok: second.ok,
    unpaid,
    paymentRequired,
    paid,
    ...(settlement ? { settlement } : {}),
    result: safeJson(paid.body),
    ...(second.ok ? {} : { error: `Server returned ${second.status} after payment` }),
  };
}

export function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
