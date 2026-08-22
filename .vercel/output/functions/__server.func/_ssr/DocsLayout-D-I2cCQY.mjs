import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./button-BYtLCDFZ.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Container } from "./MarketingPage-CksEsTz7.mjs";
import { t as MarketingCard } from "./MarketingCard-Rn82GG4V.mjs";
import { t as Reveal } from "./Reveal-BSpiKaU7.mjs";
import { t as MarkdownContent } from "./MarkdownContent-BieHZhj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DocsLayout-D-I2cCQY.js
var import_jsx_runtime = require_jsx_runtime();
function CodeBlock({ title, code, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("overflow-hidden rounded-2xl border border-border bg-card", className),
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.trim() })
		})]
	});
}
function DocSections({ sections }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-10",
		children: sections.map((section, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: index * 60,
			as: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: section.id,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-foreground",
						children: section.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownContent, { children: section.body }),
					section.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "not-prose mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							title: section.code.title,
							code: section.code.code
						})
					}) : null
				]
			})
		}, section.id))
	});
}
function DocGuideGrid({ guides }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "not-prose grid gap-4 sm:grid-cols-2",
		children: guides.map((guide, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: index * 80,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: guide.to,
				className: "block h-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingCard, {
					title: guide.title,
					description: guide.description,
					className: "h-full"
				})
			})
		}, guide.to))
	});
}
var DOC_LINKS = [
	{
		to: "/docs",
		label: "Overview",
		end: true
	},
	{
		to: "/docs/x402",
		label: "x402 protocol"
	},
	{
		to: "/docs/algorand",
		label: "Algorand settlement"
	},
	{
		to: "/developers",
		label: "API reference"
	},
	{
		to: "/integrations",
		label: "Integrations"
	},
	{
		to: "/x402-demo",
		label: "Protocol sandbox"
	}
];
function DocsLayout({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, {
		className: "py-12 md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-12 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "lg:sticky lg:top-24 lg:self-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-sm font-medium text-foreground",
						children: "Documentation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-4 space-y-1",
						children: DOC_LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: cn("block rounded-lg px-3 py-2 font-sans text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"),
							activeProps: { className: "bg-secondary text-foreground" },
							..."end" in link && link.end ? { activeOptions: { exact: true } } : {},
							children: link.label
						}, link.to))
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b border-border pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-display-hero text-foreground",
						children: title
					}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground",
						children: description
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prose-docs mt-10 space-y-8 font-sans text-base leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-foreground [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-foreground [&_a]:text-accent-blue [&_a]:underline-offset-4 [&_a:hover]:underline [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2",
					children
				})]
			})]
		})
	});
}
//#endregion
export { DocSections as n, DocsLayout as r, DocGuideGrid as t };
