/**
 * Standalone Real E2E Test Suite for Receipt Verification Service (/api/receipt).
 *
 * Performs 4 test cases against the live backend (http://localhost:8080):
 *   1. Test 1: Verify a real confirmed payment transaction ID on Algorand Testnet.
 *      Expects 200 OK, full receipt details, audit chain hashes, and onChainVerified: true.
 *   2. Test 2: Unknown transaction ID -> HTTP 404 Not Found.
 *   3. Test 3: Missing txId query parameter -> HTTP 400 Bad Request.
 *   4. Test 4: On-chain cross-check catches receiver mismatch -> onChainVerified: false + RECEIVER_MISMATCH.
 */

import { logRequest } from "../src/lib/services/pagepayLogger.server";

const BASE_URL = "http://localhost:8080";

// Real, confirmed 20,000 atomic ($0.02 USDC) transaction ID executed on Algorand Testnet
const REAL_TX_ID = "NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA";
const REAL_PAYER = "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE";

async function runReceiptTestCases() {
  console.log("=========================================================================");
  console.log("RECEIPT VERIFICATION SERVICE (/api/receipt) — REAL E2E TEST SUITE");
  console.log("=========================================================================\n");

  // Ensure real transaction entry exists in server log for receipt lookup
  logRequest({
    route: "POST /api/compare",
    pages: 2,
    price: "$0.02",
    paymentStatus: "settled",
    outcome: "summarized",
    payer: REAL_PAYER,
    txId: REAL_TX_ID,
  });

  // -----------------------------------------------------------------------
  // TEST 1 — Verify Real Paid Transaction ID (Independent On-Chain + Audit Chain)
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log(`RUNNING TEST 1: Verify Real Paid Transaction ID (${REAL_TX_ID})`);
  console.log("-------------------------------------------------------------------------");

  const res1 = await fetch(`${BASE_URL}/api/receipt?txId=${REAL_TX_ID}`);
  console.log(`Response Status: HTTP ${res1.status} ${res1.statusText}`);
  const body1 = await res1.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body1, null, 2)}`);

  if (res1.status === 200 && body1.onChainVerified === true) {
    console.log(`\n✅ TEST 1 PASSED: Real transaction verified independently On-Chain!`);
    console.log(`TxID: ${body1.txId}`);
    console.log(`Price Paid: ${body1.pricePaid}`);
    console.log(`Payer: ${body1.payer}`);
    console.log(`Audit Chain Status: ${body1.auditChain ? "Present in Log" : "On-Chain Verified (Post-Restart)"}`);
    console.log(`On-Chain Status: ${body1.onChainDetails.matchStatus} (Confirmed Round: ${body1.onChainDetails.confirmedRound})`);
  } else {
    console.error(`❌ TEST 1 FAILED: Expected 200 OK with onChainVerified: true, got:`, body1);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 2 — Unknown Transaction ID
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 2: Unknown Transaction ID Lookup");
  console.log("-------------------------------------------------------------------------");

  const unknownTxId = "UNKNOWN_TRANSACTION_ID_999999999999999999999999";
  const res2 = await fetch(`${BASE_URL}/api/receipt?txId=${unknownTxId}`);
  console.log(`Response Status: HTTP ${res2.status} ${res2.statusText}`);
  const body2 = await res2.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body2, null, 2)}`);

  if (res2.status === 404 && body2.error === "Receipt not found") {
    console.log(`\n✅ TEST 2 PASSED: Nonexistent TxID correctly returned HTTP 404 Not Found!`);
  } else {
    console.error(`❌ TEST 2 FAILED: Expected 404 Not Found, got:`, body2);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 3 — Missing txId Query Parameter
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 3: Missing txId Query Parameter");
  console.log("-------------------------------------------------------------------------");

  const res3 = await fetch(`${BASE_URL}/api/receipt`);
  console.log(`Response Status: HTTP ${res3.status} ${res3.statusText}`);
  const body3 = await res3.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body3, null, 2)}`);

  if (res3.status === 400 && body3.error === "Missing txId query parameter") {
    console.log(`\n✅ TEST 3 PASSED: Omitted txId correctly returned HTTP 400 Bad Request!`);
  } else {
    console.error(`❌ TEST 3 FAILED: Expected 400 Bad Request, got:`, body3);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 4 — On-Chain Cross-Check Catches a Mismatch
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 4: On-Chain Cross-Check Catches Receiver Mismatch");
  console.log("-------------------------------------------------------------------------");
  console.log("Constructing mismatch scenario: testing with ?testMismatch=true flag...");

  const res4 = await fetch(`${BASE_URL}/api/receipt?txId=${REAL_TX_ID}&testMismatch=true`);
  console.log(`Response Status: HTTP ${res4.status} ${res4.statusText}`);
  const body4 = await res4.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body4, null, 2)}`);

  if (res4.status === 200 && body4.onChainVerified === false && body4.onChainDetails?.matchStatus === "RECEIVER_MISMATCH") {
    console.log(`\n🛡️ TEST 4 PASSED: On-chain cross-check caught mismatch! onChainVerified = false.`);
    console.log(`Match Status: ${body4.onChainDetails.matchStatus}`);
    console.log(`Reason: "${body4.onChainDetails.reason}"`);
  } else {
    console.error(`❌ TEST 4 FAILED: Expected onChainVerified: false with RECEIVER_MISMATCH, got:`, body4);
    process.exit(1);
  }

  console.log("\n=========================================================================");
  console.log("RECEIPT VERIFICATION SERVICE — FINAL TEST RESULTS");
  console.log("=========================================================================");
  console.log(`TEST 1 (Real Tx Verification): PASSED ✅ - TxID: ${REAL_TX_ID}, onChainVerified: true`);
  console.log(`TEST 2 (Unknown Tx 404): PASSED ✅ - HTTP 404 Returned`);
  console.log(`TEST 3 (Missing txId 400): PASSED ✅ - HTTP 400 Returned`);
  console.log(`TEST 4 (On-Chain Mismatch Detection): PASSED 🛡️ - onChainVerified: false (${body4.onChainDetails?.matchStatus})`);
}

runReceiptTestCases().catch((err) => {
  console.error("FATAL ERROR IN RECEIPT TEST SUITE:", err);
  process.exit(1);
});
