/**
 * x402 route + pricing configuration for PagePay.
 *
 * Algorand testnet only, hosted GoPlausible facilitator, dynamic $0.01-per-page
 * pricing. The 402 response body is produced by the official x402-avm resource
 * server — never hand-rolled here.
 */
import { ALGORAND_TESTNET_CAIP2 } from "@x402-avm/avm";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/server";
import { x402ResourceServer, x402HTTPResourceServer } from "@x402-avm/core/server";
import type { HTTPAdapter, HTTPRequestContext, RoutesConfig } from "@x402-avm/core/http";

import { getConfig } from "@/lib/pagepay/config.server";
import { priceForPages } from "@/lib/pagepay/pricing";
import { ResilientFacilitatorClient } from "./facilitator.server";

export const SUMMARIZE_ROUTE = "POST /api/summarize";
export const RANGE_ROUTE = "POST /api/summarize/range";
export const COMPARE_ROUTE = "POST /api/compare";
/** Compiled default; the live value is getConfig().network. */
export const X402_NETWORK = ALGORAND_TESTNET_CAIP2;

/** Request body shape the pricing function reads. */
export interface PricedBody {
  pageCount?: number;
}

function readPageCount(context: HTTPRequestContext): number {
  const body = context.adapter.getBody?.() as PricedBody | undefined;
  const pages = Number(body?.pageCount ?? 1);
  return Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 1;
}

function readRangePageCount(context: HTTPRequestContext): number {
  const body = context.adapter.getBody?.() as { rangePages?: number } | undefined;
  const pages = Number(body?.rangePages ?? 1);
  return Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 1;
}

function readComparePageCount(context: HTTPRequestContext): number {
  const body = context.adapter.getBody?.() as { comparePages?: number } | undefined;
  const pages = Number(body?.comparePages ?? 2);
  return Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 2;
}

function buildRoutes(): RoutesConfig {
  const network = getConfig().network;
  return {
    [SUMMARIZE_ROUTE]: {
      description: "Pay-per-page AI document summary",
      mimeType: "application/json",
      accepts: {
        scheme: "exact",
        network,
        // Read per request so the merchant address can be rotated without a rebuild.
        payTo: () => {
          const payTo = getConfig().payTo;
          if (!payTo) throw new MissingPayToError();
          return payTo;
        },
        price: (context) => priceForPages(readPageCount(context), getConfig().pricePerPageUsd),
        maxTimeoutSeconds: 120,
      },
      unpaidResponseBody: (context) => {
        const pages = readPageCount(context);
        return {
          contentType: "application/json",
          body: {
            error: "Payment required",
            reason: `This request covers ${pages} page(s) at $0.01 per page. Attach an X-PAYMENT header signed for one of the payment requirements above.`,
            pagesQuoted: pages,
            priceQuoted: priceForPages(pages),
          },
        };
      },
      settlementFailedResponseBody: (context, settleResult) => ({
        contentType: "application/json",
        body: {
          error: "Payment failed",
          reason: settleResult.errorMessage ?? settleResult.errorReason ?? "settlement rejected",
          pagesQuoted: readPageCount(context),
        },
      }),
    },
    [RANGE_ROUTE]: {
      description: "Pay-per-range AI document summary (caller picks page range)",
      mimeType: "application/json",
      accepts: {
        scheme: "exact",
        network,
        payTo: () => {
          const payTo = getConfig().payTo;
          if (!payTo) throw new MissingPayToError();
          return payTo;
        },
        price: (context) => priceForPages(readRangePageCount(context), getConfig().pricePerPageUsd),
        maxTimeoutSeconds: 120,
      },
      unpaidResponseBody: (context) => {
        const pages = readRangePageCount(context);
        return {
          contentType: "application/json",
          body: {
            error: "Payment required",
            reason: `This range covers ${pages} page(s) at $0.01 per page. Attach an X-PAYMENT header signed for one of the payment requirements above.`,
            pagesQuoted: pages,
            priceQuoted: priceForPages(pages),
          },
        };
      },
      settlementFailedResponseBody: (context, settleResult) => ({
        contentType: "application/json",
        body: {
          error: "Payment failed",
          reason: settleResult.errorMessage ?? settleResult.errorReason ?? "settlement rejected",
          pagesQuoted: readRangePageCount(context),
        },
      }),
    },
    [COMPARE_ROUTE]: {
      description: "Pay-per-page AI multi-document comparison (Document A vs Document B)",
      mimeType: "application/json",
      accepts: {
        scheme: "exact",
        network,
        payTo: () => {
          const payTo = getConfig().payTo;
          if (!payTo) throw new MissingPayToError();
          return payTo;
        },
        price: (context) => priceForPages(readComparePageCount(context), getConfig().pricePerPageUsd),
        maxTimeoutSeconds: 120,
      },
      unpaidResponseBody: (context) => {
        const pages = readComparePageCount(context);
        return {
          contentType: "application/json",
          body: {
            error: "Payment required",
            reason: `This comparison covers ${pages} page(s) combined (Document A + Document B) at $0.01 per page. Attach an X-PAYMENT header signed for one of the payment requirements above.`,
            pagesQuoted: pages,
            priceQuoted: priceForPages(pages),
          },
        };
      },
      settlementFailedResponseBody: (context, settleResult) => ({
        contentType: "application/json",
        body: {
          error: "Payment failed",
          reason: settleResult.errorMessage ?? settleResult.errorReason ?? "settlement rejected",
          pagesQuoted: readComparePageCount(context),
        },
      }),
    },
  };
}

export class MissingPayToError extends Error {
  constructor() {
    super("RESOURCE_PAY_TO is not configured — set the merchant Algorand testnet address.");
    this.name = "MissingPayToError";
  }
}

let cached: Promise<x402HTTPResourceServer> | undefined;

/** Lazily build (and cache) the initialized x402 HTTP resource server. */
export function getResourceServer(): Promise<x402HTTPResourceServer> {
  if (!cached) {
    cached = (async () => {
      const config = getConfig();
      const core = new x402ResourceServer(new ResilientFacilitatorClient(config.facilitatorUrl));
      registerExactAvmScheme(core, { networks: [config.network] });
      const httpServer = new x402HTTPResourceServer(core, buildRoutes());
      await httpServer.initialize();
      return httpServer;
    })().catch((error) => {
      cached = undefined; // allow a later request to retry initialization
      throw error;
    });
  }
  return cached;
}

/** Drop the cached resource server so the next request rebuilds it from live config. */
export function resetResourceServer(): void {
  cached = undefined;
}

/** Minimal HTTPAdapter over a fetch Request plus the already-parsed body. */
export function createRequestAdapter(request: Request, body: unknown): HTTPAdapter {
  const url = new URL(request.url);
  return {
    getHeader: (name) => request.headers.get(name) ?? undefined,
    getMethod: () => request.method.toUpperCase(),
    getPath: () => url.pathname,
    getUrl: () => request.url,
    getAcceptHeader: () => request.headers.get("accept") ?? "application/json",
    getUserAgent: () => request.headers.get("user-agent") ?? "",
    getQueryParams: () => Object.fromEntries(url.searchParams.entries()),
    getQueryParam: (name) => url.searchParams.get(name) ?? undefined,
    getBody: () => body,
  };
}

/** Build the x402 request context for a route. */
export function createRequestContext(request: Request, body: unknown): HTTPRequestContext {
  const adapter = createRequestAdapter(request, body);
  const paymentHeader = request.headers.get("x-payment");
  return {
    adapter,
    path: adapter.getPath(),
    method: adapter.getMethod(),
    ...(paymentHeader ? { paymentHeader } : {}),
  };
}
