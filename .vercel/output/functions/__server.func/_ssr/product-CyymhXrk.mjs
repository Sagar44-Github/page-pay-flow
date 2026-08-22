import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as MarketingPage, t as Container } from "./MarketingPage-CksEsTz7.mjs";
import { t as MarketingCard } from "./MarketingCard-Rn82GG4V.mjs";
import { t as Reveal } from "./Reveal-BSpiKaU7.mjs";
import { t as SectionHeading } from "./SectionHeading-D8LF3TLA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-CyymhXrk.js
var import_jsx_runtime = require_jsx_runtime();
var CAPABILITIES = [
	{
		title: "Document intake",
		body: "Accept PDF uploads or raw JSON text. Page count drives price — one quote, one charge, no drift."
	},
	{
		title: "402-native quoting",
		body: "Payment requirements live in PAYMENT-REQUIRED headers (x402 v2). Clients never guess amounts or assets."
	},
	{
		title: "Facilitator-backed settlement",
		body: "Verify and settle through GoPlausible before summarization runs. Failed payments never unlock paid work."
	},
	{
		title: "Observability built in",
		body: "Structured request logs, protocol proof panels, and explorer links for every successful settlement."
	}
];
function ProductPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingPage, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Product",
			title: "Metered AI APIs without billing infrastructure",
			description: "PagePay packages x402 + Algorand into a developer experience that feels like calling any other HTTP API — except unpaid requests get a quote instead of a 401."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: 100,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/demo",
						className: "rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground",
						children: "Try the live demo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/x402-demo",
						className: "rounded-full border border-border bg-card px-6 py-3 text-sm text-muted-foreground hover:text-foreground",
						children: "Protocol sandbox"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/docs",
						className: "rounded-full border border-border px-6 py-3 text-sm text-muted-foreground hover:text-foreground",
						children: "Read documentation"
					})
				]
			})
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-2",
			children: CAPABILITIES.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: index * 80,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingCard, {
					title: item.title,
					description: item.body,
					className: "h-full"
				})
			}, item.title))
		}) })
	})] }) });
}
//#endregion
export { ProductPage as component };
