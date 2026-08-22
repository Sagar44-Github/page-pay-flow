/**
 * GET /api/audit/verify — Cryptographic Tamper-Evident Audit Trail Verification Endpoint.
 *
 * Strictly READ-ONLY in all environments. Walks the log chain from genesis ("0".repeat(64))
 * to head, verifying SHA-256 hash continuity across all entries.
 * Ignores all query parameters and input payloads — never modifies log data.
 */
import { createFileRoute } from "@tanstack/react-router";
import { verifyAuditChain } from "@/lib/services/pagepayLogger.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}

export function handleVerifyAuditChain(): Response {
  // Strictly read-only chain verification — accepts NO write/mutation parameters
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
