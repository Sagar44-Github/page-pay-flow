/**
 * Structured request log & tamper-evident audit trail for PagePay.
 *
 * Each log entry is cryptographically linked to the previous entry via SHA-256 hash.
 * Modifying or deleting any past entry invalidates the hash chain and is immediately
 * detectable by GET /api/audit/verify.
 */
import { createHash } from "crypto";

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

  /** SHA-256 hash of the previous log entry in the chain. Genesis = 64 zeros. */
  previousEntryHash: string;
  /** SHA-256 hash of this entry's canonical fields + previousEntryHash. */
  entryHash: string;
}

export const GENESIS_PREVIOUS_HASH = "0".repeat(64);

const MAX_ENTRIES = 500;
const entries: PagePayLogEntry[] = [];

/**
 * Deterministic SHA-256 computation over canonical entry fields.
 * Field Order: timestamp|route|pages|price|paymentStatus|outcome|payer|txId|reason|previousEntryHash
 */
export function computeEntryHash(
  entry: Omit<PagePayLogEntry, "entryHash" | "previousEntryHash">,
  previousEntryHash: string,
): string {
  const canonicalString = [
    entry.timestamp ?? "",
    entry.route ?? "",
    String(entry.pages ?? 0),
    entry.price ?? "",
    entry.paymentStatus ?? "",
    entry.outcome ?? "",
    entry.payer ?? "",
    entry.txId ?? "",
    entry.reason ?? "",
    previousEntryHash,
  ].join("|");

  return createHash("sha256").update(canonicalString, "utf8").digest("hex");
}

export function logRequest(
  entry: Omit<PagePayLogEntry, "timestamp" | "previousEntryHash" | "entryHash">,
): PagePayLogEntry {
  const timestamp = new Date().toISOString();
  const previousEntryHash =
    entries.length === 0 ? GENESIS_PREVIOUS_HASH : entries[entries.length - 1].entryHash;

  const baseEntry = { timestamp, ...entry };
  const entryHash = computeEntryHash(baseEntry, previousEntryHash);

  const full: PagePayLogEntry = {
    ...baseEntry,
    previousEntryHash,
    entryHash,
  };

  entries.push(full);
  if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);

  const line = JSON.stringify(full);
  if (full.outcome === "payment_required" || full.outcome === "quoted" || full.outcome === "summarized") {
    console.log(`[pagepay:audit] ${line}`);
  } else {
    console.error(`[pagepay:audit] ${line}`);
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

export interface AuditVerificationResult {
  valid: boolean;
  totalEntries: number;
  brokenAt: number | null;
  verifiedAt: string;
  details?: string;
}

/**
 * Walk the entire log chain from genesis to head and verify hash continuity.
 */
export function verifyAuditChain(): AuditVerificationResult {
  const total = entries.length;
  const verifiedAt = new Date().toISOString();

  if (total === 0) {
    return { valid: true, totalEntries: 0, brokenAt: null, verifiedAt };
  }

  let expectedPreviousHash = GENESIS_PREVIOUS_HASH;

  for (let i = 0; i < total; i++) {
    const current = entries[i];

    // Check 1: Does current.previousEntryHash match expected previous entryHash?
    if (current.previousEntryHash !== expectedPreviousHash) {
      return {
        valid: false,
        totalEntries: total,
        brokenAt: i,
        verifiedAt,
        details: `Entry #${i} previousEntryHash ('${current.previousEntryHash}') does not match expected previous entryHash ('${expectedPreviousHash}').`,
      };
    }

    // Check 2: Does current.entryHash match computed hash of current fields + previousEntryHash?
    const recomputedHash = computeEntryHash(current, current.previousEntryHash);
    if (current.entryHash !== recomputedHash) {
      return {
        valid: false,
        totalEntries: total,
        brokenAt: i,
        verifiedAt,
        details: `Entry #${i} stored entryHash ('${current.entryHash}') does not match recomputed hash ('${recomputedHash}').`,
      };
    }

    expectedPreviousHash = current.entryHash;
  }

  return { valid: true, totalEntries: total, brokenAt: null, verifiedAt };
}

/** Testing helper: Direct access to internal entries array for controlled tampering tests. */
export function _getInternalEntries(): PagePayLogEntry[] {
  return entries;
}
