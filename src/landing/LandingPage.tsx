import { CtaBand, FeatureGrid, Hero, SocialProof } from "@/components/marketing/landing-sections";
import { BillingCompare } from "@/components/hackathon/BillingCompare";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { HowItWorks } from "@/landing/HowItWorks";
import { LiveDemo } from "@/landing/LiveDemo";
import { Pricing } from "@/landing/Pricing";
import { Walkthrough, useWalkthrough } from "@/landing/Walkthrough";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

import type { PeraWallet } from "@/lib/wallet/pera";

function LandingInner({ wallet }: { wallet: PeraWallet }) {
  const walkthrough = useWalkthrough();

  return (
    <>
      <Hero onTryIt={() => scrollTo("live-demo")} />
      <SocialProof />
      <FeatureGrid />
      <BillingCompare />
      <HowItWorks />
      <LiveDemo wallet={wallet} onOpenWalkthrough={() => walkthrough.setOpen(true)} />
      <Pricing />
      <CtaBand onTryIt={() => scrollTo("live-demo")} />
      <Walkthrough open={walkthrough.open} onClose={walkthrough.close} />
    </>
  );
}

export default function LandingPage() {
  return <MarketingPage>{(wallet) => <LandingInner wallet={wallet} />}</MarketingPage>;
}
