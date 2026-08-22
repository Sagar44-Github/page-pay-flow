import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import "../_libs/x402-avm__avm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/config.server-DvbyPSmV.js
var config_server_DvbyPSmV_exports = /* @__PURE__ */ __exportAll({
	a: () => formatAtomicAmount,
	c: () => validatePageRange,
	i: () => MAX_UPLOAD_BYTES,
	n: () => getConfig,
	o: () => pagesForText,
	r: () => MAX_TEXT_CHARS,
	s: () => priceForPages,
	t: () => config_server_exports
});
var PRICE_PER_PAGE_USD = .01;
var MAX_TEXT_CHARS = 4e5;
/**
* Validate a caller-supplied page range (1-indexed, inclusive on both ends).
* Returns null if valid, or an error string if invalid.
*/
function validatePageRange(startPage, endPage, totalPages) {
	if (!Number.isFinite(startPage) || !Number.isFinite(endPage)) return "startPage and endPage must be finite numbers.";
	if (startPage < 1) return "startPage must be >= 1.";
	if (endPage < startPage) return "endPage must be >= startPage.";
	if (endPage > totalPages) return `endPage (${endPage}) exceeds the document's ${totalPages} page(s).`;
	return null;
}
/** Page count for a raw text chunk: ceil(words / 500), minimum 1. */
function pagesForText(text) {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 500));
}
/** USD price string in x402 `Money` format, e.g. "$0.03". */
function priceForPages(pages, ratePerPageUsd = PRICE_PER_PAGE_USD) {
	return `$${(pages * ratePerPageUsd).toFixed(2)}`;
}
/** Format an atomic asset amount (base units) for display. */
function formatAtomicAmount(atomic, decimals = 6) {
	const negative = atomic.startsWith("-");
	const digits = (negative ? atomic.slice(1) : atomic).padStart(decimals + 1, "0");
	const whole = digits.slice(0, digits.length - decimals);
	const frac = digits.slice(digits.length - decimals).replace(/0+$/, "");
	return `${negative ? "-" : ""}${whole}${frac ? `.${frac}` : ""}`;
}
/**
* Runtime-editable PagePay / x402 configuration.
*
* Source of truth precedence: in-memory override (set from the /admin panel)
* -> environment variable -> compiled default. The override lives in module
* memory because this app runs on an edge runtime with no database; it takes
* effect immediately for the next /api/price or /api/summarize request, but a
* cold start (new worker isolate / redeploy) falls back to the env values.
*/
var config_server_exports = /* @__PURE__ */ __exportAll$1({
	DEFAULT_FACILITATOR_URL: () => DEFAULT_FACILITATOR_URL,
	getConfig: () => getConfig,
	overriddenKeys: () => overriddenKeys,
	resetConfig: () => resetConfig,
	updateConfig: () => updateConfig,
	validatePatch: () => validatePatch
});
var DEFAULT_FACILITATOR_URL = "https://facilitator.goplausible.xyz";
var overrides = {};
function fromEnv() {
	const envPrice = Number(process.env["PRICE_PER_PAGE_USD"]);
	return {
		payTo: process.env["RESOURCE_PAY_TO"] ?? null,
		pricePerPageUsd: Number.isFinite(envPrice) && envPrice > 0 ? envPrice : PRICE_PER_PAGE_USD,
		facilitatorUrl: process.env["FACILITATOR_URL"] ?? "https://facilitator.goplausible.xyz",
		network: process.env["X402_NETWORK"] ?? "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
	};
}
function getConfig() {
	return {
		...fromEnv(),
		...overrides
	};
}
/** Whether a field is currently overridden at runtime (vs coming from env). */
function overriddenKeys() {
	return Object.keys(overrides);
}
function updateConfig(patch) {
	overrides = {
		...overrides,
		...patch
	};
	return getConfig();
}
function resetConfig() {
	overrides = {};
	return getConfig();
}
var ALGORAND_ADDRESS = /^[A-Z2-7]{58}$/;
/** Validate an incoming patch; returns an error string or null. */
function validatePatch(patch) {
	if (patch.payTo !== void 0) {
		if (!patch.payTo || !ALGORAND_ADDRESS.test(patch.payTo)) return "Pay-to must be a 58-character Algorand address (A-Z and 2-7).";
	}
	if (patch.pricePerPageUsd !== void 0) {
		if (!Number.isFinite(patch.pricePerPageUsd) || patch.pricePerPageUsd <= 0) return "Price per page must be a positive number of USD.";
		if (patch.pricePerPageUsd > 10) return "Price per page above $10 is not allowed.";
	}
	if (patch.facilitatorUrl !== void 0) try {
		if (new URL(patch.facilitatorUrl).protocol !== "https:") return "Facilitator URL must use https.";
	} catch {
		return "Facilitator URL is not a valid URL.";
	}
	if (patch.network !== void 0 && !/^[a-z0-9]+:[A-Za-z0-9._-]+$/.test(patch.network)) return "Network must be a CAIP-2 identifier, e.g. algorand:testnet-v1.0.";
	return null;
}
//#endregion
export { pagesForText as a, getConfig as i, config_server_DvbyPSmV_exports as n, priceForPages as o, formatAtomicAmount as r, validatePageRange as s, MAX_TEXT_CHARS as t };
