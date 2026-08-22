/**
 * POST /api/summarize/range — x402-gated, pay-per-RANGE AI document summarization.
 *
 * The caller chooses exactly which pages to summarize (1-indexed, inclusive)
 * and pays only for that range: price = (endPage - startPage + 1) × per-page rate.
 *
 * Flow:
 *   1. Parse document (upload or cached session)
 *   2. Validate startPage / endPage against the document's actual page count
 *   3. x402 verify/settle for the range's page count only
 *   4. Summarize only the requested pages
 *   5. Return summary + metadata
 */
import { createFileRoute } from "@tanstack/react-router";

import { formatAtomicAmount, priceForPages, validatePageRange } from "@/lib/pagepay/pricing";
import { getConfig } from "@/lib/pagepay/config.server";
import { DocumentError, type ParsedDocument } from "@/lib/pagepay/document.server";
import { readDocumentFromRequest } from "@/lib/pagepay/intake.server";
import { cacheDocument, getCachedDocument } from "@/lib/pagepay/documentCache.server";
import { SummarizerError, summarizeRange, type ExtractionMode } from "@/lib/pagepay/summarizer.server";
import { logRequest } from "@/lib/services/pagepayLogger.server";
import { FacilitatorTimeoutError } from "@/lib/x402/facilitator.server";
import {
  MissingPayToError,
  RANGE_ROUTE,
  createRequestContext,
  getResourceServer,
} from "@/lib/x402/routeConfig.server";

const ROUTE = RANGE_ROUTE;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

async function handleRangeSummarize({ request }: { request: Request }): Promise<Response> {
  // 1. Resolve document: either from cache (sessionId) or fresh upload.
  let doc: ParsedDocument;
  let sessionId: string;
  let startPage: number;
  let endPage: number;
  let mode: ExtractionMode = "summary";

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const cloned = request.clone();
    const form = await cloned.formData();
    startPage = Number(form.get("startPage") ?? 1);
    endPage = Number(form.get("endPage") ?? 1);
    const rawMode = String(form.get("mode") ?? "summary");
    if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary" || rawMode === "compliance_check") {
      mode = rawMode;
    }
    const existingSessionId = form.get("sessionId");

    if (existingSessionId && typeof existingSessionId === "string") {
      const cached = getCachedDocument(existingSessionId);
      if (cached) {
        doc = cached;
        sessionId = existingSessionId;
      } else {
        try {
          doc = await readDocumentFromRequest(request);
        } catch (error) {
          const reason = error instanceof DocumentError ? error.reason : "Unreadable request body.";
          return json({ error: "Bad request", reason }, 400);
        }
        sessionId = cacheDocument(doc);
      }
    } else {
      try {
        doc = await readDocumentFromRequest(request);
      } catch (error) {
        const reason = error instanceof DocumentError ? error.reason : "Unreadable request body.";
        return json({ error: "Bad request", reason }, 400);
      }
      sessionId = cacheDocument(doc);
    }
  } else {
    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ error: "Bad request", reason: "Request body must be JSON or multipart/form-data." }, 400);
    }

    startPage = Number(payload["startPage"] ?? 1);
    endPage = Number(payload["endPage"] ?? 1);
    const rawMode = String(payload["mode"] ?? "summary");
    if (rawMode === "action_items" || rawMode === "key_risks" || rawMode === "summary") {
      mode = rawMode;
    }
    const existingSessionId = payload["sessionId"] as string | undefined;

    if (existingSessionId) {
      const cached = getCachedDocument(existingSessionId);
      if (!cached) {
        return json(
          { error: "Session expired", reason: "Document session not found. Please re-upload the document." },
          410,
        );
      }
      doc = cached;
      sessionId = existingSessionId;
    } else if (typeof payload["text"] === "string") {
      try {
        const { parseTextInput } = await import("@/lib/pagepay/document.server");
        doc = parseTextInput(payload["text"]);
      } catch (error) {
        const reason = error instanceof DocumentError ? error.reason : "Unreadable text.";
        return json({ error: "Bad request", reason }, 400);
      }
      sessionId = cacheDocument(doc);
    } else {
      return json(
        { error: "Bad request", reason: "Provide a `sessionId` or upload a document, plus `startPage` and `endPage`." },
        400,
      );
    }
  }

  // 2. Validate the page range.
  const rangeError = validatePageRange(startPage, endPage, doc.pages);
  if (rangeError) {
    return json({ error: "Bad request", reason: rangeError, totalPages: doc.pages }, 400);
  }

  const rangePages = endPage - startPage + 1;
  const priceQuoted = priceForPages(rangePages, getConfig().pricePerPageUsd);

  // 3. x402: verify payment for this range's page count.
  let server;
  try {
    server = await getResourceServer();
  } catch (error) {
    if (error instanceof MissingPayToError) {
      logRequest({
        route: ROUTE,
        pages: rangePages,
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
      pages: rangePages,
      price: priceQuoted,
      paymentStatus: "gateway_timeout",
      outcome: "gateway_error",
      reason,
    });
    return json({ error: "Payment gateway unavailable", reason, retryable: true }, 504);
  }

  const context = createRequestContext(request, { rangePages });

  let processed;
  try {
    console.log("[pagepay:range] verifying payment", {
      hasPaymentSignature: !!request.headers.get("payment-signature"),
      startPage,
      endPage,
      rangePages,
      priceQuoted,
    });
    processed = await server.processHTTPRequest(context);
    console.log("[pagepay:range] verify result", processed.type);
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const misconfigured = error instanceof MissingPayToError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: rangePages,
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
      pages: rangePages,
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
      pages: rangePages,
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

  // 4. Settle on-chain.
  let settlement;
  try {
    console.log("[pagepay:range] settling payment", {
      payer,
      amountAtomic,
      startPage,
      endPage,
    });
    settlement = await server.processSettlement(
      paymentPayload,
      paymentRequirements,
      declaredExtensions,
      { request: context },
    );
    console.log("[pagepay:range] settlement result", JSON.stringify(settlement, null, 2));
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: rangePages,
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
      pages: rangePages,
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

  // 5. Summarize only the requested page range.
  // pageTexts is 0-indexed; startPage/endPage are 1-indexed inclusive.
  try {
    const rangeText = doc.pageTexts
      .slice(startPage - 1, endPage)
      .join("\n\n");

    const summary = await summarizeRange(
      rangeText,
      startPage,
      endPage,
      doc.pages,
      request,
      mode,
    );

    logRequest({
      route: ROUTE,
      pages: rangePages,
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
        startPage,
        endPage,
        pages: rangePages,
        totalPages: doc.pages,
        sessionId,
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
    const reason = error instanceof SummarizerError ? error.message : "Range summarization failed.";
    logRequest({
      route: ROUTE,
      pages: rangePages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "paid_unfulfilled",
      ...(payer ? { payer } : {}),
      txId,
      reason,
    });
    return json(
      {
        error: "Range summarization failed after payment",
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

export const Route = createFileRoute("/api/summarize/range")({
  server: {
    handlers: {
      POST: handleRangeSummarize,
    },
  },
});
