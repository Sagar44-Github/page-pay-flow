import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Wallet + WebGL both touch browser globals at import time, so the page is client-only.
const LandingPage = lazy(() => import("@/landing/LandingPage"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PagePay — Pay-per-page AI summaries over x402 on Algorand" },
      {
        name: "description",
        content:
          "PagePay charges one cent per page for AI document summaries using the x402 payment protocol, settled on Algorand Testnet with Pera Wallet. No accounts, no subscriptions.",
      },
      { property: "og:title", content: "PagePay — Pay-per-page AI summaries over x402" },
      {
        property: "og:description",
        content:
          "Submit a document, get an HTTP 402 quote, pay per page from Pera Wallet, and receive an AI summary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-mono text-xs text-muted-foreground">
      loading pagepay…
    </div>
  );
}

function Index() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <LandingPage />
      </Suspense>
    </ClientOnly>
  );
}
