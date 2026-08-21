/**
 * LLM summarization. Prefers Lovable AI when LOVABLE_API_KEY is set;
 * falls back to Groq when only GROQ_API_KEY is configured (local dev).
 */
import { streamText } from "ai";

import { createLovableAiGatewayProvider, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";
import { groqChat } from "@/lib/groq/groq.server";

const MODEL = "google/gemini-2.5-flash";
const SYSTEM_PROMPT =
  "You are PagePay, a precise document summarizer. Produce a faithful summary of the supplied document. " +
  "Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. " +
  "Never invent facts that are not in the document.";

export class SummarizerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SummarizerError";
  }
}

export async function summarizeDocument(
  text: string,
  pages: number,
  request: Request,
): Promise<string> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const groqKey = process.env["GROQ_API_KEY"];
  if (!lovableKey && !groqKey) {
    throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
  }

  const prompt = `Document (${pages} page${pages === 1 ? "" : "s"}):\n\n${text}`;

  try {
    if (lovableKey) {
      const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
      const result = streamText({
        model: gateway(MODEL),
        system: SYSTEM_PROMPT,
        prompt,
      });
      const summary = await result.text;
      if (!summary.trim()) throw new SummarizerError("The model returned an empty summary.");
      return summary.trim();
    }

    const result = await groqChat({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      maxTokens: 900,
    });
    return result.content;
  } catch (error) {
    if (error instanceof SummarizerError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new SummarizerError(`Summarization failed: ${message}`);
  }
}

const CHUNK_SYSTEM_PROMPT =
  "You are PagePay, a precise document summarizer. You are summarizing a specific SECTION of a larger document. " +
  "Produce a faithful summary of ONLY the provided section. " +
  "Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. " +
  "Never invent facts that are not in the document section.";

/**
 * Summarize a specific chunk (page range) of a document.
 * Uses a chunk-aware prompt so the LLM knows it's a partial document.
 */
export async function summarizeChunk(
  chunkText: string,
  chunkIndex: number,
  totalChunks: number,
  chunkPages: number,
  startPage: number,
  endPage: number,
  request: Request,
): Promise<string> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const groqKey = process.env["GROQ_API_KEY"];
  if (!lovableKey && !groqKey) {
    throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
  }

  const prompt =
    `Document section: chunk ${chunkIndex + 1} of ${totalChunks} ` +
    `(pages ${startPage + 1}–${endPage}, ${chunkPages} page${chunkPages === 1 ? "" : "s"}):\n\n${chunkText}`;

  try {
    if (lovableKey) {
      const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
      const result = streamText({
        model: gateway(MODEL),
        system: CHUNK_SYSTEM_PROMPT,
        prompt,
      });
      const summary = await result.text;
      if (!summary.trim()) throw new SummarizerError("The model returned an empty summary.");
      return summary.trim();
    }

    const result = await groqChat({
      messages: [
        { role: "system", content: CHUNK_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      maxTokens: 600,
    });
    return result.content;
  } catch (error) {
    if (error instanceof SummarizerError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new SummarizerError(`Chunk summarization failed: ${message}`);
  }
}

