/**
 * /api/price — quote pages + price before paying. Never gated.
 *
 *   GET  /api/price?pages=3   or   /api/price?words=1200
 *   POST /api/price           multipart `file` (or `text`) / JSON { text }
 *
 * The POST form parses the real document with the SAME intake code path as
 * /api/summarize, so a quote can never disagree with the amount charged.
 */
import { createFileRoute } from "@tanstack/react-router";

import { getConfig } from "@/lib/pagepay/config.server";
import { DocumentError } from "@/lib/pagepay/document.server";
import { readDocumentFromRequest } from "@/lib/pagepay/intake.server";
import { MAX_PAGES, WORDS_PER_PAGE, priceForPages } from "@/lib/pagepay/pricing";
import { logRequest } from "@/lib/services/pagepayLogger.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function quoteBody(pages: number, extra: Record<string, unknown> = {}) {
  const config = getConfig();
  const price = priceForPages(pages, config.pricePerPageUsd);
  logRequest({
    route: "GET /api/price",
    pages,
    price,
    paymentStatus: "none",
    outcome: "quoted",
  });
  return json({
    pages,
    pricePerPageUsd: config.pricePerPageUsd,
    price,
    wordsPerPage: WORDS_PER_PAGE,
    network: config.network,
    facilitator: config.facilitatorUrl,
    protocol: "x402",
    note: "USD-denominated price; the x402 payment requirements convert it to the on-chain asset amount on Algorand Testnet.",
    ...extra,
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
        return quoteBody(Math.floor(pages));
      },

      // Exact quote: parses the real uploaded document (same code as /api/summarize).
      POST: async ({ request }) => {
        try {
          const doc = await readDocumentFromRequest(request);
          return quoteBody(doc.pages, {
            source: doc.source,
            ...(doc.filename ? { filename: doc.filename } : {}),
            exact: true,
          });
        } catch (error) {
          const reason = error instanceof DocumentError ? error.reason : "Unreadable request body.";
          logRequest({
            route: "POST /api/price",
            pages: 0,
            price: "$0.00",
            paymentStatus: "none",
            outcome: "bad_request",
            reason,
          });
          return json({ error: "Bad request", reason }, 400);
        }
      },
    },
  },
});
