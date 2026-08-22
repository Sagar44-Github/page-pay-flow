import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as Button, t as Badge } from "./_ssr/button-BYtLCDFZ.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as MarketingPageStatic, t as Container } from "./_ssr/MarketingPage-CksEsTz7.mjs";
import { t as Reveal } from "./_ssr/Reveal-BSpiKaU7.mjs";
import { n as Route$3 } from "./_ssr/router-BsjogRMm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_txId-C6jWNqz7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReceiptPage() {
	const { txId } = Route$3.useParams();
	const [receipt, setReceipt] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			try {
				const response = await fetch(`/api/receipt?txId=${encodeURIComponent(txId)}`);
				const body = await response.json();
				if (cancelled) return;
				if (response.ok) {
					setReceipt(body);
					setMissing(false);
				} else {
					setReceipt(null);
					setMissing(true);
				}
			} catch {
				if (!cancelled) setMissing(true);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [txId]);
	const explorer = `https://testnet.explorer.perawallet.app/tx/${encodeURIComponent(txId)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingPageStatic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
		className: "py-16 md:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "font-mono text-[10px]",
				children: "payment receipt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-display-hero mt-4 text-foreground",
				children: "On-chain receipt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl font-sans text-muted-foreground",
				children: "Independent proof of settlement — verify this transaction on Algorand Testnet even outside the PagePay UI."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: 100,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-2xl border border-border bg-card p-8",
				children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm text-muted-foreground",
					children: "Loading receipt…"
				}) : receipt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-4 font-sans text-sm sm:grid-cols-[140px_1fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Transaction"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "break-all font-mono text-xs text-foreground",
							children: receipt.txId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Timestamp"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: new Date(receipt.timestamp).toLocaleString() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Pages paid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: receipt.pages }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Amount"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: receipt.price }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Payer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "break-all font-mono text-xs",
							children: receipt.payer ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Route"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono text-xs",
							children: receipt.route
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Outcome"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: receipt.outcome })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-sm text-muted-foreground",
					children: missing ? "This transaction was not found in recent server logs. It may still be valid on-chain — verify directly on the explorer." : "Receipt unavailable."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 break-all font-mono text-xs text-foreground",
					children: txId
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: explorer,
							target: "_blank",
							rel: "noreferrer",
							children: "Open in explorer"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/demo",
							children: "Back to live demo"
						})
					})]
				})]
			})
		})]
	}) });
}
//#endregion
export { ReceiptPage as component };
