import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as registerExactAvmScheme } from "../_libs/x402-avm__avm.mjs";
import { i as getConfig, o as priceForPages } from "./config.server-DvbyPSmV.mjs";
import { a as x402HTTPResourceServer, r as HTTPFacilitatorClient, t as x402ResourceServer } from "../_libs/x402-avm__core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routeConfig.server-ccOnqFvm.js
var routeConfig_server_ccOnqFvm_exports = /* @__PURE__ */ __exportAll({
	a: () => createRequestContext,
	c: () => FacilitatorTimeoutError,
	i: () => SUMMARIZE_ROUTE,
	n: () => MissingPayToError,
	o: () => getResourceServer,
	r: () => RANGE_ROUTE,
	s: () => routeConfig_server_exports,
	t: () => COMPARE_ROUTE
});
/**
* Hosted Algorand x402 facilitator client with a timeout + single retry.
*
* Every facilitator call (/supported, /verify, /settle) is wrapped so a slow or
* unreachable facilitator surfaces as a FacilitatorTimeoutError, which the route
* turns into a clean 504 instead of hanging.
*/
var CALL_TIMEOUT_MS = 15e3;
var FacilitatorTimeoutError = class extends Error {
	operation;
	constructor(operation, message) {
		super(message);
		this.operation = operation;
		this.name = "FacilitatorTimeoutError";
	}
};
async function withTimeout(operation, fn) {
	let timer;
	try {
		return await Promise.race([fn(), new Promise((_, reject) => {
			timer = setTimeout(() => reject(new FacilitatorTimeoutError(operation, `facilitator ${operation} timed out`)), CALL_TIMEOUT_MS);
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
/** Run a facilitator call with one retry, then fail with FacilitatorTimeoutError. */
async function withTimeoutAndRetry(operation, fn) {
	try {
		return await withTimeout(operation, fn);
	} catch (error) {
		if (!(error instanceof FacilitatorTimeoutError)) throw error;
		console.warn(`[pagepay] facilitator ${operation} timed out — retrying once`);
		try {
			return await withTimeout(operation, fn);
		} catch (retryError) {
			if (retryError instanceof FacilitatorTimeoutError) throw new FacilitatorTimeoutError(operation, `facilitator ${operation} timed out twice (${getConfig().facilitatorUrl})`);
			throw retryError;
		}
	}
}
/** Facilitator client that wraps the hosted Algorand facilitator with timeout + retry. */
var ResilientFacilitatorClient = class {
	inner;
	constructor(url = getConfig().facilitatorUrl) {
		this.inner = new HTTPFacilitatorClient({ url });
	}
	verify(payload, requirements) {
		return withTimeoutAndRetry("verify", async () => {
			const result = await this.inner.verify(payload, requirements);
			console.log("[pagepay] facilitator verify response", JSON.stringify(result, null, 2));
			return result;
		});
	}
	settle(payload, requirements) {
		return withTimeoutAndRetry("settle", async () => {
			const result = await this.inner.settle(payload, requirements);
			console.log("[pagepay] facilitator settle response", JSON.stringify(result, null, 2));
			return result;
		});
	}
	getSupported() {
		return withTimeoutAndRetry("supported", () => this.inner.getSupported());
	}
};
var routeConfig_server_exports = /* @__PURE__ */ __exportAll$1({
	COMPARE_ROUTE: () => COMPARE_ROUTE,
	MissingPayToError: () => MissingPayToError,
	RANGE_ROUTE: () => RANGE_ROUTE,
	SUMMARIZE_ROUTE: () => SUMMARIZE_ROUTE,
	createRequestAdapter: () => createRequestAdapter,
	createRequestContext: () => createRequestContext,
	getResourceServer: () => getResourceServer,
	resetResourceServer: () => resetResourceServer
});
var SUMMARIZE_ROUTE = "POST /api/summarize";
var RANGE_ROUTE = "POST /api/summarize/range";
var COMPARE_ROUTE = "POST /api/compare";
function readPageCount(context) {
	const body = context.adapter.getBody?.();
	const pages = Number(body?.pageCount ?? 1);
	return Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 1;
}
function readRangePageCount(context) {
	const body = context.adapter.getBody?.();
	const pages = Number(body?.rangePages ?? 1);
	return Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 1;
}
function readComparePageCount(context) {
	const body = context.adapter.getBody?.();
	const pages = Number(body?.comparePages ?? 2);
	return Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 2;
}
function buildRoutes() {
	const network = getConfig().network;
	return {
		[SUMMARIZE_ROUTE]: {
			description: "Pay-per-page AI document summary",
			mimeType: "application/json",
			accepts: {
				scheme: "exact",
				network,
				payTo: () => {
					const payTo = getConfig().payTo;
					if (!payTo) throw new MissingPayToError();
					return payTo;
				},
				price: (context) => priceForPages(readPageCount(context), getConfig().pricePerPageUsd),
				maxTimeoutSeconds: 120
			},
			unpaidResponseBody: (context) => {
				const pages = readPageCount(context);
				return {
					contentType: "application/json",
					body: {
						error: "Payment required",
						reason: `This request covers ${pages} page(s) at $0.01 per page. Attach an X-PAYMENT header signed for one of the payment requirements above.`,
						pagesQuoted: pages,
						priceQuoted: priceForPages(pages)
					}
				};
			},
			settlementFailedResponseBody: (context, settleResult) => ({
				contentType: "application/json",
				body: {
					error: "Payment failed",
					reason: settleResult.errorMessage ?? settleResult.errorReason ?? "settlement rejected",
					pagesQuoted: readPageCount(context)
				}
			})
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
				maxTimeoutSeconds: 120
			},
			unpaidResponseBody: (context) => {
				const pages = readRangePageCount(context);
				return {
					contentType: "application/json",
					body: {
						error: "Payment required",
						reason: `This range covers ${pages} page(s) at $0.01 per page. Attach an X-PAYMENT header signed for one of the payment requirements above.`,
						pagesQuoted: pages,
						priceQuoted: priceForPages(pages)
					}
				};
			},
			settlementFailedResponseBody: (context, settleResult) => ({
				contentType: "application/json",
				body: {
					error: "Payment failed",
					reason: settleResult.errorMessage ?? settleResult.errorReason ?? "settlement rejected",
					pagesQuoted: readRangePageCount(context)
				}
			})
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
				maxTimeoutSeconds: 120
			},
			unpaidResponseBody: (context) => {
				const pages = readComparePageCount(context);
				return {
					contentType: "application/json",
					body: {
						error: "Payment required",
						reason: `This comparison covers ${pages} page(s) combined (Document A + Document B) at $0.01 per page. Attach an X-PAYMENT header signed for one of the payment requirements above.`,
						pagesQuoted: pages,
						priceQuoted: priceForPages(pages)
					}
				};
			},
			settlementFailedResponseBody: (context, settleResult) => ({
				contentType: "application/json",
				body: {
					error: "Payment failed",
					reason: settleResult.errorMessage ?? settleResult.errorReason ?? "settlement rejected",
					pagesQuoted: readComparePageCount(context)
				}
			})
		}
	};
}
var MissingPayToError = class extends Error {
	constructor() {
		super("RESOURCE_PAY_TO is not configured — set the merchant Algorand testnet address.");
		this.name = "MissingPayToError";
	}
};
var cached;
/** Lazily build (and cache) the initialized x402 HTTP resource server. */
function getResourceServer() {
	if (!cached) cached = (async () => {
		const config = getConfig();
		const core = new x402ResourceServer(new ResilientFacilitatorClient(config.facilitatorUrl));
		registerExactAvmScheme(core, { networks: [config.network] });
		const httpServer = new x402HTTPResourceServer(core, buildRoutes());
		await httpServer.initialize();
		return httpServer;
	})().catch((error) => {
		cached = void 0;
		throw error;
	});
	return cached;
}
/** Drop the cached resource server so the next request rebuilds it from live config. */
function resetResourceServer() {
	cached = void 0;
}
/** Minimal HTTPAdapter over a fetch Request plus the already-parsed body. */
function createRequestAdapter(request, body) {
	const url = new URL(request.url);
	return {
		getHeader: (name) => request.headers.get(name) ?? void 0,
		getMethod: () => request.method.toUpperCase(),
		getPath: () => url.pathname,
		getUrl: () => request.url,
		getAcceptHeader: () => request.headers.get("accept") ?? "application/json",
		getUserAgent: () => request.headers.get("user-agent") ?? "",
		getQueryParams: () => Object.fromEntries(url.searchParams.entries()),
		getQueryParam: (name) => url.searchParams.get(name) ?? void 0,
		getBody: () => body
	};
}
/** Build the x402 request context for a route. */
function createRequestContext(request, body) {
	const adapter = createRequestAdapter(request, body);
	const paymentHeader = request.headers.get("x-payment");
	return {
		adapter,
		path: adapter.getPath(),
		method: adapter.getMethod(),
		...paymentHeader ? { paymentHeader } : {}
	};
}
//#endregion
export { SUMMARIZE_ROUTE as a, routeConfig_server_ccOnqFvm_exports as c, RANGE_ROUTE as i, FacilitatorTimeoutError as n, createRequestContext as o, MissingPayToError as r, getResourceServer as s, COMPARE_ROUTE as t };
