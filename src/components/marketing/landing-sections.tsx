import { Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { ClientOnly } from "@/components/ClientOnly";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/Container";
import { MarketingCard } from "@/components/marketing/MarketingCard";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const HeroScene = lazy(() =>
  import("@/components/marketing/HeroScene").then((m) => ({ default: m.HeroScene })),
);

const FEATURES = [
  {
    title: "HTTP-native metering",
    body: "Every document request returns a machine-readable 402 with exact payment requirements — pages, price, asset, and pay-to address.",
    accent: "text-accent-green",
  },
  {
    title: "Algorand settlement",
    body: "Payments settle on Algorand Testnet via the GoPlausible facilitator. Verify, settle, then fulfill — no prepaid credits.",
    accent: "text-accent-violet",
  },
  {
    title: "Wallet-signed exact payments",
    body: "Pera Wallet signs an exact-AVM USDC transfer. Your API never holds keys; the client brings the payment header on retry.",
    accent: "text-accent-blue",
  },
  {
    title: "Developer-first proof",
    body: "Raw HTTP exchanges, tx IDs, and explorer links are surfaced in the UI so you can audit every step of the protocol.",
    accent: "text-accent-amber",
  },
] as const;

const LOGOS = ["x402", "Algorand", "USDC", "Pera", "Groq"] as const;

export function Hero({ onTryIt }: { onTryIt: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="grid-marketing absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] opacity-80">
        <ClientOnly
          fallback={<div className="size-full rounded-full bg-accent-green/5 blur-3xl" />}
        >
          <Suspense fallback={<div className="size-full rounded-full bg-accent-green/5 blur-3xl" />}>
            <HeroScene className="size-full" />
          </Suspense>
        </ClientOnly>
      </div>
      <Container className="relative py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl">
          <Reveal>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full font-mono text-[10px]">
                scheme: exact
              </Badge>
              <Badge variant="outline" className="rounded-full font-mono text-[10px]">
                algorand testnet
              </Badge>
              <Badge variant="outline" className="rounded-full font-mono text-[10px]">
                $0.01 / page
              </Badge>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-display-large mt-8 text-foreground">
              Payments for
              <span className="text-accent-green"> APIs</span>
              <br />
              that read like HTTP.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-muted-foreground">
              PagePay is a SaaS-style demo of pay-per-page AI summarization: upload a document,
              receive HTTP 402, sign USDC on Algorand, get your summary on the retried request.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
                onClick={onTryIt}
              >
                Start live demo
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full" asChild>
                <Link to="/x402-demo">Protocol sandbox</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link to="/docs">Read the docs</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-14 flex flex-wrap items-center gap-3">
              {LOGOS.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-border px-4 py-1.5 font-mono text-xs text-subtle"
                >
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function SocialProof() {
  return (
    <section className="border-b border-border bg-secondary/50 py-12">
      <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <Reveal>
          <p className="max-w-xl font-sans text-sm text-muted-foreground">
            Built on the x402 exact-AVM scheme with a hosted facilitator, testnet USDC pricing, and
            Pera Wallet signing — the same primitives you would wire into any metered API product.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="font-mono text-xs text-accent-green">
            <span>402 → sign → settle → 200</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function FeatureGrid() {
  return (
    <section className="border-b border-border py-20 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Platform"
            title="Everything you need to ship metered AI APIs"
            description="From quote to settlement to fulfillment — PagePay demonstrates the full x402 lifecycle with production-shaped HTTP semantics."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 90}>
              <MarketingCard
                title={feature.title}
                description={feature.body}
                accent={feature.accent}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function CtaBand({ onTryIt }: { onTryIt: () => void }) {
  return (
    <section className="py-20 md:py-24">
      <Container>
        <Reveal>
          <div className="rounded-3xl border border-border bg-card px-8 py-12 text-center md:px-16 md:py-16">
            <h2 className="text-display-hero text-foreground">Ready to test a real 402 flow?</h2>
            <p className="mx-auto mt-4 max-w-lg font-sans text-muted-foreground">
              Connect Pera on Testnet, fund USDC, and run pay-per-page summarization in under a
              minute — or explore the protocol sandbox with zero wallet setup.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 text-primary-foreground"
                onClick={onTryIt}
              >
                Open live demo
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full" asChild>
                <Link to="/x402-demo">Protocol sandbox</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link to="/developers">View API flow</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
