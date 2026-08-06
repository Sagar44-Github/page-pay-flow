import { Footer } from "@/landing/Footer";
import { Hero } from "@/landing/Hero";
import { HowItWorks } from "@/landing/HowItWorks";
import { LiveDemo } from "@/landing/LiveDemo";
import { Nav } from "@/landing/Nav";
import { Pricing } from "@/landing/Pricing";
import "@/landing/landing.css";
import { usePeraWallet } from "@/lib/wallet/pera";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function LandingPage() {
  const wallet = usePeraWallet();

  return (
    <div className="pp" id="top">
      <Nav wallet={wallet} />
      <main>
        <Hero onTryIt={() => scrollTo("live-demo")} onHowItWorks={() => scrollTo("how-it-works")} />
        <HowItWorks />
        <LiveDemo wallet={wallet} />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
