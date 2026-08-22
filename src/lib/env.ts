/**
 * Shared env access. On Vercel, set variables with a VITE_ prefix so they are
 * available to both server handlers and the browser bundle.
 */
type EnvSource = Record<string, string | boolean | undefined>;

function viteEnv(): EnvSource {
  return (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {}) as EnvSource;
}

function nodeEnv(): EnvSource {
  return typeof process !== "undefined" && process.env ? (process.env as EnvSource) : {};
}

function readRaw(key: string): string | undefined {
  const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
  const sources = [viteEnv(), nodeEnv()];

  for (const source of sources) {
    const direct = source[key];
    if (typeof direct === "string" && direct.length > 0) return direct;

    const prefixed = source[viteKey];
    if (typeof prefixed === "string" && prefixed.length > 0) return prefixed;
  }

  return undefined;
}

export function env(key: string, fallback = ""): string {
  return readRaw(key) ?? fallback;
}

export function envOptional(key: string): string | undefined {
  return readRaw(key);
}

export function envNumber(key: string, fallback: number): number {
  const raw = readRaw(key);
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

/** Values safe to embed in client bundles (user requested frontend exposure). */
export const publicEnv = {
  groqApiKey: () => env("GROQ_API_KEY"),
  lovableApiKey: () => env("LOVABLE_API_KEY"),
  resourcePayTo: () => env("RESOURCE_PAY_TO"),
  pricePerPageUsd: () => envNumber("PRICE_PER_PAGE_USD", 0.01),
  facilitatorUrl: () => env("FACILITATOR_URL", "https://facilitator.goplausible.xyz"),
  x402Network: () => env("X402_NETWORK", "algorand:testnet-v1.0"),
  sessionSecret: () => env("SESSION_SECRET"),
  adminPassword: () => env("ADMIN_PASSWORD"),
} as const;
