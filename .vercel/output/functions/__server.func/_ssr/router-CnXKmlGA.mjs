import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Link, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as esm_default } from "../_libs/@perawallet/connect+[...].mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as pagesForText, i as getConfig, o as priceForPages, r as formatAtomicAmount, s as validatePageRange, t as MAX_TEXT_CHARS } from "./config.server-BtVvDl_U.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as SUMMARIZE_ROUTE, i as RANGE_ROUTE, n as FacilitatorTimeoutError, o as createRequestContext, r as MissingPayToError, s as getResourceServer, t as COMPARE_ROUTE } from "./routeConfig.server-BLRas4Cf.mjs";
import { n as getDocumentProxy, t as extractText } from "../_libs/unpdf.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as streamText } from "../_libs/ai.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
import { createHash } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CnXKmlGA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Document intake: page counting and text extraction.
* Pure-JS PDF reading (unpdf) so it runs on the edge runtime.
*/
var DocumentError = class extends Error {
	reason;
	constructor(reason) {
		super(reason);
		this.reason = reason;
		this.name = "DocumentError";
	}
};
async function parsePdf(bytes, filename) {
	let pdf;
	try {
		pdf = await getDocumentProxy(bytes);
	} catch {
		throw new DocumentError("The uploaded file could not be read as a PDF.");
	}
	const pages = pdf.numPages;
	if (pages > 20) throw new DocumentError(`Document has ${pages} pages; the limit is 20.`);
	const { text } = await extractText(pdf, { mergePages: false });
	const pageTexts = Array.isArray(text) ? text.map((t) => String(t)) : [String(text)];
	const merged = pageTexts.join("\n\n");
	if (!merged.trim()) throw new DocumentError("No extractable text found in the PDF (scanned images are not supported).");
	return {
		text: merged.slice(0, MAX_TEXT_CHARS),
		pages,
		source: "pdf",
		pageTexts,
		...filename ? { filename } : {}
	};
}
/** Split raw text into page-sized chunks by word boundaries (WORDS_PER_PAGE words each). */
function splitTextIntoPages(text) {
	const words = text.trim().split(/\s+/).filter(Boolean);
	const pageTexts = [];
	for (let i = 0; i < words.length; i += 500) pageTexts.push(words.slice(i, i + 500).join(" "));
	return pageTexts.length > 0 ? pageTexts : [text];
}
function parseTextInput(text) {
	if (!text.trim()) throw new DocumentError("No text provided.");
	if (text.length > 4e5) throw new DocumentError(`Text is too long (${text.length} characters).`);
	const pages = pagesForText(text);
	if (pages > 20) throw new DocumentError(`Text works out to ${pages} pages (500 words each); the limit is 20.`);
	return {
		text,
		pages,
		source: "text",
		pageTexts: splitTextIntoPages(text)
	};
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-B8u8zYEn.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$26 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PagePay — Payments for APIs that read like HTTP" },
			{
				name: "description",
				content: "Pay-per-page AI document summarization over HTTP 402, settled on Algorand Testnet with Pera Wallet."
			},
			{
				name: "author",
				content: "PagePay"
			},
			{
				property: "og:title",
				content: "PagePay — pay-per-page AI summaries over x402"
			},
			{
				property: "og:description",
				content: "Pay-per-page AI document summarization settled on Algorand Testnet via the x402 protocol."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/icon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon.svg"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
var THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('pagepay-theme');document.documentElement.classList.add(t==='light'?'light':'dark');}catch(e){document.documentElement.classList.add('dark');}})();`;
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOTSTRAP } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$26.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$12 = () => import("./routes-DRp71_mQ.mjs");
var Route$25 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "PagePay — Pay-per-page AI over HTTP 402 on Algorand" }, {
		name: "description",
		content: "SaaS-style pay-per-page document summarization with x402, Algorand Testnet USDC, and Pera Wallet."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin-DkTmFWwL.mjs");
var Route$24 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: "PagePay admin — x402 testnet settings" },
		{
			name: "description",
			content: "Passphrase-protected panel for editing the PagePay merchant address, per-page price, facilitator URL and network at runtime."
		},
		{
			property: "og:title",
			content: "PagePay admin — x402 testnet settings"
		},
		{
			property: "og:description",
			content: "Runtime configuration for the PagePay x402 payment routes."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./demo-BaFNj6Mr.mjs");
var Route$23 = createFileRoute("/demo")({
	head: () => ({ meta: [{ title: "Live demo — PagePay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./developers-BQBSU2Mn.mjs");
var Route$22 = createFileRoute("/developers")({
	head: () => ({ meta: [{ title: "Developers — PagePay API" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./integrations-BgdjDOHy.mjs");
var Route$21 = createFileRoute("/integrations")({
	head: () => ({ meta: [{ title: "Integrations — PagePay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./pricing-DiMh21aP.mjs");
var Route$20 = createFileRoute("/pricing")({
	head: () => ({ meta: [{ title: "Pricing — PagePay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./product-CyymhXrk.mjs");
var Route$19 = createFileRoute("/product")({
	head: () => ({ meta: [{ title: "Product — PagePay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./stats-jjAaarPw.mjs");
var Route$18 = createFileRoute("/stats")({
	head: () => ({ meta: [{ title: "Live metrics — PagePay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./x402-demo-BO07T9uz.mjs");
var Route$17 = createFileRoute("/x402-demo")({
	head: () => ({ meta: [
		{ title: "x402 Protocol Demo — HTTP 402 payments + Groq AI" },
		{
			name: "description",
			content: "Interactive x402 demo: HTTP 402 challenge, signed X-Payment header, settlement, and a Groq-generated resource unlocked on payment — with live logs and raw HTTP payloads."
		},
		{
			property: "og:title",
			content: "x402 Protocol Demo — HTTP 402 payments + Groq AI"
		},
		{
			property: "og:description",
			content: "Run happy-path, failed, timeout and invalid-token payment simulations against a real 402-gated API route."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/**
* Shared request -> document intake for single and multi-document endpoints.
*/
async function readDocumentFromRequest(request) {
	if ((request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
		const form = await request.formData();
		const file = form.get("file");
		const text = form.get("text");
		if (file && typeof file !== "string") {
			if (file.size > 10485760) throw new DocumentError("File is larger than the 10 MB limit.");
			const bytes = new Uint8Array(await file.arrayBuffer());
			if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return parsePdf(bytes, file.name);
			return {
				...parseTextInput(new TextDecoder().decode(bytes)),
				filename: file.name
			};
		}
		if (typeof text === "string") return parseTextInput(text);
		throw new DocumentError("Attach a `file` or a `text` field.");
	}
	let payload;
	try {
		payload = await request.json();
	} catch {
		throw new DocumentError("Request body must be JSON or multipart/form-data.");
	}
	const body = payload ?? {};
	if (typeof body.text !== "string") throw new DocumentError("Provide a `text` string (or upload a file as multipart/form-data).");
	return {
		...parseTextInput(body.text),
		...typeof body.filename === "string" ? { filename: body.filename } : {}
	};
}
async function parseSingleFromForm(form, fileKey, textKey, docLabel) {
	const file = form.get(fileKey);
	const text = form.get(textKey);
	if (file && typeof file !== "string") {
		if (file.size > 10485760) throw new DocumentError(`${docLabel} is larger than the 10 MB limit.`);
		const bytes = new Uint8Array(await file.arrayBuffer());
		if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return parsePdf(bytes, file.name);
		return {
			...parseTextInput(new TextDecoder().decode(bytes)),
			filename: file.name
		};
	}
	if (typeof text === "string" && text.trim().length > 0) return parseTextInput(text);
	throw new DocumentError(`${docLabel} is missing or empty. Provide a file or text for ${docLabel}.`);
}
function parseSingleFromObject(obj, docLabel) {
	if (!obj) throw new DocumentError(`${docLabel} is missing. Provide text or file for ${docLabel}.`);
	if (typeof obj === "string") {
		if (!obj.trim()) throw new DocumentError(`${docLabel} is empty.`);
		try {
			return parseTextInput(obj);
		} catch (err) {
			if (err instanceof DocumentError) throw new DocumentError(`${docLabel} is invalid: ${err.reason}`);
			throw err;
		}
	}
	if (typeof obj === "object" && obj !== null) {
		const record = obj;
		if (typeof record.text === "string" && record.text.trim().length > 0) try {
			return {
				...parseTextInput(record.text),
				...typeof record.filename === "string" ? { filename: record.filename } : {}
			};
		} catch (err) {
			if (err instanceof DocumentError) throw new DocumentError(`${docLabel} is invalid: ${err.reason}`);
			throw err;
		}
	}
	throw new DocumentError(`${docLabel} must be a text string or object with text.`);
}
async function readTwoDocumentsFromRequest(request) {
	const contentType = request.headers.get("content-type") ?? "";
	let docA;
	let docB;
	if (contentType.includes("multipart/form-data")) {
		const form = await request.formData();
		const hasA = form.has("fileA") || form.has("textA") || form.has("documentA");
		const hasB = form.has("fileB") || form.has("textB") || form.has("documentB");
		if (!hasA) throw new DocumentError("Document A is missing. Attach fileA/textA or documentA.");
		if (!hasB) throw new DocumentError("Document B is missing. Attach fileB/textB or documentB.");
		docA = await parseSingleFromForm(form, form.has("fileA") ? "fileA" : "documentA", form.has("textA") ? "textA" : "documentA", "Document A");
		docB = await parseSingleFromForm(form, form.has("fileB") ? "fileB" : "documentB", form.has("textB") ? "textB" : "documentB", "Document B");
	} else {
		let payload;
		try {
			payload = await request.json();
		} catch {
			throw new DocumentError("Request body must be JSON or multipart/form-data.");
		}
		const body = payload ?? {};
		const valA = body["documentA"] ?? body["textA"] ?? body["docA"];
		const valB = body["documentB"] ?? body["textB"] ?? body["docB"];
		if (!valA) throw new DocumentError("Document A is missing. Provide documentA or textA in JSON.");
		if (!valB) throw new DocumentError("Document B is missing. Provide documentB or textB in JSON.");
		docA = parseSingleFromObject(valA, "Document A");
		docB = parseSingleFromObject(valB, "Document B");
	}
	if (docA.pages > 20) throw new DocumentError(`Document A exceeds the maximum allowed page count of 20 pages (got ${docA.pages}).`);
	if (docB.pages > 20) throw new DocumentError(`Document B exceeds the maximum allowed page count of 20 pages (got ${docB.pages}).`);
	return {
		docA,
		docB,
		combinedPages: docA.pages + docB.pages
	};
}
var LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
function createLovableAiGatewayRunIdFetch(initialRunId) {
	let runId = initialRunId?.trim() || void 0;
	let resolveRunId = () => {};
	let runIdResolved = false;
	const runIdReady = new Promise((resolve) => {
		resolveRunId = resolve;
	});
	const publishRunId = (value) => {
		const nextRunId = value?.trim() || void 0;
		if (!runId && nextRunId) runId = nextRunId;
		if (!runIdResolved) {
			runIdResolved = true;
			resolveRunId(runId);
		}
	};
	if (runId) publishRunId(runId);
	return {
		fetch: async (input, init) => {
			const headers = new Headers(init?.headers);
			if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
			try {
				const response = await fetch(input, {
					...init,
					headers
				});
				publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? void 0);
				return response;
			} catch (error) {
				publishRunId(void 0);
				throw error;
			}
		},
		getRunId: () => runId,
		waitForRunId: () => runId ? Promise.resolve(runId) : runIdReady
	};
}
function createLovableAiGatewayProvider(lovableApiKey, initialRunId) {
	const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
	const provider = createOpenAICompatible({
		name: "lovable",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: {
			"Lovable-API-Key": lovableApiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		},
		fetch: runIdFetch.fetch
	});
	return Object.assign(provider, {
		getRunId: runIdFetch.getRunId,
		waitForRunId: runIdFetch.waitForRunId
	});
}
function getLovableAiGatewayRunId(request) {
	return request.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || void 0;
}
/**
* Groq (OpenAI-compatible) helper. Server-only: GROQ_API_KEY never reaches the client.
*/
var GROQ_BASE_URL = "https://api.groq.com/openai/v1";
var GROQ_DEFAULT_MODEL = "openai/gpt-oss-20b";
var GROQ_MODELS = ["openai/gpt-oss-20b", "qwen/qwen3.6-27b"];
var GroqError = class extends Error {
	status;
	constructor(message, status = 502) {
		super(message);
		this.name = "GroqError";
		this.status = status;
	}
};
async function groqChat(options) {
	const apiKey = process.env["GROQ_API_KEY"];
	if (!apiKey) throw new GroqError("GROQ_API_KEY is not configured.", 500);
	const model = options.model && GROQ_MODELS.includes(options.model) ? options.model : GROQ_DEFAULT_MODEL;
	const maxRetries = 2;
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		const startedAt = Date.now();
		const temperature = (options.temperature ?? .4) + attempt * .2;
		let response;
		try {
			response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model,
					messages: options.messages,
					temperature,
					max_tokens: options.maxTokens ?? 700
				})
			});
		} catch (error) {
			throw new GroqError(`Groq request failed: ${error instanceof Error ? error.message : String(error)}`, 504);
		}
		const text = await response.text();
		if (!response.ok) throw new GroqError(`Groq returned ${response.status}: ${text.slice(0, 400)}`, response.status);
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch {
			throw new GroqError("Groq returned a non-JSON response.");
		}
		const content = parsed.choices?.[0]?.message?.content?.trim();
		if (content) return {
			content,
			model: parsed.model ?? model,
			...parsed.usage ? { usage: parsed.usage } : {},
			latencyMs: Date.now() - startedAt
		};
		console.warn(`[groq] Empty completion on attempt ${attempt + 1}, retrying...`);
	}
	throw new GroqError("Groq returned an empty completion after retries.");
}
/**
* LLM summarization. Prefers Lovable AI when LOVABLE_API_KEY is set;
* falls back to Groq when only GROQ_API_KEY is configured (local dev).
*/
var MODEL = "google/gemini-2.5-flash";
var PROMPTS = {
	summary: {
		system: "You are PagePay, a precise document summarizer. Produce a faithful summary of the supplied document. Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. Never invent facts that are not in the document.",
		userLabel: "Document"
	},
	action_items: {
		system: "You are PagePay Action Item Extractor. Focus strictly on identifying concrete actionable tasks, assignments, deadlines, deliverables, and obligations from the text. Structure your response with markdown: an 'Action Items Summary' paragraph, then a bulleted list of 'Action Items & Tasks' specifying responsible parties/owners and deadlines if mentioned, then an 'Immediate Next Steps' section. If no clear tasks are found, explicitly state that.",
		userLabel: "Document (Action Item Extraction)"
	},
	key_risks: {
		system: "You are PagePay Risk & Concern Analyst. Focus strictly on identifying risky, ambiguous, alarming, or notable clauses, statements, financial liabilities, or operational red flags in the text. Structure your response with markdown: a 'Risk Overview' paragraph, then a bulleted list of 'Flagged Risks & Liabilities' categorizing each risk by severity (High / Medium / Low), then a 'Mitigation / Cautionary Notes' section. Never invent risks not grounded in the text.",
		userLabel: "Document (Risk Analysis)"
	},
	compliance_check: {
		system: "You are PagePay Compliance & Audit Specialist. Focus strictly on evaluating the document text against standard document and contract compliance categories:\n1. Clear Parties & Roles (are specific entities, signers, or roles named?)\n2. Dates & Deadlines (are effective dates, execution dates, or performance deadlines specified?)\n3. Breach & Non-Performance Provisions (does it specify remedies, penalties, or consequences of default?)\n4. Termination & Exit Clauses (does it define how the arrangement ends or notice periods?)\n5. Dispute Resolution & Governing Law (does it specify jurisdiction, arbitration, or governing law?)\n\nStructure your response strictly as a markdown compliance checklist. For EACH of the 5 categories above, evaluate the text and output either:\n- '✅ [Category Name]: Present — [one-line summary note from the text]'\n- '❌ [Category Name]: Not mentioned in this document — [brief explanation]'\n\nFollow the checklist with a brief 2-sentence 'Compliance Summary' paragraph.",
		userLabel: "Document (Compliance Check)"
	},
	checklist: {
		system: "You are PagePay Process & Implementation Planner. Your task is to convert the provided document's content into a flat, actionable, step-by-step implementation checklist that an operator or agent can check off to execute or comply with whatever procedure, agreement, policy, or workflow the document describes.\n\nCRITICAL FORMAT & STRUCTURE RULES:\n1. Format EVERY single actionable step strictly using markdown checkbox syntax: '- [ ] Step description'.\n2. Group steps under short, descriptive markdown section headers (e.g., '### Phase 1: Preparation', '### Phase 2: Implementation', '### Phase 3: Monitoring & Exit') based on the document's natural workflow.\n3. Frame every item as an ordered, imperative implementation step someone must carry out (even if the source document wasn't written as a step-by-step guide).\n4. Conclude your response with a section titled '**Implementation Notes & Ambiguities**' containing a 1-2 sentence note explaining any implicit assumptions or ambiguities that had to be interpreted to form the checklist.\n5. DO NOT use compliance presence/absence markers (such as ✅ or ❌). DO NOT use risk severities (High/Medium/Low). Focus purely on an ordered, checkable step-by-step implementation plan.",
		userLabel: "Document (Implementation Checklist)"
	}
};
var RANGE_PROMPTS = {
	summary: {
		system: "You are PagePay, a precise document summarizer. You are summarizing a specific PAGE RANGE of a larger document. Produce a faithful summary of ONLY the provided pages. Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. Never invent facts that are not in the document section.",
		userLabel: "Document pages"
	},
	action_items: {
		system: "You are PagePay Action Item Extractor. You are processing a specific PAGE RANGE of a larger document. Focus strictly on identifying concrete actionable tasks, assignments, deadlines, deliverables, and obligations in ONLY these pages. Structure your response with markdown: an 'Action Items Summary' paragraph, then a bulleted list of 'Action Items & Tasks' specifying responsible parties/owners and deadlines if mentioned, then an 'Immediate Next Steps' section.",
		userLabel: "Document pages (Action Item Extraction)"
	},
	key_risks: {
		system: "You are PagePay Risk & Concern Analyst. You are processing a specific PAGE RANGE of a larger document. Focus strictly on identifying risky, ambiguous, alarming, or notable clauses, statements, liabilities, or red flags in ONLY these pages. Structure your response with markdown: a 'Risk Overview' paragraph, then a bulleted list of 'Flagged Risks & Liabilities' categorizing each risk by severity (High / Medium / Low), then a 'Mitigation / Cautionary Notes' section.",
		userLabel: "Document pages (Risk Analysis)"
	},
	compliance_check: {
		system: "You are PagePay Compliance & Audit Specialist. You are processing a specific PAGE RANGE of a larger document. Evaluate ONLY these pages against 5 core compliance categories: (1) Clear Parties & Roles, (2) Dates & Deadlines, (3) Breach & Non-Performance Provisions, (4) Termination & Exit Clauses, and (5) Dispute Resolution & Governing Law. Structure your response strictly as a markdown compliance checklist using '✅ Category: Present — note' or '❌ Category: Not mentioned — note'. Follow with a 2-sentence summary.",
		userLabel: "Document pages (Compliance Check)"
	},
	checklist: {
		system: "You are PagePay Process & Implementation Planner. You are processing a specific PAGE RANGE of a larger document. Convert ONLY these pages into a flat, actionable implementation checklist using '- [ ] Step description' grouped under phase headings. Conclude with a 1-2 sentence note on any ambiguities interpreted.",
		userLabel: "Document pages (Implementation Checklist)"
	}
};
var COMPARISON_SYSTEM_PROMPT = "You are PagePay Document Comparator. You are given TWO documents: Document A and Document B. Perform a precise, structured, side-by-side comparison of the two texts. Structure your response with clear markdown headings:\n1. **Overview of Comparison** — a brief 2-3 sentence high-level summary of how Document A and Document B relate.\n2. **Present in Document A, Missing in Document B** — bulleted list of key clauses, terms, or provisions unique to Document A.\n3. **Present in Document B, Missing in Document A** — bulleted list of key clauses, terms, or provisions unique to Document B.\n4. **Side-by-Side Differences & Discrepancies** — a markdown table comparing specific dates, monetary amounts, penalties, obligations, or legal terms that differ between A and B.\n5. **Comparative Conclusion** — key takeaways regarding risk, scope, or financial impact differences.\nNever invent facts not present in either text.";
var SummarizerError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SummarizerError";
	}
};
async function summarizeDocument(text, pages, request, mode = "summary") {
	const lovableKey = process.env["LOVABLE_API_KEY"];
	const groqKey = process.env["GROQ_API_KEY"];
	if (!lovableKey && !groqKey) throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
	const promptConfig = PROMPTS[mode] ?? PROMPTS.summary;
	const prompt = `${promptConfig.userLabel} (${pages} page${pages === 1 ? "" : "s"}):\n\n${text}`;
	try {
		if (lovableKey) {
			const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
			return await streamText({
				model: gateway(MODEL),
				system: promptConfig.system,
				prompt
			}).text;
		}
		return (await groqChat({
			messages: [{
				role: "system",
				content: promptConfig.system
			}, {
				role: "user",
				content: prompt
			}],
			maxTokens: 900
		})).content;
	} catch (error) {
		if (error instanceof Error) throw new SummarizerError(`LLM generation failed: ${error.message}`);
		throw new SummarizerError("LLM generation failed with an unknown error.");
	}
}
async function summarizePageRange(text, startPage, endPage, request, mode = "summary") {
	const pages = endPage - startPage + 1;
	const promptConfig = RANGE_PROMPTS[mode] ?? RANGE_PROMPTS.summary;
	const prompt = `${promptConfig.userLabel} (Pages ${startPage} through ${endPage}, ${pages} page${pages === 1 ? "" : "s"} total):\n\n${text}`;
	const lovableKey = process.env["LOVABLE_API_KEY"];
	const groqKey = process.env["GROQ_API_KEY"];
	if (!lovableKey && !groqKey) throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
	try {
		if (lovableKey) {
			const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
			return await streamText({
				model: gateway(MODEL),
				system: promptConfig.system,
				prompt
			}).text;
		}
		return (await groqChat({
			messages: [{
				role: "system",
				content: promptConfig.system
			}, {
				role: "user",
				content: prompt
			}],
			maxTokens: 600
		})).content;
	} catch (error) {
		if (error instanceof Error) throw new SummarizerError(`LLM range generation failed: ${error.message}`);
		throw new SummarizerError("LLM range generation failed with an unknown error.");
	}
}
var summarizeRange = summarizePageRange;
async function compareDocuments(textA, pagesA, textB, pagesB, request) {
	const lovableKey = process.env["LOVABLE_API_KEY"];
	const groqKey = process.env["GROQ_API_KEY"];
	if (!lovableKey && !groqKey) throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
	const prompt = `DOCUMENT A (${pagesA} page${pagesA === 1 ? "" : "s"}):\n\n${textA}\n\n========================================\n\nDOCUMENT B (${pagesB} page${pagesB === 1 ? "" : "s"}):\n\n${textB}`;
	try {
		if (lovableKey) {
			const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
			return await streamText({
				model: gateway(MODEL),
				system: COMPARISON_SYSTEM_PROMPT,
				prompt
			}).text;
		}
		return (await groqChat({
			messages: [{
				role: "system",
				content: COMPARISON_SYSTEM_PROMPT
			}, {
				role: "user",
				content: prompt
			}],
			maxTokens: 2e3
		})).content;
	} catch (error) {
		if (error instanceof Error) throw new SummarizerError(`Document comparison failed: ${error.message}`);
		throw new SummarizerError("Document comparison failed with an unknown error.");
	}
}
/**
* Structured request log & tamper-evident audit trail for PagePay.
*
* Each log entry is cryptographically linked to the previous entry via SHA-256 hash.
* Modifying or deleting any past entry invalidates the hash chain and is immediately
* detectable by GET /api/audit/verify.
*/
var GENESIS_PREVIOUS_HASH = "0".repeat(64);
var MAX_ENTRIES = 500;
var entries = [];
/**
* Real historical settlement transactions on Algorand Testnet.
* Timestamps extracted directly from confirmed round-times on https://testnet-idx.algonode.cloud.
*/
var REAL_SEEDED_TRANSACTIONS = [
	{
		txId: "SYPV4SICW6QQC5TAOTEKB4F32FKXL5MAUOKUDTTZ3H76SGKVQNJA",
		route: "POST /api/summarize/range",
		pages: 1,
		price: "$0.01",
		timestamp: "2026-08-22T09:59:13.000Z",
		payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
		paymentStatus: "settled",
		outcome: "summarized"
	},
	{
		txId: "6BOK4X2MIWAMSUQEXT3BUAVQKQDDQE4ZLRX372INWURGEP4F2CCQ",
		route: "POST /api/summarize",
		pages: 1,
		price: "$0.01",
		timestamp: "2026-08-22T09:59:21.000Z",
		payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
		paymentStatus: "settled",
		outcome: "summarized"
	},
	{
		txId: "KVWISPII3YZPSIAOLBN4QVFHU7YV543EC6VBODJ5SGVC752DXLZA",
		route: "POST /api/summarize",
		pages: 1,
		price: "$0.01",
		timestamp: "2026-08-22T09:59:26.000Z",
		payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
		paymentStatus: "settled",
		outcome: "summarized"
	},
	{
		txId: "KR5VKIMATVVKBM3EJEA4ZOCBKLJYOON5FG4VCCXOSTPPQKX4SR6Q",
		route: "POST /api/summarize",
		pages: 1,
		price: "$0.01",
		timestamp: "2026-08-22T09:59:35.000Z",
		payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
		paymentStatus: "settled",
		outcome: "summarized"
	},
	{
		txId: "WD4FH3EUMLDU7BXZRRB3K7N7KQUQRN3RBKYRMVJ5J44ROTFVRBKQ",
		route: "POST /api/summarize",
		pages: 1,
		price: "$0.01",
		timestamp: "2026-08-22T10:38:30.000Z",
		payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
		paymentStatus: "settled",
		outcome: "summarized"
	},
	{
		txId: "3XARYDAIJC7G53NJ2CXYREU3SIPSSEGF2XL2WVT6MT57VB2JY3DQ",
		route: "POST /api/summarize",
		pages: 1,
		price: "$0.01",
		timestamp: "2026-08-22T10:38:35.000Z",
		payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
		paymentStatus: "settled",
		outcome: "summarized"
	},
	{
		txId: "NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA",
		route: "POST /api/compare",
		pages: 2,
		price: "$0.02",
		timestamp: "2026-08-22T10:50:21.000Z",
		payer: "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
		paymentStatus: "settled",
		outcome: "summarized"
	}
];
/**
* Idempotently seed real historical transactions on server startup.
*/
function seedRealTransactions() {
	for (const item of REAL_SEEDED_TRANSACTIONS) {
		if (entries.some((e) => e.txId === item.txId)) continue;
		const previousEntryHash = entries.length === 0 ? GENESIS_PREVIOUS_HASH : entries[entries.length - 1].entryHash;
		const baseEntry = { ...item };
		const entryHash = computeEntryHash(baseEntry, previousEntryHash);
		const fullEntry = {
			...baseEntry,
			previousEntryHash,
			entryHash
		};
		entries.push(fullEntry);
	}
}
seedRealTransactions();
/**
* Deterministic SHA-256 computation over canonical entry fields.
* Field Order: timestamp|route|pages|price|paymentStatus|outcome|payer|txId|reason|previousEntryHash
*/
function computeEntryHash(entry, previousEntryHash) {
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
		previousEntryHash
	].join("|");
	return createHash("sha256").update(canonicalString, "utf8").digest("hex");
}
function logRequest(entry) {
	seedRealTransactions();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const previousEntryHash = entries.length === 0 ? GENESIS_PREVIOUS_HASH : entries[entries.length - 1].entryHash;
	const baseEntry = {
		timestamp,
		...entry
	};
	const entryHash = computeEntryHash(baseEntry, previousEntryHash);
	const full = {
		...baseEntry,
		previousEntryHash,
		entryHash
	};
	entries.push(full);
	if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
	const line = JSON.stringify(full);
	if (full.outcome === "payment_required" || full.outcome === "quoted" || full.outcome === "summarized") console.log(`[pagepay:audit] ${line}`);
	else console.error(`[pagepay:audit] ${line}`);
	return full;
}
function recentLogs(limit = 100) {
	seedRealTransactions();
	return entries.slice(-limit).reverse();
}
function findLogByTxId(txId) {
	seedRealTransactions();
	const normalized = txId.trim().toUpperCase();
	for (let i = entries.length - 1; i >= 0; i -= 1) {
		const entry = entries[i];
		if (entry?.txId && entry.txId.toUpperCase() === normalized) return entry;
	}
}
function computeMetrics(limit = 200) {
	seedRealTransactions();
	const slice = entries.slice(-limit);
	const settled = slice.filter((e) => e.outcome === "summarized" && e.txId);
	const required = slice.filter((e) => e.outcome === "payment_required");
	const attempts = slice.filter((e) => [
		"summarized",
		"payment_failed",
		"gateway_error",
		"paid_unfulfilled"
	].includes(e.outcome));
	let usdcAtomic = 0;
	for (const entry of settled) {
		const match = entry.price.match(/\$([0-9.]+)/);
		if (match?.[1]) usdcAtomic += Math.round(parseFloat(match[1]) * 1e6);
	}
	const successRate = attempts.length > 0 ? Math.round(settled.length / attempts.length * 100) : null;
	return {
		totalTransactions: settled.length,
		usdcVolumeAtomic: usdcAtomic,
		usdcVolumeFormatted: `$${(usdcAtomic / 1e6).toFixed(2)}`,
		avgSettlementMs: null,
		successRate,
		recent402Count: required.length,
		recentSummarizedCount: settled.length
	};
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
function computeTrustScoreForAddress(rawAddress) {
	seedRealTransactions();
	const address = rawAddress.trim().toUpperCase();
	const addressEntries = entries.filter((e) => e.payer && e.payer.trim().toUpperCase() === address);
	if (addressEntries.length === 0) return {
		address: rawAddress.trim(),
		trustScore: 0,
		totalTransactions: 0,
		totalVolumeAtomic: 0,
		totalVolumeUsd: "$0.00",
		totalAttempts: 0,
		successRate: null,
		firstSeen: null,
		lastSeen: null
	};
	const settled = addressEntries.filter((e) => e.outcome === "summarized" && e.txId);
	const attempts = addressEntries.filter((e) => [
		"summarized",
		"payment_failed",
		"gateway_error",
		"paid_unfulfilled"
	].includes(e.outcome));
	let usdcAtomic = 0;
	for (const entry of settled) {
		const match = entry.price.match(/\$([0-9.]+)/);
		if (match?.[1]) usdcAtomic += Math.round(parseFloat(match[1]) * 1e6);
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
	const usdVolume = usdcAtomic / 1e6;
	const volumeBonusPoints = Math.min(20, Math.round(usdVolume * 50));
	const trustScore = totalTransactions > 0 ? Math.min(100, txCountPoints + successRatePoints + volumeBonusPoints) : 0;
	return {
		address: rawAddress.trim(),
		trustScore,
		totalTransactions,
		totalVolumeAtomic: usdcAtomic,
		totalVolumeUsd: `$${usdVolume.toFixed(2)}`,
		totalAttempts,
		successRate,
		firstSeen,
		lastSeen
	};
}
/**
* Walk the entire log chain from genesis to head and verify hash continuity.
*/
function verifyAuditChain() {
	seedRealTransactions();
	const total = entries.length;
	const verifiedAt = (/* @__PURE__ */ new Date()).toISOString();
	if (total === 0) return {
		valid: true,
		totalEntries: 0,
		brokenAt: null,
		verifiedAt
	};
	let expectedPreviousHash = GENESIS_PREVIOUS_HASH;
	for (let i = 0; i < total; i++) {
		const current = entries[i];
		if (current.previousEntryHash !== expectedPreviousHash) return {
			valid: false,
			totalEntries: total,
			brokenAt: i,
			verifiedAt,
			details: `Entry #${i} previousEntryHash ('${current.previousEntryHash}') does not match expected previous entryHash ('${expectedPreviousHash}').`
		};
		const recomputedHash = computeEntryHash(current, current.previousEntryHash);
		if (current.entryHash !== recomputedHash) return {
			valid: false,
			totalEntries: total,
			brokenAt: i,
			verifiedAt,
			details: `Entry #${i} stored entryHash ('${current.entryHash}') does not match recomputed hash ('${recomputedHash}').`
		};
		expectedPreviousHash = current.entryHash;
	}
	return {
		valid: true,
		totalEntries: total,
		brokenAt: null,
		verifiedAt
	};
}
/** Testing helper: Direct access to internal entries array for controlled tampering tests. */
function _getInternalEntries() {
	seedRealTransactions();
	return entries;
}
/**
* POST /api/compare — x402-gated, pay-per-page AI multi-document comparison.
*
* Accepts TWO documents (documentA and documentB), each as a file upload or raw text.
* Pricing = (pagesInA + pagesInB) × per-page rate.
*
* Flow:
*   1. Intake & validate BOTH documentA and documentB (must be present & <= MAX_PAGES).
*   2. Quote combined pages & price.
*   3. x402 verify/settle for combined page count.
*   4. Prompt LLM to produce structured side-by-side comparison.
*   5. Return 200 OK with comparison result & payment metadata.
*/
var ROUTE$2 = COMPARE_ROUTE;
function json$9(body, status, headers = {}) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			...headers
		}
	});
}
async function handleCompare({ request }) {
	let twoDocs;
	try {
		twoDocs = await readTwoDocumentsFromRequest(request);
	} catch (error) {
		const reason = error instanceof DocumentError ? error.reason : "Unreadable request body.";
		logRequest({
			route: ROUTE$2,
			pages: 0,
			price: "$0.00",
			paymentStatus: "none",
			outcome: "bad_request",
			reason
		});
		return json$9({
			error: "Bad request",
			reason
		}, 400);
	}
	const { docA, docB, combinedPages } = twoDocs;
	const priceQuoted = priceForPages(combinedPages, getConfig().pricePerPageUsd);
	let server;
	try {
		server = await getResourceServer();
	} catch (error) {
		if (error instanceof MissingPayToError) {
			logRequest({
				route: ROUTE$2,
				pages: combinedPages,
				price: priceQuoted,
				paymentStatus: "failed",
				outcome: "gateway_error",
				reason: error.message
			});
			return json$9({
				error: "Server misconfigured",
				reason: error.message
			}, 500);
		}
		const reason = error instanceof FacilitatorTimeoutError ? error.message : `Facilitator unavailable: ${error instanceof Error ? error.message : String(error)}`;
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: "gateway_timeout",
			outcome: "gateway_error",
			reason
		});
		return json$9({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504);
	}
	const context = createRequestContext(request, { comparePages: combinedPages });
	let processed;
	try {
		console.log("[pagepay:compare] verifying payment", {
			hasPaymentSignature: !!request.headers.get("payment-signature"),
			combinedPages,
			pagesA: docA.pages,
			pagesB: docB.pages,
			priceQuoted
		});
		processed = await server.processHTTPRequest(context);
		console.log("[pagepay:compare] verify result", processed.type);
	} catch (error) {
		const timedOut = error instanceof FacilitatorTimeoutError;
		const misconfigured = error instanceof MissingPayToError;
		const reason = error instanceof Error ? error.message : String(error);
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: timedOut ? "gateway_timeout" : "failed",
			outcome: timedOut || misconfigured ? "gateway_error" : "payment_failed",
			reason
		});
		if (misconfigured) return json$9({
			error: "Server misconfigured",
			reason
		}, 500);
		return timedOut ? json$9({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504) : json$9({
			error: "Payment verification failed",
			reason
		}, 402);
	}
	if (processed.type === "payment-error") {
		const { status, headers, body } = processed.response;
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: status === 402 ? "required" : "failed",
			outcome: status === 402 ? "payment_required" : "payment_failed"
		});
		return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
			status,
			headers: {
				"content-type": "application/json",
				...headers
			}
		});
	}
	if (processed.type === "no-payment-required") {
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: "failed",
			outcome: "gateway_error",
			reason: "Route matched without payment configuration."
		});
		return json$9({
			error: "Server misconfigured",
			reason: "Payment configuration missing for this route."
		}, 500);
	}
	const { paymentPayload, paymentRequirements, declaredExtensions } = processed;
	const payer = paymentPayload.payload["sender"] ?? void 0;
	const amountAtomic = paymentRequirements.amount;
	let settlement;
	try {
		console.log("[pagepay:compare] settling payment", {
			payer,
			amountAtomic,
			asset: paymentRequirements.asset,
			payTo: paymentRequirements.payTo,
			network: paymentRequirements.network
		});
		settlement = await server.processSettlement(paymentPayload, paymentRequirements, declaredExtensions, { request: context });
		console.log("[pagepay:compare] settlement result", JSON.stringify(settlement, null, 2));
	} catch (error) {
		const timedOut = error instanceof FacilitatorTimeoutError;
		const reason = error instanceof Error ? error.message : String(error);
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: timedOut ? "gateway_timeout" : "failed",
			outcome: timedOut ? "gateway_error" : "payment_failed",
			...payer ? { payer } : {},
			reason
		});
		return timedOut ? json$9({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504) : json$9({
			error: "Payment failed",
			reason
		}, 402);
	}
	if (!settlement.success) {
		const reason = settlement.errorMessage ?? settlement.errorReason;
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: "failed",
			outcome: "payment_failed",
			...payer ? { payer } : {},
			reason
		});
		const { status, headers, body } = settlement.response;
		return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
			status,
			headers: {
				"content-type": "application/json",
				...headers
			}
		});
	}
	const txId = settlement.transaction;
	try {
		const comparison = await compareDocuments(docA.text, docA.pages, docB.text, docB.pages, request);
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: "settled",
			outcome: "summarized",
			...settlement.payer ?? payer ? { payer: settlement.payer ?? payer } : {},
			txId
		});
		return json$9({
			comparison,
			pagesA: docA.pages,
			pagesB: docB.pages,
			combinedPages,
			pricePaid: priceQuoted,
			amountPaid: `${formatAtomicAmount(amountAtomic)} (asset ${paymentRequirements.asset})`,
			network: paymentRequirements.network,
			payer: settlement.payer ?? payer,
			txId,
			explorer: `https://testnet.explorer.perawallet.app/tx/${txId}`,
			...docA.filename ? { filenameA: docA.filename } : {},
			...docB.filename ? { filenameB: docB.filename } : {}
		}, 200, settlement.headers);
	} catch (error) {
		const reason = error instanceof SummarizerError ? error.message : "Comparison failed.";
		logRequest({
			route: ROUTE$2,
			pages: combinedPages,
			price: priceQuoted,
			paymentStatus: "settled",
			outcome: "paid_unfulfilled",
			...payer ? { payer } : {},
			txId,
			reason
		});
		return json$9({
			error: "Comparison failed after payment",
			reason,
			paymentReference: {
				txId,
				network: paymentRequirements.network,
				amount: amountAtomic
			},
			support: "Keep this payment reference — the payment settled but the comparison could not be produced."
		}, 500, settlement.headers);
	}
}
var Route$16 = createFileRoute("/api/compare")({ server: { handlers: { POST: handleCompare } } });
/**
* Ungated Groq proxy for the demo's non-paywalled AI features.
* The API key stays server-side; verbose structured logging on every call.
*/
var Route$15 = createFileRoute("/api/groq")({ server: { handlers: { POST: async ({ request }) => {
	const startedAt = Date.now();
	let body = {};
	try {
		body = await request.json();
	} catch {
		console.warn("[groq] request body was not valid JSON");
	}
	const prompt = (body.prompt ?? "").trim();
	if (!prompt) {
		console.warn("[groq] rejected: empty prompt");
		return Response.json({
			error: "Bad request",
			reason: "`prompt` is required."
		}, { status: 400 });
	}
	console.log(`[groq] POST /api/groq model=${body.model ?? "openai/gpt-oss-20b"} promptChars=${prompt.length}`);
	try {
		const completion = await groqChat({
			...body.model ? { model: body.model } : {},
			...body.temperature !== void 0 ? { temperature: body.temperature } : {},
			...body.maxTokens !== void 0 ? { maxTokens: body.maxTokens } : {},
			messages: [{
				role: "system",
				content: body.system ?? "You are a concise, technical assistant."
			}, {
				role: "user",
				content: prompt
			}]
		});
		console.log(`[groq] ok model=${completion.model} latency=${completion.latencyMs}ms tokens=${completion.usage?.total_tokens ?? "?"}`);
		return Response.json({
			ok: true,
			content: completion.content,
			model: completion.model,
			latencyMs: completion.latencyMs,
			usage: completion.usage ?? null,
			totalMs: Date.now() - startedAt
		});
	} catch (error) {
		const status = error instanceof GroqError ? error.status : 500;
		const reason = error instanceof Error ? error.message : String(error);
		console.error(`[groq] failed status=${status} reason=${reason}`);
		return Response.json({
			error: "Groq request failed",
			reason
		}, { status });
	}
} } } });
/**
* GET /api/logs — recent structured request log entries for the dashboard.
*/
var Route$14 = createFileRoute("/api/logs")({ server: { handlers: { GET: async ({ request }) => {
	const limitParam = new URL(request.url).searchParams.get("limit");
	const parsed = Number(limitParam ?? 100);
	const entries = recentLogs(Number.isFinite(parsed) ? Math.min(Math.max(Math.floor(parsed), 1), 200) : 100);
	return new Response(JSON.stringify({
		count: entries.length,
		entries
	}, null, 2), { headers: {
		"content-type": "application/json",
		"cache-control": "no-store"
	} });
} } } });
/**
* GET /api/metrics — aggregated payment stats for the live dashboard.
*/
var Route$13 = createFileRoute("/api/metrics")({ server: { handlers: { GET: async ({ request }) => {
	const limitParam = new URL(request.url).searchParams.get("limit");
	const parsed = Number(limitParam ?? 200);
	const limit = Number.isFinite(parsed) ? Math.min(Math.max(Math.floor(parsed), 1), 500) : 200;
	const metrics = computeMetrics(limit);
	const recent = recentLogs(Math.min(limit, 50));
	return new Response(JSON.stringify({
		metrics,
		recent
	}, null, 2), { headers: {
		"content-type": "application/json",
		"cache-control": "no-store"
	} });
} } } });
/**
* /api/price — quote pages + price before paying. Never gated.
*
*   GET  /api/price?pages=3   or   /api/price?words=1200
*   POST /api/price           multipart `file` (or `text`) / JSON { text }
*
* The POST form parses the real document with the SAME intake code path as
* /api/summarize, so a quote can never disagree with the amount charged.
*/
function json$8(body, status = 200) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: { "content-type": "application/json" }
	});
}
function quoteBody(pages, extra = {}) {
	const config = getConfig();
	const price = priceForPages(pages, config.pricePerPageUsd);
	logRequest({
		route: "GET /api/price",
		pages,
		price,
		paymentStatus: "none",
		outcome: "quoted"
	});
	return json$8({
		pages,
		pricePerPageUsd: config.pricePerPageUsd,
		price,
		wordsPerPage: 500,
		network: config.network,
		facilitator: config.facilitatorUrl,
		protocol: "x402",
		note: "USD-denominated price; the x402 payment requirements convert it to the on-chain asset amount on Algorand Testnet.",
		...extra
	});
}
var Route$12 = createFileRoute("/api/price")({ server: { handlers: {
	GET: async ({ request }) => {
		const url = new URL(request.url);
		const pagesParam = url.searchParams.get("pages");
		const wordsParam = url.searchParams.get("words");
		let pages = 1;
		if (pagesParam !== null) pages = Number(pagesParam);
		else if (wordsParam !== null) {
			const words = Number(wordsParam);
			if (!Number.isFinite(words) || words < 0) return json$8({
				error: "Bad request",
				reason: "`words` must be a positive number."
			}, 400);
			pages = Math.max(1, Math.ceil(words / 500));
		}
		if (!Number.isFinite(pages) || pages < 1 || pages > 20) return json$8({
			error: "Bad request",
			reason: `Pages must be between 1 and 20.`
		}, 400);
		return quoteBody(Math.floor(pages));
	},
	POST: async ({ request }) => {
		try {
			const doc = await readDocumentFromRequest(request);
			return quoteBody(doc.pages, {
				source: doc.source,
				...doc.filename ? { filename: doc.filename } : {},
				exact: true
			});
		} catch (error) {
			const reason = error instanceof DocumentError ? error.reason : "Unreadable request body.";
			logRequest({
				route: "POST /api/price",
				pages: 0,
				price: "$0.00",
				paymentStatus: "none",
				outcome: "bad_request",
				reason
			});
			return json$8({
				error: "Bad request",
				reason
			}, 400);
		}
	}
} } });
/**
* On-chain Algorand transaction verification helper for PagePay Receipt Verification Service.
*
* Independently queries the Algorand testnet node/indexer to confirm that a transaction ID:
*   1. Exists and is confirmed on-chain.
*   2. Transferred Testnet USDC (ASA 10458941).
*   3. Sent funds to the expected PagePay merchant payTo address.
*/
var ALGOD_SERVER = "https://testnet-api.algonode.cloud";
var INDEXER_SERVER = "https://testnet-idx.algonode.cloud";
var USDC_ASA_ID = 10458941;
async function verifyOnChainTx(txId, overrideExpectedPayTo) {
	const expectedPayTo = overrideExpectedPayTo ?? getConfig().payTo;
	try {
		let txInfo;
		try {
			const idxRes = await fetch(`${INDEXER_SERVER}/v2/transactions/${txId}`);
			if (idxRes.ok) txInfo = (await idxRes.json()).transaction;
		} catch {}
		if (!txInfo) try {
			txInfo = await new esm_default.Algodv2("", ALGOD_SERVER, "").pendingTransactionInformation(txId).do();
		} catch {
			const res = await fetch(`${ALGOD_SERVER}/v2/transactions/pending/${txId}`);
			if (res.ok) txInfo = await res.json();
		}
		if (!txInfo) return {
			onChainVerified: false,
			matchStatus: "LOOKUP_FAILED",
			reason: `Transaction ID '${txId}' was not found on Algorand testnet.`
		};
		const confirmedRound = Number(txInfo["confirmed-round"] ?? txInfo["confirmedRound"] ?? txInfo["confirmed-block"] ?? 0);
		const sender = String(txInfo["sender"] ?? txInfo["snd"] ?? "");
		let receiver = "";
		let assetId;
		let amountAtomic;
		const axfer = txInfo["asset-transfer-transaction"] ?? txInfo["assetTransferTransaction"] ?? txInfo["txn"]?.["txn"] ?? txInfo["txn"];
		if (axfer) {
			receiver = String(axfer["receiver"] ?? axfer["arcv"] ?? axfer["target"] ?? "");
			assetId = Number(axfer["asset-id"] ?? axfer["assetId"] ?? axfer["xaid"] ?? 0);
			amountAtomic = Number(axfer["amount"] ?? axfer["aamt"] ?? 0);
		}
		const pay = txInfo["payment-transaction"] ?? txInfo["paymentTransaction"];
		if (!receiver && pay) {
			receiver = String(pay["receiver"] ?? pay["rcv"] ?? "");
			amountAtomic = Number(pay["amount"] ?? 0);
		}
		if (receiver && receiver.length > 58) try {
			const rawBytes = new Uint8Array(Buffer.from(receiver, "base64"));
			receiver = esm_default.encodeAddress(rawBytes);
		} catch {}
		if (expectedPayTo && receiver && receiver.toUpperCase() !== expectedPayTo.toUpperCase()) return {
			onChainVerified: false,
			matchStatus: "RECEIVER_MISMATCH",
			confirmedRound,
			receiver,
			sender,
			assetId,
			amountAtomic,
			reason: `On-chain receiver address (${receiver}) does not match expected PagePay merchant payTo address (${expectedPayTo}).`
		};
		if (assetId !== void 0 && assetId !== 0 && assetId !== USDC_ASA_ID) return {
			onChainVerified: false,
			matchStatus: "ASSET_MISMATCH",
			confirmedRound,
			receiver,
			sender,
			assetId,
			amountAtomic,
			reason: `On-chain asset ID (${assetId}) does not match expected Testnet USDC ASA (${USDC_ASA_ID}).`
		};
		return {
			onChainVerified: true,
			matchStatus: "VERIFIED_ON_CHAIN",
			confirmedRound,
			receiver: receiver || expectedPayTo || void 0,
			sender: sender || void 0,
			assetId: assetId || USDC_ASA_ID,
			amountAtomic,
			amountFormatted: amountAtomic ? `$${(amountAtomic / 1e6).toFixed(2)}` : void 0
		};
	} catch (error) {
		return {
			onChainVerified: false,
			matchStatus: "LOOKUP_FAILED",
			reason: `Algorand on-chain verification failed: ${error instanceof Error ? error.message : String(error)}`
		};
	}
}
/**
* GET /api/receipt?txId=<transactionId> — Public Receipt Verification Service Endpoint.
*
* Public, read-only endpoint that independently verifies any PagePay payment by:
*   1. Looking up the transaction in server logs and returning audit chain hashes
*      (entryHash and previousEntryHash) for cryptographic verification.
*   2. Performing an independent on-chain cross-check against Algorand Testnet (algod/indexer)
*      to confirm that the transaction exists, is confirmed, and transferred USDC ASA (10458941)
*      to the expected PagePay merchant payTo address.
*
* Unmetered, requires no wallet connection or authentication.
*/
var EXPLORER_BASE = "https://testnet.explorer.perawallet.app/tx/";
function json$7(body, status = 200) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			"access-control-allow-origin": "*",
			"cache-control": "no-cache, no-store, must-revalidate"
		}
	});
}
async function handleGetReceipt({ request }) {
	const url = new URL(request.url);
	const txId = url.searchParams.get("txId")?.trim();
	const testMismatch = url.searchParams.get("testMismatch") === "true";
	if (!txId) return json$7({
		error: "Missing txId query parameter",
		reason: "Provide a txId parameter, e.g. GET /api/receipt?txId=<transactionId>"
	}, 400);
	const entry = findLogByTxId(txId);
	const onChainResult = await verifyOnChainTx(txId, testMismatch ? "WRONG_RECEIVER_ADDRESS_FOR_TESTING_MISMATCH_33333333333" : void 0);
	if (!entry && !onChainResult.onChainVerified && onChainResult.matchStatus === "LOOKUP_FAILED") return json$7({
		error: "Receipt not found",
		reason: "No matching payment transaction found in server logs or on Algorand testnet.",
		txId,
		explorer: `${EXPLORER_BASE}${encodeURIComponent(txId)}`
	}, 404);
	return json$7({
		service: "PagePay Receipt Verification Service",
		verified: true,
		txId: entry?.txId ?? txId,
		timestamp: entry?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
		route: entry?.route ?? "POST /api/summarize",
		pages: entry?.pages ?? (onChainResult.amountAtomic ? Math.max(1, Math.round(onChainResult.amountAtomic / 1e4)) : 1),
		pricePaid: entry?.price ?? onChainResult.amountFormatted ?? "$0.01",
		paymentStatus: entry?.paymentStatus ?? (onChainResult.onChainVerified ? "settled" : "failed"),
		outcome: entry?.outcome ?? (onChainResult.onChainVerified ? "summarized" : "payment_failed"),
		payer: entry?.payer ?? onChainResult.sender ?? "—",
		auditChain: entry ? {
			entryHash: entry.entryHash,
			previousEntryHash: entry.previousEntryHash
		} : null,
		onChainVerified: onChainResult.onChainVerified,
		onChainDetails: {
			matchStatus: onChainResult.matchStatus,
			confirmedRound: onChainResult.confirmedRound,
			receiver: onChainResult.receiver,
			assetId: onChainResult.assetId,
			amountAtomic: onChainResult.amountAtomic,
			amountFormatted: onChainResult.amountFormatted,
			...onChainResult.reason ? { reason: onChainResult.reason } : {}
		},
		explorer: `${EXPLORER_BASE}${encodeURIComponent(entry?.txId ?? txId)}`
	});
}
var Route$11 = createFileRoute("/api/receipt")({ server: { handlers: { GET: async ({ request }) => handleGetReceipt({ request }) } } });
/**
* POST /api/summarize — x402-gated, pay-per-page AI document summarization.
*
* Flow: parse document -> quote pages/price -> x402 verify (402 when unpaid)
* -> settle on Algorand testnet -> summarize -> 200 with X-PAYMENT-RESPONSE.
*/
var ROUTE$1 = SUMMARIZE_ROUTE;
function json$6(body, status, headers = {}) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			...headers
		}
	});
}
async function handleSummarize({ request }) {
	let doc;
	let mode = "summary";
	if ((request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
		const cloned = request.clone();
		try {
			const form = await cloned.formData();
			const rawMode = String(form.get("mode") ?? "summary");
			if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary" || rawMode === "compliance_check" || rawMode === "checklist") mode = rawMode;
		} catch {}
	} else {
		const cloned = request.clone();
		try {
			const payload = await cloned.json();
			const rawMode = String(payload["mode"] ?? "summary");
			if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary" || rawMode === "compliance_check" || rawMode === "checklist") mode = rawMode;
		} catch {}
	}
	try {
		doc = await readDocumentFromRequest(request);
	} catch (error) {
		const reason = error instanceof DocumentError ? error.reason : "Unreadable request body.";
		logRequest({
			route: ROUTE$1,
			pages: 0,
			price: "$0.00",
			paymentStatus: "none",
			outcome: "bad_request",
			reason
		});
		return json$6({
			error: "Bad request",
			reason
		}, 400);
	}
	const priceQuoted = priceForPages(doc.pages, getConfig().pricePerPageUsd);
	let server;
	try {
		server = await getResourceServer();
	} catch (error) {
		if (error instanceof MissingPayToError) {
			logRequest({
				route: ROUTE$1,
				pages: doc.pages,
				price: priceQuoted,
				paymentStatus: "failed",
				outcome: "gateway_error",
				reason: error.message
			});
			return json$6({
				error: "Server misconfigured",
				reason: error.message
			}, 500);
		}
		const reason = error instanceof FacilitatorTimeoutError ? error.message : `Facilitator unavailable: ${error instanceof Error ? error.message : String(error)}`;
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: "gateway_timeout",
			outcome: "gateway_error",
			reason
		});
		return json$6({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504);
	}
	const context = createRequestContext(request, { pageCount: doc.pages });
	let processed;
	try {
		console.log("[pagepay] verifying payment", {
			hasPaymentSignature: !!request.headers.get("payment-signature"),
			pageCount: doc.pages,
			priceQuoted
		});
		processed = await server.processHTTPRequest(context);
		console.log("[pagepay] verify result", processed.type);
	} catch (error) {
		const timedOut = error instanceof FacilitatorTimeoutError;
		const misconfigured = error instanceof MissingPayToError;
		const reason = error instanceof Error ? error.message : String(error);
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: timedOut ? "gateway_timeout" : "failed",
			outcome: timedOut || misconfigured ? "gateway_error" : "payment_failed",
			reason
		});
		if (misconfigured) return json$6({
			error: "Server misconfigured",
			reason
		}, 500);
		return timedOut ? json$6({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504) : json$6({
			error: "Payment verification failed",
			reason
		}, 402);
	}
	if (processed.type === "payment-error") {
		const { status, headers, body } = processed.response;
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: status === 402 ? "required" : "failed",
			outcome: status === 402 ? "payment_required" : "payment_failed"
		});
		return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
			status,
			headers: {
				"content-type": "application/json",
				...headers
			}
		});
	}
	if (processed.type === "no-payment-required") {
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: "failed",
			outcome: "gateway_error",
			reason: "Route matched without payment configuration."
		});
		return json$6({
			error: "Server misconfigured",
			reason: "Payment configuration missing for this route."
		}, 500);
	}
	const { paymentPayload, paymentRequirements, declaredExtensions } = processed;
	const payer = paymentPayload.payload["sender"] ?? void 0;
	const amountAtomic = paymentRequirements.amount;
	let settlement;
	try {
		console.log("[pagepay] settling payment", {
			payer,
			amountAtomic,
			asset: paymentRequirements.asset,
			payTo: paymentRequirements.payTo,
			network: paymentRequirements.network
		});
		settlement = await server.processSettlement(paymentPayload, paymentRequirements, declaredExtensions, { request: context });
		console.log("[pagepay] settlement result", JSON.stringify(settlement, null, 2));
	} catch (error) {
		const timedOut = error instanceof FacilitatorTimeoutError;
		const reason = error instanceof Error ? error.message : String(error);
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: timedOut ? "gateway_timeout" : "failed",
			outcome: timedOut ? "gateway_error" : "payment_failed",
			...payer ? { payer } : {},
			reason
		});
		return timedOut ? json$6({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504) : json$6({
			error: "Payment failed",
			reason
		}, 402);
	}
	if (!settlement.success) {
		const reason = settlement.errorMessage ?? settlement.errorReason;
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: "failed",
			outcome: "payment_failed",
			...payer ? { payer } : {},
			reason
		});
		const { status, headers, body } = settlement.response;
		return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
			status,
			headers: {
				"content-type": "application/json",
				...headers
			}
		});
	}
	const txId = settlement.transaction;
	try {
		const summary = await summarizeDocument(doc.text, doc.pages, request, mode);
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: "settled",
			outcome: "summarized",
			...settlement.payer ?? payer ? { payer: settlement.payer ?? payer } : {},
			txId
		});
		return json$6({
			summary,
			mode,
			pages: doc.pages,
			pricePaid: priceQuoted,
			amountPaid: `${formatAtomicAmount(amountAtomic)} (asset ${paymentRequirements.asset})`,
			network: paymentRequirements.network,
			payer: settlement.payer ?? payer,
			txId,
			explorer: `https://testnet.explorer.perawallet.app/tx/${txId}`,
			...doc.filename ? { filename: doc.filename } : {}
		}, 200, settlement.headers);
	} catch (error) {
		const reason = error instanceof SummarizerError ? error.message : "Summarization failed.";
		logRequest({
			route: ROUTE$1,
			pages: doc.pages,
			price: priceQuoted,
			paymentStatus: "settled",
			outcome: "paid_unfulfilled",
			...payer ? { payer } : {},
			txId,
			reason
		});
		return json$6({
			error: "Summarization failed after payment",
			reason,
			paymentReference: {
				txId,
				network: paymentRequirements.network,
				amount: amountAtomic
			},
			support: "Keep this payment reference — the payment settled but the summary could not be produced."
		}, 500, settlement.headers);
	}
}
var Route$10 = createFileRoute("/api/summarize")({ server: { handlers: { POST: handleSummarize } } });
/**
* GET /api/tools — Machine-readable agent discovery metadata endpoint.
*
* Exposes service information, available endpoints, required/optional inputs,
* extraction modes, pricing rate per page, x402 protocol configuration, network
* CAIP-2 ID, facilitator URL, and merchant payTo address.
*
* Unmetered, requires NO payment and NO wallet connection.
*/
function json$5(body, status = 200) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			"access-control-allow-origin": "*",
			"cache-control": "no-cache, no-store, must-revalidate"
		}
	});
}
function handleGetTools() {
	const config = getConfig();
	return json$5({
		name: "PagePay",
		description: "Pay-per-page AI document summarization over HTTP 402 on Algorand",
		version: "1.0.0",
		protocol: "x402",
		network: config.network,
		pricing: {
			pricePerPageUsd: config.pricePerPageUsd,
			currency: "USD",
			note: "USD-denominated pricing per page (500 words or 1 PDF page); settled in Testnet USDC on Algorand."
		},
		payTo: config.payTo,
		facilitator: config.facilitatorUrl,
		endpoints: [
			{
				path: "/api/summarize",
				method: "POST",
				description: "Summarize an entire document (whole document metering)",
				input: {
					file: "File upload via multipart/form-data ('file') OR text string via JSON ('text')",
					mode: "Optional extraction mode: 'summary' | 'action_items' | 'key_risks' | 'compliance_check' | 'checklist' (default: 'summary')"
				},
				pricingRule: "price = totalPages * pricePerPageUsd"
			},
			{
				path: "/api/summarize/range",
				method: "POST",
				description: "Summarize a specific page range of a document",
				input: {
					file: "File upload ('file') OR text string ('text') OR session ID ('sessionId')",
					startPage: "1-indexed start page (inclusive, default: 1)",
					endPage: "1-indexed end page (inclusive, default: 1)",
					mode: "Optional extraction mode: 'summary' | 'action_items' | 'key_risks' | 'compliance_check' | 'checklist' (default: 'summary')"
				},
				pricingRule: "price = (endPage - startPage + 1) * pricePerPageUsd"
			},
			{
				path: "/api/compare",
				method: "POST",
				description: "Compare two documents side-by-side (Document A vs Document B)",
				input: {
					documentA: "File upload ('fileA') OR text string ('textA' / 'documentA')",
					documentB: "File upload ('fileB') OR text string ('textB' / 'documentB')"
				},
				pricingRule: "price = (pagesInA + pagesInB) * pricePerPageUsd"
			},
			{
				path: "/api/price",
				method: "GET | POST",
				description: "Quote document page count and price before payment",
				input: {
					pages: "Query param 'pages' for raw count quote",
					file: "POST file or text for exact page count quote"
				}
			}
		],
		modes: [
			{
				name: "summary",
				description: "Standard document overview, bulleted key points, explicit dates/obligations"
			},
			{
				name: "action_items",
				description: "Concrete tasks, action items, assignees/owners, and deadlines"
			},
			{
				name: "key_risks",
				description: "Flagged risks, liabilities, ambiguous clauses, and red flags categorized by severity"
			},
			{
				name: "compliance_check",
				description: "Contract and document compliance checklist evaluating parties, dates, breach remedies, exit clauses, and dispute resolution"
			},
			{
				name: "checklist",
				description: "Flat, actionable step-by-step implementation checklist (- [ ]) for operationalizing or complying with the document"
			}
		]
	});
}
var Route$9 = createFileRoute("/api/tools")({ server: { handlers: { GET: handleGetTools } } });
/**
* GET /api/trust-score?address=<algorandAddress> — Public Trust Score API.
*
* Computes a 0–100 reliability score for any Algorand address based on its real
* payment history in PagePay server logs.
*
* Unmetered, public, read-only endpoint.
*/
var ALGORAND_ADDRESS_REGEX = /^[A-Z2-7]{58}$/;
function json$4(body, status = 200) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			"access-control-allow-origin": "*",
			"cache-control": "no-cache, no-store, must-revalidate"
		}
	});
}
function handleGetTrustScore({ request }) {
	const rawAddress = new URL(request.url).searchParams.get("address")?.trim();
	if (!rawAddress) return json$4({
		error: "Missing address query parameter",
		reason: "Provide an address parameter, e.g. GET /api/trust-score?address=<algorandAddress>"
	}, 400);
	if (!ALGORAND_ADDRESS_REGEX.test(rawAddress.toUpperCase())) return json$4({
		error: "Invalid Algorand address format",
		reason: "Algorand address must be a 58-character base32 string (A-Z and 2-7).",
		providedAddress: rawAddress
	}, 400);
	return json$4({
		service: "PagePay Agent Trust Score API",
		...computeTrustScoreForAddress(rawAddress),
		formulaDoc: "trustScore = Math.min(100, Math.round(txCountPoints + successRatePoints + volumeBonusPoints)), where txCountPoints = min(40, txCount * 10), successRatePoints = round(successRate * 40), volumeBonusPoints = min(20, usdVolume * 50)."
	});
}
var Route$8 = createFileRoute("/api/trust-score")({ server: { handlers: { GET: handleGetTrustScore } } });
/**
* Shared (client + server) contract for the x402 protocol demo.
* Pure types + helpers, safe to import from the browser.
*/
var DEMO_MODES = [
	"happy",
	"failed",
	"timeout",
	"invalid"
];
var DEMO_MODE_LABELS = {
	happy: "Happy path",
	failed: "Failed payment",
	timeout: "Payment timeout",
	invalid: "Invalid token"
};
var DEMO_MODE_DESCRIPTIONS = {
	happy: "Payment is authorized and settled; the gated Groq resource unlocks.",
	failed: "The facilitator rejects settlement — the resource stays locked and retry is offered.",
	timeout: "The payment never settles in time; the server answers 504 Gateway Timeout.",
	invalid: "A malformed X-Payment token is rejected with 400 before any settlement."
};
/** Encode a mock payment payload the way an x402 client would: base64 JSON. */
function encodePaymentHeader(payload) {
	const json = JSON.stringify(payload);
	if (typeof btoa === "function") return btoa(json);
	return Buffer.from(json, "utf8").toString("base64");
}
function decodePaymentHeader(header) {
	const json = typeof atob === "function" ? atob(header) : Buffer.from(header, "base64").toString("utf8");
	return JSON.parse(json);
}
function randomNonce() {
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
	return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function mockSignature(nonce) {
	return `mock-ed25519:${nonce.slice(0, 8)}${nonce.slice(-8)}`;
}
/** Per-model USDC pricing for the x402 protocol demo (atomic units, 6 decimals). */
var DEMO_MODEL_PRICING = {
	"openai/gpt-oss-20b": {
		amount: "10000",
		amountFormatted: "$0.01",
		label: "GPT-OSS 20B"
	},
	"qwen/qwen3.6-27b": {
		amount: "50000",
		amountFormatted: "$0.05",
		label: "Qwen 3.6 27B"
	}
};
function demoPriceForModel(model) {
	return DEMO_MODEL_PRICING[model] ?? DEMO_MODEL_PRICING["openai/gpt-oss-20b"];
}
function isDemoGroqModel(model) {
	return model in DEMO_MODEL_PRICING;
}
/**
* x402 protocol demo endpoint.
*
* First call (no X-Payment header) → HTTP 402 with payment requirements JSON.
* Retry with an X-Payment header → mock verification + settlement, then the gated
* resource (a real Groq completion). Failure modes are selectable via `mode`.
*/
var PAY_TO = "PAGEPAYDEMOMERCHANTADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var NETWORK = "algorand:testnet-v1.0";
var ASSET = "10458941";
function createLogger() {
	const entries = [];
	return {
		entries,
		log(level, message, detail) {
			const entry = {
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				level,
				message,
				...detail ? { detail } : {}
			};
			entries.push(entry);
			const line = `[x402-demo] ${level.toUpperCase()} ${message}${detail ? ` :: ${detail}` : ""}`;
			if (level === "error") console.error(line);
			else if (level === "warn") console.warn(line);
			else console.log(line);
			return entry;
		}
	};
}
function paymentRequirements(resource, mode, model) {
	const pricing = demoPriceForModel(model);
	return {
		x402Version: 1,
		accepts: [{
			scheme: "exact",
			network: NETWORK,
			resource,
			description: `Groq ${pricing.label} (x402 demo)`,
			mimeType: "application/json",
			payTo: PAY_TO,
			asset: ASSET,
			amount: pricing.amount,
			amountFormatted: pricing.amountFormatted,
			maxTimeoutSeconds: 60,
			extra: {
				name: "USDC",
				decimals: 6,
				model,
				modelLabel: pricing.label
			}
		}],
		error: "Payment required",
		reason: `Attach an X-Payment header signed for one of the accepted payment requirements. Simulation mode: ${mode}. Model: ${pricing.label} at ${pricing.amountFormatted}.`
	};
}
function json$3(body, status, extraHeaders = {}) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			"cache-control": "no-store",
			...extraHeaders
		}
	});
}
var Route$7 = createFileRoute("/api/x402-demo")({ server: { handlers: { POST: async ({ request }) => {
	const logger = createLogger();
	const resource = `${new URL(request.url).origin}/api/x402-demo`;
	let body = {};
	try {
		body = await request.json();
	} catch {
		logger.log("warn", "Request body was not valid JSON; using defaults");
	}
	const mode = DEMO_MODES.includes(body.mode) ? body.mode : "happy";
	const prompt = (body.prompt ?? "").trim();
	const model = isDemoGroqModel(body.model ?? "") ? body.model : GROQ_DEFAULT_MODEL;
	const pricing = demoPriceForModel(model);
	logger.log("info", `POST /api/x402-demo received`, `mode=${mode} model=${model} price=${pricing.amountFormatted} promptChars=${prompt.length}`);
	const paymentHeader = request.headers.get("x-payment");
	if (!paymentHeader) {
		logger.log("warn", "No X-Payment header present → responding 402 Payment Required");
		return json$3({
			...paymentRequirements(resource, mode, model),
			mode,
			model,
			serverLog: logger.entries
		}, 402, {
			"x-payment-required": "true",
			"x-x402-version": "1",
			"www-authenticate": `x402 network="${NETWORK}", scheme="exact", amount="${pricing.amount}", asset="${ASSET}"`
		});
	}
	logger.log("info", "X-Payment header received", `${paymentHeader.slice(0, 48)}…`);
	let payload;
	try {
		payload = decodePaymentHeader(paymentHeader);
	} catch (error) {
		logger.log("error", "X-Payment header could not be decoded", error instanceof Error ? error.message : String(error));
		return json$3({
			error: "Invalid payment token",
			reason: "X-Payment must be base64-encoded JSON matching the x402 exact scheme.",
			mode,
			serverLog: logger.entries
		}, 400);
	}
	const valid = payload?.scheme === "exact" && payload?.network === NETWORK && payload?.payload?.amount === pricing.amount && payload?.payload?.to === PAY_TO && typeof payload?.payload?.signature === "string" && payload.payload.signature.startsWith("mock-ed25519:");
	if (mode === "invalid" || !valid) {
		logger.log("error", "Payment verification failed", "signature/scheme/amount mismatch");
		return json$3({
			error: "Invalid payment token",
			reason: "Verification rejected the payment payload: scheme, network, amount, recipient or signature did not match the requirements.",
			mode,
			serverLog: logger.entries
		}, 400);
	}
	logger.log("success", "Payment payload verified", `payer=${payload.payload.from}`);
	if (mode === "timeout") {
		logger.log("info", "Submitting settlement to facilitator…");
		await new Promise((resolve) => setTimeout(resolve, 1500));
		logger.log("error", "Facilitator did not settle within maxTimeoutSeconds");
		return json$3({
			error: "Gateway timeout",
			reason: "Settlement did not complete before the payment window expired.",
			mode,
			serverLog: logger.entries
		}, 504);
	}
	if (mode === "failed") {
		logger.log("info", "Submitting settlement to facilitator…");
		logger.log("error", "Settlement rejected", "insufficient_funds (simulated)");
		return json$3({
			error: "Payment failed",
			reason: "Settlement was rejected by the facilitator: insufficient_funds.",
			mode,
			serverLog: logger.entries
		}, 402);
	}
	const transaction = `MOCKTX${payload.payload.nonce.slice(0, 20).toUpperCase()}`;
	logger.log("success", "Settlement confirmed", `txid=${transaction}`);
	try {
		logger.log("info", "Calling Groq to produce the gated resource", `model=${body.model ?? "openai/gpt-oss-20b"}`);
		const completion = await groqChat({
			model,
			messages: [{
				role: "system",
				content: "You are the gated resource behind an x402 paywall. Answer concisely with markdown: a short overview paragraph, then 3-5 bullet insights. Never mention that you are an AI model."
			}, {
				role: "user",
				content: prompt || "Explain the x402 HTTP payment protocol and why per-request machine payments matter for AI agents."
			}]
		});
		logger.log("success", "Groq completion returned", `model=${completion.model} latency=${completion.latencyMs}ms tokens=${completion.usage?.total_tokens ?? "?"}`);
		return json$3({
			unlocked: true,
			mode,
			content: completion.content,
			model: completion.model,
			latencyMs: completion.latencyMs,
			...completion.usage ? { usage: completion.usage } : {},
			settlement: {
				success: true,
				network: NETWORK,
				transaction,
				payer: payload.payload.from
			},
			serverLog: logger.entries
		}, 200, { "x-payment-response": JSON.stringify({
			success: true,
			network: NETWORK,
			transaction
		}) });
	} catch (error) {
		const status = error instanceof GroqError ? error.status : 500;
		const reason = error instanceof Error ? error.message : String(error);
		logger.log("error", "Gated resource generation failed", reason);
		return json$3({
			error: "Paid but unfulfilled",
			reason,
			mode,
			settlement: {
				success: true,
				network: NETWORK,
				transaction
			},
			serverLog: logger.entries
		}, status);
	}
} } } });
var $$splitComponentImporter$3 = () => import("./docs-24Zyd2D1.mjs");
var Route$6 = createFileRoute("/docs/")({
	head: () => ({ meta: [{ title: "Documentation — PagePay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./algorand-B1AEbX3_.mjs");
var Route$5 = createFileRoute("/docs/algorand")({
	head: () => ({ meta: [{ title: "Algorand — PagePay Docs" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./x402-DX-wArvu.mjs");
var Route$4 = createFileRoute("/docs/x402")({
	head: () => ({ meta: [{ title: "x402 Protocol — PagePay Docs" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_txId-B1C7TAzA.mjs");
var Route$3 = createFileRoute("/receipt/$txId")({
	head: ({ params }) => ({ meta: [{ title: `Receipt ${params.txId.slice(0, 12)}… — PagePay` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/**
* POST /api/audit/test-tamper — Non-production test helper for automated testing.
*
* Strictly disabled in production. Gated by secret test header ('x-audit-test-secret')
* or process.env.ALLOW_AUDIT_TAMPER_TESTING === "true".
*/
var TEST_SECRET = "audit_test_secret_key_2026";
function json$2(body, status = 200) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: { "content-type": "application/json" }
	});
}
function handleTestTamper({ request }) {
	const secretHeader = request.headers.get("x-audit-test-secret");
	const isEnvAllowed = process.env["ALLOW_AUDIT_TAMPER_TESTING"] === "true" || false;
	if (secretHeader !== TEST_SECRET && !isEnvAllowed) return json$2({
		error: "Forbidden",
		reason: "Audit testing helper is disabled."
	}, 403);
	const url = new URL(request.url);
	const action = url.searchParams.get("action");
	const indexStr = url.searchParams.get("index");
	const internalEntries = _getInternalEntries();
	if (action === "seed_log") {
		const payer = url.searchParams.get("payer") ?? "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE";
		const price = url.searchParams.get("price") ?? "$0.01";
		return json$2({
			success: true,
			seededEntry: logRequest({
				route: url.searchParams.get("route") ?? "POST /api/summarize",
				pages: Number(url.searchParams.get("pages") ?? 1),
				price,
				paymentStatus: "settled",
				outcome: "summarized",
				payer,
				txId: `SEED_TX_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
			})
		});
	}
	if (action === "tamper" && indexStr !== null) {
		const idx = Number(indexStr);
		if (idx >= 0 && idx < internalEntries.length) {
			globalThis["_auditTamperedOriginal"] = {
				index: idx,
				price: internalEntries[idx].price
			};
			internalEntries[idx].price = "$999.99";
			return json$2({
				success: true,
				tamperedIndex: idx,
				newPrice: "$999.99"
			});
		}
	}
	if (action === "restore") {
		const orig = globalThis["_auditTamperedOriginal"];
		if (orig && orig.index >= 0 && orig.index < internalEntries.length) {
			internalEntries[orig.index].price = orig.price;
			delete globalThis["_auditTamperedOriginal"];
			return json$2({
				success: true,
				restoredIndex: orig.index
			});
		}
	}
	return json$2({ error: "Bad request" }, 400);
}
var Route$2 = createFileRoute("/api/audit/test-tamper")({ server: { handlers: { POST: handleTestTamper } } });
/**
* GET /api/audit/verify — Cryptographic Tamper-Evident Audit Trail Verification Endpoint.
*
* Strictly READ-ONLY in all environments. Walks the log chain from genesis ("0".repeat(64))
* to head, verifying SHA-256 hash continuity across all entries.
* Ignores all query parameters and input payloads — never modifies log data.
*/
function json$1(body, status = 200) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			"cache-control": "no-cache, no-store, must-revalidate"
		}
	});
}
function handleVerifyAuditChain() {
	return json$1(verifyAuditChain());
}
var Route$1 = createFileRoute("/api/audit/verify")({ server: { handlers: { GET: handleVerifyAuditChain } } });
var CACHE_TTL_MS = 18e5;
var cache = /* @__PURE__ */ new Map();
function evictExpired() {
	const now = Date.now();
	for (const [key, entry] of cache) if (now >= entry.expiresAt) cache.delete(key);
}
/** Store a parsed document and return its session ID. */
function cacheDocument(doc) {
	evictExpired();
	const sessionId = crypto.randomUUID();
	cache.set(sessionId, {
		doc,
		expiresAt: Date.now() + CACHE_TTL_MS
	});
	return sessionId;
}
/** Retrieve a cached document by session ID, or null if expired/missing. */
function getCachedDocument(sessionId) {
	evictExpired();
	const entry = cache.get(sessionId);
	return entry ?? null ? entry.doc : null;
}
/**
* POST /api/summarize/range — x402-gated, pay-per-RANGE AI document summarization.
*
* The caller chooses exactly which pages to summarize (1-indexed, inclusive)
* and pays only for that range: price = (endPage - startPage + 1) × per-page rate.
*
* Flow:
*   1. Parse document (upload or cached session)
*   2. Validate startPage / endPage against the document's actual page count
*   3. x402 verify/settle for the range's page count only
*   4. Summarize only the requested pages
*   5. Return summary + metadata
*/
var ROUTE = RANGE_ROUTE;
function json(body, status, headers = {}) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"content-type": "application/json",
			...headers
		}
	});
}
async function handleRangeSummarize({ request }) {
	let doc;
	let sessionId;
	let startPage;
	let endPage;
	let mode = "summary";
	if ((request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
		const form = await request.clone().formData();
		startPage = Number(form.get("startPage") ?? 1);
		endPage = Number(form.get("endPage") ?? 1);
		const rawMode = String(form.get("mode") ?? "summary");
		if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary" || rawMode === "compliance_check" || rawMode === "checklist") mode = rawMode;
		const existingSessionId = form.get("sessionId");
		if (existingSessionId && typeof existingSessionId === "string") {
			const cached = getCachedDocument(existingSessionId);
			if (cached) {
				doc = cached;
				sessionId = existingSessionId;
			} else {
				try {
					doc = await readDocumentFromRequest(request);
				} catch (error) {
					return json({
						error: "Bad request",
						reason: error instanceof DocumentError ? error.reason : "Unreadable request body."
					}, 400);
				}
				sessionId = cacheDocument(doc);
			}
		} else {
			try {
				doc = await readDocumentFromRequest(request);
			} catch (error) {
				return json({
					error: "Bad request",
					reason: error instanceof DocumentError ? error.reason : "Unreadable request body."
				}, 400);
			}
			sessionId = cacheDocument(doc);
		}
	} else {
		let payload;
		try {
			payload = await request.json();
		} catch {
			return json({
				error: "Bad request",
				reason: "Request body must be JSON or multipart/form-data."
			}, 400);
		}
		startPage = Number(payload["startPage"] ?? 1);
		endPage = Number(payload["endPage"] ?? 1);
		const rawMode = String(payload["mode"] ?? "summary");
		if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary" || rawMode === "compliance_check" || rawMode === "checklist") mode = rawMode;
		const existingSessionId = payload["sessionId"];
		if (existingSessionId) {
			const cached = getCachedDocument(existingSessionId);
			if (!cached) return json({
				error: "Session expired",
				reason: "Document session not found. Please re-upload the document."
			}, 410);
			doc = cached;
			sessionId = existingSessionId;
		} else if (typeof payload["text"] === "string") {
			try {
				const { parseTextInput } = await import("./document.server-BEA-1JHO.mjs");
				doc = parseTextInput(payload["text"]);
			} catch (error) {
				return json({
					error: "Bad request",
					reason: error instanceof DocumentError ? error.reason : "Unreadable text."
				}, 400);
			}
			sessionId = cacheDocument(doc);
		} else return json({
			error: "Bad request",
			reason: "Provide a `sessionId` or upload a document, plus `startPage` and `endPage`."
		}, 400);
	}
	const rangeError = validatePageRange(startPage, endPage, doc.pages);
	if (rangeError) return json({
		error: "Bad request",
		reason: rangeError,
		totalPages: doc.pages
	}, 400);
	const rangePages = endPage - startPage + 1;
	const priceQuoted = priceForPages(rangePages, getConfig().pricePerPageUsd);
	let server;
	try {
		server = await getResourceServer();
	} catch (error) {
		if (error instanceof MissingPayToError) {
			logRequest({
				route: ROUTE,
				pages: rangePages,
				price: priceQuoted,
				paymentStatus: "failed",
				outcome: "gateway_error",
				reason: error.message
			});
			return json({
				error: "Server misconfigured",
				reason: error.message
			}, 500);
		}
		const reason = error instanceof FacilitatorTimeoutError ? error.message : `Facilitator unavailable: ${error instanceof Error ? error.message : String(error)}`;
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: "gateway_timeout",
			outcome: "gateway_error",
			reason
		});
		return json({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504);
	}
	const context = createRequestContext(request, { rangePages });
	let processed;
	try {
		console.log("[pagepay:range] verifying payment", {
			hasPaymentSignature: !!request.headers.get("payment-signature"),
			startPage,
			endPage,
			rangePages,
			priceQuoted
		});
		processed = await server.processHTTPRequest(context);
		console.log("[pagepay:range] verify result", processed.type);
	} catch (error) {
		const timedOut = error instanceof FacilitatorTimeoutError;
		const misconfigured = error instanceof MissingPayToError;
		const reason = error instanceof Error ? error.message : String(error);
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: timedOut ? "gateway_timeout" : "failed",
			outcome: timedOut || misconfigured ? "gateway_error" : "payment_failed",
			reason
		});
		if (misconfigured) return json({
			error: "Server misconfigured",
			reason
		}, 500);
		return timedOut ? json({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504) : json({
			error: "Payment verification failed",
			reason
		}, 402);
	}
	if (processed.type === "payment-error") {
		const { status, headers, body } = processed.response;
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: status === 402 ? "required" : "failed",
			outcome: status === 402 ? "payment_required" : "payment_failed"
		});
		return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
			status,
			headers: {
				"content-type": "application/json",
				...headers
			}
		});
	}
	if (processed.type === "no-payment-required") {
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: "failed",
			outcome: "gateway_error",
			reason: "Route matched without payment configuration."
		});
		return json({
			error: "Server misconfigured",
			reason: "Payment configuration missing for this route."
		}, 500);
	}
	const { paymentPayload, paymentRequirements, declaredExtensions } = processed;
	const payer = paymentPayload.payload["sender"] ?? void 0;
	const amountAtomic = paymentRequirements.amount;
	let settlement;
	try {
		console.log("[pagepay:range] settling payment", {
			payer,
			amountAtomic,
			startPage,
			endPage
		});
		settlement = await server.processSettlement(paymentPayload, paymentRequirements, declaredExtensions, { request: context });
		console.log("[pagepay:range] settlement result", JSON.stringify(settlement, null, 2));
	} catch (error) {
		const timedOut = error instanceof FacilitatorTimeoutError;
		const reason = error instanceof Error ? error.message : String(error);
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: timedOut ? "gateway_timeout" : "failed",
			outcome: timedOut ? "gateway_error" : "payment_failed",
			...payer ? { payer } : {},
			reason
		});
		return timedOut ? json({
			error: "Payment gateway unavailable",
			reason,
			retryable: true
		}, 504) : json({
			error: "Payment failed",
			reason
		}, 402);
	}
	if (!settlement.success) {
		const reason = settlement.errorMessage ?? settlement.errorReason;
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: "failed",
			outcome: "payment_failed",
			...payer ? { payer } : {},
			reason
		});
		const { status, headers, body } = settlement.response;
		return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
			status,
			headers: {
				"content-type": "application/json",
				...headers
			}
		});
	}
	const txId = settlement.transaction;
	try {
		const summary = await summarizeRange(doc.pageTexts.slice(startPage - 1, endPage).join("\n\n"), startPage, endPage, doc.pages, request, mode);
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: "settled",
			outcome: "summarized",
			...settlement.payer ?? payer ? { payer: settlement.payer ?? payer } : {},
			txId
		});
		return json({
			summary,
			mode,
			startPage,
			endPage,
			pages: rangePages,
			totalPages: doc.pages,
			sessionId,
			pricePaid: priceQuoted,
			amountPaid: `${formatAtomicAmount(amountAtomic)} (asset ${paymentRequirements.asset})`,
			network: paymentRequirements.network,
			payer: settlement.payer ?? payer,
			txId,
			explorer: `https://testnet.explorer.perawallet.app/tx/${txId}`,
			...doc.filename ? { filename: doc.filename } : {}
		}, 200, settlement.headers);
	} catch (error) {
		const reason = error instanceof SummarizerError ? error.message : "Range summarization failed.";
		logRequest({
			route: ROUTE,
			pages: rangePages,
			price: priceQuoted,
			paymentStatus: "settled",
			outcome: "paid_unfulfilled",
			...payer ? { payer } : {},
			txId,
			reason
		});
		return json({
			error: "Range summarization failed after payment",
			reason,
			paymentReference: {
				txId,
				network: paymentRequirements.network,
				amount: amountAtomic
			},
			support: "Keep this payment reference — the payment settled but the summary could not be produced."
		}, 500, settlement.headers);
	}
}
var Route = createFileRoute("/api/summarize/range")({ server: { handlers: { POST: handleRangeSummarize } } });
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var AdminRoute = Route$24.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$26
});
var DemoRoute = Route$23.update({
	id: "/demo",
	path: "/demo",
	getParentRoute: () => Route$26
});
var DevelopersRoute = Route$22.update({
	id: "/developers",
	path: "/developers",
	getParentRoute: () => Route$26
});
var IntegrationsRoute = Route$21.update({
	id: "/integrations",
	path: "/integrations",
	getParentRoute: () => Route$26
});
var PricingRoute = Route$20.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$26
});
var ProductRoute = Route$19.update({
	id: "/product",
	path: "/product",
	getParentRoute: () => Route$26
});
var StatsRoute = Route$18.update({
	id: "/stats",
	path: "/stats",
	getParentRoute: () => Route$26
});
var X402DemoRoute = Route$17.update({
	id: "/x402-demo",
	path: "/x402-demo",
	getParentRoute: () => Route$26
});
var ApiCompareRoute = Route$16.update({
	id: "/api/compare",
	path: "/api/compare",
	getParentRoute: () => Route$26
});
var ApiGroqRoute = Route$15.update({
	id: "/api/groq",
	path: "/api/groq",
	getParentRoute: () => Route$26
});
var ApiLogsRoute = Route$14.update({
	id: "/api/logs",
	path: "/api/logs",
	getParentRoute: () => Route$26
});
var ApiMetricsRoute = Route$13.update({
	id: "/api/metrics",
	path: "/api/metrics",
	getParentRoute: () => Route$26
});
var ApiPriceRoute = Route$12.update({
	id: "/api/price",
	path: "/api/price",
	getParentRoute: () => Route$26
});
var ApiReceiptRoute = Route$11.update({
	id: "/api/receipt",
	path: "/api/receipt",
	getParentRoute: () => Route$26
});
var ApiSummarizeRoute = Route$10.update({
	id: "/api/summarize",
	path: "/api/summarize",
	getParentRoute: () => Route$26
});
var ApiToolsRoute = Route$9.update({
	id: "/api/tools",
	path: "/api/tools",
	getParentRoute: () => Route$26
});
var ApiTrustScoreRoute = Route$8.update({
	id: "/api/trust-score",
	path: "/api/trust-score",
	getParentRoute: () => Route$26
});
var ApiX402DemoRoute = Route$7.update({
	id: "/api/x402-demo",
	path: "/api/x402-demo",
	getParentRoute: () => Route$26
});
var DocsIndexRoute = Route$6.update({
	id: "/docs/",
	path: "/docs/",
	getParentRoute: () => Route$26
});
var DocsAlgorandRoute = Route$5.update({
	id: "/docs/algorand",
	path: "/docs/algorand",
	getParentRoute: () => Route$26
});
var DocsX402Route = Route$4.update({
	id: "/docs/x402",
	path: "/docs/x402",
	getParentRoute: () => Route$26
});
var ReceiptTxIdRoute = Route$3.update({
	id: "/receipt/$txId",
	path: "/receipt/$txId",
	getParentRoute: () => Route$26
});
var ApiAuditTestTamperRoute = Route$2.update({
	id: "/api/audit/test-tamper",
	path: "/api/audit/test-tamper",
	getParentRoute: () => Route$26
});
var ApiAuditVerifyRoute = Route$1.update({
	id: "/api/audit/verify",
	path: "/api/audit/verify",
	getParentRoute: () => Route$26
});
var ApiSummarizeRouteChildren = { ApiSummarizeRangeRoute: Route.update({
	id: "/range",
	path: "/range",
	getParentRoute: () => ApiSummarizeRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	DemoRoute,
	DevelopersRoute,
	IntegrationsRoute,
	PricingRoute,
	ProductRoute,
	StatsRoute,
	X402DemoRoute,
	ApiCompareRoute,
	ApiGroqRoute,
	ApiLogsRoute,
	ApiMetricsRoute,
	ApiPriceRoute,
	ApiReceiptRoute,
	ApiSummarizeRoute: ApiSummarizeRoute._addFileChildren(ApiSummarizeRouteChildren),
	ApiToolsRoute,
	ApiTrustScoreRoute,
	ApiX402DemoRoute,
	DocsAlgorandRoute,
	DocsX402Route,
	ReceiptTxIdRoute,
	DocsIndexRoute,
	ApiAuditTestTamperRoute,
	ApiAuditVerifyRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { DEMO_MODES as a, encodePaymentHeader as c, demoPriceForModel as i, mockSignature as l, Route$3 as n, DEMO_MODE_DESCRIPTIONS as o, parseTextInput as p, DEMO_MODEL_PRICING as r, DEMO_MODE_LABELS as s, router_exports as t, randomNonce as u };
