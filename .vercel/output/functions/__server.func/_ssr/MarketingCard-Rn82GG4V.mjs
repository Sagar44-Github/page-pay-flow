import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./button-BYtLCDFZ.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BuXCp9gk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarketingCard-Rn82GG4V.js
var import_jsx_runtime = require_jsx_runtime();
function MarketingCard({ title, description, children, footer, accent, className, hover = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("border-border bg-card shadow-sm", hover && "transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-accent-green/35 hover:shadow-lg hover:shadow-accent-green/5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: cn("text-section-heading font-normal leading-snug", accent),
					children: title
				}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
					className: "font-sans leading-relaxed",
					children: description
				}) : null]
			}),
			children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-0",
				children
			}) : null,
			footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
				className: "pt-0",
				children: footer
			}) : null
		]
	});
}
//#endregion
export { MarketingCard as t };
