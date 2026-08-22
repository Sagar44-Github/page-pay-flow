/**
 * Standalone Real E2E Test Suite for Tamper-Evident Audit Trail.
 *
 * Verifies that:
 *   1. GET /api/audit/verify is strictly READ-ONLY and ignores query parameters like ?tamperIndex=0.
 *   2. Controlled tampering via gated test helper (ALLOW_AUDIT_TAMPER_TESTING=true) is accurately
 *      detected by GET /api/audit/verify (with zero query params), returning valid: false and brokenAt = 0.
 *   3. Restoring original log value returns GET /api/audit/verify to valid: true state.
 */

const BASE_URL = "http://localhost:8080";

async function verifyPublicChain(): Promise<{ valid: boolean; totalEntries: number; brokenAt: number | null; verifiedAt: string; details?: string }> {
  const res = await fetch(`${BASE_URL}/api/audit/verify`);
  if (!res.ok) throw new Error(`GET /api/audit/verify failed: ${res.status}`);
  return await res.json();
}

async function triggerTestTamper(action: "tamper" | "restore", index = 0) {
  const url = `${BASE_URL}/api/audit/test-tamper?action=${action}&index=${index}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-audit-test-secret": "audit_test_secret_key_2026" },
  });
  return await res.json();
}

async function runAuditTestCases() {
  console.log("=========================================================================");
  console.log("TAMPER-EVIDENT AUDIT TRAIL — SECURITY FIX VERIFICATION TEST SUITE");
  console.log("=========================================================================\n");

  const testDoc = "SECURITY FIX TEST DOCUMENT: Read-only audit verification test.";

  // -----------------------------------------------------------------------
  // CHECK 1 — Public GET /api/audit/verify ignores query parameters entirely
  // -----------------------------------------------------------------------
  console.log("-------------------------------------------------------------------------");
  console.log("CHECK 1: Verifying Public GET /api/audit/verify is Read-Only (Ignores ?tamperIndex)");
  console.log("-------------------------------------------------------------------------");

  console.log("Attempting GET /api/audit/verify?tamperIndex=0 on public endpoint...");
  const publicParamRes = await fetch(`${BASE_URL}/api/audit/verify?tamperIndex=0`);
  const publicParamJson = await publicParamRes.json();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(publicParamJson, null, 2)}`);

  if (publicParamJson.valid === true && publicParamJson.brokenAt === null) {
    console.log(`\n✅ CHECK 1 PASSED: Query param ?tamperIndex=0 had ZERO effect on public endpoint! valid = true.`);
  } else {
    console.error(`❌ CHECK 1 FAILED: Public endpoint allowed modification via query param:`, publicParamJson);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 1 — Chain Builds Correctly on Real Activity
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("TEST 1: Executing 2 Real Requests & Verifying Audit Chain");
  console.log("-------------------------------------------------------------------------");

  console.log("Executing Request #1 (POST /api/price)...");
  await fetch(`${BASE_URL}/api/price`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: testDoc }),
  });

  console.log("Executing Request #2 (POST /api/summarize - 402 Quote)...");
  await fetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: testDoc, mode: "key_risks" }),
  });

  console.log("\nCalling GET /api/audit/verify (with NO query params)...");
  const audit1 = await verifyPublicChain();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(audit1, null, 2)}`);

  if (audit1.valid && audit1.brokenAt === null) {
    console.log(`\n✅ TEST 1 PASSED: Audit chain verified successfully! totalEntries = ${audit1.totalEntries}, valid = true, brokenAt = null`);
  } else {
    console.error(`❌ TEST 1 FAILED: Expected valid: true, got:`, audit1);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 2 — Controlled Tampering via Gated Helper & Detection via Read-Only Endpoint
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("TEST 2: Controlled Tampering of Entry #0 & Detection via Read-Only Endpoint");
  console.log("-------------------------------------------------------------------------");
  console.log("Altering 'price' field of Entry #0 via gated test helper...");
  const tamperRes = await triggerTestTamper("tamper", 0);
  console.log(`Tamper Test Helper Output:`, tamperRes);

  console.log("\nCalling GET /api/audit/verify (Clean Read-Only Endpoint with NO params)...");
  const audit2 = await verifyPublicChain();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(audit2, null, 2)}`);

  if (!audit2.valid && audit2.brokenAt === 0) {
    console.log(`\n🛡️ TEST 2 PASSED: Tamper detection accurately caught corruption and pinpointed brokenAt = 0!`);
    console.log(`Detection Output: brokenAt = ${audit2.brokenAt}, details = "${audit2.details}"`);
  } else {
    console.error(`❌ TEST 2 FAILED: Expected valid: false and brokenAt: 0, got:`, audit2);
    process.exit(1);
  }

  // -----------------------------------------------------------------------
  // TEST 3 — Verify Restoration Restores Valid Chain
  // -----------------------------------------------------------------------
  console.log("\n-------------------------------------------------------------------------");
  console.log("TEST 3: Restoring Original Value of Entry #0 & Re-verifying Read-Only Chain");
  console.log("-------------------------------------------------------------------------");
  console.log("Restoring original value of Entry #0...");
  const restoreRes = await triggerTestTamper("restore", 0);
  console.log(`Restore Test Helper Output:`, restoreRes);

  console.log("\nCalling GET /api/audit/verify (Clean Read-Only Endpoint with NO params)...");
  const audit3 = await verifyPublicChain();
  console.log(`RAW JSON RESPONSE:\n${JSON.stringify(audit3, null, 2)}`);

  if (audit3.valid && audit3.brokenAt === null) {
    console.log(`\n✅ TEST 3 PASSED: Chain integrity successfully restored! valid = true, brokenAt = null`);
  } else {
    console.error(`❌ TEST 3 FAILED: Expected valid: true after restore, got:`, audit3);
    process.exit(1);
  }

  console.log("\n=========================================================================");
  console.log("TAMPER-EVIDENT AUDIT TRAIL — SECURITY FIX TEST RESULTS");
  console.log("=========================================================================");
  console.log(`CHECK 1 (Public Endpoint Read-Only Check): PASSED ✅ - ?tamperIndex=0 ignored`);
  console.log(`TEST 1 (Chain Verification on Real Activity): PASSED ✅ - totalEntries: ${audit1.totalEntries}, valid: true`);
  console.log(`TEST 2 (Tamper Detection at Entry #0): PASSED 🛡️ - brokenAt: 0, valid: false`);
  console.log(`TEST 3 (Restoration Verification): PASSED ✅ - totalEntries: ${audit3.totalEntries}, valid: true`);
}

runAuditTestCases().catch((err) => {
  console.error("FATAL ERROR IN AUDIT TEST SUITE:", err);
  process.exit(1);
});
