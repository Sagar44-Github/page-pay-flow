import { createFileRoute } from "@tanstack/react-router";

import X402DemoApp from "@/components/x402demo/X402DemoApp";
import { MarketingPageStatic } from "@/components/marketing/MarketingPage";

export const Route = createFileRoute("/x402-demo")({
  head: () => ({
    meta: [
      { title: "x402 Protocol Demo — HTTP 402 payments + Groq AI" },
      {
        name: "description",
        content:
          "Interactive x402 demo: HTTP 402 challenge, signed X-Payment header, settlement, and a Groq-generated resource unlocked on payment — with live logs and raw HTTP payloads.",
      },
      { property: "og:title", content: "x402 Protocol Demo — HTTP 402 payments + Groq AI" },
      {
        property: "og:description",
        content:
          "Run happy-path, failed, timeout and invalid-token payment simulations against a real 402-gated API route.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: X402DemoPage,
});

function X402DemoPage() {
  return (
    <MarketingPageStatic>
      <X402DemoApp />
    </MarketingPageStatic>
  );
}
