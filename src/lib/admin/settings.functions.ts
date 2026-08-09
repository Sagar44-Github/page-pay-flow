/**
 * Admin settings RPC: passphrase gate + read/update of the runtime x402 config.
 *
 * The passphrase lives in the ADMIN_PASSWORD env var and is compared
 * timing-safely on the server; the unlocked flag is kept in an encrypted
 * session cookie. No config value is returned before the gate passes.
 */
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

export interface AdminSettings {
  payTo: string | null;
  pricePerPageUsd: number;
  facilitatorUrl: string;
  network: string;
  overridden: string[];
  /** Runtime overrides live in worker memory and reset on a cold start. */
  volatile: true;
}

interface AdminSession {
  unlocked?: boolean;
}

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "pagepay-admin",
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireUnlocked() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("Locked");
  return session;
}

async function snapshot(): Promise<AdminSettings> {
  const { getConfig, overriddenKeys } = await import("@/lib/pagepay/config.server");
  const config = getConfig();
  return {
    payTo: config.payTo,
    pricePerPageUsd: config.pricePerPageUsd,
    facilitatorUrl: config.facilitatorUrl,
    network: config.network,
    overridden: overriddenKeys(),
    volatile: true,
  };
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) return { unlocked: false as const };
  return { unlocked: true as const, settings: await snapshot() };
});

export const adminUnlock = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) {
      return { ok: false as const, error: "ADMIN_PASSWORD is not configured on the server." };
    }
    if (!data.password || !matches(data.password, expected)) {
      return { ok: false as const, error: "Incorrect passphrase." };
    }
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const, settings: await snapshot() };
  });

export const adminLock = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminSaveSettings = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      payTo?: string;
      pricePerPageUsd?: number;
      facilitatorUrl?: string;
      network?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { updateConfig, validatePatch } = await import("@/lib/pagepay/config.server");
    const { resetResourceServer } = await import("@/lib/x402/routeConfig.server");

    const patch = {
      ...(data.payTo !== undefined ? { payTo: data.payTo.trim() } : {}),
      ...(data.pricePerPageUsd !== undefined
        ? { pricePerPageUsd: Number(data.pricePerPageUsd) }
        : {}),
      ...(data.facilitatorUrl !== undefined
        ? { facilitatorUrl: data.facilitatorUrl.trim() }
        : {}),
      ...(data.network !== undefined
        ? { network: data.network.trim() as `${string}:${string}` }
        : {}),
    };

    const error = validatePatch(patch);
    if (error) return { ok: false as const, error };

    updateConfig(patch);
    // The facilitator client and scheme registration are built once and cached.
    resetResourceServer();
    return { ok: true as const, settings: await snapshot() };
  });

export const adminResetSettings = createServerFn({ method: "POST" }).handler(async () => {
  await requireUnlocked();
  const { resetConfig } = await import("@/lib/pagepay/config.server");
  const { resetResourceServer } = await import("@/lib/x402/routeConfig.server");
  resetConfig();
  resetResourceServer();
  return { ok: true as const, settings: await snapshot() };
});
