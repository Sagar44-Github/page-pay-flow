/**
 * GET /api/price — quote pages + price before paying. Never gated.
 *   /api/price?pages=3   or   /api/price?words=1200
 */
import { createFileRoute } from "@tanstack/react-router";

import {
  MAX_PAGES,
  PRICE_PER_PAGE_USD,
  WORDS_PER_PAGE,
  priceForPages,
} from "@/lib/pagepay/pricing";
import { logRequest } from "@/lib/services/pagepayLogger.server";
import { X402_NETWORK } from "@/lib/x402/routeConfig.server";
import { FACILITATOR_URL } from "@/lib/x402/facilitator.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/price")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const pagesParam = url.searchParams.get("pages");
        const wordsParam = url.searchParams.get("words");

        let pages = 1;
        if (pagesParam !== null) {
          pages = Number(pagesParam);
        } else if (wordsParam !== null) {
          const words = Number(wordsParam);
          if (!Number.isFinite(words) || words < 0) {
            return json({ error: "Bad request", reason: "`words` must be a positive number." }, 400);
          }
          pages = Math.max(1, Math.ceil(words / WORDS_PER_PAGE));
        }

        if (!Number.isFinite(pages) || pages < 1 || pages > MAX_PAGES) {
          return json(
            { error: "Bad request", reason: `Pages must be between 1 and ${MAX_PAGES}.` },
            400,
          );
        }
        pages = Math.floor(pages);
        const price = priceForPages(pages);

        logRequest({
          route: "GET /api/price",
          pages,
          price,
          paymentStatus: "none",
          outcome: "quoted",
        });

        return json({
          pages,
          pricePerPageUsd: PRICE_PER_PAGE_USD,
          price,
          wordsPerPage: WORDS_PER_PAGE,
          network: X402_NETWORK,
          facilitator: FACILITATOR_URL,
          protocol: "x402",
          note: "USD-denominated price; the x402 payment requirements convert it to the on-chain asset amount on Algorand Testnet.",
        });
      },
    },
  },
});
