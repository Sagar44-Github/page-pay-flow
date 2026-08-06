import { Suspense, lazy, useEffect, useRef, useState } from "react";

const HeroScene = lazy(() => import("@/landing/HeroScene"));

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function Hero({ onTryIt, onHowItWorks }: { onTryIt: () => void; onHowItWorks: () => void }) {
  const reducedMotion = usePrefersReducedMotion();
  const scrollRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = stageRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const travel = rect.height + window.innerHeight * 0.3;
      scrollRef.current = Math.min(1, Math.max(0, -rect.top / travel));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <section className="pp-hero" aria-labelledby="pp-hero-title">
      <div className="pp-hero-grid">
        <div className="pp-hero-copy">
          <h1 id="pp-hero-title" className="pp-hero-display">
            Many pages in.
            <br />
            One paid summary out.
          </h1>
          <p className="pp-lead pp-hero-sub">
            PagePay reads your document and charges a cent a page — settled on-chain, per request,
            over the x402 payment protocol.
          </p>
          <div className="pp-btn-row">
            <button type="button" className="pp-btn" onClick={onTryIt}>
              Try it now
            </button>
            <button type="button" className="pp-btn pp-btn-ghost" onClick={onHowItWorks}>
              How it works
            </button>
          </div>
          <p className="pp-caption pp-hero-meta">
            No accounts. No subscriptions. Algorand Testnet, Pera Wallet.
          </p>
        </div>

        <div className="pp-stage" ref={stageRef}>
          <div className="pp-stage-object">
            {mounted ? (
              <Suspense
                fallback={
                  <div className="pp-stage-fallback pp-caption">Preparing the page stack…</div>
                }
              >
                <HeroScene scrollRef={scrollRef} animate={!reducedMotion} />
              </Suspense>
            ) : (
              <div className="pp-stage-fallback pp-caption">Preparing the page stack…</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
