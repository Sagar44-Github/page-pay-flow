/**
 * GET /api/audit/verify — Cryptographic Tamper-Evident Audit Trail Verification Endpoint.
 *
 * Walks the log chain from genesis ("0".repeat(64)) to head, verifying SHA-256 hash continuity
 * across all entries. Returns { valid: boolean, totalEntries: number, brokenAt: number | null }.
 */
import { createFileRoute } from "@tanstack/react-router";
import { verifyAuditChain, _getInternalEntries } from "@/lib/services/pagepayLogger.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}

export function handleVerifyAuditChain({ request }: { request: Request }): Response {
  // Allow test endpoint to trigger controlled tamper for automated testing
  const url = new URL(request.url);
  const tamperIndexStr = url.searchParams.get("tamperIndex");
  const restoreStr = url.searchParams.get("restore");

  const internalEntries = _getInternalEntries();

  if (tamperIndexStr !== null) {
    const idx = Number(tamperIndexStr);
    if (idx >= 0 && idx < internalEntries.length) {
      // Store original for restoration
      (globalThis as unknown as Record<string, unknown>)["_auditTamperedOriginal"] = {
        index: idx,
        price: internalEntries[idx].price,
      };
      // Controlled edit: modify logged price field of specified entry
      internalEntries[idx].price = "$999.99";
    }
  } else if (restoreStr === "true") {
    const orig = (globalThis as unknown as Record<string, unknown>)["_auditTamperedOriginal"] as
      | { index: number; price: string }
      | undefined;
    if (orig && orig.index >= 0 && orig.index < internalEntries.length) {
      internalEntries[orig.index].price = orig.price;
      delete (globalThis as unknown as Record<string, unknown>)["_auditTamperedOriginal"];
    }
  }

  const auditResult = verifyAuditChain();
  return json(auditResult);
}

export const Route = createFileRoute("/api/audit/verify")({
  server: {
    handlers: {
      GET: handleVerifyAuditChain,
    },
  },
});
