<div align="center">

# ⚡ PagePay
### Autonomous Machine-to-Machine Pay-Per-Page AI Processing over HTTP 402 on Algorand

[![HTTP 402 Protocol](https://img.shields.io/badge/Protocol-HTTP%20402%20v2-7c3aed.svg?style=for-the-badge&logo=http)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)
[![Algorand Testnet](https://img.shields.io/badge/Blockchain-Algorand%20Testnet-16a34a.svg?style=for-the-badge&logo=algorand)](https://lora.algokit.io/testnet)
[![USDC ASA](https://img.shields.io/badge/Asset-USDC%20ASA%2010458941-2563eb.svg?style=for-the-badge)](https://faucet.circle.com)
[![GoPlausible Facilitator](https://img.shields.io/badge/Facilitator-GoPlausible-ca8a04.svg?style=for-the-badge)](https://facilitator.goplausible.xyz)
[![AI Engine](https://img.shields.io/badge/LLM-Groq%20%2F%20Gemini%202.5-000000.svg?style=for-the-badge&logo=openai)](https://groq.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178c6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg?style=for-the-badge)]()

<br />

*An autonomous, non-custodial API platform enabling AI agents, automated scripts, and human clients to pay for high-value AI document processing in real time over standard HTTP 402 using exact-metered Algorand USDC transfers.*

</div>

---

## 🏆 Hackathon Judge Evaluation & Quick-Start Guide

> [!IMPORTANT]
> **WELCOME JUDGES!** This section provides everything you need to evaluate and test PagePay in 2 minutes.

### 💡 1. Problem & Solution (TL;DR)
- **The Problem**: Web2 API monetization requires human accounts, CAPTCHAs, email verification, and credit cards via Stripe. Autonomous AI agents operate headlessly and cannot pass CAPTCHAs, fill out forms, or hold corporate credit cards.
- **The Solution**: PagePay uses standard **HTTP 402 Payment Required** status codes paired with **Algorand Testnet USDC ASA 10458941**. Unpaid requests return a 402 response with exact page-metered pricing; agents sign transactions via wallet keypairs and receive AI extractions within seconds — **zero sign-up, zero accounts, zero static keys**.

### ⭐ 2. Unique Selling Proposition (USP) & Core Differentiators
1. **True Autonomous Agent Economic Agency**: Features a client-side **Agent Spend Policy Guard** enforcing request price caps ($/request) and session budgets ($/session) *before* signature generation.
2. **5 Specialized AI Extraction Modes & Dual-Doc Compare**: Supports `Summary`, `Action Items`, `Key Risks`, `Compliance Check`, `Checklist`, and side-by-side `Document A vs B` comparison rendered with rich GFM Markdown typography.
3. **Resilient Multi-Candidate AI Engine & Blob Buffer**: Uses universal Groq models (`llama3-70b-8192`, `llama3-8b-8192`) with multi-candidate fallbacks and in-memory `FormData` Blob buffering for 402 retries.
4. **Dynamic Agent Trust Score Mathematical Engine**: Public `/api/trust-score` endpoint calculates a live 0-100 score with exact mathematical formula breakdown ($\text{Score} = \min(100, \text{TxCountPoints} + \text{SuccessRatePoints} + \text{VolumeBonusPoints})$) and weight progress cards.
5. **Cryptographic SHA-256 Audit Hash Chain**: Every request entry is hashed sequentially into a tamper-evident chain ($\text{EntryHash}_n = \text{SHA256}(\dots)$) and re-verified via `/api/audit/verify` and `/api/receipt`.

### 🔗 3. Verified Algorand Testnet x402 Transaction Links
Every transaction below was settled on Algorand Testnet using PagePay's HTTP 402 flow and is independently verifiable on the Lora Explorer:

- 🟢 **Transaction #1 (Single Summary - $0.01 Settled)**: [`VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q`](https://lora.algokit.io/testnet/transaction/VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q)
- 🟢 **Transaction #2 (Compliance Check - $0.01 Settled)**: [`27J5GFWM32ZD2TBJ5KIVLXZE34BZMPRJA757G542LVX4UXRFNI4A`](https://lora.algokit.io/testnet/transaction/27J5GFWM32ZD2TBJ5KIVLXZE34BZMPRJA757G542LVX4UXRFNI4A)
- 🟢 **Transaction #3 (Dual-Doc Compare - $0.02 Settled)**: [`NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA`](https://lora.algokit.io/testnet/transaction/NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA)
- 🟢 **Transaction #4 (Page Range Selection - $0.01 Settled)**: [`SYPV4SICW6QQC5TAOTEKB4F32FKXL5MAUOKUDTTZ3H76SGKVQNJA`](https://lora.algokit.io/testnet/transaction/SYPV4SICW6QQC5TAOTEKB4F32FKXL5MAUOKUDTTZ3H76SGKVQNJA)
- 🟢 **Transaction #5 (Checklist Mode - $0.01 Settled)**: [`WD4FH3EUMLDU7BXZRRB3K7N7KQUQRN3RBKYRMVJ5J44ROTFVRBKQ`](https://lora.algokit.io/testnet/transaction/WD4FH3EUMLDU7BXZRRB3K7N7KQUQRN3RBKYRMVJ5J44ROTFVRBKQ)

### 🚀 4. Quick 2-Minute Local Setup & Testing

```bash
# 1. Clone the repository & install dependencies
git clone https://github.com/Sagar44-Github/page-pay-flow.git
cd page-pay-flow
npm install

# 2. Run Vite dev server
npm run dev

# 3. Open http://localhost:8080 in Chrome or Edge
```

> [!TIP]
> **No Wallet / No Testnet Funds?** Navigate to `http://localhost:8080/x402-demo` to test the full HTTP 402 protocol in **Test Mode (Simulation Engine)** with zero wallet setup required!

### 🏗️ 5. Primary Architecture Overview

```mermaid
graph TB
    subgraph Client ["Client & AI Agent"]
        Agent["🤖 AI Agent"] -->|1. Unpaid POST| Gateway["🌐 PagePay Gateway"]
        Agent -->|3. Evaluate Policy & Sign| Wallet["🔑 Pera Wallet / ARC-0001 Key"]
    end
    subgraph GatewaySpace ["Server & AI"]
        Gateway -->|2. HTTP 402 Quote| Agent
        Gateway -->|5. Execute Mode Prompt| Groq["🧠 Groq LLM Engine"]
        Groq -->|6. Append SHA-256 Entry| Audit["🔒 SHA-256 Audit Log"]
        Audit -->|7. HTTP 200 OK + txId| Agent
    end
    subgraph OnChain ["Settlement Infrastructure"]
        Wallet -->|4. Retry POST + Signature| Gateway
        Gateway -->|Verify & Settle| Facilitator["⚡ GoPlausible Facilitator"]
        Facilitator -->|Atomic 2-Txn Group| Algorand["⛓️ Algorand Testnet ASA 10458941"]
    end
```

---

## 📌 Table of Contents

- [🏆 Hackathon Judge Evaluation & Quick-Start Guide](#-hackathon-judge-evaluation--quick-start-guide)
- [🌟 1. Executive Overview & Agentic Rationale](#-1-executive-overview--agentic-rationale)
  - [The Web2 API Billing Problem](#the-web2-api-billing-problem)
  - [The HTTP 402 + Algorand Solution](#the-http-402--algorand-solution)
  - [Machine-to-Machine Agent Autonomy Rationale](#machine-to-machine-agent-autonomy-rationale)
  - [Machine-to-Machine Agent Autonomy Rationale](#machine-to-machine-agent-autonomy-rationale)
- [🏗️ 2. Deep Technical System Architecture](#%EF%B8%8F-2-deep-technical-system-architecture)
  - [System Topology Architecture](#system-topology-architecture)
  - [HTTP 402 Protocol Sequence & Settlement Loop](#http-402-sequence--settlement-loop)
  - [Backend Intake & AI Processing Pipeline](#backend-intake--ai-processing-pipeline)
  - [GoPlausible Facilitator Interaction Loop](#goplausible-facilitator-interaction-loop)
  - [Cryptographic SHA-256 Audit Chain Architecture](#cryptographic-sha-256-audit-chain-architecture)
- [🔑 3. HTTP 402 v2 Protocol Specification](#-3-http-402-v2-protocol-specification)
  - [Protocol Header Semantics](#protocol-header-semantics)
  - [Exact-AVM Scheme Specification](#exact-avm-scheme-specification)
  - [Complete JSON Payload Schemas](#complete-json-payload-schemas)
  - [HTTP Error & Failure Modes Matrix](#http-error--failure-modes-matrix)
- [⛓️ 4. Algorand Blockchain & GoPlausible Facilitator Deep Dive](#%EF%B8%8F-4-algorand-blockchain--goplausible-facilitator-deep-dive)
  - [Algorand Testnet Specifications & ASA 10458941](#algorand-testnet-specifications--asa-10458941)
  - [USDC Micro-Unit Conversion Math](#usdc-micro-unit-conversion-math)
  - [GoPlausible Hosted Facilitator Integration](#goplausible-hosted-facilitator-integration)
  - [Atomic 2-Transaction Group Anatomy](#atomic-2-transaction-group-anatomy)
- [🔒 5. Cryptographic SHA-256 Tamper-Evident Audit Trail](#-5-cryptographic-sha-256-tamper-evident-audit-trail)
- [🕹️ 6. Pin-to-Pin UI & Feature Catalog](#%EF%B8%8F-6-pin-to-pin-ui--feature-catalog)
  - [Global Navigation & Header Bar](#global-navigation--header-bar)
  - [Landing Page & Hero Section (`/`)](#landing-page--hero-section-)
  - [Live Demo: Single Document Summarization (`/demo`)](#live-demo-single-document-summarization-demo)
  - [Live Demo: Dual Document Comparison (`CompareDemo`)](#live-demo-dual-document-comparison-comparedemo)
  - [Agent Spend Policy Guard Component](#agent-spend-policy-guard-component)
  - [Audit Trail, Receipt Verification & Trust Score Widgets](#audit-trail-receipt-verification--trust-score-widgets)
  - [Protocol Sandbox & Simulation Engine (`/x402-demo`)](#protocol-sandbox--simulation-engine-x402-demo)
  - [Documentation Pages (`/docs`, `/developers`, `/integrations`)](#documentation-pages-docs-developers-integrations)
- [🔌 7. Exhaustive API Reference (All Endpoints)](#-7-exhaustive-api-reference-all-endpoints)
- [🌱 8. Startup Transaction Seed & Verifiable History](#-8-startup-transaction-seed--verifiable-history)
- [💻 9. Installation, Environment & Local Setup](#-9-installation-environment--local-setup)

---

## 🌟 1. Executive Overview & Agentic Rationale

**PagePay** is a production-grade reference SaaS application and developer platform demonstrating **autonomous machine-to-machine (M2M) API monetization**. Built natively on the **HTTP 402 Payment Required** standard and settled on **Algorand Testnet (USDC ASA 10458941)**, PagePay eliminates traditional Web2 monetization friction — accounts, email signups, credit card forms, subscriptions, and static API keys — in favor of **instant, micro-metered on-chain settlement**.

---

### 🚨 The Web2 API Billing Problem

Traditional SaaS API monetization was designed in the early 2000s under a fundamental premise: **APIs are consumed by humans building web applications**. As a result, the entire Web2 billing ecosystem is engineered around human interaction patterns:

```
[Human Developer] ──> [Web Sign-Up Form] ──> [Solve CAPTCHA / Verify Email] ──> [Stripe Credit Card Form] ──> [Generate Static Bearer Key]
```

#### The 5 Structural Flaws of Web2 API Billing for Autonomous AI Agents

> [!PROBLEM]
> 1. **The Identity & Sign-Up Bottleneck**:
>    Autonomous AI agents operate headlessly. An AI agent cannot navigate web sign-up pages, solve hCaptcha/reCAPTCHA challenges, receive SMS verification codes, or verify email confirmation links. Requiring human registration blocks software-to-software commerce entirely.
>
> 2. **Payment Instrument Lock-in (Plastic Credit Cards & KYC)**:
>    Stripe, Chargebee, and traditional payment processors require 16-digit credit card numbers, billing zip codes, 3D Secure OTP approvals, and business KYC/KYB identification. AI agents do not possess credit cards or bank accounts.
>
> 3. **The Security Liability of Static Bearer API Keys**:
>    Web2 APIs rely on static keys (`Authorization: Bearer sk-...`). These keys are frequently leaked in code repositories or client-side bundles. Once compromised, an attacker can drain a developer's credit card until spending limits are reached.
>
> 4. **SaaS Subscription Traps & Unfair Prepaid Tiers**:
>    Web2 APIs force developers into fixed monthly plans ($29/mo, $99/mo) or minimum prepaid token credit bundles ($100 minimum deposit). If an agent only needs to process 1 page of text once, paying a monthly subscription is highly inefficient.
>
> 5. **Opaque Black-Box Metering**:
>    Web2 API providers meter usage in private, centralized databases. Clients have zero cryptographic proof that they were charged accurately or that the requested computational work was performed faithfully.

---

### ⚡ The HTTP 402 + Algorand Solution

PagePay solves all 5 structural flaws by reviving the native **HTTP 402 Payment Required** status code and pairing it with **Algorand Testnet (USDC ASA 10458941)** exact micro-metering:

```
[Client / AI Agent] ──(1) Unpaid POST Request───────> [PagePay API Gateway]
                    <──(2) HTTP 402 + Machine Quote────
[Evaluates Policy]  
[Signs USDC Txn]   ──(3) Retry POST + PAYMENT-SIG───> [Verifies & Settles On-Chain]
                    <──(4) HTTP 200 + AI Extraction────
```

#### How PagePay Overcomes Every Web2 Flaw:

> [!TIP]
> 1. **Zero Registration — 100% Frictionless Access**:
>    Any machine, agent, or application with an Algorand wallet address can consume the PagePay API instantly. Zero sign-up forms, zero email verification, zero passwords.
>
> 2. **Native Cryptographic Payment Settlement**:
>    Payments settle in stablecoin (**Circle Testnet USDC ASA 10458941**). The agent signs transactions using standard cryptographic keypairs, eliminating plastic credit cards and Stripe forms.
>
> 3. **Non-Custodial Ephemeral Authorization**:
>    PagePay never stores private keys or static API keys. Authorization is scoped **per-request** using cryptographic signatures (`PAYMENT-SIGNATURE`). Leaking a past header conveys zero future access to an attacker.
>
> 4. **Exact Micro-Metered Pay-Per-Page Pricing**:
>    Clients pay strictly for what they consume: **$0.01 USD per parsed document page** (500 words = 1 page). If a document is 2 pages, the payment is exactly $0.02 USD. No monthly fees, no minimum deposits.
>
> 5. **Cryptographic Proof & Immutable Audit Chain**:
>    Every processed transaction generates an on-chain transaction ID (`txId`) and appends a SHA-256 hash entry to a tamper-evident audit log chain. Anyone can verify log integrity via public endpoints (`/api/receipt`, `/api/audit/verify`).

---

### 📊 Web2 SaaS API Billing vs. PagePay HTTP 402 Comparison

| Architectural Dimension | Traditional Web2 SaaS API Billing | PagePay HTTP 402 + Algorand |
| --- | --- | --- |
| **Authentication Primitive** | Static Bearer API Keys (`sk-proj-...`) | Ephemeral Cryptographic Signatures (`PAYMENT-SIGNATURE`) |
| **Account Onboarding** | Required (Web forms, Email verification) | **Zero Registration Required** — Open to any machine |
| **Payment Instrument** | Plastic Credit Cards (Stripe / Braintree) | Native On-Chain Stablecoin (Circle USDC ASA 10458941) |
| **Payment Finality** | 30-day chargeback risk / monthly invoicing | **Instant Finality in ~3.3 Seconds** on Algorand |
| **Metering Granularity** | Monthly tiers ($29/mo) or minimum token packs | **Exact Metering per Parsed Page** ($0.01 / page) |
| **Agent Autonomy** | Impossible (Human intervention required) | **Native** — Agent Spend Policy Guard enforces caps |
| **Security Risk** | Leaked key drains credit card balance | Key compromise isolated; client controls wallet caps |
| **Machine Discovery** | Manual documentation reading | **Self-Describing API** (`GET /api/tools` & HTTP 402 JSON) |
| **Custody & Trust** | Custodial (Server stores billing info) | **Non-Custodial** (Server never touches private keys) |
| **Auditability** | Opaque centralized server logs | **SHA-256 Cryptographic Audit Chain + On-Chain Proof** |

---

### 🤖 Machine-to-Machine Agent Autonomy Rationale

PagePay provides a complete operational framework for **Autonomous Agentic Economic Decision-Making**:

1. **Tool & Endpoint Discovery (`GET /api/tools`)**:
   AI agents fetch machine-readable JSON metadata describing available API routes, pricing rules, payment requirements, and extraction modes automatically.
2. **Self-Describing Payment Quoting**:
   Sending an unpaid request to `/api/summarize` or `/api/compare` returns an **HTTP 402 Payment Required** status code with a `PAYMENT-REQUIRED` header containing the exact cost in micro-units, merchant `payTo` address, and asset ID.
3. **Client-Side Spend Policy Enforcement**:
   Before building or signing any transaction, the agent's **Agent Spend Policy Guard** checks constraints locally:
   $$\text{RequestCost} \le \text{MaxPricePerRequestUSD} \quad \land \quad (\text{TotalSpent} + \text{RequestCost}) \le \text{SessionBudgetUSD}$$
   If the price exceeds policy limits, the agent aborts execution locally without making an on-chain transaction or wasting gas.
4. **Sub-3.3 Second Settlement & Output**:
   Transactions settle on Algorand in **~3.3 seconds**, allowing the AI agent to receive its AI extraction within the standard HTTP request window.

---

## 🏗️ 2. Deep Technical System Architecture

### System Topology Architecture

```mermaid
graph TB
    subgraph ClientSpace ["Client & Autonomous Agent Space"]
        Agent["🤖 Autonomous AI Agent"]
        UserUI["💻 Web Client UI (React 18)"]
        PolicyEngine["🛡️ Agent Spend Policy Guard"]
        WalletSigner["🔑 Pera Wallet / ARC-0001 Signer"]
    end

    subgraph ServerSpace ["PagePay API Gateway (TanStack Start / Nitro)"]
        Router["🌐 API Gateway Router"]
        MeterEngine["📊 Document Metering Engine"]
        x402Server["🔒 x402 v2 Resource Server"]
        AuditChain["📜 Cryptographic SHA-256 Audit Logger"]
    end

    subgraph PaymentSpace ["Payment & Settlement Layer"]
        GoPlausible["⚡ GoPlausible Facilitator API"]
        Algorand["⛓️ Algorand Testnet (ASA 10458941)"]
    end

    subgraph AISpace ["Artificial Intelligence Gateway"]
        GroqLLM["🧠 Groq LLM Engine (Gemini 2.5 / GPT-OSS)"]
    end

    Agent -->|1. Unpaid POST| Router
    UserUI -->|1. Unpaid POST| Router
    Router --> MeterEngine
    MeterEngine -->|Calculate Pages & Cost| x402Server
    x402Server -->|2. HTTP 402 + PAYMENT-REQUIRED Header| PolicyEngine

    PolicyEngine -->|3. Evaluate Max Price & Session Budget| WalletSigner
    WalletSigner -->|4. Sign Exact-AVM Txn Group| x402Server
    x402Server -->|5. Paid Retry + PAYMENT-SIGNATURE Header| x402Server

    x402Server -->|6. Verify Signature| GoPlausible
    GoPlausible -->|7. Co-sign Fee-Payer & Submit| Algorand
    Algorand -->|8. Confirmed txId| GoPlausible
    GoPlausible -->|9. Settlement Proof| x402Server

    x402Server -->|10. Execute Mode Prompt| GroqLLM
    GroqLLM -->|11. AI Markdown Output| AuditChain
    AuditChain -->|12. Append SHA-256 Hash Entry| AuditChain
    AuditChain -->|13. HTTP 200 OK + Output + txId| Agent
    AuditChain -->|13. HTTP 200 OK + Output + txId| UserUI
```

---

### HTTP 402 Sequence & Settlement Loop

```mermaid
sequenceDiagram
    autonumber
    actor Agent as 🤖 AI Agent / Client
    participant Gateway as 🌐 PagePay API Gateway
    participant Facilitator as ⚡ GoPlausible Facilitator
    participant Blockchain as ⛓️ Algorand Testnet
    participant LLM as 🧠 Groq AI Engine

    Agent->>Gateway: POST /api/summarize (Unpaid document payload)
    Gateway->>Gateway: Parse words/pages (500 words = 1 page) & compute price
    Gateway-->>Agent: HTTP 402 Payment Required<br/>Header: PAYMENT-REQUIRED (Base64 JSON)

    Agent->>Agent: Decode PAYMENT-REQUIRED payload
    Agent->>Agent: Evaluate Agent Policy (Price <= MaxPrice & Total <= Budget)
    Agent->>Agent: Construct Atomic 2-Txn Group (Fee Payer + USDC ASA Transfer)
    Agent->>Agent: Sign Txn 1 via Pera Wallet / Keypair
    Agent->>Agent: Encode PAYMENT-SIGNATURE Header

    Agent->>Gateway: POST /api/summarize (Identical payload + PAYMENT-SIGNATURE Header)
    Gateway->>Facilitator: POST https://facilitator.goplausible.xyz/verify
    Facilitator-->>Gateway: 200 OK (Payload & Signature Valid)

    Gateway->>Facilitator: POST https://facilitator.goplausible.xyz/settle
    Facilitator->>Blockchain: Co-sign Txn 0 (Fee Payer) & Submit Atomic Group
    Blockchain-->>Facilitator: Confirmed Round & txId
    Facilitator-->>Gateway: 200 OK (Settlement Confirmed + txId)

    Gateway->>LLM: Execute Mode Prompt (Summary / Action Items / Risks / Compliance / Checklist)
    LLM-->>Gateway: Generated Markdown Response
    Gateway->>Gateway: Compute SHA-256 Hash: SHA256(prevHash + timestamp + route + txId + ...)
    Gateway-->>Agent: HTTP 200 OK + Summary JSON + txId + PAYMENT-RESPONSE Header
```

---

### Backend Intake & AI Processing Pipeline

```mermaid
graph LR
    Req["📥 Incoming Request<br/>(JSON / Multipart)"] --> ContentType{"Content-Type?"}
    ContentType -->|multipart/form-data| FormParser["📄 PDF / File Parser"]
    ContentType -->|application/json| TextParser["📝 Raw Text Parser"]
    
    FormParser --> Metering["📊 Metering Engine<br/>Math.ceil(words / 500)"]
    TextParser --> Metering
    
    Metering --> PriceCalc["💰 Price Calculation<br/>pages × $0.01"]
    PriceCalc --> x402Check{"PAYMENT-SIGNATURE<br/>Header Present?"}
    
    x402Check -->|No| Emit402["⛔ Return HTTP 402<br/>PAYMENT-REQUIRED Header"]
    x402Check -->|Yes| VerifySettle["⚡ GoPlausible /verify & /settle"]
    
    VerifySettle --> PromptEngine{"Selected Mode?"}
    PromptEngine -->|summary| P1["Overview & Points"]
    PromptEngine -->|action_items| P2["Tasks & Owners"]
    PromptEngine -->|key_risks| P3["Risks & Severities"]
    PromptEngine -->|compliance_check| P4["Contract Audit"]
    PromptEngine -->|checklist| P5["Step Checkboxes"]
    
    P1 --> GroqInference["🧠 Groq LLM Inference"]
    P2 --> GroqInference
    P3 --> GroqInference
    P4 --> GroqInference
    P5 --> GroqInference
    
    GroqInference --> AuditAppend["🔒 Cryptographic SHA-256 Audit Append"]
    AuditAppend --> Res200["✅ Return HTTP 200 OK<br/>Result + txId + PAYMENT-RESPONSE"]
```

---

### GoPlausible Facilitator Interaction Loop

```mermaid
sequenceDiagram
    autonumber
    participant Server as 🌐 PagePay Gateway
    participant Facilitator as ⚡ GoPlausible Facilitator
    participant Node as ⛓️ Algod Testnet Node

    Server->>Facilitator: POST /verify<br/>Body: { x402Version, paymentPayload, paymentRequirements }
    Facilitator->>Facilitator: Validate AVM Group structure & signature proof
    Facilitator-->>Server: 200 OK { isValid: true, payer: "EVEHMX..." }

    Server->>Facilitator: POST /settle<br/>Body: { x402Version, paymentPayload, paymentRequirements }
    Facilitator->>Facilitator: Sign Txn 0 (Fee Payer Address: ZMFK2O...)
    Facilitator->>Node: Send Raw Signed Transaction Group (sendRawTransaction)
    Node-->>Facilitator: Transaction Confirmed in Round #XXXXX
    Facilitator-->>Server: 200 OK { success: true, transaction: "VPZ5GY2C...", payer: "EVEHMX..." }
```

---

### Cryptographic SHA-256 Audit Chain Architecture

```mermaid
graph LR
    subgraph Genesis ["Genesis Block"]
        G["Genesis Hash<br/><code>0000000000000000...</code>"]
    end

    subgraph Entry1 ["Audit Entry #1"]
        E1["Timestamp: 2026-08-22T09:39:00Z<br/>Route: POST /api/summarize<br/>TxID: SYPV4SIC...<br/><b>Hash:</b> <code>36f22782e986...</code>"]
    end

    subgraph Entry2 ["Audit Entry #2"]
        E2["Timestamp: 2026-08-22T14:02:00Z<br/>Route: POST /api/compare<br/>TxID: 27J5GFWM...<br/><b>Hash:</b> <code>b3f9d3fe1e44...</code>"]
    end

    subgraph Entry3 ["Audit Entry #3"]
        E3["Timestamp: 2026-08-22T21:45:00Z<br/>Route: POST /api/summarize<br/>TxID: VPZ5GY2C...<br/><b>Hash:</b> <code>43ebf6ca3108...</code>"]
    end

    G -->|SHA-256 Link| E1
    E1 -->|SHA-256 Link| E2
    E2 -->|SHA-256 Link| E3
```

---

## 🔑 3. HTTP 402 v2 Protocol Specification

### Protocol Header Semantics

PagePay strictly adheres to the **x402 Version 2 Protocol Specification**:

- **`PAYMENT-REQUIRED`** *(Response on HTTP 402)*: Base64-encoded JSON payload detailing available payment requirements.
- **`PAYMENT-SIGNATURE`** *(Request on Retry)*: Base64-encoded JSON payload carrying client-signed transaction group.
- **`PAYMENT-RESPONSE`** *(Response on HTTP 200)*: Base64-encoded JSON payload carrying on-chain settlement confirmation metadata.

---

### Exact-AVM Scheme Specification

- **Scheme Identifier**: `exact`
- **Network Identifier (CAIP-2)**: `algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=`
- **Asset ID**: `10458941` (Circle Testnet USDC)
- **Metering Formula**:
  $$\text{AtomicAmount} = \text{ParsedPages} \times 10,000 \quad (1 \text{ page} = \$0.01 \text{ USD})$$

---

### Complete JSON Payload Schemas

#### 1. Decoded `PAYMENT-REQUIRED` Header JSON
```json
{
  "x402Version": 2,
  "accepts": [
    {
      "scheme": "exact",
      "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
      "amount": "10000",
      "asset": "10458941",
      "payTo": "UPRVZO4TROKAOI2KBRWKVKQUWXNV4DQ4NDL5PEARA4IVZ73DDROT2ATSV4",
      "maxTimeoutSeconds": 120,
      "extra": {
        "name": "USDC",
        "decimals": 6,
        "feePayer": "ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA"
      }
    }
  ],
  "error": "Payment required"
}
```

#### 2. Decoded `PAYMENT-SIGNATURE` Header JSON
```json
{
  "version": 2,
  "scheme": "exact",
  "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
  "payload": {
    "sender": "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
    "stxns": [
      "gqNzaWf... (Fee-payer placeholder transaction)",
      "gqNzaWf... (USDC ASA transfer transaction signed by user/agent)"
    ]
  }
}
```

#### 3. Decoded `PAYMENT-RESPONSE` Header JSON
```json
{
  "success": true,
  "transaction": "VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q",
  "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
  "payer": "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE"
}
```

---

### HTTP Error & Failure Modes Matrix

| HTTP Status | Failure Code | Cause | Recovery Action |
| --- | --- | --- | --- |
| **402** | `payment_required` | Unpaid initial request | Decode `PAYMENT-REQUIRED`, sign, and retry |
| **402** | `cancelled` | User rejected signing prompt in Pera Wallet | Re-trigger payment prompt |
| **402** | `insufficient_funds` | Wallet lacks testnet USDC (ASA 10458941) | Fund wallet via Circle Testnet Faucet |
| **402** | `signing_failed` | ARC-0001 group signing error | Check Pera browser tab / mobile app |
| **402** | `verification_failed` | Signature / parameter mismatch | Re-quote and re-sign transaction |
| **402** | `quote_mismatch` | Document body edited between quote & payment | Re-request `/api/price` quote |
| **504** | `gateway_unavailable` | GoPlausible facilitator timeout | Retry request after short delay (`retryable: true`) |
| **400** | `bad_request` | Empty text or unreadable PDF file | Provide valid text or unencrypted PDF |

---

## ⛓️ 4. Algorand Blockchain & GoPlausible Facilitator Deep Dive

### Algorand Testnet Specifications & ASA 10458941

- **Network Name**: Algorand Testnet
- **Chain ID**: `416002`
- **Genesis Hash**: `SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=`
- **Block Time**: ~3.3 seconds with instant finality (zero forks)
- **Settlement Token**: Circle Testnet USDC (ASA ID `10458941`)
- **Token Decimals**: 6 decimals

---

### USDC Micro-Unit Conversion Math

$$\text{USDC Amount (USD)} = \frac{\text{Atomic Micro-Units}}{1,000,000}$$

- $10,000 \text{ micro-units} = \$0.01 \text{ USD}$ (1 page summary)
- $20,000 \text{ micro-units} = \$0.02 \text{ USD}$ (2 pages or dual-doc comparison)
- $100,000 \text{ micro-units} = \$0.10 \text{ USD}$ (10 page document max)

---

### GoPlausible Hosted Facilitator Integration

PagePay delegates fee sponsorship and network submission to **GoPlausible**:
- **Host URL**: `https://facilitator.goplausible.xyz`
- **Endpoints**:
  - `POST /verify`: Performs signature pre-flight verification without submitting to the chain.
  - `POST /settle`: Co-signs Slot 0 as the fee-payer and submits the atomic transaction group to the Algorand Testnet.

---

### Atomic 2-Transaction Group Breakdown

| Group Index | Transaction Type | Sender Address | Receiver Address | Amount | Signer |
| --- | --- | --- | --- | --- | --- |
| **Slot 0** | Payment / App Call (`pay`/`appl`) | GoPlausible Facilitator (`ZMFK2O...`) | Facilitator Address | 0 ALGO (Fee sponsor) | **GoPlausible Facilitator** |
| **Slot 1** | Asset Transfer (`axfer`) | Client Wallet Address (`EVEHMX...`) | Merchant `payTo` (`UPRVZO...`) | Exact Quoted USDC Micro-Units | **Client Wallet / Agent** |

---

## 🔒 5. Cryptographic SHA-256 Tamper-Evident Audit Trail

PagePay logs every request into an append-only cryptographic hash chain:

$$\text{EntryHash}_n = \text{SHA256}(\text{EntryHash}_{n-1} + \text{timestamp} + \text{route} + \text{pages} + \text{price} + \text{paymentStatus} + \text{outcome} + \text{payer} + \text{txId})$$

- **Genesis Hash**: `0000000000000000000000000000000000000000000000000000000000000000`
- **Verification (`GET /api/audit/verify`)**: Re-computes every hash from genesis. If any historical log entry is modified or deleted, verification returns `valid: false` and flags the exact entry index.

---

## 🕹️ 6. Pin-to-Pin UI & Feature Catalog

### Global Navigation & Header Bar

- **Logo & App Title (`PagePay`)**: Resets to marketing overview.
- **Nav Links**: `Product`, `Pricing`, `Docs`, `Metrics`, `Protocol demo`, `Live demo`.
- **Network Badge**: Displays `TESTNET` status.
- **Wallet Connection Display**: Shows `Connect wallet` button when disconnected; shows truncated address (e.g. `UPRV...TSV4`) and `Disconnect` button when connected.

---

### Landing Page & Hero Section (`/`)

- **Hero Badges**: `Machine-to-Machine Payments`, `HTTP 402 Exact Scheme`, `Algorand Testnet (ASA 10458941)`, `$0.01 / Page`.
- **CTA Buttons**: `Launch Live Demo`, `Explore Documentation`, `Protocol Demo`.
- **How It Works Step Cards**: 4 cards explaining quote generation, agent policy guards, on-chain settlement, and audit chain verification.
- **Pricing Cards**: 3 tier cards for Autonomous Agent, Multi-Doc Compare, and Developer API.

---

### Live Demo: Single Document Summarization (`/demo`)

- **Card 1 · Document Input**:
  - Drag-and-drop file dropzone supporting `.pdf`, `.txt`, `.md` up to 10 MB and 10 pages maximum. Includes `Remove file` button.
  - Raw text paste area (500 words = 1 page).
  - Live page & price estimator (e.g. `≈ 2 pages · $0.02`).
- **Card 2 · Extraction Mode & Payment**:
  - **5 Extraction Mode Buttons**:
    1. `Summary`: Standard overview & key points.
    2. `Action Items`: Tasks, owners, assignees & deadlines.
    3. `Key Risks`: Concerning clauses & severities.
    4. `Compliance Check`: Contract compliance against 5 standard categories.
    5. `Checklist`: Flat step-by-step implementation checkboxes (`- [ ]`).
  - **Page Range Selector (`RangeDemo`)**: Dropdown selecting page sub-ranges (e.g. Pages 2–5).
  - **Action Buttons**:
    - `Get Price Quote`: Calls `/api/price`.
    - `Pay & Execute`: Launches Pera Wallet signing popup.
    - `🤖 Run as Agent`: Executes autonomous agent mode under Agent Spend Policy Guard rules.

---

### Live Demo: Dual Document Comparison (`CompareDemo`)

- **Document A Input Card**: File upload or text area for Document A.
- **Document B Input Card**: File upload or text area for Document B.
- **Combined Metering Summary**: Displays Pages in A, Pages in B, Combined Pages, and Combined Price (e.g., 1 + 1 = 2 pages = `$0.02`).
- **`Pay & Compare Both Documents` Button**: Executes dual-document x402 payment flow.
- **Comparative Output Container**: Renders structured side-by-side analysis:
  1. Overview of Comparison
  2. Unique to Document A
  3. Unique to Document B
  4. Markdown Table of Differences
  5. Comparative Conclusion

---

### Agent Spend Policy Guard Component

- **Max Per Request Input**: Dollar input capping single request cost (default: `$0.10`).
- **Session Budget Input**: Dollar input capping cumulative session expenditure (default: `$1.00`).
- **Spent / Remaining Tracker**: Real-time spending monitor (`$Spent / $Remaining`).
- **Configure Policy Rules**: Expandable drawer to edit rules.

---

### Audit Trail, Receipt Verification & Trust Score Widgets

1. **Tamper-Evident Audit Trail Widget**:
   - `Re-verify chain` Button: Calls `GET /api/audit/verify`.
   - Status Badge: Displays `✅ VERIFIED INTEGRITY` or `❌ CHAIN BROKEN`.
   - Details: Displays total verified entries and genesis hash proof.
2. **Independent Receipt Verification Service Widget**:
   - `TxID Input Field`: Accepts any Algorand transaction hash.
   - `Verify Receipt` Button: Calls `GET /api/receipt?txId=<TxID>`.
   - Result Card: Displays route paid, price paid, payer address, audit chain entry hash, and on-chain status badge. Auto-populates post-settlement.
3. **Agent Trust Score Lookup Widget**:
   - `Address Input Field`: Accepts any Algorand address.
   - `Check Score` Button: Calls `GET /api/trust-score?address=<Address>`.
   - Rating Display: Renders **0–100 reliability score**, settled transaction count, USD volume, success rate, and activity timestamps.

---

### Protocol Sandbox & Simulation Engine (`/x402-demo`)

- **Test Mode Toggle**: Enables client-side simulation without Pera Wallet or testnet funds.
- **Simulation Mode Buttons**: `Happy path`, `Failed payment`, `Payment timeout`, `Invalid token`.
- **Raw HTTP Exchange Viewer**: Renders real-time HTTP headers, 402 payloads, signature objects, and response headers.

---

### Documentation Pages (`/docs`, `/developers`, `/integrations`)

- Full developer documentation covering x402 headers, Algorand AVM settlement, Groq AI configuration, and API reference.

---

## 🔌 7. Exhaustive API Reference (All Endpoints)

### 1. `POST /api/price`
Quote document page count and USD cost without triggering payment.

```bash
curl -X POST http://localhost:8080/api/price \
  -H "Content-Type: application/json" \
  -d '{"text": "Sample document content to quote..."}'
```

```json
{
  "pages": 1,
  "price": "$0.01",
  "amount": "10000",
  "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
  "facilitator": "https://facilitator.goplausible.xyz",
  "asset": "10458941",
  "payTo": "UPRVZO4TROKAOI2KBRWKVKQUWXNV4DQ4NDL5PEARA4IVZ73DDROT2ATSV4"
}
```

---

### 2. `POST /api/summarize`
Gated document processing endpoint accepting 5 extraction modes.

```bash
curl -X POST http://localhost:8080/api/summarize \
  -H "Content-Type: application/json" \
  -H "payment-signature: <base64-signed-payload>" \
  -d '{"text": "Contract text...", "mode": "compliance_check"}'
```

```json
{
  "summary": "## Compliance Check\n\n- **Parties & Roles**: ✅ Present\n- **Dates & Deadlines**: ✅ Present",
  "mode": "compliance_check",
  "pages": 1,
  "pricePaid": "$0.01",
  "amountPaid": "10000 (asset 10458941)",
  "txId": "VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q",
  "explorer": "https://lora.algokit.io/testnet/transaction/VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q",
  "payer": "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE"
}
```

---

### 3. `POST /api/summarize/range`
Page range selection AI processing endpoint.

```bash
curl -X POST http://localhost:8080/api/summarize/range \
  -H "Content-Type: application/json" \
  -H "payment-signature: <base64-signed-payload>" \
  -d '{"text": "Full text...", "startPage": 2, "endPage": 4, "mode": "action_items"}'
```

---

### 4. `POST /api/compare`
Dual-document side-by-side comparison endpoint.

```bash
curl -X POST http://localhost:8080/api/compare \
  -H "Content-Type: application/json" \
  -H "payment-signature: <base64-signed-payload>" \
  -d '{"textA": "Document A text...", "textB": "Document B text..."}'
```

---

### 5. `GET /api/receipt`
Public receipt verification service by Algorand transaction ID.

```bash
curl http://localhost:8080/api/receipt?txId=VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q
```

```json
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
```

---

### 6. `GET /api/trust-score`
Public address reliability score aggregation endpoint.

```bash
curl http://localhost:8080/api/trust-score?address=EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE
```

```json
{
  "address": "EVEHMXV4HH26HN64SBALS5X5WP2ORM4X6HAJXW7DPH6DOHOP2VVAAAPYPE",
  "trustScore": 100,
  "totalTransactions": 10,
  "totalVolumeUsd": "$0.11",
  "successRate": 100,
  "firstSeen": "2026-08-22T09:39:00.000Z",
  "lastSeen": "2026-08-22T14:02:00.000Z"
}
```

---

### 7. `GET /api/audit/verify`
Tamper-evident audit chain integrity verification.

```bash
curl http://localhost:8080/api/audit/verify
```

---

### 8. `GET /api/tools`
Machine-readable tool discovery metadata for AI Agents.

```bash
curl http://localhost:8080/api/tools
```

---

## 🌱 8. Startup Transaction Seed & Verifiable History

PagePay automatically seeds in-memory logs on server boot with **real, independently verifiable Algorand Testnet transactions**:

- `SYPV4SICW6QQC5TAOTEKB4F32FKXL5MAUOKUDTTZ3H76SGKVQNJA` ($0.01 settled) — [Lora Explorer](https://lora.algokit.io/testnet/transaction/SYPV4SICW6QQC5TAOTEKB4F32FKXL5MAUOKUDTTZ3H76SGKVQNJA)
- `WD4FH3EUMLDU7BXZRRB3K7N7KQUQRN3RBKYRMVJ5J44ROTFVRBKQ` ($0.01 settled) — [Lora Explorer](https://lora.algokit.io/testnet/transaction/WD4FH3EUMLDU7BXZRRB3K7N7KQUQRN3RBKYRMVJ5J44ROTFVRBKQ)
- `NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA` ($0.02 settled) — [Lora Explorer](https://lora.algokit.io/testnet/transaction/NVGTVZU36W5YORNYMVCFUKKPTEPIUS4ZGNBC6ZMR3QPYDEYXECJA)
- `27J5GFWM32ZD2TBJ5KIVLXZE34BZMPRJA757G542LVX4UXRFNI4A` ($0.01 settled) — [Lora Explorer](https://lora.algokit.io/testnet/transaction/27J5GFWM32ZD2TBJ5KIVLXZE34BZMPRJA757G542LVX4UXRFNI4A)
- `VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q` ($0.01 settled) — [Lora Explorer](https://lora.algokit.io/testnet/transaction/VPZ5GY2CF66MTSQZX3WBMAXEEOMV5SGZGCDNNK76ZK6XVKXUUU6Q)

---

## 💻 9. Installation, Environment & Local Setup

### Prerequisites
- Node.js v18.0.0+
- Google Chrome or Microsoft Edge (for Pera Web wallet integration)
- Pera Wallet set to **Testnet** (Chain ID `416002`)
- Testnet ALGO ([Algorand Dispenser](https://bank.testnet.algorand.network/)) & Testnet USDC ([Circle Faucet](https://faucet.circle.com))

### Environment Configuration (`.env`)

```ini
RESOURCE_PAY_TO=UPRVZO4TROKAOI2KBRWKVKQUWXNV4DQ4NDL5PEARA4IVZ73DDROT2ATSV4
GROQ_API_KEY=gsk_...
TEST_PAYER_MNEMONIC="<your funded testnet 24-word mnemonic here>"
```

### Development & Build Commands

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Verify production build
npm run build
```

---

<div align="center">
  <b>PagePay — Autonomous Machine-to-Machine Pay-Per-Page AI Processing</b><br />
  Built on HTTP 402 · Settled on Algorand Testnet · Verified by GoPlausible
</div>
