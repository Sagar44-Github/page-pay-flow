import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Container } from "@/components/marketing/Container";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";
import { Reveal } from "@/components/marketing/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/receipt/$txId")({
  head: ({ params }) => ({
    meta: [{ title: `Receipt ${params.txId.slice(0, 12)}… — PagePay` }],
  }),
  component: ReceiptPage,
});

interface ReceiptData {
  txId: string;
  timestamp: string;
  pages: number;
  price: string;
  payer?: string;
  route: string;
  outcome: string;
  explorer: string;
}

function ReceiptPage() {
  const { txId } = Route.useParams();
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/receipt?txId=${encodeURIComponent(txId)}`);
        const body = (await response.json()) as ReceiptData & { error?: string };
        if (cancelled) return;
        if (response.ok) {
          setReceipt(body);
          setMissing(false);
        } else {
          setReceipt(null);
          setMissing(true);
        }
      } catch {
        if (!cancelled) setMissing(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [txId]);

  const explorer = `https://testnet.explorer.perawallet.app/tx/${encodeURIComponent(txId)}`;

  return (
    <MarketingPageStatic>
      <Container className="py-16 md:py-24">
        <Reveal>
          <Badge variant="outline" className="font-mono text-[10px]">
            payment receipt
          </Badge>
          <h1 className="text-display-hero mt-4 text-foreground">On-chain receipt</h1>
          <p className="mt-3 max-w-xl font-sans text-muted-foreground">
            Independent proof of settlement — verify this transaction on Algorand Testnet even
            outside the PagePay UI.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 rounded-2xl border border-border bg-card p-8">
            {loading ? (
              <p className="font-mono text-sm text-muted-foreground">Loading receipt…</p>
            ) : receipt ? (
              <dl className="grid gap-4 font-sans text-sm sm:grid-cols-[140px_1fr]">
                <dt className="text-muted-foreground">Transaction</dt>
                <dd className="break-all font-mono text-xs text-foreground">{receipt.txId}</dd>
                <dt className="text-muted-foreground">Timestamp</dt>
                <dd>{new Date(receipt.timestamp).toLocaleString()}</dd>
                <dt className="text-muted-foreground">Pages paid</dt>
                <dd>{receipt.pages}</dd>
                <dt className="text-muted-foreground">Amount</dt>
                <dd>{receipt.price}</dd>
                <dt className="text-muted-foreground">Payer</dt>
                <dd className="break-all font-mono text-xs">{receipt.payer ?? "—"}</dd>
                <dt className="text-muted-foreground">Route</dt>
                <dd className="font-mono text-xs">{receipt.route}</dd>
                <dt className="text-muted-foreground">Outcome</dt>
                <dd>{receipt.outcome}</dd>
              </dl>
            ) : (
              <div>
                <p className="font-sans text-sm text-muted-foreground">
                  {missing
                    ? "This transaction was not found in recent server logs. It may still be valid on-chain — verify directly on the explorer."
                    : "Receipt unavailable."}
                </p>
                <p className="mt-3 break-all font-mono text-xs text-foreground">{txId}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href={explorer} target="_blank" rel="noreferrer">
                  Open in explorer
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/demo">Back to live demo</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </MarketingPageStatic>
  );
}
