import { useWallet } from "@txnlab/use-wallet-react";

import { Button } from "@/components/ui/button";

function shorten(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

/** Pera / Defly connect button — real wallet, Algorand Testnet. */
export function WalletButton() {
  const { wallets, activeAddress, activeWallet } = useWallet();

  if (activeAddress && activeWallet) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-card-foreground">
          {shorten(activeAddress)}
        </span>
        <Button variant="outline" size="sm" onClick={() => void activeWallet.disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {wallets.map((wallet) => (
        <Button key={wallet.id} size="sm" onClick={() => void wallet.connect()}>
          Connect {wallet.metadata.name}
        </Button>
      ))}
    </div>
  );
}
