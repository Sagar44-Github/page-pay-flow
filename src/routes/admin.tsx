import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminLock,
  adminResetSettings,
  adminSaveSettings,
  adminStatus,
  adminUnlock,
  type AdminSettings,
} from "@/lib/admin/settings.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "PagePay admin — x402 testnet settings" },
      {
        name: "description",
        content:
          "Passphrase-protected panel for editing the PagePay merchant address, per-page price, facilitator URL and network at runtime.",
      },
      { property: "og:title", content: "PagePay admin — x402 testnet settings" },
      {
        property: "og:description",
        content: "Runtime configuration for the PagePay x402 payment routes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function AdminPage() {
  const status = useServerFn(adminStatus);
  const unlock = useServerFn(adminUnlock);
  const lock = useServerFn(adminLock);
  const save = useServerFn(adminSaveSettings);
  const reset = useServerFn(adminResetSettings);

  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [form, setForm] = useState({
    payTo: "",
    pricePerPageUsd: "",
    facilitatorUrl: "",
    network: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function apply(next: AdminSettings) {
    setSettings(next);
    setForm({
      payTo: next.payTo ?? "",
      pricePerPageUsd: String(next.pricePerPageUsd),
      facilitatorUrl: next.facilitatorUrl,
      network: next.network,
    });
  }

  useEffect(() => {
    void (async () => {
      try {
        const result = await status();
        if (result.unlocked) {
          setUnlocked(true);
          apply(result.settings);
        }
      } catch {
        /* treat as locked */
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  async function handleUnlock(event: React.FormEvent) {
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

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const result = await save({
        data: {
          payTo: form.payTo,
          pricePerPageUsd: Number(form.pricePerPageUsd),
          facilitatorUrl: form.facilitatorUrl,
          network: form.network,
        },
      });
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              PagePay admin
              <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
                runtime x402 config
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ← app
            </a>
            {unlocked && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  void lock().then(() => {
                    setUnlocked(false);
                    setSettings(null);
                  });
                }}
              >
                Lock
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        {loading ? (
          <p className="font-mono text-xs text-muted-foreground">loading…</p>
        ) : !unlocked ? (
          <Card title="Passphrase">
            <form className="space-y-3" onSubmit={handleUnlock}>
              <Label htmlFor="admin-pass" className="text-xs text-muted-foreground">
                Admin passphrase
              </Label>
              <Input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="font-mono text-xs"
              />
              <Button type="submit" disabled={busy}>
                {busy ? "Checking…" : "Unlock"}
              </Button>
            </form>
            {error && (
              <p
                className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
          </Card>
        ) : (
          <>
            <Card title="x402 settings">
              <form className="space-y-4" onSubmit={handleSave}>
                <div>
                  <Label htmlFor="payTo" className="text-xs text-muted-foreground">
                    RESOURCE_PAY_TO · merchant Algorand address
                  </Label>
                  <Input
                    id="payTo"
                    value={form.payTo}
                    onChange={(event) => setForm({ ...form, payTo: event.target.value })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-xs text-muted-foreground">
                    Price per page (USD)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={form.pricePerPageUsd}
                    onChange={(event) => setForm({ ...form, pricePerPageUsd: event.target.value })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="facilitator" className="text-xs text-muted-foreground">
                    Facilitator URL
                  </Label>
                  <Input
                    id="facilitator"
                    value={form.facilitatorUrl}
                    onChange={(event) => setForm({ ...form, facilitatorUrl: event.target.value })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="network" className="text-xs text-muted-foreground">
                    Network (CAIP-2)
                  </Label>
                  <Input
                    id="network"
                    value={form.network}
                    onChange={(event) => setForm({ ...form, network: event.target.value })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={busy}>
                    {busy ? "Saving…" : "Save settings"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => void handleReset()}
                  >
                    Reset to environment
                  </Button>
                </div>
              </form>

              {success && (
                <p className="mt-3 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary">
                  {success}
                </p>
              )}
              {error && (
                <p
                  className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </Card>

            <Card title="Live values">
              <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                <p>payTo: {settings?.payTo ?? "— not configured —"}</p>
                <p>pricePerPageUsd: {settings?.pricePerPageUsd}</p>
                <p>facilitator: {settings?.facilitatorUrl}</p>
                <p>network: {settings?.network}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(settings?.overridden.length ?? 0) === 0 ? (
                  <Badge variant="outline" className="font-mono text-[11px]">
                    all values from environment
                  </Badge>
                ) : (
                  settings?.overridden.map((key) => (
                    <Badge key={key} variant="outline" className="font-mono text-[11px]">
                      {key} overridden at runtime
                    </Badge>
                  ))
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Overrides are held in server memory and apply to the very next price or payment
                request — no redeploy needed. They are not persisted: a cold start (new deploy or
                idle worker) falls back to the environment values, so make permanent changes in the
                project secrets as well.
              </p>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
