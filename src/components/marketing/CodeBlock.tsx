import { cn } from "@/lib/utils";

export function CodeBlock({
  title,
  code,
  className,
}: {
  title?: string;
  code: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      {title && (
        <div className="border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
