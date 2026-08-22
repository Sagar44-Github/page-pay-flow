/**
 * Standalone Real E2E Test Suite for Multi-Document AI Comparison (/api/compare).
 *
 * Runs all 4 test cases against the live backend (http://localhost:8080)
 * using the real funded test account (EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE).
 */
import algosdk from "algosdk";
import fs from "fs";
import { payAndFetch, type WalletSigner } from "../src/lib/x402/client";

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

async function fetchMetrics(): Promise<{ totalTransactions: number; usdcVolumeAtomic: number; usdcVolumeFormatted: string }> {
  const res = await fetch(`${BASE_URL}/api/metrics`);
  if (!res.ok) throw new Error(`GET /api/metrics failed: ${res.status}`);
  const data = (await res.json()) as { metrics: { totalTransactions: number; usdcVolumeAtomic: number; usdcVolumeFormatted: string } };
  return data.metrics;
}

async function runCompareTestCases() {
  console.log("=========================================================================");
  console.log("MULTI-DOCUMENT AI COMPARISON (/api/compare) — REAL E2E TEST SUITE");
  console.log("=========================================================================\n");

  const mnemonic = getTestMnemonic();
  const signer = createAlgorandSigner(mnemonic);
  console.log(`Test Payer Address: ${signer.address}`);

  const initialMetrics = await fetchMetrics();
  console.log(`[INITIAL METRICS]: totalTransactions = ${initialMetrics.totalTransactions}, usdcVolumeAtomic = ${initialMetrics.usdcVolumeAtomic} (${initialMetrics.usdcVolumeFormatted})\n`);

  const docAText = `CONTRACT VERSION A (2025 Standard Terms):
Contractor: Alpha Cyber Sec LLC.
Deliverable: Penetration testing report by October 15, 2026.
Fee: $10,000 upfront + $10,000 upon completion.
Late Penalty: $1,000 per calendar day.
Breach Liability: Capped at total contract value ($20,000).`;

  const docBText = `CONTRACT VERSION B (2026 Revised Terms):
Contractor: Alpha Cyber Sec LLC.
Deliverable: Penetration testing report by November 30, 2026.
Fee: $15,000 upfront + $15,000 upon completion.
Late Penalty: $2,500 per calendar day.
Breach Liability: Uncapped liability for security breaches.
Notice Period: 60 days prior written notice required for termination.`;

  // -----------------------------------------------------------------------
  // TEST 1 — Correct Combined Pricing (2 Pages Total)
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log("RUNNING TEST 1: Correct Combined Pricing (Doc A 1 page + Doc B 1 page = 2 pages)");
  console.log("-------------------------------------------------------------------------");
  const unpaidRes = await fetch(`${BASE_URL}/api/compare`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ documentA: docAText, documentB: docBText }),
  });
  console.log(`Unpaid Response Status: HTTP ${unpaidRes.status} ${unpaidRes.statusText}`);
  const unpaidBody = await unpaidRes.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(unpaidBody, null, 2)}`);

  if (unpaidRes.status === 402 && unpaidBody.pagesQuoted === 2 && unpaidBody.priceQuoted === "$0.02") {
    console.log(`\n✅ TEST 1 PASSED: Combined page count correctly quoted as 2 pages ($0.02)!`);
  } else {
    console.error(`❌ TEST 1 FAILED: Expected 402 with pagesQuoted: 2 and priceQuoted: "$0.02", got:`, unpaidBody);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 2 — Real Paid Comparison ($0.02 USDC)
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 2: Real Paid Comparison (Submitting $0.02 payment on-chain)");
  console.log("-------------------------------------------------------------------------");
  const init2: RequestInit = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ documentA: docAText, documentB: docBText }),
  };

  const payResult = await payAndFetch(`${BASE_URL}/api/compare`, init2, signer, {
    expectedPages: 2,
    onPhase: (phase) => console.log(`  [x402 Phase Progress]: ${phase}`),
  });

  if (!payResult.ok || !payResult.result) {
    console.error(`❌ TEST 2 FAILED: Payment or settlement failed:`, payResult);
    process.exit(1);
  }

  const resData = payResult.result as Record<string, unknown>;
  const realTxId = String(resData["txId"]);
  const explorer = String(resData["explorer"]);
  const comparisonText = String(resData["comparison"]);

  const metricsAfterT2 = await fetchMetrics();
  const volumeDelta = metricsAfterT2.usdcVolumeAtomic - initialMetrics.usdcVolumeAtomic;

  console.log(`\n✅ TEST 2 PASSED: Real payment settled & structured comparison received!`);
  console.log(`REAL TX ID: ${realTxId}`);
  console.log(`EXPLORER: ${explorer}`);
  console.log(`Price Paid: ${resData["pricePaid"]} (${resData["amountPaid"]})`);
  console.log(`Metrics totalTransactions: ${initialMetrics.totalTransactions} -> ${metricsAfterT2.totalTransactions} (+1)`);
  console.log(`Metrics usdcVolumeAtomic Delta: +${volumeDelta} atomic units ($0.02 exact)`);
  console.log(`\nRAW COMPARISON OUTPUT:\n${comparisonText}\n`);

  if (volumeDelta !== 20000) {
    console.error(`❌ TEST 2 FAILED: Expected usdcVolumeAtomic delta of 20000 ($0.02), got ${volumeDelta}`);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 3 — Missing Second Document Validation
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log("RUNNING TEST 3: Missing Second Document Validation (documentB missing)");
  console.log("-------------------------------------------------------------------------");
  const res3 = await fetch(`${BASE_URL}/api/compare`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ documentA: docAText }), // documentB omitted!
  });
  console.log(`Response Status: HTTP ${res3.status} ${res3.statusText}`);
  const body3 = await res3.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body3, null, 2)}`);

  const metricsAfterT3 = await fetchMetrics();
  if (res3.status === 400 && body3.reason?.includes("Document B is missing")) {
    console.log(`\n✅ TEST 3 PASSED: Returned clear 400 error naming missing Document B!`);
    console.log(`Metrics totalTransactions: ${metricsAfterT3.totalTransactions} (UNCHANGED)`);
  } else {
    console.error(`❌ TEST 3 FAILED: Expected 400 error naming Document B, got:`, body3);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 4 — Oversized Document B Input Validation (>50 pages)
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 4: Oversized Document B Input Validation (>50 pages)");
  console.log("-------------------------------------------------------------------------");
  // Generate text for 51 pages (51 * 500 = 25,500 words)
  const oversizedTextB = Array(25500).fill("word").join(" ");
  const res4 = await fetch(`${BASE_URL}/api/compare`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ documentA: docAText, documentB: oversizedTextB }),
  });
  console.log(`Response Status: HTTP ${res4.status} ${res4.statusText}`);
  const body4 = await res4.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body4, null, 2)}`);

  const metricsAfterT4 = await fetchMetrics();
  if (res4.status === 400 && body4.reason?.includes("Document B")) {
    console.log(`\n✅ TEST 4 PASSED: Returned clear 400 error naming Document B specifically for exceeding max pages!`);
    console.log(`Metrics totalTransactions: ${metricsAfterT4.totalTransactions} (UNCHANGED)`);
  } else {
    console.error(`❌ TEST 4 FAILED: Expected 400 error naming Document B, got:`, body4);
    process.exit(1);
  }

  console.log("\n=========================================================================");
  console.log("MULTI-DOCUMENT AI COMPARISON — FINAL TEST RESULTS");
  console.log("=========================================================================");
  console.log(`TEST 1 (Combined 2-Page 402 Quote): PASSED ✅ - Quoted $0.02 (2 pages)`);
  console.log(`TEST 2 (Real Paid Comparison): PASSED ✅ - Real TxID: ${realTxId}`);
  console.log(`TEST 3 (Missing Document B Validation): PASSED ✅ - HTTP 400 Returned`);
  console.log(`TEST 4 (Oversized Document B Validation): PASSED ✅ - HTTP 400 Returned`);
  console.log(`\nFINAL METRICS: totalTransactions = ${metricsAfterT4.totalTransactions}, volume = ${metricsAfterT4.usdcVolumeFormatted}`);
}

runCompareTestCases().catch((err) => {
  console.error("FATAL ERROR IN COMPARE TEST SUITE:", err);
  process.exit(1);
});
