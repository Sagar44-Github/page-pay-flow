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
export const TESTNET_DISPENSER_URL = "https://bank.testnet.algorand.network/";

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

/** Machine-readable cause so the UI can show a specific, actionable message. */
export type PaymentFailureCode =
  | "cancelled"
  | "insufficient_funds"
  | "requirements_unreadable"
  | "signing_failed"
  | "verification_failed"
  | "quote_mismatch"
  | "gateway_unavailable"
  | "network"
  | "bad_request"
  | "server_error";

/** Lifecycle stage of the payment, reported live to the UI. */
export type PaymentPhase =
  "quoting" | "awaiting_signature" | "submitted" | "verifying" | "settled" | "failed";

export interface PaidRequestResult {
  ok: boolean;
  unpaid: RawExchange;
  paymentRequired?: PaymentRequired;
  paid?: RawExchange;
  settlement?: SettleResponse;
  /** Headers sent on the paid retry (for curl export). */
  paymentHeaders?: Record<string, string>;
  result?: unknown;
  error?: string;
  failureCode?: PaymentFailureCode;
  /** Pages/price the server quoted in the 402 body, when present. */
  quotedPages?: number;
  quotedPrice?: string;
}

export interface PayAndFetchOptions {
  /** Page count the UI already showed the user; used to detect a quote mismatch. */
  expectedPages?: number;
  onPhase?: (phase: PaymentPhase) => void;
}

interface QuoteFields {
  pagesQuoted?: number;
  priceQuoted?: string;
}

function readQuote(body: unknown): QuoteFields {
  if (!body || typeof body !== "object") return {};
  const record = body as Record<string, unknown>;
  return {
    ...(typeof record["pagesQuoted"] === "number" ? { pagesQuoted: record["pagesQuoted"] } : {}),
    ...(typeof record["priceQuoted"] === "string" ? { priceQuoted: record["priceQuoted"] } : {}),
  };
}

function classifySigningError(raw: string): PaymentFailureCode {
  if (/cancel|reject|declin|denied|closed|abort|dismiss/i.test(raw)) return "cancelled";
  if (/insufficient|balance|underflow|overspend|below min|minimum balance/i.test(raw)) {
    return "insufficient_funds";
  }
  if (/fetch|network|timeout|timed out|econn|offline/i.test(raw)) return "network";
  return "signing_failed";
}

/**
 * Perform an x402 request: send once (expect 402), sign, then retry with payment.
 */
export async function payAndFetch(
  url: string,
  init: RequestInit,
  signer: WalletSigner,
  options: PayAndFetchOptions = {},
): Promise<PaidRequestResult> {
  const phase = options.onPhase ?? (() => {});

  phase("quoting");
  let first: Response;
  try {
    first = await fetch(url, init);
  } catch (error) {
    const raw = message(error);
    console.error("[pagepay] initial fetch failed", raw, error);
    phase("failed");
    return {
      ok: false,
      unpaid: { status: 0, statusText: "Network Error", headers: {}, body: "" },
      error:
        /failed to fetch|network|reset|refused|abort/i.test(raw)
          ? "Could not reach the server. If you're running locally, make sure `npm run dev` is running and open http://localhost:8080 (keep the terminal open)."
          : raw,
      failureCode: "network",
    };
  }
  const unpaid = await capture(first);
  console.log("[pagepay] initial response", unpaid);
  const firstBody = safeJson(unpaid.body);
  const quote = readQuote(firstBody);
  const quoteFields = {
    ...(quote.pagesQuoted !== undefined ? { quotedPages: quote.pagesQuoted } : {}),
    ...(quote.priceQuoted !== undefined ? { quotedPrice: quote.priceQuoted } : {}),
  };

  if (first.status !== 402) {
    if (first.ok) {
      phase("settled");
      return { ok: true, unpaid, result: firstBody, ...quoteFields };
    }
    phase("failed");
    return {
      ok: false,
      unpaid,
      result: firstBody,
      error: `Server returned ${first.status}`,
      failureCode:
        first.status === 400
          ? "bad_request"
          : first.status === 504
            ? "gateway_unavailable"
            : "server_error",
      ...quoteFields,
    };
  }

  const httpClient = createPagePayHttpClient(signer);

  let paymentRequired: PaymentRequired;
  try {
    paymentRequired = httpClient.getPaymentRequiredResponse(
      (name) => unpaid.headers[name.toLowerCase()],
      firstBody,
    );
  } catch (error) {
    phase("failed");
    return {
      ok: false,
      unpaid,
      error: `Could not read payment requirements: ${message(error)}`,
      failureCode: "requirements_unreadable",
      ...quoteFields,
    };
  }

  // The 402 quote is what will actually be charged; flag a drift from what the UI showed.
  if (
    options.expectedPages !== undefined &&
    quote.pagesQuoted !== undefined &&
    quote.pagesQuoted !== options.expectedPages
  ) {
    phase("failed");
    return {
      ok: false,
      unpaid,
      paymentRequired,
      error: `Server quoted ${quote.pagesQuoted} page(s) (${quote.priceQuoted ?? "?"}), but the price shown was for ${options.expectedPages}.`,
      failureCode: "quote_mismatch",
      ...quoteFields,
    };
  }

  phase("awaiting_signature");
  console.log("[pagepay] payment required (402 quote)", JSON.stringify(paymentRequired, null, 2));

  let paymentHeaders: Record<string, string>;
  try {
    const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);
    console.log("[pagepay] payment payload signed", JSON.stringify(paymentPayload, null, 2));
    paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);
    console.log("[pagepay] payment headers for retry", paymentHeaders);
  } catch (error) {
    const raw = message(error);
    console.error("[pagepay] signing failed", raw, error);
    phase("failed");
    return {
      ok: false,
      unpaid,
      paymentRequired,
      error: raw,
      failureCode: classifySigningError(raw),
      ...quoteFields,
    };
  }

  const retryHeaders = new Headers(init.headers);
  for (const [key, value] of Object.entries(paymentHeaders)) retryHeaders.set(key, value);

  phase("submitted");
  let second: Response;
  try {
    second = await fetch(url, { ...init, headers: retryHeaders });
  } catch (error) {
    phase("failed");
    return {
      ok: false,
      unpaid,
      paymentRequired,
      error: message(error),
      failureCode: "network",
      ...quoteFields,
    };
  }
  phase("verifying");
  const paid = await capture(second);
  console.log("[pagepay] paid retry response", paid);
  const paidBody = safeJson(paid.body);

  let settlement: SettleResponse | undefined;
  try {
    settlement = httpClient.getPaymentSettleResponse((name) => paid.headers[name.toLowerCase()]);
  } catch {
    settlement = undefined;
  }

  if (second.ok) {
    phase("settled");
    return {
      ok: true,
      unpaid,
      paymentRequired,
      paid,
      paymentHeaders,
      ...(settlement ? { settlement } : {}),
      result: paidBody,
      ...quoteFields,
    };
  }

  const paidReason =
    paidBody && typeof paidBody === "object"
      ? String((paidBody as Record<string, unknown>)["reason"] ?? "")
      : "";
  const headerReason = readVerifyFailureReason(paid.headers);
  const combinedReason = headerReason || paidReason;
  let failureCode: PaymentFailureCode;
  if (second.status === 504) failureCode = "gateway_unavailable";
  else if (second.status === 400) failureCode = "bad_request";
  else if (second.status === 402) {
    const paidQuote = readQuote(paidBody);
    if (
      paidQuote.pagesQuoted !== undefined &&
      quote.pagesQuoted !== undefined &&
      paidQuote.pagesQuoted !== quote.pagesQuoted
    ) {
      failureCode = "quote_mismatch";
    } else if (/insufficient|balance|underflow|overspend|asset 10458941 missing|missing from/i.test(combinedReason)) {
      failureCode = "insufficient_funds";
    } else {
      failureCode = "verification_failed";
    }
  } else failureCode = "server_error";

  phase("failed");
  return {
    ok: false,
    unpaid,
    paymentRequired,
    paid,
    ...(settlement ? { settlement } : {}),
    result: paidBody,
    error: combinedReason || `Server returned ${second.status} after payment`,
    failureCode,
    ...quoteFields,
  };
}

export function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readVerifyFailureReason(headers: Record<string, string>): string {
  const encoded = headers["payment-required"];
  if (!encoded) return "";
  try {
    const decoded = JSON.parse(atob(encoded)) as { error?: string };
    return decoded.error ?? "";
  } catch {
    return "";
  }
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
