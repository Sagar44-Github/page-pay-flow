import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Autonomous Agent",
    price: "$0.01",
    unit: "per page",
    description: "Algorand Testnet USDC exact-metered pricing for AI Agents.",
    features: [
      "HTTP 402 exact scheme quotes",
      "5 Modes (Summary, Action Items, Key Risks, Compliance, Checklist)",
      "Agent Spend Policy Guard ($/request & $/session)",
      "Tamper-Evident SHA-256 Audit Trail",
    ],
    cta: "Launch Live Demo",
    to: "/demo" as const,
    highlighted: true,
  },
  {
    name: "Multi-Doc Compare",
    price: "$0.01",
    unit: "per combined page",
    description: "Side-by-side AI document comparison with single atomic payment.",
    features: [
      "Combined page calculation",
      "Structural Document A vs B analysis",
      "Single 402 payment transaction",
      "Independent receipt verification",
    ],
    cta: "Compare Documents",
    to: "/demo" as const,
    highlighted: false,
  },
  {
    name: "Developer API",
    price: "$0.00",
    unit: "public read",
    description: "Public read-only endpoints for receipts, trust scores, and audit verification.",
    features: [
      "GET /api/receipt (Receipt Verification)",
      "GET /api/trust-score (Address Reliability)",
      "GET /api/audit/verify (SHA-256 Chain Check)",
      "GET /api/tools (Agent Discovery)",
    ],
    cta: "Read API Docs",
    to: "/docs" as const,
    highlighted: false,
  },
] as const;

const FACTS = [
  { label: "Asset", value: "USDC (ASA 10458941)" },
  { label: "Network", value: "Algorand Testnet" },
  { label: "Scheme", value: "exact · x402 v2" },
  { label: "Facilitator", value: "facilitator.goplausible.xyz" },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-border py-20 md:py-24 font-mono">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs uppercase tracking-wider text-primary">SIMPLE METERING</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Machine Pricing &amp; Capabilities
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-muted-foreground">
            PagePay charges strictly per parsed page. No monthly subscriptions, no lock-in.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                tier.highlighted
                  ? "border-primary/50 bg-card ring-1 ring-primary/20"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{tier.name}</h3>
                {tier.highlighted && (
                  <Badge className="bg-primary/20 text-primary border border-primary/40 text-[10px]">
                    Live Flow
                  </Badge>
                )}
              </div>
              <p className="mt-4">
                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                <span className="ml-2 text-xs text-muted-foreground">{tier.unit}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-xs text-muted-foreground">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 ${tier.highlighted ? "bg-primary text-primary-foreground font-semibold" : ""}`}
                variant={tier.highlighted ? "default" : "outline"}
                asChild
              >
                <Link to={tier.to}>{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {fact.label}
              </p>
              <p className="mt-1 text-xs text-foreground font-bold">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
