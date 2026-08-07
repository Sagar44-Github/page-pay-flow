const FACTS = [
  { label: "Price", value: "$0.01", detail: "per page, quoted per request" },
  { label: "Network", value: "Algorand Testnet", detail: "algorand:testnet-v1.0" },
  { label: "Asset", value: "USDC (ASA 10458941)", detail: "exact scheme, 6 decimals" },
  { label: "Settlement", value: "GoPlausible facilitator", detail: "verify + settle, ~3s" },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pricing &amp; settlement
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} className="rounded-xl border border-border bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {fact.label}
              </p>
              <p className="mt-2 text-base font-medium text-card-foreground">{fact.value}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{fact.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
