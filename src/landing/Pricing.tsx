import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const TIERS = [
  {
    name: "Developer",
    price: "$0.01",
    unit: "per page",
    description: "Testnet demo pricing for the live summarization flow.",
    features: [
      "HTTP 402 quotes",
      "Testnet USDC settlement",
      "Pera Wallet signing",
      "Raw protocol proof in UI",
    ],
    cta: "Try live demo",
    to: "/demo" as const,
    highlighted: true,
  },
  {
    name: "Integrator",
    price: "Custom",
    unit: "volume",
    description: "Wire x402 into your own APIs with the same facilitator and scheme.",
    features: [
      "Exact-AVM requirements",
      "Hosted facilitator",
      "Dynamic per-request pricing",
      "Facilitator verify/settle hooks",
    ],
    cta: "Read developers docs",
    to: "/developers" as const,
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Talk",
    unit: "to us",
    description: "Self-hosted facilitators, mainnet readiness, and SLA-shaped settlement.",
    features: [
      "Custom pay-to routes",
      "Multi-asset support",
      "Observability & logging",
      "Dedicated support",
    ],
    cta: "View integrations",
    to: "/integrations" as const,
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
    <section id="pricing" className="border-b border-border py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple metering, no subscriptions"
          description="PagePay charges per parsed page. Quotes are computed server-side so the UI price always matches the 402 requirement."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-accent-green/40 bg-card ring-1 ring-accent-green/20"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-section-heading text-foreground">{tier.name}</h3>
                {tier.highlighted && (
                  <Badge className="rounded-full bg-accent-green/15 text-accent-green">
                    Live
                  </Badge>
                )}
              </div>
              <p className="mt-4">
                <span className="font-display text-4xl text-foreground">{tier.price}</span>
                <span className="ml-2 text-sm text-muted-foreground">{tier.unit}</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-muted-foreground">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-accent-green">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 rounded-full ${tier.highlighted ? "bg-primary text-primary-foreground" : ""}`}
                variant={tier.highlighted ? "default" : "secondary"}
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
              <p className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                {fact.label}
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">{fact.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
