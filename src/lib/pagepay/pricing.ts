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

/** Page count for a raw text chunk: ceil(words / 500), minimum 1. */
export function pagesForText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_PAGE));
}

/** USD price string in x402 `Money` format, e.g. "$0.03". */
export function priceForPages(pages: number): string {
  return `$${(pages * PRICE_PER_PAGE_USD).toFixed(2)}`;
}

/** Format an atomic asset amount (base units) for display. */
export function formatAtomicAmount(atomic: string, decimals = 6): string {
  const negative = atomic.startsWith("-");
  const digits = (negative ? atomic.slice(1) : atomic).padStart(decimals + 1, "0");
  const whole = digits.slice(0, digits.length - decimals);
  const frac = digits.slice(digits.length - decimals).replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${frac ? `.${frac}` : ""}`;
}
