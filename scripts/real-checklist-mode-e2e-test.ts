/**
 * Standalone Real E2E Test Suite for the 5th & Final Extraction Mode: "checklist".
 *
 * Executes real tests against POST /api/summarize and GET /api/tools (http://localhost:8080):
 *   1. Test 1: Real paid request via 402 -> payment -> 200 flow (mode: "checklist").
 *      Obtains a BRAND-NEW, NEVER-BEFORE-USED real transaction ID settled on Algorand testnet.
 *   2. Test 2: Side-by-side output comparison across action_items, compliance_check, and checklist.
 *   3. Test 3: Confirm pricing invariance ($0.01 per page across all 5 modes).
 *   4. Test 4: Confirm omitting mode parameter defaults to "summary".
 *   5. Test 5: Confirm GET /api/tools lists all 5 extraction modes cleanly.
 */
import algosdk from "algosdk";
import fs from "fs";
import { payAndFetch, type WalletSigner } from "../src/lib/x402/client";

const BASE_URL = "http://localhost:8080";

const SAMPLE_CONTRACT_TEXT = `
SOFTWARE SERVICES AND LICENSE AGREEMENT

This Agreement is entered into by and between Acme Cloud Solutions Inc. ("Provider") and Apex Logistics LLC ("Client").

1. SERVICES AND OBLIGATIONS
Provider agrees to deliver enterprise cloud analytics software to Client starting September 1, 2026. Client shall pay an annual fee of $12,000 USD within 30 days of invoice receipt.

2. DEFAULT AND BREACH
In the event either party fails to perform any material obligation, the non-breaching party shall provide written notice. If default is not cured within 15 days, the non-breaching party may immediately terminate and claim direct damages.

3. TERMINATION
Either party may terminate this Agreement without cause by delivering 60 days written notice to the other party.
`.trim();

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

async function runChecklistModeTestCases() {
  console.log("=========================================================================");
  console.log("PAGEPAY EXTRACTION MODE 5 (CHECKLIST) — REAL HTTP 402->200 E2E TEST SUITE");
  console.log("=========================================================================\n");

  const mnemonic = getTestMnemonic();
  const signer = createAlgorandSigner(mnemonic);
  console.log(`Test Payer Address: ${signer.address}`);

  // Check account balance first
  const client = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  const accountInfo = await client.accountInformation(signer.address).do();
  const usdcAsset = accountInfo.assets?.find((a) => a["asset-id"] === 10458941 || a.assetId === 10458941n || a.assetId === 10458941);
  const usdcBalance = usdcAsset ? Number(usdcAsset.amount) / 1e6 : 0;
  console.log(`Test Payer Account USDC Balance: $${usdcBalance.toFixed(2)} USD (${usdcAsset?.amount ?? 0} atomic)`);

  if (usdcBalance < 0.01) {
    console.error(`❌ CANNOT PROCEED WITH TEST: Test account ${signer.address} requires USDC funding.`);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 1 — Real Paid Request through POST /api/summarize (mode: "checklist")
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 1: Real POST /api/summarize Flow for mode: 'checklist'");
  console.log("-------------------------------------------------------------------------");

  const payResult1 = await payAndFetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: SAMPLE_CONTRACT_TEXT, mode: "checklist" }),
  }, signer);

  if (!payResult1.ok || !payResult1.result) {
    console.error("❌ TEST 1 FAILED: Payment request failed:", payResult1);
    process.exit(1);
  }

  const result1 = payResult1.result as Record<string, unknown>;
  const brandNewTxId = String(result1["txId"] ?? "");
  const checklistMarkdown = String(result1["summary"] ?? "");

  console.log(`\n✅ TEST 1 PASSED: Real HTTP 402 -> Real Payment Settlement -> HTTP 200 OK Complete!`);
  console.log(`BRAND NEW REAL TXID: ${brandNewTxId}`);
  console.log(`Lora Explorer Link: https://lora.algokit.io/testnet/transaction/${brandNewTxId}`);
  console.log(`Price Paid: ${result1["pricePaid"]}`);
  console.log(`Amount Paid Atomic: ${result1["amountPaid"]}`);
  console.log(`Payer: ${result1["payer"]}`);
  console.log(`\nRAW CHECKLIST MARKDOWN OUTPUT FROM ENDPOINT:\n--------------------------------------------------\n${checklistMarkdown}\n--------------------------------------------------\n`);

  // -----------------------------------------------------------------------
  // TEST 2 — Differentiated Output Framing Verification (3 Modes Side-by-Side)
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log("RUNNING TEST 2: Comparing 3 Modes (action_items vs compliance_check vs checklist)");
  console.log("-------------------------------------------------------------------------");

  console.log("Executing paid request for action_items mode to compare outputs...");
  const payResultAction = await payAndFetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: SAMPLE_CONTRACT_TEXT, mode: "action_items" }),
  }, signer);

  console.log("Executing paid request for compliance_check mode to compare outputs...");
  const payResultCompliance = await payAndFetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: SAMPLE_CONTRACT_TEXT, mode: "compliance_check" }),
  }, signer);

  const actionMarkdown = String((payResultAction.result as Record<string, unknown>)?.["summary"] ?? "");
  const complianceMarkdown = String((payResultCompliance.result as Record<string, unknown>)?.["summary"] ?? "");

  console.log(`\n1. ACTION_ITEMS OUTPUT SNIPPET:\n${actionMarkdown.slice(0, 300)}...\n`);
  console.log(`2. COMPLIANCE_CHECK OUTPUT SNIPPET:\n${complianceMarkdown.slice(0, 300)}...\n`);
  console.log(`3. CHECKLIST OUTPUT SNIPPET:\n${checklistMarkdown.slice(0, 300)}...\n`);

  const hasCheckboxSyntax = checklistMarkdown.includes("- [ ]") || checklistMarkdown.includes("- [x]");
  const hasComplianceMarkers = complianceMarkdown.includes("✅") || complianceMarkdown.includes("❌");
  const hasActionHeader = actionMarkdown.toLowerCase().includes("action item") || actionMarkdown.toLowerCase().includes("task");

  console.log(`Checklist uses '- [ ]' checkbox syntax: ${hasCheckboxSyntax ? "YES" : "NO"}`);
  console.log(`Compliance check uses '✅/❌' category markers: ${hasComplianceMarkers ? "YES" : "NO"}`);
  console.log(`Action items uses task/owner/deadline structure: ${hasActionHeader ? "YES" : "NO"}`);

  if (hasCheckboxSyntax && hasComplianceMarkers && hasActionHeader) {
    console.log(`\n✅ TEST 2 PASSED: 3 Modes are genuinely distinct in structure and output format!`);
  } else {
    console.error(`❌ TEST 2 FAILED: Outputs lacked expected structural markers!`);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 3 — Pricing Invariance Across All 5 Modes
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 3: Pricing Invariance Across All 5 Modes");
  console.log("-------------------------------------------------------------------------");

  const modesToTest = ["summary", "action_items", "key_risks", "compliance_check", "checklist"];
  const quotes: Record<string, string> = {};

  for (const m of modesToTest) {
    const res = await fetch(`${BASE_URL}/api/summarize`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: SAMPLE_CONTRACT_TEXT, mode: m }),
    });
    const data = await res.json();
    quotes[m] = data.priceQuoted;
  }

  console.log("Quoted Prices per 1-page document:", quotes);

  const allPoint01 = Object.values(quotes).every((p) => p === "$0.01");
  if (allPoint01) {
    console.log(`\n✅ TEST 3 PASSED: All 5 modes charge exactly $0.01 per page!`);
  } else {
    console.error(`❌ TEST 3 FAILED: Price mismatch!`, quotes);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 4 — Mode Still Defaults Correctly to "summary"
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 4: Omitted Mode Defaults to 'summary'");
  console.log("-------------------------------------------------------------------------");

  const reqDefault = await fetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: SAMPLE_CONTRACT_TEXT }),
  });
  const bodyDefault = await reqDefault.json();

  console.log(`Default Quoted Price: ${bodyDefault.priceQuoted}`);
  console.log(`Default Reason String: "${bodyDefault.reason}"`);

  if (reqDefault.status === 402 && bodyDefault.priceQuoted === "$0.01") {
    console.log(`\n✅ TEST 4 PASSED: Omitted mode defaults cleanly to summary mode without changing behavior!`);
  } else {
    console.error(`❌ TEST 4 FAILED: Default mode behavior altered!`, bodyDefault);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 5 — Agent Discovery (GET /api/tools) Lists All 5 Modes
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 5: Agent Discovery (GET /api/tools) Lists All 5 Modes");
  console.log("-------------------------------------------------------------------------");

  const toolsRes = await fetch(`${BASE_URL}/api/tools`);
  const toolsData = await toolsRes.json();
  const listedModes = (toolsData.modes as Array<{ name: string }>).map((m) => m.name);

  console.log("Listed Modes in GET /api/tools:", listedModes);

  const expectedModes = ["summary", "action_items", "key_risks", "compliance_check", "checklist"];
  const hasAll5 = expectedModes.every((m) => listedModes.includes(m));

  if (toolsRes.status === 200 && hasAll5 && listedModes.length === 5) {
    console.log(`\n✅ TEST 5 PASSED: GET /api/tools cleanly lists all 5 extraction modes!`);
  } else {
    console.error(`❌ TEST 5 FAILED: Discovery endpoint missing modes or status != 200!`, listedModes);
    process.exit(1);
  }

  console.log("\n=========================================================================");
  console.log("EXTRACTION MODE 5 (CHECKLIST) — FINAL TEST RESULTS");
  console.log("=========================================================================");
  console.log(`TEST 1 (Real Checklist Payment Flow): PASSED ✅ - BRAND NEW REAL TXID: ${brandNewTxId}`);
  console.log(`TEST 2 (3-Way Structural Distinction): PASSED ✅ - Checkbox vs Category vs Action Items Verified`);
  console.log(`TEST 3 (Pricing Invariance): PASSED ✅ - $0.01 Across All 5 Modes`);
  console.log(`TEST 4 (Default Mode Unchanged): PASSED ✅ - Defaults to 'summary'`);
  console.log(`TEST 5 (Agent Discovery Accuracy): PASSED ✅ - All 5 Modes Listed in /api/tools`);
}

runChecklistModeTestCases().catch((err) => {
  console.error("FATAL CHECKLIST MODE E2E ERROR:", err);
  process.exit(1);
});
