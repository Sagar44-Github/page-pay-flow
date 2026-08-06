import { truncateAddress, type PeraWallet } from "@/lib/wallet/pera";

export function Nav({ wallet }: { wallet: PeraWallet }) {
  return (
    <>
      <nav className="pp-nav">
        <div className="pp-nav-inner">
          <a className="pp-logo" href="#top">
            <span className="pp-logo-mark" aria-hidden="true" />
            PagePay
          </a>
          <div className="pp-nav-right">
            <a className="pp-nav-link" href="/x402-demo">
              Protocol demo
            </a>
            {wallet.address ? (
              <>
                <span className="pp-nav-addr">{truncateAddress(wallet.address)}</span>
                <button
                  type="button"
                  className="pp-btn pp-btn-ghost pp-btn-sm"
                  onClick={() => void wallet.disconnect()}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                className="pp-btn pp-btn-sm"
                disabled={wallet.connecting}
                onClick={() => void wallet.connect()}
              >
                {wallet.connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </nav>
      {wallet.error && (
        <p className="pp-nav-note pp-caption" role="alert">
          {wallet.error}
        </p>
      )}
    </>
  );
}
