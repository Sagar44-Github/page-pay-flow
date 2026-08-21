import { createFileRoute } from "@tanstack/react-router";

import { DocGuideGrid, DocSections } from "@/components/marketing/DocSections";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";
import { Reveal } from "@/components/marketing/Reveal";
import { OVERVIEW_GUIDES, OVERVIEW_SECTIONS } from "@/content/docs/overview";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [{ title: "Documentation — PagePay" }],
  }),
  component: DocsIndexPage,
});

function DocsIndexPage() {
  return (
    <MarketingPageStatic>
      <DocsLayout
        title="Documentation"
        description="Everything you need to understand, integrate, and demo PagePay's x402 + Algorand payment flow — from first quote to on-chain proof."
      >
        <Reveal as="section">
          <h2>Guides</h2>
          <DocGuideGrid guides={OVERVIEW_GUIDES} />
        </Reveal>
        <DocSections sections={OVERVIEW_SECTIONS} />
      </DocsLayout>
    </MarketingPageStatic>
  );
}
