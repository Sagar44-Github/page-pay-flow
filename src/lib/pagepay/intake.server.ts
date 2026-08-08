/**
 * Shared request -> document intake, used by BOTH /api/price and /api/summarize
 * so the quoted page count can never disagree with the charged page count.
 */
import { MAX_UPLOAD_BYTES } from "@/lib/pagepay/pricing";
import {
  DocumentError,
  parsePdf,
  parseTextInput,
  type ParsedDocument,
} from "@/lib/pagepay/document.server";

export async function readDocumentFromRequest(request: Request): Promise<ParsedDocument> {
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
