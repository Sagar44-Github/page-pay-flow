import{t as e}from"./jsx-runtime-CfuWmoMz.js";import{n as t}from"./MarketingPage-IkApkD27.js";import{r as n,t as r}from"./DocsLayout-BYbcoOvr.js";var i=[{id:`endpoints`,title:`Endpoints Overview`,body:"All PagePay API endpoints use standard HTTP semantics, supporting both human web interfaces and autonomous AI agents.\n\n| Method | Path | Auth / Payment | Description |\n| --- | --- | --- | --- |\n| `POST` | `/api/price` | None | Calculate page count & USD price quote for document text |\n| `POST` | `/api/summarize` | HTTP 402 | Single document AI processing (5 extraction modes) |\n| `POST` | `/api/summarize/range` | HTTP 402 | Page range selection AI processing (e.g. pages 2–5) |\n| `POST` | `/api/compare` | HTTP 402 | Side-by-side dual document comparison (Document A vs B) |\n| `GET` | `/api/receipt` | None (Public) | Independent receipt verification service by Algorand TxID |\n| `GET` | `/api/trust-score` | None (Public) | Algorand address reliability score (0-100) aggregation |\n| `GET` | `/api/audit/verify` | None (Public) | Cryptographic SHA-256 tamper-evident log chain audit check |\n| `GET` | `/api/tools` | None (Public) | Machine-readable tool discovery for AI Agents (Agentic metadata) |\n| `GET` | `/api/logs` | None | Recent structured log entries |\n| `GET` | `/api/metrics` | None | System aggregation metrics |"},{id:`extraction-modes`,title:`5 Extraction Modes`,body:"PagePay supports 5 specialized AI extraction modes on `POST /api/summarize` and `POST /api/summarize/range`:\n\n1. **`summary`** (default): Standard document overview & core key points.\n2. **`action_items`**: Extracts actionable tasks, assignees, deadlines, and deliverables.\n3. **`key_risks`**: Highlights concerning clauses, legal risks, and severity ratings.\n4. **`compliance_check`**: Evaluates text against 5 contract standards (parties/roles, dates/deadlines, breach terms, termination clauses, governing law) using `✅ Present` or `❌ Not mentioned`.\n5. **`checklist`**: Converts procedure or agreement into ordered, step-by-step implementation checkboxes (`- [ ] Step`)."},{id:`summarize-paid`,title:`POST /api/summarize (x402 Flow)`,body:`### Request Body

\`\`\`json
{
  "text": "Document content to analyze...",
  "mode": "compliance_check"
}
\`\`\`

### Unpaid Response (402 Payment Required)

\`\`\`json
{
  "x402Version": 2,
  "accepts": [
    {
      "scheme": "exact",
      "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
      "amount": "10000",
      "asset": "10458941",
      "payTo": "UPRVZO4TROKAOI2KBRWKVKQUWXNV4DQ4NDL5PEARA4IVZ73DDROT2ATSV4"
    }
  ]
}
\`\`\`

### Paid Retry Response (200 OK)

\`\`\`json
{
  "summary": "## Compliance Check\\n\\n- **Parties & Roles**: ✅ Present...\\n",
  "mode": "compliance_check",
  "pages": 1,
  "pricePaid": "$0.01",
  "amountPaid": "10000",
  "txId": "VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q",
  "explorer": "https://lora.algokit.io/testnet/transaction/VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q",
  "payer": "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE"
}
\`\`\``},{id:`compare`,title:`POST /api/compare (Dual-Document)`,body:`Side-by-side comparison of Document A vs Document B. Combines total pages into a single 402 payment quote.

### Request Body (JSON or multipart/form-data)

\`\`\`json
{
  "textA": "Terms of Service 2024...",
  "textB": "Terms of Service 2025..."
}
\`\`\`

### Paid Response 200 OK

\`\`\`json
{
  "comparison": "## Document A vs Document B Comparison\\n\\n### Key Differences...\\n",
  "pagesA": 1,
  "pagesB": 1,
  "combinedPages": 2,
  "pricePaid": "$0.02",
  "amountPaid": "20000",
  "txId": "NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA",
  "explorer": "https://lora.algokit.io/testnet/transaction/NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA"
}
\`\`\``},{id:`receipt-verification`,title:`GET /api/receipt (Verification Service)`,body:`Public, read-only endpoint for verifying settled transactions against server log hashes and Algorand Testnet indexer.

### Example Request

\`GET /api/receipt?txId=VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q\`

### Response 200 OK

\`\`\`json
{
  "verified": true,
  "txId": "VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q",
  "route": "POST /api/summarize",
  "pages": 1,
  "pricePaid": "$0.01",
  "payer": "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
  "auditChain": {
    "entryHash": "b3f9d3fe1e448520d8e164678beb239a7ebb1c6000a348f815c44d0701299a6a",
    "previousEntryHash": "36f22782e9861a54db6e7b85682c6a02d4ec095d83b534399b5507bac8f960d8"
  },
  "onChainVerified": true,
  "explorer": "https://lora.algokit.io/testnet/transaction/VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q"
}
\`\`\``},{id:`trust-score`,title:`GET /api/trust-score (Address Reliability)`,body:`Computes a 0–100 reliability score from an address's real PagePay payment history.

### Example Request

\`GET /api/trust-score?address=EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE\`

### Response 200 OK

\`\`\`json
{
  "address": "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
  "trustScore": 100,
  "totalTransactions": 10,
  "totalVolumeUsd": "$0.11",
  "successRate": 100
}
\`\`\``},{id:`audit-verify`,title:`GET /api/audit/verify (SHA-256 Audit Chain)`,body:`Read-only verification of the tamper-evident log chain. Each log entry incorporates the SHA-256 hash of the previous entry.

### Response 200 OK

\`\`\`json
{
  "valid": true,
  "totalEntries": 15,
  "brokenAt": null,
  "verifiedAt": "2026-08-22T20:58:00.000Z"
}
\`\`\``},{id:`agent-policy-guard`,title:`Agent Spend Policy Guard`,body:"Client-side policy layer (`src/lib/pagepay/agentPolicy.ts`) enforcing limits BEFORE signing:\n\n- **`maxPricePerRequestUsd`**: Caps single transaction cost (e.g. $0.10)\n- **`sessionBudgetUsd`**: Total budget allocated for the session (e.g. $1.00)\n- **`allowedModes`**: Allowed extraction modes\n- **`allowedEndpoints`**: Permitted API paths\n\nIf any policy rule is violated, the client aborts execution before constructing or signing any transaction."}],a=e();function o(){return(0,a.jsx)(t,{children:(0,a.jsx)(r,{title:`API reference`,description:`Full HTTP API documentation: endpoints, request/response schemas, x402 headers, curl examples, client integration patterns, and error codes.`,children:(0,a.jsx)(n,{sections:i})})})}export{o as component};