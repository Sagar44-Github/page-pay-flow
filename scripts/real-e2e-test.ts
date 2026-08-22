/**
 * Standalone E2E Test Script using a REAL Funded Algorand Testnet Account.
 *
 * Performs FULL REAL x402 flow:
 * 1. Request endpoint (expect 402 Payment Required)
 * 2. Sign real Algorand testnet transaction with test account key
 * 3. Submit payment & verify settlement via facilitator (https://facilitator.goplausible.xyz)
 * 4. Verify 200 OK response with real summary & real Algorand txId
 * 5. Fetch & display GET /api/metrics before & after each test
 */
import algosdk from "algosdk";
import fs from "fs";
import { createPagePayHttpClient, payAndFetch, type WalletSigner } from "../src/lib/x402/client";

const BASE_URL = "http://localhost:8080";

// 1. Read TEST_PAYER_MNEMONIC from .env
function getTestMnemonic(): string {
  let envContent = "";
  try {
    envContent = fs.readFileSync(".env", "utf8");
  } catch {
    throw new Error("Could not read .env file");
  }
  const match = envContent.match(/TEST_PAYER_MNEMONIC=["']?([^"'\n\r]+)["']?/);
  if (!match || !match[1]) {
    throw new Error("TEST_PAYER_MNEMONIC is not configured in .env file.");
  }
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

async function fetchMetrics(): Promise<Record<string, unknown>> {
  const res = await fetch(`${BASE_URL}/api/metrics`);
  if (!res.ok) throw new Error(`GET /api/metrics failed: ${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

async function runRealE2ETests() {
  console.log("=========================================================================");
  console.log("REAL E2E ON-CHAIN PAYMENT TEST SUITE");
  console.log("=========================================================================\n");

  const mnemonic = getTestMnemonic();
  const signer = createAlgorandSigner(mnemonic);
  console.log(`Test Payer Address: ${signer.address}`);

  // Fetch initial metrics
  console.log("\n[METRICS BEFORE TEST RUN]:");
  const metricsBefore = await fetchMetrics();
  console.log(JSON.stringify(metricsBefore, null, 2));

  const testDocText = `EXECUTIVE SECURITY & RISK AGREEMENT

1. OBLIGATIONS: Contractor John Doe shall complete the infrastructure penetration test and deliver the final report by November 30, 2026. Project Manager Sarah Smith shall review and validate all security findings within 5 business days of receipt.

2. LIABILITIES & PENALTIES: Contractor's total liability under this agreement for security breaches is uncapped. Any delay past November 30, 2026 incurs a mandatory $2,500 per calendar day liquidated damages penalty. Terminating without 60 days prior written notice triggers immediate forfeiture of all pending retainers.

3. COMPENSATION & MILESTONES: Client agrees to pay $5,000 upon contract execution, $10,000 upon delivery of the draft findings, and $10,000 upon final report approval.`;

  const realTxIds: Array<{ test: string; route: string; mode: string; txId: string; explorer: string }> = [];

  const testCases = [
    {
      name: "Test 1: Range Summarization (/api/summarize/range, pages 1-1, mode: summary)",
      url: `${BASE_URL}/api/summarize/range`,
      body: { text: testDocText, startPage: 1, endPage: 1, mode: "summary" },
      expectedPages: 1,
      mode: "summary",
    },
    {
      name: "Test 2: Whole Document Summarization (/api/summarize, default mode)",
      url: `${BASE_URL}/api/summarize`,
      body: { text: testDocText, mode: "summary" },
      expectedPages: 1,
      mode: "summary",
    },
    {
      name: "Test 3: Action Items Extraction (/api/summarize, mode: action_items)",
      url: `${BASE_URL}/api/summarize`,
      body: { text: testDocText, mode: "action_items" },
      expectedPages: 1,
      mode: "action_items",
    },
    {
      name: "Test 4: Key Risks Analysis (/api/summarize, mode: key_risks)",
      url: `${BASE_URL}/api/summarize`,
      body: { text: testDocText, mode: "key_risks" },
      expectedPages: 1,
      mode: "key_risks",
    },
  ];

  for (const tc of testCases) {
    console.log(`\n-------------------------------------------------------------------------`);
    console.log(`RUNNING: ${tc.name}`);
    console.log(`-------------------------------------------------------------------------`);

    const init: RequestInit = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(tc.body),
    };

    console.log(`Step a: Sending unpaid request to ${tc.url}...`);
    const unpaidRes = await fetch(tc.url, init);
    console.log(`Step a Result: HTTP ${unpaidRes.status} ${unpaidRes.statusText}`);
    const unpaidBody = await unpaidRes.json();
    console.log(`Step a Quoted Response:`, JSON.stringify(unpaidBody, null, 2));

    if (unpaidRes.status !== 402) {
      console.error(`❌ CRITICAL FAILURE: Expected 402 Payment Required, got ${unpaidRes.status}`);
      process.exit(1);
    }

    console.log(`\nStep b & c: Constructing, signing real Algorand payment tx & submitting via x402 client...`);
    let result;
    try {
      result = await payAndFetch(tc.url, init, signer, {
        expectedPages: tc.expectedPages,
        onPhase: (phase) => console.log(`  [x402 Phase Progress]: ${phase}`),
      });
    } catch (payErr) {
      console.error(`❌ CRITICAL FAILURE during payment execution:`, payErr);
      process.exit(1);
    }

    if (!result.ok) {
      console.error(`❌ PAYMENT OR SETTLEMENT FAILED:`, result.failureCode, result.error);
      console.error(`Unpaid Response:`, result.unpaid);
      console.error(`Paid Response:`, result.paid);
      process.exit(1);
    }

    const resData = result.result as Record<string, unknown>;
    const realTxId = String(resData["txId"] ?? "");
    const explorer = String(resData["explorer"] ?? "");

    console.log(`\nStep d: ✅ Payment Settled & Summary Received Successfully!`);
    console.log(`REAL TX ID: ${realTxId}`);
    console.log(`EXPLORER: ${explorer}`);
    console.log(`Payer: ${resData["payer"]}`);
    console.log(`Price Paid: ${resData["pricePaid"]} (${resData["amountPaid"]})`);
    console.log(`Mode: ${resData["mode"]}`);
    console.log(`Summary Output:\n${resData["summary"]}`);

    realTxIds.push({
      test: tc.name,
      route: tc.url,
      mode: tc.mode,
      txId: realTxId,
      explorer,
    });

    console.log(`\nStep e: Fetching updated /api/metrics...`);
    const metricsCurrent = await fetchMetrics();
    console.log(JSON.stringify(metricsCurrent, null, 2));
  }

  console.log("\n=========================================================================");
  console.log("FINAL REAL TRANSACTION SUMMARY");
  console.log("=========================================================================");
  for (const item of realTxIds) {
    console.log(`- ${item.test}`);
    console.log(`  REAL TX ID: ${item.txId}`);
    console.log(`  EXPLORER:   ${item.explorer}\n`);
  }

  console.log("[METRICS AFTER ALL REAL PAYMENTS]:");
  const metricsAfter = await fetchMetrics();
  console.log(JSON.stringify(metricsAfter, null, 2));
}

runRealE2ETests().catch((err) => {
  console.error("FATAL ERROR IN REAL E2E TEST SUITE:", err);
  process.exit(1);
});
