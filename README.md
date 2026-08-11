# PagePay Summaries

# PagePay — AI Build Prompt + x402 / Algorand Integration Guide

> Copy the section below labeled **"MASTER BUILD PROMPT"** and paste it directly into your AI coding assistant (Claude Code, Cursor, etc.) as the task instructions. The sections after it are a manual reference guide for you, in case you need to set anything up by hand or double-check what the AI produces.

---

## MASTER BUILD PROMPT (paste this into your AI coding assistant)

```
You are building "PagePay" — a pay-per-page AI document summarization API that uses
the x402 payment protocol settled on the Algorand blockchain.

============================================================
STRICT TECHNOLOGY CONSTRAINTS — READ FIRST
============================================================
You MUST use ONLY the following technologies. Do NOT substitute, add, or suggest
alternatives without asking me first. Do not silently pull in extra libraries.

- Backend: Node.js with Express (TypeScript preferred). Do not use Fastify, Koa,
  NestJS, or any other framework.
- Payment protocol: x402, implemented ONLY via the official Algorand (AVM) packages:
  @x402-avm/core, @x402-avm/avm, @x402-avm/express
  (optionally @x402-avm/paywall if a browser paywall UI is needed).
  Do NOT use the generic/EVM-only x402 packages (@x402/*, @coinbase/x402, etc.),
  and do NOT use Stripe, PayPal, Razorpay, or any other payment gateway anywhere
  in this project.
- Blockchain: Algorand ONLY. Do not use Ethereum, Solana, Polygon, or any other
  chain, even as a "fallback" or "multi-chain" option, unless I explicitly ask.
- Algorand SDK layer: use @algorandfoundation/algokit-utils for account/signer
  handling (this is what @x402-avm packages use internally as of v2.6+ — do NOT
  add the raw `algosdk` package as a direct dependency unless algokit-utils
  cannot do something I explicitly need).
- Facilitator: use the hosted Algorand x402 facilitator at
  https://facilitator.goplausible.xyz for verifying and settling payments.
  Do NOT build a custom facilitator unless I explicitly ask for one later.
- Network: Algorand TESTNET only, using the CAIP-2 identifier exposed by
  `ALGORAND_TESTNET_CAIP2` from @x402-avm/avm. Do not hardcode mainnet.
- Payment asset: price routes in USD-equivalent ALGO by default. Only add a
  USDC (ASA) priced route if I explicitly ask for one.
- Summarization: call a single LLM API of my choosing (I will provide the API
  key) OR a lightweight local summarization approach if I say "no external LLM."
  Do not add multiple competing summarization providers.
- Frontend: a minimal single HTML+JS page (no React/Next.js/Vue) that lets me
  upload a document, see the 402 price, "pay" (simulated button is fine for
  local testnet demo), and see the returned summary. Do not scaffold a full
  frontend framework unless I ask.
- Do not add authentication/accounts, databases, Docker, CI/CD, or any other
  infrastructure beyond what's needed to run this locally and demo it. If you
  think something else is needed, ask me before adding it.

============================================================
PROJECT OVERVIEW
============================================================
PagePay lets a client (a human or an AI agent) submit a PDF or plain text chunk
to a `/summarize` endpoint and get back an AI-generated summary, paying per page
via the x402 protocol settled on Algorand — no account, no API key, no
subscription.

============================================================
FUNCTIONAL REQUIREMENTS
============================================================
1. `POST /summarize`
   - Accepts a PDF file OR raw text in the request body.
   - Computes page count (assume ~500 words = 1 "page" if given raw text; use
     actual PDF page count if given a PDF).
   - Price = $0.01 per page (dynamic price function, not hardcoded per route).
   - If no valid payment is attached, respond with the x402-standard
     `402 Payment Required`, including the computed price and Algorand payment
     details, exactly as the @x402-avm/express middleware produces it. Do not
     hand-roll your own 402 response format.
   - If valid payment is attached (verified via the facilitator), run the
     document through the summarization step and return:
     `{ summary: string, pagesCharged: number, amountPaid: string }`

2. Payment verification and settlement must go through the x402-avm middleware
   and the hosted facilitator — do not write custom payment-verification logic
   that talks to Algorand directly; let @x402-avm/express + the facilitator
   client handle it.

3. Implement these failure/fallback cases explicitly, with clear status codes
   and JSON error bodies (not silent failures):
   a. Uploaded file is not a PDF/text or exceeds a size limit (e.g. 20 pages)
      -> 400 Bad Request, JSON: { error, reason }
   b. No payment proof present -> handled automatically by x402 middleware as
      402 Payment Required (this is expected/normal, not an error to log loudly)
   c. Payment present but verification/settlement fails (insufficient funds,
      invalid signature, expired payment) -> the facilitator/middleware should
      surface this as a 402 with a clear reason; do not proceed to
      summarization in this case.
   d. Payment verified successfully but the summarization step itself throws
      (LLM API error, timeout, malformed document) -> return 500 with a clear
      JSON error, log the failed request (with the payment reference) so it
      can be manually reviewed/refunded, and do NOT silently discard the fact
      that the user already paid. Add a TODO comment describing how a real
      refund flow would work, but do not implement on-chain refunds unless I
      ask.
   e. Timeout waiting on the facilitator's /verify or /settle call -> retry
      once, then fail gracefully with a 504 and clear error message.

4. Log every request in a simple structured console/file log:
   timestamp, route, pages requested, price, payment status, outcome.
   No database — flat log file (e.g. requests.log, JSON lines) is enough.

5. Provide a minimal demo frontend (single static HTML+JS file, no build step)
   showing: upload box -> "Get price" -> 402 response shown -> "Pay" button
   (simulated for local testnet demo, but structured so it could call a real
   Algorand wallet later) -> summary displayed.

============================================================
PROJECT STRUCTURE TO CREATE
============================================================
pagepay/
  package.json
  .env.example
  src/
    server.ts              (Express app, mounts x402 middleware + routes)
    routes/summarize.ts    (route handler: validation, summarization call)
    services/summarizer.ts (calls the LLM API or local summarizer)
    services/logger.ts     (structured request logging)
    x402/routeConfig.ts    (x402-avm route + pricing config, isolated here)
  public/
    index.html             (minimal demo frontend)
  README.md                (setup + run instructions, including how to get
                             Algorand testnet ALGO and how to test the flow
                             with curl or the demo frontend)

============================================================
WHAT TO DO NOW
============================================================
1. Confirm you understand the strict technology constraints above before
   writing any code.
2. Scaffold the project structure exactly as listed.
3. Implement `/summarize` with x402-avm middleware (see the "x402 Integration"
   section below for exact package/API usage — follow it precisely).
4. Implement the fallback/error cases listed above.
5. Write the README with clear step-by-step run instructions, including where
   I need to paste my own Algorand testnet address and LLM API key.
6. Do not use placeholder/fake summaries — actually call the summarization
   service I configure.
```

---

## X402 INTEGRATION — IN DEPTH

### 1. Install the correct packages

```bash
npm install @x402-avm/express @x402-avm/avm @x402-avm/core
# only if you want a browser paywall UI:
npm install @x402-avm/paywall
```

Do **not** install the plain `@x402/*` packages or `algosdk` directly — as of
`@x402-avm` v2.6+, `algosdk` was dropped as a direct dependency in favor of
`@algorandfoundation/algokit-utils`.

### 2. Wire up the payment-gated route (resource server side)

This is the core pattern — a route config object plus one middleware call:

```ts
import express from "express";
import { paymentMiddlewareFromConfig } from "@x402-avm/express";
import { HTTPFacilitatorClient } from "@x402-avm/core/server";
import { ALGORAND_TESTNET_CAIP2 } from "@x402-avm/avm";

const app = express();
app.use(express.json());

const PAY_TO = process.env.RESOURCE_PAY_TO!; // your Algorand testnet address

// Use the hosted Algorand facilitator (no need to run your own for the hackathon)
const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://facilitator.goplausible.xyz",
});

const routes = {
  "POST /summarize": {
    accepts: {
      scheme: "exact",
      network: ALGORAND_TESTNET_CAIP2,
      payTo: PAY_TO,
      // dynamic price: $0.01 per page, computed from the request body
      price: (context) => {
        const pages = context.adapter.getBody()?.pageCount ?? 1;
        const amount = (pages * 0.01).toFixed(2);
        return `$${amount}`;
      },
    },
    description: "Pay-per-page AI document summary",
  },
};

app.use(
  paymentMiddlewareFromConfig(routes, facilitatorClient, [
    { network: "algorand:*", server: undefined }, // see note below
  ]),
);

app.post("/summarize", async (req, res) => {
  // this code only runs AFTER payment has been verified and settled
  // ...call your summarizer here...
});

app.listen(4021);
```

> Note: for full control (and to match the official examples), prefer the
> `x402ResourceServer` + `registerExactAvmScheme` pattern instead of the bare
> array above — the AI should follow the "Quick Start with
> paymentMiddlewareFromConfig" and "Using paymentMiddleware with
> x402ResourceServer" examples from the official docs precisely rather than
> improvising the wiring.

### 3. How the flow behaves at runtime

1. Client calls `POST /summarize` with a document, no payment header.
2. Middleware intercepts it, computes the price via your dynamic pricing
   function, and returns `402 Payment Required` with an `X-PAYMENT`-shaped
   payment requirements body (amount, Algorand address, network, asset).
3. Client (a wallet, an agent, or your demo frontend) constructs and signs an
   Algorand payment transaction for that exact amount, and retries the request
   with the payment attached in the `X-PAYMENT` header.
4. Middleware forwards the payment to the facilitator's `/verify` and
   `/settle` endpoints. The facilitator checks and submits the transaction on
   Algorand testnet.
5. If settlement succeeds, the middleware calls your actual route handler,
   which runs the summarization and returns `200 OK` with the summary.
6. If settlement fails, the middleware returns an error response — your route
   handler code never runs, so you never "spend" the summarization step on an
   unpaid or failed-payment request.

### 4. Pricing notes

- `price` can be a fixed string (`"$0.01"`) or a function of the request
  (`context => ...`) — use the function form for true pay-per-page pricing.
- Default currency is ALGO (resolved from the USD-style price string). Only
  add `extra: { asset: USDC_TESTNET_ASA_ID }` if you specifically want USDC
  pricing instead — not required for this project.

### 5. Client-side (for testing without a full wallet)

For local testing/demo, use the `@x402-avm` client examples (Fetch or Axios
wrapper) which handle the "get 402 → sign payment → retry" dance
automatically, rather than hand-writing that logic:

```bash
npm install @x402-avm/fetch
```

```ts
import { wrapFetchWithPayment } from "@x402-avm/fetch";
// wrapFetchWithPayment(fetch, signer) returns a fetch-like function that
// automatically retries 402 responses with a signed payment.
```

---

## ALGORAND INTEGRATION — IN DEPTH

### 1. Create two Algorand TESTNET accounts

You need at least two accounts:
- **Merchant/resource-server account** — receives the payments (`RESOURCE_PAY_TO`).
- **Client/payer account** — used by your demo frontend or test script to pay.

Easiest ways to get testnet accounts, pick one:
- Install **Pera Wallet** (mobile or web), switch it to TestNet mode, and
  create two accounts there — this also gives you a real wallet to sign
  payments with during your live demo.
- Or generate accounts programmatically with `@algorandfoundation/algokit-utils`
  (`algokit-utils` account generation helpers) if you want a fully scripted
  setup for automated testing.

### 2. Fund both accounts with testnet ALGO

Use the official Algorand TestNet dispenser to fund each address with a small
amount of testnet ALGO (enough to cover the $0.01–$1.00 demo payments plus
network fees). Do this for **both** the merchant and the payer account.

### 3. Configure environment variables

```
# .env
RESOURCE_PAY_TO=<your merchant testnet address, 58 characters>
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_TOKEN=
PORT=4021
```

- `ALGOD_SERVER` points at a public Algorand testnet node (Algonode's public
  endpoint is free and requires no token — leave `ALGOD_TOKEN` empty).
- You do **not** need to run your own Algorand node.

### 4. Facilitator — use the hosted one, don't build your own

For the hackathon, point your `HTTPFacilitatorClient` at the official hosted
Algorand facilitator:

```
https://facilitator.goplausible.xyz
```

This facilitator already knows how to verify and settle Algorand exact
payments — you do not need to run `x402Facilitator` yourself unless you
specifically want to demonstrate a self-hosted facilitator or need fee
abstraction (a facilitator paying the network fee on the user's behalf), which
is an optional advanced feature, not required for a working demo.

### 5. Network identifiers you'll need

| What | Value |
|---|---|
| Testnet CAIP-2 ID | `ALGORAND_TESTNET_CAIP2` constant from `@x402-avm/avm` |
| Testnet algod URL | `https://testnet-api.algonode.cloud` |
| Testnet USDC ASA ID (only if using USDC pricing) | `10458941` |

### 6. Testing the full loop locally

1. Start your resource server (`npm run dev` or similar).
2. `curl -X POST http://localhost:4021/summarize -d '{"text":"..."}' -H "Content-Type: application/json"` with no payment → expect `402` with price + payment details.
3. Use the wrapped fetch client (or your demo frontend + Pera Wallet) to sign
   and attach payment, then retry → expect `200` with the summary.
4. Try an insufficient/invalid payment to confirm you get a clean `402`
   failure, not a crash — this demonstrates the fallback handling to judges.

### 7. What to show live during judging

- The raw `402` response (price + Algorand payment details) in a terminal or
  browser network tab — this is the clearest way to prove real x402 usage.
- A successful payment + summary round-trip.
- One deliberate failure case (e.g. underpaying) to show your fallback
  handling actually works, not just the happy path.

After Base Build features:
#1 - Complete an end-to-end payment with a real Algorand testnet wallet What & Why The x402 middleware is wired up and returns a correct 402 response, but the demo frontend uses a simulated flow. To fully prove the protocol in a live demo, the frontend needs to complete a real Algorand payment using Pera Wallet (WalletConnect) or the @x402-avm/fetch wrapped-fetch client.

Done looks like Frontend connects to Pera Wallet via WalletConnect or AlgoConnect On "Pay", it reads the 402 payment requirements, builds the Algorand txn, gets user signature, and retries POST /api/summarize with the signed X-PAYMENT header A real successful summary is returned after on-chain settlement on Algorand testnet RESOURCE_PAY_TO is set in Secrets to a funded testnet merchant address Relevant files artifacts/api-server/public/index.html — demo frontend; the payment simulation block (labeled "Real-wallet integration point") is the exact hook artifacts/api-server/src/x402/routeConfig.ts — middleware config artifacts/api-server/.env.example — env var reference

#2 - Add a live payment history dashboard What & Why Every request is appended to requests.log (JSON Lines). A simple dashboard reading that log would let you monitor page counts, revenue, payment statuses, and errors — useful for a live hackathon demo and for monitoring real usage.

Done looks like A GET /api/logs endpoint streams or returns recent entries from requests.log A new tab or section in the frontend shows a live table: timestamp, pages, price, payment status, outcome Auto-refreshes every few seconds during the demo Relevant files artifacts/api-server/src/services/pagepayLogger.ts — log format definition artifacts/api-server/public/index.html — where the dashboard tab would live

#3 - Prevent silent failures when the facilitator is slow or unreachable What & Why The x402-avm middleware calls the hosted facilitator (facilitator.goplausible.xyz) to verify and settle payments. If that call times out, the middleware behaviour is currently unhandled — it may hang or return an unhelpful error. The build spec requires a 504 with a clear message after one retry.

Done looks like A timeout + single retry wrapper is applied around the facilitator calls (or the Express timeout middleware is configured to cover the full request) Timeout returns HTTP 504 with { error: "Payment gateway timeout", reason: "..." } The failed attempt is logged to requests.log with outcome "gateway_error" Relevant files artifacts/api-server/src/x402/routeConfig.ts — facilitator client setup artifacts/api-server/src/routes/summarize.ts — where the 504 response belongs

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cd97ba70-3a36-42fd-a8c5-c2cfb66a3552).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
