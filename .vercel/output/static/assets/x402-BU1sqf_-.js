import{t as e}from"./jsx-runtime-CfuWmoMz.js";import{n as t}from"./MarketingPage-IkApkD27.js";import{r as n,t as r}from"./DocsLayout-BYbcoOvr.js";var i=[{id:`overview`,title:`Overview`,body:`**x402** revives [HTTP 402 Payment Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402) as a first-class, machine-readable payment negotiation layer for APIs, agents, and automated clients.

Instead of returning **401 Unauthorized** and forcing humans through OAuth or API key dashboards, an unpaid API call returns **402** with structured payment requirements. The client signs an on-chain payment, retries the **same request** with a payment header, and receives the protected resource only after settlement.

PagePay implements **x402 version 2** with the **exact-AVM** scheme on Algorand Testnet. This document covers every header, field, state transition, and failure mode you will encounter integrating against PagePay or building a compatible client.`},{id:`why-402`,title:`Why HTTP 402?`,body:`Traditional API monetization stacks billing as a separate concern:

1. User creates account → adds credit card → receives API key
2. Client sends \`Authorization: Bearer sk-...\` on every request
3. Provider meters usage in a database and invoices monthly

x402 collapses steps 1–3 into the HTTP exchange itself:

\`\`\`
Client                          Server
  | POST /resource  ------------> |
  | <----------- 402 + quote       |
  | sign payment (wallet)         |
  | POST /resource + PAYMENT-SIG -> |
  | <----------- 200 + resource    |
\`\`\`

**Benefits for agentic workloads:** AI agents can discover price, pay, and consume in one programmatic loop without human account setup. **Benefits for developers:** payment requirements are self-describing JSON — no separate pricing page scrape required.`},{id:`v2-headers`,title:`Version 2 headers`,body:"x402 v2 standardizes three HTTP headers. PagePay uses lowercase header names in logs; HTTP is case-insensitive.\n\n| Header | Direction | Purpose |\n| --- | --- | --- |\n| `PAYMENT-REQUIRED` | Response (402) | Base64-encoded JSON array of payment requirements |\n| `PAYMENT-SIGNATURE` | Request (retry) | Base64-encoded JSON signed payment payload |\n| `PAYMENT-RESPONSE` | Response (200) | Base64-encoded settlement metadata (txId, network, payer) |\n\n**Important:** x402 v1 used `X-Payment`. PagePay and `@x402-avm` v2 use `PAYMENT-SIGNATURE`. Clients must not send legacy v1 headers.",code:{title:`402 response headers (example)`,code:`HTTP/1.1 402 Payment Required
Content-Type: application/json
payment-required: eyJ4NDAyVmVyc2lvbiI6MiwicGF5bWVudE9wdGlvbnMiOltdfQ==

{
  "x402Version": 2,
  "accepts": [ /* payment requirement objects */ ],
  "error": "Payment required"
}`}},{id:`payment-requirement`,title:`Payment requirement object`,body:'Each entry in the `accepts` array describes one valid way to pay. PagePay publishes a single **exact-AVM** requirement per quote.\n\n| Field | Type | Description |\n| --- | --- | --- |\n| `scheme` | string | Always `"exact"` — amount must match exactly |\n| `network` | string | CAIP-2 Algorand network ID (testnet genesis hash) |\n| `amount` | string | Atomic USDC units as decimal string |\n| `asset` | string | ASA ID (`10458941` for testnet USDC) |\n| `payTo` | string | Merchant Algorand address (base32) |\n| `extra` | object | `name`, `decimals`, `feePayer` facilitator address |\n| `maxTimeoutSeconds` | number | Quote validity window |\n\nThe `extra.feePayer` field indicates the GoPlausible facilitator will co-sign as fee payer in the atomic transaction group.',code:{title:`Decoded payment requirement`,code:`{
  "scheme": "exact",
  "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
  "amount": "30000",
  "asset": "10458941",
  "payTo": "MERCHANT_ADDRESS_HERE",
  "extra": {
    "name": "USDC",
    "decimals": 6,
    "feePayer": "FACILITATOR_FEE_PAYER_ADDRESS"
  },
  "maxTimeoutSeconds": 300
}`}},{id:`client-flow`,title:`Client flow (step by step)`,body:`### Step 1 — Unpaid request

Send the resource request with **no** payment header. Expect HTTP **402**.

### Step 2 — Decode quote

Base64-decode \`PAYMENT-REQUIRED\`. Parse JSON. Select the requirement matching your wallet network and asset.

### Step 3 — Build transaction group

Using \`@x402-avm/avm\`, construct an atomic group:
- Slot 0: fee-payer placeholder (signed by facilitator at settle time)
- Slot 1: USDC axfer from payer → \`payTo\` for exact \`amount\`

### Step 4 — Sign with Pera

Pera Wallet signs slot 1 via ARC-0001 \`signTransaction\`. Use \`{ txn, signers: [yourAddress] }\` for slots you sign.

### Step 5 — Encode payment payload

Call \`createPaymentPayload()\` then \`encodePaymentSignatureHeader()\` from \`@x402-avm/core\`.

### Step 6 — Retry request

Repeat the **identical** POST with \`PAYMENT-SIGNATURE\` header. Body must match the original request (same document hash / page count).

### Step 7 — Verify response

On **200**, decode \`PAYMENT-RESPONSE\` for \`txId\`. Confirm on Algorand explorer independently.`},{id:`simulation-modes`,title:`Protocol sandbox simulation modes`,body:`The [\`/x402-demo\`](/x402-demo) page supports four client-side simulation modes that mock facilitator and server behavior without wallet funding:

| Mode | Behavior |
| --- | --- |
| **Happy path** | Full 402 → sign → settle → 200 with Groq content |
| **Failed payment** | Simulates facilitator rejection after signing |
| **Payment timeout** | Simulates facilitator hang / 504 |
| **Invalid token** | Simulates malformed PAYMENT-SIGNATURE rejection |

**Test Mode** runs entirely client-side with mocked HTTP exchanges. **Run live x402 flow** hits the real \`/api/x402-demo\` route and Groq when configured.

Use simulation modes to teach the protocol, test UI error states, and capture raw header payloads for documentation.`},{id:`error-codes`,title:`HTTP status codes & errors`,body:`| Status | Meaning | Client action |
| --- | --- | --- |
| **402** | Payment required | Decode quote, sign, retry |
| **400** | Bad request / invalid payment header | Fix payload; do not retry blindly |
| **402** (retry) | Quote expired or mismatch | Re-request quote with same body |
| **504** | Facilitator timeout | Retry after delay (\`retryable: true\`) |
| **500** | Server error after payment | Check logs; payment may or may not have settled |

**Client-side failure codes** (PagePay UI maps these to friendly copy):

- \`cancelled\` — user rejected Pera prompt
- \`insufficient_funds\` — missing testnet USDC
- \`signing_failed\` — Pera ARC-0001 error
- \`verification_failed\` — facilitator rejected signature
- \`quote_mismatch\` — document changed since quote
- \`gateway_unavailable\` — facilitator unreachable`},{id:`sequence`,title:`Full sequence diagram`,body:`\`\`\`
┌────────┐          ┌────────┐          ┌─────────────┐          ┌──────────┐
│ Client │          │  API   │          │ Facilitator │          │ Algorand │
└───┬────┘          └───┬────┘          └──────┬──────┘          └────┬─────┘
    │ POST /summarize   │                     │                      │
    │──────────────────>│                     │                      │
    │ 402 PAYMENT-REQ   │                     │                      │
    │<──────────────────│                     │                      │
    │ sign USDC (Pera)  │                     │                      │
    │ POST + PAYMENT-SIG│                     │                      │
    │──────────────────>│ POST /verify        │                      │
    │                   │────────────────────>│                      │
    │                   │ POST /settle        │                      │
    │                   │────────────────────>│ submit txn group     │
    │                   │                     │─────────────────────>│
    │                   │                     │ confirmed txId       │
    │                   │<────────────────────│<─────────────────────│
    │ 200 + summary     │                     │                      │
    │ PAYMENT-RESPONSE  │                     │                      │
    │<──────────────────│                     │                      │
\`\`\``},{id:`libraries`,title:`Reference libraries`,body:`PagePay uses these packages — mirror them in your own client:

| Package | Role |
| --- | --- |
| \`@x402-avm/core\` | Decode requirements, create/encode payment payloads |
| \`@x402-avm/avm\` | Algorand exact scheme transaction construction |
| \`@perawallet/connect\` | Browser wallet connection + ARC-0001 signing |
| \`algosdk\` | Low-level Algorand types (used internally) |

See the [Developers](/developers) page for curl examples and the [Integrations](/integrations) page for wallet-specific signing notes.`}],a=e();function o(){return(0,a.jsx)(t,{children:(0,a.jsx)(r,{title:`x402 protocol`,description:`Complete reference for HTTP 402 payment negotiation, x402 v2 headers, exact-AVM scheme, client retry flow, simulation modes, and error handling.`,children:(0,a.jsx)(n,{sections:i})})})}export{o as component};