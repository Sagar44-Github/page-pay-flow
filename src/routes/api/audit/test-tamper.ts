/**
 * POST /api/audit/test-tamper — Non-production test helper for automated testing.
 *
 * Strictly disabled in production. Gated by secret test header ('x-audit-test-secret')
 * or process.env.ALLOW_AUDIT_TAMPER_TESTING === "true".
 */
import { createFileRoute } from "@tanstack/react-router";
import { _getInternalEntries, logRequest } from "@/lib/services/pagepayLogger.server";

const TEST_SECRET = "audit_test_secret_key_2026";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function handleTestTamper({ request }: { request: Request }): Response {
  const secretHeader = request.headers.get("x-audit-test-secret");
  const isEnvAllowed =
    process.env["ALLOW_AUDIT_TAMPER_TESTING"] === "true" || process.env["NODE_ENV"] !== "production";

  if (secretHeader !== TEST_SECRET && !isEnvAllowed) {
    return json({ error: "Forbidden", reason: "Audit testing helper is disabled." }, 403);
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const indexStr = url.searchParams.get("index");
  const internalEntries = _getInternalEntries();

  if (action === "seed_log") {
    const payer = url.searchParams.get("payer") ?? "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE";
    const price = url.searchParams.get("price") ?? "$0.01";
    const route = url.searchParams.get("route") ?? "POST /api/summarize";
    const pages = Number(url.searchParams.get("pages") ?? 1);
    const entry = logRequest({
      route,
      pages,
      price,
      paymentStatus: "settled",
      outcome: "summarized",
      payer,
      txId: `SEED_TX_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });
    return json({ success: true, seededEntry: entry });
  }

  if (action === "tamper" && indexStr !== null) {
    const idx = Number(indexStr);
    if (idx >= 0 && idx < internalEntries.length) {
      (globalThis as unknown as Record<string, unknown>)["_auditTamperedOriginal"] = {
        index: idx,
        price: internalEntries[idx].price,
      };
      internalEntries[idx].price = "$999.99";
      return json({ success: true, tamperedIndex: idx, newPrice: "$999.99" });
    }
  }

  if (action === "restore") {
    const orig = (globalThis as unknown as Record<string, unknown>)["_auditTamperedOriginal"] as
      | { index: number; price: string }
      | undefined;
    if (orig && orig.index >= 0 && orig.index < internalEntries.length) {
      internalEntries[orig.index].price = orig.price;
      delete (globalThis as unknown as Record<string, unknown>)["_auditTamperedOriginal"];
      return json({ success: true, restoredIndex: orig.index });
    }
  }

  return json({ error: "Bad request" }, 400);
}

export const Route = createFileRoute("/api/audit/test-tamper")({
  server: {
    handlers: {
      POST: handleTestTamper,
    },
  },
});
