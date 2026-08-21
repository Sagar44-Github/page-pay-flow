/**
 * PagePay pricing rules — shared by the server (x402 route config) and the demo UI.
 *
 * A "page" is a real PDF page, or ~500 words of raw text.
 * Price is $0.01 per page, computed per request (never a fixed route price).
 */

export const WORDS_PER_PAGE = 500;
export const PRICE_PER_PAGE_USD = 0.01;
export const MAX_PAGES = 20;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_TEXT_CHARS = 400_000;

/** Number of document pages grouped into a single payable chunk. */
export const PAGES_PER_CHUNK = 2;

export interface ChunkInfo {
  /** 0-based chunk index. */
  chunkIndex: number;
  /** Total number of chunks for this document. */
  totalChunks: number;
  /** Number of pages in THIS chunk (may be < PAGES_PER_CHUNK for the last chunk). */
  chunkPages: number;
  /** 0-indexed start page (inclusive). */
  startPage: number;
  /** 0-indexed end page (exclusive). */
  endPage: number;
  /** Whether more chunks remain after this one. */
  hasMore: boolean;
}

/** Compute chunk metadata for a given document size and chunk index. */
export function chunkInfoForDocument(totalPages: number, chunkIndex: number): ChunkInfo {
  const totalChunks = Math.max(1, Math.ceil(totalPages / PAGES_PER_CHUNK));
  const clamped = Math.max(0, Math.min(chunkIndex, totalChunks - 1));
  const startPage = clamped * PAGES_PER_CHUNK;
  const endPage = Math.min(startPage + PAGES_PER_CHUNK, totalPages);
  return {
    chunkIndex: clamped,
    totalChunks,
    chunkPages: endPage - startPage,
    startPage,
    endPage,
    hasMore: clamped < totalChunks - 1,
  };
}

/** Page count for a raw text chunk: ceil(words / 500), minimum 1. */
export function pagesForText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_PAGE));
}

/** USD price string in x402 `Money` format, e.g. "$0.03". */
export function priceForPages(pages: number, ratePerPageUsd = PRICE_PER_PAGE_USD): string {
  return `$${(pages * ratePerPageUsd).toFixed(2)}`;
}

/** Format an atomic asset amount (base units) for display. */
export function formatAtomicAmount(atomic: string, decimals = 6): string {
  const negative = atomic.startsWith("-");
  const digits = (negative ? atomic.slice(1) : atomic).padStart(decimals + 1, "0");
  const whole = digits.slice(0, digits.length - decimals);
  const frac = digits.slice(digits.length - decimals).replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${frac ? `.${frac}` : ""}`;
}
