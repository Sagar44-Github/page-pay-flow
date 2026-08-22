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
  totalPages?: number;
  file?: File | null;
  text?: string;
  defaultMode?: "summary" | "action_items" | "key_risks" | "compliance_check" | "checklist";
  mode?: "summary" | "action_items" | "key_risks" | "compliance_check" | "checklist";
}

export function RangeDemo({
  wallet,
  totalPages = 0,
  file = null,
  text = "",
  defaultMode = "summary",
  mode,
}: Props) {
  const effectiveMode = mode ?? defaultMode;
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(totalPages || 1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [results, setResults] = useState<RangeResult[]>([]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<PaymentPhase | null>(null);
  const [error, setError] = useState<FriendlyError | null>(null);

  const hasDoc = Boolean(file) || (text ?? "").trim().length > 0;
  const isMultiPage = totalPages > 1;
  const effectiveTotalPages = totalPages > 0 ? totalPages : 1;

  // Keep endPage in sync when totalPages changes.
  const clampedStart = Math.max(1, Math.min(startPage, effectiveTotalPages));
  const clampedEnd = Math.max(clampedStart, Math.min(endPage, effectiveTotalPages));
  const rangePages = clampedEnd - clampedStart + 1;
  const rangePrice = priceForPages(rangePages);

  const rangeValid = isMultiPage && hasDoc && clampedStart >= 1 && clampedEnd <= effectiveTotalPages && clampedStart <= clampedEnd;

  async function handleSummarizeRange() {
    if (!rangeValid) return;
    if (!wallet.isConnected) {
      setError({ message: "Connect Pera Wallet to pay for this range.", action: "connect" });
      return;
    }

    setRunning(true);
    setError(null);
    setPhase("requesting_quote");

    try {
      let body: FormData | string;
      const headers: Record<string, string> = {};

      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("startPage", String(clampedStart));
        form.append("endPage", String(clampedEnd));
        form.append("mode", effectiveMode);
        if (sessionId) form.append("sessionId", sessionId);
        body = form;
      } else {
        headers["content-type"] = "application/json";
        body = JSON.stringify({
          text,
          startPage: clampedStart,
          endPage: clampedEnd,
          mode: effectiveMode,
          ...(sessionId ? { sessionId } : {}),
        });
      }

      setPhase("signing_payment");
      const result = await payAndFetch(
        "/api/summarize/range",
        { method: "POST", headers, body },
        wallet.getSigner(),
        (p) => setPhase(p)
      );

      if (!result.ok || !result.result) {
        setPhase(null);
        if (result.failureCode) {
          setError(FAILURE_COPY[result.failureCode] ?? { message: result.error ?? "Range failed." });
        } else {
          setError({ message: result.error ?? "Range request failed." });
        }
        return;
      }

      setPhase("complete");
      const res = result.result as Partial<RangeResult> & { sessionId?: string };
      if (res.sessionId) setSessionId(res.sessionId);

      const entry: RangeResult = {
        label: `Pages ${clampedStart}–${clampedEnd} of ${effectiveTotalPages}`,
        summary: res.summary ?? "",
        startPage: clampedStart,
        endPage: clampedEnd,
        pages: res.pages ?? rangePages,
        pricePaid: res.pricePaid ?? rangePrice,
        amountPaid: res.amountPaid ?? "",
        txId: res.txId ?? "",
        explorer: res.explorer ?? "",
      };

      setResults((prev) => [entry, ...prev]);
    } catch (err) {
      setPhase(null);
      setError({ message: err instanceof Error ? err.message : String(err) });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMultiPage ? (
            <Unlock className="size-4 text-emerald-400" />
          ) : (
            <Lock className="size-4 text-muted-foreground/60" />
          )}
          <span className="font-mono text-xs font-semibold text-card-foreground">
            Optional Page Range Selection
          </span>
        </div>
        <span
          className={`font-mono text-[10px] uppercase tracking-wider rounded px-2 py-0.5 ${
            isMultiPage
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isMultiPage ? "Unlocked" : "Locked (1 Page Doc)"}
        </span>
      </div>

      {!isMultiPage && (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          Single page documents cover the full text automatically. Upload a multi-page PDF to select custom ranges.
        </p>
      )}

      {isMultiPage && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-mono text-muted-foreground">Start Page</Label>
              <Input
                type="number"
                min={1}
                max={effectiveTotalPages}
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value))}
                className="mt-1 h-8 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] font-mono text-muted-foreground">End Page</Label>
              <Input
                type="number"
                min={1}
                max={effectiveTotalPages}
                value={endPage}
                onChange={(e) => setEndPage(Number(e.target.value))}
                className="mt-1 h-8 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">Range Price:</span>
            <span className="font-bold text-primary">{rangePrice}</span>
          </div>

          <Button
            size="sm"
            disabled={!rangeValid || running}
            onClick={() => void handleSummarizeRange()}
            className="w-full text-xs font-mono"
          >
            {running ? "Processing Range..." : `Summarize Pages ${clampedStart}–${clampedEnd} (${rangePrice})`}
          </Button>

          {error && (
            <div className="rounded border border-destructive/30 bg-destructive/10 p-2 font-mono text-[11px] text-destructive">
              {error.message}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-3 space-y-2 pt-2 border-t border-border/40">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Range Results ({results.length})
              </span>
              {results.map((r, idx) => (
                <div key={idx} className="rounded border border-border/60 bg-muted/20 p-2 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                    <span>{r.label}</span>
                    <span className="text-primary">{r.pricePaid}</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] line-clamp-3">{r.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
