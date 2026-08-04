import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogEntry {
  timestamp: string;
  route: string;
  pages: number;
  price: string;
  paymentStatus: string;
  outcome: string;
  payer?: string;
  txId?: string;
  reason?: string;
}

const OUTCOME_STYLES: Record<string, string> = {
  summarized: "bg-primary/15 text-primary",
  payment_required: "bg-accent text-accent-foreground",
  quoted: "bg-muted text-muted-foreground",
  bad_request: "bg-destructive/15 text-destructive",
  payment_failed: "bg-destructive/15 text-destructive",
  gateway_error: "bg-destructive/15 text-destructive",
  paid_unfulfilled: "bg-destructive/15 text-destructive",
};

export function LogsTab({ refreshToken }: { refreshToken: number }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/logs?limit=100");
      const body = (await response.json()) as { entries: LogEntry[] };
      setEntries(body.entries ?? []);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshToken]);

  useEffect(() => {
    const interval = setInterval(() => void load(), 10_000);
    return () => clearInterval(interval);
  }, [load]);

  const settled = entries.filter((entry) => entry.outcome === "summarized");
  const revenue = settled.reduce((sum, entry) => sum + Number(entry.price.replace("$", "")), 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "requests logged", value: String(entries.length) },
          {
            label: "402 challenges",
            value: String(entries.filter((e) => e.outcome === "payment_required").length),
          },
          { label: "paid summaries", value: String(settled.length) },
          { label: "revenue (USD)", value: `$${revenue.toFixed(2)}` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            requests.log
          </h2>
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
        {error && <p className="px-4 py-3 text-xs text-destructive">{error}</p>}
        {!error && entries.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            No requests logged yet. Run a quote or a paid summary.
          </p>
        )}
        {entries.length > 0 && (
          <div className="max-h-[28rem] overflow-auto">
            <table className="w-full border-collapse font-mono text-[11px]">
              <thead className="sticky top-0 bg-card text-muted-foreground">
                <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                  <th>time</th>
                  <th>route</th>
                  <th>pages</th>
                  <th>price</th>
                  <th>payment</th>
                  <th>outcome</th>
                  <th>tx / reason</th>
                </tr>
              </thead>
              <tbody className="text-card-foreground">
                {entries.map((entry, index) => (
                  <tr
                    key={`${entry.timestamp}-${index}`}
                    className="border-t border-border [&>td]:px-3 [&>td]:py-2 [&>td]:align-top"
                  >
                    <td className="whitespace-nowrap text-muted-foreground">
                      {entry.timestamp.slice(11, 19)}
                    </td>
                    <td className="whitespace-nowrap">{entry.route}</td>
                    <td>{entry.pages}</td>
                    <td>{entry.price}</td>
                    <td className="whitespace-nowrap text-muted-foreground">
                      {entry.paymentStatus}
                    </td>
                    <td>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5",
                          OUTCOME_STYLES[entry.outcome] ?? "bg-muted text-muted-foreground",
                        )}
                      >
                        {entry.outcome}
                      </span>
                    </td>
                    <td className="max-w-[16rem] break-all text-muted-foreground">
                      {entry.txId ?? entry.reason ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
