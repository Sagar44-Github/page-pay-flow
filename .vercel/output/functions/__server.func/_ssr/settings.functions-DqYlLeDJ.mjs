import { a as useSession$1, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./server-ptLNWahN.mjs";
import { createHash, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/settings.functions-DqYlLeDJ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
function sessionConfig() {
	return {
		password: process.env["SESSION_SECRET"],
		name: "pagepay-admin",
		maxAge: 28800,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/"
		}
	};
}
function matches(input, expected) {
	const a = createHash("sha256").update(input, "utf8").digest();
	const b = createHash("sha256").update(expected, "utf8").digest();
	return timingSafeEqual(a, b);
}
async function snapshot() {
	const { getConfig, overriddenKeys } = await import("./config.server-DvbyPSmV.mjs").then((n) => n.n).then((n) => n.t);
	const config = getConfig();
	return {
		payTo: config.payTo,
		pricePerPageUsd: config.pricePerPageUsd,
		facilitatorUrl: config.facilitatorUrl,
		network: config.network,
		overridden: overriddenKeys(),
		volatile: true
	};
}
var adminStatus_createServerFn_handler = createServerRpc({
	id: "31451354cef254f93339c2af2e762dfcd2ec1d54597c6209cb1e8341a7d1a402",
	name: "adminStatus",
	filename: "src/lib/admin/settings.functions.ts"
}, (opts) => adminStatus.__executeServer(opts));
var adminStatus = createServerFn({ method: "GET" }).handler(adminStatus_createServerFn_handler, async () => {
	if (!(await useSession$1(sessionConfig())).data.unlocked) return { unlocked: false };
	return {
		unlocked: true,
		settings: await snapshot()
	};
});
var adminUnlock_createServerFn_handler = createServerRpc({
	id: "62fa55f499db694ffde820e0f209c08896d3dba3168407c5c6080bb9b34885ac",
	name: "adminUnlock",
	filename: "src/lib/admin/settings.functions.ts"
}, (opts) => adminUnlock.__executeServer(opts));
var adminUnlock = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(adminUnlock_createServerFn_handler, async ({ data }) => {
	const expected = process.env["ADMIN_PASSWORD"];
	if (!expected) return {
		ok: false,
		error: "ADMIN_PASSWORD is not configured on the server."
	};
	if (!data.password || !matches(data.password, expected)) return {
		ok: false,
		error: "Incorrect passphrase."
	};
	await (await useSession$1(sessionConfig())).update({ unlocked: true });
	return {
		ok: true,
		settings: await snapshot()
	};
});
var adminLock_createServerFn_handler = createServerRpc({
	id: "7a3f9c0b2b5719d0f92c895597cbcc0fbc143eac40ab593a4a871172ad41445c",
	name: "adminLock",
	filename: "src/lib/admin/settings.functions.ts"
}, (opts) => adminLock.__executeServer(opts));
var adminLock = createServerFn({ method: "POST" }).handler(adminLock_createServerFn_handler, async () => {
	await (await useSession$1(sessionConfig())).clear();
	return { ok: true };
});
var adminSaveSettings_createServerFn_handler = createServerRpc({
	id: "a1843c9e0b0790eb62e47e36b5670803cede1b632c547596e7fe6f6fe34778ad",
	name: "adminSaveSettings",
	filename: "src/lib/admin/settings.functions.ts"
}, (opts) => adminSaveSettings.__executeServer(opts));
var adminSaveSettings = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(adminSaveSettings_createServerFn_handler, async ({ data }) => {
	if (!(await useSession$1(sessionConfig())).data.unlocked) return {
		ok: false,
		error: "Locked — enter the passphrase."
	};
	const { updateConfig, validatePatch } = await import("./config.server-DvbyPSmV.mjs").then((n) => n.n).then((n) => n.t);
	const { resetResourceServer } = await import("./routeConfig.server-ccOnqFvm.mjs").then((n) => n.c).then((n) => n.s);
	const patch = {
		...data.payTo !== void 0 ? { payTo: data.payTo.trim() } : {},
		...data.pricePerPageUsd !== void 0 ? { pricePerPageUsd: Number(data.pricePerPageUsd) } : {},
		...data.facilitatorUrl !== void 0 ? { facilitatorUrl: data.facilitatorUrl.trim() } : {},
		...data.network !== void 0 ? { network: data.network.trim() } : {}
	};
	const error = validatePatch(patch);
	if (error) return {
		ok: false,
		error
	};
	updateConfig(patch);
	resetResourceServer();
	return {
		ok: true,
		settings: await snapshot()
	};
});
var adminResetSettings_createServerFn_handler = createServerRpc({
	id: "839b5217d94c307c67ef2c520a201b3b12896719924339bddd84e8349e58a1ae",
	name: "adminResetSettings",
	filename: "src/lib/admin/settings.functions.ts"
}, (opts) => adminResetSettings.__executeServer(opts));
var adminResetSettings = createServerFn({ method: "POST" }).handler(adminResetSettings_createServerFn_handler, async () => {
	if (!(await useSession$1(sessionConfig())).data.unlocked) return {
		ok: false,
		error: "Locked — enter the passphrase."
	};
	const { resetConfig } = await import("./config.server-DvbyPSmV.mjs").then((n) => n.n).then((n) => n.t);
	const { resetResourceServer } = await import("./routeConfig.server-ccOnqFvm.mjs").then((n) => n.c).then((n) => n.s);
	resetConfig();
	resetResourceServer();
	return {
		ok: true,
		settings: await snapshot()
	};
});
//#endregion
export { adminLock_createServerFn_handler, adminResetSettings_createServerFn_handler, adminSaveSettings_createServerFn_handler, adminStatus_createServerFn_handler, adminUnlock_createServerFn_handler };
