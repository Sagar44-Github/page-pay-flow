import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Button, r as cn, t as Badge } from "./button-BYtLCDFZ.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as esm_default } from "../_libs/@perawallet/connect+[...].mjs";
import { f as Moon, r as Sun } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarketingPage-CksEsTz7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Container({ className, children, narrow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto w-full px-6", narrow ? "max-w-3xl" : "max-w-6xl", className),
		children
	});
}
var PERA_CHAIN_TESTNET = 416002;
function truncateAddress(address) {
	return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
function usePeraWallet() {
	const peraRef = (0, import_react.useRef)(null);
	const [address, setAddress] = (0, import_react.useState)(null);
	const [connecting, setConnecting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const getPera = (0, import_react.useCallback)(async () => {
		if (!peraRef.current) {
			const { PeraWalletConnect } = await import("../_libs/@perawallet/connect+[...].mjs").then((n) => n.t);
			peraRef.current = new PeraWalletConnect({ chainId: PERA_CHAIN_TESTNET });
		}
		return peraRef.current;
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		let mounted = true;
		getPera().then((pera) => {
			if (!mounted) return;
			pera.reconnectSession().then((accounts) => {
				if (!mounted) return;
				if (accounts.length > 0 && accounts[0]) setAddress(accounts[0]);
				pera.connector?.on("disconnect", () => setAddress(null));
			}).catch(() => {});
		});
		return () => {
			mounted = false;
			if (peraRef.current?.connector) peraRef.current.connector.off("disconnect");
		};
	}, [getPera]);
	return {
		address,
		connecting,
		error,
		connect: (0, import_react.useCallback)(async () => {
			setError(null);
			setConnecting(true);
			try {
				const pera = await getPera();
				const accounts = await pera.connect();
				pera.connector?.on("disconnect", () => setAddress(null));
				if (accounts.length === 0 || !accounts[0]) {
					setError("Pera returned no account. Open Pera, unlock it, and try again.");
					return;
				}
				setAddress(accounts[0]);
			} catch (connectError) {
				const message = connectError instanceof Error ? connectError.message : String(connectError);
				setError(/cancel|close/i.test(message) ? "Pera connection was cancelled." : `Couldn't reach Pera Wallet on Algorand Testnet. On desktop use Pera Web (web.perawallet.app) or scan the QR with the Pera mobile app. (${message})`);
			} finally {
				setConnecting(false);
			}
		}, [getPera]),
		disconnect: (0, import_react.useCallback)(async () => {
			try {
				await (await getPera()).disconnect();
			} catch {}
			setAddress(null);
			setError(null);
		}, [getPera]),
		signer: (0, import_react.useMemo)(() => {
			if (!address) return null;
			return {
				address,
				async signTransactions(txns, indexesToSign) {
					const indexes = indexesToSign ?? txns.map((_, index) => index);
					const pera = await getPera();
					console.log("[pagepay] pera signTransactions", {
						txnCount: txns.length,
						indexes,
						platform: pera.platform,
						connected: pera.isConnected
					});
					const group = txns.map((bytes, index) => {
						const txn = esm_default.decodeUnsignedTransaction(bytes);
						if (indexes.includes(index)) return {
							txn,
							signers: [address]
						};
						return {
							txn,
							signers: []
						};
					});
					let signed;
					try {
						signed = await Promise.race([pera.signTransaction([group]), new Promise((_, reject) => {
							setTimeout(() => reject(/* @__PURE__ */ new Error("Pera Wallet did not respond within 2 minutes. On desktop, a new tab should open at web.perawallet.app — approve the USDC transfer there. Or scan the QR with the Pera mobile app. Do not use Cursor's built-in browser; use Chrome or Edge.")), 12e4);
						})]);
					} catch (signError) {
						console.error("[pagepay] pera signTransaction failed", signError);
						throw signError;
					}
					console.log("[pagepay] pera signed count", signed.length, "expected", indexes.length);
					const queue = [...signed];
					return txns.map((_, index) => indexes.includes(index) ? queue.shift() ?? null : null);
				}
			};
		}, [address, getPera])
	};
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 512 512",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className: cn("size-9 rounded-xl ring-1 ring-border", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "512",
				height: "512",
				rx: "112",
				className: "fill-card"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "48",
				width: "416",
				height: "416",
				rx: "88",
				className: "fill-none stroke-border",
				strokeWidth: "8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "256",
				y: "300",
				textAnchor: "middle",
				className: "fill-foreground",
				style: {
					fontFamily: "Instrument Serif, Georgia, serif",
					fontSize: 168,
					fontWeight: 400
				},
				children: "PP"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "384",
				cy: "148",
				r: "22",
				className: "fill-accent-green"
			})
		]
	});
}
function Logo({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "group flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "transition-transform group-hover:scale-105" }), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-lg tracking-tight text-foreground",
				children: "PagePay"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: "x402 · algorand"
			})]
		})]
	});
}
var FOOTER_LINKS = {
	Product: [
		{
			to: "/product",
			label: "Overview"
		},
		{
			to: "/demo",
			label: "Live demo"
		},
		{
			to: "/pricing",
			label: "Pricing"
		},
		{
			to: "/x402-demo",
			label: "Protocol sandbox"
		}
	],
	Docs: [
		{
			to: "/docs",
			label: "Documentation"
		},
		{
			to: "/docs/x402",
			label: "x402 protocol"
		},
		{
			to: "/docs/algorand",
			label: "Algorand"
		},
		{
			to: "/developers",
			label: "API reference"
		}
	],
	Integrate: [
		{
			to: "/integrations",
			label: "Integrations"
		},
		{
			to: "/developers",
			label: "HTTP 402 flow"
		},
		{
			to: "/docs/x402",
			label: "Payment headers"
		}
	]
};
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 md:grid-cols-[1.2fr_2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
					children: "Pay-per-page AI document summarization over HTTP 402, settled on Algorand Testnet. Built for developers who want metered APIs without accounts or subscriptions."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-8 sm:grid-cols-3",
					children: Object.entries(FOOTER_LINKS).map(([title, links]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-nav-label text-foreground",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
							children: link.label
						}) }, link.to))
					})] }, title))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-subtle",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" PagePay · Testnet only · Not for production value"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 font-mono text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://facilitator.goplausible.xyz",
						target: "_blank",
						rel: "noreferrer",
						className: "hover:text-accent-green",
						children: "Facilitator"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://web.perawallet.app",
						target: "_blank",
						rel: "noreferrer",
						className: "hover:text-accent-green",
						children: "Pera Web"
					})]
				})]
			})]
		})
	});
}
var STORAGE_KEY = "pagepay-theme";
function getStoredTheme() {
	if (typeof window === "undefined") return "dark";
	try {
		return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
	} catch {
		return "dark";
	}
}
function applyTheme(theme) {
	document.documentElement.classList.remove("dark", "light");
	document.documentElement.classList.add(theme);
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {}
}
function ThemeToggle() {
	const [theme, setTheme] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		setTheme(getStoredTheme());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "ghost",
		size: "icon",
		className: "size-9 rounded-full",
		"aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
		onClick: () => {
			const next = theme === "dark" ? "light" : "dark";
			applyTheme(next);
			setTheme(next);
		},
		children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
var NAV = [
	{
		to: "/product",
		label: "Product"
	},
	{
		to: "/pricing",
		label: "Pricing"
	},
	{
		to: "/docs",
		label: "Docs"
	},
	{
		to: "/stats",
		label: "Metrics"
	},
	{
		to: "/x402-demo",
		label: "Protocol demo"
	},
	{
		to: "/demo",
		label: "Live demo"
	}
];
function SiteHeader({ wallet }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border glass-nav",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "flex h-16 items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "text-nav-label rounded-full px-4 py-2 font-sans text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
						activeProps: { className: "bg-secondary text-foreground" },
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "hidden font-mono text-[10px] sm:inline-flex",
							children: "testnet"
						}),
						wallet.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "font-mono text-[11px]",
							children: truncateAddress(wallet.address)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => void wallet.disconnect(),
							children: "Disconnect"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90",
							disabled: wallet.connecting,
							onClick: () => void wallet.connect(),
							children: wallet.connecting ? "Connecting…" : "Connect wallet"
						})
					]
				})
			]
		}), wallet.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, {
			className: "pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				role: "alert",
				children: wallet.error
			})
		})]
	});
}
function MarketingLayout({ wallet, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { wallet }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
/** Marketing page wrapper with wallet + layout. */
function MarketingPage({ children }) {
	const wallet = usePeraWallet();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingLayout, {
		wallet,
		children: children(wallet)
	});
}
/** Static marketing pages (docs, product shell) — same layout, no render-prop. */
function MarketingPageStatic({ children }) {
	const wallet = usePeraWallet();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingLayout, {
		wallet,
		children
	});
}
//#endregion
export { MarketingPage as n, MarketingPageStatic as r, Container as t };
