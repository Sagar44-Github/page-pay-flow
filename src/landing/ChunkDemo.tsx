/**
 * ChunkDemo — pay-per-chunk summarization UI.
 *
 * Sibling of LiveDemo; renders when the user toggles to "chunk" mode.
 * Re-uses payAndFetch from x402/client and the same Card/Row styling.
 */
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";
import {
  chunkInfoForDocument,
  PAGES_PER_CHUNK,
  priceForPages,
} from "@/lib/pagepay/pricing";
import type { PeraWallet } from "@/lib/wallet/pera";
import {
  TESTNET_DISPENSER_URL,
  payAndFetch,
  type PaidRequestResult,
  type PaymentFailureCode,
  type PaymentPhase,
} from "@/lib/x402/client";

/* ── shared helpers (same as LiveDemo) ── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 break-all text-right font-mono text-[11px] text-card-foreground">
        {children}
      </span>
    </div>
  );
}

type FriendlyError = { message: string; action?: "connect" | "fund" };

const FAILURE_COPY: Record<PaymentFailureCode, FriendlyError> = {
  cancelled: {
    message:
      "Payment was cancelled in Pera Wallet. Tap the button again when you're ready.",
  },
  insufficient_funds: {
    message:
      "Your wallet needs testnet USDC (ASA 10458941) for the payment, plus a little testnet ALGO for fees.",
    action: "fund",
  },
  requirements_unreadable: {
    message: "The server's 402 payment requirements couldn't be read.",
  },
  signing_failed: {
    message: "Pera Wallet couldn't sign the payment. Look for the Pera tab/QR and approve.",
  },
  verification_failed: {
    message: "Payment could not be verified — wait a moment and try again.",
  },
  quote_mismatch: {
    message: "The price changed. Try again to get a fresh quote.",
  },
  gateway_unavailable: {
    message: "The payment facilitator didn't respond — try again in a few seconds.",
  },
  network: {
    message: "Lost connection while processing payment. Check your connection and try again.",
  },
  bad_request: {
    message: "The document couldn't be read for this chunk.",
  },
  server_error: {
    message: "Something went wrong on the server after the request was sent.",
  },
};

const PHASE_LABEL: Record<PaymentPhase, string> = {
  quoting: "requesting 402 quote",
  awaiting_signature: "awaiting signature in Pera",
  submitted: "payment submitted",
  verifying: "verifying settlement",
  settled: "settled",
  failed: "failed",
};

interface ChunkResult {
  summary: string;
  chunkIndex: number;
  totalChunks: number;
  chunkPages: number;
  totalPages: number;
  hasMore: boolean;
  sessionId: string;
  pricePaid: string;
  amountPaid: string;
  txId: string;
  explorer: string;
  payer?: string;
  network?: string;
}

interface Props {
  wallet: PeraWallet;
  /** Total pages in the document (from /api/price). */
  totalPages: number;
  /** The original file for upload, or null if text-only. */
  file: File | null;
  /** Raw text, used when file is null. */
  text: string;
}

export function ChunkDemo({ wallet, totalPages, file, text }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chunks, setChunks] = useState<ChunkResult[]>([]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<PaymentPhase | null>(null);
  const [error, setError] = useState<FriendlyError | null>(null);

  const nextChunkIndex = chunks.length;
  const nextChunk = chunkInfoForDocument(totalPages, nextChunkIndex);
  const allDone = chunks.length > 0 && !chunks[chunks.length - 1].hasMore;

  const pagesPaidSoFar = chunks.reduce((acc, c) => acc + c.chunkPages, 0);
  const pagesRemaining = totalPages - pagesPaidSoFar;

  function fail(next: FriendlyError) {
    setError(next);
  }

  async function handlePayForChunk() {
    setError(null);
    setPhase(null);

    if (!wallet.signer) {
      fail({ message: "Connect Pera Wallet in the header first.", action: "connect" });
      return;
    }

    setRunning(true);
    try {
      // Build request body.
      let init: RequestInit;
      if (sessionId) {
        // Subsequent chunks: just send sessionId + chunkIndex.
        init = {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId, chunkIndex: nextChunkIndex }),
        };
      } else if (file) {
        // First chunk with file upload.
        const form = new FormData();
        form.set("file", file);
        form.set("chunkIndex", String(nextChunkIndex));
        init = { method: "POST", body: form };
      } else {
        // First chunk with text.
        init = {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text, chunkIndex: nextChunkIndex }),
        };
      }

      const result = await payAndFetch("/api/summarize/chunk", init, wallet.signer, {
        expectedPages: nextChunk.chunkPages,
        onPhase: setPhase,
      });

      if (!result.ok) {
        console.error("[pagepay:chunk] payment failed", result.failureCode, result.error);
        const friendly = result.failureCode ? FAILURE_COPY[result.failureCode] : undefined;
        fail(
          friendly ?? {
            message: "The payment couldn't be completed. Check the browser console for details.",
          },
        );
        return;
      }

      const chunkResult = result.result as ChunkResult;
      setChunks((prev) => [...prev, chunkResult]);
      if (chunkResult.sessionId) {
        setSessionId(chunkResult.sessionId);
      }
    } catch (runError) {
      console.error("[pagepay:chunk] unexpected error", runError);
      setPhase("failed");
      fail({ message: "An unexpected error occurred. Details in the browser console." });
    } finally {
      setRunning(false);
    }
  }

  const nextChunkPrice = priceForPages(nextChunk.chunkPages);

  return (
    <div className="space-y-6">
      {/* ── Progress tracker ── */}
      <Card title="Chunk progress">
        <Row label="Total pages">{totalPages}</Row>
        <Row label="Pages per chunk">{PAGES_PER_CHUNK}</Row>
        <Row label="Total chunks">{nextChunk.totalChunks}</Row>
        <Row label="Chunks fetched">{chunks.length}</Row>
        <Row label="Pages paid">{pagesPaidSoFar}</Row>
        <Row label="Pages remaining">{pagesRemaining}</Row>
        {phase && (
          <Row label="Status">
            <span className={phase === "failed" ? "text-destructive" : ""}>
              {PHASE_LABEL[phase]}
            </span>
          </Row>
        )}
      </Card>

      {/* ── Action button ── */}
      <Card title={chunks.length === 0 ? "Start chunked summarization" : "Next chunk"}>
        {!allDone ? (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              Chunk {nextChunkIndex + 1} of {nextChunk.totalChunks} ·{" "}
              {nextChunk.chunkPages} page{nextChunk.chunkPages === 1 ? "" : "s"} ·{" "}
              <span className="font-semibold text-card-foreground">{nextChunkPrice}</span>
            </p>
            <Button disabled={running} onClick={() => void handlePayForChunk()}>
              {running
                ? "Processing…"
                : chunks.length === 0
                  ? `Pay ${nextChunkPrice} for chunk 1`
                  : `Get chunk ${nextChunkIndex + 1} (${nextChunkPrice})`}
            </Button>
          </>
        ) : (
          <p className="text-sm text-primary font-medium">
            ✓ All {nextChunk.totalChunks} chunks summarized!
          </p>
        )}

        {error && (
          <div
            className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            role="alert"
          >
            <p>{error.message}</p>
            {error.action === "connect" && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={() => void wallet.connect()}
              >
                Connect Pera Wallet
              </Button>
            )}
            {error.action === "fund" && (
              <a
                className="mt-2 inline-block font-mono text-[11px] underline underline-offset-2"
                href={TESTNET_DISPENSER_URL}
                target="_blank"
                rel="noreferrer"
              >
                open the Algorand testnet dispenser →
              </a>
            )}
          </div>
        )}
      </Card>

      {/* ── Chunk summaries ── */}
      {chunks.map((c) => (
        <Card key={c.chunkIndex} title={`Chunk ${c.chunkIndex + 1} of ${c.totalChunks}`}>
          <div className="rounded-lg border border-border/60 bg-background/40 p-4">
            <MarkdownContent>{c.summary}</MarkdownContent>
          </div>
          <div className="mt-4">
            <Row label="Pages">
              {c.chunkIndex * PAGES_PER_CHUNK + 1}–
              {c.chunkIndex * PAGES_PER_CHUNK + c.chunkPages} of {c.totalPages}
            </Row>
            <Row label="Paid">{c.pricePaid}</Row>
            <Row label="Transaction">
              {c.explorer ? (
                <Link
                  to="/receipt/$txId"
                  params={{ txId: c.txId }}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {c.txId}
                </Link>
              ) : (
                c.txId ?? "—"
              )}
            </Row>
          </div>
        </Card>
      ))}
    </div>
  );
}
