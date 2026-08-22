import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./button-BYtLCDFZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SectionHeading-D8LF3TLA.js
var import_jsx_runtime = require_jsx_runtime();
function SectionHeading({ eyebrow, title, description, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("max-w-2xl", className),
		children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-widest text-accent-green",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-section-heading mt-3 text-foreground",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base leading-relaxed text-muted-foreground",
				children: description
			})
		]
	});
}
//#endregion
export { SectionHeading as t };
