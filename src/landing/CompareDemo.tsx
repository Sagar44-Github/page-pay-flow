/**
 * CompareDemo — Pay-per-page AI Multi-Document Comparison UI.
 *
 * Dedicated side-by-side comparison interface for Document A vs Document B.
 * Calculates combined pages & price, executes payAndFetch over x402, and renders
 * structured comparison output with clear "A vs B" framing.
 */
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FileText, ArrowRightLeft, Sparkles, Scale } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";
import { pagesForText, priceForPages, MAX_PAGES } from "@/lib/pagepay/pricing";
import type { PeraWallet } from "@/lib/wallet/pera";
import {
  TESTNET_DISPENSER_URL,
  payAndFetch,
  type PaidRequestResult,
  type PaymentFailureCode,
  type PaymentPhase,
} from "@/lib/x402/client";

interface CompareResult {
  comparison?: string;
  pagesA?: number;
  pagesB?: number;
  combinedPages?: number;
  pricePaid?: string;
  amountPaid?: string;
  txId?: string;
  explorer?: string;
  payer?: string;
}

type FriendlyError = { message: string; action?: "connect" | "fund" };

const FAILURE_COPY: Record<PaymentFailureCode, FriendlyError> = {
  cancelled: { message: "Payment was cancelled in Pera Wallet." },
  insufficient_funds: {
    message: "Your wallet needs testnet USDC (ASA 10458941) plus testnet ALGO for fees.",
    action: "fund",
  },
  requirements_unreadable: { message: "The server's 402 payment requirements couldn't be read." },
  signing_failed: { message: "Pera Wallet couldn't sign the payment. Check Pera tab/QR." },
  verification_failed: { message: "Payment verification failed on Algorand — try again." },
  quote_mismatch: { message: "The quote changed. Try again to get a fresh quote." },
  gateway_unavailable: { message: "Payment facilitator didn't respond — try again shortly." },
  network: { message: "Lost connection. Check network and try again." },
  bad_request: { message: "One of the documents couldn't be read." },
  server_error: { message: "Something went wrong on the server." },
};

const PHASE_LABEL: Record<PaymentPhase, string> = {
  quoting: "requesting 402 quote",
  awaiting_signature: "awaiting signature in Pera",
  submitted: "payment submitted",
  verifying: "verifying settlement",
  settled: "settled",
  failed: "failed",
};

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

export function CompareDemo({ wallet }: { wallet: PeraWallet }) {
  const [fileA, setFileA] = useState<File | null>(null);
  const [textA, setTextA] = useState("");
  const [fileB, setFileB] = useState<File | null>(null);
  const [textB, setTextB] = useState("");

  const [pdfPagesA, setPdfPagesA] = useState<number | null>(null);
  const [pdfPagesB, setPdfPagesB] = useState<number | null>(null);

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<PaymentPhase | null>(null);
  const [exchange, setExchange] = useState<PaidRequestResult | null>(null);
  const [error, setError] = useState<FriendlyError | null>(null);

  // Client-side PDF page counting via /api/price intake
  useEffect(() => {
    if (!fileA) {
      setPdfPagesA(null);
      return;
    }
    const isPdf = fileA.type === "application/pdf" || fileA.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      const form = new FormData();
      form.append("file", fileA);
      fetch("/api/price", { method: "POST", body: form })
        .then((res) => res.json())
        .then((data: { pages?: number }) => {
          if (data.pages) setPdfPagesA(data.pages);
        })
        .catch(() => setPdfPagesA(1));
    } else {
      setPdfPagesA(1);
    }
  }, [fileA]);

  useEffect(() => {
    if (!fileB) {
      setPdfPagesB(null);
      return;
    }
    const isPdf = fileB.type === "application/pdf" || fileB.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      const form = new FormData();
      form.append("file", fileB);
      fetch("/api/price", { method: "POST", body: form })
        .then((res) => res.json())
        .then((data: { pages?: number }) => {
          if (data.pages) setPdfPagesB(data.pages);
        })
        .catch(() => setPdfPagesB(1));
    } else {
      setPdfPagesB(1);
    }
  }, [fileB]);

  const pagesA = pdfPagesA ?? (fileA ? 1 : textA.trim() ? pagesForText(textA) : 0);
  const pagesB = pdfPagesB ?? (fileB ? 1 : textB.trim() ? pagesForText(textB) : 0);
  const combinedPages = (pagesA > 0 ? pagesA : 1) + (pagesB > 0 ? pagesB : 1);
  const combinedPrice = priceForPages(combinedPages);
  const hasBothDocs = (Boolean(fileA) || textA.trim().length > 0) && (Boolean(fileB) || textB.trim().length > 0);

  const result = exchange?.ok ? (exchange.result as CompareResult) : null;
  const paymentStatus: PaymentPhase | "not_started" = phase ?? "not_started";

  function fail(next: FriendlyError) {
    setError(next);
  }

  async function handlePayAndCompare() {
    setError(null);
    setExchange(null);
    setPhase(null);

    if (!wallet.signer) {
      fail({ message: "Connect Pera Wallet in the header first.", action: "connect" });
      return;
    }
    if (!hasBothDocs) {
      fail({ message: "Provide both Document A and Document B to run comparison." });
      return;
    }

    setRunning(true);
    try {
      const form = new FormData();
      if (fileA) form.set("fileA", fileA);
      else form.set("textA", textA);

      if (fileB) form.set("fileB", fileB);
      else form.set("textB", textB);

      const init: RequestInit = { method: "POST", body: form };

      const res = await payAndFetch("/api/compare", init, wallet.signer, {
        expectedPages: combinedPages,
        onPhase: setPhase,
      });

      setExchange(res);
      if (!res.ok) {
        const friendly = res.failureCode ? FAILURE_COPY[res.failureCode] : undefined;
        fail(friendly ?? { message: "The comparison payment couldn't be completed." });
      }
    } catch (runErr) {
      console.error("[pagepay:compare] execution error", runErr);
      fail({ message: "Comparison failed due to an unexpected error." });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* ── LEFT COLUMN: Dual Document Inputs & Action (6 Cols) ── */}
      <div className="space-y-6 lg:col-span-6">
        
        {/* DOCUMENT A CARD */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono flex items-center gap-1.5">
              <Scale className="size-3.5" /> DOCUMENT A
            </h3>
            <span className="font-mono text-[11px] text-muted-foreground">
              {pagesA > 0 ? `≈ ${pagesA} page${pagesA === 1 ? "" : "s"}` : "Pending input"}
            </span>
          </div>

          <label className="flex cursor-pointer flex-col gap-1 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4 text-center hover:border-primary/50 transition-colors">
            <FileText className="mx-auto size-5 text-muted-foreground/60" />
            <span className="text-xs font-semibold text-card-foreground">
              {fileA ? fileA.name : "Upload Document A (PDF / .txt)"}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              onChange={(e) => setFileA(e.target.files?.[0] ?? null)}
            />
          </label>
          {fileA && (
            <Button variant="ghost" size="sm" className="mt-1 text-[11px] h-7" onClick={() => setFileA(null)}>
              Remove file A
            </Button>
          )}

          <div className="mt-3">
            <Label htmlFor="text-a" className="text-[11px] font-mono text-muted-foreground">
              Or paste text for Document A
            </Label>
            <Textarea
              id="text-a"
              value={textA}
              disabled={Boolean(fileA)}
              placeholder="Paste text for Document A here..."
              className="mt-1 min-h-20 font-mono text-xs"
              onChange={(e) => setTextA(e.target.value)}
            />
          </div>
        </div>

        {/* DOCUMENT B CARD */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono flex items-center gap-1.5">
              <Scale className="size-3.5" /> DOCUMENT B
            </h3>
            <span className="font-mono text-[11px] text-muted-foreground">
              {pagesB > 0 ? `≈ ${pagesB} page${pagesB === 1 ? "" : "s"}` : "Pending input"}
            </span>
          </div>

          <label className="flex cursor-pointer flex-col gap-1 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4 text-center hover:border-primary/50 transition-colors">
            <FileText className="mx-auto size-5 text-muted-foreground/60" />
            <span className="text-xs font-semibold text-card-foreground">
              {fileB ? fileB.name : "Upload Document B (PDF / .txt)"}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              onChange={(e) => setFileB(e.target.files?.[0] ?? null)}
            />
          </label>
          {fileB && (
            <Button variant="ghost" size="sm" className="mt-1 text-[11px] h-7" onClick={() => setFileB(null)}>
              Remove file B
            </Button>
          )}

          <div className="mt-3">
            <Label htmlFor="text-b" className="text-[11px] font-mono text-muted-foreground">
              Or paste text for Document B
            </Label>
            <Textarea
              id="text-b"
              value={textB}
              disabled={Boolean(fileB)}
              placeholder="Paste text for Document B here..."
              className="mt-1 min-h-20 font-mono text-xs"
              onChange={(e) => setTextB(e.target.value)}
            />
          </div>
        </div>

        {/* COMBINED PRICING & PAYMENT ACTION CARD */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Combined Pricing &amp; Comparison Payment
          </h3>

          <div className="rounded-lg bg-background/50 p-3 space-y-1">
            <Row label="Pages Doc A">{pagesA > 0 ? pagesA : 1}</Row>
            <Row label="Pages Doc B">{pagesB > 0 ? pagesB : 1}</Row>
            <Row label="Total Combined Pages">{combinedPages}</Row>
            <Row label="Combined Price">
              <span className="font-semibold text-primary">{combinedPrice}</span>
            </Row>
          </div>

          <Button
            size="lg"
            className="w-full font-semibold shadow-md text-sm gap-2 h-11"
            disabled={running || !hasBothDocs}
            onClick={() => void handlePayAndCompare()}
          >
            {running ? "Comparing…" : `Pay & Compare Both Documents (${combinedPrice})`}
          </Button>

          {!hasBothDocs && (
            <p className="font-mono text-[11px] text-muted-foreground text-center">
              ↑ Provide both Document A and Document B above to enable comparison.
            </p>
          )}

          {!wallet.address && (
            <p className="font-mono text-[11px] text-muted-foreground text-center">
              Connect Pera Wallet in header to sign x402 payment
            </p>
          )}

          {error && (
            <div
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive font-mono"
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
        </div>
      </div>

      {/* ── RIGHT COLUMN: Comparison Result & Status (6 Cols) ── */}
      <div className="space-y-6 lg:col-span-6">
        <div className="rounded-xl border border-border bg-card p-5 min-h-[480px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2">
                <ArrowRightLeft className="size-4 text-primary" />
                <span>Side-by-Side Comparison Output</span>
              </h3>
              {result?.comparison && (
                <span className="font-mono text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                  Doc A vs Doc B
                </span>
              )}
            </div>

            {/* Status Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-border/60 py-2.5 font-mono text-[11px]">
              <div>
                <span className="text-muted-foreground uppercase block text-[10px]">Pages</span>
                <span className="text-foreground font-semibold">{combinedPages}</span>
              </div>
              <div>
                <span className="text-muted-foreground uppercase block text-[10px]">Price</span>
                <span className="text-foreground font-semibold">{combinedPrice}</span>
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
                  {result?.comparison ? "settled" : running ? "paying…" : "—"}
                </span>
              </div>
            </div>

            {/* Comparison Content */}
            <div className="mt-4">
              {result?.comparison ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                    <MarkdownContent>{result.comparison}</MarkdownContent>
                  </div>
                  <div className="mt-3 font-mono text-xs space-y-1">
                    <Row label="Combined pages paid">{result.combinedPages}</Row>
                    <Row label="Price paid">{result.pricePaid} ({result.amountPaid})</Row>
                    <Row label="Transaction">
                      {result.explorer ? (
                        <Link
                          to="/receipt/$txId"
                          params={{ txId: result.txId ?? "" }}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {result.txId}
                        </Link>
                      ) : (
                        result.txId ?? "—"
                      )}
                    </Row>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-sm text-muted-foreground font-mono">
                  <Sparkles className="mx-auto size-8 opacity-40 mb-2" />
                  Structured comparison of Document A vs Document B will appear here after payment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
