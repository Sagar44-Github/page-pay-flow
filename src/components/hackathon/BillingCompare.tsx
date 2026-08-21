import { Reveal } from "@/components/marketing/Reveal";
import { Container } from "@/components/marketing/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const API_KEY_FLOW = [
  "Create developer account",
  "Add credit card / billing profile",
  "Generate API key in dashboard",
  "Store key in secrets manager",
  "Attach Authorization header on every request",
  "Provider meters usage in database",
  "Monthly invoice reconciliation",
] as const;

const X402_FLOW = [
  "POST resource (no payment header)",
  "Receive HTTP 402 + PAYMENT-REQUIRED quote",
  "Wallet signs exact USDC transfer",
  "Retry POST with PAYMENT-SIGNATURE",
  "Facilitator verify + on-chain settle",
  "Receive 200 + resource + tx proof",
] as const;

export function BillingCompare() {
  return (
    <section className="border-b border-border py-20 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Compare"
            title="API keys vs HTTP 402 billing"
            description="Same AI resource — two integration models. x402 removes account setup and prepaid credits from the critical path."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal delay={80}>
            <div className="rounded-2xl border border-border bg-card p-8">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Traditional · API key billing
              </p>
              <p className="mt-4 font-display text-3xl text-foreground">{API_KEY_FLOW.length} steps</p>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                Typical time to first paid response:{" "}
                <strong className="text-foreground">hours–days</strong> (signup + billing)
              </p>
              <ol className="mt-6 space-y-2 font-sans text-sm text-muted-foreground">
                {API_KEY_FLOW.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="rounded-2xl border border-border bg-card p-8">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                PagePay · HTTP 402 billing
              </p>
              <p className="mt-4 font-display text-3xl text-foreground">{X402_FLOW.length} steps</p>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                Typical time to first paid response:{" "}
                <strong className="text-foreground">&lt; 60 seconds</strong> (wallet + USDC)
              </p>
              <ol className="mt-6 space-y-2 font-sans text-sm text-muted-foreground">
                {X402_FLOW.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
