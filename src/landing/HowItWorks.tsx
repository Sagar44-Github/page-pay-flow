const STEPS = [
  {
    step: "01",
    title: "Request the resource",
    body: "POST your document to /api/summarize with no payment attached.",
  },
  {
    step: "02",
    title: "402 Payment Required",
    body: "The x402 resource server replies with the exact price, asset, network and payTo address.",
  },
  {
    step: "03",
    title: "Sign in Pera Wallet",
    body: "The client builds the exact-scheme payment and Pera signs it on Algorand Testnet.",
  },
  {
    step: "04",
    title: "Retry and unlock",
    body: "The retried request carries X-PAYMENT; the facilitator settles and the summary returns.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          How the exchange works
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div key={item.step} className="rounded-xl border border-border bg-card p-5">
              <p className="font-mono text-[11px] text-primary">{item.step}</p>
              <p className="mt-2 text-sm font-medium text-card-foreground">{item.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
