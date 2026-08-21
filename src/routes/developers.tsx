import { createFileRoute } from "@tanstack/react-router";

import { DocSections } from "@/components/marketing/DocSections";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";
import { DEVELOPERS_SECTIONS } from "@/content/docs/developers";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [{ title: "Developers — PagePay API" }],
  }),
  component: DevelopersPage,
});

function DevelopersPage() {
  return (
    <MarketingPageStatic>
      <DocsLayout
        title="API reference"
        description="Full HTTP API documentation: endpoints, request/response schemas, x402 headers, curl examples, client integration patterns, and error codes."
      >
        <DocSections sections={DEVELOPERS_SECTIONS} />
      </DocsLayout>
    </MarketingPageStatic>
  );
}
