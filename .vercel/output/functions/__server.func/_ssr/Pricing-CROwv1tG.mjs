import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Button, t as Badge } from "./button-BYtLCDFZ.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Pricing-CROwv1tG.js
var import_jsx_runtime = require_jsx_runtime();
var TIERS = [
	{
		name: "Autonomous Agent",
		price: "$0.01",
		unit: "per page",
		description: "Algorand Testnet USDC exact-metered pricing for AI Agents.",
		features: [
			"HTTP 402 exact scheme quotes",
			"5 Modes (Summary, Action Items, Key Risks, Compliance, Checklist)",
			"Agent Spend Policy Guard ($/request & $/session)",
			"Tamper-Evident SHA-256 Audit Trail"
		],
		cta: "Launch Live Demo",
		to: "/demo",
		highlighted: true
	},
	{
		name: "Multi-Doc Compare",
		price: "$0.01",
		unit: "per combined page",
		description: "Side-by-side AI document comparison with single atomic payment.",
		features: [
			"Combined page calculation",
			"Structural Document A vs B analysis",
			"Single 402 payment transaction",
			"Independent receipt verification"
		],
		cta: "Compare Documents",
		to: "/demo",
		highlighted: false
	},
	{
		name: "Developer API",
		price: "$0.00",
		unit: "public read",
		description: "Public read-only endpoints for receipts, trust scores, and audit verification.",
		features: [
			"GET /api/receipt (Receipt Verification)",
			"GET /api/trust-score (Address Reliability)",
			"GET /api/audit/verify (SHA-256 Chain Check)",
			"GET /api/tools (Agent Discovery)"
		],
		cta: "Read API Docs",
		to: "/docs",
		highlighted: false
	}
];
var FACTS = [
	{
		label: "Asset",
		value: "USDC (ASA 10458941)"
	},
	{
		label: "Network",
		value: "Algorand Testnet"
	},
	{
		label: "Scheme",
		value: "exact · x402 v2"
	},
	{
		label: "Facilitator",
		value: "facilitator.goplausible.xyz"
	}
];
function Pricing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "pricing",
		className: "border-b border-border py-20 md:py-24 font-mono",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-wider text-primary",
							children: "SIMPLE METERING"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground",
							children: "Machine Pricing & Capabilities"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-muted-foreground",
							children: "PagePay charges strictly per parsed page. No monthly subscriptions, no lock-in."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-6 lg:grid-cols-3",
					children: TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-col rounded-2xl border p-6 ${tier.highlighted ? "border-primary/50 bg-card ring-1 ring-primary/20" : "border-border bg-background"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold uppercase tracking-wider text-foreground",
									children: tier.name
								}), tier.highlighted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-primary/20 text-primary border border-primary/40 text-[10px]",
									children: "Live Flow"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-bold text-foreground",
									children: tier.price
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: tier.unit
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: tier.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-6 flex-1 space-y-2 text-xs text-muted-foreground",
								children: tier.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-bold",
										children: "✓"
									}), f]
								}, f))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: `mt-8 ${tier.highlighted ? "bg-primary text-primary-foreground font-semibold" : ""}`,
								variant: tier.highlighted ? "default" : "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: tier.to,
									children: tier.cta
								})
							})
						]
					}, tier.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4",
					children: FACTS.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: fact.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-foreground font-bold",
						children: fact.value
					})] }, fact.label))
				})
			]
		})
	});
}
//#endregion
export { Pricing as t };
