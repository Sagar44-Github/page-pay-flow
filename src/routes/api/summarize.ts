/**
 * POST /api/summarize — x402-gated, pay-per-page AI document summarization.
 *
 * Flow: parse document -> quote pages/price -> x402 verify (402 when unpaid)
 * -> settle on Algorand testnet -> summarize -> 200 with X-PAYMENT-RESPONSE.
 */
import { createFileRoute } from "@tanstack/react-router";

import { MAX_UPLOAD_BYTES, formatAtomicAmount } from "@/lib/pagepay/pricing";
import {
  DocumentError,
  parsePdf,
  parseTextInput,
  type ParsedDocument,
} from "@/lib/pagepay/document.server";
import { SummarizerError, summarizeDocument } from "@/lib/pagepay/summarizer.server";
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

async function readDocument(request: Request): Promise<ParsedDocument> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    const text = form.get("text");
    if (file && typeof file !== "string") {
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new DocumentError("File is larger than the 10 MB limit.");
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (isPdf) return parsePdf(bytes, file.name);
      const decoded = new TextDecoder().decode(bytes);
      return { ...parseTextInput(decoded), filename: file.name };
    }
    if (typeof text === "string") return parseTextInput(text);
    throw new DocumentError("Attach a `file` or a `text` field.");
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    throw new DocumentError("Request body must be JSON or multipart/form-data.");
  }
  const body = (payload ?? {}) as { text?: unknown; filename?: unknown };
  if (typeof body.text !== "string") {
    throw new DocumentError("Provide a `text` string (or upload a file as multipart/form-data).");
  }
  return {
    ...parseTextInput(body.text),
    ...(typeof body.filename === "string" ? { filename: body.filename } : {}),
  };
}

async function handleSummarize({ request }: { request: Request }): Promise<Response> {
  // 1. Document intake — bad input never reaches the payment layer.
  let doc: ParsedDocument;
  try {
    doc = await readDocument(request);
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

  const priceQuoted = `$${(doc.pages * 0.01).toFixed(2)}`;

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
    processed = await server.processHTTPRequest(context);
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
    return new Response(
      typeof body === "string" ? body : JSON.stringify(body ?? {}, null, 2),
      {
        status,
        headers: { "content-type": "application/json", ...headers },
      },
    );
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
    settlement = await server.processSettlement(
      paymentPayload,
      paymentRequirements,
      declaredExtensions,
      { request: context },
    );
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
    const summary = await summarizeDocument(doc.text, doc.pages, request);
    logRequest({
      route: ROUTE,
      pages: doc.pages,
      price: priceQuoted,
      paymentStatus: "settled",
      outcome: "summarized",
      ...(settlement.payer ?? payer ? { payer: (settlement.payer ?? payer) as string } : {}),
      txId,
    });
    return json(
      {
        summary,
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
