import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export type LogLevel = "info" | "warn" | "error" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  detail?: string;
}

const LEVEL_STYLES: Record<LogLevel, string> = {
  info: "text-sky-300",
  warn: "text-amber-300",
  error: "text-red-400",
  success: "text-primary",
};

const LEVEL_LABELS: Record<LogLevel, string> = {
  info: "INFO",
  warn: "WARN",
  error: "ERR ",
  success: "OK  ",
};

/** Scrollable, monospace, colour-coded log console. */
export function LogConsole({ entries, onClear }: { entries: LogEntry[]; onClear: () => void }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [entries.length]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-[oklch(0.16_0.01_260)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          live log console · {entries.length} events
        </p>
        <button
          type="button"
          onClick={onClear}
          className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          clear
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-[11px] leading-relaxed">
        {entries.length === 0 && (
          <p className="text-muted-foreground">
            waiting for events — run a simulation to stream protocol logs…
          </p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-2 py-[2px]">
            <span className="shrink-0 text-muted-foreground/70">
              {entry.timestamp.slice(11, 23)}
            </span>
            <span className={cn("shrink-0 whitespace-pre", LEVEL_STYLES[entry.level])}>
              {LEVEL_LABELS[entry.level]}
            </span>
            <span className="shrink-0 text-muted-foreground">[{entry.source}]</span>
            <span className="min-w-0 break-words text-foreground/90">
              {entry.message}
              {entry.detail && (
                <span className="text-muted-foreground"> — {entry.detail}</span>
              )}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
