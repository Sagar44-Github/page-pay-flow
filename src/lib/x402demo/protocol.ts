/**
 * Shared (client + server) contract for the x402 protocol demo.
 * Pure types + helpers, safe to import from the browser.
 */

export const DEMO_MODES = ["happy", "failed", "timeout", "invalid"] as const;
export type DemoMode = (typeof DEMO_MODES)[number];

export const DEMO_MODE_LABELS: Record<DemoMode, string> = {
  happy: "Happy path",
  failed: "Failed payment",
  timeout: "Payment timeout",
  invalid: "Invalid token",
};

export const DEMO_MODE_DESCRIPTIONS: Record<DemoMode, string> = {
  happy: "Payment is authorized and settled; the gated Groq resource unlocks.",
  failed: "The facilitator rejects settlement — the resource stays locked and retry is offered.",
  timeout: "The payment never settles in time; the server answers 504 Gateway Timeout.",
  invalid: "A malformed X-Payment token is rejected with 400 before any settlement.",
};

/** Payment requirements returned in the 402 body (x402-shaped). */
export interface DemoPaymentRequirements {
  x402Version: number;
  accepts: {
    scheme: "exact";
    network: string;
    resource: string;
    description: string;
    mimeType: "application/json";
    payTo: string;
    asset: string;
    amount: string;
    amountFormatted: string;
    maxTimeoutSeconds: number;
    extra?: {
      name: string;
      decimals: number;
      model?: string;
      modelLabel?: string;
    };
  }[];
  error: string;
  reason: string;
}

export interface DemoPaymentPayload {
  x402Version: number;
  scheme: "exact";
  network: string;
  payload: {
    from: string;
    to: string;
    asset: string;
    amount: string;
    nonce: string;
    validUntil: number;
    signature: string;
  };
}

export interface DemoUnlockedResource {
  unlocked: true;
  mode: DemoMode;
  content: string;
  model: string;
  latencyMs: number;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  settlement: { success: boolean; network: string; transaction: string; payer: string };
  serverLog: DemoServerLogEntry[];
}

export interface DemoServerLogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  detail?: string;
}

export interface DemoErrorBody {
  error: string;
  reason: string;
  mode?: DemoMode;
  serverLog?: DemoServerLogEntry[];
}

/** Encode a mock payment payload the way an x402 client would: base64 JSON. */
export function encodePaymentHeader(payload: DemoPaymentPayload): string {
  const json = JSON.stringify(payload);
  if (typeof btoa === "function") return btoa(json);
  return Buffer.from(json, "utf8").toString("base64");
}

export function decodePaymentHeader(header: string): DemoPaymentPayload {
  const json =
    typeof atob === "function" ? atob(header) : Buffer.from(header, "base64").toString("utf8");
  return JSON.parse(json) as DemoPaymentPayload;
}

export function randomNonce(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function mockSignature(nonce: string): string {
  return `mock-ed25519:${nonce.slice(0, 8)}${nonce.slice(-8)}`;
}
