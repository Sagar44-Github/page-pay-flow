import { createFileRoute } from "@tanstack/react-router";

import { Container } from "@/components/marketing/Container";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { LiveDemo } from "@/landing/LiveDemo";
import { Walkthrough, useWalkthrough } from "@/landing/Walkthrough";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [{ title: "Live demo — PagePay" }],
  }),
  component: DemoPage,
});

import type { PeraWallet } from "@/lib/wallet/pera";

function DemoInner({ wallet }: { wallet: PeraWallet }) {
  const walkthrough = useWalkthrough();
  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Live demo"
            title="Run a full pay-per-page flow"
            description="Connect Pera on Testnet, fund USDC, upload a document, and watch HTTP 402 become a settled summary."
          />
        </Container>
      </section>
      <LiveDemo wallet={wallet} onOpenWalkthrough={() => walkthrough.setOpen(true)} />
      <Walkthrough open={walkthrough.open} onClose={walkthrough.close} />
    </>
  );
}

function DemoPage() {
  return <MarketingPage>{(wallet) => <DemoInner wallet={wallet} />}</MarketingPage>;
}
