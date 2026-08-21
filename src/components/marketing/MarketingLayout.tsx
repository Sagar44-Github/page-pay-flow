import type { PeraWallet } from "@/lib/wallet/pera";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function MarketingLayout({
  wallet,
  children,
}: {
  wallet: PeraWallet;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader wallet={wallet} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
