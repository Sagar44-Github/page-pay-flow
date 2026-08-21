/**
 * Lightweight in-memory document cache for chunk-mode summarization.
 *
 * When the first chunk is requested, the full document is parsed, cached under
 * a random session ID, and subsequent chunk requests reference that ID instead
 * of re-uploading the file.  Entries expire after CACHE_TTL_MS.
 */
import type { ParsedDocument } from "@/lib/pagepay/document.server";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry {
  doc: ParsedDocument;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function evictExpired() {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now >= entry.expiresAt) cache.delete(key);
  }
}

/** Store a parsed document and return its session ID. */
export function cacheDocument(doc: ParsedDocument): string {
  evictExpired();
  const sessionId = crypto.randomUUID();
  cache.set(sessionId, { doc, expiresAt: Date.now() + CACHE_TTL_MS });
  return sessionId;
}

/** Retrieve a cached document by session ID, or null if expired/missing. */
export function getCachedDocument(sessionId: string): ParsedDocument | null {
  evictExpired();
  const entry = cache.get(sessionId);
  return entry ?? null ? entry!.doc : null;
}

/** Remove a specific session (e.g. after all chunks are fetched). */
export function removeCachedDocument(sessionId: string): void {
  cache.delete(sessionId);
}
