import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Button, t as Badge } from "./button-BYtLCDFZ.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as MarketingPage, t as Container } from "./MarketingPage-CksEsTz7.mjs";
import { t as MarketingCard } from "./MarketingCard-Rn82GG4V.mjs";
import { t as Reveal } from "./Reveal-BSpiKaU7.mjs";
import { t as SectionHeading } from "./SectionHeading-D8LF3TLA.mjs";
import { n as Walkthrough, r as useWalkthrough, t as LiveDemo } from "./Walkthrough-G4g-e9Gq.mjs";
import { t as Pricing } from "./Pricing-CROwv1tG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LandingPage-C1bPnU5x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HeroScene = (0, import_react.lazy)(() => import("./HeroScene-Czj5ZzcR.mjs").then((m) => ({ default: m.HeroScene })));
var FEATURES = [
	{
		title: "HTTP-native metering",
		body: "Every document request returns a machine-readable 402 with exact payment requirements — pages, price, asset, and pay-to address.",
		accent: "text-accent-green"
	},
	{
		title: "Algorand settlement",
		body: "Payments settle on Algorand Testnet via the GoPlausible facilitator. Verify, settle, then fulfill — no prepaid credits.",
		accent: "text-accent-violet"
	},
	{
		title: "Wallet-signed exact payments",
		body: "Pera Wallet signs an exact-AVM USDC transfer. Your API never holds keys; the client brings the payment header on retry.",
		accent: "text-accent-blue"
	},
	{
		title: "Developer-first proof",
		body: "Raw HTTP exchanges, tx IDs, and explorer links are surfaced in the UI so you can audit every step of the protocol.",
		accent: "text-accent-amber"
	}
];
var LOGOS = [
	"x402",
	"Algorand",
	"USDC",
	"Pera",
	"Groq"
];
function Hero({ onTryIt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden border-b border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid-marketing absolute inset-0 opacity-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] opacity-80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full rounded-full bg-accent-green/5 blur-3xl" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroScene, { className: "size-full" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, {
				className: "relative py-20 md:py-28 lg:py-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "rounded-full font-mono text-[10px]",
									children: "scheme: exact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "rounded-full font-mono text-[10px]",
									children: "algorand testnet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "rounded-full font-mono text-[10px]",
									children: "$0.01 / page"
								})
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: 80,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-display-large mt-8 text-foreground",
									children: [
										"Payments for",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-accent-green",
											children: " APIs"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"that read like HTTP."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 max-w-xl font-sans text-lg leading-relaxed text-muted-foreground",
									children: "PagePay is a SaaS-style demo of pay-per-page AI summarization: upload a document, receive HTTP 402, sign USDC on Algorand, get your summary on the retried request."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-10 flex flex-wrap gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											className: "rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90",
											onClick: onTryIt,
											children: "Start live demo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											variant: "secondary",
											className: "rounded-full",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/x402-demo",
												children: "Protocol sandbox"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											variant: "outline",
											className: "rounded-full",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/docs",
												children: "Read the docs"
											})
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 160,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-14 flex flex-wrap items-center gap-3",
								children: LOGOS.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border px-4 py-1.5 font-mono text-xs text-subtle",
									children: name
								}, name))
							})
						})
					]
				})
			})
		]
	});
}
function SocialProof() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border bg-secondary/50 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "flex flex-col items-start justify-between gap-6 md:flex-row md:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xl font-sans text-sm text-muted-foreground",
				children: "Built on the x402 exact-AVM scheme with a hosted facilitator, testnet USDC pricing, and Pera Wallet signing — the same primitives you would wire into any metered API product."
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 100,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-xs text-accent-green",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "402 → sign → settle → 200" })
				})
			})]
		})
	});
}
function FeatureGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border py-20 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Platform",
			title: "Everything you need to ship metered AI APIs",
			description: "From quote to settlement to fulfillment — PagePay demonstrates the full x402 lifecycle with production-shaped HTTP semantics."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid gap-6 md:grid-cols-2",
			children: FEATURES.map((feature, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: index * 90,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingCard, {
					title: feature.title,
					description: feature.body,
					accent: feature.accent,
					className: "h-full"
				})
			}, feature.title))
		})] })
	});
}
function CtaBand({ onTryIt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-border bg-card px-8 py-12 text-center md:px-16 md:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-display-hero text-foreground",
					children: "Ready to test a real 402 flow?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-lg font-sans text-muted-foreground",
					children: "Connect Pera on Testnet, fund USDC, and run pay-per-page summarization in under a minute — or explore the protocol sandbox with zero wallet setup."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							className: "rounded-full bg-primary px-8 text-primary-foreground",
							onClick: onTryIt,
							children: "Open live demo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "secondary",
							className: "rounded-full",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/x402-demo",
								children: "Protocol sandbox"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "outline",
							className: "rounded-full",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/developers",
								children: "View API flow"
							})
						})
					]
				})
			]
		}) }) })
	});
}
var API_KEY_FLOW = [
	"Create developer account",
	"Add credit card / billing profile",
	"Generate API key in dashboard",
	"Store key in secrets manager",
	"Attach Authorization header on every request",
	"Provider meters usage in database",
	"Monthly invoice reconciliation"
];
var X402_FLOW = [
	"POST resource (no payment header)",
	"Receive HTTP 402 + PAYMENT-REQUIRED quote",
	"Wallet signs exact USDC transfer",
	"Retry POST with PAYMENT-SIGNATURE",
	"Facilitator verify + on-chain settle",
	"Receive 200 + resource + tx proof"
];
function BillingCompare() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border py-20 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Compare",
			title: "API keys vs HTTP 402 billing",
			description: "Same AI resource — two integration models. x402 removes account setup and prepaid credits from the critical path."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 80,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-muted-foreground",
							children: "Traditional · API key billing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-display text-3xl text-foreground",
							children: [API_KEY_FLOW.length, " steps"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-sans text-sm text-muted-foreground",
							children: [
								"Typical time to first paid response:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "hours–days"
								}),
								" (signup + billing)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-6 space-y-2 font-sans text-sm text-muted-foreground",
							children: API_KEY_FLOW.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted-foreground",
									children: [index + 1, "."]
								}), step]
							}, step))
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 160,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-muted-foreground",
							children: "PagePay · HTTP 402 billing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-display text-3xl text-foreground",
							children: [X402_FLOW.length, " steps"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-sans text-sm text-muted-foreground",
							children: [
								"Typical time to first paid response:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "< 60 seconds"
								}),
								" (wallet + USDC)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-6 space-y-2 font-sans text-sm text-muted-foreground",
							children: X402_FLOW.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted-foreground",
									children: [index + 1, "."]
								}), step]
							}, step))
						})
					]
				})
			})]
		})] })
	});
}
var STEPS = [
	{
		n: "01",
		title: "Machine-Readable 402 Quote",
		body: "Agents submit a document to /api/summarize or /api/compare. Server responds with HTTP 402 Payment Required containing atomic page quotes in standard X-PAYMENT headers."
	},
	{
		n: "02",
		title: "Agent Spend Policy Enforcement",
		body: "Client-side spend policy evaluates price caps ($/request) and session budgets ($/session) BEFORE any transaction is constructed or signed."
	},
	{
		n: "03",
		title: "Instant Algorand USDC Settlement",
		body: "Pera Wallet or agent signer approves an exact-AVM USDC ASA 10458941 transaction group. Verified on-chain via GoPlausible facilitator."
	},
	{
		n: "04",
		title: "AI Output & SHA-256 Audit Chain",
		body: "Server returns AI extraction (Summary, Action Items, Key Risks, Compliance Check, Checklist) and automatically appends a cryptographic SHA-256 tamper-evident log entry."
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "how-it-works",
		className: "border-b border-border py-20 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs uppercase tracking-wider text-primary",
							children: "MACHINE-TO-MACHINE FLOW"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-bold font-mono tracking-tight sm:text-3xl text-foreground",
							children: "How Autonomous PagePay Works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-muted-foreground font-mono",
							children: "Standards-based HTTP 402 machine payments, real-time Algorand USDC settlement, and tamper-evident cryptographic verification."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-6 md:grid-cols-2",
					children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-primary",
								children: step.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold mt-2 text-foreground",
								children: step.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted-foreground",
								children: step.body
							})
						]
					}, step.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 text-center font-mono text-xs text-muted-foreground",
					children: [
						"Deep dive in",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/docs",
							className: "text-primary hover:underline",
							children: "developer documentation"
						}),
						" ",
						"and",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://lora.algokit.io/testnet",
							target: "_blank",
							rel: "noreferrer",
							className: "text-primary hover:underline",
							children: "Algorand Testnet Explorer"
						}),
						"."
					]
				})
			]
		})
	});
}
function scrollTo(id) {
	document.getElementById(id)?.scrollIntoView({
		behavior: "smooth",
		block: "start"
	});
}
function LandingInner({ wallet }) {
	const walkthrough = useWalkthrough();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { onTryIt: () => scrollTo("live-demo") }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialProof, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureGrid, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingCompare, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDemo, {
			wallet,
			onOpenWalkthrough: () => walkthrough.setOpen(true)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, { onTryIt: () => scrollTo("live-demo") }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Walkthrough, {
			open: walkthrough.open,
			onClose: walkthrough.close
		})
	] });
}
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingPage, { children: (wallet) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingInner, { wallet }) });
}
//#endregion
export { LandingPage as default };
