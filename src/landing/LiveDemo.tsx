import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PAGES, pagesForText, priceForPages } from "@/lib/pagepay/pricing";
import { Container } from "@/components/marketing/Container";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { RangeDemo } from "@/landing/RangeDemo";
import { CurlExportButton } from "@/components/hackathon/CurlExportButton";
import {
  PaymentHeaderInspector,
  pickPaymentHeaders,
} from "@/components/hackathon/PaymentHeaderInspector";
import type { PeraWallet } from "@/lib/wallet/pera";
import {
  TESTNET_DISPENSER_URL,
  payAndFetch,
  safeJson,
  type PaidRequestResult,
  type PaymentFailureCode,
  type PaymentPhase,
} from "@/lib/x402/client";

interface Quote {
  pages: number;
  price: string;
  network: string;
  facilitator: string;
  reason?: string;
}

interface SummaryResult {
  summary?: string;
  mode?: string;
  pages?: number;
  pricePaid?: string;
  amountPaid?: string;
  txId?: string;
  explorer?: string;
  payer?: string;
  network?: string;
}

/** Friendly, actionable copy per detected failure cause. */
type FriendlyError = { message: string; action?: "connect" | "fund" };

const FAILURE_COPY: Record<PaymentFailureCode, FriendlyError> = {
  cancelled: {
    message:
      "Payment was cancelled in Pera Wallet. Tap “Pay and summarize” again when you're ready.",
  },
  insufficient_funds: {
    message:
      "Your wallet needs testnet USDC (ASA 10458941) for the payment, plus a little testnet ALGO for fees. ALGO alone is not enough — get testnet USDC from a faucet, then retry.",
    action: "fund",
  },
  requirements_unreadable: {
    message:
      "The server's 402 payment requirements couldn't be read. Check the raw payload in Protocol proof below.",
  },
  signing_failed: {
    message:
      "Pera Wallet couldn't sign the payment. On desktop Chrome/Edge, look for a new tab at web.perawallet.app and approve the USDC transfer — or scan the QR with the Pera mobile app. Make sure Pera is on Testnet.",
  },
  verification_failed: {
    message:
      "Payment could not be verified on Algorand. This is usually temporary — wait a moment and try again.",
  },
  quote_mismatch: {
    message:
      "The price changed between the quote and the payment. Press “Get a price” again to refresh the quote, then pay.",
  },
  gateway_unavailable: {
    message:
      "The payment facilitator didn't respond in time. This is usually temporary — try again in a few seconds.",
  },
  network: {
    message: "Lost connection while processing payment. Check your connection and try again.",
  },
  bad_request: {
    message: "The document couldn't be read. Try a text-based PDF (not a scan) or paste the text.",
  },
  server_error: {
    message:
      "Something went wrong on the server after the request was sent. Check Protocol proof below for the raw response.",
  },
};

const PHASE_LABEL: Record<PaymentPhase, string> = {
  quoting: "requesting 402 quote",
  awaiting_signature: "awaiting signature in Pera",
  submitted: "payment submitted",
  verifying: "verifying settlement",
  settled: "settled",
  failed: "failed",
};

function Card({
  title,
  children,
  walkthrough,
}: {
  title: string;
  children: React.ReactNode;
  walkthrough?: string;
}) {
  return (
    <div
      className="rounded-xl border border-border bg-card p-5 transition-shadow"
      {...(walkthrough ? { "data-walkthrough": walkthrough } : {})}
    >
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

export function LiveDemo({
  wallet,
  onOpenWalkthrough,
}: {
  wallet: PeraWallet;
  onOpenWalkthrough?: () => void;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"summary" | "action_items" | "key_risks">("summary");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<PaymentPhase | null>(null);
  const [exchange, setExchange] = useState<PaidRequestResult | null>(null);
  const [error, setError] = useState<FriendlyError | null>(null);

  const localPages = file ? null : text.trim() ? pagesForText(text) : 0;
  const summary = exchange?.ok ? (exchange.result as SummaryResult) : null;

  function fail(next: FriendlyError) {
    setError(next);
  }

  /** Exact quote: the real file is POSTed so /api/price parses it like /api/summarize. */
  async function handleQuote() {
    setError(null);
    setQuoting(true);
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
      if (!file && !text.trim()) {
        fail({ message: "Add a document or paste some text first." });
        return;
      }
      const response = await fetch("/api/price", init);
      const body = (await response.json()) as Quote;
      if (!response.ok) {
        fail({ message: body.reason ?? "The document couldn't be priced." });
        return;
      }
      setQuote(body);
    } catch (quoteError) {
      console.error("[pagepay] quote failed", quoteError);
      fail({ message: "Couldn't reach the pricing endpoint. Check your connection and retry." });
    } finally {
      setQuoting(false);
    }
  }

  async function handlePayAndSummarize() {
    setError(null);
    setExchange(null);
    setPhase(null);

    if (!wallet.signer) {
      fail({ message: "Connect Pera Wallet in the header first.", action: "connect" });
      return;
    }
    if (!file && !text.trim()) {
      fail({ message: "Add a document or paste some text." });
      return;
    }

    setRunning(true);
    try {
      const init: RequestInit = file
        ? (() => {
            const form = new FormData();
            form.set("file", file);
            form.set("mode", mode);
            return { method: "POST", body: form };
          })()
        : {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ text, mode }),
          };

      const result = await payAndFetch("/api/summarize", init, wallet.signer, {
        ...(quote ? { expectedPages: quote.pages } : {}),
        onPhase: setPhase,
      });
      setExchange(result);
      if (!result.ok) {
        console.error("[pagepay] payment failed", result.failureCode, result.error, result);
        const friendly = result.failureCode ? FAILURE_COPY[result.failureCode] : undefined;
        fail(
          friendly ?? {
            message: "The payment couldn't be completed. See Protocol proof below for details.",
          },
        );
      }
    } catch (runError) {
      console.error("[pagepay] unexpected payment error", runError);
      setPhase("failed");
      fail({
        message:
          "The payment couldn't be completed because of an unexpected error. Details are in the browser console.",
      });
    } finally {
      setRunning(false);
    }
  }

  async function handleAgentAutopay() {
    if (!file && !text.trim()) {
      fail({ message: "Add a document or paste text first." });
      return;
    }
    if (!wallet.signer) {
      fail({
        message: "Connect Pera Wallet — or use Protocol demo with Judge wallet (no Pera).",
        action: "connect",
      });
      return;
    }
    if (!quote) await handleQuote();
    await handlePayAndSummarize();
  }

  const quotedBody = exchange?.unpaid ? safeJson(exchange.unpaid.body) : null;
  const detectedPages = exchange?.quotedPages ?? quote?.pages ?? (localPages || null);
  const quotedPrice = exchange?.quotedPrice ?? quote?.price ?? null;
  const paymentStatus: PaymentPhase | "not_started" = phase ?? "not_started";

  const headerPick = exchange
    ? {
        ...pickPaymentHeaders(exchange.unpaid.headers),
        ...(exchange.paid ? pickPaymentHeaders(exchange.paid.headers) : {}),
      }
    : null;

  const retryBody = file ? undefined : JSON.stringify({ text });

  return (
    <section id="live-demo" className="border-b border-border py-20 md:py-24">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading
            eyebrow="Live demo"
            title="Real 402, real payment, real summary"
            description="Every response below comes from the live backend. Testnet USDC only."
          />
          <div className="flex items-center gap-3">
            <a
              href="/api/tools"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-primary underline underline-offset-4 hover:text-primary/80"
            >
              🤖 For AI agents: /api/tools
            </a>
            {onOpenWalkthrough && (
              <Button variant="secondary" size="sm" onClick={onOpenWalkthrough}>
                ? How it works
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="space-y-6">
            {/* ── Mode Selector ── */}
            <Card title="Extraction Mode">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={mode === "summary" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setMode("summary")}
                >
                  Summary
                </Button>
                <Button
                  variant={mode === "action_items" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setMode("action_items")}
                >
                  Action Items
                </Button>
                <Button
                  variant={mode === "key_risks" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setMode("key_risks")}
                >
                  Key Risks
                </Button>
              </div>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                {mode === "summary" && "Standard document summary (overview, key points, flagged items)."}
                {mode === "action_items" && "Extract concrete tasks, assignments, owners, and deadlines."}
                {mode === "key_risks" && "Identify risky, concerning, or notable clauses and liabilities."}
              </p>
            </Card>

            <Card title="1 · Document" walkthrough="document">
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
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
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
              {file && (
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  page count is read from the PDF itself when you press “Get a price”
                </p>
              )}
            </Card>

            <Card title="2 · Price &amp; payment">
              <div className="flex flex-wrap gap-2">
                <span data-walkthrough="quote" className="rounded-md">
                  <Button variant="secondary" disabled={quoting} onClick={() => void handleQuote()}>
                    {quoting ? "Pricing…" : "Get a price"}
                  </Button>
                </span>
                <span data-walkthrough="pay" className="rounded-md">
                  <Button disabled={running} onClick={() => void handlePayAndSummarize()}>
                    {running ? "Paying…" : "Pay and summarize"}
                  </Button>
                </span>
                <Button
                  variant="secondary"
                  disabled={running}
                  className="gap-2"
                  onClick={() => void handleAgentAutopay()}
                >
                  <Bot className="size-4" />
                  Run as agent
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
                <div
                  className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  role="alert"
                >
                  <p>{error.message}</p>
                  {error.action === "connect" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                      onClick={() => void wallet.connect()}
                    >
                      Connect Pera Wallet
                    </Button>
                  )}
                  {error.action === "fund" && (
                    <a
                      className="mt-2 inline-block font-mono text-[11px] underline underline-offset-2"
                      href={TESTNET_DISPENSER_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      open the Algorand testnet dispenser →
                    </a>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              title={`3 · ${
                summary?.mode === "action_items"
                  ? "Action Items"
                  : summary?.mode === "key_risks"
                    ? "Key Risks"
                    : "Summary"
              }`}
              walkthrough="summary"
            >
              {summary?.summary ? (
                <>
                  <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                    <MarkdownContent>{summary.summary}</MarkdownContent>
                  </div>
                  <div className="mt-4">
                    <Row label="Mode">{summary.mode ?? "summary"}</Row>
                    <Row label="Pages paid">{summary.pages}</Row>
                    <Row label="Paid">
                      {summary.pricePaid} {summary.amountPaid ? `(${summary.amountPaid})` : ""}
                    </Row>
                    <Row label="Transaction">
                      {summary.explorer ? (
                        <Link
                          to="/receipt/$txId"
                          params={{ txId: summary.txId ?? "" }}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {summary.txId}
                        </Link>
                      ) : (
                        (summary.txId ?? "—")
                      )}
                    </Row>
                  </div>
                  {exchange?.paymentHeaders && retryBody && (
                    <div className="mt-4">
                      <CurlExportButton
                        method="POST"
                        url={`${typeof window !== "undefined" ? window.location.origin : ""}/api/summarize`}
                        body={retryBody}
                        headers={{
                          "content-type": "application/json",
                          ...exchange.paymentHeaders,
                        }}
                        label="Copy paid curl"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your summary appears here once the payment settles.
                </p>
              )}
            </Card>

            <Card title="Request status">
              <div>
                <Row label="Pages detected">{detectedPages ?? "—"}</Row>
                <Row label="Price quoted">{quotedPrice ?? "—"}</Row>
                <Row label="Payment">
                  {paymentStatus === "not_started" ? (
                    "not started"
                  ) : (
                    <span className={paymentStatus === "failed" ? "text-destructive" : ""}>
                      {PHASE_LABEL[paymentStatus]}
                    </span>
                  )}
                </Row>
                <Row label="Outcome">
                  {summary?.summary ? (
                    summary.explorer ? (
                      <a
                        className="text-primary underline-offset-2 hover:underline"
                        href={summary.explorer}
                        target="_blank"
                        rel="noreferrer"
                      >
                        settled · {summary.txId}
                      </a>
                    ) : (
                      "settled"
                    )
                  ) : exchange && !exchange.ok ? (
                    <span className="text-destructive">{exchange.failureCode ?? "failed"}</span>
                  ) : running ? (
                    "in progress…"
                  ) : (
                    "—"
                  )}
                </Row>
              </div>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                driven entirely by this request's live frontend state
              </p>
            </Card>

            {exchange && (
              <>
                <Card title="Payment header inspector">
                  <PaymentHeaderInspector
                    paymentRequired={headerPick?.paymentRequired}
                    paymentSignature={
                      headerPick?.paymentSignature ??
                      exchange.paymentHeaders?.["payment-signature"]
                    }
                    paymentResponse={headerPick?.paymentResponse}
                  />
                </Card>
                <Card title="Protocol proof · raw payloads">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px]">
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
              </>
            )}
          </div>

          {/* ── Range summarization (always visible in live demo) ── */}
          <div className="lg:col-span-2">
            <RangeDemo
              wallet={wallet}
              totalPages={quote?.pages ?? localPages ?? 0}
              file={file}
              text={text}
              mode={mode}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
