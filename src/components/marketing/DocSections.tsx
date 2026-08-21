import { Link } from "@tanstack/react-router";

import { CodeBlock } from "@/components/marketing/CodeBlock";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";
import { MarketingCard } from "@/components/marketing/MarketingCard";
import { Reveal } from "@/components/marketing/Reveal";

export type DocSection = {
  id: string;
  title: string;
  body: string;
  code?: { title: string; code: string };
};

export function DocSections({ sections }: { sections: DocSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <Reveal key={section.id} delay={index * 60} as="section">
          <div id={section.id}>
            <h2 className="font-display text-xl text-foreground">{section.title}</h2>
            <MarkdownContent>{section.body}</MarkdownContent>
            {section.code ? (
              <div className="not-prose mt-6">
                <CodeBlock title={section.code.title} code={section.code.code} />
              </div>
            ) : null}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function DocGuideGrid({
  guides,
}: {
  guides: readonly { to: string; title: string; description: string }[];
}) {
  return (
    <div className="not-prose grid gap-4 sm:grid-cols-2">
      {guides.map((guide, index) => (
        <Reveal key={guide.to} delay={index * 80}>
          <Link to={guide.to} className="block h-full">
            <MarketingCard title={guide.title} description={guide.description} className="h-full" />
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
