import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PAGES, pagesForText, priceForPages } from "@/lib/pagepay/pricing";
import type { PeraWallet } from "@/lib/wallet/pera";
import { payAndFetch, safeJson, type PaidRequestResult } from "@/lib/x402/client";

interface Quote {
  pages: number;
  price: string;
  network: string;
  facilitator: string;
  reason?: string;
}

interface SummaryResult {
  summary?: string;
  pages?: number;
  pricePaid?: string;
  amountPaid?: string;
  txId?: string;
  explorer?: string;
  payer?: string;
  network?: string;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 break-all text-right font-mono text-[11px] text-card-foreground">
        {children}
      </span>
    </div>
  );
}

export function LiveDemo({ wallet }: { wallet: PeraWallet }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [running, setRunning] = useState(false);
  const [exchange, setExchange] = useState<PaidRequestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const localPages = file ? null : text.trim() ? pagesForText(text) : 0;
  const summary = exchange?.ok ? (exchange.result as SummaryResult) : null;

  async function handleQuote() {
    setError(null);
    setQuoting(true);
    try {
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const query = file ? "pages=1" : `words=${words}`;
      const response = await fetch(`/api/price?${query}`);
      const body = (await response.json()) as Quote;
      if (!response.ok) throw new Error(body.reason ?? "Quote failed");
      setQuote(body);
    } catch (quoteError) {
      setError(quoteError instanceof Error ? quoteError.message : String(quoteError));
    } finally {
      setQuoting(false);
    }
  }

  async function handlePayAndSummarize() {
    setError(null);
    setExchange(null);
    if (!wallet.signer) {
      setError("Connect Pera Wallet on Algorand Testnet first.");
      return;
    }
    if (!file && !text.trim()) {
      setError("Add a document or paste some text.");
      return;
    }

    setRunning(true);
    try {
      const init: RequestInit = file
        ? (() => {
            const form = new FormData();
            form.set("file", file);
            return { method: "POST", body: form };
          })()
        : {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ text }),
          };

      const result = await payAndFetch("/api/summarize", init, wallet.signer);
      setExchange(result);
      if (result.error) setError(result.error);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : String(runError));
    } finally {
      setRunning(false);
    }
  }

  const quotedBody = exchange?.unpaid ? safeJson(exchange.unpaid.body) : null;

  return (
    <section id="live-demo" className="border-b border-border bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Live flow · real 402, real payment
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every response below comes from the live backend. Testnet funds only.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card title="1 · Document">
              <label className="flex cursor-pointer flex-col gap-1 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 text-center transition-colors hover:border-primary/50">
                <span className="text-sm font-medium text-card-foreground">
                  {file ? file.name : "Choose a PDF or .txt"}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  up to 10 MB · {MAX_PAGES} pages max
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt,.md,text/plain,application/pdf"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                    setQuote(null);
                  }}
                />
              </label>
              {file && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setFile(null)}
                >
                  Remove file
                </Button>
              )}

              <div className="mt-4">
                <Label htmlFor="pp-text" className="text-xs text-muted-foreground">
                  Or paste text
                </Label>
                <Textarea
                  id="pp-text"
                  value={text}
                  disabled={Boolean(file)}
                  placeholder="Paste document text here. 500 words counts as one page."
                  className="mt-1 min-h-28 font-mono text-xs"
                  onChange={(event) => {
                    setText(event.target.value);
                    setQuote(null);
                  }}
                />
              </div>
              {localPages !== null && localPages > 0 && (
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  ≈ {localPages} page{localPages === 1 ? "" : "s"} · {priceForPages(localPages)}
                </p>
              )}
            </Card>

            <Card title="2 · Price &amp; payment">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" disabled={quoting} onClick={() => void handleQuote()}>
                  {quoting ? "Pricing…" : "Get a price"}
                </Button>
                <Button disabled={running} onClick={() => void handlePayAndSummarize()}>
                  {running ? "Paying…" : "Pay and summarize"}
                </Button>
              </div>

              {quote && (
                <div className="mt-4">
                  <Row label="Pages">{quote.pages}</Row>
                  <Row label="Price">{quote.price}</Row>
                  <Row label="Network">{quote.network}</Row>
                  <Row label="Facilitator">{quote.facilitator}</Row>
                </div>
              )}

              {!wallet.address && (
                <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                  connect pera wallet in the header to sign the x402 payment
                </p>
              )}
              {error && (
                <p
                  className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="3 · Summary">
              {summary?.summary ? (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
                    {summary.summary}
                  </p>
                  <div className="mt-4">
                    <Row label="Pages paid">{summary.pages}</Row>
                    <Row label="Paid">
                      {summary.pricePaid} {summary.amountPaid ? `(${summary.amountPaid})` : ""}
                    </Row>
                    <Row label="Transaction">
                      {summary.explorer ? (
                        <a
                          className="text-primary underline-offset-2 hover:underline"
                          href={summary.explorer}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {summary.txId}
                        </a>
                      ) : (
                        (summary.txId ?? "—")
                      )}
                    </Row>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your summary appears here once the payment settles.
                </p>
              )}
            </Card>

            {exchange && (
              <Card title="Protocol proof · raw payloads">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-mono text-[11px]"
                  >
                    {exchange.unpaid.status} {exchange.unpaid.statusText}
                  </Badge>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    first response
                  </span>
                </div>
                <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-muted p-3 font-mono text-[11px] leading-relaxed text-card-foreground">
                  {JSON.stringify(quotedBody, null, 2)}
                </pre>
                {exchange.paid && (
                  <>
                    <div className="mt-4 flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[11px]">
                        {exchange.paid.status} {exchange.paid.statusText}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        after payment
                      </span>
                    </div>
                    <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-muted p-3 font-mono text-[11px] leading-relaxed text-card-foreground">
                      {JSON.stringify(safeJson(exchange.paid.body), null, 2)}
                    </pre>
                  </>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
