/**
 * LLM summarization. Prefers Lovable AI when LOVABLE_API_KEY is set;
 * falls back to Groq when only GROQ_API_KEY is configured (local dev).
 */
import { streamText } from "ai";

import { createLovableAiGatewayProvider, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";
import { groqChat } from "@/lib/groq/groq.server";

export type ExtractionMode = "summary" | "action_items" | "key_risks" | "compliance_check";

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
  compliance_check: {
    system:
      "You are PagePay Compliance & Audit Specialist. Focus strictly on evaluating the document text against standard document and contract compliance categories:\n" +
      "1. Clear Parties & Roles (are specific entities, signers, or roles named?)\n" +
      "2. Dates & Deadlines (are effective dates, execution dates, or performance deadlines specified?)\n" +
      "3. Breach & Non-Performance Provisions (does it specify remedies, penalties, or consequences of default?)\n" +
      "4. Termination & Exit Clauses (does it define how the arrangement ends or notice periods?)\n" +
      "5. Dispute Resolution & Governing Law (does it specify jurisdiction, arbitration, or governing law?)\n\n" +
      "Structure your response strictly as a markdown compliance checklist. For EACH of the 5 categories above, evaluate the text and output either:\n" +
      "- '✅ [Category Name]: Present — [one-line summary note from the text]'\n" +
      "- '❌ [Category Name]: Not mentioned in this document — [brief explanation]'\n\n" +
      "Follow the checklist with a brief 2-sentence 'Compliance Summary' paragraph.",
    userLabel: "Document (Compliance Check)",
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
  compliance_check: {
    system:
      "You are PagePay Compliance & Audit Specialist. You are processing a specific PAGE RANGE of a larger document. " +
      "Evaluate ONLY these pages against 5 core compliance categories: (1) Clear Parties & Roles, (2) Dates & Deadlines, (3) Breach & Non-Performance Provisions, (4) Termination & Exit Clauses, and (5) Dispute Resolution & Governing Law. " +
      "Structure your response strictly as a markdown compliance checklist using '✅ Category: Present — note' or '❌ Category: Not mentioned — note'. Follow with a 2-sentence summary.",
    userLabel: "Document pages (Compliance Check)",
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

const COMPARISON_SYSTEM_PROMPT =
  "You are PagePay Document Comparator. You are given TWO documents: Document A and Document B. " +
  "Perform a precise, structured, side-by-side comparison of the two texts. " +
  "Structure your response with clear markdown headings:\n" +
  "1. **Overview of Comparison** — a brief 2-3 sentence high-level summary of how Document A and Document B relate.\n" +
  "2. **Present in Document A, Missing in Document B** — bulleted list of key clauses, terms, or provisions unique to Document A.\n" +
  "3. **Present in Document B, Missing in Document A** — bulleted list of key clauses, terms, or provisions unique to Document B.\n" +
  "4. **Side-by-Side Differences & Discrepancies** — a markdown table comparing specific dates, monetary amounts, penalties, obligations, or legal terms that differ between A and B.\n" +
  "5. **Comparative Conclusion** — key takeaways regarding risk, scope, or financial impact differences.\n" +
  "Never invent facts not present in either text.";

export async function compareDocuments(
  textA: string,
  pagesA: number,
  textB: string,
  pagesB: number,
  request: Request,
): Promise<string> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const groqKey = process.env["GROQ_API_KEY"];
  if (!lovableKey && !groqKey) {
    throw new SummarizerError("AI gateway is not configured (set LOVABLE_API_KEY or GROQ_API_KEY).");
  }

  const prompt =
    `DOCUMENT A (${pagesA} page${pagesA === 1 ? "" : "s"}):\n\n${textA}\n\n` +
    `========================================\n\n` +
    `DOCUMENT B (${pagesB} page${pagesB === 1 ? "" : "s"}):\n\n${textB}`;

  try {
    if (lovableKey) {
      const gateway = createLovableAiGatewayProvider(lovableKey, getLovableAiGatewayRunId(request));
      const result = streamText({
        model: gateway(MODEL),
        system: COMPARISON_SYSTEM_PROMPT,
        prompt,
      });
      const summary = await result.text;
      if (!summary.trim()) throw new SummarizerError("The model returned an empty response.");
      return summary.trim();
    }

    const result = await groqChat({
      messages: [
        { role: "system", content: COMPARISON_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      maxTokens: 1200,
    });
    return result.content;
  } catch (error) {
    if (error instanceof SummarizerError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new SummarizerError(`Document comparison failed: ${message}`);
  }
}
