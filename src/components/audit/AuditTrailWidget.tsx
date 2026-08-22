/**
 * AuditTrailWidget — Frontend component for live cryptographic log verification,
 * Receipt Verification Service, and Agent Trust Score lookup.
 *
 * Supports automatic verification when txId / address are passed post-settlement.
 */
import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, RefreshCw, Search, CheckCircle2, XCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface TrustScoreResult {
  address: string;
  trustScore: number;
  totalTransactions: number;
  totalVolumeUsd: string;
  successRate: number | null;
  firstSeen: string | null;
  lastSeen: string | null;
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
      void handleVerify(); // Auto re-verify tamper audit chain
    }
  }, [autoTxId]);

  useEffect(() => {
    if (autoAddress) {
      setSearchAddress(autoAddress);
      void checkTrustScoreForAddress(autoAddress);
    }
  }, [autoAddress]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5 font-mono text-xs shadow-sm">
      {/* ── 1. TAMPER-EVIDENT AUDIT TRAIL ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck className="size-4 text-primary" />
            <span>TAMPER-EVIDENT AUDIT TRAIL</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => void handleVerify()}
            className="text-xs h-7 gap-1 font-mono"
          >
            <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Verifying…" : "Re-verify chain"}</span>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Every request and payment log entry is cryptographically SHA-256 hashed and linked to the previous entry’s hash.
        </p>

        {audit && (
          <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Chain Status:</span>
              {audit.valid ? (
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <ShieldCheck className="size-3.5" /> ✅ VERIFIED INTEGRITY
                </span>
              ) : (
                <span className="flex items-center gap-1 font-bold text-destructive">
                  <ShieldAlert className="size-3.5" /> ❌ CHAIN BROKEN at entry #{audit.brokenAt}
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

            <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40 flex justify-between">
              <span>Genesis: 0000000000000000...</span>
              <span>Last checked: {new Date(audit.verifiedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. INDEPENDENT RECEIPT VERIFICATION SERVICE ── */}
      <div className="pt-4 border-t border-border/60 space-y-3">
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <Search className="size-4 text-primary" />
          <span>INDEPENDENT RECEIPT VERIFICATION SERVICE</span>
        </span>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Paste any Algorand transaction ID to independently verify log hashes and testnet on-chain settlement.
        </p>

        <div className="flex items-center gap-2">
          <Input
            value={searchTxId}
            placeholder="Paste Algorand TxID (e.g. WD4FH3...)"
            className="font-mono text-xs h-8 flex-1"
            onChange={(e) => setSearchTxId(e.target.value)}
          />
          <Button
            size="sm"
            disabled={verifyingReceipt || !searchTxId.trim()}
            className="h-8 text-xs font-mono font-semibold"
            onClick={() => void verifyReceiptForTx(searchTxId)}
          >
            {verifyingReceipt ? "Verifying…" : "Verify Receipt"}
          </Button>
        </div>

        {receiptResult && (
          <div className="rounded-lg border border-border/80 bg-background/60 p-3 space-y-2 text-xs">
            {receiptResult.verified ? (
              <>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Receipt Found in Audit Chain</span>
                  </span>
                  {receiptResult.onChainVerified ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      ✅ ON-CHAIN VERIFIED
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      ⚠️ UNVERIFIED ON-CHAIN
                    </span>
                  )}
                </div>

                <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Route Paid:</span>
                    <span className="text-foreground">{receiptResult.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Paid:</span>
                    <span className="text-primary font-semibold">{receiptResult.pricePaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payer:</span>
                    <span className="text-foreground truncate max-w-[200px]">{receiptResult.payer}</span>
                  </div>
                  {receiptResult.auditChain && (
                    <div className="pt-1 border-t border-border/40 text-[10px]">
                      <div className="truncate">Entry Hash: {receiptResult.auditChain.entryHash}</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="size-4 shrink-0" />
                <span>
                  {receiptResult.error}: {receiptResult.reason ?? "Receipt not found in server log."}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. AGENT TRUST SCORE LOOKUP ── */}
      <div className="pt-4 border-t border-border/60 space-y-3">
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <Award className="size-4 text-primary" />
          <span>AGENT TRUST SCORE LOOKUP</span>
        </span>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Check any Algorand address reliability score (0-100) computed from real PagePay transaction history.
        </p>

        <div className="flex items-center gap-2">
          <Input
            value={searchAddress}
            placeholder="Paste Algorand Address (e.g. EVEHMX...)"
            className="font-mono text-xs h-8 flex-1"
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button
            size="sm"
            disabled={checkingScore || !searchAddress.trim()}
            className="h-8 text-xs font-mono font-semibold"
            onClick={() => void checkTrustScoreForAddress(searchAddress)}
          >
            {checkingScore ? "Calculating…" : "Check Score"}
          </Button>
        </div>

        {trustScoreResult && (
          <div className="rounded-lg border border-border/80 bg-background/60 p-3 space-y-2 text-xs font-mono">
            {trustScoreResult.error ? (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="size-4 shrink-0" />
                <span>{trustScoreResult.error}: {trustScoreResult.reason}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Trust Score Rating:</span>
                  <span className="text-base font-bold text-primary">
                    {trustScoreResult.trustScore} / 100
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Settled Transactions:</span>
                    <span className="text-foreground font-semibold">{trustScoreResult.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total USD Volume:</span>
                    <span className="text-foreground font-semibold">{trustScoreResult.totalVolumeUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Success Rate:</span>
                    <span className="text-foreground font-semibold">
                      {trustScoreResult.successRate !== null ? `${trustScoreResult.successRate}%` : "N/A"}
                    </span>
                  </div>
                  {trustScoreResult.firstSeen && (
                    <div className="flex justify-between pt-1 border-t border-border/40 text-[10px]">
                      <span>First Activity:</span>
                      <span>{new Date(trustScoreResult.firstSeen).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
