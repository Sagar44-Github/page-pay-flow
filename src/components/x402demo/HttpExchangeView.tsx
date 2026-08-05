import { useState } from "react";

import { cn } from "@/lib/utils";

export interface HttpExchange {
  id: string;
  title: string;
  direction: "request" | "response";
  status?: number;
  statusText?: string;
  method?: string;
  url?: string;
  headers: Record<string, string>;
  body?: string;
}

/** Raw HTTP request/response viewer — headers and payload verbatim. */
export function HttpExchangeView({
  exchange,
  defaultOpen = false,
}: {
  exchange: HttpExchange;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const badge =
    exchange.direction === "request"
      ? `${exchange.method ?? "POST"}`
      : `${exchange.status ?? ""} ${exchange.statusText ?? ""}`.trim();

  return (
    <div className="rounded-lg border border-border bg-card/60">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-card-foreground">
          <span
            className={cn(
              "shrink-0 rounded px-2 py-0.5 font-mono text-[11px]",
              exchange.status === 402
                ? "bg-accent text-accent-foreground"
                : exchange.status && exchange.status >= 400
                  ? "bg-destructive/15 text-destructive"
                  : exchange.direction === "request"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/15 text-primary",
            )}
          >
            {badge}
          </span>
          <span className="truncate">{exchange.title}</span>
        </span>
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {open ? "hide" : "show"}
        </span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-border px-4 py-3">
          {exchange.url && (
            <p className="break-all font-mono text-[11px] text-muted-foreground">
              {exchange.method ?? ""} {exchange.url}
            </p>
          )}
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {exchange.direction === "request" ? "Request headers" : "Response headers"}
            </p>
            <pre className="max-h-44 overflow-auto rounded bg-muted p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {Object.entries(exchange.headers)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n") || "(none)"}
            </pre>
          </div>
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Payload (verbatim)
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
