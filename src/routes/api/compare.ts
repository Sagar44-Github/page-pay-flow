/**
 * POST /api/compare — x402-gated, pay-per-page AI multi-document comparison.
 *
 * Accepts TWO documents (documentA and documentB), each as a file upload or raw text.
 * Pricing = (pagesInA + pagesInB) × per-page rate.
 *
 * Flow:
 *   1. Intake & validate BOTH documentA and documentB (must be present & <= MAX_PAGES).
 *   2. Quote combined pages & price.
 *   3. x402 verify/settle for combined page count.
 *   4. Prompt LLM to produce structured side-by-side comparison.
 *   5. Return 200 OK with comparison result & payment metadata.
 */
import { createFileRoute } from "@tanstack/react-router";

import { formatAtomicAmount, priceForPages } from "@/lib/pagepay/pricing";
import { getConfig } from "@/lib/pagepay/config.server";
import { DocumentError } from "@/lib/pagepay/document.server";
import { readTwoDocumentsFromRequest, type TwoDocuments } from "@/lib/pagepay/intake.server";
import { SummarizerError, compareDocuments } from "@/lib/pagepay/summarizer.server";
import { logRequest } from "@/lib/services/pagepayLogger.server";
import { FacilitatorTimeoutError } from "@/lib/x402/facilitator.server";
import {
  MissingPayToError,
  COMPARE_ROUTE,
  createRequestContext,
  getResourceServer,
} from "@/lib/x402/routeConfig.server";

const ROUTE = COMPARE_ROUTE;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

async function handleCompare({ request }: { request: Request }): Promise<Response> {
  // 1. Intake TWO documents — bad input or missing document never reaches the payment layer.
  let twoDocs: TwoDocuments;
  try {
    twoDocs = await readTwoDocumentsFromRequest(request);
  } catch (error) {
    const reason = error instanceof DocumentError ? error.reason : "Unreadable request body.";
    logRequest({
      route: ROUTE,
      pages: 0,
      price: "$0.00",
      paymentStatus: "none",
      outcome: "bad_request",
      reason,
    });
    return json({ error: "Bad request", reason }, 400);
  }

  const { docA, docB, combinedPages } = twoDocs;
  const priceQuoted = priceForPages(combinedPages, getConfig().pricePerPageUsd);

  // 2. x402: verify payment or emit 402 response with COMBINED pages pricing
  let server;
  try {
    server = await getResourceServer();
  } catch (error) {
    if (error instanceof MissingPayToError) {
      logRequest({
        route: ROUTE,
        pages: combinedPages,
        price: priceQuoted,
        paymentStatus: "failed",
        outcome: "gateway_error",
        reason: error.message,
      });
      return json({ error: "Server misconfigured", reason: error.message }, 500);
    }
    const reason =
      error instanceof FacilitatorTimeoutError
        ? error.message
        : `Facilitator unavailable: ${error instanceof Error ? error.message : String(error)}`;
    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: "gateway_timeout",
      outcome: "gateway_error",
      reason,
    });
    return json({ error: "Payment gateway unavailable", reason, retryable: true }, 504);
  }

  const context = createRequestContext(request, { comparePages: combinedPages });

  let processed;
  try {
    console.log("[pagepay:compare] verifying payment", {
      hasPaymentSignature: !!request.headers.get("payment-signature"),
      combinedPages,
      pagesA: docA.pages,
      pagesB: docB.pages,
      priceQuoted,
    });
    processed = await server.processHTTPRequest(context);
    console.log("[pagepay:compare] verify result", processed.type);
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const misconfigured = error instanceof MissingPayToError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: timedOut ? "gateway_timeout" : "failed",
      outcome: timedOut || misconfigured ? "gateway_error" : "payment_failed",
      reason,
    });
    if (misconfigured) return json({ error: "Server misconfigured", reason }, 500);
    return timedOut
      ? json({ error: "Payment gateway unavailable", reason, retryable: true }, 504)
      : json({ error: "Payment verification failed", reason }, 402);
  }

  if (processed.type === "payment-error") {
    const { status, headers, body } = processed.response;
    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: status === 402 ? "required" : "failed",
      outcome: status === 402 ? "payment_required" : "payment_failed",
    });
    return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
      status,
      headers: { "content-type": "application/json", ...headers },
    });
  }

  if (processed.type === "no-payment-required") {
    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: "failed",
      outcome: "gateway_error",
      reason: "Route matched without payment configuration.",
    });
    return json(
      { error: "Server misconfigured", reason: "Payment configuration missing for this route." },
      500,
    );
  }

  const { paymentPayload, paymentRequirements, declaredExtensions } = processed;
  const payer = (paymentPayload.payload["sender"] as string | undefined) ?? undefined;
  const amountAtomic = paymentRequirements.amount;

  // 3. Settle on-chain before performing AI comparison
  let settlement;
  try {
    console.log("[pagepay:compare] settling payment", {
      payer,
      amountAtomic,
      asset: paymentRequirements.asset,
      payTo: paymentRequirements.payTo,
      network: paymentRequirements.network,
    });
    settlement = await server.processSettlement(
      paymentPayload,
      paymentRequirements,
      declaredExtensions,
      { request: context },
    );
    console.log("[pagepay:compare] settlement result", JSON.stringify(settlement, null, 2));
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: timedOut ? "gateway_timeout" : "failed",
      outcome: timedOut ? "gateway_error" : "payment_failed",
      ...(payer ? { payer } : {}),
      reason,
    });
    return timedOut
      ? json({ error: "Payment gateway unavailable", reason, retryable: true }, 504)
      : json({ error: "Payment failed", reason }, 402);
  }

  if (!settlement.success) {
    const reason = settlement.errorMessage ?? settlement.errorReason;
    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: "failed",
      outcome: "payment_failed",
      ...(payer ? { payer } : {}),
      reason,
    });
    const { status, headers, body } = settlement.response;
    return new Response(typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2), {
      status,
      headers: { "content-type": "application/json", ...headers },
    });
  }

  const txId = settlement.transaction;

  // 4. Perform AI comparison of Document A vs Document B
  try {
    const comparison = await compareDocuments(
      docA.text,
      docA.pages,
      docB.text,
      docB.pages,
      request,
    );

    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "summarized",
      ...((settlement.payer ?? payer) ? { payer: (settlement.payer ?? payer) as string } : {}),
      txId,
    });

    return json(
      {
        comparison,
        pagesA: docA.pages,
        pagesB: docB.pages,
        combinedPages,
        pricePaid: priceQuoted,
        amountPaid: `${formatAtomicAmount(amountAtomic)} (asset ${paymentRequirements.asset})`,
        network: paymentRequirements.network,
        payer: settlement.payer ?? payer,
        txId,
        explorer: `https://testnet.explorer.perawallet.app/tx/${txId}`,
        ...(docA.filename ? { filenameA: docA.filename } : {}),
        ...(docB.filename ? { filenameB: docB.filename } : {}),
      },
      200,
      settlement.headers,
    );
  } catch (error) {
    const reason = error instanceof SummarizerError ? error.message : "Comparison failed.";
    logRequest({
      route: ROUTE,
      pages: combinedPages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "paid_unfulfilled",
      ...(payer ? { payer } : {}),
      txId,
      reason,
    });
    return json(
      {
        error: "Comparison failed after payment",
        reason,
        paymentReference: { txId, network: paymentRequirements.network, amount: amountAtomic },
        support:
          "Keep this payment reference — the payment settled but the comparison could not be produced.",
      },
      500,
      settlement.headers,
    );
  }
}

export const Route = createFileRoute("/api/compare")({
  server: {
    handlers: {
      POST: handleCompare,
    },
  },
});
