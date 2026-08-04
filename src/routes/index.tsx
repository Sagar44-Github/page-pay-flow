import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Wallet SDKs touch browser globals at import time, so the whole app is client-only.
const PagePayApp = lazy(() => import("@/components/pagepay/PagePayApp"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PagePay — Pay-per-page AI summaries over x402 on Algorand" },
      {
        name: "description",
        content:
          "PagePay charges $0.01 per page for AI document summaries using the x402 payment protocol, settled on Algorand Testnet. No accounts, no subscriptions.",
      },
      { property: "og:title", content: "PagePay — Pay-per-page AI summaries over x402" },
      {
        property: "og:description",
        content:
          "Upload a document, get an HTTP 402 quote, pay per page from your Algorand wallet, and receive an AI summary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-sm text-muted-foreground">loading PagePay…</p>
    </div>
  );
}

function Index() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <PagePayApp />
      </Suspense>
    </ClientOnly>
  );
}
