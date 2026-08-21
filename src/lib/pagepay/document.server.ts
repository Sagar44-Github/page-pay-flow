/**
 * Document intake: page counting and text extraction.
 * Pure-JS PDF reading (unpdf) so it runs on the edge runtime.
 */
import { extractText, getDocumentProxy } from "unpdf";

import { MAX_PAGES, MAX_TEXT_CHARS, WORDS_PER_PAGE, pagesForText } from "@/lib/pagepay/pricing";

export class DocumentError extends Error {
  constructor(public readonly reason: string) {
    super(reason);
    this.name = "DocumentError";
  }
}

export interface ParsedDocument {
  text: string;
  pages: number;
  source: "pdf" | "text";
  filename?: string;
  /** Text for each page (index = page number, 0-based). Used by chunk summarization. */
  pageTexts: string[];
}

export async function parsePdf(bytes: Uint8Array, filename?: string): Promise<ParsedDocument> {
  let pdf;
  try {
    pdf = await getDocumentProxy(bytes);
  } catch {
    throw new DocumentError("The uploaded file could not be read as a PDF.");
  }
  const pages = pdf.numPages;
  if (pages > MAX_PAGES) {
    throw new DocumentError(`Document has ${pages} pages; the limit is ${MAX_PAGES}.`);
  }
  const { text } = await extractText(pdf, { mergePages: false });
  const pageTexts: string[] = Array.isArray(text) ? text.map((t) => String(t)) : [String(text)];
  const merged = pageTexts.join("\n\n");
  if (!merged.trim()) {
    throw new DocumentError(
      "No extractable text found in the PDF (scanned images are not supported).",
    );
  }
  return {
    text: merged.slice(0, MAX_TEXT_CHARS),
    pages,
    source: "pdf",
    pageTexts,
    ...(filename ? { filename } : {}),
  };
}

/** Split raw text into page-sized chunks by word boundaries (WORDS_PER_PAGE words each). */
function splitTextIntoPages(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const pageTexts: string[] = [];
  for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
    pageTexts.push(words.slice(i, i + WORDS_PER_PAGE).join(" "));
  }
  return pageTexts.length > 0 ? pageTexts : [text];
}

export function parseTextInput(text: string): ParsedDocument {
  if (!text.trim()) throw new DocumentError("No text provided.");
  if (text.length > MAX_TEXT_CHARS) {
    throw new DocumentError(`Text is too long (${text.length} characters).`);
  }
  const pages = pagesForText(text);
  if (pages > MAX_PAGES) {
    throw new DocumentError(
      `Text works out to ${pages} pages (500 words each); the limit is ${MAX_PAGES}.`,
    );
  }
  const pageTexts = splitTextIntoPages(text);
  return { text, pages, source: "text", pageTexts };
}
