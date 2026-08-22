import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Button, t as Badge } from "./button-BYtLCDFZ.mjs";
import { N as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-DWc43zsh.mjs";
import { t as Label } from "./label-Dc12M0o7.mjs";
import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./server-C6P-fwpQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DkTmFWwL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Admin settings RPC: passphrase gate + read/update of the runtime x402 config.
*
* The passphrase lives in the ADMIN_PASSWORD env var and is compared
* timing-safely on the server; the unlocked flag is kept in an encrypted
* session cookie. No config value is returned before the gate passes.
*/
var adminStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("31451354cef254f93339c2af2e762dfcd2ec1d54597c6209cb1e8341a7d1a402"));
var adminUnlock = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("62fa55f499db694ffde820e0f209c08896d3dba3168407c5c6080bb9b34885ac"));
var adminLock = createServerFn({ method: "POST" }).handler(createSsrRpc("7a3f9c0b2b5719d0f92c895597cbcc0fbc143eac40ab593a4a871172ad41445c"));
var adminSaveSettings = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("a1843c9e0b0790eb62e47e36b5670803cede1b632c547596e7fe6f6fe34778ad"));
var adminResetSettings = createServerFn({ method: "POST" }).handler(createSsrRpc("839b5217d94c307c67ef2c520a201b3b12896719924339bddd84e8349e58a1ae"));
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children
		})]
	});
}
function AdminPage() {
	const status = useServerFn(adminStatus);
	const unlock = useServerFn(adminUnlock);
	const lock = useServerFn(adminLock);
	const save = useServerFn(adminSaveSettings);
	const reset = useServerFn(adminResetSettings);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [password, setPassword] = (0, import_react.useState)("");
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		payTo: "",
		pricePerPageUsd: "",
		facilitatorUrl: "",
		network: ""
	});
	const [error, setError] = (0, import_react.useState)(null);
	const [success, setSuccess] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	function apply(next) {
		setSettings(next);
		setForm({
			payTo: next.payTo ?? "",
			pricePerPageUsd: String(next.pricePerPageUsd),
			facilitatorUrl: next.facilitatorUrl,
			network: next.network
		});
	}
	(0, import_react.useEffect)(() => {
		(async () => {
			try {
				const result = await status();
				if (result.unlocked) {
					setUnlocked(true);
					apply(result.settings);
				}
			} catch {} finally {
				setLoading(false);
			}
		})();
	}, [status]);
	async function handleUnlock(event) {
		event.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const result = await unlock({ data: { password } });
			if (!result.ok) {
				setError(result.error);
				return;
			}
			setUnlocked(true);
			setPassword("");
			apply(result.settings);
		} catch (unlockError) {
			setError(unlockError instanceof Error ? unlockError.message : "Unlock failed.");
		} finally {
			setBusy(false);
		}
	}
	async function handleSave(event) {
		event.preventDefault();
		setError(null);
		setSuccess(null);
		setBusy(true);
		try {
			const result = await save({ data: {
				payTo: form.payTo,
				pricePerPageUsd: Number(form.pricePerPageUsd),
				facilitatorUrl: form.facilitatorUrl,
				network: form.network
			} });
			if (!result.ok) {
				setError(result.error);
				return;
			}
			apply(result.settings);
			setSuccess("Saved — the next /api/price and /api/summarize request uses these values.");
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Save failed.");
		} finally {
			setBusy(false);
		}
	}
	async function handleReset() {
		setError(null);
		setSuccess(null);
		setBusy(true);
		try {
			const result = await reset();
			if (!result.ok || !result.settings) {
				setError(result.error ?? "Reset failed.");
				return;
			}
			apply(result.settings);
			setSuccess("Runtime overrides cleared — values now come from the server environment.");
		} catch (resetError) {
			setError(resetError instanceof Error ? resetError.message : "Reset failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-lg font-semibold tracking-tight text-foreground",
					children: ["PagePay admin", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 font-mono text-[11px] font-normal text-muted-foreground",
						children: "runtime x402 config"
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "font-mono text-xs text-muted-foreground transition-colors hover:text-foreground",
						children: "← app"
					}), unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => {
							lock().then(() => {
								setUnlocked(false);
								setSettings(null);
							});
						},
						children: "Lock"
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl space-y-6 px-6 py-10",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs text-muted-foreground",
				children: "loading…"
			}) : !unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Passphrase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: handleUnlock,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "admin-pass",
							className: "text-xs text-muted-foreground",
							children: "Admin passphrase"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "admin-pass",
							type: "password",
							autoComplete: "current-password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							className: "font-mono text-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Checking…" : "Unlock"
						})
					]
				}), error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive",
					role: "alert",
					children: error
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "x402 settings",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-4",
						onSubmit: handleSave,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "payTo",
								className: "text-xs text-muted-foreground",
								children: "RESOURCE_PAY_TO · merchant Algorand address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "payTo",
								value: form.payTo,
								onChange: (event) => setForm({
									...form,
									payTo: event.target.value
								}),
								className: "mt-1 font-mono text-xs"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "price",
								className: "text-xs text-muted-foreground",
								children: "Price per page (USD)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "price",
								type: "number",
								step: "0.001",
								min: "0.001",
								value: form.pricePerPageUsd,
								onChange: (event) => setForm({
									...form,
									pricePerPageUsd: event.target.value
								}),
								className: "mt-1 font-mono text-xs"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "facilitator",
								className: "text-xs text-muted-foreground",
								children: "Facilitator URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "facilitator",
								value: form.facilitatorUrl,
								onChange: (event) => setForm({
									...form,
									facilitatorUrl: event.target.value
								}),
								className: "mt-1 font-mono text-xs"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "network",
								className: "text-xs text-muted-foreground",
								children: "Network (CAIP-2)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "network",
								value: form.network,
								onChange: (event) => setForm({
									...form,
									network: event.target.value
								}),
								className: "mt-1 font-mono text-xs"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy,
									children: busy ? "Saving…" : "Save settings"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									disabled: busy,
									onClick: () => void handleReset(),
									children: "Reset to environment"
								})]
							})
						]
					}),
					success && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary",
						children: success
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive",
						role: "alert",
						children: error
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Live values",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 font-mono text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["payTo: ", settings?.payTo ?? "— not configured —"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["pricePerPageUsd: ", settings?.pricePerPageUsd] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["facilitator: ", settings?.facilitatorUrl] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["network: ", settings?.network] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: (settings?.overridden.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px]",
							children: "all values from environment"
						}) : settings?.overridden.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px]",
							children: [key, " overridden at runtime"]
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "Overrides are held in server memory and apply to the very next price or payment request — no redeploy needed. They are not persisted: a cold start (new deploy or idle worker) falls back to the environment values, so make permanent changes in the project secrets as well."
					})
				]
			})] })
		})]
	});
}
//#endregion
export { AdminPage as component };
