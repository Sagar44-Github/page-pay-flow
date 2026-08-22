import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as MarketingPage, t as Container } from "./MarketingPage-CksEsTz7.mjs";
import { t as SectionHeading } from "./SectionHeading-D8LF3TLA.mjs";
import { n as Walkthrough, r as useWalkthrough, t as LiveDemo } from "./Walkthrough-CouxaCq7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-BaFNj6Mr.js
var import_jsx_runtime = require_jsx_runtime();
function DemoInner({ wallet }) {
	const walkthrough = useWalkthrough();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Live demo",
				title: "Run a full pay-per-page flow",
				description: "Connect Pera on Testnet, fund USDC, upload a document, and watch HTTP 402 become a settled summary."
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDemo, {
			wallet,
			onOpenWalkthrough: () => walkthrough.setOpen(true)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Walkthrough, {
			open: walkthrough.open,
			onClose: walkthrough.close
		})
	] });
}
function DemoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingPage, { children: (wallet) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoInner, { wallet }) });
}
//#endregion
export { DemoPage as component };
