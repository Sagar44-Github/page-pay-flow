import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero({ onTryIt }: { onTryIt: () => void }) {
  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[11px]">
            scheme exact
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px]">
            algorand:testnet-v1.0
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px]">
            $0.01 / page
          </Badge>
        </div>
        <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Pay-per-page AI summaries, settled over HTTP 402.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Submit a document, receive a machine-readable 402 quote, sign one payment from Pera Wallet
          on Algorand Testnet, and get the summary back on the retried request. No accounts, no
          subscriptions, no minimums.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onTryIt}>Try the live flow</Button>
          <Button variant="secondary" asChild>
            <a href="/x402-demo">Inspect the protocol</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
