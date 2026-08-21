import { Link, createFileRoute } from "@tanstack/react-router";

import { Container } from "@/components/marketing/Container";
import { MarketingCard } from "@/components/marketing/MarketingCard";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [{ title: "Product — PagePay" }],
  }),
  component: ProductPage,
});

const CAPABILITIES = [
  {
    title: "Document intake",
    body: "Accept PDF uploads or raw JSON text. Page count drives price — one quote, one charge, no drift.",
  },
  {
    title: "402-native quoting",
    body: "Payment requirements live in PAYMENT-REQUIRED headers (x402 v2). Clients never guess amounts or assets.",
  },
  {
    title: "Facilitator-backed settlement",
    body: "Verify and settle through GoPlausible before summarization runs. Failed payments never unlock paid work.",
  },
  {
    title: "Observability built in",
    body: "Structured request logs, protocol proof panels, and explorer links for every successful settlement.",
  },
] as const;

function ProductPage() {
  return (
    <MarketingPage>
      {() => (
        <>
          <section className="border-b border-border py-20 md:py-28">
            <Container>
              <Reveal>
                <SectionHeading
                  eyebrow="Product"
                  title="Metered AI APIs without billing infrastructure"
                  description="PagePay packages x402 + Algorand into a developer experience that feels like calling any other HTTP API — except unpaid requests get a quote instead of a 401."
                />
              </Reveal>
              <Reveal delay={100}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    to="/demo"
                    className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                  >
                    Try the live demo
                  </Link>
                  <Link
                    to="/x402-demo"
                    className="rounded-full border border-border bg-card px-6 py-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Protocol sandbox
                  </Link>
                  <Link
                    to="/docs"
                    className="rounded-full border border-border px-6 py-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Read documentation
                  </Link>
                </div>
              </Reveal>
            </Container>
          </section>
          <section className="py-20">
            <Container>
              <div className="grid gap-6 md:grid-cols-2">
                {CAPABILITIES.map((item, index) => (
                  <Reveal key={item.title} delay={index * 80}>
                    <MarketingCard title={item.title} description={item.body} className="h-full" />
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        </>
      )}
    </MarketingPage>
  );
}
