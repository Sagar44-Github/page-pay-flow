import type { DocSection } from "@/components/marketing/DocSections";

export const OVERVIEW_SECTIONS: DocSection[] = [
  {
    id: "what-is-pagepay",
    title: "What is PagePay?",
    body: `PagePay is a **reference SaaS application** that demonstrates how to ship metered AI APIs using HTTP-native payments instead of API keys, prepaid credits, or custom billing dashboards.

The product surface is **pay-per-page document summarization**: a client uploads or pastes document text, receives an exact price quote, pays on-chain when the server returns HTTP **402 Payment Required**, and receives the AI-generated summary on the **retried request** with cryptographic settlement proof.

PagePay is intentionally **developer-first**. Every step of the protocol — quote headers, signed payment payloads, facilitator verify/settle calls, transaction IDs, and explorer links — is visible in the UI so you can audit the flow without trusting opaque app state.`,
  },
  {
    id: "architecture",
    title: "System architecture",
    body: `PagePay splits into four cooperating layers. Each layer has a single responsibility; together they model how you would integrate x402 into a production API product.

| Layer | Responsibility | Technology |
| --- | --- | --- |
| **Client** | Quote, sign, retry with payment header | React, Pera Wallet, \`@x402-avm\` |
| **API gateway** | Enforce 402, decode payment, fulfill | TanStack Start server routes |
| **Facilitator** | Verify signatures, submit atomic groups | GoPlausible hosted service |
| **Settlement** | On-chain USDC transfer | Algorand Testnet ASA 10458941 |

**Unpaid path:** \`POST /api/summarize\` without a payment header → **402** with \`PAYMENT-REQUIRED\` (base64 JSON quote).

**Paid path:** Client signs exact-AVM USDC transfer → retries with \`PAYMENT-SIGNATURE\` → server verifies via facilitator → settles on-chain → runs Groq summarization → **200** with summary + \`txId\`.

The **protocol sandbox** at [Protocol sandbox](/x402-demo) runs the same HTTP semantics against a dedicated demo route with simulation modes (happy path, failed payment, timeout, invalid token) — no wallet required for Test Mode.`,
  },
  {
    id: "pricing-model",
    title: "Pricing model",
    body: `PagePay uses **exact pricing** — the amount in the 402 quote must match the signed transaction exactly.

- **Unit:** one page of document text (derived from character count with a configurable pages cap)
- **Rate:** **$0.01 USD per page** on Algorand Testnet
- **Asset:** USDC testnet ASA \`10458941\` (6 decimal places)
- **Atomic amount:** \`10000\` micro-units per page (= $0.01)

Example: a 7-page document → quote shows **$0.07** → signed payment transfers **70000** atomic USDC units to the merchant \`payTo\` address.

**Quote drift protection:** if document content changes between \`POST /api/price\` and payment, the server rejects the payment with a quote mismatch error. Always refresh the quote after editing the document.`,
  },
  {
    id: "quick-start",
    title: "Quick start (5 minutes)",
    body: `### 1. Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open \`http://localhost:8080\` in **Chrome or Edge** (not the Cursor embedded browser — Pera signing requires a real browser tab).

### 2. Fund Testnet wallets

You need **both** testnet ALGO (fees + minimum balance) **and** testnet USDC:

1. Get testnet ALGO from the [Algorand dispenser](https://bank.testnet.algorand.network/)
2. Get testnet USDC from the [Circle faucet](https://faucet.circle.com) — select **Algorand Testnet**
3. Import or create an address in [Pera Wallet](https://web.perawallet.app) on **Testnet** (chain ID 416002)

### 3. Connect and pay

1. Open the [Live demo](/demo) and connect Pera in the header
2. Paste document text or upload a text-based PDF
3. Click **Get a price** → review pages and total
4. Click **Pay and summarize** → approve the USDC transfer in Pera Web or mobile QR
5. Verify the \`txId\` on the [Algorand testnet explorer](https://testnet.explorer.perawallet.app)

### 4. Explore without paying

Use the [Protocol demo](/x402-demo) → **Test Mode (no payment)** to walk through happy path, failures, and raw HTTP exchanges client-side.`,
  },
  {
    id: "pages-routes",
    title: "Application routes",
    body: `| Route | Purpose |
| --- | --- |
| \`/\` | Marketing landing + embedded live demo section |
| \`/demo\` | Full pay-per-page flow with Pera Wallet |
| \`/x402-demo\` | x402 protocol sandbox with simulation modes |
| \`/docs\` | Documentation hub (this page) |
| \`/docs/x402\` | x402 v2 protocol deep dive |
| \`/docs/algorand\` | Algorand settlement, USDC, facilitator |
| \`/developers\` | HTTP API reference |
| \`/integrations\` | Pera, GoPlausible, Circle, Groq |
| \`/product\` | Product capabilities overview |
| \`/pricing\` | Pricing tiers (demo reference) |`,
  },
  {
    id: "security-model",
    title: "Security & trust model",
    body: `PagePay follows a **non-custodial** payment model:

- **Private keys never touch the server.** Pera Wallet signs the USDC transfer client-side.
- **Payment proof is on-chain.** Successful responses include a transaction ID verifiable on Algorand Testnet.
- **Facilitator verifies before fulfillment.** The API does not run paid work until verify + settle succeed.
- **Exact scheme prevents partial payment.** Amount, asset, payTo, and network must match the quote byte-for-byte.

**What PagePay is not:** a production payment processor, KYC platform, or mainnet-ready deployment. It is a **reference implementation** for learning and prototyping x402 + Algorand integration patterns.`,
  },
  {
    id: "troubleshooting",
    title: "Common issues",
    body: `### Payment stuck at "Signing in Pera"

On desktop, Pera opens **web.perawallet.app** in a new tab — look for it and approve the transaction. There is no Pera Chrome extension; use Pera Web or scan the QR with the mobile app.

### "Insufficient funds" with 10 ALGO

Payments require **testnet USDC (ASA 10458941)**, not ALGO alone. ALGO only covers transaction fees.

### Connection reset / Failed to fetch

Usually means the dev server is not running. Restart with \`npm run dev\` and hard-refresh the page.

### Quote mismatch

You edited the document after getting a price. Click **Get a price** again before paying.

### Facilitator timeout (504)

The hosted facilitator did not respond in time. Wait a few seconds and retry — this is usually transient on testnet.`,
  },
  {
    id: "glossary",
    title: "Glossary",
    body: `| Term | Definition |
| --- | --- |
| **x402** | Protocol that uses HTTP 402 for machine-readable payment negotiation |
| **exact scheme** | Payment amount must match the quote exactly (vs. "upto" schemes) |
| **PAYMENT-REQUIRED** | x402 v2 response header carrying base64-encoded payment requirements |
| **PAYMENT-SIGNATURE** | x402 v2 request header with signed payment payload on retry |
| **Facilitator** | Service that verifies client signatures and submits transactions on-chain |
| **ASA** | Algorand Standard Asset — USDC on testnet is ASA 10458941 |
| **Atomic units** | Smallest indivisible unit of an ASA (10⁻⁶ USDC) |`,
  },
];

export const OVERVIEW_GUIDES = [
  {
    to: "/docs/x402",
    title: "x402 protocol",
    description:
      "HTTP 402 semantics, v2 headers, exact-AVM scheme, client retry flow, error codes, and sequence diagrams.",
  },
  {
    to: "/docs/algorand",
    title: "Algorand settlement",
    description:
      "Testnet configuration, USDC ASA, transaction groups, facilitator verify/settle, explorer verification, and wallet flows.",
  },
  {
    to: "/developers",
    title: "API reference",
    description:
      "Every endpoint, request/response schema, status codes, headers, curl examples, and client integration patterns.",
  },
  {
    to: "/integrations",
    title: "Integrations",
    description:
      "Pera Wallet ARC-0001 signing, GoPlausible facilitator, Circle faucet, Groq AI, and environment configuration.",
  },
  {
    to: "/x402-demo",
    title: "Protocol sandbox",
    description:
      "Interactive demo: happy path, failed payment, timeout, invalid token — with live HTTP exchange capture.",
  },
  {
    to: "/demo",
    title: "Live demo",
    description: "End-to-end pay-per-page summarization with real Pera Wallet signing on Testnet.",
  },
] as const;
