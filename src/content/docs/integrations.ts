import type { DocSection } from "@/components/marketing/DocSections";

export const INTEGRATIONS_SECTIONS: DocSection[] = [
  {
    id: "pera",
    title: "Pera Wallet",
    body: `**Package:** \`@perawallet/connect\`

PagePay connects to Pera via the official browser SDK. There is **no Pera Chrome extension** — desktop users interact through [Pera Web](https://web.perawallet.app) or mobile via WalletConnect QR codes.

### Connection flow

1. \`PeraWalletConnect()\` instance created once per session
2. \`connect()\` → modal / redirect to Pera Web
3. User approves Testnet account
4. \`connector.activeAccount\` provides address for UI + signing

### Signing flow

1. Build atomic txn group from x402 payment requirements
2. Map to \`SignTransaction\` format with explicit \`signers\` arrays
3. \`signTransaction([group])\` — **do not** pass address as second arg in v2 integration
4. Return signed bytes to \`createPaymentPayload\`

### Disconnect / reconnect

Call \`disconnect()\` on logout. Stale sessions can cause silent signing failures — always surface \`wallet.error\` in UI.`,
  },
  {
    id: "goplausible",
    title: "GoPlausible facilitator",
    body: `**URL:** \`https://facilitator.goplausible.xyz\`

The hosted facilitator implements x402 verify and settle for exact-AVM Algorand payments. PagePay's server calls it — clients never talk to the facilitator directly.

| Endpoint | Purpose |
| --- | --- |
| \`POST /verify\` | Validate signed payment before chain submission |
| \`POST /settle\` | Co-sign and submit atomic group |

**Fee sponsorship:** the facilitator's \`feePayer\` address appears in payment requirement \`extra\`. It covers Algorand transaction fees so payers only need USDC + minimal ALGO.

**Self-hosting:** for production you may run your own facilitator. PagePay demo uses GoPlausible to reduce setup friction.`,
  },
  {
    id: "circle-faucet",
    title: "Circle USDC faucet",
    body: `Testnet USDC is issued by Circle's faucet, not the Algorand dispenser.

1. Go to [faucet.circle.com](https://faucet.circle.com)
2. Select **Algorand** blockchain
3. Select **Testnet** network
4. Paste your Pera address
5. Submit — USDC (ASA 10458941) arrives in ~4 seconds

**Rate limits:** the faucet may limit requests per address per day. Use a fresh Testnet address if depleted.

**Verification:** in Pera, open Assets → confirm USDC balance. In explorer, check \`/asset/10458941\` transfers to your address.`,
  },
  {
    id: "groq",
    title: "Groq AI",
    body: `Post-settlement, PagePay calls **Groq** for text generation when \`GROQ_API_KEY\` is configured server-side.

| Model | Use case |
| --- | --- |
| \`openai/gpt-oss-20b\` | Fast responses, protocol demo default |
| \`qwen/qwen3.6-27b\` | Higher quality summaries |

**Independence:** payment and AI are decoupled. Settlement must succeed before any Groq call. If Groq fails after payment, the tx is still on-chain — handle this as a fulfillment error in production (retry, refund policy, support).

**Output format:** Groq returns Markdown (\`**bold**\`, \`## headings\`, bullet lists). Render with \`react-markdown\` — do not display raw Markdown strings.`,
  },
  {
    id: "x402-avm",
    title: "@x402-avm packages",
    body: `| Package | Import | Purpose |
| --- | --- | --- |
| \`@x402-avm/core\` | \`decodePaymentRequiredHeader\`, \`createPaymentPayload\`, \`encodePaymentSignatureHeader\` | Header codec + payload lifecycle |
| \`@x402-avm/avm\` | Algorand transaction builders | Exact scheme txn groups |

**Version alignment:** PagePay pins x402 v2 compatible releases. Mismatch between server and client package versions can cause header decode failures.`,
  },
  {
    id: "env-vars",
    title: "Environment variables (reference)",
    body: `These are configured server-side for the demo deployment. Documented here for integrators — do not commit secrets.

| Variable | Purpose |
| --- | --- |
| \`RESOURCE_PAY_TO\` | Merchant Algorand address receiving USDC |
| \`GROQ_API_KEY\` | Groq API authentication |
| \`LOVABLE_API_KEY\` | Fallback AI gateway when Groq unset |

**Frontend env:** wallet and network config are compile-time constants in \`src/lib/x402/client.ts\` and \`src/lib/wallet/pera.ts\` for Testnet.`,
  },
  {
    id: "protocol-sandbox",
    title: "Protocol sandbox integration",
    body: `Embed or link the [\`/x402-demo\`](/x402-demo) page in your onboarding:

- **Test Mode** — zero wallet setup, instant happy-path walkthrough
- **Live flow** — real 402 against \`/api/x402-demo\` with Groq unlock
- **Raw HTTP panel** — copy/paste headers for your own client implementation
- **Log console** — timestamped protocol events for debugging

Simulation modes (\`failed\`, \`timeout\`, \`invalid_token\`) help QA error UI without spending testnet USDC.`,
  },
  {
    id: "browser-compat",
    title: "Browser compatibility",
    body: `| Browser | Pera signing | Notes |
| --- | --- | --- |
| Chrome | ✅ | Recommended |
| Edge | ✅ | Recommended |
| Firefox | ⚠️ | Pera Web works; test thoroughly |
| Safari | ⚠️ | Popup / tab focus issues possible |
| Cursor embedded | ❌ | Cannot open Pera Web properly |

Always test payments in a standalone browser window, not IDE previews.`,
  },
];
