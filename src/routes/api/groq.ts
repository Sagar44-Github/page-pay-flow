/**
 * Ungated Groq proxy for the demo's non-paywalled AI features.
 * The API key stays server-side; verbose structured logging on every call.
 */
import { createFileRoute } from "@tanstack/react-router";

import { groqChat, GroqError, GROQ_DEFAULT_MODEL } from "@/lib/groq/groq.server";

interface GroqRouteBody {
  prompt?: string;
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const Route = createFileRoute("/api/groq")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const startedAt = Date.now();
        let body: GroqRouteBody = {};
        try {
          body = (await request.json()) as GroqRouteBody;
        } catch {
          console.warn("[groq] request body was not valid JSON");
        }

        const prompt = (body.prompt ?? "").trim();
        if (!prompt) {
          console.warn("[groq] rejected: empty prompt");
          return Response.json(
            { error: "Bad request", reason: "`prompt` is required." },
            { status: 400 },
          );
        }

        console.log(
          `[groq] POST /api/groq model=${body.model ?? GROQ_DEFAULT_MODEL} promptChars=${prompt.length}`,
        );

        try {
          const completion = await groqChat({
            ...(body.model ? { model: body.model } : {}),
            ...(body.temperature !== undefined ? { temperature: body.temperature } : {}),
            ...(body.maxTokens !== undefined ? { maxTokens: body.maxTokens } : {}),
            messages: [
              { role: "system", content: body.system ?? "You are a concise, technical assistant." },
              { role: "user", content: prompt },
            ],
          });
          console.log(
            `[groq] ok model=${completion.model} latency=${completion.latencyMs}ms tokens=${completion.usage?.total_tokens ?? "?"}`,
          );
          return Response.json({
            ok: true,
            content: completion.content,
            model: completion.model,
            latencyMs: completion.latencyMs,
            usage: completion.usage ?? null,
            totalMs: Date.now() - startedAt,
          });
        } catch (error) {
          const status = error instanceof GroqError ? error.status : 500;
          const reason = error instanceof Error ? error.message : String(error);
          console.error(`[groq] failed status=${status} reason=${reason}`);
          return Response.json({ error: "Groq request failed", reason }, { status });
        }
      },
    },
  },
});
