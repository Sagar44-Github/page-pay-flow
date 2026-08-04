/**
 * Structured request log for PagePay.
 *
 * The spec asks for JSON-Lines in `requests.log`. This app runs on an edge runtime
 * with no writable filesystem, so entries are kept in a bounded in-memory ring
 * buffer with the exact same JSON-Lines shape and mirrored to the console. The
 * dashboard reads them from GET /api/logs.
 */

export type PaymentStatus =
  | "none"
  | "required"
  | "verified"
  | "settled"
  | "failed"
  | "gateway_timeout";

export type Outcome =
  | "quoted"
  | "payment_required"
  | "bad_request"
  | "payment_failed"
  | "gateway_error"
  | "summarized"
  | "paid_unfulfilled";

export interface PagePayLogEntry {
  timestamp: string;
  route: string;
  pages: number;
  price: string;
  paymentStatus: PaymentStatus;
  outcome: Outcome;
  payer?: string;
  txId?: string;
  reason?: string;
}

const MAX_ENTRIES = 500;
const entries: PagePayLogEntry[] = [];

export function logRequest(entry: Omit<PagePayLogEntry, "timestamp">): PagePayLogEntry {
  const full: PagePayLogEntry = { timestamp: new Date().toISOString(), ...entry };
  entries.push(full);
  if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);

  const line = JSON.stringify(full);
  // 402-on-first-request is normal protocol traffic, not an error.
  if (full.outcome === "payment_required" || full.outcome === "quoted") {
    console.log(`[pagepay] ${line}`);
  } else if (full.outcome === "summarized") {
    console.log(`[pagepay] ${line}`);
  } else {
    console.error(`[pagepay] ${line}`);
  }
  return full;
}

export function recentLogs(limit = 100): PagePayLogEntry[] {
  return entries.slice(-limit).reverse();
}
