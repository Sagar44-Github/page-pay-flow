/**
 * LiveDemo component — main interactive demo interface for PagePay.
 *
 * Provides single document summarization (with 5 extraction modes: Summary, Action Items,
 * Key Risks, Compliance Check, Checklist), page range selection, dual-document comparison,
 * autonomous agent policy enforcement ("Run as Agent"), and automatic post-settlement audit trail verification.
 */
import { useMemo, useState } from "react";
import {
  FileText,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Bot,
} from "lucide-react";
import { toast } from "sonner";

import type { PeraWallet } from "@/lib/wallet/pera";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RangeDemo } from "@/landing/RangeDemo";
import { CompareDemo } from "@/landing/CompareDemo";
import { AuditTrailWidget } from "@/components/audit/AuditTrailWidget";
import {
  runAgentWithPolicy,
  AgentSessionTracker,
  DEFAULT_AGENT_POLICY,
  type AgentSpendPolicy,
} from "@/lib/pagepay/agentPolicy";
import { priceForPages } from "@/lib/pagepay/pricing";
import { type PaidRequestResult, type PaymentFailureCode } from "@/lib/x402/client";
import { cn } from "@/lib/utils";

const MAX_PAGES = 10;
const SESSION_TRACKER = new AgentSessionTracker();

interface Quote {
  pages: number;
  price: string;
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

type FriendlyError = { message: string; action?: "connect" | "fund" };

const FAILURE_COPY: Record<PaymentFailureCode, FriendlyError> = {
  cancelled: {
    message: "Payment was cancelled in Pera Wallet. Tap “Pay & Summarize” again when you're ready.",
  },
  insufficient_funds: {
    message:
      "Your wallet needs testnet USDC (ASA 10458941) for the payment, plus a little testnet ALGO for fees. ALGO alone is not enough — get testnet USDC from a faucet, then retry.",
    action: "fund",
  },
  requirements_unreadable: {
    message: "The server's 402 payment requirements couldn't be read. Check the raw payload in Protocol proof below.",
  },
  signing_failed: {
    message:
      "Pera Wallet couldn't sign the payment. On desktop Chrome/Edge, look for a new tab at web.perawallet.app and approve the USDC transfer — or scan the QR with the Pera mobile app. Make sure Pera is on Testnet.",
  },
  verification_failed: {
    message: "Payment could not be verified on Algorand. This is usually temporary — wait a moment and try again.",
  },
  quote_mismatch: {
    message: "The price changed between the quote and the payment. Press “Get a price” again to refresh the quote, then pay.",
  },
  gateway_unavailable: {
    message: "The payment facilitator didn't respond in time. This is usually temporary — try again in a few seconds.",
  },
  network: {
    message: "Lost connection while processing payment. Check your connection and try again.",
  },
  bad_request: {
    message: "The document couldn't be read. Try a text-based PDF (not a scan) or paste the text.",
  },
  server_error: {
    message: "Something went wrong on the server after the request was sent. Check Protocol proof below for the raw response.",
  },
};

type PaymentPhase =
  | "estimating"
  | "requesting_quote"
  | "signing_payment"
  | "verifying_payment"
  | "generating_summary"
  | "complete";

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 transition-all shadow-sm", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function LiveDemo({ wallet }: { wallet: PeraWallet; onOpenWalkthrough?: () => void }) {
  const [activeTab, setActiveTab] = useState<"single" | "compare">("single");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"summary" | "action_items" | "key_risks" | "compliance_check" | "checklist">("summary");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<PaymentPhase | null>(null);
  const [exchange, setExchange] = useState<PaidRequestResult | null>(null);
  const [error, setError] = useState<FriendlyError | null>(null);

  // Auto-audit trail triggers
  const [settledTxId, setSettledTxId] = useState<string | null>(null);
  const [settledAddress, setSettledAddress] = useState<string | null>(null);

  const [policy, setPolicy] = useState<AgentSpendPolicy>(DEFAULT_AGENT_POLICY);
  const [showPolicyConfig, setShowPolicyConfig] = useState(false);

  const localPages = useMemo(() => {
    if (file) return null;
    const trimmed = text.trim();
    if (!trimmed) return null;
    const words = trimmed.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.min(MAX_PAGES, Math.ceil(words / 500)));
  }, [file, text]);

  const summaryResult = useMemo<SummaryResult | null>(() => {
    if (!exchange || !exchange.ok) return null;
    return (exchange.result ?? null) as SummaryResult | null;
  }, [exchange]);

  async function handleGetQuote() {
    if (!file && !text.trim()) {
      toast.error("Choose a file or paste text first.");
      return;
    }

    setQuoting(true);
    setError(null);
    try {
      let body: FormData | string;
      const headers: Record<string, string> = {};

      if (file) {
        const form = new FormData();
        form.append("file", file);
        body = form;
      } else {
        headers["content-type"] = "application/json";
        body = JSON.stringify({ text });
      }

      const response = await fetch("/api/price", { method: "POST", headers, body });
      const data = (await response.json()) as { pages?: number; price?: string; error?: string };

      if (!response.ok || !data.pages || !data.price) {
        throw new Error(data.error ?? "Failed to calculate document page count");
      }

      setQuote({ pages: data.pages, price: data.price });
      toast.success(`Quote received: ${data.pages} page(s) · ${data.price}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setQuoting(false);
    }
  }

  async function handleExecuteFlow(isAgentMode: boolean) {
    if (!wallet.signer || !wallet.address) {
      setError({
        message: "Connect your Algorand Pera Wallet first to sign the x402 USDC payment.",
        action: "connect",
      });
      return;
    }

    if (!file && !text.trim()) {
      toast.error("Choose a file or paste text first.");
      return;
    }

    setRunning(true);
    setError(null);
    setExchange(null);
    setPhase("requesting_quote");

    try {
      let body: FormData | string;
      const headers: Record<string, string> = {};

      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("mode", mode);
        body = form;
      } else {
        headers["content-type"] = "application/json";
        body = JSON.stringify({ text, mode });
      }

      setPhase("signing_payment");

      const result = await runAgentWithPolicy(
        "/api/summarize",
        { method: "POST", headers, body },
        wallet.signer,
        policy,
        SESSION_TRACKER,
        mode,
      );

      setExchange(result.paidResult ?? null);

      if (result.allowed && result.paidResult?.ok) {
        setPhase("complete");
        const resData = result.paidResult.result as SummaryResult | null;
        if (resData?.txId) {
          setSettledTxId(resData.txId);
        }
        if (resData?.payer || wallet.address) {
          setSettledAddress(resData?.payer ?? wallet.address);
        }

        toast.success(
          isAgentMode
            ? "🤖 Agent Policy Guard approved & executed! Summary generated + auto audit trail verified."
            : "Document summarized! USDC payment settled on Algorand testnet."
        );
      } else {
        setPhase(null);
        if (!result.allowed) {
          setError({
            message: `Agent Spend Policy Refusal: ${result.refusalReason}`,
          });
        } else if (result.paidResult?.failureCode) {
          setError(FAILURE_COPY[result.paidResult.failureCode] ?? { message: result.paidResult?.error ?? "Payment failed" });
        } else {
          setError({ message: result.paidResult?.error ?? "Request failed" });
        }
      }
    } catch (err) {
      setPhase(null);
      setError({ message: err instanceof Error ? err.message : String(err) });
    } finally {
      setRunning(false);
    }
  }

  return (
    <section id="demo" className="relative border-t border-border/40 py-16 md:py-20 bg-background/50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-mono tracking-tight sm:text-3xl text-foreground">
            LIVE DEMO &amp; INTERACTIVE FLOW
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            Select an extraction mode, inspect page-based quotes, execute pay-per-page AI processing, or run autonomously as an Agent.
          </p>
        </div>

        {/* Top Tab Bar: Single Document vs Compare Two Documents */}
        <div className="flex border-b border-border/60 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={cn(
              "px-4 py-2 text-xs font-mono font-semibold transition-all border-b-2 -mb-px",
              activeTab === "single"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            📄 Single Document Summarization
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("compare")}
            className={cn(
              "px-4 py-2 text-xs font-mono font-semibold transition-all border-b-2 -mb-px flex items-center gap-1.5",
              activeTab === "compare"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            ⚖️ Compare Two Documents (Multi-Doc)
          </button>
        </div>

        {activeTab === "compare" ? (
          <div className="mt-8">
            <CompareDemo wallet={wallet} />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* ── LEFT COLUMN: Document Input, Mode & Primary Action ── */}
            <div className="space-y-6 lg:col-span-6">
              {/* 1. DOCUMENT CARD */}
              <Card title="1 · Document" className="border-primary/20 shadow-sm">
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

              {/* 2. EXTRACTION MODE & PAYMENT ACTION CARD */}
              <Card title="2 · Extraction Mode &amp; Payment">
                <div className="mb-5">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                    Extraction Mode
                  </Label>
                  <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/30 p-1 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setMode("summary")}
                      className={cn(
                        "py-1.5 px-2 text-center rounded transition-all",
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
                        "py-1.5 px-2 text-center rounded transition-all",
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
                        "py-1.5 px-2 text-center rounded transition-all",
                        mode === "key_risks"
                          ? "bg-background text-foreground shadow-sm font-semibold border border-border/50"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Key Risks
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("compliance_check")}
                      className={cn(
                        "py-1.5 px-2 text-center rounded transition-all col-span-2 sm:col-span-1",
                        mode === "compliance_check"
                          ? "bg-background text-foreground shadow-sm font-semibold border border-border/50 text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Compliance Check
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("checklist")}
                      className={cn(
                        "py-1.5 px-2 text-center rounded transition-all col-span-1",
                        mode === "checklist"
                          ? "bg-background text-foreground shadow-sm font-semibold border border-border/50 text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Checklist
                    </button>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {mode === "summary" && "Standard document overview & key points."}
                    {mode === "action_items" && "Extract concrete tasks, assignees, and deadlines."}
                    {mode === "key_risks" && "Identify risky, concerning clauses and severities."}
                    {mode === "compliance_check" && "Contract compliance checklist against parties, dates, breach, exit & governing law."}
                    {mode === "checklist" && "Flat, step-by-step implementation checklist (- [ ]) for operationalizing the document."}
                  </p>
                </div>

                <div className="mb-5">
                  <RangeDemo wallet={wallet} defaultMode={mode} />
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={quoting || running || (!file && !text.trim())}
                      onClick={() => void handleGetQuote()}
                      className="text-xs font-mono"
                    >
                      {quoting ? "Quoting…" : "Get Price Quote"}
                    </Button>
                    <Button
                      size="sm"
                      disabled={running || (!file && !text.trim())}
                      onClick={() => void handleExecuteFlow(false)}
                      className="text-xs font-mono font-semibold"
                    >
                      {running ? "Processing…" : "Pay & Execute"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={running || (!file && !text.trim())}
                      onClick={() => void handleExecuteFlow(true)}
                      className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 gap-1.5"
                    >
                      <Bot className="size-3.5" />
                      <span>{running ? "Agent Running…" : "🤖 Run as Agent"}</span>
                    </Button>
                  </div>

                  {quote && (
                    <div className="rounded border border-primary/30 bg-primary/10 p-2 text-center font-mono text-xs">
                      Quoted: <strong>{quote.pages} page(s)</strong> · <span className="text-primary font-bold">{quote.price}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* 3. AGENT SPEND POLICY GUARD CARD */}
              <Card title="3 · Agent Spend Policy Guard">
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Per Request:</span>
                    <span className="font-semibold text-foreground">${policy.maxPricePerRequestUsd.toFixed(2)} USD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Session Budget:</span>
                    <span className="font-semibold text-foreground">${policy.sessionBudgetUsd.toFixed(2)} USD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Spent / Remaining:</span>
                    <span className="font-semibold text-primary">
                      ${SESSION_TRACKER.getSpentUsd().toFixed(2)} / ${SESSION_TRACKER.getRemainingBudgetUsd(policy).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs font-mono h-7 text-muted-foreground"
                    onClick={() => setShowPolicyConfig(!showPolicyConfig)}
                  >
                    {showPolicyConfig ? "Hide Policy Config" : "Configure Policy Rules"}
                  </Button>

                  {showPolicyConfig && (
                    <div className="rounded border border-border/80 bg-background/50 p-3 space-y-3 pt-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Max Price per Request ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={policy.maxPricePerRequestUsd}
                          className="h-7 text-xs font-mono mt-1"
                          onChange={(e) => setPolicy({ ...policy, maxPricePerRequestUsd: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Session Budget ($)</Label>
                        <Input
                          type="number"
                          step="0.05"
                          value={policy.sessionBudgetUsd}
                          className="h-7 text-xs font-mono mt-1"
                          onChange={(e) => setPolicy({ ...policy, sessionBudgetUsd: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* ── RIGHT COLUMN: Summary Output & Audit Trail ── */}
            <div className="space-y-6 lg:col-span-6">
              {/* SUMMARY OUTPUT CARD */}
              <Card title="Summary & Output">
                {summaryResult ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border/80 bg-background/80 p-4 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-bold text-foreground uppercase tracking-wider">
                          Mode: {summaryResult.mode ?? mode}
                        </span>
                        <span className="text-primary font-bold">
                          {summaryResult.pricePaid ?? "$0.01"} Settled
                        </span>
                      </div>
                      <div className="prose prose-invert prose-xs max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {summaryResult.summary}
                      </div>
                    </div>

                    {summaryResult.txId && (
                      <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs flex items-center justify-between">
                        <span className="truncate max-w-[240px]">TxID: {summaryResult.txId}</span>
                        <a
                          href={summaryResult.explorer}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Explorer</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ) : error ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 font-mono text-xs text-destructive space-y-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/10 p-8 text-center font-mono text-xs text-muted-foreground">
                    Select an extraction mode and click “Pay &amp; Execute” or “🤖 Run as Agent” to trigger x402 payment settlement and output.
                  </div>
                )}
              </Card>

              {/* AUDIT TRAIL & RECEIPT VERIFICATION WIDGET */}
              <AuditTrailWidget autoTxId={settledTxId} autoAddress={settledAddress} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
