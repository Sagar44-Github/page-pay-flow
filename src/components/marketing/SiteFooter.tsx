import { Link } from "@tanstack/react-router";

import { Container } from "./Container";
import { Logo } from "./Logo";

const FOOTER_LINKS = {
  Product: [
    { to: "/product", label: "Overview" },
    { to: "/demo", label: "Live demo" },
    { to: "/pricing", label: "Pricing" },
    { to: "/x402-demo", label: "Protocol sandbox" },
  ],
  Docs: [
    { to: "/docs", label: "Documentation" },
    { to: "/docs/x402", label: "x402 protocol" },
    { to: "/docs/algorand", label: "Algorand" },
    { to: "/developers", label: "API reference" },
  ],
  Integrate: [
    { to: "/integrations", label: "Integrations" },
    { to: "/developers", label: "HTTP 402 flow" },
    { to: "/docs/x402", label: "Payment headers" },
  ],
} as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Pay-per-page AI document summarization over HTTP 402, settled on Algorand Testnet.
              Built for developers who want metered APIs without accounts or subscriptions.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <p className="text-nav-label text-foreground">{title}</p>
                <ul className="mt-4 space-y-2">
                  {links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <p className="font-mono text-xs text-subtle">
            © {new Date().getFullYear()} PagePay · Testnet only · Not for production value
          </p>
          <div className="flex gap-4 font-mono text-xs text-muted-foreground">
            <a
              href="https://facilitator.goplausible.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-green"
            >
              Facilitator
            </a>
            <a
              href="https://web.perawallet.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-green"
            >
              Pera Web
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
