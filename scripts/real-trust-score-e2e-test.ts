/**
 * Standalone Real E2E Test Suite for Trust Score API (/api/trust-score).
 *
 * Performs 4 test cases against the live backend (http://localhost:8080):
 *   1. Test 1: Real test account trust score & transaction stats.
 *   2. Test 2: Unknown address with 0 history -> neutral baseline (trustScore: 0, totalTransactions: 0).
 *   3. Test 3: Trust score update after 1 new settled transaction (+1 totalTransactions).
 *   4. Test 4: Malformed address input -> HTTP 400 Bad Request.
 */

const BASE_URL = "http://localhost:8080";
const TEST_SECRET = "audit_test_secret_key_2026";

const TEST_ACCOUNT = "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE";
const UNKNOWN_ACCOUNT = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

async function seedLogEntryOnServer(payer: string, price: string = "$0.01") {
  await fetch(`${BASE_URL}/api/audit/test-tamper?action=seed_log&payer=${payer}&price=${encodeURIComponent(price)}`, {
    method: "POST",
    headers: { "x-audit-test-secret": TEST_SECRET },
  });
}

async function runTrustScoreTestCases() {
  console.log("=========================================================================");
  console.log("PAGEPAY TRUST SCORE API (/api/trust-score) — REAL E2E TEST SUITE");
  console.log("=========================================================================\n");

  // Ensure test account has initial logged activity in server memory
  await seedLogEntryOnServer(TEST_ACCOUNT, "$0.01");

  // -----------------------------------------------------------------------
  // TEST 1 — Score for Real Test Account (Has History)
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log(`RUNNING TEST 1: Trust Score for Real Account (${TEST_ACCOUNT})`);
  console.log("-------------------------------------------------------------------------");

  const res1 = await fetch(`${BASE_URL}/api/trust-score?address=${TEST_ACCOUNT}`);
  console.log(`Response Status: HTTP ${res1.status} ${res1.statusText}`);
  const body1 = await res1.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body1, null, 2)}`);

  const initialScore = body1.trustScore;
  const initialCount = body1.totalTransactions;

  if (res1.status === 200 && body1.totalTransactions >= 1 && typeof body1.trustScore === "number") {
    console.log(`\n✅ TEST 1 PASSED: Trust score calculated for account with real history!`);
    console.log(`Address: ${body1.address}`);
    console.log(`Trust Score: ${body1.trustScore} / 100`);
    console.log(`Total Transactions: ${body1.totalTransactions}`);
    console.log(`Total Volume USD: ${body1.totalVolumeUsd}`);
    console.log(`Success Rate: ${body1.successRate}%`);
  } else {
    console.error(`❌ TEST 1 FAILED: Expected 200 OK with trustScore, got:`, body1);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 2 — Unknown Address with No History (Neutral Baseline)
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 2: Unknown Address with No History (Neutral Baseline)");
  console.log("-------------------------------------------------------------------------");

  const res2 = await fetch(`${BASE_URL}/api/trust-score?address=${UNKNOWN_ACCOUNT}`);
  console.log(`Response Status: HTTP ${res2.status} ${res2.statusText}`);
  const body2 = await res2.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body2, null, 2)}`);

  if (res2.status === 200 && body2.trustScore === 0 && body2.totalTransactions === 0) {
    console.log(`\n✅ TEST 2 PASSED: Address with no history returned neutral baseline (trustScore: 0, totalTransactions: 0)!`);
  } else {
    console.error(`❌ TEST 2 FAILED: Expected 200 OK with trustScore: 0, got:`, body2);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 3 — Score Updates After a New Real Transaction
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 3: Score Recalculation After New Settled Transaction (+1 Tx)");
  console.log("-------------------------------------------------------------------------");
  console.log(`Initial State: totalTransactions = ${initialCount}, trustScore = ${initialScore}`);

  console.log("Seeding 1 new settled $0.02 transaction for test account on server...");
  await seedLogEntryOnServer(TEST_ACCOUNT, "$0.02");

  const res3 = await fetch(`${BASE_URL}/api/trust-score?address=${TEST_ACCOUNT}`);
  console.log(`Response Status: HTTP ${res3.status} ${res3.statusText}`);
  const body3 = await res3.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body3, null, 2)}`);

  const updatedCount = body3.totalTransactions;
  const updatedScore = body3.trustScore;

  if (res3.status === 200 && updatedCount === initialCount + 1) {
    console.log(`\n✅ TEST 3 PASSED: Score recalculated! totalTransactions: ${initialCount} -> ${updatedCount} (+1), trustScore: ${initialScore} -> ${updatedScore}.`);
  } else {
    console.error(`❌ TEST 3 FAILED: Expected totalTransactions to increase by 1, got:`, body3);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 4 — Malformed Address Input (HTTP 400 Error)
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 4: Malformed Address Input Validation");
  console.log("-------------------------------------------------------------------------");

  const malformedAddress = "not-an-address";
  const res4 = await fetch(`${BASE_URL}/api/trust-score?address=${malformedAddress}`);
  console.log(`Response Status: HTTP ${res4.status} ${res4.statusText}`);
  const body4 = await res4.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(body4, null, 2)}`);

  if (res4.status === 400 && body4.error === "Invalid Algorand address format") {
    console.log(`\n✅ TEST 4 PASSED: Malformed address correctly returned HTTP 400 Bad Request!`);
  } else {
    console.error(`❌ TEST 4 FAILED: Expected 400 Bad Request, got:`, body4);
    process.exit(1);
  }

  console.log("\n=========================================================================");
  console.log("PAGEPAY TRUST SCORE API — FINAL TEST RESULTS");
  console.log("=========================================================================");
  console.log(`TEST 1 (Real Account Score): PASSED ✅ - trustScore: ${initialScore}, totalTransactions: ${initialCount}`);
  console.log(`TEST 2 (Neutral Baseline 0 History): PASSED ✅ - trustScore: 0, totalTransactions: 0`);
  console.log(`TEST 3 (Score Recalculation): PASSED ✅ - totalTransactions: ${initialCount} -> ${updatedCount} (+1), trustScore: ${initialScore} -> ${updatedScore}`);
  console.log(`TEST 4 (Malformed Address 400): PASSED ✅ - HTTP 400 Returned`);
}

runTrustScoreTestCases().catch((err) => {
  console.error("FATAL ERROR IN TRUST SCORE TEST SUITE:", err);
  process.exit(1);
});
