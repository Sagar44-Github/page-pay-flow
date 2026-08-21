import type { DocSection } from "@/components/marketing/DocSections";

export const DEVELOPERS_SECTIONS: DocSection[] = [
  {
    id: "endpoints",
    title: "Endpoints overview",
    body: `All API routes are served from the same origin as the frontend during development (\`http://localhost:8080\`).

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| \`POST\` | \`/api/price\` | None | Quote pages and price for document text |
| \`POST\` | \`/api/summarize\` | x402 payment | Gated summarization (402 → pay → 200) |
| \`GET\` | \`/api/logs\` | None | Recent structured payment logs (demo) |
| \`POST\` | \`/api/x402-demo\` | x402 payment | Protocol sandbox gated Groq generation |

**Content types:** all POST endpoints accept \`application/json\`. File uploads on the live demo are converted to text client-side before API calls.`,
  },
  {
    id: "price",
    title: "POST /api/price",
    body: `Returns a price quote **without** requiring payment. Use this to display cost before wallet signing.

### Request body

\`\`\`json
{
  "text": "Full document text content..."
}
\`\`\`

Or with base64 PDF (client extracts text first in Live Demo UI).

### Response 200

\`\`\`json
{
  "pages": 5,
  "price": "$0.05",
  "amount": "50000",
  "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
  "facilitator": "https://facilitator.goplausible.xyz",
  "asset": "10458941",
  "payTo": "MERCHANT..."
}
\`\`\`

**Note:** the quote is informational. The authoritative payment requirements come from the **402 response** on \`/api/summarize\`.`,
    code: {
      title: "curl — get price",
      code: `curl -X POST http://localhost:8080/api/price \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Lorem ipsum ... (repeat for multiple pages)"}'`,
    },
  },
  {
    id: "summarize-unpaid",
    title: "POST /api/summarize (unpaid)",
    body: `First request **without** \`PAYMENT-SIGNATURE\` header returns payment requirements.

### Request body

\`\`\`json
{
  "text": "Document to summarize..."
}
\`\`\`

### Response 402

\`\`\`json
{
  "x402Version": 2,
  "accepts": [ { "scheme": "exact", "network": "...", "amount": "...", ... } ],
  "error": "Payment required"
}
\`\`\`

### Response headers

\`\`\`
payment-required: <base64 JSON>
\`\`\`

Decode this header to feed \`@x402-avm/core\` payment construction.`,
    code: {
      title: "curl — unpaid summarize",
      code: `curl -i -X POST http://localhost:8080/api/summarize \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Your document here..."}'`,
    },
  },
  {
    id: "summarize-paid",
    title: "POST /api/summarize (paid retry)",
    body: `Retry the **identical** request with \`PAYMENT-SIGNATURE\` header after Pera signing.

### Request headers

\`\`\`
Content-Type: application/json
payment-signature: <base64 JSON from encodePaymentSignatureHeader()>
\`\`\`

### Response 200

\`\`\`json
{
  "summary": "## Overview\\n\\nThis document discusses...",
  "pages": 3,
  "pricePaid": "$0.03",
  "amountPaid": "30000",
  "txId": "ABC123...",
  "explorer": "https://testnet.explorer.perawallet.app/tx/ABC123...",
  "payer": "PAYER_ADDRESS...",
  "network": "algorand:..."
}
\`\`\`

### Response headers

\`\`\`
payment-response: <base64 settlement metadata>
\`\`\`

The \`summary\` field is **Markdown-formatted** text from Groq — render with a Markdown component in your UI.`,
    code: {
      title: "Successful response shape",
      code: `{
  "summary": "**Key points:**\\n- HTTP 402 enables...\\n- Algorand settles USDC...",
  "pages": 3,
  "pricePaid": "$0.03",
  "amountPaid": "30000",
  "txId": "TXID_HERE",
  "explorer": "https://testnet.explorer.perawallet.app/tx/TXID_HERE"
}`,
    },
  },
  {
    id: "client-integration",
    title: "Client integration pattern",
    body: `PagePay's client (\`src/lib/x402/client.ts\`) implements the canonical retry loop:

1. \`fetch(url, { method: 'POST', body })\` → if status !== 402, handle normally
2. Read \`payment-required\` header → \`decodePaymentRequiredHeader()\`
3. \`createPaymentPayload(requirements, walletSigner)\`
4. \`encodePaymentSignatureHeader(payload)\`
5. \`fetch(url, { method: 'POST', body, headers: { 'payment-signature': ... } })\`

**Do not** use \`httpClient.handlePaymentRequired()\` from older x402 examples — v2 requires explicit payload creation and header encoding.

**Wallet injection:** pass Pera's \`signTransactions\` callback into the payment payload builder. See \`src/lib/wallet/pera.ts\` for ARC-0001 group signing.`,
  },
  {
    id: "errors",
    title: "Error responses",
    body: `| Status | Body hint | Meaning |
| --- | --- | --- |
| 400 | \`Invalid document\` | Empty or unreadable text |
| 402 | \`accepts\` array | Payment required (not an error) |
| 402 | \`Quote mismatch\` | Body changed since quote |
| 504 | \`retryable: true\` | Facilitator timeout |
| 500 | \`error\` message | Server failure |

Client code should map HTTP status + JSON \`code\` fields to user-friendly recovery actions (connect wallet, fund USDC, retry, refresh quote).`,
  },
  {
    id: "logs",
    title: "GET /api/logs",
    body: `Returns recent payment attempt logs for debugging. Intended for demo/development — do not expose in production without auth.

\`\`\`json
{
  "logs": [
    {
      "timestamp": "2026-08-13T...",
      "phase": "settle",
      "status": "success",
      "txId": "..."
    }
  ]
}
\`\`\``,
  },
  {
    id: "x402-demo-api",
    title: "POST /api/x402-demo",
    body: `Used by the [Protocol demo](/x402-demo) page. Same x402 semantics as \`/api/summarize\` but returns **Groq-generated content** instead of document summaries.

### Request body

\`\`\`json
{
  "prompt": "Brief a technical audience on HTTP 402...",
  "model": "llama-3.1-8b-instant"
}
\`\`\`

### Response 200 (paid)

\`\`\`json
{
  "content": "Generated markdown text...",
  "model": "llama-3.1-8b-instant",
  "latencyMs": 842,
  "usage": { "total_tokens": 412 },
  "settlement": {
    "success": true,
    "network": "algorand:...",
    "transaction": "TXID",
    "payer": "ADDRESS"
  }
}
\`\`\``,
  },
];
