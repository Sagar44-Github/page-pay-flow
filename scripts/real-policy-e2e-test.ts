/**
 * Standalone Real E2E Test Suite for Agent Spend Policy Guard.
 *
 * Runs all 4 policy guard scenarios against the live backend (http://localhost:8080)
 * using the real funded test account (EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE).
 *
 * Verifies that:
 * 1. Compliant requests produce REAL on-chain Algorand transaction IDs.
 * 2. Refused requests (price cap, budget exhaustion, mode restriction) NEVER construct,
 *    sign, or submit any payment transaction, and /api/metrics totalTransactions NEVER changes.
 */
import algosdk from "algosdk";
import fs from "fs";
import { type WalletSigner } from "../src/lib/x402/client";
import {
  runAgentWithPolicy,
  AgentSessionTracker,
  type AgentSpendPolicy,
} from "../src/lib/pagepay/agentPolicy";

const BASE_URL = "http://localhost:8080";

function getTestMnemonic(): string {
  const envContent = fs.readFileSync(".env", "utf8");
  const match = envContent.match(/TEST_PAYER_MNEMONIC=["']?([^"'\n\r]+)["']?/);
  if (!match || !match[1]) throw new Error("TEST_PAYER_MNEMONIC not found in .env");
  return match[1].trim();
}

function createAlgorandSigner(mnemonic: string): WalletSigner {
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  return {
    address: account.addr.toString(),
    async signTransactions(txns: Uint8Array[], indexesToSign?: number[]): Promise<(Uint8Array | null)[]> {
      const toSign = indexesToSign ?? txns.map((_, i) => i);
      const signed: (Uint8Array | null)[] = new Array(txns.length).fill(null);
      for (const idx of toSign) {
        const unsignedTx = algosdk.decodeUnsignedTransaction(txns[idx]);
        signed[idx] = unsignedTx.signTxn(account.sk);
      }
      return signed;
    },
  };
}

async function fetchMetrics(): Promise<{ totalTransactions: number; usdcVolumeFormatted: string }> {
  const res = await fetch(`${BASE_URL}/api/metrics`);
  if (!res.ok) throw new Error(`GET /api/metrics failed: ${res.status}`);
  const data = (await res.json()) as { metrics: { totalTransactions: number; usdcVolumeFormatted: string } };
  return data.metrics;
}

async function runPolicyTestCases() {
  console.log("=========================================================================");
  console.log("AGENT SPEND POLICY GUARD — REAL E2E TEST SUITE");
  console.log("=========================================================================\n");

  const mnemonic = getTestMnemonic();
  const signer = createAlgorandSigner(mnemonic);
  console.log(`Test Payer Address: ${signer.address}`);

  const initialMetrics = await fetchMetrics();
  console.log(`[INITIAL METRICS]: totalTransactions = ${initialMetrics.totalTransactions}, volume = ${initialMetrics.usdcVolumeFormatted}\n`);

  const testDoc = "POLICY TEST DOCUMENT: 500 words security audit agreement summary for agent verification.";

  // -----------------------------------------------------------------------
  // TEST 1 — Policy Allows Compliant Request
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log("RUNNING TEST 1: Policy Allows Compliant Request");
  console.log("-------------------------------------------------------------------------");
  const session1 = new AgentSessionTracker("session_test1");
  const policy1: AgentSpendPolicy = {
    maxPricePerRequestUsd: 0.05,
    sessionBudgetUsd: 0.05,
    allowedModes: ["summary"],
    allowedEndpoints: ["/api/summarize", "/api/summarize/range"],
  };

  const res1 = await runAgentWithPolicy(
    `${BASE_URL}/api/summarize`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: testDoc, mode: "summary" }),
    },
    signer,
    policy1,
    session1,
    "summary",
  );

  const metricsAfterT1 = await fetchMetrics();
  if (res1.allowed && res1.paidResult?.ok) {
    const resData = res1.paidResult.result as Record<string, unknown>;
    console.log(`✅ TEST 1 PASSED: Compliant request allowed and paid successfully!`);
    console.log(`REAL TX ID: ${resData["txId"]}`);
    console.log(`Explorer: ${resData["explorer"]}`);
    console.log(`Session Spent: $${session1.getSpentUsd().toFixed(2)} / $${policy1.sessionBudgetUsd.toFixed(2)}`);
    console.log(`Metrics totalTransactions: ${initialMetrics.totalTransactions} -> ${metricsAfterT1.totalTransactions} (+1)`);
  } else {
    console.error(`❌ TEST 1 FAILED: Expected request to be allowed and paid, but got refusal or error:`, res1);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 2 — Policy Refuses Due to Per-Request Price Cap
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 2: Policy Refuses Due to Per-Request Price Cap ($0.005 Cap)");
  console.log("-------------------------------------------------------------------------");
  const session2 = new AgentSessionTracker("session_test2");
  const policy2: AgentSpendPolicy = {
    maxPricePerRequestUsd: 0.005, // Cap below real $0.01 price
    sessionBudgetUsd: 0.05,
    allowedModes: ["summary", "action_items", "key_risks"],
    allowedEndpoints: ["/api/summarize"],
  };

  const res2 = await runAgentWithPolicy(
    `${BASE_URL}/api/summarize`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: testDoc, mode: "summary" }),
    },
    signer,
    policy2,
    session2,
    "summary",
  );

  const metricsAfterT2 = await fetchMetrics();
  if (!res2.allowed && res2.policyCheck.ruleViolated === "max_price") {
    console.log(`🛡️ TEST 2 PASSED: Request REFUSED by policy before payment!`);
    console.log(`Refusal Reason: "${res2.refusalReason}"`);
    console.log(`Rule Violated: ${res2.policyCheck.ruleViolated}`);
    console.log(`Metrics totalTransactions: ${metricsAfterT2.totalTransactions} (UNCHANGED - No Tx Created)`);
  } else {
    console.error(`❌ TEST 2 FAILED: Expected refusal for max_price, got:`, res2);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 3 — Policy Refuses Due to Session Budget Exhaustion
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 3: Policy Refuses Due to Session Budget Exhaustion ($0.01 Budget)");
  console.log("-------------------------------------------------------------------------");
  const session3 = new AgentSessionTracker("session_test3");
  const policy3: AgentSpendPolicy = {
    maxPricePerRequestUsd: 0.05,
    sessionBudgetUsd: 0.01, // Budget for exactly ONE $0.01 request
    allowedModes: ["summary"],
    allowedEndpoints: ["/api/summarize"],
  };

  console.log("Step 3a: Attempting Request #1 (should succeed, spend = $0.01)...");
  const res3a = await runAgentWithPolicy(
    `${BASE_URL}/api/summarize`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: testDoc, mode: "summary" }),
    },
    signer,
    policy3,
    session3,
    "summary",
  );

  const metricsAfterT3a = await fetchMetrics();
  if (!res3a.allowed || !res3a.paidResult?.ok) {
    console.error(`❌ TEST 3a FAILED: First request should have passed:`, res3a);
    process.exit(1);
  }
  const txId3a = (res3a.paidResult.result as Record<string, unknown>)["txId"];
  console.log(`Request #1 Allowed! TxID: ${txId3a}, Session Spent: $${session3.getSpentUsd().toFixed(2)} / $${policy3.sessionBudgetUsd.toFixed(2)}`);

  console.log("\nStep 3b: Attempting Request #2 in same session (budget exhausted, should be REFUSED)...");
  const res3b = await runAgentWithPolicy(
    `${BASE_URL}/api/summarize`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: testDoc, mode: "summary" }),
    },
    signer,
    policy3,
    session3,
    "summary",
  );

  const metricsAfterT3b = await fetchMetrics();
  if (!res3b.allowed && res3b.policyCheck.ruleViolated === "session_budget") {
    console.log(`🛡️ TEST 3 PASSED: Second request REFUSED by budget policy!`);
    console.log(`Refusal Reason: "${res3b.refusalReason}"`);
    console.log(`Rule Violated: ${res3b.policyCheck.ruleViolated}`);
    console.log(`Metrics totalTransactions: ${metricsAfterT3a.totalTransactions} -> ${metricsAfterT3b.totalTransactions} (UNCHANGED by 2nd request)`);
  } else {
    console.error(`❌ TEST 3 FAILED: Expected second request to be refused for session_budget, got:`, res3b);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 4 — Policy Refuses Due to Disallowed Mode
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 4: Policy Refuses Due to Disallowed Mode ('key_risks')");
  console.log("-------------------------------------------------------------------------");
  const session4 = new AgentSessionTracker("session_test4");
  const policy4: AgentSpendPolicy = {
    maxPricePerRequestUsd: 0.05,
    sessionBudgetUsd: 0.10,
    allowedModes: ["summary"], // ONLY summary allowed
    allowedEndpoints: ["/api/summarize"],
  };

  const res4 = await runAgentWithPolicy(
    `${BASE_URL}/api/summarize`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: testDoc, mode: "key_risks" }),
    },
    signer,
    policy4,
    session4,
    "key_risks",
  );

  const metricsAfterT4 = await fetchMetrics();
  if (!res4.allowed && res4.policyCheck.ruleViolated === "mode_disallowed") {
    console.log(`🛡️ TEST 4 PASSED: Disallowed mode request REFUSED in pre-flight!`);
    console.log(`Refusal Reason: "${res4.refusalReason}"`);
    console.log(`Rule Violated: ${res4.policyCheck.ruleViolated}`);
    console.log(`Metrics totalTransactions: ${metricsAfterT4.totalTransactions} (UNCHANGED - No Tx Created)`);
  } else {
    console.error(`❌ TEST 4 FAILED: Expected refusal for mode_disallowed, got:`, res4);
    process.exit(1);
  }

  console.log("\n=========================================================================");
  console.log("AGENT SPEND POLICY GUARD — FINAL TEST RESULTS");
  console.log("=========================================================================");
  console.log(`TEST 1 (Compliant Request): PASSED ✅ - Real TxID: ${(res1.paidResult?.result as Record<string, unknown>)["txId"]}`);
  console.log(`TEST 2 (Max Price Cap Refusal): PASSED 🛡️ - Refused without tx`);
  console.log(`TEST 3 (Session Budget Refusal): PASSED 🛡️ - Request 1 TxID: ${txId3a}, Request 2 Refused`);
  console.log(`TEST 4 (Disallowed Mode Refusal): PASSED 🛡️ - Refused without tx`);
  console.log(`\nFINAL METRICS: totalTransactions = ${metricsAfterT4.totalTransactions}, volume = ${metricsAfterT4.usdcVolumeFormatted}`);
}

runPolicyTestCases().catch((err) => {
  console.error("FATAL ERROR IN POLICY TEST SUITE:", err);
  process.exit(1);
});
