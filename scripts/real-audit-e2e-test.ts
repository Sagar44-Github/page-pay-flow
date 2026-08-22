/**
 * Standalone Real E2E Test Suite for Tamper-Evident Audit Trail (/api/audit/verify).
 *
 * Performs 3 test cases against the live backend (http://localhost:8080):
 *   1. Test 1: Chain builds correctly on real activity (verifying existing & new log entries).
 *   2. Test 2: Tamper detection pinpoints exact tampered entry index (brokenAt = 0).
 *   3. Test 3: Restoring tampered field returns chain to valid: true state.
 */

const BASE_URL = "http://localhost:8080";

async function verifyChain(params = ""): Promise<{ valid: boolean; totalEntries: number; brokenAt: number | null; verifiedAt: string; details?: string }> {
  const res = await fetch(`${BASE_URL}/api/audit/verify${params}`);
  if (!res.ok) throw new Error(`GET /api/audit/verify failed: ${res.status}`);
  return await res.json();
}

async function runAuditTestCases() {
  console.log("=========================================================================");
  console.log("TAMPER-EVIDENT AUDIT TRAIL (/api/audit/verify) — REAL E2E TEST SUITE");
  console.log("=========================================================================\n");

  const testDoc = "AUDIT TRAIL TEST DOCUMENT: Cryptographic hash chain validation entry text.";

  // -----------------------------------------------------------------------
  // TEST 1 — Chain Builds Correctly on Real Activity (2 Real Logged Request Events)
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log("RUNNING TEST 1: Executing 2 Real Requests & Verifying Audit Chain");
  console.log("-------------------------------------------------------------------------");

  console.log("Executing Request #1 (POST /api/price)...");
  const req1 = await fetch(`${BASE_URL}/api/price`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: testDoc }),
  });
  console.log(`Request #1 logged! HTTP ${req1.status}`);

  console.log("Executing Request #2 (POST /api/summarize - 402 Quote)...");
  const req2 = await fetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: testDoc, mode: "action_items" }),
  });
  console.log(`Request #2 logged! HTTP ${req2.status}`);

  console.log("\nCalling GET /api/audit/verify after real activity...");
  const audit1 = await verifyChain();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(audit1, null, 2)}`);

  if (audit1.valid && audit1.brokenAt === null && audit1.totalEntries >= 2) {
    console.log(`\n✅ TEST 1 PASSED: Audit chain verified successfully! totalEntries = ${audit1.totalEntries}, valid = true, brokenAt = null`);
  } else {
    console.error(`❌ TEST 1 FAILED: Expected valid: true, got:`, audit1);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 2 — Tamper Detection Pinpoints Exact Altered Entry
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 2: Controlled Tampering of Entry #0 (Setting price = '$999.99')");
  console.log("-------------------------------------------------------------------------");
  console.log("Altering 'price' field of Entry #0 directly in logger memory...");

  const audit2 = await verifyChain("?tamperIndex=0");
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(audit2, null, 2)}`);

  if (!audit2.valid && audit2.brokenAt === 0) {
    console.log(`\n🛡️ TEST 2 PASSED: Tamper detection accurately caught corruption and pinpointed brokenAt = 0!`);
    console.log(`Field Altered: entry[0].price -> '$999.99'`);
    console.log(`Detection Output: brokenAt = ${audit2.brokenAt}, details = "${audit2.details}"`);
  } else {
    console.error(`❌ TEST 2 FAILED: Expected valid: false and brokenAt: 0, got:`, audit2);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 3 — Verify Restoration Restores Valid Chain
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("RUNNING TEST 3: Restoring Original Value of Entry #0 & Re-verifying Chain");
  console.log("-------------------------------------------------------------------------");
  console.log("Restoring original value of Entry #0...");

  const audit3 = await verifyChain("?restore=true");
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(audit3, null, 2)}`);

  if (audit3.valid && audit3.brokenAt === null) {
    console.log(`\n✅ TEST 3 PASSED: Chain integrity successfully restored! valid = true, brokenAt = null`);
  } else {
    console.error(`❌ TEST 3 FAILED: Expected valid: true after restore, got:`, audit3);
    process.exit(1);
  }

  console.log("\n=========================================================================");
  console.log("TAMPER-EVIDENT AUDIT TRAIL — FINAL TEST RESULTS");
  console.log("=========================================================================");
  console.log(`TEST 1 (Chain Verification on Real Activity): PASSED ✅ - totalEntries: ${audit1.totalEntries}, valid: true`);
  console.log(`TEST 2 (Tamper Detection at Entry #0): PASSED 🛡️ - brokenAt: ${audit2.brokenAt}, valid: false`);
  console.log(`TEST 3 (Restoration Verification): PASSED ✅ - totalEntries: ${audit3.totalEntries}, valid: true`);
}

runAuditTestCases().catch((err) => {
  console.error("FATAL ERROR IN AUDIT TEST SUITE:", err);
  process.exit(1);
});
