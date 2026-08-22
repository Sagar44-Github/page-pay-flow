/**
 * Agent Spend Policy Guard for PagePay.
 *
 * A client-side policy layer that sits in front of PagePay's x402 payment client.
 * Autonomously evaluates spend limits, session budgets, allowed modes, and allowed
 * endpoints BEFORE any payment transaction is constructed, signed, or submitted.
 */
import { payAndFetch, type PaidRequestResult, type WalletSigner, type PayAndFetchOptions } from "@/lib/x402/client";
import { priceForPages } from "@/lib/pagepay/pricing";
import { getConfig } from "@/lib/pagepay/config.server";

export interface AgentSpendPolicy {
  /** Maximum USD amount allowed for a single request. Refuses any request quoted above this. */
  maxPricePerRequestUsd: number;
  /** Total USD budget allocated for this agent session. */
  sessionBudgetUsd: number;
  /** Modes allowed for execution. E.g. ["summary", "action_items", "compliance_check", "checklist"]. */
  allowedModes: Array<"summary" | "action_items" | "key_risks" | "compliance_check" | "checklist">;
  /** Allowed endpoint paths. E.g. ["/api/summarize", "/api/summarize/range"]. */
  allowedEndpoints: string[];
}

export interface PolicyHistoryEntry {
  timestamp: string;
  endpoint: string;
  mode: string;
  quotedPriceUsd: number;
  status: "allowed" | "refused";
  ruleViolated?: "max_price" | "session_budget" | "mode_disallowed" | "endpoint_disallowed";
  reason?: string;
  txId?: string;
}

export class AgentSessionTracker {
  private totalSpentUsd = 0;
  private history: PolicyHistoryEntry[] = [];

  constructor(public readonly sessionId: string = `session_${Date.now()}`) {}

  getSpentUsd(): number {
    return Number(this.totalSpentUsd.toFixed(4));
  }

  getRemainingBudgetUsd(policy: AgentSpendPolicy): number {
    const rem = policy.sessionBudgetUsd - this.totalSpentUsd;
    return Math.max(0, Number(rem.toFixed(4)));
  }

  recordSpend(amountUsd: number) {
    this.totalSpentUsd += amountUsd;
  }

  addHistory(entry: PolicyHistoryEntry) {
    this.history.push(entry);
  }

  getHistory(): readonly PolicyHistoryEntry[] {
    return this.history;
  }

  reset() {
    this.totalSpentUsd = 0;
    this.history = [];
  }
}

export interface PolicyCheckResult {
  allowed: boolean;
  ruleViolated?: "max_price" | "session_budget" | "mode_disallowed" | "endpoint_disallowed";
  reason?: string;
  quotedPriceUsd?: number;
  quotedPages?: number;
  remainingBudgetUsd?: number;
  currentSpentUsd?: number;
}

export interface AgentPolicyExecutionResult {
  allowed: boolean;
  policyCheck: PolicyCheckResult;
  paidResult?: PaidRequestResult;
  refusalReason?: string;
}

/** Default permissive policy for fallback. */
export const DEFAULT_AGENT_POLICY: AgentSpendPolicy = {
  maxPricePerRequestUsd: 0.10,
  sessionBudgetUsd: 1.00,
  allowedModes: ["summary", "action_items", "key_risks", "compliance_check", "checklist"],
  allowedEndpoints: ["/api/summarize", "/api/summarize/range", "/api/compare"],
};

/**
 * Perform pre-flight policy evaluation on intended request parameters.
 * Checks mode & endpoint permissions BEFORE any network quote request.
 */
export function checkPreflightPolicy(
  endpoint: string,
  mode: "summary" | "action_items" | "key_risks",
  policy: AgentSpendPolicy,
): PolicyCheckResult | null {
  // Normalize endpoint path to URL pathname (e.g. "http://localhost:8080/api/summarize" -> "/api/summarize")
  let path = endpoint.split("?")[0];
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      path = new URL(path).pathname;
    }
  } catch {
    // Keep raw path
  }

  // 1. Check allowed modes
  if (!policy.allowedModes.includes(mode)) {
    return {
      allowed: false,
      ruleViolated: "mode_disallowed",
      reason: `Blocked by spend policy: extraction mode '${mode}' is not in allowedModes [${policy.allowedModes.join(", ")}].`,
    };
  }

  // 2. Check allowed endpoints
  if (policy.allowedEndpoints.length > 0 && !policy.allowedEndpoints.includes(path)) {
    return {
      allowed: false,
      ruleViolated: "endpoint_disallowed",
      reason: `Blocked by spend policy: endpoint '${path}' is not in allowedEndpoints [${policy.allowedEndpoints.join(", ")}].`,
    };
  }

  return null; // Pre-flight passed
}

/**
 * Evaluate price and session budget against the 402 quote response.
 * Runs BEFORE constructing or signing any Algorand transaction.
 */
export function checkQuotePolicy(
  quotedPages: number,
  pricePerPageUsd: number,
  policy: AgentSpendPolicy,
  session: AgentSessionTracker,
): PolicyCheckResult {
  const quotedPriceUsd = Number((quotedPages * pricePerPageUsd).toFixed(4));
  const currentSpent = session.getSpentUsd();
  const remainingBudget = session.getRemainingBudgetUsd(policy);

  // 1. Check per-request max price cap
  if (quotedPriceUsd > policy.maxPricePerRequestUsd) {
    return {
      allowed: false,
      ruleViolated: "max_price",
      quotedPriceUsd,
      quotedPages,
      remainingBudgetUsd: remainingBudget,
      currentSpentUsd: currentSpent,
      reason: `Blocked by spend policy: quoted price ($${quotedPriceUsd.toFixed(2)}) exceeds max price per request cap ($${policy.maxPricePerRequestUsd.toFixed(2)}).`,
    };
  }

  // 2. Check session budget availability
  if (currentSpent + quotedPriceUsd > policy.sessionBudgetUsd) {
    return {
      allowed: false,
      ruleViolated: "session_budget",
      quotedPriceUsd,
      quotedPages,
      remainingBudgetUsd: remainingBudget,
      currentSpentUsd: currentSpent,
      reason: `Blocked by spend policy: request price ($${quotedPriceUsd.toFixed(2)}) would exceed remaining session budget ($${remainingBudget.toFixed(2)} remaining of $${policy.sessionBudgetUsd.toFixed(2)} budget, $${currentSpent.toFixed(2)} spent).`,
    };
  }

  return {
    allowed: true,
    quotedPriceUsd,
    quotedPages,
    remainingBudgetUsd: remainingBudget - quotedPriceUsd,
    currentSpentUsd: currentSpent,
  };
}

/**
 * Execute an agent request wrapped with the Agent Spend Policy Guard.
 *
 * Reuses the existing payAndFetch client logic. Guarantees that if a policy
 * rule is violated, NO transaction is constructed, signed, or submitted.
 */
export async function runAgentWithPolicy(
  endpoint: string,
  init: RequestInit,
  signer: WalletSigner,
  policy: AgentSpendPolicy,
  session: AgentSessionTracker,
  mode: "summary" | "action_items" | "key_risks" = "summary",
  options: PayAndFetchOptions = {},
): Promise<AgentPolicyExecutionResult> {
  const timestamp = new Date().toISOString();

  // 1. Pre-flight check (Mode and Endpoint restrictions) — NO network call made if failed
  const preflightViolation = checkPreflightPolicy(endpoint, mode, policy);
  if (preflightViolation) {
    session.addHistory({
      timestamp,
      endpoint,
      mode,
      quotedPriceUsd: 0,
      status: "refused",
      ruleViolated: preflightViolation.ruleViolated,
      reason: preflightViolation.reason,
    });
    return {
      allowed: false,
      policyCheck: preflightViolation,
      refusalReason: preflightViolation.reason,
    };
  }

  // 2. Fetch unmetered 402 quote without payment headers
  console.log(`[Policy Guard] Pre-flight passed. Requesting 402 quote from ${endpoint}...`);
  let quoteRes: Response;
  try {
    quoteRes = await fetch(endpoint, init);
  } catch (err) {
    throw new Error(`Failed to fetch price quote: ${err instanceof Error ? err.message : String(err)}`);
  }

  let pagesQuoted = 1;
  if (quoteRes.status === 402) {
    try {
      const body = await quoteRes.clone().json();
      if (typeof body.pagesQuoted === "number") pagesQuoted = body.pagesQuoted;
    } catch {
      // Use default 1 page
    }
  }

  const pricePerPage = 0.01; // $0.01 per page standard rate

  // 3. Evaluate quote against price cap and remaining session budget
  const quoteCheck = checkQuotePolicy(pagesQuoted, pricePerPage, policy, session);
  if (!quoteCheck.allowed) {
    console.log(`[Policy Guard] 🛡️ REFUSED by policy: ${quoteCheck.reason}`);
    session.addHistory({
      timestamp,
      endpoint,
      mode,
      quotedPriceUsd: quoteCheck.quotedPriceUsd ?? 0,
      status: "refused",
      ruleViolated: quoteCheck.ruleViolated,
      reason: quoteCheck.reason,
    });
    return {
      allowed: false,
      policyCheck: quoteCheck,
      refusalReason: quoteCheck.reason,
    };
  }

  // 4. Policy check PASSED — proceed with real payment using existing payAndFetch client logic
  console.log(`[Policy Guard] ✅ Policy check PASSED ($${quoteCheck.quotedPriceUsd?.toFixed(2)} <= budget). Proceeding to sign and submit payment...`);
  const paidResult = await payAndFetch(endpoint, init, signer, options);

  if (paidResult.ok && paidResult.result) {
    const resData = paidResult.result as Record<string, unknown>;
    const txId = (resData["txId"] as string) ?? undefined;
    const spentAmount = quoteCheck.quotedPriceUsd ?? 0.01;

    session.recordSpend(spentAmount);
    session.addHistory({
      timestamp,
      endpoint,
      mode,
      quotedPriceUsd: spentAmount,
      status: "allowed",
      txId,
    });
  }

  return {
    allowed: true,
    policyCheck: quoteCheck,
    paidResult,
  };
}
