/**
 * Groq (OpenAI-compatible) helper. Server-only: GROQ_API_KEY never reaches the client.
 */

export const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
export const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile";
export const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-4-scout-17b-16e-instruct"] as const;

export type GroqModel = (typeof GROQ_MODELS)[number];

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class GroqError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "GroqError";
    this.status = status;
  }
}

export interface GroqCompletion {
  content: string;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  latencyMs: number;
}

export async function groqChat(options: {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<GroqCompletion> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) throw new GroqError("GROQ_API_KEY is not configured.", 500);

  const model =
    options.model && GROQ_MODELS.includes(options.model as GroqModel)
      ? options.model
      : GROQ_DEFAULT_MODEL;

  const startedAt = Date.now();
  let response: Response;
  try {
    response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 700,
      }),
    });
  } catch (error) {
    throw new GroqError(
      `Groq request failed: ${error instanceof Error ? error.message : String(error)}`,
      504,
    );
  }

  const text = await response.text();
  if (!response.ok) {
    throw new GroqError(`Groq returned ${response.status}: ${text.slice(0, 400)}`, response.status);
  }

  let parsed: {
    choices?: { message?: { content?: string } }[];
    usage?: GroqCompletion["usage"];
    model?: string;
  };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new GroqError("Groq returned a non-JSON response.");
  }

  const content = parsed.choices?.[0]?.message?.content?.trim();
  if (!content) throw new GroqError("Groq returned an empty completion.");

  return {
    content,
    model: parsed.model ?? model,
    ...(parsed.usage ? { usage: parsed.usage } : {}),
    latencyMs: Date.now() - startedAt,
  };
}
