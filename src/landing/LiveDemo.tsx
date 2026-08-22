import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, FileText, Check, Sparkles } from "lucide-react";

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
import { cn } from "@/lib/utils";

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
      "Payment was cancelled in Pera Wallet. Tap “Pay & Summarize” again when you're ready.",
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
  className,
}: {
  title: string;
  children: React.ReactNode;
  walkthrough?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-card p-5 transition-shadow", className)}
      {...(walkthrough ? { "data-walkthrough": walkthrough } : {})}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
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
  const quotedPrice = exchange?.quotedPrice ?? quote?.price ?? (detectedPages ? priceForPages(detectedPages) : null);
  const paymentStatus: PaymentPhase | "not_started" = phase ?? "not_started";

  const headerPick = exchange
    ? {
        ...pickPaymentHeaders(exchange.unpaid.headers),
        ...(exchange.paid ? pickPaymentHeaders(exchange.paid.headers) : {}),
      }
    : null;

  const retryBody = file ? undefined : JSON.stringify({ text });

  return (
    <section id="live-demo" className="border-b border-border py-16 md:py-24">
      <Container>
        {/* ── Section Header ── */}
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

        {/* ── Main Layout: 2 Columns on Desktop, Stacked on Mobile ── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          
          {/* ── LEFT COLUMN: Document Input, Mode & Primary Action (6 Cols) ── */}
          <div className="space-y-6 lg:col-span-6">
            
            {/* 1. DOCUMENT CARD (Primary Anchor) */}
            <Card title="1 · Document" walkthrough="document" className="border-primary/20 shadow-sm">
              <label className="flex cursor-pointer flex-col gap-1.5 rounded-xl border border-dashed border-border bg-muted/20 px-5 py-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/40">
                <FileText className="mx-auto size-6 text-muted-foreground/70" />
                <span className="text-sm font-semibold text-card-foreground">
                  {file ? file.name : "Choose a PDF or .txt document"}
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
                <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setFile(null)}>
                  Remove file
                </Button>
              )}

              <div className="mt-4">
                <Label htmlFor="pp-text" className="text-xs font-mono text-muted-foreground">
                  Or paste text
                </Label>
                <Textarea
                  id="pp-text"
                  value={text}
                  disabled={Boolean(file)}
                  placeholder="Paste document text here. 500 words counts as one page."
                  className="mt-1.5 min-h-28 font-mono text-xs"
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

            {/* 2. MODE, RANGE & PAYMENT ACTION CARD */}
            <Card title="2 · Extraction Mode &amp; Payment">
              
              {/* Compact Inline Segmented Mode Selector */}
              <div className="mb-5">
                <Label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                  Extraction Mode
                </Label>
                <div className="inline-flex w-full rounded-lg border border-border bg-muted/30 p-1">
                  <button
                    type="button"
                    onClick={() => setMode("summary")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded-md transition-all font-mono",
                      mode === "summary"
                        ? "bg-background text-foreground shadow-sm font-semibold border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Summary
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("action_items")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded-md transition-all font-mono",
                      mode === "action_items"
                        ? "bg-background text-foreground shadow-sm font-semibold border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Action Items
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("key_risks")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded-md transition-all font-mono",
                      mode === "key_risks"
                        ? "bg-background text-foreground shadow-sm font-semibold border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Key Risks
                  </button>
                </div>
                <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                  {mode === "summary" && "Standard document overview & key points."}
                  {mode === "action_items" && "Extract concrete tasks, assignees, and deadlines."}
                  {mode === "key_risks" && "Identify risky, concerning clauses and severities."}
                </p>
              </div>

              {/* Integrated Range Controls (Always present with Locked/Unlocked State) */}
              <div className="mb-5">
                <RangeDemo
                  wallet={wallet}
                  totalPages={quote?.pages ?? localPages ?? 0}
                  file={file}
                  text={text}
                  mode={mode}
                />
              </div>

              {/* Primary vs Secondary Action Buttons */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <span data-walkthrough="pay" className="block">
                  <Button
                    size="lg"
                    disabled={running}
                    onClick={() => void handlePayAndSummarize()}
                    className="w-full font-semibold shadow-md text-sm gap-2 h-11"
                  >
                    {running ? "Paying…" : `Pay & Summarize (${quotedPrice ?? "$0.01/page"})`}
                  </Button>
                </span>

                <div className="flex items-center justify-between pt-1">
                  <span data-walkthrough="quote">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={quoting}
                      onClick={() => void handleQuote()}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground"
                    >
                      {quoting ? "Pricing…" : "Get a price"}
                    </Button>
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={running}
                    className="text-xs font-mono text-muted-foreground hover:text-foreground gap-1.5"
                    onClick={() => void handleAgentAutopay()}
                  >
                    <Bot className="size-3.5" />
                    Run as agent
                  </Button>
                </div>
              </div>

              {!wallet.address && (
                <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                  Connect Pera Wallet in header to sign x402 payment
                </p>
              )}

              {error && (
                <div
                  className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive font-mono"
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

          {/* ── RIGHT COLUMN: Combined Result & Status Area (6 Cols) ── */}
          <div className="space-y-6 lg:col-span-6">
            
            {/* COMBINED RESULT & STATUS CARD */}
            <Card
              title={`3 · ${
                summary?.mode === "action_items"
                  ? "Action Items Result"
                  : summary?.mode === "key_risks"
                    ? "Key Risks Result"
                    : "Summary Result"
              }`}
              walkthrough="summary"
              className="min-h-[380px] flex flex-col justify-between"
            >
              <div>
                {/* Slim Horizontal Status Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-border/80 pb-3 font-mono text-[11px]">
                  <div>
                    <span className="text-muted-foreground uppercase block text-[10px]">Pages</span>
                    <span className="text-foreground font-semibold">{detectedPages ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground uppercase block text-[10px]">Price</span>
                    <span className="text-foreground font-semibold">{quotedPrice ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground uppercase block text-[10px]">Payment</span>
                    <span className={paymentStatus === "failed" ? "text-destructive font-semibold" : "text-foreground font-semibold"}>
                      {paymentStatus === "not_started" ? "idle" : PHASE_LABEL[paymentStatus]}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground uppercase block text-[10px]">Outcome</span>
                    <span className="text-foreground font-semibold">
                      {summary?.summary ? "settled" : running ? "paying…" : "—"}
                    </span>
                  </div>
                </div>

                {/* Dominant Generated Content */}
                <div className="mt-4">
                  {summary?.summary ? (
                    <>
                      <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                        <MarkdownContent>{summary.summary}</MarkdownContent>
                      </div>
                      <div className="mt-4">
                        <Row label="Mode">{summary.mode ?? mode}</Row>
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
                    <div className="py-16 text-center text-sm text-muted-foreground font-mono">
                      <Sparkles className="mx-auto size-8 opacity-40 mb-2" />
                      Your generated summary will appear here after payment.
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Protocol Proof Inspector Cards (rendered quietly below if available) */}
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
        </div>
      </Container>
    </section>
  );
}
