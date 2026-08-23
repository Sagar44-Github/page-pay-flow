/**
 * AuditTrailWidget — Cryptographic Log Verification, Independent Receipt Verification,
 * and Dynamic Agent Trust Score Calculation Engine.
 */
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  ExternalLink,
  Calculator,
  TrendingUp,
  Activity,
  Zap,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AuditResult {
  valid: boolean;
  totalEntries: number;
  brokenAt: number | null;
  verifiedAt: string;
  details?: string;
}

interface ReceiptVerification {
  verified: boolean;
  txId: string;
  timestamp: string;
  route: string;
  pages: number;
  pricePaid: string;
  payer: string;
  auditChain?: {
    entryHash: string;
    previousEntryHash: string;
  };
  onChainVerified: boolean;
  onChainDetails?: {
    matchStatus: string;
    confirmedRound?: number;
    receiver?: string;
    assetId?: number;
    reason?: string;
  };
  explorer: string;
  error?: string;
  reason?: string;
}

interface ScoreBreakdown {
  txCountPoints: number;
  successRatePoints: number;
  volumeBonusPoints: number;
  formula: string;
  basis: string[];
}

interface TrustScoreResult {
  address: string;
  trustScore: number;
  totalTransactions: number;
  totalVolumeUsd: string;
  successRate: number | null;
  firstSeen: string | null;
  lastSeen: string | null;
  scoreBreakdown?: ScoreBreakdown;
  error?: string;
  reason?: string;
}

export interface AuditTrailWidgetProps {
  autoTxId?: string | null;
  autoAddress?: string | null;
}

export function AuditTrailWidget({ autoTxId, autoAddress }: AuditTrailWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<AuditResult | null>(null);

  // Receipt verification state
  const [searchTxId, setSearchTxId] = useState("");
  const [verifyingReceipt, setVerifyingReceipt] = useState(false);
  const [receiptResult, setReceiptResult] = useState<ReceiptVerification | null>(null);

  // Trust Score state
  const [searchAddress, setSearchAddress] = useState("");
  const [checkingScore, setCheckingScore] = useState(false);
  const [trustScoreResult, setTrustScoreResult] = useState<TrustScoreResult | null>(null);

  async function handleVerify() {
    setLoading(true);
    try {
      const res = await fetch("/api/audit/verify");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AuditResult;
      setAudit(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function verifyReceiptForTx(txIdToVerify: string) {
    if (!txIdToVerify.trim()) return;
    setVerifyingReceipt(true);
    setReceiptResult(null);
    try {
      const res = await fetch(`/api/receipt?txId=${encodeURIComponent(txIdToVerify.trim())}`);
      const data = (await res.json()) as ReceiptVerification;
      setReceiptResult(data);
    } catch (err) {
      setReceiptResult({
        verified: false,
        txId: txIdToVerify.trim(),
        timestamp: "",
        route: "",
        pages: 0,
        pricePaid: "",
        payer: "",
        onChainVerified: false,
        explorer: "",
        error: "Lookup failed",
        reason: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setVerifyingReceipt(false);
    }
  }

  async function checkTrustScoreForAddress(addressToCheck: string) {
    if (!addressToCheck.trim()) return;
    setCheckingScore(true);
    setTrustScoreResult(null);
    try {
      const res = await fetch(`/api/trust-score?address=${encodeURIComponent(addressToCheck.trim())}`);
      const data = (await res.json()) as TrustScoreResult;
      setTrustScoreResult(data);
    } catch (err) {
      setTrustScoreResult({
        address: addressToCheck.trim(),
        trustScore: 0,
        totalTransactions: 0,
        totalVolumeUsd: "$0.00",
        successRate: null,
        firstSeen: null,
        lastSeen: null,
        error: "Lookup failed",
        reason: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setCheckingScore(false);
    }
  }

  // Auto-trigger when new settled txId or address is passed
  useEffect(() => {
    if (autoTxId) {
      setSearchTxId(autoTxId);
      void verifyReceiptForTx(autoTxId);
      void handleVerify();
    }
  }, [autoTxId]);

  useEffect(() => {
    if (autoAddress) {
      setSearchAddress(autoAddress);
      void checkTrustScoreForAddress(autoAddress);
    }
  }, [autoAddress]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-6 font-mono text-xs shadow-md">
      {/* ── 1. TAMPER-EVIDENT AUDIT TRAIL ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-foreground tracking-wide">
            <ShieldCheck className="size-4 text-accent-green" />
            <span>TAMPER-EVIDENT AUDIT TRAIL</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => void handleVerify()}
            className="text-xs h-7 gap-1.5 font-mono hover:bg-accent transition-all duration-200"
          >
            <RefreshCw className={`size-3 text-accent-green ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Verifying…" : "Re-verify chain"}</span>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Every request and payment log entry is cryptographically SHA-256 hashed and linked to the previous entry’s hash.
        </p>

        {audit && (
          <div className="rounded-lg border border-border/70 bg-background/60 p-3.5 space-y-2.5 transition-all duration-300 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Chain Status:</span>
              {audit.valid ? (
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>VERIFIED INTEGRITY</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-bold text-destructive">
                  <ShieldAlert className="size-3.5" />
                  <span>CHAIN BROKEN at entry #{audit.brokenAt}</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Verified Entries:</span>
              <span className="font-semibold text-foreground">{audit.totalEntries}</span>
            </div>

            {audit.brokenAt !== null && (
              <div className="rounded bg-destructive/10 border border-destructive/30 p-2 text-[11px] text-destructive">
                <strong>Tampering Detected:</strong> {audit.details}
              </div>
            )}

            <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/40 flex justify-between">
              <span>Genesis: 0000000000000000...</span>
              <span>Last checked: {new Date(audit.verifiedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. INDEPENDENT RECEIPT VERIFICATION SERVICE ── */}
      <div className="pt-5 border-t border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-foreground tracking-wide">
            <Search className="size-4 text-accent-blue" />
            <span>INDEPENDENT RECEIPT VERIFICATION SERVICE</span>
          </span>
          <Badge variant="outline" className="text-[10px] rounded-full border-accent-blue/30 text-accent-blue font-mono">
            Algorand Testnet
          </Badge>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Paste any Algorand transaction ID to independently verify log hashes and testnet on-chain settlement.
        </p>

        <div className="flex items-center gap-2">
          <Input
            value={searchTxId}
            placeholder="Paste Algorand TxID (e.g. WD4FH3...)"
            className="font-mono text-xs h-9 flex-1 bg-background/80 focus:ring-1 focus:ring-accent-blue"
            onChange={(e) => setSearchTxId(e.target.value)}
          />
          <Button
            size="sm"
            disabled={verifyingReceipt || !searchTxId.trim()}
            className="h-9 px-4 text-xs font-mono font-semibold bg-accent-blue/90 hover:bg-accent-blue text-white transition-all duration-200 gap-1.5"
            onClick={() => void verifyReceiptForTx(searchTxId)}
          >
            {verifyingReceipt ? (
              <>
                <RefreshCw className="size-3 animate-spin" /> Verifying…
              </>
            ) : (
              <>
                <Search className="size-3" /> Verify Receipt
              </>
            )}
          </Button>
        </div>

        {receiptResult && (
          <div className="rounded-lg border border-border/80 bg-background/80 p-4 space-y-3 text-xs transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            {receiptResult.verified ? (
              <>
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Receipt Verified in Log Chain</span>
                  </span>
                  {receiptResult.onChainVerified ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Check className="size-3" /> ON-CHAIN SETTLED
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      ⚠️ UNVERIFIED ON-CHAIN
                    </span>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2 font-mono text-[11px] text-muted-foreground">
                  <div className="rounded border border-border/40 bg-card/60 p-2">
                    <span className="text-[10px] text-subtle block uppercase">Route Paid</span>
                    <span className="text-foreground font-semibold">{receiptResult.route}</span>
                  </div>
                  <div className="rounded border border-border/40 bg-card/60 p-2">
                    <span className="text-[10px] text-subtle block uppercase">Price Paid</span>
                    <span className="text-accent-green font-semibold">{receiptResult.pricePaid}</span>
                  </div>
                  <div className="rounded border border-border/40 bg-card/60 p-2 sm:col-span-2">
                    <span className="text-[10px] text-subtle block uppercase">Payer Address</span>
                    <span className="text-foreground truncate block font-mono">{receiptResult.payer}</span>
                  </div>
                </div>

                {receiptResult.auditChain && (
                  <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-subtle">Cryptographic Entry Hash:</span>
                    </div>
                    <div className="truncate font-mono text-[10px] bg-muted/30 p-1.5 rounded border border-border/30 text-foreground/90">
                      {receiptResult.auditChain.entryHash}
                    </div>
                  </div>
                )}

                {receiptResult.explorer && (
                  <div className="pt-1 text-right">
                    <a
                      href={receiptResult.explorer}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-accent-blue hover:underline font-semibold"
                    >
                      <span>View on Pera Explorer</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-destructive py-1">
                <XCircle className="size-4 shrink-0" />
                <span>
                  {receiptResult.error}: {receiptResult.reason ?? "Receipt not found in server log."}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. AGENT TRUST SCORE LOOKUP & MATHEMATICAL FORMULA ENGINE ── */}
      <div className="pt-5 border-t border-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-foreground tracking-wide">
            <Award className="size-4 text-accent-violet" />
            <span>AGENT TRUST SCORE LOOKUP &amp; FORMULA ENGINE</span>
          </span>
          <Badge variant="outline" className="text-[10px] rounded-full border-accent-violet/30 text-accent-violet font-mono">
            x402 Protocol Metric
          </Badge>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Dynamic 0–100 reliability score calculated from real PagePay testnet transaction history using our mathematical scoring formula.
        </p>

        {/* Scoring Formula Box */}
        <div className="rounded-lg border border-accent-violet/20 bg-accent-violet/5 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-accent-violet font-semibold text-[11px]">
            <Calculator className="size-3.5" />
            <span>EXACT MATHEMATICAL SCORING FORMULA</span>
          </div>
          <p className="font-mono text-[10px] leading-relaxed text-foreground/90 bg-background/80 p-2 rounded border border-border/40 overflow-x-auto">
            TrustScore = min(100, TxCountPoints + SuccessRatePoints + VolumeBonusPoints)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-muted-foreground pt-1">
            <div className="rounded bg-background/40 p-1.5 border border-border/30">
              <span className="font-semibold text-foreground block">1. Tx Count (Max 40 pts)</span>
              <span>10 pts per settled tx</span>
            </div>
            <div className="rounded bg-background/40 p-1.5 border border-border/30">
              <span className="font-semibold text-foreground block">2. Success Rate (Max 40 pts)</span>
              <span>(Settled / Total) × 40</span>
            </div>
            <div className="rounded bg-background/40 p-1.5 border border-border/30">
              <span className="font-semibold text-foreground block">3. USD Volume (Max 20 pts)</span>
              <span>50 pts per $1.00 USD</span>
            </div>
          </div>
        </div>

        {/* Input & Action */}
        <div className="flex items-center gap-2">
          <Input
            value={searchAddress}
            placeholder="Paste Algorand Address (e.g. EVEHMX...)"
            className="font-mono text-xs h-9 flex-1 bg-background/80 focus:ring-1 focus:ring-accent-violet"
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button
            size="sm"
            disabled={checkingScore || !searchAddress.trim()}
            className="h-9 px-4 text-xs font-mono font-semibold bg-accent-violet/90 hover:bg-accent-violet text-white transition-all duration-200 gap-1.5"
            onClick={() => void checkTrustScoreForAddress(searchAddress)}
          >
            {checkingScore ? (
              <>
                <RefreshCw className="size-3 animate-spin" /> Calculating…
              </>
            ) : (
              <>
                <Calculator className="size-3" /> Calculate Score
              </>
            )}
          </Button>
        </div>

        {/* Live Calculation Results */}
        {trustScoreResult && (
          <div className="rounded-xl border border-border/80 bg-background/90 p-4 space-y-4 text-xs font-mono transition-all duration-300 animate-in fade-in slide-in-from-top-1 shadow-inner">
            {trustScoreResult.error ? (
              <div className="flex items-center gap-2 text-destructive py-1">
                <XCircle className="size-4 shrink-0" />
                <span>{trustScoreResult.error}: {trustScoreResult.reason}</span>
              </div>
            ) : (
              <>
                {/* Score Header Badge */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Target Address Score</span>
                    <span className="font-semibold text-foreground truncate max-w-[200px] block text-xs">
                      {trustScoreResult.address}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 bg-accent-violet/10 border border-accent-violet/30 px-3 py-1 rounded-lg">
                    <span className="text-xl font-extrabold text-accent-violet">
                      {trustScoreResult.trustScore}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">/ 100</span>
                  </div>
                </div>

                {/* Dynamic Formula Execution Output */}
                {trustScoreResult.scoreBreakdown && (
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Zap className="size-3 text-accent-amber" /> Dynamic Calculation Result:
                      </span>
                      <span className="font-bold text-accent-violet">
                        Score: {trustScoreResult.trustScore} / 100
                      </span>
                    </div>

                    <div className="font-mono text-[10px] text-muted-foreground bg-background/90 p-2 rounded border border-border/40">
                      {trustScoreResult.scoreBreakdown.formula}
                    </div>

                    {/* Progress Bars for Weightings */}
                    <div className="space-y-2 pt-1">
                      {/* 1. Tx Count Points */}
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-muted-foreground">Settlement Frequency Weight:</span>
                          <span className="font-semibold text-foreground">
                            {trustScoreResult.scoreBreakdown.txCountPoints} / 40 pts
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-blue transition-all duration-500 rounded-full"
                            style={{
                              width: `${(trustScoreResult.scoreBreakdown.txCountPoints / 40) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* 2. Success Rate Points */}
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-muted-foreground">Reliability &amp; Success Weight:</span>
                          <span className="font-semibold text-foreground">
                            {trustScoreResult.scoreBreakdown.successRatePoints} / 40 pts
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-green transition-all duration-500 rounded-full"
                            style={{
                              width: `${(trustScoreResult.scoreBreakdown.successRatePoints / 40) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* 3. Volume Bonus Points */}
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-muted-foreground">Economic Volume Weight:</span>
                          <span className="font-semibold text-foreground">
                            {trustScoreResult.scoreBreakdown.volumeBonusPoints} / 20 pts
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-violet transition-all duration-500 rounded-full"
                            style={{
                              width: `${(trustScoreResult.scoreBreakdown.volumeBonusPoints / 20) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Formula Basis Explanations */}
                <div className="space-y-1.5 text-[11px] pt-1">
                  <span className="text-[10px] font-semibold uppercase text-subtle block">Calculated Formula Basis:</span>
                  <ul className="space-y-1 text-muted-foreground font-mono text-[10px]">
                    {trustScoreResult.scoreBreakdown?.basis.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 bg-background/50 p-1.5 rounded border border-border/30">
                        <span className="size-1.5 rounded-full bg-accent-violet shrink-0" />
                        <span>{item}</span>
                      </li>
                    )) ?? (
                      <>
                        <li className="flex justify-between">
                          <span>Settled Transactions:</span>
                          <span className="text-foreground font-semibold">{trustScoreResult.totalTransactions}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Total USD Volume:</span>
                          <span className="text-foreground font-semibold">{trustScoreResult.totalVolumeUsd}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
