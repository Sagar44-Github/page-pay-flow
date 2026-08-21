/**
 * Structured request log for PagePay.
 *
 * The spec asks for JSON-Lines in `requests.log`. This app runs on an edge runtime
 * with no writable filesystem, so entries are kept in a bounded in-memory ring
 * buffer with the exact same JSON-Lines shape and mirrored to the console. The
 * dashboard reads them from GET /api/logs.
 */

export type PaymentStatus =
  "none" | "required" | "verified" | "settled" | "failed" | "gateway_timeout";

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

export function findLogByTxId(txId: string): PagePayLogEntry | undefined {
  const normalized = txId.trim().toUpperCase();
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (entry?.txId && entry.txId.toUpperCase() === normalized) return entry;
  }
  return undefined;
}

export interface PagePayMetrics {
  totalTransactions: number;
  usdcVolumeAtomic: number;
  usdcVolumeFormatted: string;
  avgSettlementMs: number | null;
  successRate: number | null;
  recent402Count: number;
  recentSummarizedCount: number;
}

export function computeMetrics(limit = 200): PagePayMetrics {
  const slice = entries.slice(-limit);
  const settled = slice.filter((e) => e.outcome === "summarized" && e.txId);
  const required = slice.filter((e) => e.outcome === "payment_required");
  const attempts = slice.filter((e) =>
    ["summarized", "payment_failed", "gateway_error", "paid_unfulfilled"].includes(e.outcome),
  );

  let usdcAtomic = 0;
  for (const entry of settled) {
    const match = entry.price.match(/\$([0-9.]+)/);
    if (match?.[1]) usdcAtomic += Math.round(parseFloat(match[1]) * 1_000_000);
  }

  const successRate =
    attempts.length > 0 ? Math.round((settled.length / attempts.length) * 100) : null;

  return {
    totalTransactions: settled.length,
    usdcVolumeAtomic: usdcAtomic,
    usdcVolumeFormatted: `$${(usdcAtomic / 1_000_000).toFixed(2)}`,
    avgSettlementMs: null,
    successRate,
    recent402Count: required.length,
    recentSummarizedCount: settled.length,
  };
}
