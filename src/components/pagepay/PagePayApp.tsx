import { Link } from "@tanstack/react-router";
import { NetworkId, WalletId, WalletManager, WalletProvider } from "@txnlab/use-wallet-react";
import { useMemo, useState } from "react";

import { LogsTab } from "@/components/pagepay/LogsTab";
import { SummarizeTab } from "@/components/pagepay/SummarizeTab";
import { WalletButton } from "@/components/pagepay/WalletButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRICE_PER_PAGE_USD } from "@/lib/pagepay/pricing";

/** Client-only root: real wallet integration, Algorand Testnet only. */
export default function PagePayApp() {
  const manager = useMemo(
    () =>
      new WalletManager({
        wallets: [WalletId.PERA, WalletId.DEFLY],
        defaultNetwork: NetworkId.TESTNET,
      }),
    [],
  );
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <WalletProvider manager={manager}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                PagePay
                <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                  x402 · algorand testnet
                </span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Pay-per-page AI document summarization. ${PRICE_PER_PAGE_USD.toFixed(2)} per page,
                settled on-chain per request — no accounts, no subscriptions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/x402-demo"
                className="rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                x402 protocol demo →
              </Link>
              <WalletButton />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          <Tabs defaultValue="summarize">
            <TabsList>
              <TabsTrigger value="summarize">Summarize</TabsTrigger>
              <TabsTrigger value="logs">Dashboard</TabsTrigger>
            </TabsList>
            <TabsContent value="summarize" className="mt-6">
              <SummarizeTab onActivity={() => setRefreshToken((token) => token + 1)} />
            </TabsContent>
            <TabsContent value="logs" className="mt-6">
              <LogsTab refreshToken={refreshToken} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-5 font-mono text-[11px] text-muted-foreground">
            protocol: x402 · scheme: exact · network: algorand testnet · facilitator:
            facilitator.goplausible.xyz · testnet funds only
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
