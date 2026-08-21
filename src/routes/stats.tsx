import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Container } from "@/components/marketing/Container";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import type { PagePayLogEntry } from "@/lib/services/pagepayLogger.server";

interface MetricsResponse {
  metrics: {
    totalTransactions: number;
    usdcVolumeFormatted: string;
    successRate: number | null;
    recent402Count: number;
    recentSummarizedCount: number;
  };
  recent: PagePayLogEntry[];
}

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [{ title: "Live metrics — PagePay" }],
  }),
  component: StatsPage,
});

function StatsPage() {
  const [data, setData] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/api/metrics?limit=200");
        const body = (await response.json()) as MetricsResponse;
        if (!cancelled) setData(body);
      } catch {
        /* ignore */
      }
    };
    void load();
    const interval = setInterval(() => void load(), 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const m = data?.metrics;

  return (
    <MarketingPageStatic>
      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Metrics"
              title="Live payment telemetry"
              description="Aggregated from in-memory server logs — refreshes every 8 seconds during the demo."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Settled txns", value: m?.totalTransactions ?? "—" },
              { label: "USDC volume", value: m?.usdcVolumeFormatted ?? "—" },
              {
                label: "402 → 200 success",
                value: m?.successRate != null ? `${m.successRate}%` : "—",
              },
              { label: "Recent 402 quotes", value: m?.recent402Count ?? "—" },
            ].map((stat, index) => (
              <Reveal key={stat.label} delay={index * 70}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-3xl text-foreground">{stat.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-xl text-foreground">Recent events</h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[640px] text-left font-sans text-sm">
                <thead className="border-b border-border bg-secondary/60">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Time</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Outcome</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Pages</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Tx</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recent ?? []).map((entry) => (
                    <tr key={`${entry.timestamp}-${entry.txId ?? entry.outcome}`} className="border-b border-border/60">
                      <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2">{entry.outcome}</td>
                      <td className="px-4 py-2">{entry.pages}</td>
                      <td className="px-4 py-2">{entry.price}</td>
                      <td className="px-4 py-2">
                        {entry.txId ? (
                          <Link
                            to="/receipt/$txId"
                            params={{ txId: entry.txId }}
                            className="font-mono text-[11px] text-accent-blue hover:underline"
                          >
                            {entry.txId.slice(0, 12)}…
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                  {!data?.recent?.length && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No events yet — run the live demo to populate metrics.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>
    </MarketingPageStatic>
  );
}
