/**
 * POST /api/summarize — x402-gated, pay-per-page AI document summarization.
 *
 * Flow: parse document -> quote pages/price -> x402 verify (402 when unpaid)
 * -> settle on Algorand testnet -> summarize -> 200 with X-PAYMENT-RESPONSE.
 */
import { createFileRoute } from "@tanstack/react-router";

import { formatAtomicAmount, priceForPages } from "@/lib/pagepay/pricing";
import { getConfig } from "@/lib/pagepay/config.server";
import { DocumentError, type ParsedDocument } from "@/lib/pagepay/document.server";
import { readDocumentFromRequest } from "@/lib/pagepay/intake.server";
import { SummarizerError, summarizeDocument, type ExtractionMode } from "@/lib/pagepay/summarizer.server";
import { logRequest } from "@/lib/services/pagepayLogger.server";
import { FacilitatorTimeoutError } from "@/lib/x402/facilitator.server";
import {
  MissingPayToError,
  SUMMARIZE_ROUTE,
  createRequestContext,
  getResourceServer,
} from "@/lib/x402/routeConfig.server";

const ROUTE = SUMMARIZE_ROUTE;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

async function handleSummarize({ request }: { request: Request }): Promise<Response> {
  // 1. Document intake — bad input never reaches the payment layer.
  let doc: ParsedDocument;
  let mode: ExtractionMode = "summary";

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const cloned = request.clone();
    try {
      const form = await cloned.formData();
      const rawMode = String(form.get("mode") ?? "summary");
      if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary" || rawMode === "compliance_check") {
        mode = rawMode;
      }
    } catch {
      // Ignore formdata parse error, readDocumentFromRequest will handle error
    }
  } else {
    const cloned = request.clone();
    try {
      const payload = (await cloned.json()) as Record<string, unknown>;
      const rawMode = String(payload["mode"] ?? "summary");
      if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary" || rawMode === "compliance_check") {
        mode = rawMode;
      }
    } catch {
      // Ignore JSON parse error, readDocumentFromRequest will handle error
    }
  }

  try {
    doc = await readDocumentFromRequest(request);
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

  const priceQuoted = priceForPages(doc.pages, getConfig().pricePerPageUsd);

  // 2. x402: verify payment or emit the protocol's own 402 response.
  let server;
  try {
    server = await getResourceServer();
  } catch (error) {
    if (error instanceof MissingPayToError) {
      logRequest({
        route: ROUTE,
        pages: doc.pages,
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
      pages: doc.pages,
      price: priceQuoted,
      paymentStatus: "gateway_timeout",
      outcome: "gateway_error",
      reason,
    });
    return json({ error: "Payment gateway unavailable", reason, retryable: true }, 504);
  }

  const context = createRequestContext(request, { pageCount: doc.pages });

  let processed;
  try {
    console.log("[pagepay] verifying payment", {
      hasPaymentSignature: !!request.headers.get("payment-signature"),
      pageCount: doc.pages,
      priceQuoted,
    });
    processed = await server.processHTTPRequest(context);
    console.log("[pagepay] verify result", processed.type);
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const misconfigured = error instanceof MissingPayToError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: doc.pages,
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
      pages: doc.pages,
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
    // Route is always metered; treat a config drift as a server error rather than free work.
    logRequest({
      route: ROUTE,
      pages: doc.pages,
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

  // 3. Settle on-chain before doing paid work.
  let settlement;
  try {
    console.log("[pagepay] settling payment", {
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
    console.log("[pagepay] settlement result", JSON.stringify(settlement, null, 2));
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: doc.pages,
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
      pages: doc.pages,
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

  // 4. Paid work.
  try {
    const summary = await summarizeDocument(doc.text, doc.pages, request, mode);
    logRequest({
      route: ROUTE,
      pages: doc.pages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "summarized",
      ...((settlement.payer ?? payer) ? { payer: (settlement.payer ?? payer) as string } : {}),
      txId,
    });
    return json(
      {
        summary,
        mode,
        pages: doc.pages,
        pricePaid: priceQuoted,
        amountPaid: `${formatAtomicAmount(amountAtomic)} (asset ${paymentRequirements.asset})`,
        network: paymentRequirements.network,
        payer: settlement.payer ?? payer,
        txId,
        explorer: `https://testnet.explorer.perawallet.app/tx/${txId}`,
        ...(doc.filename ? { filename: doc.filename } : {}),
      },
      200,
      settlement.headers,
    );
  } catch (error) {
    const reason = error instanceof SummarizerError ? error.message : "Summarization failed.";
    logRequest({
      route: ROUTE,
      pages: doc.pages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "paid_unfulfilled",
      ...(payer ? { payer } : {}),
      txId,
      reason,
    });
    return json(
      {
        error: "Summarization failed after payment",
        reason,
        paymentReference: { txId, network: paymentRequirements.network, amount: amountAtomic },
        support:
          "Keep this payment reference — the payment settled but the summary could not be produced.",
      },
      500,
      settlement.headers,
    );
  }
}

export const Route = createFileRoute("/api/summarize")({
  server: {
    handlers: {
      POST: handleSummarize,
    },
  },
});
