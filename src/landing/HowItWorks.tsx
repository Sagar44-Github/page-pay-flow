import { Link } from "@tanstack/react-router";

const STEPS = [
  {
    n: "01",
    title: "Machine-Readable 402 Quote",
    body: "Agents submit a document to /api/summarize or /api/compare. Server responds with HTTP 402 Payment Required containing atomic page quotes in standard X-PAYMENT headers.",
  },
  {
    n: "02",
    title: "Agent Spend Policy Enforcement",
    body: "Client-side spend policy evaluates price caps ($/request) and session budgets ($/session) BEFORE any transaction is constructed or signed.",
  },
  {
    n: "03",
    title: "Instant Algorand USDC Settlement",
    body: "Pera Wallet or agent signer approves an exact-AVM USDC ASA 10458941 transaction group. Verified on-chain via GoPlausible facilitator.",
  },
  {
    n: "04",
    title: "AI Output & SHA-256 Audit Chain",
    body: "Server returns AI extraction (Summary, Action Items, Key Risks, Compliance Check, Checklist) and automatically appends a cryptographic SHA-256 tamper-evident log entry.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border py-20 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-primary">MACHINE-TO-MACHINE FLOW</span>
          <h2 className="mt-2 text-2xl font-bold font-mono tracking-tight sm:text-3xl text-foreground">
            How Autonomous PagePay Works
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-muted-foreground font-mono">
            Standards-based HTTP 402 machine payments, real-time Algorand USDC settlement, and tamper-evident cryptographic verification.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 font-mono"
            >
              <span className="text-sm font-bold text-primary">{step.n}</span>
              <h3 className="text-base font-semibold mt-2 text-foreground">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center font-mono text-xs text-muted-foreground">
          Deep dive in{" "}
          <Link to="/docs" className="text-primary hover:underline">
            developer documentation
          </Link>{" "}
          and{" "}
          <a href="https://lora.algokit.io/testnet" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Algorand Testnet Explorer
          </a>
          .
        </div>
      </div>
    </section>
  );
}
