/**
 * PagePay end-to-end API + page smoke test runner.
 * Usage: node scripts/e2e-test.mjs [baseUrl]
 */
import { randomBytes } from "node:crypto";

const BASE = process.argv[2] ?? "http://localhost:8082";
const results = [];

function record(category, name, pass, details = {}) {
  results.push({ category, name, pass, ...details });
  const icon = pass ? "PASS" : "FAIL";
  console.log(`[${icon}] ${category} :: ${name}${details.status ? ` (${details.status})` : ""}${details.note ? ` — ${details.note}` : ""}`);
}

async function req(path, options = {}) {
  const url = `${BASE}${path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      ...options,
      headers: {
        accept: options.accept ?? "application/json, text/html",
        ...(options.headers ?? {}),
      },
    });
    const contentType = res.headers.get("content-type") ?? "";
    let body;
    if (contentType.includes("application/json")) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    return {
      ok: true,
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body,
      ms: Date.now() - started,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      ms: Date.now() - started,
    };
  }
}

function mockPaymentHeader(amount, model = "llama-3.1-8b-instant") {
  const PAY_TO = "PAGEPAYDEMOMERCHANTADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const NETWORK = "algorand:testnet-v1.0";
  const ASSET = "10458941";
  const nonce = randomBytes(16).toString("hex");
  const payload = {
    x402Version: 1,
    scheme: "exact",
    network: NETWORK,
    payload: {
      from: "MOCKPAYERADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      to: PAY_TO,
      asset: ASSET,
      amount,
      nonce,
      validUntil: Math.floor(Date.now() / 1000) + 300,
      signature: `mock-ed25519:${nonce.slice(0, 8)}${nonce.slice(-8)}`,
    },
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

const PAGES = [
  { path: "/", mustInclude: ["PagePay", "Start live demo"] },
  { path: "/demo", mustInclude: ["demo", "wallet"] },
  { path: "/x402-demo", mustInclude: ["x402", "Protocol"] },
  { path: "/pricing", mustInclude: ["Pricing", "per page"] },
  { path: "/product", mustInclude: ["Product", "Metered"] },
  { path: "/docs", mustInclude: ["Documentation", "x402"] },
  { path: "/docs/x402", mustInclude: ["x402", "402"] },
  { path: "/docs/algorand", mustInclude: ["Algorand", "USDC"] },
  { path: "/developers", mustInclude: ["API reference"] },
  { path: "/integrations", mustInclude: ["Integrations"] },
  { path: "/stats", mustInclude: ["Metrics", "402"] },
  { path: "/admin", mustInclude: ["admin", "passphrase"] },
  { path: "/receipt/MOCKTX1234567890ABCDEF", mustInclude: ["Receipt", "transaction"] },
];

async function testPages() {
  for (const page of PAGES) {
    const r = await req(page.path, { accept: "text/html" });
    if (!r.ok) {
      record("page", page.path, false, { note: r.error });
      continue;
    }
    const html = typeof r.body === "string" ? r.body.toLowerCase() : "";
    const missing = page.mustInclude.filter((s) => !html.includes(s.toLowerCase()));
    record("page", page.path, r.status === 200 && missing.length === 0, {
      status: r.status,
      ms: r.ms,
      note: missing.length ? `missing: ${missing.join(", ")}` : undefined,
    });
  }
}

async function testPriceApi() {
  const cases = [
    { path: "/api/price?pages=1", expectStatus: 200, check: (b) => b.pages === 1 && b.price },
    { path: "/api/price?pages=3", expectStatus: 200, check: (b) => b.pages === 3 },
    { path: "/api/price?words=1200", expectStatus: 200, check: (b) => b.pages >= 1 },
    { path: "/api/price?pages=0", expectStatus: 400, check: (b) => b.error },
    { path: "/api/price?pages=99999", expectStatus: 400, check: (b) => b.error },
    { path: "/api/price?words=-5", expectStatus: 400, check: (b) => b.error },
  ];
  for (const c of cases) {
    const r = await req(c.path);
    const pass =
      r.ok &&
      r.status === c.expectStatus &&
      (c.expectStatus !== 200 || c.check(r.body));
    record("api-price", c.path, pass, { status: r.status, ms: r.ms });
  }

  const postJson = await req("/api/price", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "Hello world. ".repeat(400) }),
  });
  record("api-price", "POST /api/price JSON text", postJson.ok && postJson.status === 200 && postJson.body.exact === true, {
    status: postJson.status,
    pages: postJson.body?.pages,
  });

  const postBad = await req("/api/price", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  record("api-price", "POST /api/price empty body", postBad.ok && postBad.status === 400, {
    status: postBad.status,
  });
}

async function testSummarizeApi() {
  const noPay = await req("/api/summarize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "Test document for x402 payment flow." }),
  });
  const is402 = noPay.status === 402;
  const hasPaymentRequired =
    is402 &&
    (noPay.headers["payment-required"] ||
      noPay.headers["x-payment-required"] ||
      JSON.stringify(noPay.body).includes("accepts"));
  record("api-summarize", "POST without payment → 402", is402, {
    status: noPay.status,
    hasPaymentRequired: !!hasPaymentRequired,
    note: noPay.status === 500 ? noPay.body?.reason ?? noPay.body?.error : undefined,
  });

  const badReq = await req("/api/summarize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  record("api-summarize", "POST empty body → 400", badReq.status === 400, { status: badReq.status });
}

async function testX402DemoApi() {
  const prompt = "Briefly explain HTTP 402 in one sentence.";

  const first = await req("/api/x402-demo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt, mode: "happy", model: "llama-3.1-8b-instant" }),
  });
  record("api-x402-demo", "POST no X-Payment → 402", first.status === 402, {
    status: first.status,
    hasAccepts: !!first.body?.accepts,
    xPaymentRequired: first.headers["x-payment-required"],
  });

  const amount8b = "10000";
  const happyHeader = mockPaymentHeader(amount8b);
  const happy = await req("/api/x402-demo", {
    method: "POST",
    headers: { "content-type": "application/json", "x-payment": happyHeader },
    body: JSON.stringify({ prompt, mode: "happy", model: "llama-3.1-8b-instant" }),
  });
  const happyPass = happy.status === 200 && happy.body?.unlocked === true && happy.body?.content;
  record("api-x402-demo", "POST happy path → 200 unlocked", happyPass, {
    status: happy.status,
    note: happy.status !== 200 ? happy.body?.reason ?? happy.body?.error : `tx=${happy.body?.settlement?.transaction}`,
  });

  const failed = await req("/api/x402-demo", {
    method: "POST",
    headers: { "content-type": "application/json", "x-payment": happyHeader },
    body: JSON.stringify({ prompt, mode: "failed", model: "llama-3.1-8b-instant" }),
  });
  record("api-x402-demo", "POST failed mode → 402", failed.status === 402, { status: failed.status });

  const timeout = await req("/api/x402-demo", {
    method: "POST",
    headers: { "content-type": "application/json", "x-payment": happyHeader },
    body: JSON.stringify({ prompt, mode: "timeout", model: "llama-3.1-8b-instant" }),
  });
  record("api-x402-demo", "POST timeout mode → 504", timeout.status === 504, {
    status: timeout.status,
    ms: timeout.ms,
  });

  const invalid = await req("/api/x402-demo", {
    method: "POST",
    headers: { "content-type": "application/json", "x-payment": "not-valid-base64-json!!!" },
    body: JSON.stringify({ prompt, mode: "invalid" }),
  });
  record("api-x402-demo", "POST invalid token → 400", invalid.status === 400, { status: invalid.status });

  const invalidMode = await req("/api/x402-demo", {
    method: "POST",
    headers: { "content-type": "application/json", "x-payment": happyHeader },
    body: JSON.stringify({ prompt, mode: "invalid", model: "llama-3.1-8b-instant" }),
  });
  record("api-x402-demo", "POST invalid mode → 400", invalidMode.status === 400, {
    status: invalidMode.status,
  });

  const amount70b = "50000";
  const header70b = mockPaymentHeader(amount70b);
  const model70b = await req("/api/x402-demo", {
    method: "POST",
    headers: { "content-type": "application/json", "x-payment": header70b },
    body: JSON.stringify({ prompt, mode: "happy", model: "llama-3.3-70b-versatile" }),
  });
  record("api-x402-demo", "POST 70B model pricing", model70b.status === 200, {
    status: model70b.status,
    model: model70b.body?.model,
  });
}

async function testGroqApi() {
  const empty = await req("/api/groq", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: "" }),
  });
  record("api-groq", "POST empty prompt → 400", empty.status === 400, { status: empty.status });

  const withPrompt = await req("/api/groq", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: "Say OK in one word." }),
  });
  const groqConfigured = withPrompt.status === 200 && withPrompt.body?.ok === true;
  const groqMissing = withPrompt.status === 500 && String(withPrompt.body?.reason ?? "").includes("GROQ_API_KEY");
  record("api-groq", "POST with prompt", groqConfigured || groqMissing, {
    status: withPrompt.status,
    note: groqConfigured ? "Groq key configured" : groqMissing ? "GROQ_API_KEY not set (expected in local dev)" : withPrompt.body?.reason,
  });
}

async function testLogsMetricsReceipt() {
  const logs = await req("/api/logs?limit=5");
  record("api-logs", "GET /api/logs", logs.status === 200 && Array.isArray(logs.body?.entries), {
    status: logs.status,
    count: logs.body?.count,
  });

  const logsBad = await req("/api/logs?limit=9999");
  record("api-logs", "GET /api/logs limit clamped", logsBad.status === 200 && logsBad.body?.entries?.length <= 200, {
    status: logsBad.status,
  });

  const metrics = await req("/api/metrics?limit=10");
  record("api-metrics", "GET /api/metrics", metrics.status === 200 && metrics.body?.metrics, {
    status: metrics.status,
    totalTx: metrics.body?.metrics?.totalTransactions,
  });

  const receiptMissing = await req("/api/receipt");
  record("api-receipt", "GET /api/receipt no txId → 400", receiptMissing.status === 400, {
    status: receiptMissing.status,
  });

  const receiptNotFound = await req("/api/receipt?txId=NOTFOUND123");
  record("api-receipt", "GET /api/receipt unknown txId → 404", receiptNotFound.status === 404, {
    status: receiptNotFound.status,
  });

  // If happy path produced a mock tx, try receipt lookup
  const happy = results.find((r) => r.name === "POST happy path → 200 unlocked" && r.note?.startsWith("tx="));
  if (happy?.note) {
    const txId = happy.note.replace("tx=", "");
    const receipt = await req(`/api/receipt?txId=${encodeURIComponent(txId)}`);
    record("api-receipt", "GET /api/receipt mock tx from demo", receipt.status === 200 || receipt.status === 404, {
      status: receipt.status,
      note: receipt.status === 404 ? "Mock tx not in pagepay logs (expected — demo uses separate log)" : "found",
    });
  }
}

async function testStaticAssets() {
  const icon = await req("/icon.svg", { accept: "image/svg+xml" });
  record("static", "/icon.svg", icon.status === 200 && String(icon.body).includes("PP"), {
    status: icon.status,
  });
}

async function main() {
  console.log(`\nPagePay E2E test run — ${BASE}\n${"=".repeat(50)}\n`);
  const health = await req("/api/price?pages=1");
  if (!health.ok) {
    console.error(`Cannot reach server at ${BASE}: ${health.error}`);
    process.exit(1);
  }

  await testPages();
  await testPriceApi();
  await testSummarizeApi();
  await testX402DemoApi();
  await testGroqApi();
  await testLogsMetricsReceipt();
  await testStaticAssets();

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${"=".repeat(50)}`);
  console.log(`TOTAL: ${results.length} | PASS: ${passed} | FAIL: ${failed}`);

  const outPath = new URL("../E2E_TEST_RESULTS.json", import.meta.url);
  const { writeFileSync } = await import("node:fs");
  writeFileSync(outPath, JSON.stringify({ base: BASE, at: new Date().toISOString(), passed, failed, results }, null, 2));
  console.log(`\nResults written to E2E_TEST_RESULTS.json`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
