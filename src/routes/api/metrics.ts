/**
 * GET /api/metrics — aggregated payment stats for the live dashboard.
 */
import { createFileRoute } from "@tanstack/react-router";

import { computeMetrics, recentLogs } from "@/lib/services/pagepayLogger.server";

export const Route = createFileRoute("/api/metrics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limitParam = new URL(request.url).searchParams.get("limit");
        const parsed = Number(limitParam ?? 200);
        const limit = Number.isFinite(parsed)
          ? Math.min(Math.max(Math.floor(parsed), 1), 500)
          : 200;
        const metrics = computeMetrics(limit);
        const recent = recentLogs(Math.min(limit, 50));
        return new Response(JSON.stringify({ metrics, recent }, null, 2), {
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        });
      },
    },
  },
});
