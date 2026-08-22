/**
 * GET /api/trust-score?address=<algorandAddress> — Public Trust Score API.
 *
 * Computes a 0–100 reliability score for any Algorand address based on its real
 * payment history in PagePay server logs.
 *
 * Unmetered, public, read-only endpoint.
 */
import { createFileRoute } from "@tanstack/react-router";
import { computeTrustScoreForAddress } from "@/lib/services/pagepayLogger.server";

const ALGORAND_ADDRESS_REGEX = /^[A-Z2-7]{58}$/;

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

export function handleGetTrustScore({ request }: { request: Request }): Response {
  const url = new URL(request.url);
  const rawAddress = url.searchParams.get("address")?.trim();

  // Validate 1: Missing address -> 400 Bad Request
  if (!rawAddress) {
    return json(
      {
        error: "Missing address query parameter",
        reason: "Provide an address parameter, e.g. GET /api/trust-score?address=<algorandAddress>",
      },
      400,
    );
  }

  // Validate 2: Malformed address -> 400 Bad Request
  if (!ALGORAND_ADDRESS_REGEX.test(rawAddress.toUpperCase())) {
    return json(
      {
        error: "Invalid Algorand address format",
        reason: "Algorand address must be a 58-character base32 string (A-Z and 2-7).",
        providedAddress: rawAddress,
      },
      400,
    );
  }

  // Compute trust score from logged transaction history
  const scoreData = computeTrustScoreForAddress(rawAddress);
  return json({
    service: "PagePay Agent Trust Score API",
    ...scoreData,
    formulaDoc:
      "trustScore = Math.min(100, Math.round(txCountPoints + successRatePoints + volumeBonusPoints)), where txCountPoints = min(40, txCount * 10), successRatePoints = round(successRate * 40), volumeBonusPoints = min(20, usdVolume * 50).",
  });
}

export const Route = createFileRoute("/api/trust-score")({
  server: {
    handlers: {
      GET: handleGetTrustScore,
    },
  },
});
