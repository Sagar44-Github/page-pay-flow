/**
 * LLM summarization. Prefers Lovable AI when LOVABLE_API_KEY is set;
 * falls back to Groq when only GROQ_API_KEY is configured (local dev).
 */
import { streamText } from "ai";

import { createLovableAiGatewayProvider, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";
import { groqChat } from "@/lib/groq/groq.server";

export type ExtractionMode = "summary" | "action_items" | "key_risks";

const MODEL = "google/gemini-2.5-flash";

const PROMPTS: Record<ExtractionMode, { system: string; userLabel: string }> = {
  summary: {
    system:
      "You are PagePay, a precise document summarizer. Produce a faithful summary of the supplied document. " +
      "Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. " +
      "Never invent facts that are not in the document.",
    userLabel: "Document",
  },
  action_items: {
    system:
      "You are PagePay Action Item Extractor. Focus strictly on identifying concrete actionable tasks, assignments, deadlines, deliverables, and obligations from the text. " +
      "Structure your response with markdown: an 'Action Items Summary' paragraph, then a bulleted list of 'Action Items & Tasks' specifying responsible parties/owners and deadlines if mentioned, then an 'Immediate Next Steps' section. " +
      "If no clear tasks are found, explicitly state that.",
    userLabel: "Document (Action Item Extraction)",
  },
  key_risks: {
    system:
      "You are PagePay Risk & Concern Analyst. Focus strictly on identifying risky, ambiguous, alarming, or notable clauses, statements, financial liabilities, or operational red flags in the text. " +
      "Structure your response with markdown: a 'Risk Overview' paragraph, then a bulleted list of 'Flagged Risks & Liabilities' categorizing each risk by severity (High / Medium / Low), then a 'Mitigation / Cautionary Notes' section. " +
      "Never invent risks not grounded in the text.",
    userLabel: "Document (Risk Analysis)",
  },
};

const RANGE_PROMPTS: Record<ExtractionMode, { system: string; userLabel: string }> = {
  summary: {
    system:
      "You are PagePay, a precise document summarizer. You are summarizing a specific PAGE RANGE of a larger document. " +
      "Produce a faithful summary of ONLY the provided pages. " +
      "Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. " +
      "Never invent facts that are not in the document section.",
    userLabel: "Document pages",
  },
  action_items: {
    system:
      "You are PagePay Action Item Extractor. You are processing a specific PAGE RANGE of a larger document. " +
      "Focus strictly on identifying concrete actionable tasks, assignments, deadlines, deliverables, and obligations in ONLY these pages. " +
      "Structure your response with markdown: an 'Action Items Summary' paragraph, then a bulleted list of 'Action Items & Tasks' specifying responsible parties/owners and deadlines if mentioned, then an 'Immediate Next Steps' section.",
    userLabel: "Document pages (Action Item Extraction)",
  },
  key_risks: {
    system:
      "You are PagePay Risk & Concern Analyst. You are processing a specific PAGE RANGE of a larger document. " +
      "Focus strictly on identifying risky, ambiguous, alarming, or notable clauses, statements, liabilities, or red flags in ONLY these pages. " +
      "Structure your response with markdown: a 'Risk Overview' paragraph, then a bulleted list of 'Flagged Risks & Liabilities' categorizing each risk by severity (High / Medium / Low), then a 'Mitigation / Cautionary Notes' section.",
    userLabel: "Document pages (Risk Analysis)",
  },
};

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
  mode: ExtractionMode = "summary",
): Promise<string> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const groqKey = process.env["GROQ_API_KEY"];
  if (!lovableKey && !groqKey) {
    throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
  }

  const promptConfig = PROMPTS[mode] ?? PROMPTS.summary;
  const prompt = `${promptConfig.userLabel} (${pages} page${pages === 1 ? "" : "s"}):\n\n${text}`;

  try {
    if (lovableKey) {
      const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
      const result = streamText({
        model: gateway(MODEL),
        system: promptConfig.system,
        prompt,
      });
      const summary = await result.text;
      if (!summary.trim()) throw new SummarizerError("The model returned an empty response.");
      return summary.trim();
    }

    const result = await groqChat({
      messages: [
        { role: "system", content: promptConfig.system },
        { role: "user", content: prompt },
      ],
      maxTokens: 900,
    });
    return result.content;
  } catch (error) {
    if (error instanceof SummarizerError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new SummarizerError(`Processing failed (${mode}): ${message}`);
  }
}

const RANGE_SYSTEM_PROMPT =
  "You are PagePay, a precise document summarizer. You are summarizing a specific PAGE RANGE of a larger document. " +
  "Produce a faithful summary of ONLY the provided pages. " +
  "Use short markdown sections: a one-paragraph overview, then 3-8 key point bullets, then any explicit numbers, dates or obligations worth flagging. " +
  "Never invent facts that are not in the document section.";

/**
 * Summarize a specific page range of a document.
 * startPage and endPage are 1-indexed, inclusive on both ends.
 */
export async function summarizeRange(
  rangeText: string,
  startPage: number,
  endPage: number,
  totalPages: number,
  request: Request,
  mode: ExtractionMode = "summary",
): Promise<string> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const groqKey = process.env["GROQ_API_KEY"];
  if (!lovableKey && !groqKey) {
    throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
  }

  const promptConfig = RANGE_PROMPTS[mode] ?? RANGE_PROMPTS.summary;
  const rangePages = endPage - startPage + 1;
  const prompt =
    `${promptConfig.userLabel} ${startPage}–${endPage} of ${totalPages} ` +
    `(${rangePages} page${rangePages === 1 ? "" : "s"}):\n\n${rangeText}`;

  try {
    if (lovableKey) {
      const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
      const result = streamText({
        model: gateway(MODEL),
        system: promptConfig.system,
        prompt,
      });
      const summary = await result.text;
      if (!summary.trim()) throw new SummarizerError("The model returned an empty response.");
      return summary.trim();
    }

    const result = await groqChat({
      messages: [
        { role: "system", content: promptConfig.system },
        { role: "user", content: prompt },
      ],
      maxTokens: 600,
    });
    return result.content;
  } catch (error) {
    if (error instanceof SummarizerError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new SummarizerError(`Range processing failed (${mode}): ${message}`);
  }
}

