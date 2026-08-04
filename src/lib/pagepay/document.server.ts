/**
 * Document intake: page counting and text extraction.
 * Pure-JS PDF reading (unpdf) so it runs on the edge runtime.
 */
import { extractText, getDocumentProxy } from "unpdf";

import { MAX_PAGES, MAX_TEXT_CHARS, pagesForText } from "@/lib/pagepay/pricing";

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
  const { text } = await extractText(pdf, { mergePages: true });
  const merged = Array.isArray(text) ? text.join("\n\n") : text;
  if (!merged.trim()) {
    throw new DocumentError(
      "No extractable text found in the PDF (scanned images are not supported).",
    );
  }
  return {
    text: merged.slice(0, MAX_TEXT_CHARS),
    pages,
    source: "pdf",
    ...(filename ? { filename } : {}),
  };
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
  return { text, pages, source: "text" };
}
