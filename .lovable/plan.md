# PagePay — pay-per-page AI summarization over x402 on Algorand

A pay-per-page document summarization API where each request is paid for on Algorand
testnet using the x402 protocol — no accounts, no API keys, no subscriptions. Plus a
demo UI with real Pera Wallet payment and a live payment dashboard.

## Important deviation from your prompt (you approved this)

Your prompt specified Express. This project runs on TanStack Start on an edge runtime,
so Express and `@x402-avm/express` cannot run here. Instead:

- The x402 logic uses the **framework-agnostic** official Algorand packages:
  `@x402-avm/core` (resource server + facilitator client) and `@x402-avm/avm`
  (`ALGORAND_TESTNET_CAIP2`, exact-AVM scheme registration). Same protocol, same
  hosted facilitator, same 402 wire format — only the HTTP adapter changes from the
  Express middleware to a TanStack server route.
- Everything else stays exactly as specced: Algorand testnet only, no other chain, no
  Stripe/PayPal, hosted facilitator at `https://facilitator.goplausible.xyz`, ALGO
  pricing, no DB, no auth, no Docker.
- Summarization uses Lovable AI (no API key for you to paste) — a single provider,
  called for real, never a fake summary.
- Log storage: an edge runtime has no writable `requests.log` file, so request logs go
  to an in-memory JSON-Lines ring buffer (last ~500 entries) exposed at `/api/logs`,
  identical shape to the specced log lines. I'll note the swap in the README.

## What gets built

### Payment-gated API
- `POST /api/summarize` — accepts `{ text }` JSON or a PDF upload (multipart).
  - Page count: real PDF page count, or `ceil(words / 500)` for raw text.
  - Price: `$0.01 × pages`, computed dynamically per request (never a fixed route price).
  - No `X-PAYMENT` header → `402 Payment Required` with the exact x402 payment
    requirements produced by the x402-avm resource server (amount, `payTo`, Algorand
    testnet CAIP-2 network, asset). Not hand-rolled.
  - With `X-PAYMENT` → verify + settle via the hosted facilitator, then summarize and
    return `{ summary, pagesCharged, amountPaid, txId }`.
- `GET /api/logs` — recent request log entries for the dashboard.
- `GET /api/price` — page count + quoted price without payment (used by "Get price").

### Failure handling (explicit status codes + JSON bodies)
| Case | Response |
|---|---|
| Not PDF/text, or over 20 pages / size cap | `400 { error, reason }` |
| Missing payment | `402` from x402 (normal, logged quietly) |
| Verify/settle rejects (underpaid, bad signature, expired) | `402 { error, reason }`, summarization never runs |
| Facilitator timeout (after 1 retry) | `504 { error: "Payment gateway timeout", reason }`, logged `gateway_error` |
| Paid but summarizer throws | `500 { error, reason, paymentReference }`, logged `paid_unfulfilled` + `TODO` comment describing a real refund flow (not implemented) |

Every request appends one structured entry: timestamp, route, pages, price, payment
status, outcome, txId.

### Demo frontend (`/` route)
Single-page PagePay UI, replacing the placeholder index, with tabs:
1. **Summarize** — drop a PDF or paste text → "Get price" → the raw 402 JSON shown
   verbatim (judge-friendly proof of real x402) → "Connect Pera Wallet" → "Pay & summarize"
   → summary rendered with pages charged, ALGO amount, and a link to the txn on an
   Algorand testnet explorer.
2. **Dashboard** — live table of `/api/logs` (timestamp, pages, price, payment status,
   outcome), auto-refreshing every 3s.
3. A "simulate underpayment" toggle so you can demo the clean 402 failure path live.

Real wallet flow: connect Pera via `@txnlab/use-wallet-react` (WalletConnect), read the
402 requirements, build and sign the Algorand payment with the x402-avm AVM client
helpers, retry with the signed `X-PAYMENT` header, get the summary after on-chain
settlement on testnet.

## Technical notes

- Packages added: `@x402-avm/core`, `@x402-avm/avm`, `@algorandfoundation/algokit-utils`,
  `@txnlab/use-wallet-react` (+ its Pera peer), `unpdf` or equivalent pure-JS PDF page
  reader (edge-safe; no native binaries), `ai` + `@ai-sdk/openai-compatible`.
  No `@x402/*`, no `@coinbase/x402`, no `algosdk` direct dependency, no Express.
- Files:
  - `src/routes/api/summarize.ts` — HTTP adapter: validation → x402 gate → summarize
  - `src/routes/api/price.ts`, `src/routes/api/logs.ts`
  - `src/lib/x402/routeConfig.ts` — resource server, exact-AVM scheme, dynamic pricing
  - `src/lib/x402/facilitator.server.ts` — facilitator client wrapped in a 20s timeout +
    single retry
  - `src/lib/services/summarizer.server.ts` — Lovable AI call (streamed, consumed server-side)
  - `src/lib/services/pagepayLogger.server.ts` — JSON-Lines log buffer
  - `src/lib/pdf.server.ts` — page counting
  - `src/routes/index.tsx` — PagePay demo UI; components under `src/components/pagepay/`
- Secrets: `RESOURCE_PAY_TO` (your funded Algorand testnet merchant address — I'll
  request it via the secure secret form) and `LOVABLE_API_KEY` (auto-provisioned).
- Network is hardcoded to `ALGORAND_TESTNET_CAIP2`; mainnet never referenced.
- README section covering testnet dispenser funding, Pera testnet setup, curl testing of
  the 402, and the deliberate-failure demo.

## Out of scope
No database, no auth, no USDC ASA pricing, no self-hosted facilitator, no on-chain
refunds, no Docker/CI.
