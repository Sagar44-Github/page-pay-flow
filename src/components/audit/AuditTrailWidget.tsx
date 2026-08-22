/**
 * AuditTrailWidget — Frontend component for live cryptographic log verification.
 *
 * Displays total entries, chain status (✅ Verified / ❌ Broken), genesis hash,
 * and a "Re-verify chain" button that calls GET /api/audit/verify live.
 */
import { useState } from "react";
import { ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditResult {
  valid: boolean;
  totalEntries: number;
  brokenAt: number | null;
  verifiedAt: string;
  details?: string;
}

export function AuditTrailWidget() {
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/audit/verify");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AuditResult;
      setAudit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 font-mono text-xs">
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
  );
}
