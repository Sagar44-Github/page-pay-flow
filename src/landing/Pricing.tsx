import { MAX_PAGES, PRICE_PER_PAGE_USD } from "@/lib/pagepay/pricing";

export function Pricing() {
  return (
    <section id="pricing" className="pp-section pp-dark-3" aria-labelledby="pp-pricing-title">
      <div className="pp-inner">
        <h2 id="pp-pricing-title" className="pp-display-lg">
          One cent a page. That is the whole price list.
        </h2>
        <p className="pp-lead pp-muted" style={{ marginTop: 24, maxWidth: 720 }}>
          You pay for the pages you send, at the moment you send them. Nothing renews.
        </p>
        <div className="pp-price-row">
          <div>
            <p className="pp-price-figure">${PRICE_PER_PAGE_USD.toFixed(2)}</p>
            <p className="pp-body pp-muted" style={{ marginTop: 12 }}>
              per page, quoted per request in the 402 response
            </p>
          </div>
          <div>
            <p className="pp-price-figure">{MAX_PAGES}</p>
            <p className="pp-body pp-muted" style={{ marginTop: 12 }}>
              pages maximum per document, so a full run costs $
              {(MAX_PAGES * PRICE_PER_PAGE_USD).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="pp-price-figure">$0</p>
            <p className="pp-body pp-muted" style={{ marginTop: 12 }}>
              subscription, minimum, or account. Idle costs nothing because there is no plan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
