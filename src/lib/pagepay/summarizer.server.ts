/**
 * LLM summarization via Lovable AI. Streamed on the wire, consumed server-side,
 * so long documents don't trip request timeouts.
 */
import { streamText } from "ai";

import { createLovableAiGatewayProvider, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";

const MODEL = "google/gemini-2.5-flash";

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
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new SummarizerError("AI gateway is not configured.");

  const gateway = createLovableAiGatewayProvider(apiKey, getLovableAiGatewayRunId(request));

  try {
    const result = streamText({
      model: gateway(MODEL),
      system:
        "You are PagePay, a precise document summarizer. Produce a faithful summary of the supplied document. " +
        "Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. " +
        "Never invent facts that are not in the document.",
      prompt: `Document (${pages} page${pages === 1 ? "" : "s"}):\n\n${text}`,
    });
    const summary = await result.text;
    if (!summary.trim()) throw new SummarizerError("The model returned an empty summary.");
    return summary.trim();
  } catch (error) {
    if (error instanceof SummarizerError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new SummarizerError(`Summarization failed: ${message}`);
  }
}
