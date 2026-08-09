import { Footer } from "@/landing/Footer";
import { Hero } from "@/landing/Hero";
import { HowItWorks } from "@/landing/HowItWorks";
import { LiveDemo } from "@/landing/LiveDemo";
import { Nav } from "@/landing/Nav";
import { Pricing } from "@/landing/Pricing";
import { Walkthrough, useWalkthrough } from "@/landing/Walkthrough";
import { usePeraWallet } from "@/lib/wallet/pera";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function LandingPage() {
  const wallet = usePeraWallet();
  const walkthrough = useWalkthrough();

  return (
    <div className="min-h-screen bg-background" id="top">
      <Nav wallet={wallet} />
      <main>
        <Hero onTryIt={() => scrollTo("live-demo")} />
        <HowItWorks />
        <LiveDemo wallet={wallet} onOpenWalkthrough={() => walkthrough.setOpen(true)} />
        <Pricing />
      </main>
      <Footer />
      <Walkthrough open={walkthrough.open} onClose={walkthrough.close} />
    </div>
  );
}
