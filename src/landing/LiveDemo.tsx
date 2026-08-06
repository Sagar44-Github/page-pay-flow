import { useState } from "react";

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
    <section id="live-demo" className="pp-section pp-parchment" aria-labelledby="pp-demo-title">
      <div className="pp-inner">
        <h2 id="pp-demo-title" className="pp-display-lg">
          Try it with a real payment.
        </h2>
        <p className="pp-lead pp-muted" style={{ marginTop: 24, maxWidth: 720 }}>
          Testnet funds only. Every response below comes from the live backend.
        </p>

        <div className="pp-demo-grid">
          <div>
            <div className="pp-card">
              <h3 className="pp-card-title">Document</h3>
              <label className="pp-drop">
                <span className="pp-body-strong">{file ? file.name : "Choose a PDF or .txt"}</span>
                <span className="pp-caption pp-muted-soft">
                  Up to 10 MB and {MAX_PAGES} pages
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,text/plain,application/pdf"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                    setQuote(null);
                  }}
                />
              </label>
              {file && (
                <button
                  type="button"
                  className="pp-btn pp-btn-ghost pp-btn-sm"
                  style={{ marginTop: 12 }}
                  onClick={() => setFile(null)}
                >
                  Remove file
                </button>
              )}

              <span className="pp-label pp-caption">Or paste text</span>
              <textarea
                className="pp-textarea"
                value={text}
                disabled={Boolean(file)}
                placeholder="Paste document text here. 500 words counts as one page."
                onChange={(event) => {
                  setText(event.target.value);
                  setQuote(null);
                }}
              />
              {localPages !== null && localPages > 0 && (
                <p className="pp-caption pp-muted-soft" style={{ marginTop: 12 }}>
                  About {localPages} page{localPages === 1 ? "" : "s"} —{" "}
                  {priceForPages(localPages)}
                </p>
              )}
            </div>

            <div className="pp-card">
              <h3 className="pp-card-title">Price and payment</h3>
              <div className="pp-btn-row" style={{ marginTop: 17 }}>
                <button
                  type="button"
                  className="pp-btn pp-btn-ghost"
                  onClick={() => void handleQuote()}
                  disabled={quoting}
                >
                  {quoting ? "Pricing…" : "Get a price"}
                </button>
                <button
                  type="button"
                  className="pp-btn"
                  onClick={() => void handlePayAndSummarize()}
                  disabled={running}
                >
                  {running ? "Paying…" : "Pay and summarize"}
                </button>
              </div>

              {quote && (
                <dl className="pp-kv">
                  <dt>Pages</dt>
                  <dd className="pp-caption">{quote.pages}</dd>
                  <dt>Price</dt>
                  <dd className="pp-caption">{quote.price}</dd>
                  <dt>Network</dt>
                  <dd className="pp-caption">{quote.network}</dd>
                  <dt>Facilitator</dt>
                  <dd className="pp-caption">{quote.facilitator}</dd>
                </dl>
              )}

              {!wallet.address && (
                <p className="pp-caption pp-inline-note">
                  Connect Pera Wallet in the nav bar to sign the x402 payment.
                </p>
              )}
              {error && (
                <p className="pp-error pp-body" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="pp-card">
              <h3 className="pp-card-title">Summary</h3>
              {summary?.summary ? (
                <>
                  <p className="pp-body pp-summary">{summary.summary}</p>
                  <hr className="pp-hr" />
                  <dl className="pp-kv">
                    <dt>Pages paid</dt>
                    <dd className="pp-caption">{summary.pages}</dd>
                    <dt>Paid</dt>
                    <dd className="pp-caption">
                      {summary.pricePaid} {summary.amountPaid ? `(${summary.amountPaid})` : ""}
                    </dd>
                    <dt>Transaction</dt>
                    <dd className="pp-caption">
                      {summary.explorer ? (
                        <a
                          className="pp-link"
                          href={summary.explorer}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {summary.txId}
                        </a>
                      ) : (
                        (summary.txId ?? "—")
                      )}
                    </dd>
                  </dl>
                </>
              ) : (
                <p className="pp-body pp-muted-soft" style={{ marginTop: 17 }}>
                  Your summary appears here once the payment settles.
                </p>
              )}
            </div>

            {exchange && (
              <div className="pp-card">
                <h3 className="pp-card-title">Protocol proof</h3>
                <p className="pp-caption pp-muted-soft" style={{ marginTop: 12 }}>
                  First response: {exchange.unpaid.status} {exchange.unpaid.statusText}
                </p>
                <pre className="pp-pre">{JSON.stringify(quotedBody, null, 2)}</pre>
                {exchange.paid && (
                  <>
                    <p className="pp-caption pp-muted-soft" style={{ marginTop: 17 }}>
                      After payment: {exchange.paid.status} {exchange.paid.statusText}
                    </p>
                    <pre className="pp-pre">
                      {JSON.stringify(safeJson(exchange.paid.body), null, 2)}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
