import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { truncateAddress, type PeraWallet } from "@/lib/wallet/pera";

import { Container } from "./Container";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/product", label: "Product" },
  { to: "/pricing", label: "Pricing" },
  { to: "/docs", label: "Docs" },
  { to: "/stats", label: "Metrics" },
  { to: "/x402-demo", label: "Protocol demo" },
  { to: "/demo", label: "Live demo" },
] as const;

export function SiteHeader({ wallet }: { wallet: PeraWallet }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border glass-nav">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-nav-label rounded-full px-4 py-2 font-sans text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Badge variant="outline" className="hidden font-mono text-[10px] sm:inline-flex">
            testnet
          </Badge>
          {wallet.address ? (
            <>
              <Badge variant="secondary" className="font-mono text-[11px]">
                {truncateAddress(wallet.address)}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => void wallet.disconnect()}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              disabled={wallet.connecting}
              onClick={() => void wallet.connect()}
            >
              {wallet.connecting ? "Connecting…" : "Connect wallet"}
            </Button>
          )}
        </div>
      </Container>
      {wallet.error && (
        <Container className="pb-3">
          <p className="text-xs text-destructive" role="alert">
            {wallet.error}
          </p>
        </Container>
      )}
    </header>
  );
}
