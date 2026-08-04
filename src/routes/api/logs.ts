/**
 * GET /api/logs — recent structured request log entries for the dashboard.
 */
import { createFileRoute } from "@tanstack/react-router";

import { recentLogs } from "@/lib/services/pagepayLogger.server";

export const Route = createFileRoute("/api/logs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limitParam = new URL(request.url).searchParams.get("limit");
        const parsed = Number(limitParam ?? 100);
        const limit = Number.isFinite(parsed) ? Math.min(Math.max(Math.floor(parsed), 1), 200) : 100;
        const entries = recentLogs(limit);
        return new Response(JSON.stringify({ count: entries.length, entries }, null, 2), {
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        });
      },
    },
  },
});
