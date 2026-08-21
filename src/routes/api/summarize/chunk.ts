/**
 * POST /api/summarize/chunk — x402-gated, pay-per-CHUNK AI document summarization.
 *
 * Flow:
 *   1. First call: upload document + chunkIndex=0 → parse, cache, quote chunk price
 *   2. Subsequent calls: sessionId + chunkIndex → retrieve from cache, quote chunk price
 *   3. x402 verify/settle for THIS chunk's pages only
 *   4. Summarize only the chunk's page range
 *   5. Return chunk summary + metadata (chunkIndex, totalChunks, hasMore, sessionId)
 */
import { createFileRoute } from "@tanstack/react-router";

import { chunkInfoForDocument, formatAtomicAmount, priceForPages } from "@/lib/pagepay/pricing";
import { getConfig } from "@/lib/pagepay/config.server";
import { DocumentError, type ParsedDocument } from "@/lib/pagepay/document.server";
import { readDocumentFromRequest } from "@/lib/pagepay/intake.server";
import { cacheDocument, getCachedDocument } from "@/lib/pagepay/documentCache.server";
import { SummarizerError, summarizeChunk } from "@/lib/pagepay/summarizer.server";
import { logRequest } from "@/lib/services/pagepayLogger.server";
import { FacilitatorTimeoutError } from "@/lib/x402/facilitator.server";
import {
  MissingPayToError,
  CHUNK_ROUTE,
  createRequestContext,
  getResourceServer,
} from "@/lib/x402/routeConfig.server";

const ROUTE = CHUNK_ROUTE;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

async function handleChunkSummarize({ request }: { request: Request }): Promise<Response> {
  // 1. Resolve document: either from cache (sessionId) or fresh upload.
  let doc: ParsedDocument;
  let sessionId: string;
  let chunkIndex: number;

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    // First-call or re-upload: parse the document, cache it.
    const cloned = request.clone();
    const form = await cloned.formData();
    chunkIndex = Number(form.get("chunkIndex") ?? 0);
    const existingSessionId = form.get("sessionId");

    if (existingSessionId && typeof existingSessionId === "string") {
      const cached = getCachedDocument(existingSessionId);
      if (cached) {
        doc = cached;
        sessionId = existingSessionId;
      } else {
        // Session expired — re-parse
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
    // JSON body: sessionId + chunkIndex (or text + chunkIndex for first call)
    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ error: "Bad request", reason: "Request body must be JSON or multipart/form-data." }, 400);
    }

    chunkIndex = Number(payload["chunkIndex"] ?? 0);
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
        { error: "Bad request", reason: "Provide a `sessionId` or upload a document." },
        400,
      );
    }
  }

  // 2. Compute chunk info.
  const chunk = chunkInfoForDocument(doc.pages, chunkIndex);
  const priceQuoted = priceForPages(chunk.chunkPages, getConfig().pricePerPageUsd);

  // 3. x402: verify payment for THIS chunk's page count.
  let server;
  try {
    server = await getResourceServer();
  } catch (error) {
    if (error instanceof MissingPayToError) {
      logRequest({
        route: ROUTE,
        pages: chunk.chunkPages,
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
      pages: chunk.chunkPages,
      price: priceQuoted,
      paymentStatus: "gateway_timeout",
      outcome: "gateway_error",
      reason,
    });
    return json({ error: "Payment gateway unavailable", reason, retryable: true }, 504);
  }

  const context = createRequestContext(request, { chunkPages: chunk.chunkPages });

  let processed;
  try {
    console.log("[pagepay:chunk] verifying payment", {
      hasPaymentSignature: !!request.headers.get("payment-signature"),
      chunkIndex: chunk.chunkIndex,
      chunkPages: chunk.chunkPages,
      priceQuoted,
    });
    processed = await server.processHTTPRequest(context);
    console.log("[pagepay:chunk] verify result", processed.type);
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const misconfigured = error instanceof MissingPayToError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: chunk.chunkPages,
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
      pages: chunk.chunkPages,
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
      pages: chunk.chunkPages,
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
    console.log("[pagepay:chunk] settling payment", {
      payer,
      amountAtomic,
      chunkIndex: chunk.chunkIndex,
    });
    settlement = await server.processSettlement(
      paymentPayload,
      paymentRequirements,
      declaredExtensions,
      { request: context },
    );
    console.log("[pagepay:chunk] settlement result", JSON.stringify(settlement, null, 2));
  } catch (error) {
    const timedOut = error instanceof FacilitatorTimeoutError;
    const reason = error instanceof Error ? error.message : String(error);
    logRequest({
      route: ROUTE,
      pages: chunk.chunkPages,
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
      pages: chunk.chunkPages,
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

  // 5. Summarize this chunk's page range only.
  try {
    const chunkText = doc.pageTexts
      .slice(chunk.startPage, chunk.endPage)
      .join("\n\n");

    const summary = await summarizeChunk(
      chunkText,
      chunk.chunkIndex,
      chunk.totalChunks,
      chunk.chunkPages,
      chunk.startPage,
      chunk.endPage,
      request,
    );

    logRequest({
      route: ROUTE,
      pages: chunk.chunkPages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "summarized",
      ...((settlement.payer ?? payer) ? { payer: (settlement.payer ?? payer) as string } : {}),
      txId,
    });

    return json(
      {
        summary,
        chunkIndex: chunk.chunkIndex,
        totalChunks: chunk.totalChunks,
        chunkPages: chunk.chunkPages,
        totalPages: doc.pages,
        hasMore: chunk.hasMore,
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
    const reason = error instanceof SummarizerError ? error.message : "Chunk summarization failed.";
    logRequest({
      route: ROUTE,
      pages: chunk.chunkPages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "paid_unfulfilled",
      ...(payer ? { payer } : {}),
      txId,
      reason,
    });
    return json(
      {
        error: "Chunk summarization failed after payment",
        reason,
        paymentReference: { txId, network: paymentRequirements.network, amount: amountAtomic },
        support:
          "Keep this payment reference — the payment settled but the chunk summary could not be produced.",
      },
      500,
      settlement.headers,
    );
  }
}

export const Route = createFileRoute("/api/summarize/chunk")({
  server: {
    handlers: {
      POST: handleChunkSummarize,
    },
  },
});
