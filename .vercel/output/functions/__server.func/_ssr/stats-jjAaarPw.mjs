import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as MarketingPageStatic, t as Container } from "./MarketingPage-CksEsTz7.mjs";
import { t as Reveal } from "./Reveal-BSpiKaU7.mjs";
import { t as SectionHeading } from "./SectionHeading-D8LF3TLA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stats-jjAaarPw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StatsPage() {
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const load = async () => {
			try {
				const body = await (await fetch("/api/metrics?limit=200")).json();
				if (!cancelled) setData(body);
			} catch {}
		};
		load();
		const interval = setInterval(() => void load(), 8e3);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, []);
	const m = data?.metrics;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketingPageStatic, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border py-16 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Metrics",
			title: "Live payment telemetry",
			description: "Aggregated from in-memory server logs — refreshes every 8 seconds during the demo."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				{
					label: "Settled txns",
					value: m?.totalTransactions ?? "—"
				},
				{
					label: "USDC volume",
					value: m?.usdcVolumeFormatted ?? "—"
				},
				{
					label: "402 → 200 success",
					value: m?.successRate != null ? `${m.successRate}%` : "—"
				},
				{
					label: "Recent 402 quotes",
					value: m?.recent402Count ?? "—"
				}
			].map((stat, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: index * 70,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
						children: stat.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl text-foreground",
						children: stat.value
					})]
				})
			}, stat.label))
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl text-foreground",
			children: "Recent events"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: 80,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 overflow-x-auto rounded-2xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left font-sans text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border bg-secondary/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium text-muted-foreground",
								children: "Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium text-muted-foreground",
								children: "Outcome"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium text-muted-foreground",
								children: "Pages"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium text-muted-foreground",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium text-muted-foreground",
								children: "Tx"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [(data?.recent ?? []).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 font-mono text-[11px] text-muted-foreground",
								children: new Date(entry.timestamp).toLocaleTimeString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: entry.outcome
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: entry.pages
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: entry.price
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: entry.txId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/receipt/$txId",
									params: { txId: entry.txId },
									className: "font-mono text-[11px] text-accent-blue hover:underline",
									children: [entry.txId.slice(0, 12), "…"]
								}) : "—"
							})
						]
					}, `${entry.timestamp}-${entry.txId ?? entry.outcome}`)), !data?.recent?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-4 py-8 text-center text-muted-foreground",
						children: "No events yet — run the live demo to populate metrics."
					}) })] })]
				})
			})
		})] })
	})] });
}
//#endregion
export { StatsPage as component };
