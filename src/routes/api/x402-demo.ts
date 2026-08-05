/**
 * x402 protocol demo endpoint.
 *
 * First call (no X-Payment header) → HTTP 402 with payment requirements JSON.
 * Retry with an X-Payment header → mock verification + settlement, then the gated
 * resource (a real Groq completion). Failure modes are selectable via `mode`.
 */
import { createFileRoute } from "@tanstack/react-router";

import { groqChat, GroqError, GROQ_DEFAULT_MODEL } from "@/lib/groq/groq.server";
import {
  DEMO_MODES,
  decodePaymentHeader,
  type DemoMode,
  type DemoPaymentRequirements,
  type DemoServerLogEntry,
} from "@/lib/x402demo/protocol";

const PAY_TO = "PAGEPAYDEMOMERCHANTADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const NETWORK = "algorand:testnet-v1.0";
const ASSET = "10458941"; // Testnet USDC ASA
const AMOUNT_ATOMIC = "10000"; // 0.01 USDC (6 decimals)

function createLogger() {
  const entries: DemoServerLogEntry[] = [];
  return {
    entries,
    log(level: DemoServerLogEntry["level"], message: string, detail?: string) {
      const entry: DemoServerLogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(detail ? { detail } : {}),
      };
      entries.push(entry);
      const line = `[x402-demo] ${level.toUpperCase()} ${message}${detail ? ` :: ${detail}` : ""}`;
      if (level === "error") console.error(line);
      else if (level === "warn") console.warn(line);
      else console.log(line);
      return entry;
    },
  };
}

function paymentRequirements(resource: string, mode: DemoMode): DemoPaymentRequirements {
  return {
    x402Version: 1,
    accepts: [
      {
        scheme: "exact",
        network: NETWORK,
        resource,
        description: "Groq-generated gated briefing (x402 demo)",
        mimeType: "application/json",
        payTo: PAY_TO,
        asset: ASSET,
        amount: AMOUNT_ATOMIC,
        amountFormatted: "$0.01",
        maxTimeoutSeconds: 60,
      },
    ],
    error: "Payment required",
    reason: `Attach an X-Payment header signed for one of the accepted payment requirements. Simulation mode: ${mode}.`,
  };
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

interface DemoRequestBody {
  prompt?: string;
  mode?: string;
  model?: string;
}

export const Route = createFileRoute("/api/x402-demo")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const logger = createLogger();
        const url = new URL(request.url);
        const resource = `${url.origin}/api/x402-demo`;

        let body: DemoRequestBody = {};
        try {
          body = (await request.json()) as DemoRequestBody;
        } catch {
          logger.log("warn", "Request body was not valid JSON; using defaults");
        }

        const mode: DemoMode = DEMO_MODES.includes(body.mode as DemoMode)
          ? (body.mode as DemoMode)
          : "happy";
        const prompt = (body.prompt ?? "").trim();
        logger.log("info", `POST /api/x402-demo received`, `mode=${mode} promptChars=${prompt.length}`);

        const paymentHeader = request.headers.get("x-payment");

        if (!paymentHeader) {
          logger.log("warn", "No X-Payment header present → responding 402 Payment Required");
          const requirements = paymentRequirements(resource, mode);
          return json({ ...requirements, mode, serverLog: logger.entries }, 402, {
            "x-payment-required": "true",
            "x-x402-version": "1",
            "www-authenticate": `x402 network="${NETWORK}", scheme="exact", amount="${AMOUNT_ATOMIC}", asset="${ASSET}"`,
          });
        }

        logger.log("info", "X-Payment header received", `${paymentHeader.slice(0, 48)}…`);

        let payload;
        try {
          payload = decodePaymentHeader(paymentHeader);
        } catch (error) {
          logger.log(
            "error",
            "X-Payment header could not be decoded",
            error instanceof Error ? error.message : String(error),
          );
          return json(
            {
              error: "Invalid payment token",
              reason: "X-Payment must be base64-encoded JSON matching the x402 exact scheme.",
              mode,
              serverLog: logger.entries,
            },
            400,
          );
        }

        const valid =
          payload?.scheme === "exact" &&
          payload?.network === NETWORK &&
          payload?.payload?.amount === AMOUNT_ATOMIC &&
          payload?.payload?.to === PAY_TO &&
          typeof payload?.payload?.signature === "string" &&
          payload.payload.signature.startsWith("mock-ed25519:");

        if (mode === "invalid" || !valid) {
          logger.log("error", "Payment verification failed", "signature/scheme/amount mismatch");
          return json(
            {
              error: "Invalid payment token",
              reason:
                "Verification rejected the payment payload: scheme, network, amount, recipient or signature did not match the requirements.",
              mode,
              serverLog: logger.entries,
            },
            400,
          );
        }

        logger.log("success", "Payment payload verified", `payer=${payload.payload.from}`);

        if (mode === "timeout") {
          logger.log("info", "Submitting settlement to facilitator…");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          logger.log("error", "Facilitator did not settle within maxTimeoutSeconds");
          return json(
            {
              error: "Gateway timeout",
              reason: "Settlement did not complete before the payment window expired.",
              mode,
              serverLog: logger.entries,
            },
            504,
          );
        }

        if (mode === "failed") {
          logger.log("info", "Submitting settlement to facilitator…");
          logger.log("error", "Settlement rejected", "insufficient_funds (simulated)");
          return json(
            {
              error: "Payment failed",
              reason: "Settlement was rejected by the facilitator: insufficient_funds.",
              mode,
              serverLog: logger.entries,
            },
            402,
          );
        }

        const transaction = `MOCKTX${payload.payload.nonce.slice(0, 20).toUpperCase()}`;
        logger.log("success", "Settlement confirmed", `txid=${transaction}`);

        try {
          logger.log("info", "Calling Groq to produce the gated resource", `model=${body.model ?? GROQ_DEFAULT_MODEL}`);
          const completion = await groqChat({
            ...(body.model ? { model: body.model } : {}),
            messages: [
              {
                role: "system",
                content:
                  "You are the gated resource behind an x402 paywall. Answer concisely with markdown: a short overview paragraph, then 3-5 bullet insights. Never mention that you are an AI model.",
              },
              {
                role: "user",
                content:
                  prompt ||
                  "Explain the x402 HTTP payment protocol and why per-request machine payments matter for AI agents.",
              },
            ],
          });
          logger.log(
            "success",
            "Groq completion returned",
            `model=${completion.model} latency=${completion.latencyMs}ms tokens=${completion.usage?.total_tokens ?? "?"}`,
          );

          return json(
            {
              unlocked: true,
              mode,
              content: completion.content,
              model: completion.model,
              latencyMs: completion.latencyMs,
              ...(completion.usage ? { usage: completion.usage } : {}),
              settlement: {
                success: true,
                network: NETWORK,
                transaction,
                payer: payload.payload.from,
              },
              serverLog: logger.entries,
            },
            200,
            {
              "x-payment-response": JSON.stringify({
                success: true,
                network: NETWORK,
                transaction,
              }),
            },
          );
        } catch (error) {
          const status = error instanceof GroqError ? error.status : 500;
          const reason = error instanceof Error ? error.message : String(error);
          logger.log("error", "Gated resource generation failed", reason);
          return json(
            {
              error: "Paid but unfulfilled",
              reason,
              mode,
              settlement: { success: true, network: NETWORK, transaction },
              serverLog: logger.entries,
            },
            status,
          );
        }
      },
    },
  },
});
