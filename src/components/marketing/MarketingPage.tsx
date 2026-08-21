import { type ReactNode } from "react";

import { usePeraWallet } from "@/lib/wallet/pera";

import { MarketingLayout } from "./MarketingLayout";

/** Marketing page wrapper with wallet + layout. */
export function MarketingPage({
  children,
}: {
  children: (wallet: ReturnType<typeof usePeraWallet>) => ReactNode;
}) {
  const wallet = usePeraWallet();
  return <MarketingLayout wallet={wallet}>{children(wallet)}</MarketingLayout>;
}

/** Static marketing pages (docs, product shell) — same layout, no render-prop. */
export function MarketingPageStatic({ children }: { children: ReactNode }) {
  const wallet = usePeraWallet();
  return <MarketingLayout wallet={wallet}>{children}</MarketingLayout>;
}
