/**
 * Runtime-editable PagePay / x402 configuration.
 *
 * Source of truth precedence: in-memory override (set from the /admin panel)
 * -> environment variable -> compiled default. The override lives in module
 * memory because this app runs on an edge runtime with no database; it takes
 * effect immediately for the next /api/price or /api/summarize request, but a
 * cold start (new worker isolate / redeploy) falls back to the env values.
 */
import { ALGORAND_TESTNET_CAIP2 } from "@x402-avm/avm";

import { PRICE_PER_PAGE_USD } from "@/lib/pagepay/pricing";

export const DEFAULT_FACILITATOR_URL = "https://facilitator.goplausible.xyz";

export interface PagePayConfig {
  /** Merchant Algorand address receiving each per-page payment. */
  payTo: string | null;
  pricePerPageUsd: number;
  facilitatorUrl: string;
  network: `${string}:${string}`;
}

export type ConfigPatch = Partial<PagePayConfig>;

let overrides: ConfigPatch = {};

function fromEnv(): PagePayConfig {
  const envPrice = Number(process.env["PRICE_PER_PAGE_USD"]);
  return {
    payTo: process.env["RESOURCE_PAY_TO"] ?? null,
    pricePerPageUsd: Number.isFinite(envPrice) && envPrice > 0 ? envPrice : PRICE_PER_PAGE_USD,
    facilitatorUrl: process.env["FACILITATOR_URL"] ?? DEFAULT_FACILITATOR_URL,
    network:
      (process.env["X402_NETWORK"] as `${string}:${string}` | undefined) ?? ALGORAND_TESTNET_CAIP2,
  };
}

export function getConfig(): PagePayConfig {
  return { ...fromEnv(), ...overrides };
}

/** Whether a field is currently overridden at runtime (vs coming from env). */
export function overriddenKeys(): string[] {
  return Object.keys(overrides);
}

export function updateConfig(patch: ConfigPatch): PagePayConfig {
  overrides = { ...overrides, ...patch };
  return getConfig();
}

export function resetConfig(): PagePayConfig {
  overrides = {};
  return getConfig();
}

const ALGORAND_ADDRESS = /^[A-Z2-7]{58}$/;

/** Validate an incoming patch; returns an error string or null. */
export function validatePatch(patch: ConfigPatch): string | null {
  if (patch.payTo !== undefined) {
    if (!patch.payTo || !ALGORAND_ADDRESS.test(patch.payTo)) {
      return "Pay-to must be a 58-character Algorand address (A-Z and 2-7).";
    }
  }
  if (patch.pricePerPageUsd !== undefined) {
    if (!Number.isFinite(patch.pricePerPageUsd) || patch.pricePerPageUsd <= 0) {
      return "Price per page must be a positive number of USD.";
    }
    if (patch.pricePerPageUsd > 10) return "Price per page above $10 is not allowed.";
  }
  if (patch.facilitatorUrl !== undefined) {
    try {
      const url = new URL(patch.facilitatorUrl);
      if (url.protocol !== "https:") return "Facilitator URL must use https.";
    } catch {
      return "Facilitator URL is not a valid URL.";
    }
  }
  if (patch.network !== undefined && !/^[a-z0-9]+:[A-Za-z0-9._-]+$/.test(patch.network as string)) {
    return "Network must be a CAIP-2 identifier, e.g. algorand:testnet-v1.0.";
  }
  return null;
}
