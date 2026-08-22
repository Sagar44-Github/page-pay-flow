import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DxZy06TW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LandingPage = (0, import_react.lazy)(() => import("./LandingPage-C1bPnU5x.mjs"));
function Loading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background font-mono text-sm text-muted-foreground",
		children: "Loading PagePay…"
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingPage, {})
	});
}
//#endregion
export { Index as component };
