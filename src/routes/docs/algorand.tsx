import { createFileRoute } from "@tanstack/react-router";

import { DocSections } from "@/components/marketing/DocSections";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";
import { ALGORAND_SECTIONS } from "@/content/docs/algorand";

export const Route = createFileRoute("/docs/algorand")({
  head: () => ({
    meta: [{ title: "Algorand — PagePay Docs" }],
  }),
  component: DocsAlgorandPage,
});

function DocsAlgorandPage() {
  return (
    <MarketingPageStatic>
      <DocsLayout
        title="Algorand settlement"
        description="Deep dive into Testnet configuration, USDC ASA 10458941, transaction groups, Pera ARC-0001 signing, GoPlausible facilitator, and on-chain verification."
      >
        <DocSections sections={ALGORAND_SECTIONS} />
      </DocsLayout>
    </MarketingPageStatic>
  );
}
