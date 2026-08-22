/**
 * GET /api/tools — Machine-readable agent discovery metadata endpoint.
 *
 * Exposes service information, available endpoints, required/optional inputs,
 * extraction modes, pricing rate per page, x402 protocol configuration, network
 * CAIP-2 ID, facilitator URL, and merchant payTo address.
 *
 * Unmetered, requires NO payment and NO wallet connection.
 */
import { createFileRoute } from "@tanstack/react-router";

import { getConfig } from "@/lib/pagepay/config.server";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}

export function handleGetTools(): Response {
  const config = getConfig();

  return json({
    name: "PagePay",
    description: "Pay-per-page AI document summarization over HTTP 402 on Algorand",
    version: "1.0.0",
    protocol: "x402",
    network: config.network,
    pricing: {
      pricePerPageUsd: config.pricePerPageUsd,
      currency: "USD",
      note: "USD-denominated pricing per page (500 words or 1 PDF page); settled in Testnet USDC on Algorand.",
    },
    payTo: config.payTo,
    facilitator: config.facilitatorUrl,
    endpoints: [
      {
        path: "/api/summarize",
        method: "POST",
        description: "Summarize an entire document (whole document metering)",
        input: {
          file: "File upload via multipart/form-data ('file') OR text string via JSON ('text')",
          mode: "Optional extraction mode: 'summary' | 'action_items' | 'key_risks' (default: 'summary')",
        },
        pricingRule: "price = totalPages * pricePerPageUsd",
      },
      {
        path: "/api/summarize/range",
        method: "POST",
        description: "Summarize a specific page range of a document",
        input: {
          file: "File upload ('file') OR text string ('text') OR session ID ('sessionId')",
          startPage: "1-indexed start page (inclusive, default: 1)",
          endPage: "1-indexed end page (inclusive, default: 1)",
          mode: "Optional extraction mode: 'summary' | 'action_items' | 'key_risks' (default: 'summary')",
        },
        pricingRule: "price = (endPage - startPage + 1) * pricePerPageUsd",
      },
      {
        path: "/api/price",
        method: "GET | POST",
        description: "Quote document page count and price before payment",
        input: {
          pages: "Query param 'pages' for raw count quote",
          file: "POST file or text for exact page count quote",
        },
      },
    ],
    modes: [
      {
        name: "summary",
        description: "Standard document overview, bulleted key points, explicit dates/obligations",
      },
      {
        name: "action_items",
        description: "Concrete tasks, action items, assignees/owners, and deadlines",
      },
      {
        name: "key_risks",
        description: "Flagged risks, liabilities, ambiguous clauses, and red flags categorized by severity",
      },
    ],
  });
}

export const Route = createFileRoute("/api/tools")({
  server: {
    handlers: {
      GET: handleGetTools,
    },
  },
});
