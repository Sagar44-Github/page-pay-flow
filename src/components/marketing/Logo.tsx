import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-9 rounded-xl ring-1 ring-border", className)}
      aria-hidden
    >
      <rect width="512" height="512" rx="112" className="fill-card" />
      <rect
        x="48"
        y="48"
        width="416"
        height="416"
        rx="88"
        className="fill-none stroke-border"
        strokeWidth="8"
      />
      <text
        x="256"
        y="300"
        textAnchor="middle"
        className="fill-foreground"
        style={{ fontFamily: "Instrument Serif, Georgia, serif", fontSize: 168, fontWeight: 400 }}
      >
        PP
      </text>
      <circle cx="384" cy="148" r="22" className="fill-accent-green" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <LogoMark className="transition-transform group-hover:scale-105" />
      {!compact && (
        <div className="leading-tight">
          <span className="font-display text-lg tracking-tight text-foreground">PagePay</span>
          <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            x402 · algorand
          </span>
        </div>
      )}
    </Link>
  );
}

export { LogoMark };
