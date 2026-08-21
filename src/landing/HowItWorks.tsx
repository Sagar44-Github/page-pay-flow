import { Link } from "@tanstack/react-router";

import { Container } from "@/components/marketing/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const STEPS = [
  {
    n: "01",
    title: "Request a quote",
    body: "POST your document to /api/summarize. The server parses pages and responds with HTTP 402 plus payment requirements in the PAYMENT-REQUIRED header.",
  },
  {
    n: "02",
    title: "Sign in Pera",
    body: "The client builds an exact-AVM USDC transfer for the quoted amount. Pera Web or mobile approves the atomic transaction group.",
  },
  {
    n: "03",
    title: "Settle on-chain",
    body: "The facilitator verifies and settles via GoPlausible. Your payment hits Algorand Testnet before any paid work runs.",
  },
  {
    n: "04",
    title: "Receive the summary",
    body: "Retry with PAYMENT-SIGNATURE. On success you get JSON with the AI summary, txId, and an explorer link as independent proof.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Four HTTP requests worth of magic"
          description="No accounts, no API keys for payment — just standards-based 402, a wallet signature, and a retried POST."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:bg-card"
            >
              <span className="font-mono text-sm text-accent-violet">{step.n}</span>
              <h3 className="text-section-heading mt-3 text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          Deep dive in{" "}
          <Link to="/docs/x402" className="text-accent-blue hover:underline">
            x402 docs
          </Link>{" "}
          and{" "}
          <Link to="/docs/algorand" className="text-accent-blue hover:underline">
            Algorand settlement
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
