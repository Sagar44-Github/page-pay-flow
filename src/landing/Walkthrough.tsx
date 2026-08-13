/**
 * First-visit walkthrough for the PagePay live demo.
 * Reuses the shadcn Dialog already in the project; fully skippable and reopenable.
 */
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SEEN_KEY = "pagepay.walkthrough.seen";

/** data-walkthrough attribute of the real element each step describes. */
const STEPS = [
  {
    target: "connect",
    title: "1 · Connect Pera Wallet",
    body: "Use “Connect Pera Wallet” in the header. On desktop, scan the QR with the Pera mobile app or use Pera Web at web.perawallet.app. Switch to Testnet and keep testnet USDC (not just ALGO) for payments.",
  },
  {
    target: "document",
    title: "2 · Add a document",
    body: "Upload a PDF or .txt (up to 10 MB, 20 pages), or paste raw text. 500 words of pasted text counts as one page.",
  },
  {
    target: "quote",
    title: "3 · Get a price",
    body: "“Get a price” parses your actual file server-side and returns the exact page count and USD price — the same numbers the payment will charge.",
  },
  {
    target: "pay",
    title: "4 · Pay and summarize",
    body: "The first request comes back as HTTP 402 with payment requirements. Pera asks you to sign, the payment settles on Algorand, and the retry returns your summary.",
  },
  {
    target: "summary",
    title: "5 · Read the result",
    body: "The summary card shows pages paid, the amount, and a link to the transaction. Request status and raw 402/200 payloads sit right below it.",
  },
] as const;

function highlight(target: string | null) {
  document.querySelectorAll("[data-walkthrough]").forEach((element) => {
    element.classList.remove("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background");
  });
  if (!target) return;
  const element = document.querySelector(`[data-walkthrough="${target}"]`);
  if (!element) return;
  element.classList.add("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background");
  element.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function useWalkthrough() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) setOpen(true);
    } catch {
      /* storage blocked — never block the app */
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  return { open, setOpen, close };
}

export function Walkthrough({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index]!;

  useEffect(() => {
    if (!open) {
      highlight(null);
      return;
    }
    highlight(step.target);
  }, [open, step.target]);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  function finish() {
    highlight(null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) finish();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">{step.title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">{step.body}</DialogDescription>
        </DialogHeader>
        <p className="font-mono text-[11px] text-muted-foreground">
          step {index + 1} of {STEPS.length}
        </p>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" size="sm" onClick={finish}>
            Skip
          </Button>
          <div className="flex gap-2">
            {index > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIndex((current) => current - 1)}
              >
                Back
              </Button>
            )}
            {index < STEPS.length - 1 ? (
              <Button size="sm" onClick={() => setIndex((current) => current + 1)}>
                Next
              </Button>
            ) : (
              <Button size="sm" onClick={finish}>
                Start using it
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
