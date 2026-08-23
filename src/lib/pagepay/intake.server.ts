/**
 * Shared request -> document intake for single and multi-document endpoints.
 */
import { MAX_UPLOAD_BYTES, MAX_PAGES } from "@/lib/pagepay/pricing";
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

export interface TwoDocuments {
  docA: ParsedDocument;
  docB: ParsedDocument;
  combinedPages: number;
}

async function parseSingleFromForm(
  form: FormData,
  fileKey: string,
  textKey: string,
  docLabel: string,
): Promise<ParsedDocument> {
  const file = form.get(fileKey);
  const text = form.get(textKey);

  if (file && typeof file !== "string" && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new DocumentError(`${docLabel} is larger than the 10 MB limit.`);
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (isPdf) return parsePdf(bytes, file.name);
    const decoded = new TextDecoder().decode(bytes);
    return { ...parseTextInput(decoded), filename: file.name };
  }

  if (typeof text === "string" && text.trim().length > 0) {
    return parseTextInput(text);
  }

  throw new DocumentError(`${docLabel} is missing or empty. Provide a file or text for ${docLabel}.`);
}

function parseSingleFromObject(
  obj: unknown,
  docLabel: string,
): ParsedDocument {
  if (!obj) {
    throw new DocumentError(`${docLabel} is missing. Provide text or file for ${docLabel}.`);
  }
  if (typeof obj === "string") {
    if (!obj.trim()) {
      throw new DocumentError(`${docLabel} is empty.`);
    }
    try {
      return parseTextInput(obj);
    } catch (err) {
      if (err instanceof DocumentError) {
        throw new DocumentError(`${docLabel} is invalid: ${err.reason}`);
      }
      throw err;
    }
  }
  if (typeof obj === "object" && obj !== null) {
    const record = obj as { text?: unknown; filename?: unknown };
    if (typeof record.text === "string" && record.text.trim().length > 0) {
      try {
        return {
          ...parseTextInput(record.text),
          ...(typeof record.filename === "string" ? { filename: record.filename } : {}),
        };
      } catch (err) {
        if (err instanceof DocumentError) {
          throw new DocumentError(`${docLabel} is invalid: ${err.reason}`);
        }
        throw err;
      }
    }
  }
  throw new DocumentError(`${docLabel} must be a text string or object with text.`);
}

export async function readTwoDocumentsFromRequest(request: Request): Promise<TwoDocuments> {
  const contentType = request.headers.get("content-type") ?? "";

  let docA: ParsedDocument;
  let docB: ParsedDocument;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const fileA = form.get("fileA") || form.get("documentA");
    const textA = form.get("textA") || form.get("documentA");
    const fileB = form.get("fileB") || form.get("documentB");
    const textB = form.get("textB") || form.get("documentB");

    const fileKeyA = fileA && typeof fileA !== "string" && fileA.size > 0 ? (form.has("fileA") ? "fileA" : "documentA") : (form.has("textA") ? "textA" : "documentA");
    const fileKeyB = fileB && typeof fileB !== "string" && fileB.size > 0 ? (form.has("fileB") ? "fileB" : "documentB") : (form.has("textB") ? "textB" : "documentB");

    docA = await parseSingleFromForm(form, fileKeyA, "textA", "Document A");
    docB = await parseSingleFromForm(form, fileKeyB, "textB", "Document B");
  } else {
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      throw new DocumentError("Request body must be JSON or multipart/form-data.");
    }

    const body = (payload ?? {}) as Record<string, unknown>;

    const valA = body["documentA"] ?? body["textA"] ?? body["docA"];
    const valB = body["documentB"] ?? body["textB"] ?? body["docB"];

    if (!valA) {
      throw new DocumentError("Document A is missing. Provide documentA or textA in JSON.");
    }
    if (!valB) {
      throw new DocumentError("Document B is missing. Provide documentB or textB in JSON.");
    }

    docA = parseSingleFromObject(valA, "Document A");
    docB = parseSingleFromObject(valB, "Document B");
  }

  // Validate page counts individually against MAX_PAGES
  if (docA.pages > MAX_PAGES) {
    throw new DocumentError(`Document A exceeds the maximum allowed page count of ${MAX_PAGES} pages (got ${docA.pages}).`);
  }
  if (docB.pages > MAX_PAGES) {
    throw new DocumentError(`Document B exceeds the maximum allowed page count of ${MAX_PAGES} pages (got ${docB.pages}).`);
  }

  return {
    docA,
    docB,
    combinedPages: docA.pages + docB.pages,
  };
}
