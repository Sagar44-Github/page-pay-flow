import { createFileRoute } from "@tanstack/react-router";

import { DocSections } from "@/components/marketing/DocSections";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";
import { INTEGRATIONS_SECTIONS } from "@/content/docs/integrations";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [{ title: "Integrations — PagePay" }],
  }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  return (
    <MarketingPageStatic>
      <DocsLayout
        title="Integrations"
        description="Connect PagePay to Pera Wallet, GoPlausible facilitator, Circle USDC faucet, Groq AI, and the x402 protocol sandbox."
      >
        <DocSections sections={INTEGRATIONS_SECTIONS} />
      </DocsLayout>
    </MarketingPageStatic>
  );
}
