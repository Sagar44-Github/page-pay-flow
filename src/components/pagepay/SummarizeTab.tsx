import { useWallet } from "@txnlab/use-wallet-react";
import { useState } from "react";

import { RawExchangeView } from "@/components/pagepay/RawExchangeView";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PAGES, pagesForText, priceForPages } from "@/lib/pagepay/pricing";
import { payAndFetch, safeJson, type PaidRequestResult } from "@/lib/x402/client";

interface Quote {
  pages: number;
  price: string;
  network: string;
  facilitator: string;
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

export function SummarizeTab({ onActivity }: { onActivity: () => void }) {
  const { activeAddress, signTransactions } = useWallet();

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [running, setRunning] = useState(false);
  const [exchange, setExchange] = useState<PaidRequestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const localPages = file ? null : text.trim() ? pagesForText(text) : 0;

  async function handleQuote() {
    setError(null);
    setQuoting(true);
    try {
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const query = file ? `pages=1` : `words=${words}`;
      const response = await fetch(`/api/price?${query}`);
      const body = (await response.json()) as Quote & { reason?: string };
      if (!response.ok) throw new Error(body.reason ?? "Quote failed");
      setQuote(body);
      onActivity();
    } catch (quoteError) {
      setError(quoteError instanceof Error ? quoteError.message : String(quoteError));
    } finally {
      setQuoting(false);
    }
  }

  async function handleSummarize() {
    setError(null);
    setExchange(null);
    if (!activeAddress) {
      setError("Connect an Algorand Testnet wallet first.");
      return;
    }
    if (!file && !text.trim()) {
      setError("Upload a document or paste some text.");
      return;
    }

    setRunning(true);
    try {
      let init: RequestInit;
      if (file) {
        const form = new FormData();
        form.set("file", file);
        init = { method: "POST", body: form };
      } else {
        init = {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text }),
        };
      }

      const result = await payAndFetch("/api/summarize", init, {
        address: activeAddress,
        signTransactions: (txns, indexesToSign) =>
          signTransactions(txns, indexesToSign),
      });
      setExchange(result);
      if (result.error) setError(result.error);
      onActivity();
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : String(runError));
    } finally {
      setRunning(false);
    }
  }

  const summary = (exchange?.ok ? (exchange.result as SummaryResult) : null) ?? null;
  const failureBody = exchange && !exchange.ok ? safeJson(exchange.paid?.body ?? "") : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            1 · Document
          </h2>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center transition-colors hover:border-primary">
            <span className="text-sm font-medium text-card-foreground">
              {file ? file.name : "Upload a PDF or .txt"}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              max 10 MB · max {MAX_PAGES} pages
            </span>
            <input
              type="file"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              className="hidden"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setQuote(null);
              }}
            />
          </label>
          {file && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
              Remove file
            </Button>
          )}
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            or paste text
          </p>
          <Textarea
            value={text}
            disabled={Boolean(file)}
            onChange={(event) => {
              setText(event.target.value);
              setQuote(null);
            }}
            placeholder="Paste document text here… (500 words = 1 page)"
            className="mt-2 min-h-32 font-mono text-xs"
          />
          {localPages !== null && localPages > 0 && (
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              ≈ {localPages} page(s) → {priceForPages(localPages)}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            2 · Quote &amp; pay
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleQuote} disabled={quoting}>
              {quoting ? "Quoting…" : "Get price quote"}
            </Button>
            <Button onClick={handleSummarize} disabled={running}>
              {running ? "Paying & summarizing…" : "Pay with wallet & summarize"}
            </Button>
          </div>
          {quote && (
            <dl className="mt-4 grid grid-cols-2 gap-y-1 font-mono text-[11px] text-muted-foreground">
              <dt>pages</dt>
              <dd className="text-card-foreground">{quote.pages}</dd>
              <dt>price</dt>
              <dd className="text-card-foreground">{quote.price}</dd>
              <dt>network</dt>
              <dd className="text-card-foreground">{quote.network}</dd>
              <dt>facilitator</dt>
              <dd className="truncate text-card-foreground">{quote.facilitator}</dd>
            </dl>
          )}
          {!activeAddress && (
            <p className="mt-3 text-xs text-muted-foreground">
              Connect a Testnet wallet above to sign the x402 payment.
            </p>
          )}
          {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            3 · Protocol proof
          </h2>
          {!exchange && (
            <p className="mt-3 text-sm text-muted-foreground">
              Run a request to see the raw HTTP 402 challenge, the signed payment, and the settled
              transaction.
            </p>
          )}
          <div className="mt-3 space-y-3">
            {exchange && (
              <RawExchangeView
                title="Unpaid request → HTTP 402"
                exchange={exchange.unpaid}
                defaultOpen
              />
            )}
            {exchange?.paid && (
              <RawExchangeView title="Retry with X-PAYMENT" exchange={exchange.paid} />
            )}
          </div>
          {exchange?.settlement && (
            <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
              <dt>settled</dt>
              <dd className="text-card-foreground">{String(exchange.settlement.success)}</dd>
              <dt>network</dt>
              <dd className="text-card-foreground">{exchange.settlement.network}</dd>
              <dt>txid</dt>
              <dd className="break-all text-card-foreground">{exchange.settlement.transaction}</dd>
            </dl>
          )}
        </div>

        {summary?.summary && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              4 · Summary
            </h2>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {summary.pages} page(s) · {summary.pricePaid} · {summary.amountPaid}
              {summary.explorer && (
                <>
                  {" · "}
                  <a
                    className="underline"
                    href={summary.explorer}
                    target="_blank"
                    rel="noreferrer"
                  >
                    view tx
                  </a>
                </>
              )}
            </p>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
              {summary.summary}
            </div>
          </div>
        )}

        {Boolean(failureBody) && !summary?.summary && (
          <div className="rounded-xl border border-destructive/40 bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-destructive">
              Request failed
            </h2>
            <pre className="mt-2 max-h-64 overflow-auto rounded bg-muted p-3 font-mono text-[11px] text-card-foreground">
              {JSON.stringify(failureBody, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}
