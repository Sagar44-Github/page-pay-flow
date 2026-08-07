import { truncateAddress, type PeraWallet } from "@/lib/wallet/pera";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Nav({ wallet }: { wallet: PeraWallet }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="h-6 w-6 rounded-md bg-primary/20 ring-1 ring-primary/40" aria-hidden />
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              PagePay
              <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
                x402 · algorand testnet
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/x402-demo"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            protocol demo →
          </a>
          {wallet.address ? (
            <>
              <Badge variant="outline" className="font-mono text-[11px]">
                {truncateAddress(wallet.address)}
              </Badge>
              <Button variant="secondary" size="sm" onClick={() => void wallet.disconnect()}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" disabled={wallet.connecting} onClick={() => void wallet.connect()}>
              {wallet.connecting ? "Connecting…" : "Connect Pera Wallet"}
            </Button>
          )}
        </div>
      </div>
      {wallet.error && (
        <p
          className="mx-auto max-w-7xl px-6 pb-3 text-xs text-destructive"
          role="alert"
        >
          {wallet.error}
        </p>
      )}
    </header>
  );
}
