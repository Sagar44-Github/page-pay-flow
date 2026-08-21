import { createFileRoute } from "@tanstack/react-router";

import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Pricing } from "@/landing/Pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [{ title: "Pricing — PagePay" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <MarketingPage>
      {() => (
        <div className="py-8">
          <Pricing />
        </div>
      )}
    </MarketingPage>
  );
}
