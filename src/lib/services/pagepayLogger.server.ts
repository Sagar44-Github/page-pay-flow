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
 * Real historical settlement transactions on Algorand Testnet.
 * Timestamps extracted directly from confirmed round-times on https://testnet-idx.algonode.cloud.
 */
export const REAL_SEEDED_TRANSACTIONS = [
  {
    txId: "SYPV4SICW6QQC5TAOTEKB4F32FKXL5MAUOKUDTTZ3H76SGKVQNJA",
    route: "POST /api/summarize/range",
    pages: 1,
    price: "$0.01",
    timestamp: "2026-08-22T09:59:13.000Z",
    payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    paymentStatus: "settled" as const,
    outcome: "summarized" as const,
  },
  {
    txId: "6BOK4X2MIWAMSUQEXT3BUAVQKQDDQE4ZLRX372INWURGEP4F2CCQ",
    route: "POST /api/summarize",
    pages: 1,
    price: "$0.01",
    timestamp: "2026-08-22T09:59:21.000Z",
    payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    paymentStatus: "settled" as const,
    outcome: "summarized" as const,
  },
  {
    txId: "KVWISPII3YZPSIAOLBN4QVFHU7YV543EC6VBODJ5SGVC752DXLZA",
    route: "POST /api/summarize",
    pages: 1,
    price: "$0.01",
    timestamp: "2026-08-22T09:59:26.000Z",
    payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    paymentStatus: "settled" as const,
    outcome: "summarized" as const,
  },
  {
    txId: "KR5VKIMATVVKBM3EJEA4ZOCBKLJYOON5FG4VCCXOSTPPQKX4SR6Q",
    route: "POST /api/summarize",
    pages: 1,
    price: "$0.01",
    timestamp: "2026-08-22T09:59:35.000Z",
    payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    paymentStatus: "settled" as const,
    outcome: "summarized" as const,
  },
  {
    txId: "WD4FH3EUMLDU7BXZRRB3K7N7KQUQRN3RBKYRMVJ5J44ROTFVRBKQ",
    route: "POST /api/summarize",
    pages: 1,
    price: "$0.01",
    timestamp: "2026-08-22T10:38:30.000Z",
    payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    paymentStatus: "settled" as const,
    outcome: "summarized" as const,
  },
  {
    txId: "3XARYDAIJC7G53NJ2CXYREU3SIPSSEGF2XL2WVT6MT57VB2JY3DQ",
    route: "POST /api/summarize",
    pages: 1,
    price: "$0.01",
    timestamp: "2026-08-22T10:38:35.000Z",
    payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    paymentStatus: "settled" as const,
    outcome: "summarized" as const,
  },
  {
    txId: "NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA",
    route: "POST /api/compare",
    pages: 2,
    price: "$0.02",
    timestamp: "2026-08-22T10:50:21.000Z",
    payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    paymentStatus: "settled" as const,
    outcome: "summarized" as const,
  },
];

/**
 * Idempotently seed real historical transactions on server startup.
 */
export function seedRealTransactions(): void {
  for (const item of REAL_SEEDED_TRANSACTIONS) {
    if (entries.some((e) => e.txId === item.txId)) {
      continue;
    }
    const previousEntryHash =
      entries.length === 0 ? GENESIS_PREVIOUS_HASH : entries[entries.length - 1].entryHash;

    const baseEntry = { ...item };
    const entryHash = computeEntryHash(baseEntry, previousEntryHash);

    const fullEntry: PagePayLogEntry = {
      ...baseEntry,
      previousEntryHash,
      entryHash,
    };

    entries.push(fullEntry);
  }
}

// Automatically run idempotent seed on module load
seedRealTransactions();

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
  seedRealTransactions();
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
  seedRealTransactions();
  return entries.slice(-limit).reverse();
}

export function findLogByTxId(txId: string): PagePayLogEntry | undefined {
  seedRealTransactions();
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
  seedRealTransactions();
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

export interface ScoreBreakdown {
  txCountPoints: number;
  successRatePoints: number;
  volumeBonusPoints: number;
  formula: string;
  basis: string[];
}

export interface AddressTrustScore {
  address: string;
  trustScore: number;
  totalTransactions: number;
  totalVolumeAtomic: number;
  totalVolumeUsd: string;
  totalAttempts: number;
  successRate: number | null;
  firstSeen: string | null;
  lastSeen: string | null;
  scoreBreakdown: ScoreBreakdown;
}

/**
 * PAGEPAY TRUST SCORE FORMULA (0 - 100):
 *
 * 1. Transaction Volume Weight (Max 40 points):
 *    - 10 points per settled transaction, capped at 40 points (4 settled txs = max 40 pts).
 *
 * 2. Success Rate Weight (Max 40 points):
 *    - (settledTransactions / totalAttempts) * 40 points. (100% success rate = max 40 pts).
 *
 * 3. Monetary Volume Bonus (Max 20 points):
 *    - 50 points per $1.00 USD spent, capped at 20 points ($0.40+ USD spent = max 20 pts).
 *      (e.g., $0.10 spent = 5 bonus points).
 *
 * Formula:
 *   trustScore = Math.min(100, Math.round(txCountPoints + successRatePoints + volumeBonusPoints))
 *
 * Baseline: If totalTransactions === 0, trustScore is 0 (neutral baseline for new addresses).
 */
export function computeTrustScoreForAddress(rawAddress: string): AddressTrustScore {
  seedRealTransactions();
  const address = rawAddress.trim().toUpperCase();
  const addressEntries = entries.filter(
    (e) => e.payer && e.payer.trim().toUpperCase() === address,
  );

  const defaultBreakdown: ScoreBreakdown = {
    txCountPoints: 0,
    successRatePoints: 0,
    volumeBonusPoints: 0,
    formula: "TrustScore = min(100, TxCountPoints[0/40] + SuccessRatePoints[0/40] + VolumeBonusPoints[0/20]) = 0 / 100",
    basis: [
      "Settlement Frequency: 0 settled txs × 10 pts = 0/40 pts",
      "Reliability / Success Rate: 0% × 0.4 = 0/40 pts",
      "Economic Settlement Volume: $0.00 USD × 50 = 0/20 pts",
    ],
  };

  if (addressEntries.length === 0) {
    return {
      address: rawAddress.trim(),
      trustScore: 0,
      totalTransactions: 0,
      totalVolumeAtomic: 0,
      totalVolumeUsd: "$0.00",
      totalAttempts: 0,
      successRate: null,
      firstSeen: null,
      lastSeen: null,
      scoreBreakdown: defaultBreakdown,
    };
  }

  const settled = addressEntries.filter((e) => e.outcome === "summarized" && e.txId);
  const attempts = addressEntries.filter((e) =>
    ["summarized", "payment_failed", "gateway_error", "paid_unfulfilled"].includes(e.outcome),
  );

  let usdcAtomic = 0;
  for (const entry of settled) {
    const match = entry.price.match(/\$([0-9.]+)/);
    if (match?.[1]) usdcAtomic += Math.round(parseFloat(match[1]) * 1_000_000);
  }

  const totalTransactions = settled.length;
  const totalAttempts = attempts.length > 0 ? attempts.length : settled.length;
  const successRateRatio = totalAttempts > 0 ? settled.length / totalAttempts : 0;
  const successRate = totalAttempts > 0 ? Number((successRateRatio * 100).toFixed(1)) : null;

  const sortedTimestamps = addressEntries.map((e) => e.timestamp).sort();
  const firstSeen = sortedTimestamps[0] ?? null;
  const lastSeen = sortedTimestamps[sortedTimestamps.length - 1] ?? null;

  const txCountPoints = Math.min(40, totalTransactions * 10);
  const successRatePoints = Math.round(successRateRatio * 40);
  const usdVolume = usdcAtomic / 1_000_000;
  const volumeBonusPoints = Math.min(20, Math.round(usdVolume * 50));

  const trustScore = totalTransactions > 0 ? Math.min(100, txCountPoints + successRatePoints + volumeBonusPoints) : 0;

  const scoreBreakdown: ScoreBreakdown = {
    txCountPoints,
    successRatePoints,
    volumeBonusPoints,
    formula: `TrustScore = min(100, TxCountPoints[${txCountPoints}/40] + SuccessRatePoints[${successRatePoints}/40] + VolumeBonusPoints[${volumeBonusPoints}/20]) = ${trustScore} / 100`,
    basis: [
      `Settlement Frequency: ${totalTransactions} settled tx(s) × 10 pts = ${txCountPoints}/40 pts`,
      `Reliability / Success Rate: ${successRate ?? 0}% × 0.4 = ${successRatePoints}/40 pts`,
      `Economic Settlement Volume: $${usdVolume.toFixed(2)} USD × 50 = ${volumeBonusPoints}/20 pts`,
    ],
  };

  return {
    address: rawAddress.trim(),
    trustScore,
    totalTransactions,
    totalVolumeAtomic: usdcAtomic,
    totalVolumeUsd: `$${usdVolume.toFixed(2)}`,
    totalAttempts,
    successRate,
    firstSeen,
    lastSeen,
    scoreBreakdown,
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
  seedRealTransactions();
  const total = entries.length;
  const verifiedAt = new Date().toISOString();

  if (total === 0) {
    return { valid: true, totalEntries: 0, brokenAt: null, verifiedAt };
  }

  let expectedPreviousHash = GENESIS_PREVIOUS_HASH;

  for (let i = 0; i < total; i++) {
    const current = entries[i];

    if (current.previousEntryHash !== expectedPreviousHash) {
      return {
        valid: false,
        totalEntries: total,
        brokenAt: i,
        verifiedAt,
        details: `Entry #${i} previousEntryHash ('${current.previousEntryHash}') does not match expected previous entryHash ('${expectedPreviousHash}').`,
      };
    }

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
  seedRealTransactions();
  return entries;
}
