import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { Container } from "./Container";

const DOC_LINKS = [
  { to: "/docs", label: "Overview", end: true },
  { to: "/docs/x402", label: "x402 protocol" },
  { to: "/docs/algorand", label: "Algorand settlement" },
  { to: "/developers", label: "API reference" },
  { to: "/integrations", label: "Integrations" },
  { to: "/x402-demo", label: "Protocol sandbox" },
] as const;

export function DocsLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="font-sans text-sm font-medium text-foreground">Documentation</p>
            <nav className="mt-4 space-y-1">
              {DOC_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "block rounded-lg px-3 py-2 font-sans text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  )}
                  activeProps={{ className: "bg-secondary text-foreground" }}
                  {...("end" in link && link.end ? { activeOptions: { exact: true } } : {})}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <article className="min-w-0">
          <header className="border-b border-border pb-8">
            <h1 className="text-display-hero text-foreground">{title}</h1>
            {description && (
              <p className="mt-4 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </header>
          <div className="prose-docs mt-10 space-y-8 font-sans text-base leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-foreground [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-foreground [&_a]:text-accent-blue [&_a]:underline-offset-4 [&_a:hover]:underline [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </div>
    </Container>
  );
}
