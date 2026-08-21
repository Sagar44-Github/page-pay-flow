import type { DocSection } from "@/components/marketing/DocSections";

export const ALGORAND_SECTIONS: DocSection[] = [
  {
    id: "network",
    title: "Network configuration",
    body: `PagePay operates exclusively on **Algorand Testnet**. Mainnet is not supported in this reference deployment.

| Setting | Value |
| --- | --- |
| Network name | Algorand Testnet |
| Chain ID (Pera) | \`416002\` |
| Genesis hash | Used to derive CAIP-2 \`algorand:...\` network ID |
| Explorer | [testnet.explorer.perawallet.app](https://testnet.explorer.perawallet.app) |
| Dispenser | [bank.testnet.algorand.network](https://bank.testnet.algorand.network/) |

**Wallet network mismatch** is the #1 integration bug: if Pera is on Mainnet but the API quotes Testnet, signing will fail or produce invalid signatures. Always verify the network badge in Pera settings before connecting.`,
  },
  {
    id: "usdc-asset",
    title: "USDC testnet asset",
    body: `Payments settle in **USDC**, not ALGO. ALGO is only required for transaction fees and minimum balance requirements.

| Property | Value |
| --- | --- |
| ASA ID | \`10458941\` |
| Name | USDC (Circle testnet) |
| Decimals | 6 |
| Atomic unit | 1 micro-USDC = \`0.000001\` USDC |
| Price per page | \`10000\` atomic units = **$0.01** |

**Funding USDC:**
1. Visit [Circle Testnet Faucet](https://faucet.circle.com)
2. Select **Algorand** → **Testnet**
3. Enter your Pera address
4. Wait for confirmation (~4 seconds on Algorand)

**Common mistake:** funding only ALGO via the Algorand dispenser. The x402 exact payment is an **asset transfer**, not an ALGO payment.`,
  },
  {
    id: "transaction-structure",
    title: "Transaction group structure",
    body: `x402 exact-AVM payments with a hosted facilitator use a **2-transaction atomic group**:

### Transaction 0 — Fee payer placeholder
- Type: Payment or noop placeholder depending on facilitator implementation
- Signer: **Facilitator** (\`extra.feePayer\`)
- Client provides unsigned txn; facilitator signs at settle time

### Transaction 1 — USDC transfer
- Type: \`axfer\` (asset transfer)
- Asset: USDC ASA 10458941
- From: payer wallet address
- To: merchant \`payTo\` address
- Amount: exact \`amount\` from quote
- Signer: **Pera Wallet** (user)

Both transactions must succeed atomically — if either fails, neither is committed. This protects merchants from partial payments and payers from charged-but-unfulfilled requests when combined with server-side verify-before-fulfill logic.`,
    code: {
      title: "Pre-flight checklist",
      code: `# Before your first payment:
1. Pera on Testnet (416002)
2. ≥ 0.3 ALGO for fees + min balance
3. ≥ payment amount in USDC (ASA 10458941)
4. RESOURCE_PAY_TO set on server (merchant address)
5. Same address connected in header as signing wallet`,
    },
  },
  {
    id: "pera-signing",
    title: "Pera Wallet signing (ARC-0001)",
    body: `PagePay uses \`@perawallet/connect\` for browser wallet integration.

**Desktop flow:**
1. Click Connect wallet → Pera Web opens at \`web.perawallet.app\`
2. Approve connection for Testnet address
3. On payment, a new tab opens for transaction approval
4. Review USDC amount and merchant address → Approve

**Mobile flow:**
1. Scan WalletConnect QR from Pera mobile app
2. Approve connection and transactions on device

**Critical signing detail:** when calling \`pera.signTransaction\`, each txn in the group must specify signers explicitly:
- \`{ txn, signers: [yourAddress] }\` for transactions you sign
- \`{ txn, signers: [] }\` for facilitator-only slots

Omitting \`signers\` while passing a global address causes Pera to skip signing — the UI appears stuck at "Signing in Pera".`,
  },
  {
    id: "facilitator",
    title: "GoPlausible facilitator",
    body: `PagePay delegates on-chain submission to the hosted **GoPlausible** facilitator at \`https://facilitator.goplausible.xyz\`.

### Verify (\`POST /verify\`)
- Validates the signed payment payload against the original requirements
- Checks signature structure, amounts, asset, network, and timeout
- Returns success/failure before any chain submission

### Settle (\`POST /settle\`)
- Submits the atomic transaction group to Algorand Testnet
- Co-signs as fee payer on transaction 0
- Returns \`txId\` on confirmation

**Why use a facilitator?** Clients only sign the USDC transfer — they do not need ALGO for fees on the group. The facilitator sponsors fees in exchange for serving as co-signer.

**504 timeouts:** testnet congestion or facilitator load can cause slow settlement. PagePay returns retryable errors; the client should not assume payment failed until verify confirms no submission.`,
  },
  {
    id: "merchant-address",
    title: "Merchant address (payTo)",
    body: `The \`payTo\` field in payment requirements is the Algorand address receiving USDC. In PagePay this maps to the \`RESOURCE_PAY_TO\` server environment variable.

**Self-payment is valid:** payer and payTo can be the same address (you pay yourself in a demo). The protocol cares about exact amount settlement, not address inequality.

**Verification:** after payment, confirm USDC balance increased at \`payTo\` via explorer or \`GET /v2/accounts/{address}/assets\`.`,
  },
  {
    id: "proof",
    title: "Proof of payment",
    body: `Never trust UI state alone. PagePay surfaces multiple independent proof layers:

1. **\`txId\`** in JSON response body
2. **\`PAYMENT-RESPONSE\`** header with settlement metadata
3. **Explorer link** to \`testnet.explorer.perawallet.app/tx/{txId}\`
4. **Protocol proof panel** in Live Demo with raw HTTP exchanges

On explorer, verify:
- Status: **Confirmed**
- Type: **Application call** or **Asset transfer** group
- USDC amount matches quote
- Receiver matches \`payTo\``,
  },
  {
    id: "troubleshooting",
    title: "Algorand troubleshooting",
    body: `| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Signing never completes | Pera tab not approved | Check \`web.perawallet.app\` tab or mobile app |
| \`insufficient funds\` | No USDC | Circle faucet → Algorand Testnet |
| \`overspend\` / fee error | Low ALGO | Algorand dispenser |
| Wrong network tx | Mainnet wallet | Switch Pera to Testnet |
| txId missing | Settle failed | Check facilitator logs / retry |
| Amount off by 10× | Decimals confusion | USDC uses 6 decimals; $0.01 = 10000 units |`,
  },
];
