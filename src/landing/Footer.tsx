export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-8">
        <p className="font-mono text-[11px] text-muted-foreground">
          PagePay · x402 on Algorand Testnet · testnet funds only, not for production value
        </p>
        <div className="flex gap-4 font-mono text-[11px] text-muted-foreground">
          <a className="transition-colors hover:text-foreground" href="/x402-demo">
            protocol demo
          </a>
          <a className="transition-colors hover:text-foreground" href="#how-it-works">
            how it works
          </a>
          <a className="transition-colors hover:text-foreground" href="#pricing">
            pricing
          </a>
        </div>
      </div>
    </footer>
  );
}
