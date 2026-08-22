import { o as __toESM } from "../_runtime.mjs";
import { n as useForm, r as require_react, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Button, r as cn, t as Badge } from "./button-BYtLCDFZ.mjs";
import { C as Bot, S as Check, b as CircleDashed, d as Play, g as Gavel, h as LoaderCircle, i as Sparkles, l as RotateCcw, n as X, t as Zap } from "../_libs/lucide-react.mjs";
import { r as MarketingPageStatic, t as Container } from "./MarketingPage-CksEsTz7.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BuXCp9gk.mjs";
import { t as Reveal } from "./Reveal-BSpiKaU7.mjs";
import { t as Label } from "./label-Dc12M0o7.mjs";
import { t as Textarea } from "./textarea-BmuPRPs2.mjs";
import { t as MarkdownContent } from "./MarkdownContent-BieHZhj0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DEMO_MODES, c as encodePaymentHeader, i as demoPriceForModel, l as mockSignature, o as DEMO_MODE_DESCRIPTIONS, r as DEMO_MODEL_PRICING, s as DEMO_MODE_LABELS, u as randomNonce } from "./router-CnXKmlGA.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/x402-demo-BO07T9uz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Raw HTTP request/response viewer — headers and payload verbatim. */
function HttpExchangeView({ exchange, defaultOpen = false }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	const badge = exchange.direction === "request" ? `${exchange.method ?? "POST"}` : `${exchange.status ?? ""} ${exchange.statusText ?? ""}`.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((value) => !value),
			className: "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex min-w-0 items-center gap-2 text-sm font-medium text-card-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("shrink-0 rounded px-2 py-0.5 font-mono text-[11px]", exchange.status === 402 ? "bg-accent text-accent-foreground" : exchange.status && exchange.status >= 400 ? "bg-destructive/15 text-destructive" : exchange.direction === "request" ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"),
					children: badge
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: exchange.title
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 font-mono text-[11px] text-muted-foreground",
				children: open ? "hide" : "show"
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t border-border px-4 py-3",
			children: [
				exchange.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "break-all font-mono text-[11px] text-muted-foreground",
					children: [
						exchange.method ?? "",
						" ",
						exchange.url
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
					children: exchange.direction === "request" ? "Request headers" : "Response headers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-44 overflow-auto rounded bg-muted p-3 font-mono text-[11px] leading-relaxed text-muted-foreground",
					children: Object.entries(exchange.headers).map(([key, value]) => `${key}: ${value}`).join("\n") || "(none)"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
					children: "Payload (verbatim)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-72 overflow-auto rounded bg-muted p-3 font-mono text-[11px] leading-relaxed text-card-foreground",
					children: exchange.body || "(empty)"
				})] })
			]
		})]
	});
}
var LEVEL_STYLES = {
	info: "text-accent-blue",
	warn: "text-accent-amber",
	error: "text-destructive",
	success: "text-accent-green"
};
var LEVEL_LABELS = {
	info: "INFO",
	warn: "WARN",
	error: "ERR ",
	success: "OK  "
};
/** Scrollable, monospace, colour-coded log console. */
function LogConsole({ entries, onClear }) {
	const endRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ block: "end" });
	}, [entries.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-4 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
				children: [
					"live log console · ",
					entries.length,
					" events"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClear,
				className: "font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground",
				children: "clear"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-auto bg-card px-4 py-3 font-mono text-[11px] leading-relaxed",
			children: [
				entries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "waiting for events — run a simulation to stream protocol logs…"
				}),
				entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 py-[2px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-muted-foreground",
							children: entry.timestamp.slice(11, 23)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("shrink-0 whitespace-pre", LEVEL_STYLES[entry.level]),
							children: LEVEL_LABELS[entry.level]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-muted-foreground",
							children: [
								"[",
								entry.source,
								"]"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 break-words text-foreground",
							children: [entry.message, entry.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [" — ", entry.detail]
							})]
						})
					]
				}, entry.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
			]
		})]
	});
}
/** Animated payment/protocol state indicator. */
function PaymentTimeline({ steps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-1",
		children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-500", step.state === "done" && "border-primary bg-primary/15 text-primary", step.state === "active" && "scale-110 border-primary bg-primary/20 text-primary shadow-[0_0_0_4px] shadow-primary/10", step.state === "error" && "border-destructive bg-destructive/15 text-destructive", step.state === "idle" && "border-border text-muted-foreground"),
					children: [
						step.state === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }),
						step.state === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
						step.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }),
						step.state === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDashed, { className: "h-3.5 w-3.5" })
					]
				}), index < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("my-1 w-px flex-1 transition-colors duration-500", step.state === "done" ? "bg-primary/50" : "bg-border") })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-sm font-medium transition-colors", step.state === "idle" ? "text-muted-foreground" : "text-card-foreground"),
					children: step.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-muted-foreground",
					children: step.hint
				})]
			})]
		}, step.key))
	});
}
function CurlExportButton({ method, url, body, headers, label = "Copy curl" }) {
	const curl = buildCurl(method, url, body, headers);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "secondary",
		size: "sm",
		className: "font-mono text-[11px]",
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(curl);
				toast.success("curl copied to clipboard");
			} catch {
				toast.error("Could not copy — select and copy manually");
			}
		},
		children: label
	});
}
function buildCurl(method, url, body, headers = {}) {
	const lines = [`curl -X ${method.toUpperCase()} '${url}' \\`];
	for (const [key, value] of Object.entries(headers)) lines.push(`  -H '${key}: ${value.replace(/'/g, "'\\''")}' \\`);
	if (body) lines.push(`  -d '${body.replace(/'/g, "'\\''")}'`);
	else lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, "");
	return lines.join("\n");
}
function decodeHeader(value) {
	if (!value) return null;
	try {
		const json = atob(value);
		return JSON.parse(json);
	} catch {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
}
function HeaderPanel({ title, raw, decoded }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
				children: title
			}), raw ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "outline",
				className: "font-mono text-[10px]",
				children: [raw.length, " chars"]
			}) : null]
		}), !raw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-mono text-[11px] text-muted-foreground",
			children: "— not captured —"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "mt-2 max-h-32 overflow-auto font-mono text-[10px] leading-relaxed text-muted-foreground",
			children: raw
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "mt-2 max-h-48 overflow-auto rounded-md bg-secondary p-2 font-mono text-[10px] leading-relaxed text-foreground",
			children: JSON.stringify(decoded, null, 2)
		})] })]
	});
}
/** Side-by-side decode of x402 payment headers. */
function PaymentHeaderInspector({ paymentRequired, paymentSignature, paymentResponse }) {
	if (!(paymentRequired || paymentSignature || paymentResponse)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-[11px] text-muted-foreground",
		children: "Run a payment flow to inspect PAYMENT-REQUIRED, PAYMENT-SIGNATURE, and PAYMENT-RESPONSE headers."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderPanel, {
				title: "PAYMENT-REQUIRED",
				raw: paymentRequired,
				decoded: decodeHeader(paymentRequired)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderPanel, {
				title: "PAYMENT-SIGNATURE",
				raw: paymentSignature,
				decoded: decodeHeader(paymentSignature)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderPanel, {
				title: "PAYMENT-RESPONSE",
				raw: paymentResponse,
				decoded: decodeHeader(paymentResponse)
			})
		]
	});
}
var STORAGE_KEY = "pagepay.x402-demo.guided-tour";
/**
* Auto-plays Happy path → Test Mode once per browser, demonstrating the protocol sandbox.
*/
function useX402GuidedTour({ onSelectHappy, onRunTestMode, enabled }) {
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!enabled || started.current) return;
		try {
			if (localStorage.getItem(STORAGE_KEY) === "done") return;
		} catch {}
		started.current = true;
		const timer = window.setTimeout(async () => {
			onSelectHappy();
			await new Promise((r) => setTimeout(r, 900));
			await onRunTestMode();
			try {
				localStorage.setItem(STORAGE_KEY, "done");
			} catch {}
			document.getElementById("x402-http-exchange")?.scrollIntoView({ behavior: "smooth" });
		}, 1200);
		return () => window.clearTimeout(timer);
	}, [
		enabled,
		onSelectHappy,
		onRunTestMode
	]);
}
function resetX402GuidedTour() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {}
}
var formSchema = objectType({
	prompt: stringType().trim().min(8, "Give the gated resource at least 8 characters of context.").max(2e3, "Keep the prompt under 2000 characters."),
	model: enumType(["openai/gpt-oss-20b", "qwen/qwen3.6-27b"])
});
var STEP_DEFS = [
	{
		key: "request",
		label: "Unpaid request",
		hint: "POST /api/x402-demo — no X-Payment header"
	},
	{
		key: "challenge",
		label: "402 Payment Required",
		hint: "server returns payment requirements"
	},
	{
		key: "construct",
		label: "X-Payment constructed",
		hint: "exact scheme payload, base64-encoded"
	},
	{
		key: "authorize",
		label: "Payment authorized",
		hint: "payload verified by the resource server"
	},
	{
		key: "settle",
		label: "Settlement complete",
		hint: "facilitator confirms the transfer"
	},
	{
		key: "unlock",
		label: "Resource unlocked",
		hint: "Groq generates the gated content"
	}
];
var MOCK_PAY_TO = "PAGEPAYDEMOMERCHANTADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var MOCK_PAYER = "DEMOWALLETPAYERADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var NETWORK = "algorand:testnet-v1.0";
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var uidCounter = 0;
var uid = (prefix) => `${prefix}-${uidCounter += 1}-${Math.random().toString(36).slice(2, 8)}`;
function X402DemoApp() {
	const [mode, setMode] = (0, import_react.useState)("happy");
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [steps, setSteps] = (0, import_react.useState)({
		request: "idle",
		challenge: "idle",
		construct: "idle",
		authorize: "idle",
		settle: "idle",
		unlock: "idle"
	});
	const [exchanges, setExchanges] = (0, import_react.useState)([]);
	const [result, setResult] = (0, import_react.useState)(null);
	const [failure, setFailure] = (0, import_react.useState)(null);
	const [running, setRunning] = (0, import_react.useState)(null);
	const [judgeMode, setJudgeMode] = (0, import_react.useState)(true);
	const [lastCurl, setLastCurl] = (0, import_react.useState)(null);
	const [headerSnapshot, setHeaderSnapshot] = (0, import_react.useState)({});
	const form = useForm({
		resolver: u(formSchema),
		defaultValues: {
			prompt: "Brief a technical audience on why HTTP 402 machine payments unlock new agent business models.",
			model: "openai/gpt-oss-20b"
		}
	});
	const selectedModel = form.watch("model");
	const modelPricing = demoPriceForModel(selectedModel);
	const log = (0, import_react.useCallback)((level, source, message, detail) => {
		const id = uid("log");
		setLogs((previous) => [...previous, {
			id,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			level,
			source,
			message,
			...detail ? { detail } : {}
		}]);
	}, []);
	useX402GuidedTour({
		enabled: running === null && !result,
		onSelectHappy: () => setMode("happy"),
		onRunTestMode: () => form.handleSubmit((values) => void runSimulation(values))()
	});
	const setStep = (0, import_react.useCallback)((key, state) => {
		setSteps((previous) => ({
			...previous,
			[key]: state
		}));
	}, []);
	const resetRun = (0, import_react.useCallback)(() => {
		setSteps({
			request: "idle",
			challenge: "idle",
			construct: "idle",
			authorize: "idle",
			settle: "idle",
			unlock: "idle"
		});
		setExchanges([]);
		setResult(null);
		setFailure(null);
	}, []);
	const pushExchange = (0, import_react.useCallback)((exchange) => {
		const id = uid("ex");
		setExchanges((previous) => [...previous, {
			...exchange,
			id
		}]);
	}, []);
	const drainServerLog = (0, import_react.useCallback)((entries) => {
		for (const entry of entries ?? []) log(entry.level, "server", entry.message, entry.detail);
	}, [log]);
	function buildPayload(model) {
		const pricing = demoPriceForModel(model);
		const nonce = randomNonce();
		return {
			x402Version: 1,
			scheme: "exact",
			network: NETWORK,
			payload: {
				from: MOCK_PAYER,
				to: MOCK_PAY_TO,
				asset: "10458941",
				amount: pricing.amount,
				nonce,
				validUntil: Math.floor(Date.now() / 1e3) + 60,
				signature: mockSignature(nonce)
			}
		};
	}
	async function runAsAgent(values) {
		setMode("happy");
		log("info", "agent", "Agent autopay started — zero UI clicks");
		if (judgeMode) {
			await runSimulation(values);
			return;
		}
		await runLive(values);
	}
	/** Pure client-side simulation — no network, no payment, all states shown. */
	async function runSimulation(values) {
		resetRun();
		setRunning("simulated");
		log("info", "test-mode", `Starting simulated x402 flow`, `mode=${mode}`);
		setStep("request", "active");
		await sleep(450);
		pushExchange({
			title: "Unpaid request → /api/x402-demo",
			direction: "request",
			method: "POST",
			url: "/api/x402-demo",
			headers: {
				"content-type": "application/json",
				accept: "application/json"
			},
			body: JSON.stringify({
				prompt: values.prompt,
				mode,
				model: values.model
			}, null, 2)
		});
		log("info", "http", "POST /api/x402-demo (simulated, no X-Payment header)");
		setStep("request", "done");
		setStep("challenge", "active");
		await sleep(500);
		const pricing = demoPriceForModel(values.model);
		const requirements = {
			x402Version: 1,
			accepts: [{
				scheme: "exact",
				network: NETWORK,
				resource: "/api/x402-demo",
				payTo: MOCK_PAY_TO,
				asset: "10458941",
				amount: pricing.amount,
				amountFormatted: pricing.amountFormatted,
				maxTimeoutSeconds: 60,
				extra: {
					name: "USDC",
					decimals: 6,
					model: values.model,
					modelLabel: pricing.label
				}
			}],
			error: "Payment required"
		};
		pushExchange({
			title: "402 Payment Required (simulated)",
			direction: "response",
			status: 402,
			statusText: "Payment Required",
			headers: {
				"content-type": "application/json",
				"x-payment-required": "true",
				"x-x402-version": "1",
				"www-authenticate": `x402 network="${NETWORK}", scheme="exact", amount="${pricing.amount}", asset="10458941"`
			},
			body: JSON.stringify(requirements, null, 2)
		});
		setHeaderSnapshot({ paymentRequired: btoa(JSON.stringify(requirements)) });
		log("warn", "x402", "402 Payment Required received", `${pricing.amountFormatted} · ${values.model}`);
		setStep("challenge", "done");
		setStep("construct", "active");
		await sleep(450);
		const payload = buildPayload(values.model);
		const header = encodePaymentHeader(payload);
		pushExchange({
			title: "Retry request with X-Payment header",
			direction: "request",
			method: "POST",
			url: "/api/x402-demo",
			headers: {
				"content-type": "application/json",
				"x-payment": header
			},
			body: JSON.stringify({
				prompt: values.prompt,
				mode,
				model: values.model
			}, null, 2)
		});
		setHeaderSnapshot((prev) => ({
			...prev,
			paymentSignature: header
		}));
		setLastCurl(buildCurl("POST", `${window.location.origin}/api/x402-demo`, JSON.stringify({
			prompt: values.prompt,
			mode,
			model: values.model
		}), {
			"content-type": "application/json",
			"x-payment": header
		}));
		log("info", "x402", "X-Payment header constructed", `${header.slice(0, 40)}…`);
		setStep("construct", "done");
		if (mode === "invalid") {
			setStep("authorize", "active");
			await sleep(600);
			setStep("authorize", "error");
			pushExchange({
				title: "400 Invalid payment token (simulated)",
				direction: "response",
				status: 400,
				statusText: "Bad Request",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					error: "Invalid payment token",
					reason: "signature did not verify"
				}, null, 2)
			});
			log("error", "x402", "Payment token rejected", "signature did not verify");
			setFailure("Invalid payment token — the resource server rejected the X-Payment payload.");
			toast.error("Invalid payment token (simulated)");
			setRunning(null);
			return;
		}
		setStep("authorize", "active");
		await sleep(650);
		log("success", "x402", "Payment authorized", `payer=${MOCK_PAYER.slice(0, 10)}…`);
		setStep("authorize", "done");
		setStep("settle", "active");
		if (mode === "timeout") {
			await sleep(1600);
			setStep("settle", "error");
			pushExchange({
				title: "504 Gateway Timeout (simulated)",
				direction: "response",
				status: 504,
				statusText: "Gateway Timeout",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					error: "Gateway timeout",
					reason: "settlement window expired"
				}, null, 2)
			});
			log("error", "facilitator", "Settlement timed out", "maxTimeoutSeconds exceeded");
			setFailure("Payment timed out before settlement — nothing was charged, retry is safe.");
			toast.error("Payment timed out (simulated)");
			setRunning(null);
			return;
		}
		if (mode === "failed") {
			await sleep(900);
			setStep("settle", "error");
			pushExchange({
				title: "402 Payment failed (simulated)",
				direction: "response",
				status: 402,
				statusText: "Payment Required",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					error: "Payment failed",
					reason: "insufficient_funds"
				}, null, 2)
			});
			log("error", "facilitator", "Settlement rejected", "insufficient_funds");
			setFailure("Settlement failed: insufficient_funds. Top up the wallet and retry.");
			toast.error("Payment failed (simulated)");
			setRunning(null);
			return;
		}
		await sleep(900);
		const transaction = `MOCKTX${payload.payload.nonce.slice(0, 20).toUpperCase()}`;
		log("success", "facilitator", "Settlement confirmed", `txid=${transaction}`);
		setStep("settle", "done");
		setStep("unlock", "active");
		await sleep(700);
		const simulatedContent = [
			"**Simulated gated resource** (Test Mode — no payment and no Groq call were made).",
			"",
			"- The resource server answered 402 with machine-readable payment requirements.",
			"- The client constructed a base64 `X-Payment` payload under the `exact` scheme.",
			"- Verification and settlement succeeded, and the paywalled response was released.",
			"",
			"Switch off Test Mode to run the same flow against `/api/x402-demo` with a live Groq completion."
		].join("\n");
		pushExchange({
			title: "200 OK — resource unlocked (simulated)",
			direction: "response",
			status: 200,
			statusText: "OK",
			headers: {
				"content-type": "application/json",
				"x-payment-response": JSON.stringify({
					success: true,
					network: NETWORK,
					transaction
				})
			},
			body: JSON.stringify({
				unlocked: true,
				content: "…",
				model: values.model
			}, null, 2)
		});
		setHeaderSnapshot((prev) => ({
			...prev,
			paymentResponse: JSON.stringify({
				success: true,
				network: NETWORK,
				transaction
			})
		}));
		setResult({
			content: simulatedContent,
			model: values.model,
			latencyMs: 0,
			settlement: {
				success: true,
				network: NETWORK,
				transaction,
				payer: MOCK_PAYER
			},
			simulated: true
		});
		log("success", "x402", "Resource unlocked", "simulated payload rendered");
		setStep("unlock", "done");
		toast.success("Simulated x402 flow complete");
		setRunning(null);
	}
	/** Real round-trip against /api/x402-demo (402 → X-Payment retry → Groq). */
	async function runLive(values) {
		resetRun();
		setRunning("live");
		const body = JSON.stringify({
			prompt: values.prompt,
			mode,
			model: values.model
		});
		log("info", "client", "Starting live x402 exchange", `mode=${mode} model=${values.model}`);
		try {
			setStep("request", "active");
			pushExchange({
				title: "Unpaid request → /api/x402-demo",
				direction: "request",
				method: "POST",
				url: "/api/x402-demo",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(JSON.parse(body), null, 2)
			});
			const first = await fetch("/api/x402-demo", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body
			});
			const firstText = await first.text();
			const firstHeaders = {};
			first.headers.forEach((value, key) => {
				firstHeaders[key] = value;
			});
			pushExchange({
				title: "Server challenge",
				direction: "response",
				status: first.status,
				statusText: first.statusText,
				headers: firstHeaders,
				body: firstText
			});
			setStep("request", "done");
			const firstJson = safeJson(firstText);
			drainServerLog(firstJson?.serverLog);
			if (first.status !== 402) {
				setStep("challenge", "error");
				log("error", "x402", `Expected 402, received ${first.status}`);
				setFailure(`Expected HTTP 402, received ${first.status}.`);
				toast.error("Unexpected server response");
				setRunning(null);
				return;
			}
			setStep("challenge", "done");
			log("warn", "x402", "402 Payment Required received", `${modelPricing.amountFormatted} · ${values.model}`);
			setStep("construct", "active");
			const payload = buildPayload(values.model);
			const header = mode === "invalid" ? "not-a-valid-base64-payment-token" : encodePaymentHeader(payload);
			setHeaderSnapshot({
				paymentRequired: firstHeaders["x-payment-required"],
				paymentSignature: header
			});
			setLastCurl(buildCurl("POST", `${window.location.origin}/api/x402-demo`, body, {
				"content-type": "application/json",
				"x-payment": header
			}));
			pushExchange({
				title: "Retry request with X-Payment header",
				direction: "request",
				method: "POST",
				url: "/api/x402-demo",
				headers: {
					"content-type": "application/json",
					"x-payment": header
				},
				body: JSON.stringify(payload, null, 2)
			});
			log("info", "x402", "X-Payment header attached", `${header.slice(0, 40)}…`);
			setStep("construct", "done");
			setStep("authorize", "active");
			const second = await fetch("/api/x402-demo", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-payment": header
				},
				body
			});
			const secondText = await second.text();
			const secondHeaders = {};
			second.headers.forEach((value, key) => {
				secondHeaders[key] = value;
			});
			pushExchange({
				title: second.ok ? "200 OK — resource unlocked" : `${second.status} paywall response`,
				direction: "response",
				status: second.status,
				statusText: second.statusText,
				headers: secondHeaders,
				body: secondText
			});
			const secondJson = safeJson(secondText);
			drainServerLog(secondJson?.serverLog);
			if (!second.ok) {
				setStep("authorize", second.status === 400 ? "error" : "done");
				if (second.status !== 400) setStep("settle", "error");
				const reason = secondJson?.reason ?? `Request failed with ${second.status}`;
				setFailure(reason);
				log("error", "x402", secondJson?.error ?? "Request failed", reason);
				toast.error(secondJson?.error ?? "Payment flow failed");
				setRunning(null);
				return;
			}
			setStep("authorize", "done");
			setStep("settle", "done");
			setStep("unlock", "active");
			setHeaderSnapshot((prev) => ({
				...prev,
				paymentResponse: secondHeaders["x-payment-response"]
			}));
			setResult({
				content: secondJson.content ?? "",
				model: secondJson.model ?? values.model,
				latencyMs: secondJson.latencyMs ?? 0,
				usage: secondJson.usage,
				settlement: secondJson.settlement ?? {
					success: true,
					network: NETWORK,
					transaction: "unknown",
					payer: MOCK_PAYER
				},
				simulated: false
			});
			setStep("unlock", "done");
			log("success", "groq", "Gated content rendered", `${secondJson.latencyMs ?? 0}ms`);
			toast.success("Resource unlocked");
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			log("error", "client", "Exchange threw", reason);
			setFailure(reason);
			toast.error("Exchange failed");
		} finally {
			setRunning(null);
		}
	}
	const timeline = (0, import_react.useMemo)(() => STEP_DEFS.map((definition) => ({
		...definition,
		state: steps[definition.key]
	})), [steps]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "relative py-10 md:py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-display-hero text-foreground",
					children: ["x402 Protocol Demo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 font-mono text-xs font-normal text-muted-foreground",
						children: "groq · gpt-oss / qwen"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground",
					children: "Watch an HTTP 402 paywall negotiate a machine payment end to end: challenge, signed PAYMENT-SIGNATURE header, settlement, and the unlocked Groq-generated resource."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px]",
							children: "scheme exact"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px]",
							children: NETWORK
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px]",
							children: [modelPricing.amountFormatted, " / request"]
						})
					]
				})]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mt-10 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 60,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border/80 bg-card/95 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "1 · Simulation mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: DEMO_MODE_DESCRIPTIONS[mode] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2",
									children: DEMO_MODES.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMode(value),
										className: cn("rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-300", mode === value ? "border-accent-green bg-accent-green/15 text-accent-green shadow-sm shadow-accent-green/10" : "border-border bg-muted/40 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"),
										children: DEMO_MODE_LABELS[value]
									}, value))
								}) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 120,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "border-border/80 bg-card/95 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: form.handleSubmit(runLive),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "2 · Gated request"
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "prompt",
													className: "text-xs text-muted-foreground",
													children: "What should the paid resource generate?"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													id: "prompt",
													...form.register("prompt"),
													className: "mt-1 min-h-28 font-mono text-xs"
												}),
												form.formState.errors.prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-destructive",
													children: form.formState.errors.prompt.message
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "model",
													className: "text-xs text-muted-foreground",
													children: "Groq model"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													id: "model",
													...form.register("model"),
													className: "mt-1 h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-xs text-foreground",
													children: Object.entries(DEMO_MODEL_PRICING).map(([id, p]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: id,
														children: [
															p.label,
															" — ",
															p.amountFormatted
														]
													}, id))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 font-mono text-[10px] text-muted-foreground",
													children: [
														"Quote includes model in ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
															className: "text-foreground",
															children: "extra.model"
														}),
														" ",
														"(",
														modelPricing.amount,
														" atomic USDC)"
													]
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gavel, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-sans text-xs text-foreground",
														children: "Judge wallet (no Pera)"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													size: "sm",
													variant: judgeMode ? "default" : "secondary",
													onClick: () => setJudgeMode((v) => !v),
													children: judgeMode ? "On" : "Off"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2 pt-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "submit",
														disabled: running !== null,
														className: "gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), running === "live" ? "Running exchange…" : "Run live x402 flow"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "button",
														variant: "secondary",
														disabled: running !== null,
														className: "gap-2",
														onClick: form.handleSubmit(runSimulation),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), running === "simulated" ? "Simulating…" : "Test Mode (no payment)"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "button",
														variant: "secondary",
														disabled: running !== null,
														className: "gap-2",
														onClick: form.handleSubmit(async (v) => {
															setRunning("agent");
															try {
																await runAsAgent(v);
															} finally {
																setRunning(null);
															}
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" }), running === "agent" ? "Agent running…" : "Run as agent"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "button",
														variant: "ghost",
														size: "sm",
														className: "gap-1 font-mono text-[11px]",
														onClick: () => {
															resetX402GuidedTour();
															toast.message("Guided tour will replay on next visit");
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), "Reset tour"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-[11px] text-muted-foreground",
												children: "Test Mode mocks every step client-side. The live flow calls the real /api/x402-demo route and Groq."
											})
										]
									})]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 180,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border/80 bg-card/95 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "3 · Payment status"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentTimeline, { steps: timeline }), failure && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive",
									children: failure
								})] })]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 100,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								id: "x402-http-exchange",
								className: "border-border/80 bg-card/95 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "HTTP exchange · raw headers & payloads"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: exchanges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Run a flow to capture each request and response verbatim."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: exchanges.map((exchange, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HttpExchangeView, {
										exchange,
										defaultOpen: index === 1
									}, exchange.id))
								}) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 140,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border/80 bg-card/95 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Payment header inspector"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentHeaderInspector, {
									paymentRequired: headerSnapshot.paymentRequired,
									paymentSignature: headerSnapshot.paymentSignature,
									paymentResponse: headerSnapshot.paymentResponse
								}), lastCurl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex flex-wrap items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurlExportButton, {
										method: "POST",
										url: `${typeof window !== "undefined" ? window.location.origin : ""}/api/x402-demo`,
										body: form.getValues("prompt") ? JSON.stringify({
											prompt: form.getValues("prompt"),
											mode,
											model: form.getValues("model")
										}) : void 0,
										headers: {
											"content-type": "application/json",
											...headerSnapshot.paymentSignature ? { "x-payment": headerSnapshot.paymentSignature } : {}
										}
									})
								}) : null] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 160,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "border-border/80 bg-card/95 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "p-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-80",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogConsole, {
											entries: logs,
											onClear: () => setLogs([])
										})
									})
								})
							})
						}),
						result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 80,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-accent-green/40 bg-card/95 shadow-md shadow-accent-green/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-accent-green",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Unlocked resource"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: [
											result.simulated ? "simulated" : "live",
											" · ",
											result.model,
											" ·",
											" ",
											result.latencyMs,
											"ms",
											result.usage?.total_tokens ? ` · ${result.usage.total_tokens} tokens` : ""
										]
									})]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "settled" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "text-card-foreground",
												children: String(result.settlement.success)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "network" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "text-card-foreground",
												children: result.settlement.network
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "txid" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "break-all text-card-foreground",
												children: result.settlement.transaction
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "payer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "break-all text-card-foreground",
												children: result.settlement.payer
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 rounded-lg border border-border/60 bg-background/40 p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownContent, { children: result.content })
									}),
									result.settlement.transaction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											size: "sm",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `/receipt/${encodeURIComponent(result.settlement.transaction)}`,
												children: "View receipt"
											})
										})
									})
								] })]
							})
						})
					]
				})]
			})]
		})
	});
}
function safeJson(text) {
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}
function X402DemoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingPageStatic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X402DemoApp, {}) });
}
//#endregion
export { X402DemoPage as component };
