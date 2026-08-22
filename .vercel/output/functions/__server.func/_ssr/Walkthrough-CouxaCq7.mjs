import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as Button, r as cn } from "./button-BYtLCDFZ.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Bot, T as ArrowRightLeft, _ as FileText, a as ShieldCheck, c as Scale, i as Sparkles, m as LockOpen, n as X, o as ShieldAlert, p as Lock, s as Search, u as RefreshCw, v as ExternalLink, w as Award, x as CircleCheck, y as CircleX } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DWc43zsh.mjs";
import { t as Label } from "./label-Dc12M0o7.mjs";
import { t as Textarea } from "./textarea-BmuPRPs2.mjs";
import { n as registerExactAvmScheme } from "../_libs/x402-avm__avm.mjs";
import { a as pagesForText, o as priceForPages } from "./config.server-BtVvDl_U.mjs";
import { t as MarkdownContent } from "./MarkdownContent-BieHZhj0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as x402HTTPClient, n as x402Client } from "../_libs/x402-avm__core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Walkthrough-CouxaCq7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Browser-side x402 payment flow for PagePay (Algorand Testnet).
*
* Uses the official @x402-avm client packages: the server's 402 response is decoded
* into PaymentRequirements, the connected wallet signs the exact-AVM payment, and the
* request is retried with the X-PAYMENT header.
*/
var ALGOD_URL = "https://testnet-api.algonode.cloud";
function createPagePayHttpClient(signer) {
	const core = new x402Client();
	registerExactAvmScheme(core, {
		signer,
		algodConfig: {
			algodUrl: ALGOD_URL,
			algodToken: ""
		}
	});
	return new x402HTTPClient(core);
}
async function capture(response) {
	const headers = {};
	response.headers.forEach((value, key) => {
		headers[key] = value;
	});
	return {
		status: response.status,
		statusText: response.statusText,
		headers,
		body: await response.text()
	};
}
function readQuote(body) {
	if (!body || typeof body !== "object") return {};
	const record = body;
	return {
		...typeof record["pagesQuoted"] === "number" ? { pagesQuoted: record["pagesQuoted"] } : {},
		...typeof record["priceQuoted"] === "string" ? { priceQuoted: record["priceQuoted"] } : {}
	};
}
function classifySigningError(raw) {
	if (/cancel|reject|declin|denied|closed|abort|dismiss/i.test(raw)) return "cancelled";
	if (/insufficient|balance|underflow|overspend|below min|minimum balance/i.test(raw)) return "insufficient_funds";
	if (/fetch|network|timeout|timed out|econn|offline/i.test(raw)) return "network";
	return "signing_failed";
}
/**
* Perform an x402 request: send once (expect 402), sign, then retry with payment.
*/
async function payAndFetch(url, init, signer, options = {}) {
	const phase = options.onPhase ?? (() => {});
	phase("quoting");
	let first;
	try {
		first = await fetch(url, init);
	} catch (error) {
		const raw = message(error);
		console.error("[pagepay] initial fetch failed", raw, error);
		phase("failed");
		return {
			ok: false,
			unpaid: {
				status: 0,
				statusText: "Network Error",
				headers: {},
				body: ""
			},
			error: /failed to fetch|network|reset|refused|abort/i.test(raw) ? "Could not reach the server. If you're running locally, make sure `npm run dev` is running and open http://localhost:8080 (keep the terminal open)." : raw,
			failureCode: "network"
		};
	}
	const unpaid = await capture(first);
	console.log("[pagepay] initial response", unpaid);
	const firstBody = safeJson(unpaid.body);
	const quote = readQuote(firstBody);
	const quoteFields = {
		...quote.pagesQuoted !== void 0 ? { quotedPages: quote.pagesQuoted } : {},
		...quote.priceQuoted !== void 0 ? { quotedPrice: quote.priceQuoted } : {}
	};
	if (first.status !== 402) {
		if (first.ok) {
			phase("settled");
			return {
				ok: true,
				unpaid,
				result: firstBody,
				...quoteFields
			};
		}
		phase("failed");
		return {
			ok: false,
			unpaid,
			result: firstBody,
			error: `Server returned ${first.status}`,
			failureCode: first.status === 400 ? "bad_request" : first.status === 504 ? "gateway_unavailable" : "server_error",
			...quoteFields
		};
	}
	const httpClient = createPagePayHttpClient(signer);
	let paymentRequired;
	try {
		paymentRequired = httpClient.getPaymentRequiredResponse((name) => unpaid.headers[name.toLowerCase()], firstBody);
	} catch (error) {
		phase("failed");
		return {
			ok: false,
			unpaid,
			error: `Could not read payment requirements: ${message(error)}`,
			failureCode: "requirements_unreadable",
			...quoteFields
		};
	}
	if (options.expectedPages !== void 0 && quote.pagesQuoted !== void 0 && quote.pagesQuoted !== options.expectedPages) {
		phase("failed");
		return {
			ok: false,
			unpaid,
			paymentRequired,
			error: `Server quoted ${quote.pagesQuoted} page(s) (${quote.priceQuoted ?? "?"}), but the price shown was for ${options.expectedPages}.`,
			failureCode: "quote_mismatch",
			...quoteFields
		};
	}
	phase("awaiting_signature");
	console.log("[pagepay] payment required (402 quote)", JSON.stringify(paymentRequired, null, 2));
	let paymentHeaders;
	try {
		const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);
		console.log("[pagepay] payment payload signed", JSON.stringify(paymentPayload, null, 2));
		paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);
		console.log("[pagepay] payment headers for retry", paymentHeaders);
	} catch (error) {
		const raw = message(error);
		console.error("[pagepay] signing failed", raw, error);
		phase("failed");
		return {
			ok: false,
			unpaid,
			paymentRequired,
			error: raw,
			failureCode: classifySigningError(raw),
			...quoteFields
		};
	}
	const retryHeaders = new Headers(init.headers);
	for (const [key, value] of Object.entries(paymentHeaders)) retryHeaders.set(key, value);
	let retryBody = init.body;
	if (init.body instanceof FormData) {
		const freshForm = new FormData();
		for (const [k, v] of init.body.entries()) freshForm.append(k, v);
		retryBody = freshForm;
	}
	phase("submitted");
	let second;
	try {
		second = await fetch(url, {
			...init,
			headers: retryHeaders,
			body: retryBody
		});
	} catch (error) {
		phase("failed");
		return {
			ok: false,
			unpaid,
			paymentRequired,
			error: message(error),
			failureCode: "network",
			...quoteFields
		};
	}
	phase("verifying");
	const paid = await capture(second);
	console.log("[pagepay] paid retry response", paid);
	const paidBody = safeJson(paid.body);
	let settlement;
	try {
		settlement = httpClient.getPaymentSettleResponse((name) => paid.headers[name.toLowerCase()]);
	} catch {
		settlement = void 0;
	}
	if (second.ok) {
		phase("settled");
		return {
			ok: true,
			unpaid,
			paymentRequired,
			paid,
			paymentHeaders,
			...settlement ? { settlement } : {},
			result: paidBody,
			...quoteFields
		};
	}
	const paidReason = paidBody && typeof paidBody === "object" ? String(paidBody["reason"] ?? "") : "";
	const combinedReason = readVerifyFailureReason(paid.headers) || paidReason;
	let failureCode;
	if (second.status === 504) failureCode = "gateway_unavailable";
	else if (second.status === 400) failureCode = "bad_request";
	else if (second.status === 402) {
		const paidQuote = readQuote(paidBody);
		if (paidQuote.pagesQuoted !== void 0 && quote.pagesQuoted !== void 0 && paidQuote.pagesQuoted !== quote.pagesQuoted) failureCode = "quote_mismatch";
		else if (/insufficient|balance|underflow|overspend|asset 10458941 missing|missing from/i.test(combinedReason)) failureCode = "insufficient_funds";
		else failureCode = "verification_failed";
	} else failureCode = "server_error";
	phase("failed");
	return {
		ok: false,
		unpaid,
		paymentRequired,
		paid,
		...settlement ? { settlement } : {},
		result: paidBody,
		error: combinedReason || `Server returned ${second.status} after payment`,
		failureCode,
		...quoteFields
	};
}
function safeJson(text) {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
function readVerifyFailureReason(headers) {
	const encoded = headers["payment-required"];
	if (!encoded) return "";
	try {
		return JSON.parse(atob(encoded)).error ?? "";
	} catch {
		return "";
	}
}
function message(error) {
	return error instanceof Error ? error.message : String(error);
}
var FAILURE_COPY$2 = {
	cancelled: { message: "Payment was cancelled in Pera Wallet. Try again when ready." },
	insufficient_funds: {
		message: "Your wallet needs testnet USDC (ASA 10458941) plus a little ALGO for fees.",
		action: "fund"
	},
	requirements_unreadable: { message: "The server's 402 payment requirements couldn't be read." },
	signing_failed: { message: "Pera Wallet couldn't sign the payment. Look for the Pera tab/QR." },
	verification_failed: { message: "Payment could not be verified — wait a moment and try again." },
	quote_mismatch: { message: "The price changed. Try again to get a fresh quote." },
	gateway_unavailable: { message: "The payment facilitator didn't respond — try again shortly." },
	network: { message: "Lost connection. Check your connection and try again." },
	bad_request: { message: "The document couldn't be read for this range." },
	server_error: { message: "Something went wrong on the server." }
};
function RangeDemo({ wallet, totalPages = 0, file = null, text = "", defaultMode = "summary", mode }) {
	const effectiveMode = mode ?? defaultMode;
	const [startPage, setStartPage] = (0, import_react.useState)(1);
	const [endPage, setEndPage] = (0, import_react.useState)(totalPages || 1);
	const [sessionId, setSessionId] = (0, import_react.useState)(null);
	const [results, setResults] = (0, import_react.useState)([]);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const hasDoc = Boolean(file) || (text ?? "").trim().length > 0;
	const isMultiPage = totalPages > 1;
	const effectiveTotalPages = totalPages > 0 ? totalPages : 1;
	const clampedStart = Math.max(1, Math.min(startPage, effectiveTotalPages));
	const clampedEnd = Math.max(clampedStart, Math.min(endPage, effectiveTotalPages));
	const rangePages = clampedEnd - clampedStart + 1;
	const rangePrice = priceForPages(rangePages);
	const rangeValid = isMultiPage && hasDoc && clampedStart >= 1 && clampedEnd <= effectiveTotalPages && clampedStart <= clampedEnd;
	async function handleSummarizeRange() {
		if (!rangeValid) return;
		if (!wallet.signer || !wallet.address) {
			setError({
				message: "Connect Pera Wallet to pay for this range.",
				action: "connect"
			});
			return;
		}
		setRunning(true);
		setError(null);
		setPhase("requesting_quote");
		try {
			let body;
			const headers = {};
			if (file) {
				const form = new FormData();
				form.append("file", file);
				form.append("startPage", String(clampedStart));
				form.append("endPage", String(clampedEnd));
				form.append("mode", effectiveMode);
				if (sessionId) form.append("sessionId", sessionId);
				body = form;
			} else {
				headers["content-type"] = "application/json";
				body = JSON.stringify({
					text,
					startPage: clampedStart,
					endPage: clampedEnd,
					mode: effectiveMode,
					...sessionId ? { sessionId } : {}
				});
			}
			setPhase("signing_payment");
			const result = await payAndFetch("/api/summarize/range", {
				method: "POST",
				headers,
				body
			}, wallet.signer, { onPhase: (p) => setPhase(p) });
			if (!result.ok || !result.result) {
				setPhase(null);
				if (result.failureCode) setError(FAILURE_COPY$2[result.failureCode] ?? { message: result.error ?? "Range failed." });
				else setError({ message: result.error ?? "Range request failed." });
				return;
			}
			setPhase("complete");
			const res = result.result;
			if (res.sessionId) setSessionId(res.sessionId);
			const entry = {
				label: `Pages ${clampedStart}–${clampedEnd} of ${effectiveTotalPages}`,
				summary: res.summary ?? "",
				startPage: clampedStart,
				endPage: clampedEnd,
				pages: res.pages ?? rangePages,
				pricePaid: res.pricePaid ?? rangePrice,
				amountPaid: res.amountPaid ?? "",
				txId: res.txId ?? "",
				explorer: res.explorer ?? ""
			};
			setResults((prev) => [entry, ...prev]);
		} catch (err) {
			setPhase(null);
			setError({ message: err instanceof Error ? err.message : String(err) });
		} finally {
			setRunning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4 transition-all",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [isMultiPage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-4 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 text-muted-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs font-semibold text-card-foreground",
						children: "Optional Page Range Selection"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `font-mono text-[10px] uppercase tracking-wider rounded px-2 py-0.5 ${isMultiPage ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground"}`,
					children: isMultiPage ? "Unlocked" : "Locked (1 Page Doc)"
				})]
			}),
			!isMultiPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-[11px] text-muted-foreground",
				children: "Single page documents cover the full text automatically. Upload a multi-page PDF to select custom ranges."
			}),
			isMultiPage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[10px] font-mono text-muted-foreground",
							children: "Start Page"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: effectiveTotalPages,
							value: startPage,
							onChange: (e) => setStartPage(Number(e.target.value)),
							className: "mt-1 h-8 font-mono text-xs"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[10px] font-mono text-muted-foreground",
							children: "End Page"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: effectiveTotalPages,
							value: endPage,
							onChange: (e) => setEndPage(Number(e.target.value)),
							className: "mt-1 h-8 font-mono text-xs"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between font-mono text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Range Price:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-primary",
							children: rangePrice
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !rangeValid || running,
						onClick: () => void handleSummarizeRange(),
						className: "w-full text-xs font-mono",
						children: running ? "Processing Range..." : `Summarize Pages ${clampedStart}–${clampedEnd} (${rangePrice})`
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded border border-destructive/30 bg-destructive/10 p-2 font-mono text-[11px] text-destructive",
						children: error.message
					}),
					results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2 pt-2 border-t border-border/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground block",
							children: [
								"Range Results (",
								results.length,
								")"
							]
						}), results.map((r, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded border border-border/60 bg-muted/20 p-2 font-mono text-xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: r.pricePaid
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground text-[11px] line-clamp-3",
								children: r.summary
							})]
						}, idx))]
					})
				]
			})
		]
	});
}
/**
* CompareDemo — Pay-per-page AI Multi-Document Comparison UI.
*
* Dedicated side-by-side comparison interface for Document A vs Document B.
* Calculates combined pages & price, executes payAndFetch over x402, and renders
* structured comparison output with clear "A vs B" framing.
*/
var FAILURE_COPY$1 = {
	cancelled: { message: "Payment was cancelled in Pera Wallet." },
	insufficient_funds: {
		message: "Your wallet needs testnet USDC (ASA 10458941) plus testnet ALGO for fees.",
		action: "fund"
	},
	requirements_unreadable: { message: "The server's 402 payment requirements couldn't be read." },
	signing_failed: { message: "Pera Wallet couldn't sign the payment. Check Pera tab/QR." },
	verification_failed: { message: "Payment verification failed on Algorand — try again." },
	quote_mismatch: { message: "The quote changed. Try again to get a fresh quote." },
	gateway_unavailable: { message: "Payment facilitator didn't respond — try again shortly." },
	network: { message: "Lost connection. Check network and try again." },
	bad_request: { message: "One of the documents couldn't be read." },
	server_error: { message: "Something went wrong on the server." }
};
var PHASE_LABEL = {
	quoting: "requesting 402 quote",
	awaiting_signature: "awaiting signature in Pera",
	submitted: "payment submitted",
	verifying: "verifying settlement",
	settled: "settled",
	failed: "failed"
};
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 border-b border-border/60 py-1.5 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 break-all text-right font-mono text-[11px] text-card-foreground",
			children
		})]
	});
}
function CompareDemo({ wallet }) {
	const [fileA, setFileA] = (0, import_react.useState)(null);
	const [textA, setTextA] = (0, import_react.useState)("");
	const [fileB, setFileB] = (0, import_react.useState)(null);
	const [textB, setTextB] = (0, import_react.useState)("");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)(null);
	const [exchange, setExchange] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const pagesA = fileA ? 1 : textA.trim() ? pagesForText(textA) : 0;
	const pagesB = fileB ? 1 : textB.trim() ? pagesForText(textB) : 0;
	const combinedPages = (pagesA > 0 ? pagesA : 1) + (pagesB > 0 ? pagesB : 1);
	const combinedPrice = priceForPages(combinedPages);
	const hasBothDocs = (Boolean(fileA) || textA.trim().length > 0) && (Boolean(fileB) || textB.trim().length > 0);
	const result = exchange?.ok ? exchange.result : null;
	const paymentStatus = phase ?? "not_started";
	function fail(next) {
		setError(next);
	}
	async function handlePayAndCompare() {
		setError(null);
		setExchange(null);
		setPhase(null);
		if (!wallet.signer) {
			fail({
				message: "Connect Pera Wallet in the header first.",
				action: "connect"
			});
			return;
		}
		if (!hasBothDocs) {
			fail({ message: "Provide both Document A and Document B to run comparison." });
			return;
		}
		setRunning(true);
		try {
			const form = new FormData();
			if (fileA) form.set("fileA", fileA);
			else form.set("textA", textA);
			if (fileB) form.set("fileB", fileB);
			else form.set("textB", textB);
			const res = await payAndFetch("/api/compare", {
				method: "POST",
				body: form
			}, wallet.signer, {
				expectedPages: combinedPages,
				onPhase: setPhase
			});
			setExchange(res);
			if (!res.ok) fail((res.failureCode ? FAILURE_COPY$1[res.failureCode] : void 0) ?? { message: "The comparison payment couldn't be completed." });
		} catch (runErr) {
			console.error("[pagepay:compare] execution error", runErr);
			fail({ message: "Comparison failed due to an unexpected error." });
		} finally {
			setRunning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 lg:col-span-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold uppercase tracking-wider text-primary font-mono flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5" }), " DOCUMENT A"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: pagesA > 0 ? `≈ ${pagesA} page${pagesA === 1 ? "" : "s"}` : "Pending input"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer flex-col gap-1 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4 text-center hover:border-primary/50 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto size-5 text-muted-foreground/60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-card-foreground",
									children: fileA ? fileA.name : "Upload Document A (PDF / .txt)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									className: "hidden",
									accept: ".pdf,.txt,.md,text/plain,application/pdf",
									onChange: (e) => setFileA(e.target.files?.[0] ?? null)
								})
							]
						}),
						fileA && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "mt-1 text-[11px] h-7",
							onClick: () => setFileA(null),
							children: "Remove file A"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "text-a",
								className: "text-[11px] font-mono text-muted-foreground",
								children: "Or paste text for Document A"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "text-a",
								value: textA,
								disabled: Boolean(fileA),
								placeholder: "Paste text for Document A here...",
								className: "mt-1 min-h-20 font-mono text-xs",
								onChange: (e) => setTextA(e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold uppercase tracking-wider text-primary font-mono flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5" }), " DOCUMENT B"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: pagesB > 0 ? `≈ ${pagesB} page${pagesB === 1 ? "" : "s"}` : "Pending input"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer flex-col gap-1 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4 text-center hover:border-primary/50 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto size-5 text-muted-foreground/60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-card-foreground",
									children: fileB ? fileB.name : "Upload Document B (PDF / .txt)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									className: "hidden",
									accept: ".pdf,.txt,.md,text/plain,application/pdf",
									onChange: (e) => setFileB(e.target.files?.[0] ?? null)
								})
							]
						}),
						fileB && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "mt-1 text-[11px] h-7",
							onClick: () => setFileB(null),
							children: "Remove file B"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "text-b",
								className: "text-[11px] font-mono text-muted-foreground",
								children: "Or paste text for Document B"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "text-b",
								value: textB,
								disabled: Boolean(fileB),
								placeholder: "Paste text for Document B here...",
								className: "mt-1 min-h-20 font-mono text-xs",
								onChange: (e) => setTextB(e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono",
							children: "Combined Pricing & Comparison Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-background/50 p-3 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Pages Doc A",
									children: pagesA > 0 ? pagesA : 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Pages Doc B",
									children: pagesB > 0 ? pagesB : 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Total Combined Pages",
									children: combinedPages
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Combined Price",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-primary",
										children: combinedPrice
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							className: "w-full font-semibold shadow-md text-sm gap-2 h-11",
							disabled: running || !hasBothDocs,
							onClick: () => void handlePayAndCompare(),
							children: running ? "Comparing…" : `Pay & Compare Both Documents (${combinedPrice})`
						}),
						!hasBothDocs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-muted-foreground text-center",
							children: "↑ Provide both Document A and Document B above to enable comparison."
						}),
						!wallet.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-muted-foreground text-center",
							children: "Connect Pera Wallet in header to sign x402 payment"
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive font-mono",
							role: "alert",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error.message }),
								error.action === "connect" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "sm",
									className: "mt-2",
									onClick: () => void wallet.connect(),
									children: "Connect Pera Wallet"
								}),
								error.action === "fund" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-2 inline-block font-mono text-[11px] underline underline-offset-2",
									href: "https://bank.testnet.algorand.network/",
									target: "_blank",
									rel: "noreferrer",
									children: "open the Algorand testnet dispenser →"
								})
							]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6 lg:col-span-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card p-5 min-h-[480px] flex flex-col justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/80 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Side-by-Side Comparison Output" })]
						}), result?.comparison && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded",
							children: "Doc A vs Doc B"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-border/60 py-2.5 font-mono text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground uppercase block text-[10px]",
								children: "Pages"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-semibold",
								children: combinedPages
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground uppercase block text-[10px]",
								children: "Price"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-semibold",
								children: combinedPrice
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground uppercase block text-[10px]",
								children: "Payment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: paymentStatus === "failed" ? "text-destructive font-semibold" : "text-foreground font-semibold",
								children: paymentStatus === "not_started" ? "idle" : PHASE_LABEL[paymentStatus]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground uppercase block text-[10px]",
								children: "Outcome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-semibold",
								children: result?.comparison ? "settled" : running ? "paying…" : "—"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: result?.comparison ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border/60 bg-background/40 p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownContent, { children: result.comparison })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 font-mono text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Combined pages paid",
										children: result.combinedPages
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
										label: "Price paid",
										children: [
											result.pricePaid,
											" (",
											result.amountPaid,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Transaction",
										children: result.explorer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/receipt/$txId",
											params: { txId: result.txId ?? "" },
											className: "text-primary underline-offset-2 hover:underline",
											children: result.txId
										}) : result.txId ?? "—"
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-24 text-center text-sm text-muted-foreground font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mx-auto size-8 opacity-40 mb-2" }), "Structured comparison of Document A vs Document B will appear here after payment."]
						})
					})
				] })
			})
		})]
	});
}
/**
* AuditTrailWidget — Frontend component for live cryptographic log verification,
* Receipt Verification Service, and Agent Trust Score lookup.
*
* Supports automatic verification when txId / address are passed post-settlement.
*/
function AuditTrailWidget({ autoTxId, autoAddress }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [audit, setAudit] = (0, import_react.useState)(null);
	const [searchTxId, setSearchTxId] = (0, import_react.useState)("");
	const [verifyingReceipt, setVerifyingReceipt] = (0, import_react.useState)(false);
	const [receiptResult, setReceiptResult] = (0, import_react.useState)(null);
	const [searchAddress, setSearchAddress] = (0, import_react.useState)("");
	const [checkingScore, setCheckingScore] = (0, import_react.useState)(false);
	const [trustScoreResult, setTrustScoreResult] = (0, import_react.useState)(null);
	async function handleVerify() {
		setLoading(true);
		try {
			const res = await fetch("/api/audit/verify");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			setAudit(data);
		} catch {} finally {
			setLoading(false);
		}
	}
	async function verifyReceiptForTx(txIdToVerify) {
		if (!txIdToVerify.trim()) return;
		setVerifyingReceipt(true);
		setReceiptResult(null);
		try {
			const data = await (await fetch(`/api/receipt?txId=${encodeURIComponent(txIdToVerify.trim())}`)).json();
			setReceiptResult(data);
		} catch (err) {
			setReceiptResult({
				verified: false,
				txId: txIdToVerify.trim(),
				timestamp: "",
				route: "",
				pages: 0,
				pricePaid: "",
				payer: "",
				onChainVerified: false,
				explorer: "",
				error: "Lookup failed",
				reason: err instanceof Error ? err.message : String(err)
			});
		} finally {
			setVerifyingReceipt(false);
		}
	}
	async function checkTrustScoreForAddress(addressToCheck) {
		if (!addressToCheck.trim()) return;
		setCheckingScore(true);
		setTrustScoreResult(null);
		try {
			const data = await (await fetch(`/api/trust-score?address=${encodeURIComponent(addressToCheck.trim())}`)).json();
			setTrustScoreResult(data);
		} catch (err) {
			setTrustScoreResult({
				address: addressToCheck.trim(),
				trustScore: 0,
				totalTransactions: 0,
				totalVolumeUsd: "$0.00",
				successRate: null,
				firstSeen: null,
				lastSeen: null,
				error: "Lookup failed",
				reason: err instanceof Error ? err.message : String(err)
			});
		} finally {
			setCheckingScore(false);
		}
	}
	(0, import_react.useEffect)(() => {
		if (autoTxId) {
			setSearchTxId(autoTxId);
			verifyReceiptForTx(autoTxId);
			handleVerify();
		}
	}, [autoTxId]);
	(0, import_react.useEffect)(() => {
		if (autoAddress) {
			setSearchAddress(autoAddress);
			checkTrustScoreForAddress(autoAddress);
		}
	}, [autoAddress]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5 space-y-5 font-mono text-xs shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TAMPER-EVIDENT AUDIT TRAIL" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							disabled: loading,
							onClick: () => void handleVerify(),
							className: "text-xs h-7 gap-1 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3 ${loading ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Verifying…" : "Re-verify chain" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground leading-relaxed",
						children: "Every request and payment log entry is cryptographically SHA-256 hashed and linked to the previous entry’s hash."
					}),
					audit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/70 bg-background/50 p-3 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Chain Status:"
								}), audit.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-bold text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), " ✅ VERIFIED INTEGRITY"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-bold text-destructive",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5" }),
										" ❌ CHAIN BROKEN at entry #",
										audit.brokenAt
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Total Verified Entries:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: audit.totalEntries
								})]
							}),
							audit.brokenAt !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded bg-destructive/10 border border-destructive/30 p-2 text-[11px] text-destructive",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tampering Detected:" }),
									" ",
									audit.details
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground pt-1 border-t border-border/40 flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Genesis: 0000000000000000..." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Last checked: ", new Date(audit.verifiedAt).toLocaleTimeString()] })]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-4 border-t border-border/60 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INDEPENDENT RECEIPT VERIFICATION SERVICE" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground leading-relaxed",
						children: "Paste any Algorand transaction ID to independently verify log hashes and testnet on-chain settlement."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: searchTxId,
							placeholder: "Paste Algorand TxID (e.g. WD4FH3...)",
							className: "font-mono text-xs h-8 flex-1",
							onChange: (e) => setSearchTxId(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: verifyingReceipt || !searchTxId.trim(),
							className: "h-8 text-xs font-mono font-semibold",
							onClick: () => void verifyReceiptForTx(searchTxId),
							children: verifyingReceipt ? "Verifying…" : "Verify Receipt"
						})]
					}),
					receiptResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border/80 bg-background/60 p-3 space-y-2 text-xs",
						children: receiptResult.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/40 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Receipt Found in Audit Chain" })]
							}), receiptResult.onChainVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold",
								children: "✅ ON-CHAIN VERIFIED"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold",
								children: "⚠️ UNVERIFIED ON-CHAIN"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 font-mono text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Route Paid:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: receiptResult.route
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Price Paid:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-semibold",
										children: receiptResult.pricePaid
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payer:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground truncate max-w-[200px]",
										children: receiptResult.payer
									})]
								}),
								receiptResult.auditChain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-1 border-t border-border/40 text-[10px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate",
										children: ["Entry Hash: ", receiptResult.auditChain.entryHash]
									})
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								receiptResult.error,
								": ",
								receiptResult.reason ?? "Receipt not found in server log."
							] })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-4 border-t border-border/60 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AGENT TRUST SCORE LOOKUP" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground leading-relaxed",
						children: "Check any Algorand address reliability score (0-100) computed from real PagePay transaction history."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: searchAddress,
							placeholder: "Paste Algorand Address (e.g. EVEHMX...)",
							className: "font-mono text-xs h-8 flex-1",
							onChange: (e) => setSearchAddress(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: checkingScore || !searchAddress.trim(),
							className: "h-8 text-xs font-mono font-semibold",
							onClick: () => void checkTrustScoreForAddress(searchAddress),
							children: checkingScore ? "Calculating…" : "Check Score"
						})]
					}),
					trustScoreResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border/80 bg-background/60 p-3 space-y-2 text-xs font-mono",
						children: trustScoreResult.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								trustScoreResult.error,
								": ",
								trustScoreResult.reason
							] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/40 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Trust Score Rating:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-base font-bold text-primary",
								children: [trustScoreResult.trustScore, " / 100"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Settled Transactions:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: trustScoreResult.totalTransactions
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total USD Volume:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: trustScoreResult.totalVolumeUsd
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Settlement Success Rate:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: trustScoreResult.successRate !== null ? `${trustScoreResult.successRate}%` : "N/A"
									})]
								}),
								trustScoreResult.firstSeen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-1 border-t border-border/40 text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "First Activity:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(trustScoreResult.firstSeen).toLocaleTimeString() })]
								})
							]
						})] })
					})
				]
			})
		]
	});
}
/**
* Agent Spend Policy Guard for PagePay.
*
* A client-side policy layer that sits in front of PagePay's x402 payment client.
* Autonomously evaluates spend limits, session budgets, allowed modes, and allowed
* endpoints BEFORE any payment transaction is constructed, signed, or submitted.
*/
var AgentSessionTracker = class {
	sessionId;
	totalSpentUsd = 0;
	history = [];
	constructor(sessionId = `session_${Date.now()}`) {
		this.sessionId = sessionId;
	}
	getSpentUsd() {
		return Number(this.totalSpentUsd.toFixed(4));
	}
	getRemainingBudgetUsd(policy) {
		const rem = policy.sessionBudgetUsd - this.totalSpentUsd;
		return Math.max(0, Number(rem.toFixed(4)));
	}
	recordSpend(amountUsd) {
		this.totalSpentUsd += amountUsd;
	}
	addHistory(entry) {
		this.history.push(entry);
	}
	getHistory() {
		return this.history;
	}
	reset() {
		this.totalSpentUsd = 0;
		this.history = [];
	}
};
/** Default permissive policy for fallback. */
var DEFAULT_AGENT_POLICY = {
	maxPricePerRequestUsd: .1,
	sessionBudgetUsd: 1,
	allowedModes: [
		"summary",
		"action_items",
		"key_risks",
		"compliance_check",
		"checklist"
	],
	allowedEndpoints: [
		"/api/summarize",
		"/api/summarize/range",
		"/api/compare"
	]
};
/**
* Perform pre-flight policy evaluation on intended request parameters.
* Checks mode & endpoint permissions BEFORE any network quote request.
*/
function checkPreflightPolicy(endpoint, mode, policy) {
	let path = endpoint.split("?")[0];
	try {
		if (path.startsWith("http://") || path.startsWith("https://")) path = new URL(path).pathname;
	} catch {}
	if (!policy.allowedModes.includes(mode)) return {
		allowed: false,
		ruleViolated: "mode_disallowed",
		reason: `Blocked by spend policy: extraction mode '${mode}' is not in allowedModes [${policy.allowedModes.join(", ")}].`
	};
	if (policy.allowedEndpoints.length > 0 && !policy.allowedEndpoints.includes(path)) return {
		allowed: false,
		ruleViolated: "endpoint_disallowed",
		reason: `Blocked by spend policy: endpoint '${path}' is not in allowedEndpoints [${policy.allowedEndpoints.join(", ")}].`
	};
	return null;
}
/**
* Evaluate price and session budget against the 402 quote response.
* Runs BEFORE constructing or signing any Algorand transaction.
*/
function checkQuotePolicy(quotedPages, pricePerPageUsd, policy, session) {
	const quotedPriceUsd = Number((quotedPages * pricePerPageUsd).toFixed(4));
	const currentSpent = session.getSpentUsd();
	const remainingBudget = session.getRemainingBudgetUsd(policy);
	if (quotedPriceUsd > policy.maxPricePerRequestUsd) return {
		allowed: false,
		ruleViolated: "max_price",
		quotedPriceUsd,
		quotedPages,
		remainingBudgetUsd: remainingBudget,
		currentSpentUsd: currentSpent,
		reason: `Blocked by spend policy: quoted price ($${quotedPriceUsd.toFixed(2)}) exceeds max price per request cap ($${policy.maxPricePerRequestUsd.toFixed(2)}).`
	};
	if (currentSpent + quotedPriceUsd > policy.sessionBudgetUsd) return {
		allowed: false,
		ruleViolated: "session_budget",
		quotedPriceUsd,
		quotedPages,
		remainingBudgetUsd: remainingBudget,
		currentSpentUsd: currentSpent,
		reason: `Blocked by spend policy: request price ($${quotedPriceUsd.toFixed(2)}) would exceed remaining session budget ($${remainingBudget.toFixed(2)} remaining of $${policy.sessionBudgetUsd.toFixed(2)} budget, $${currentSpent.toFixed(2)} spent).`
	};
	return {
		allowed: true,
		quotedPriceUsd,
		quotedPages,
		remainingBudgetUsd: remainingBudget - quotedPriceUsd,
		currentSpentUsd: currentSpent
	};
}
/**
* Execute an agent request wrapped with the Agent Spend Policy Guard.
*
* Reuses the existing payAndFetch client logic. Guarantees that if a policy
* rule is violated, NO transaction is constructed, signed, or submitted.
*/
async function runAgentWithPolicy(endpoint, init, signer, policy, session, mode = "summary", options = {}) {
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const preflightViolation = checkPreflightPolicy(endpoint, mode, policy);
	if (preflightViolation) {
		session.addHistory({
			timestamp,
			endpoint,
			mode,
			quotedPriceUsd: 0,
			status: "refused",
			ruleViolated: preflightViolation.ruleViolated,
			reason: preflightViolation.reason
		});
		return {
			allowed: false,
			policyCheck: preflightViolation,
			refusalReason: preflightViolation.reason
		};
	}
	console.log(`[Policy Guard] Pre-flight passed. Requesting 402 quote from ${endpoint}...`);
	let quoteRes;
	try {
		quoteRes = await fetch(endpoint, init);
	} catch (err) {
		throw new Error(`Failed to fetch price quote: ${err instanceof Error ? err.message : String(err)}`);
	}
	let pagesQuoted = 1;
	if (quoteRes.status === 402) try {
		const body = await quoteRes.clone().json();
		if (typeof body.pagesQuoted === "number") pagesQuoted = body.pagesQuoted;
	} catch {}
	const quoteCheck = checkQuotePolicy(pagesQuoted, .01, policy, session);
	if (!quoteCheck.allowed) {
		console.log(`[Policy Guard] 🛡️ REFUSED by policy: ${quoteCheck.reason}`);
		session.addHistory({
			timestamp,
			endpoint,
			mode,
			quotedPriceUsd: quoteCheck.quotedPriceUsd ?? 0,
			status: "refused",
			ruleViolated: quoteCheck.ruleViolated,
			reason: quoteCheck.reason
		});
		return {
			allowed: false,
			policyCheck: quoteCheck,
			refusalReason: quoteCheck.reason
		};
	}
	console.log(`[Policy Guard] ✅ Policy check PASSED ($${quoteCheck.quotedPriceUsd?.toFixed(2)} <= budget). Proceeding to sign and submit payment...`);
	const paidResult = await payAndFetch(endpoint, init, signer, options);
	if (paidResult.ok && paidResult.result) {
		const txId = paidResult.result["txId"] ?? void 0;
		const spentAmount = quoteCheck.quotedPriceUsd ?? .01;
		session.recordSpend(spentAmount);
		session.addHistory({
			timestamp,
			endpoint,
			mode,
			quotedPriceUsd: spentAmount,
			status: "allowed",
			txId
		});
	}
	return {
		allowed: true,
		policyCheck: quoteCheck,
		paidResult
	};
}
/**
* LiveDemo component — main interactive demo interface for PagePay.
*
* Provides single document summarization (with 5 extraction modes: Summary, Action Items,
* Key Risks, Compliance Check, Checklist), page range selection, dual-document comparison,
* autonomous agent policy enforcement ("Run as Agent"), and automatic post-settlement audit trail verification.
*/
var MAX_PAGES = 10;
var SESSION_TRACKER = new AgentSessionTracker();
var FAILURE_COPY = {
	cancelled: { message: "Payment was cancelled in Pera Wallet. Tap “Pay & Summarize” again when you're ready." },
	insufficient_funds: {
		message: "Your wallet needs testnet USDC (ASA 10458941) for the payment, plus a little testnet ALGO for fees. ALGO alone is not enough — get testnet USDC from a faucet, then retry.",
		action: "fund"
	},
	requirements_unreadable: { message: "The server's 402 payment requirements couldn't be read. Check the raw payload in Protocol proof below." },
	signing_failed: { message: "Pera Wallet couldn't sign the payment. On desktop Chrome/Edge, look for a new tab at web.perawallet.app and approve the USDC transfer — or scan the QR with the Pera mobile app. Make sure Pera is on Testnet." },
	verification_failed: { message: "Payment could not be verified on Algorand. This is usually temporary — wait a moment and try again." },
	quote_mismatch: { message: "The price changed between the quote and the payment. Press “Get a price” again to refresh the quote, then pay." },
	gateway_unavailable: { message: "The payment facilitator didn't respond in time. This is usually temporary — try again in a few seconds." },
	network: { message: "Lost connection while processing payment. Check your connection and try again." },
	bad_request: { message: "The document couldn't be read. Try a text-based PDF (not a scan) or paste the text." },
	server_error: { message: "Something went wrong on the server after the request was sent. Check Protocol proof below for the raw response." }
};
function Card({ title, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl border border-border bg-card p-5 transition-all shadow-sm", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-4",
			children: title
		}), children]
	});
}
function LiveDemo({ wallet }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("single");
	const [text, setText] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("summary");
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [quoting, setQuoting] = (0, import_react.useState)(false);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)(null);
	const [exchange, setExchange] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [settledTxId, setSettledTxId] = (0, import_react.useState)(null);
	const [settledAddress, setSettledAddress] = (0, import_react.useState)(null);
	const [policy, setPolicy] = (0, import_react.useState)(DEFAULT_AGENT_POLICY);
	const [showPolicyConfig, setShowPolicyConfig] = (0, import_react.useState)(false);
	const localPages = (0, import_react.useMemo)(() => {
		if (file) return null;
		const trimmed = text.trim();
		if (!trimmed) return null;
		const words = trimmed.split(/\s+/).filter(Boolean).length;
		return Math.max(1, Math.min(MAX_PAGES, Math.ceil(words / 500)));
	}, [file, text]);
	const summaryResult = (0, import_react.useMemo)(() => {
		if (!exchange || !exchange.ok) return null;
		return exchange.result ?? null;
	}, [exchange]);
	async function handleGetQuote() {
		if (!file && !text.trim()) {
			toast.error("Choose a file or paste text first.");
			return;
		}
		setQuoting(true);
		setError(null);
		try {
			let body;
			const headers = {};
			if (file) {
				const form = new FormData();
				form.append("file", file);
				body = form;
			} else {
				headers["content-type"] = "application/json";
				body = JSON.stringify({ text });
			}
			const response = await fetch("/api/price", {
				method: "POST",
				headers,
				body
			});
			const data = await response.json();
			if (!response.ok || !data.pages || !data.price) throw new Error(data.error ?? "Failed to calculate document page count");
			setQuote({
				pages: data.pages,
				price: data.price
			});
			toast.success(`Quote received: ${data.pages} page(s) · ${data.price}`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			toast.error(msg);
		} finally {
			setQuoting(false);
		}
	}
	async function handleExecuteFlow(isAgentMode) {
		if (!wallet.signer || !wallet.address) {
			setError({
				message: "Connect your Algorand Pera Wallet first to sign the x402 USDC payment.",
				action: "connect"
			});
			return;
		}
		if (!file && !text.trim()) {
			toast.error("Choose a file or paste text first.");
			return;
		}
		setRunning(true);
		setError(null);
		setExchange(null);
		setPhase("requesting_quote");
		try {
			let body;
			const headers = {};
			if (file) {
				const form = new FormData();
				form.append("file", file);
				form.append("mode", mode);
				body = form;
			} else {
				headers["content-type"] = "application/json";
				body = JSON.stringify({
					text,
					mode
				});
			}
			setPhase("signing_payment");
			const result = await runAgentWithPolicy("/api/summarize", {
				method: "POST",
				headers,
				body
			}, wallet.signer, policy, SESSION_TRACKER, mode);
			setExchange(result.paidResult ?? null);
			if (result.allowed && result.paidResult?.ok) {
				setPhase("complete");
				const resData = result.paidResult.result;
				if (resData?.txId) setSettledTxId(resData.txId);
				if (resData?.payer || wallet.address) setSettledAddress(resData?.payer ?? wallet.address);
				toast.success(isAgentMode ? "🤖 Agent Policy Guard approved & executed! Summary generated + auto audit trail verified." : "Document summarized! USDC payment settled on Algorand testnet.");
			} else {
				setPhase(null);
				if (!result.allowed) setError({ message: `Agent Spend Policy Refusal: ${result.refusalReason}` });
				else if (result.paidResult?.failureCode) setError(FAILURE_COPY[result.paidResult.failureCode] ?? { message: result.paidResult?.error ?? "Payment failed" });
				else setError({ message: result.paidResult?.error ?? "Request failed" });
			}
		} catch (err) {
			setPhase(null);
			setError({ message: err instanceof Error ? err.message : String(err) });
		} finally {
			setRunning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "demo",
		className: "relative border-t border-border/40 py-16 md:py-20 bg-background/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold font-mono tracking-tight sm:text-3xl text-foreground",
						children: "LIVE DEMO & INTERACTIVE FLOW"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground font-mono",
						children: "Select an extraction mode, inspect page-based quotes, execute pay-per-page AI processing, or run autonomously as an Agent."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-border/60 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveTab("single"),
						className: cn("px-4 py-2 text-xs font-mono font-semibold transition-all border-b-2 -mb-px", activeTab === "single" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"),
						children: "📄 Single Document Summarization"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveTab("compare"),
						className: cn("px-4 py-2 text-xs font-mono font-semibold transition-all border-b-2 -mb-px flex items-center gap-1.5", activeTab === "compare" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"),
						children: "⚖️ Compare Two Documents (Multi-Doc)"
					})]
				}),
				activeTab === "compare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareDemo, { wallet })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-8 lg:grid-cols-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 lg:col-span-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								title: "1 · Document",
								className: "border-primary/20 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer flex-col gap-1.5 rounded-xl border border-dashed border-border bg-muted/20 px-5 py-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/40",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto size-6 text-muted-foreground/70" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold text-card-foreground",
												children: file ? file.name : "Choose a PDF or .txt document"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[11px] text-muted-foreground",
												children: [
													"up to 10 MB · ",
													MAX_PAGES,
													" pages max"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												className: "hidden",
												accept: ".pdf,.txt,.md,text/plain,application/pdf",
												onChange: (event) => {
													setFile(event.target.files?.[0] ?? null);
													setQuote(null);
												}
											})
										]
									}),
									file && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										className: "mt-2 text-xs",
										onClick: () => setFile(null),
										children: "Remove file"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "pp-text",
											className: "text-xs font-mono text-muted-foreground",
											children: "Or paste text"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "pp-text",
											value: text,
											disabled: Boolean(file),
											placeholder: "Paste document text here. 500 words counts as one page.",
											className: "mt-1.5 min-h-28 font-mono text-xs",
											onChange: (event) => {
												setText(event.target.value);
												setQuote(null);
											}
										})]
									}),
									localPages !== null && localPages > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-mono text-[11px] text-muted-foreground",
										children: [
											"≈ ",
											localPages,
											" page",
											localPages === 1 ? "" : "s",
											" · ",
											priceForPages(localPages)
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								title: "2 · Extraction Mode & Payment",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block",
												children: "Extraction Mode"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/30 p-1 font-mono text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("summary"),
														className: cn("py-1.5 px-2 text-center rounded transition-all", mode === "summary" ? "bg-background text-foreground shadow-sm font-semibold border border-border/50" : "text-muted-foreground hover:text-foreground"),
														children: "Summary"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("action_items"),
														className: cn("py-1.5 px-2 text-center rounded transition-all", mode === "action_items" ? "bg-background text-foreground shadow-sm font-semibold border border-border/50" : "text-muted-foreground hover:text-foreground"),
														children: "Action Items"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("key_risks"),
														className: cn("py-1.5 px-2 text-center rounded transition-all", mode === "key_risks" ? "bg-background text-foreground shadow-sm font-semibold border border-border/50" : "text-muted-foreground hover:text-foreground"),
														children: "Key Risks"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("compliance_check"),
														className: cn("py-1.5 px-2 text-center rounded transition-all col-span-2 sm:col-span-1", mode === "compliance_check" ? "bg-background text-foreground shadow-sm font-semibold border border-border/50 text-primary font-bold" : "text-muted-foreground hover:text-foreground"),
														children: "Compliance Check"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("checklist"),
														className: cn("py-1.5 px-2 text-center rounded transition-all col-span-1", mode === "checklist" ? "bg-background text-foreground shadow-sm font-semibold border border-border/50 text-primary font-bold" : "text-muted-foreground hover:text-foreground"),
														children: "Checklist"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-2 font-mono text-[11px] text-muted-foreground",
												children: [
													mode === "summary" && "Standard document overview & key points.",
													mode === "action_items" && "Extract concrete tasks, assignees, and deadlines.",
													mode === "key_risks" && "Identify risky, concerning clauses and severities.",
													mode === "compliance_check" && "Contract compliance checklist against parties, dates, breach, exit & governing law.",
													mode === "checklist" && "Flat, step-by-step implementation checklist (- [ ]) for operationalizing the document."
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeDemo, {
											wallet,
											defaultMode: mode
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-2 pt-2 border-t border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "sm",
													disabled: quoting || running || !file && !text.trim(),
													onClick: () => void handleGetQuote(),
													className: "text-xs font-mono",
													children: quoting ? "Quoting…" : "Get Price Quote"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													disabled: running || !file && !text.trim(),
													onClick: () => void handleExecuteFlow(false),
													className: "text-xs font-mono font-semibold",
													children: running ? "Processing…" : "Pay & Execute"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "secondary",
													disabled: running || !file && !text.trim(),
													onClick: () => void handleExecuteFlow(true),
													className: "text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: running ? "Agent Running…" : "🤖 Run as Agent" })]
												})
											]
										}), quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded border border-primary/30 bg-primary/10 p-2 text-center font-mono text-xs",
											children: [
												"Quoted: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [quote.pages, " page(s)"] }),
												" · ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary font-bold",
													children: quote.price
												})
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								title: "3 · Agent Spend Policy Guard",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 font-mono text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Max Per Request:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-foreground",
												children: [
													"$",
													policy.maxPricePerRequestUsd.toFixed(2),
													" USD"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Session Budget:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-foreground",
												children: [
													"$",
													policy.sessionBudgetUsd.toFixed(2),
													" USD"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Spent / Remaining:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-primary",
												children: [
													"$",
													SESSION_TRACKER.getSpentUsd().toFixed(2),
													" / $",
													SESSION_TRACKER.getRemainingBudgetUsd(policy).toFixed(2)
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											className: "w-full text-xs font-mono h-7 text-muted-foreground",
											onClick: () => setShowPolicyConfig(!showPolicyConfig),
											children: showPolicyConfig ? "Hide Policy Config" : "Configure Policy Rules"
										}),
										showPolicyConfig && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded border border-border/80 bg-background/50 p-3 space-y-3 pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] text-muted-foreground",
												children: "Max Price per Request ($)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "0.01",
												value: policy.maxPricePerRequestUsd,
												className: "h-7 text-xs font-mono mt-1",
												onChange: (e) => setPolicy({
													...policy,
													maxPricePerRequestUsd: Number(e.target.value)
												})
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] text-muted-foreground",
												children: "Session Budget ($)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "0.05",
												value: policy.sessionBudgetUsd,
												className: "h-7 text-xs font-mono mt-1",
												onChange: (e) => setPolicy({
													...policy,
													sessionBudgetUsd: Number(e.target.value)
												})
											})] })]
										})
									]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 lg:col-span-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Summary & Output",
							children: summaryResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border/80 bg-background/80 p-4 space-y-3 font-mono text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b border-border/40 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-foreground uppercase tracking-wider",
											children: ["Mode: ", summaryResult.mode ?? mode]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-primary font-bold",
											children: [summaryResult.pricePaid ?? "$0.01", " Settled"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "prose prose-invert prose-xs max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed",
										children: summaryResult.summary
									})]
								}), summaryResult.txId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate max-w-[240px]",
										children: ["TxID: ", summaryResult.txId]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: summaryResult.explorer,
										target: "_blank",
										rel: "noreferrer",
										className: "text-primary hover:underline flex items-center gap-1 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explorer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
									})]
								})]
							}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-destructive/40 bg-destructive/10 p-4 font-mono text-xs text-destructive space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Error:" }),
									" ",
									error.message
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-dashed border-border bg-muted/10 p-8 text-center font-mono text-xs text-muted-foreground",
								children: "Select an extraction mode and click “Pay & Execute” or “🤖 Run as Agent” to trigger x402 payment settlement and output."
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditTrailWidget, {
							autoTxId: settledTxId,
							autoAddress: settledAddress
						})]
					})]
				})
			]
		})
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
/**
* First-visit walkthrough for the PagePay live demo.
* Reuses the shadcn Dialog already in the project; fully skippable and reopenable.
*/
var SEEN_KEY = "pagepay.walkthrough.seen";
/** data-walkthrough attribute of the real element each step describes. */
var STEPS = [
	{
		target: "connect",
		title: "1 · Connect Pera Wallet",
		body: "Use “Connect Pera Wallet” in the header. On desktop, scan the QR with the Pera mobile app or use Pera Web at web.perawallet.app. Switch to Testnet and keep testnet USDC (not just ALGO) for payments."
	},
	{
		target: "document",
		title: "2 · Add a document",
		body: "Upload a PDF or .txt (up to 10 MB, 20 pages), or paste raw text. 500 words of pasted text counts as one page."
	},
	{
		target: "quote",
		title: "3 · Get a price",
		body: "“Get a price” parses your actual file server-side and returns the exact page count and USD price — the same numbers the payment will charge."
	},
	{
		target: "pay",
		title: "4 · Pay and summarize",
		body: "The first request comes back as HTTP 402 with payment requirements. Pera asks you to sign, the payment settles on Algorand, and the retry returns your summary."
	},
	{
		target: "summary",
		title: "5 · Read the result",
		body: "The summary card shows pages paid, the amount, and a link to the transaction. Request status and raw 402/200 payloads sit right below it."
	}
];
function highlight(target) {
	document.querySelectorAll("[data-walkthrough]").forEach((element) => {
		element.classList.remove("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background");
	});
	if (!target) return;
	const element = document.querySelector(`[data-walkthrough="${target}"]`);
	if (!element) return;
	element.classList.add("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background");
	element.scrollIntoView({
		behavior: "smooth",
		block: "center"
	});
}
function useWalkthrough() {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			if (!localStorage.getItem(SEEN_KEY)) setOpen(true);
		} catch {}
	}, []);
	return {
		open,
		setOpen,
		close: (0, import_react.useCallback)(() => {
			setOpen(false);
			try {
				localStorage.setItem(SEEN_KEY, "1");
			} catch {}
		}, [])
	};
}
function Walkthrough({ open, onClose }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const step = STEPS[index];
	(0, import_react.useEffect)(() => {
		if (!open) {
			highlight(null);
			return;
		}
		highlight(step.target);
	}, [open, step.target]);
	(0, import_react.useEffect)(() => {
		if (open) setIndex(0);
	}, [open]);
	function finish() {
		highlight(null);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (!next) finish();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-base",
					children: step.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-sm leading-relaxed",
					children: step.body
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] text-muted-foreground",
					children: [
						"step ",
						index + 1,
						" of ",
						STEPS.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: finish,
						children: "Skip"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [index > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => setIndex((current) => current - 1),
							children: "Back"
						}), index < STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => setIndex((current) => current + 1),
							children: "Next"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: finish,
							children: "Start using it"
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { Walkthrough as n, useWalkthrough as r, LiveDemo as t };
