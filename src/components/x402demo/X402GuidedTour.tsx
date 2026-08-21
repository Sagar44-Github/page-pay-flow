import { useEffect, useRef } from "react";

const STORAGE_KEY = "pagepay.x402-demo.guided-tour";

/**
 * Auto-plays Happy path → Test Mode once per browser, demonstrating the protocol sandbox.
 */
export function useX402GuidedTour({
  onSelectHappy,
  onRunTestMode,
  enabled,
}: {
  onSelectHappy: () => void;
  onRunTestMode: () => void | Promise<void>;
  enabled: boolean;
}) {
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "done") return;
    } catch {
      /* ignore */
    }

    started.current = true;
    const timer = window.setTimeout(async () => {
      onSelectHappy();
      await new Promise((r) => setTimeout(r, 900));
      await onRunTestMode();
      try {
        localStorage.setItem(STORAGE_KEY, "done");
      } catch {
        /* ignore */
      }
      document.getElementById("x402-http-exchange")?.scrollIntoView({ behavior: "smooth" });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [enabled, onSelectHappy, onRunTestMode]);
}

export function resetX402GuidedTour() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
