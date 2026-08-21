import { createFileRoute } from "@tanstack/react-router";

import { DocSections } from "@/components/marketing/DocSections";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";
import { X402_SECTIONS } from "@/content/docs/x402";

export const Route = createFileRoute("/docs/x402")({
  head: () => ({
    meta: [{ title: "x402 Protocol — PagePay Docs" }],
  }),
  component: DocsX402Page,
});

function DocsX402Page() {
  return (
    <MarketingPageStatic>
      <DocsLayout
        title="x402 protocol"
        description="Complete reference for HTTP 402 payment negotiation, x402 v2 headers, exact-AVM scheme, client retry flow, simulation modes, and error handling."
      >
        <DocSections sections={X402_SECTIONS} />
      </DocsLayout>
    </MarketingPageStatic>
  );
}
