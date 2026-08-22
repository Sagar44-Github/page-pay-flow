/**
 * RangeDemo — pay-per-range summarization UI.
 *
 * Integrated range selection component with progressive disclosure & animated locked state.
 * Always present in the UI; locked when totalPages <= 1, smoothly unlocks when a multi-page document is loaded.
 */
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";
import { priceForPages } from "@/lib/pagepay/pricing";
import type { PeraWallet } from "@/lib/wallet/pera";
import {
  TESTNET_DISPENSER_URL,
  payAndFetch,
  type PaymentFailureCode,
  type PaymentPhase,
} from "@/lib/x402/client";

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

type FriendlyError = { message: string; action?: "connect" | "fund" };

const FAILURE_COPY: Record<PaymentFailureCode, FriendlyError> = {
  cancelled: { message: "Payment was cancelled in Pera Wallet. Try again when ready." },
  insufficient_funds: {
    message: "Your wallet needs testnet USDC (ASA 10458941) plus a little ALGO for fees.",
    action: "fund",
  },
  requirements_unreadable: { message: "The server's 402 payment requirements couldn't be read." },
  signing_failed: { message: "Pera Wallet couldn't sign the payment. Look for the Pera tab/QR." },
  verification_failed: { message: "Payment could not be verified — wait a moment and try again." },
  quote_mismatch: { message: "The price changed. Try again to get a fresh quote." },
  gateway_unavailable: { message: "The payment facilitator didn't respond — try again shortly." },
  network: { message: "Lost connection. Check your connection and try again." },
  bad_request: { message: "The document couldn't be read for this range." },
  server_error: { message: "Something went wrong on the server." },
};

interface RangeResult {
  label: string;
  summary: string;
  startPage: number;
  endPage: number;
  pages: number;
  pricePaid: string;
  amountPaid: string;
  txId: string;
  explorer: string;
}

interface Props {
  wallet: PeraWallet;
  totalPages: number;
  file: File | null;
  text: string;
  mode?: "summary" | "action_items" | "key_risks";
}

export function RangeDemo({ wallet, totalPages, file, text, mode = "summary" }: Props) {
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(totalPages || 1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [results, setResults] = useState<RangeResult[]>([]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<PaymentPhase | null>(null);
  const [error, setError] = useState<FriendlyError | null>(null);

  const hasDoc = Boolean(file) || text.trim().length > 0;
  const isMultiPage = totalPages > 1;
  const effectiveTotalPages = totalPages > 0 ? totalPages : 1;

  // Keep endPage in sync when totalPages changes.
  const clampedStart = Math.max(1, Math.min(startPage, effectiveTotalPages));
  const clampedEnd = Math.max(clampedStart, Math.min(endPage, effectiveTotalPages));
  const rangePages = clampedEnd - clampedStart + 1;
  const rangePrice = priceForPages(rangePages);

  const rangeValid = isMultiPage && hasDoc && clampedStart >= 1 && clampedEnd <= effectiveTotalPages && clampedStart <= clampedEnd;

  function fail(next: FriendlyError) {
    setError(next);
  }

  async function handleSummarizeRange() {
    setError(null);
    setPhase(null);

    if (!wallet.signer) {
      fail({ message: "Connect Pera Wallet in the header first.", action: "connect" });
      return;
    }
    if (!rangeValid) {
      fail({ message: "Upload a document with more than 1 page to summarize a range." });
      return;
    }

    setRunning(true);
    try {
      let init: RequestInit;
      if (sessionId) {
        init = {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId, startPage: clampedStart, endPage: clampedEnd, mode }),
        };
      } else if (file) {
        const form = new FormData();
        form.set("file", file);
        form.set("startPage", String(clampedStart));
        form.set("endPage", String(clampedEnd));
        form.set("mode", mode);
        init = { method: "POST", body: form };
      } else {
        init = {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text, startPage: clampedStart, endPage: clampedEnd, mode }),
        };
      }

      const result = await payAndFetch("/api/summarize/range", init, wallet.signer, {
        expectedPages: rangePages,
        onPhase: setPhase,
      });

      if (!result.ok) {
        console.error("[pagepay:range] payment failed", result.failureCode, result.error);
        const friendly = result.failureCode ? FAILURE_COPY[result.failureCode] : undefined;
        fail(friendly ?? { message: "The payment couldn't be completed." });
        return;
      }

      const data = result.result as Record<string, unknown>;
      const resMode = String(data["mode"] ?? mode);
      const modeLabel = resMode === "action_items" ? "Action Items" : resMode === "key_risks" ? "Key Risks" : "Summary";
      const rangeResult: RangeResult = {
        label: `Pages ${data["startPage"]}–${data["endPage"]} · ${modeLabel}`,
        summary: String(data["summary"] ?? ""),
        startPage: Number(data["startPage"]),
        endPage: Number(data["endPage"]),
        pages: Number(data["pages"]),
        pricePaid: String(data["pricePaid"] ?? ""),
        amountPaid: String(data["amountPaid"] ?? ""),
        txId: String(data["txId"] ?? ""),
        explorer: String(data["explorer"] ?? ""),
      };
      setResults((prev) => [...prev, rangeResult]);
      if (data["sessionId"]) {
        setSessionId(data["sessionId"] as string);
      }
    } catch (runError) {
      console.error("[pagepay:range] unexpected error", runError);
      setPhase("failed");
      fail({ message: "An unexpected error occurred. Check the browser console." });
    } finally {
      setRunning(false);
    }
  }

  const PHASE_LABEL: Record<PaymentPhase, string> = {
    quoting: "requesting 402 quote",
    awaiting_signature: "awaiting signature in Pera",
    submitted: "payment submitted",
    verifying: "verifying settlement",
    settled: "settled",
    failed: "failed",
  };

  return (
    <div className="space-y-4">
      {/* ── Integrated Range Selector Box ── */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {isMultiPage ? (
                <motion.span
                  key="unlocked-icon"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary font-mono"
                >
                  <Unlock className="size-4 text-primary" />
                  <span>PAGE RANGE SELECTION</span>
                </motion.span>
              ) : (
                <motion.span
                  key="locked-icon"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80 font-mono"
                >
                  <Lock className="size-4 text-muted-foreground/70" />
                  <span>PAGE RANGE SELECTION</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <span className="font-mono text-[11px] text-muted-foreground">
            {totalPages > 0 ? `${totalPages} total pages` : "Single-page mode"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!isMultiPage ? (
            <motion.div
              key="locked-state"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 flex items-center gap-2.5 rounded-lg border border-dashed border-border/70 bg-muted/20 px-3.5 py-3 text-xs text-muted-foreground font-mono"
            >
              <Lock className="size-4 shrink-0 text-muted-foreground/70" />
              <span>
                Unlocks for documents with more than 1 page.
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked-state"
              initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
              exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor="range-start" className="text-xs text-muted-foreground font-mono">
                    From page
                  </Label>
                  <Input
                    id="range-start"
                    type="number"
                    min={1}
                    max={effectiveTotalPages}
                    value={clampedStart}
                    className="mt-1 font-mono text-xs"
                    onChange={(e) => setStartPage(Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="range-end" className="text-xs text-muted-foreground font-mono">
                    To page
                  </Label>
                  <Input
                    id="range-end"
                    type="number"
                    min={1}
                    max={effectiveTotalPages}
                    value={clampedEnd}
                    className="mt-1 font-mono text-xs"
                    onChange={(e) => setEndPage(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-background/50 p-2.5">
                <Row label="Pages in range">{rangePages}</Row>
                <Row label="Range price">
                  <span className="font-semibold text-primary">{rangePrice}</span>
                </Row>
              </div>

              {phase && (
                <p className="font-mono text-[11px] text-muted-foreground">
                  Status:{" "}
                  <span className={phase === "failed" ? "text-destructive" : ""}>
                    {PHASE_LABEL[phase]}
                  </span>
                </p>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="w-full font-semibold"
                disabled={running || !rangeValid}
                onClick={() => void handleSummarizeRange()}
              >
                {running ? "Processing Range…" : `Summarize pages ${clampedStart}–${clampedEnd} (${rangePrice})`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

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
      </div>

      {/* ── Accumulated Range Summaries (if any) ── */}
      {results.map((r, i) => (
        <div key={`${r.startPage}-${r.endPage}-${i}`} className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            {r.label}
          </h4>
          <div className="mt-3 rounded-lg border border-border/60 bg-background/40 p-4">
            <MarkdownContent>{r.summary}</MarkdownContent>
          </div>
          <div className="mt-3">
            <Row label="Pages charged">{r.pages}</Row>
            <Row label="Paid">{r.pricePaid}</Row>
            <Row label="Transaction">
              {r.explorer ? (
                <Link
                  to="/receipt/$txId"
                  params={{ txId: r.txId }}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {r.txId}
                </Link>
              ) : (
                r.txId ?? "—"
              )}
            </Row>
          </div>
        </div>
      ))}
    </div>
  );
}
