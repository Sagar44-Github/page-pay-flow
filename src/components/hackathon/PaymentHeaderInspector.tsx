import { Badge } from "@/components/ui/badge";

function decodeHeader(value: string | undefined) {
  if (!value) return null;
  try {
    const json = atob(value);
    return JSON.parse(json) as unknown;
  } catch {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return value;
    }
  }
}

function HeaderPanel({
  title,
  raw,
  decoded,
}: {
  title: string;
  raw?: string;
  decoded: unknown;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {raw ? (
          <Badge variant="outline" className="font-mono text-[10px]">
            {raw.length} chars
          </Badge>
        ) : null}
      </div>
      {!raw ? (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">— not captured —</p>
      ) : (
        <>
          <pre className="mt-2 max-h-32 overflow-auto font-mono text-[10px] leading-relaxed text-muted-foreground">
            {raw}
          </pre>
          <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-secondary p-2 font-mono text-[10px] leading-relaxed text-foreground">
            {JSON.stringify(decoded, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

/** Side-by-side decode of x402 payment headers. */
export function PaymentHeaderInspector({
  paymentRequired,
  paymentSignature,
  paymentResponse,
}: {
  paymentRequired?: string;
  paymentSignature?: string;
  paymentResponse?: string;
}) {
  const hasAny = paymentRequired || paymentSignature || paymentResponse;
  if (!hasAny) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">
        Run a payment flow to inspect PAYMENT-REQUIRED, PAYMENT-SIGNATURE, and PAYMENT-RESPONSE
        headers.
      </p>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <HeaderPanel
        title="PAYMENT-REQUIRED"
        raw={paymentRequired}
        decoded={decodeHeader(paymentRequired)}
      />
      <HeaderPanel
        title="PAYMENT-SIGNATURE"
        raw={paymentSignature}
        decoded={decodeHeader(paymentSignature)}
      />
      <HeaderPanel
        title="PAYMENT-RESPONSE"
        raw={paymentResponse}
        decoded={decodeHeader(paymentResponse)}
      />
    </div>
  );
}

/** Extract payment headers from a raw HTTP headers record (case-insensitive). */
export function pickPaymentHeaders(headers: Record<string, string>) {
  const lower = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return {
    paymentRequired: lower["payment-required"],
    paymentSignature: lower["payment-signature"],
    paymentResponse: lower["payment-response"],
    xPayment: lower["x-payment"],
    xPaymentResponse: lower["x-payment-response"],
  };
}
