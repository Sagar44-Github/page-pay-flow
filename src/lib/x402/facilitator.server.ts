/**
 * Hosted Algorand x402 facilitator client with a timeout + single retry.
 *
 * Every facilitator call (/supported, /verify, /settle) is wrapped so a slow or
 * unreachable facilitator surfaces as a FacilitatorTimeoutError, which the route
 * turns into a clean 504 instead of hanging.
 */
import { HTTPFacilitatorClient } from "@x402-avm/core/server";
import type { FacilitatorClient } from "@x402-avm/core/server";
import type {
  PaymentPayload,
  PaymentRequirements,
  SettleResponse,
  SupportedResponse,
  VerifyResponse,
} from "@x402-avm/core/types";

import { DEFAULT_FACILITATOR_URL, getConfig } from "@/lib/pagepay/config.server";

/** @deprecated read the runtime value via getConfig().facilitatorUrl */
export const FACILITATOR_URL = DEFAULT_FACILITATOR_URL;
const CALL_TIMEOUT_MS = 15_000;

export class FacilitatorTimeoutError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
  ) {
    super(message);
    this.name = "FacilitatorTimeoutError";
  }
}

async function withTimeout<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(new FacilitatorTimeoutError(operation, `facilitator ${operation} timed out`)),
          CALL_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Run a facilitator call with one retry, then fail with FacilitatorTimeoutError. */
async function withTimeoutAndRetry<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await withTimeout(operation, fn);
  } catch (error) {
    if (!(error instanceof FacilitatorTimeoutError)) throw error;
    console.warn(`[pagepay] facilitator ${operation} timed out — retrying once`);
    try {
      return await withTimeout(operation, fn);
    } catch (retryError) {
      if (retryError instanceof FacilitatorTimeoutError) {
        throw new FacilitatorTimeoutError(
          operation,
          `facilitator ${operation} timed out twice (${getConfig().facilitatorUrl})`,
        );
      }
      throw retryError;
    }
  }
}

/** Facilitator client that wraps the hosted Algorand facilitator with timeout + retry. */
export class ResilientFacilitatorClient implements FacilitatorClient {
  private readonly inner: HTTPFacilitatorClient;

  constructor(url: string = getConfig().facilitatorUrl) {
    this.inner = new HTTPFacilitatorClient({ url });
  }

  verify(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse> {
    return withTimeoutAndRetry("verify", async () => {
      const result = await this.inner.verify(payload, requirements);
      console.log("[pagepay] facilitator verify response", JSON.stringify(result, null, 2));
      return result;
    });
  }

  settle(payload: PaymentPayload, requirements: PaymentRequirements): Promise<SettleResponse> {
    return withTimeoutAndRetry("settle", async () => {
      const result = await this.inner.settle(payload, requirements);
      console.log("[pagepay] facilitator settle response", JSON.stringify(result, null, 2));
      return result;
    });
  }

  getSupported(): Promise<SupportedResponse> {
    return withTimeoutAndRetry("supported", () => this.inner.getSupported());
  }
}
