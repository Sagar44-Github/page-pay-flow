const STEPS = [
  {
    title: "Submit a document",
    body: "Drop in a PDF or paste raw text. PagePay counts real pages — a PDF page, or roughly 500 words of text.",
  },
  {
    title: "Get a price",
    body: "The server answers HTTP 402 Payment Required with signed payment requirements: one cent per page, priced for this exact request.",
  },
  {
    title: "Pay in one tap",
    body: "Pera Wallet signs the exact-amount payment on Algorand Testnet. The app never sees a key, and there is nothing to subscribe to.",
  },
  {
    title: "Receive the summary",
    body: "The request replays with the payment header, the facilitator settles it, and the summary returns with its settlement receipt.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pp-section pp-dark" aria-labelledby="pp-how-title">
      <div className="pp-inner">
        <h2 id="pp-how-title" className="pp-display-lg">
          Four steps. No account anywhere in them.
        </h2>
        <p className="pp-lead pp-muted" style={{ marginTop: 24, maxWidth: 720 }}>
          This is the real x402 exchange, not a diagram of one.
        </p>
        <ol className="pp-steps">
          {STEPS.map((step, index) => (
            <li className="pp-step" key={step.title}>
              <span className="pp-step-num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p className="pp-body pp-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
