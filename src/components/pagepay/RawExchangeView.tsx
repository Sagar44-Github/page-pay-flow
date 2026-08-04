import { useState } from "react";

import { cn } from "@/lib/utils";
import type { RawExchange } from "@/lib/x402/client";

/** Verbatim HTTP status + headers + body, so judges can inspect the raw 402. */
export function RawExchangeView({
  title,
  exchange,
  defaultOpen = false,
}: {
  title: string;
  exchange: RawExchange;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const is402 = exchange.status === 402;

  return (
    <div className="rounded-lg border border-border bg-card/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <span
            className={cn(
              "rounded px-2 py-0.5 font-mono text-xs",
              is402
                ? "bg-accent text-accent-foreground"
                : exchange.status >= 400
                  ? "bg-destructive/15 text-destructive"
                  : "bg-primary/15 text-primary",
            )}
          >
            {exchange.status} {exchange.statusText || ""}
          </span>
          {title}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{open ? "hide" : "show"}</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-border px-4 py-3">
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Response headers
            </p>
            <pre className="max-h-48 overflow-auto rounded bg-muted p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {Object.entries(exchange.headers)
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n")}
            </pre>
          </div>
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Response body (verbatim)
            </p>
            <pre className="max-h-72 overflow-auto rounded bg-muted p-3 font-mono text-[11px] leading-relaxed text-card-foreground">
              {exchange.body || "(empty)"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
