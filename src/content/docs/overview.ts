import type { DocSection } from "@/components/marketing/DocSections";

export const OVERVIEW_SECTIONS: DocSection[] = [
  {
    id: "what-is-pagepay",
    title: "What is PagePay?",
    body: `PagePay is an **autonomous, machine-to-machine pay-per-page AI processing platform** built on top of standard HTTP 402 Payment Required semantics and Algorand Testnet (USDC ASA 10458941).

Unlike traditional SaaS products that rely on user signups, API keys, monthly credit card subscriptions, or manual invoicing, PagePay enables **AI agents, web apps, and human clients** to pay for high-value LLM processing per parsed document page in real time.

PagePay includes 5 specialized AI extraction modes, dual-document side-by-side comparison, a client-side Agent Spend Policy Guard, a cryptographic SHA-256 tamper-evident log chain, a public receipt verification service, and an Algorand agent trust score lookup API.`,
  },
  {
    id: "capabilities",
    title: "Core Platform Capabilities",
    body: `| Feature | Description | Status |
| --- | --- | --- |
| **5 Extraction Modes** | Summary, Action Items, Key Risks, Compliance Check, Checklist | ✅ Production |
| **Multi-Doc Compare** | Dual document A vs B side-by-side comparison with atomic 402 payment | ✅ Production |
| **Agent Policy Guard** | Client-side spend policy caps ($/req, $/session) with pre-flight checks | ✅ Production |
| **Receipt Verification** | Public \`GET /api/receipt\` endpoint for independent transaction verification | ✅ Production |
| **Agent Trust Score** | Public \`GET /api/trust-score\` endpoint for Algorand address reliability (0-100) | ✅ Production |
| **SHA-256 Audit Trail** | Cryptographic hash chaining for tamper-evident request/payment logs | ✅ Production |
| **Startup Log Seed** | Automatic restoration of real, verifiable testnet transactions on boot | ✅ Production |`,
  },
  {
    id: "architecture",
    title: "System Architecture",
    body: `PagePay splits into four cooperating layers:

| Layer | Responsibility | Technology |
| --- | --- | --- |
| **Client / Agent** | Quote, sign exact-AVM USDC, enforce spend policy, retry | React, Pera Wallet, \`@x402-avm\` |
| **API Gateway** | Enforce 402, decode payment, hash audit log, fulfill AI work | TanStack Start, Nitro Server |
| **Facilitator** | Verify ARC-0001 signatures, submit atomic transaction groups | GoPlausible Hosted Service |
| **Settlement** | On-chain USDC transfer | Algorand Testnet (ASA 10458941) |

**Unpaid Path:** Client sends \`POST /api/summarize\` or \`POST /api/compare\` → Gateway returns **HTTP 402 Payment Required** with base64 \`PAYMENT-REQUIRED\` quote headers.

**Paid Path:** Client signs exact-AVM USDC transfer → retries with \`PAYMENT-SIGNATURE\` header → Gateway verifies via GoPlausible facilitator → settles on-chain → executes Groq LLM processing → appends SHA-256 audit entry → returns **200 OK** with summary/comparison + \`txId\`.`,
  },
  {
    id: "pricing-model",
    title: "Pricing & Metering Model",
    body: `PagePay uses **exact pricing** — the amount in the 402 quote must match the signed transaction exactly.

- **Unit:** 1 parsed document page (500 words or 1 PDF page)
- **Rate:** **$0.01 USD per page**
- **Asset:** USDC Testnet ASA \`10458941\` (6 decimals)
- **Atomic Amount:** \`10000\` micro-units per page (= $0.01)

Example: A 3-page document quote is **$0.03** → client signs a transfer of **30000** atomic USDC units to the merchant \`payTo\` address.

Dual-document comparison combines total pages: 1 page in Doc A + 1 page in Doc B = 2 pages → **$0.02** combined payment.`,
  },
  {
    id: "quick-start",
    title: "Quick Start for Developers & Agents",
    body: `### 1. Run Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open \`http://localhost:8080\` in Chrome or Edge.

### 2. Machine-Readable Agent Discovery

AI agents can inspect \`GET /api/tools\` at any time to discover available routes, pricing rules, payment requirements, and extraction modes.

### 3. Fund Testnet Wallet

Get testnet ALGO from the [Algorand Dispenser](https://bank.testnet.algorand.network/) and testnet USDC from the [Circle Faucet](https://faucet.circle.com).`,
  },
];

export const OVERVIEW_GUIDES = [
  {
    to: "/docs/x402",
    title: "x402 Protocol Specs",
    description: "HTTP 402 headers, v2 exact-AVM scheme, payload structure, error codes, and sequence diagrams.",
  },
  {
    to: "/docs/algorand",
    title: "Algorand Settlement",
    description: "Testnet configuration, ASA 10458941, GoPlausible facilitator, atomic transaction groups, and explorer proof.",
  },
  {
    to: "/developers",
    title: "API Reference",
    description: "Full reference for /api/summarize, /api/compare, /api/receipt, /api/trust-score, /api/audit/verify, and /api/tools.",
  },
  {
    to: "/integrations",
    title: "Integrations & AI",
    description: "Pera Wallet ARC-0001, GoPlausible, Groq AI, and agent spend policy configuration.",
  },
];
