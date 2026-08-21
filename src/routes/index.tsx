import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const LandingPage = lazy(() => import("@/landing/LandingPage"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PagePay — Pay-per-page AI over HTTP 402 on Algorand" },
      {
        name: "description",
        content:
          "SaaS-style pay-per-page document summarization with x402, Algorand Testnet USDC, and Pera Wallet.",
      },
    ],
  }),
  component: Index,
});

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-mono text-sm text-muted-foreground">
      Loading PagePay…
    </div>
  );
}

function Index() {
  return (
    <Suspense fallback={<Loading />}>
      <LandingPage />
    </Suspense>
  );
}
