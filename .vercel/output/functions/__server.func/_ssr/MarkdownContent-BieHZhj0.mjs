import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./button-BYtLCDFZ.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarkdownContent-BieHZhj0.js
var import_jsx_runtime = require_jsx_runtime();
function MarkdownContent({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("prose-markdown", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
			remarkPlugins: [remarkGfm],
			components: {
				h1: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-4 mt-8 font-display text-2xl text-foreground first:mt-0",
					children: c
				}),
				h2: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 mt-8 font-display text-xl text-foreground first:mt-0",
					children: c
				}),
				h3: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 mt-6 font-sans text-base font-semibold text-foreground",
					children: c
				}),
				p: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 font-sans text-sm leading-relaxed text-muted-foreground last:mb-0",
					children: c
				}),
				ul: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mb-4 list-disc space-y-2 pl-5 font-sans text-sm text-muted-foreground",
					children: c
				}),
				ol: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mb-4 list-decimal space-y-2 pl-5 font-sans text-sm text-muted-foreground",
					children: c
				}),
				li: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "leading-relaxed",
					children: c
				}),
				strong: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "font-semibold text-foreground",
					children: c
				}),
				em: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "italic text-muted-foreground",
					children: c
				}),
				code: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground",
					children: c
				}),
				pre: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mb-4 overflow-x-auto rounded-lg border border-border bg-secondary p-4 font-mono text-xs leading-relaxed text-foreground",
					children: c
				}),
				a: ({ href, children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href,
					className: "font-sans text-accent-blue underline-offset-4 hover:underline",
					target: href?.startsWith("http") ? "_blank" : void 0,
					rel: href?.startsWith("http") ? "noreferrer" : void 0,
					children: c
				}),
				blockquote: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
					className: "mb-4 border-l-2 border-border pl-4 font-sans text-sm italic text-muted-foreground",
					children: c
				}),
				table: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "not-prose mb-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full border-collapse text-left font-sans text-sm",
						children: c
					})
				}),
				th: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border border-border bg-secondary px-3 py-2 font-medium text-foreground",
					children: c
				}),
				td: ({ children: c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "border border-border px-3 py-2 text-muted-foreground",
					children: c
				})
			},
			children
		})
	});
}
//#endregion
export { MarkdownContent as t };
