import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero({ onTryIt }: { onTryIt: () => void }) {
  return (
    <section className="border-b border-border bg-card/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[11px] bg-primary/10 text-primary border-primary/30">
            Machine-to-Machine Payments
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px]">
            HTTP 402 Exact Scheme
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px]">
            Algorand Testnet (ASA 10458941)
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px]">
            $0.01 / Page
          </Badge>
        </div>
        <h1 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl font-mono">
          Machine-to-Machine Pay-Per-Page AI Summarization &amp; Extraction
        </h1>
        <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-muted-foreground font-mono">
          Autonomous AI agents and clients pay for document processing in real-time over standard HTTP 402 on Algorand.
          Features 5 extraction modes (Summary, Action Items, Key Risks, Compliance Check, Checklist), Tamper-Evident SHA-256 Audit Trail,
          Standalone Receipt Verification, Algorand Agent Trust Scores, and Client-Side Spend Policy Enforcement.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onTryIt} className="font-mono font-semibold">
            Launch Live Demo
          </Button>
          <Button variant="outline" asChild className="font-mono">
            <a href="/docs">Explore Documentation</a>
          </Button>
          <Button variant="secondary" asChild className="font-mono">
            <a href="/x402-demo">Protocol Demo</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
