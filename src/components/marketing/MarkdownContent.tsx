import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export function MarkdownContent({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("prose-markdown", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children: c }) => (
            <h1 className="mb-4 mt-8 font-display text-2xl text-foreground first:mt-0">{c}</h1>
          ),
          h2: ({ children: c }) => (
            <h2 className="mb-3 mt-8 font-display text-xl text-foreground first:mt-0">{c}</h2>
          ),
          h3: ({ children: c }) => (
            <h3 className="mb-2 mt-6 font-sans text-base font-semibold text-foreground">{c}</h3>
          ),
          p: ({ children: c }) => (
            <p className="mb-4 font-sans text-sm leading-relaxed text-muted-foreground last:mb-0">
              {c}
            </p>
          ),
          ul: ({ children: c }) => (
            <ul className="mb-4 list-disc space-y-2 pl-5 font-sans text-sm text-muted-foreground">
              {c}
            </ul>
          ),
          ol: ({ children: c }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-5 font-sans text-sm text-muted-foreground">
              {c}
            </ol>
          ),
          li: ({ children: c }) => <li className="leading-relaxed">{c}</li>,
          strong: ({ children: c }) => (
            <strong className="font-semibold text-foreground">{c}</strong>
          ),
          em: ({ children: c }) => <em className="italic text-muted-foreground">{c}</em>,
          code: ({ children: c }) => (
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">
              {c}
            </code>
          ),
          pre: ({ children: c }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-secondary p-4 font-mono text-xs leading-relaxed text-foreground">
              {c}
            </pre>
          ),
          a: ({ href, children: c }) => (
            <a
              href={href}
              className="font-sans text-accent-blue underline-offset-4 hover:underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {c}
            </a>
          ),
          blockquote: ({ children: c }) => (
            <blockquote className="mb-4 border-l-2 border-border pl-4 font-sans text-sm italic text-muted-foreground">
              {c}
            </blockquote>
          ),
          table: ({ children: c }) => (
            <div className="not-prose mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-left font-sans text-sm">{c}</table>
            </div>
          ),
          th: ({ children: c }) => (
            <th className="border border-border bg-secondary px-3 py-2 font-medium text-foreground">
              {c}
            </th>
          ),
          td: ({ children: c }) => (
            <td className="border border-border px-3 py-2 text-muted-foreground">{c}</td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
