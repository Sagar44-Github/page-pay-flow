/**
 * GET /api/receipt?txId=... — lookup a settled payment by transaction id.
 */
import { createFileRoute } from "@tanstack/react-router";

import { findLogByTxId } from "@/lib/services/pagepayLogger.server";

const EXPLORER_BASE = "https://testnet.explorer.perawallet.app/tx/";

export const Route = createFileRoute("/api/receipt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const txId = new URL(request.url).searchParams.get("txId")?.trim();
        if (!txId) {
          return new Response(JSON.stringify({ error: "Missing txId query parameter" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const entry = findLogByTxId(txId);
        if (!entry) {
          const body = JSON.stringify({
            error: "Receipt not found",
            reason:
              "No matching settlement in recent server logs. Payments are retained in-memory only for this demo.",
            txId,
            explorer: `${EXPLORER_BASE}${encodeURIComponent(txId)}`,
          });
          return new Response(body, {
            status: 404,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        }

        const body = JSON.stringify({
          txId: entry.txId,
          timestamp: entry.timestamp,
          pages: entry.pages,
          price: entry.price,
          payer: entry.payer,
          route: entry.route,
          outcome: entry.outcome,
          explorer: `${EXPLORER_BASE}${encodeURIComponent(entry.txId ?? txId)}`,
        });
        return new Response(body, {
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        });
      },
    },
  },
});
