import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Sparkles, Zap, Bot, Gavel, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { HttpExchangeView, type HttpExchange } from "@/components/x402demo/HttpExchangeView";
import { LogConsole, type LogEntry, type LogLevel } from "@/components/x402demo/LogConsole";
import {
  PaymentTimeline,
  type FlowStep,
  type StepState,
} from "@/components/x402demo/PaymentTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/marketing/Container";
import { MarkdownContent } from "@/components/marketing/MarkdownContent";
import { Reveal } from "@/components/marketing/Reveal";
import { CurlExportButton, buildCurl } from "@/components/hackathon/CurlExportButton";
import {
  PaymentHeaderInspector,
} from "@/components/hackathon/PaymentHeaderInspector";
import { useX402GuidedTour, resetX402GuidedTour } from "@/components/x402demo/X402GuidedTour";
import { cn } from "@/lib/utils";
import { demoPriceForModel, DEMO_MODEL_PRICING } from "@/lib/x402demo/pricing";
import {
  DEMO_MODES,
  DEMO_MODE_DESCRIPTIONS,
  DEMO_MODE_LABELS,
  encodePaymentHeader,
  mockSignature,
  randomNonce,
  type DemoMode,
  type DemoPaymentPayload,
  type DemoServerLogEntry,
} from "@/lib/x402demo/protocol";

const formSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(8, "Give the gated resource at least 8 characters of context.")
    .max(2000, "Keep the prompt under 2000 characters."),
  model: z.enum(["llama-3.1-8b-instant", "llama-3.3-70b-versatile"]),
});
type FormValues = z.infer<typeof formSchema>;

const STEP_DEFS = [
  { key: "request", label: "Unpaid request", hint: "POST /api/x402-demo — no X-Payment header" },
  { key: "challenge", label: "402 Payment Required", hint: "server returns payment requirements" },
  {
    key: "construct",
    label: "X-Payment constructed",
    hint: "exact scheme payload, base64-encoded",
  },
  {
    key: "authorize",
    label: "Payment authorized",
    hint: "payload verified by the resource server",
  },
  { key: "settle", label: "Settlement complete", hint: "facilitator confirms the transfer" },
  { key: "unlock", label: "Resource unlocked", hint: "Groq generates the gated content" },
] as const;

type StepKey = (typeof STEP_DEFS)[number]["key"];

interface UnlockedResult {
  content: string;
  model: string;
  latencyMs: number;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined;
  settlement: { success: boolean; network: string; transaction: string; payer: string };
  simulated: boolean;
}

const MOCK_PAY_TO = "PAGEPAYDEMOMERCHANTADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const MOCK_PAYER = "DEMOWALLETPAYERADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const NETWORK = "algorand:testnet-v1.0";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let uidCounter = 0;
const uid = (prefix: string) =>
  `${prefix}-${(uidCounter += 1)}-${Math.random().toString(36).slice(2, 8)}`;

export default function X402DemoApp() {
  const [mode, setMode] = useState<DemoMode>("happy");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [steps, setSteps] = useState<Record<StepKey, StepState>>({
    request: "idle",
    challenge: "idle",
    construct: "idle",
    authorize: "idle",
    settle: "idle",
    unlock: "idle",
  });
  const [exchanges, setExchanges] = useState<HttpExchange[]>([]);
  const [result, setResult] = useState<UnlockedResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [running, setRunning] = useState<null | "live" | "simulated" | "agent">(null);
  const [judgeMode, setJudgeMode] = useState(true);
  const [lastCurl, setLastCurl] = useState<string | null>(null);
  const [headerSnapshot, setHeaderSnapshot] = useState<{
    paymentRequired?: string;
    paymentSignature?: string;
    paymentResponse?: string;
  }>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt:
        "Brief a technical audience on why HTTP 402 machine payments unlock new agent business models.",
      model: "llama-3.1-8b-instant",
    },
  });

  const selectedModel = form.watch("model");
  const modelPricing = demoPriceForModel(selectedModel);

  const log = useCallback((level: LogLevel, source: string, message: string, detail?: string) => {
    const id = uid("log");
    setLogs((previous) => [
      ...previous,
      {
        id,
        timestamp: new Date().toISOString(),
        level,
        source,
        message,
        ...(detail ? { detail } : {}),
      },
    ]);
  }, []);

  useX402GuidedTour({
    enabled: running === null && !result,
    onSelectHappy: () => setMode("happy"),
    onRunTestMode: () => form.handleSubmit((values) => void runSimulation(values))(),
  });

  const setStep = useCallback((key: StepKey, state: StepState) => {
    setSteps((previous) => ({ ...previous, [key]: state }));
  }, []);

  const resetRun = useCallback(() => {
    setSteps({
      request: "idle",
      challenge: "idle",
      construct: "idle",
      authorize: "idle",
      settle: "idle",
      unlock: "idle",
    });
    setExchanges([]);
    setResult(null);
    setFailure(null);
  }, []);

  const pushExchange = useCallback((exchange: Omit<HttpExchange, "id">) => {
    const id = uid("ex");
    setExchanges((previous) => [...previous, { ...exchange, id }]);
  }, []);

  const drainServerLog = useCallback(
    (entries: DemoServerLogEntry[] | undefined) => {
      for (const entry of entries ?? []) log(entry.level, "server", entry.message, entry.detail);
    },
    [log],
  );

  function buildPayload(model: string): DemoPaymentPayload {
    const pricing = demoPriceForModel(model);
    const nonce = randomNonce();
    return {
      x402Version: 1,
      scheme: "exact",
      network: NETWORK,
      payload: {
        from: MOCK_PAYER,
        to: MOCK_PAY_TO,
        asset: "10458941",
        amount: pricing.amount,
        nonce,
        validUntil: Math.floor(Date.now() / 1000) + 60,
        signature: mockSignature(nonce),
      },
    };
  }

  async function runAsAgent(values: FormValues) {
    setMode("happy");
    log("info", "agent", "Agent autopay started — zero UI clicks");
    if (judgeMode) {
      await runSimulation(values);
      return;
    }
    await runLive(values);
  }

  /** Pure client-side simulation — no network, no payment, all states shown. */
  async function runSimulation(values: FormValues) {
    resetRun();
    setRunning("simulated");
    log("info", "test-mode", `Starting simulated x402 flow`, `mode=${mode}`);

    setStep("request", "active");
    await sleep(450);
    pushExchange({
      title: "Unpaid request → /api/x402-demo",
      direction: "request",
      method: "POST",
      url: "/api/x402-demo",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ prompt: values.prompt, mode, model: values.model }, null, 2),
    });
    log("info", "http", "POST /api/x402-demo (simulated, no X-Payment header)");
    setStep("request", "done");

    setStep("challenge", "active");
    await sleep(500);
    const pricing = demoPriceForModel(values.model);
    const requirements = {
      x402Version: 1,
      accepts: [
        {
          scheme: "exact",
          network: NETWORK,
          resource: "/api/x402-demo",
          payTo: MOCK_PAY_TO,
          asset: "10458941",
          amount: pricing.amount,
          amountFormatted: pricing.amountFormatted,
          maxTimeoutSeconds: 60,
          extra: { name: "USDC", decimals: 6, model: values.model, modelLabel: pricing.label },
        },
      ],
      error: "Payment required",
    };
    pushExchange({
      title: "402 Payment Required (simulated)",
      direction: "response",
      status: 402,
      statusText: "Payment Required",
      headers: {
        "content-type": "application/json",
        "x-payment-required": "true",
        "x-x402-version": "1",
        "www-authenticate": `x402 network="${NETWORK}", scheme="exact", amount="${pricing.amount}", asset="10458941"`,
      },
      body: JSON.stringify(requirements, null, 2),
    });
    setHeaderSnapshot({
      paymentRequired: btoa(JSON.stringify(requirements)),
    });
    log("warn", "x402", "402 Payment Required received", `${pricing.amountFormatted} · ${values.model}`);
    setStep("challenge", "done");

    setStep("construct", "active");
    await sleep(450);
    const payload = buildPayload(values.model);
    const header = encodePaymentHeader(payload);
    pushExchange({
      title: "Retry request with X-Payment header",
      direction: "request",
      method: "POST",
      url: "/api/x402-demo",
      headers: { "content-type": "application/json", "x-payment": header },
      body: JSON.stringify({ prompt: values.prompt, mode, model: values.model }, null, 2),
    });
    setHeaderSnapshot((prev) => ({ ...prev, paymentSignature: header }));
    setLastCurl(
      buildCurl("POST", `${window.location.origin}/api/x402-demo`, JSON.stringify({ prompt: values.prompt, mode, model: values.model }), {
        "content-type": "application/json",
        "x-payment": header,
      }),
    );
    log("info", "x402", "X-Payment header constructed", `${header.slice(0, 40)}…`);
    setStep("construct", "done");

    if (mode === "invalid") {
      setStep("authorize", "active");
      await sleep(600);
      setStep("authorize", "error");
      pushExchange({
        title: "400 Invalid payment token (simulated)",
        direction: "response",
        status: 400,
        statusText: "Bad Request",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          { error: "Invalid payment token", reason: "signature did not verify" },
          null,
          2,
        ),
      });
      log("error", "x402", "Payment token rejected", "signature did not verify");
      setFailure("Invalid payment token — the resource server rejected the X-Payment payload.");
      toast.error("Invalid payment token (simulated)");
      setRunning(null);
      return;
    }

    setStep("authorize", "active");
    await sleep(650);
    log("success", "x402", "Payment authorized", `payer=${MOCK_PAYER.slice(0, 10)}…`);
    setStep("authorize", "done");

    setStep("settle", "active");
    if (mode === "timeout") {
      await sleep(1600);
      setStep("settle", "error");
      pushExchange({
        title: "504 Gateway Timeout (simulated)",
        direction: "response",
        status: 504,
        statusText: "Gateway Timeout",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          { error: "Gateway timeout", reason: "settlement window expired" },
          null,
          2,
        ),
      });
      log("error", "facilitator", "Settlement timed out", "maxTimeoutSeconds exceeded");
      setFailure("Payment timed out before settlement — nothing was charged, retry is safe.");
      toast.error("Payment timed out (simulated)");
      setRunning(null);
      return;
    }
    if (mode === "failed") {
      await sleep(900);
      setStep("settle", "error");
      pushExchange({
        title: "402 Payment failed (simulated)",
        direction: "response",
        status: 402,
        statusText: "Payment Required",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Payment failed", reason: "insufficient_funds" }, null, 2),
      });
      log("error", "facilitator", "Settlement rejected", "insufficient_funds");
      setFailure("Settlement failed: insufficient_funds. Top up the wallet and retry.");
      toast.error("Payment failed (simulated)");
      setRunning(null);
      return;
    }

    await sleep(900);
    const transaction = `MOCKTX${payload.payload.nonce.slice(0, 20).toUpperCase()}`;
    log("success", "facilitator", "Settlement confirmed", `txid=${transaction}`);
    setStep("settle", "done");

    setStep("unlock", "active");
    await sleep(700);
    const simulatedContent = [
      "**Simulated gated resource** (Test Mode — no payment and no Groq call were made).",
      "",
      "- The resource server answered 402 with machine-readable payment requirements.",
      "- The client constructed a base64 `X-Payment` payload under the `exact` scheme.",
      "- Verification and settlement succeeded, and the paywalled response was released.",
      "",
      "Switch off Test Mode to run the same flow against `/api/x402-demo` with a live Groq completion.",
    ].join("\n");
    pushExchange({
      title: "200 OK — resource unlocked (simulated)",
      direction: "response",
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
        "x-payment-response": JSON.stringify({ success: true, network: NETWORK, transaction }),
      },
      body: JSON.stringify({ unlocked: true, content: "…", model: values.model }, null, 2),
    });
    setHeaderSnapshot((prev) => ({
      ...prev,
      paymentResponse: JSON.stringify({ success: true, network: NETWORK, transaction }),
    }));
    setResult({
      content: simulatedContent,
      model: values.model,
      latencyMs: 0,
      settlement: { success: true, network: NETWORK, transaction, payer: MOCK_PAYER },
      simulated: true,
    });
    log("success", "x402", "Resource unlocked", "simulated payload rendered");
    setStep("unlock", "done");
    toast.success("Simulated x402 flow complete");
    setRunning(null);
  }

  /** Real round-trip against /api/x402-demo (402 → X-Payment retry → Groq). */
  async function runLive(values: FormValues) {
    resetRun();
    setRunning("live");
    const body = JSON.stringify({ prompt: values.prompt, mode, model: values.model });
    log("info", "client", "Starting live x402 exchange", `mode=${mode} model=${values.model}`);

    try {
      setStep("request", "active");
      pushExchange({
        title: "Unpaid request → /api/x402-demo",
        direction: "request",
        method: "POST",
        url: "/api/x402-demo",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(JSON.parse(body), null, 2),
      });
      const first = await fetch("/api/x402-demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });
      const firstText = await first.text();
      const firstHeaders: Record<string, string> = {};
      first.headers.forEach((value, key) => {
        firstHeaders[key] = value;
      });
      pushExchange({
        title: "Server challenge",
        direction: "response",
        status: first.status,
        statusText: first.statusText,
        headers: firstHeaders,
        body: firstText,
      });
      setStep("request", "done");

      const firstJson = safeJson(firstText) as { serverLog?: DemoServerLogEntry[] };
      drainServerLog(firstJson?.serverLog);

      if (first.status !== 402) {
        setStep("challenge", "error");
        log("error", "x402", `Expected 402, received ${first.status}`);
        setFailure(`Expected HTTP 402, received ${first.status}.`);
        toast.error("Unexpected server response");
        setRunning(null);
        return;
      }
      setStep("challenge", "done");
      log("warn", "x402", "402 Payment Required received", `${modelPricing.amountFormatted} · ${values.model}`);

      setStep("construct", "active");
      const payload = buildPayload(values.model);
      const header =
        mode === "invalid" ? "not-a-valid-base64-payment-token" : encodePaymentHeader(payload);
      setHeaderSnapshot({
        paymentRequired: firstHeaders["x-payment-required"],
        paymentSignature: header,
      });
      setLastCurl(
        buildCurl("POST", `${window.location.origin}/api/x402-demo`, body, {
          "content-type": "application/json",
          "x-payment": header,
        }),
      );
      pushExchange({
        title: "Retry request with X-Payment header",
        direction: "request",
        method: "POST",
        url: "/api/x402-demo",
        headers: { "content-type": "application/json", "x-payment": header },
        body: JSON.stringify(payload, null, 2),
      });
      log("info", "x402", "X-Payment header attached", `${header.slice(0, 40)}…`);
      setStep("construct", "done");

      setStep("authorize", "active");
      const second = await fetch("/api/x402-demo", {
        method: "POST",
        headers: { "content-type": "application/json", "x-payment": header },
        body,
      });
      const secondText = await second.text();
      const secondHeaders: Record<string, string> = {};
      second.headers.forEach((value, key) => {
        secondHeaders[key] = value;
      });
      pushExchange({
        title: second.ok ? "200 OK — resource unlocked" : `${second.status} paywall response`,
        direction: "response",
        status: second.status,
        statusText: second.statusText,
        headers: secondHeaders,
        body: secondText,
      });
      const secondJson = safeJson(secondText) as {
        serverLog?: DemoServerLogEntry[];
        reason?: string;
        error?: string;
        content?: string;
        model?: string;
        latencyMs?: number;
        usage?: UnlockedResult["usage"];
        settlement?: UnlockedResult["settlement"];
      };
      drainServerLog(secondJson?.serverLog);

      if (!second.ok) {
        setStep("authorize", second.status === 400 ? "error" : "done");
        if (second.status !== 400) setStep("settle", "error");
        const reason = secondJson?.reason ?? `Request failed with ${second.status}`;
        setFailure(reason);
        log("error", "x402", secondJson?.error ?? "Request failed", reason);
        toast.error(secondJson?.error ?? "Payment flow failed");
        setRunning(null);
        return;
      }

      setStep("authorize", "done");
      setStep("settle", "done");
      setStep("unlock", "active");
      setHeaderSnapshot((prev) => ({
        ...prev,
        paymentResponse: secondHeaders["x-payment-response"],
      }));
      setResult({
        content: secondJson.content ?? "",
        model: secondJson.model ?? values.model,
        latencyMs: secondJson.latencyMs ?? 0,
        usage: secondJson.usage,
        settlement: secondJson.settlement ?? {
          success: true,
          network: NETWORK,
          transaction: "unknown",
          payer: MOCK_PAYER,
        },
        simulated: false,
      });
      setStep("unlock", "done");
      log("success", "groq", "Gated content rendered", `${secondJson.latencyMs ?? 0}ms`);
      toast.success("Resource unlocked");
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      log("error", "client", "Exchange threw", reason);
      setFailure(reason);
      toast.error("Exchange failed");
    } finally {
      setRunning(null);
    }
  }

  const timeline: FlowStep[] = useMemo(
    () => STEP_DEFS.map((definition) => ({ ...definition, state: steps[definition.key] })),
    [steps],
  );

  return (
    <div className="relative border-b border-border">
      <Container className="relative py-10 md:py-14">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-display-hero text-foreground">
                x402 Protocol Demo
                <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                  groq · llama 3.1 / 3.3
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Watch an HTTP 402 paywall negotiate a machine payment end to end: challenge, signed
                PAYMENT-SIGNATURE header, settlement, and the unlocked Groq-generated resource.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px]">
                scheme exact
              </Badge>
              <Badge variant="outline" className="font-mono text-[11px]">
                {NETWORK}
              </Badge>
              <Badge variant="outline" className="font-mono text-[11px]">
                {modelPricing.amountFormatted} / request
              </Badge>
            </div>
          </div>
        </Reveal>

        <main className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <section className="space-y-6">
            <Reveal delay={60}>
              <Card className="border-border/80 bg-card/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    1 · Simulation mode
                  </CardTitle>
                  <CardDescription>{DEMO_MODE_DESCRIPTIONS[mode]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_MODES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setMode(value)}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-300",
                          mode === value
                            ? "border-accent-green bg-accent-green/15 text-accent-green shadow-sm shadow-accent-green/10"
                            : "border-border bg-muted/40 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
                        )}
                      >
                        {DEMO_MODE_LABELS[value]}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={120}>
              <Card className="border-border/80 bg-card/95 shadow-sm">
                <form onSubmit={form.handleSubmit(runLive)}>
                  <CardHeader>
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      2 · Gated request
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="prompt" className="text-xs text-muted-foreground">
                        What should the paid resource generate?
                      </Label>
                      <Textarea
                        id="prompt"
                        {...form.register("prompt")}
                        className="mt-1 min-h-28 font-mono text-xs"
                      />
                      {form.formState.errors.prompt && (
                        <p className="mt-1 text-xs text-destructive">
                          {form.formState.errors.prompt.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="model" className="text-xs text-muted-foreground">
                        Groq model
                      </Label>
                      <select
                        id="model"
                        {...form.register("model")}
                        className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-xs text-foreground"
                      >
                        {Object.entries(DEMO_MODEL_PRICING).map(([id, p]) => (
                          <option key={id} value={id}>
                            {p.label} — {p.amountFormatted}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        Quote includes model in <code className="text-foreground">extra.model</code>{" "}
                        ({modelPricing.amount} atomic USDC)
                      </p>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Gavel className="size-4 text-muted-foreground" />
                        <span className="font-sans text-xs text-foreground">Judge wallet (no Pera)</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={judgeMode ? "default" : "secondary"}
                        onClick={() => setJudgeMode((v) => !v)}
                      >
                        {judgeMode ? "On" : "Off"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button type="submit" disabled={running !== null} className="gap-2">
                        <Zap className="h-4 w-4" />
                        {running === "live" ? "Running exchange…" : "Run live x402 flow"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={running !== null}
                        className="gap-2"
                        onClick={form.handleSubmit(runSimulation)}
                      >
                        <Play className="h-4 w-4" />
                        {running === "simulated" ? "Simulating…" : "Test Mode (no payment)"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={running !== null}
                        className="gap-2"
                        onClick={form.handleSubmit(async (v) => {
                          setRunning("agent");
                          try {
                            await runAsAgent(v);
                          } finally {
                            setRunning(null);
                          }
                        })}
                      >
                        <Bot className="h-4 w-4" />
                        {running === "agent" ? "Agent running…" : "Run as agent"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1 font-mono text-[11px]"
                        onClick={() => {
                          resetX402GuidedTour();
                          toast.message("Guided tour will replay on next visit");
                        }}
                      >
                        <RotateCcw className="size-3" />
                        Reset tour
                      </Button>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Test Mode mocks every step client-side. The live flow calls the real
                      /api/x402-demo route and Groq.
                    </p>
                  </CardContent>
                </form>
              </Card>
            </Reveal>

            <Reveal delay={180}>
              <Card className="border-border/80 bg-card/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    3 · Payment status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentTimeline steps={timeline} />
                  {failure && (
                    <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {failure}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          </section>

          <section className="space-y-6">
            <Reveal delay={100}>
              <Card id="x402-http-exchange" className="border-border/80 bg-card/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    HTTP exchange · raw headers &amp; payloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {exchanges.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Run a flow to capture each request and response verbatim.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {exchanges.map((exchange, index) => (
                        <HttpExchangeView
                          key={exchange.id}
                          exchange={exchange}
                          defaultOpen={index === 1}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={140}>
              <Card className="border-border/80 bg-card/95 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment header inspector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentHeaderInspector
                    paymentRequired={headerSnapshot.paymentRequired}
                    paymentSignature={headerSnapshot.paymentSignature}
                    paymentResponse={headerSnapshot.paymentResponse}
                  />
                  {lastCurl ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <CurlExportButton
                        method="POST"
                        url={`${typeof window !== "undefined" ? window.location.origin : ""}/api/x402-demo`}
                        body={form.getValues("prompt") ? JSON.stringify({ prompt: form.getValues("prompt"), mode, model: form.getValues("model") }) : undefined}
                        headers={{
                          "content-type": "application/json",
                          ...(headerSnapshot.paymentSignature
                            ? { "x-payment": headerSnapshot.paymentSignature }
                            : {}),
                        }}
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={160}>
              <Card className="border-border/80 bg-card/95 shadow-sm">
                <CardContent className="p-0">
                  <div className="h-80">
                    <LogConsole entries={logs} onClear={() => setLogs([])} />
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            {result && (
              <Reveal delay={80}>
                <Card className="border-accent-green/40 bg-card/95 shadow-md shadow-accent-green/5">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-accent-green">
                        <Sparkles className="h-4 w-4" /> Unlocked resource
                      </CardTitle>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {result.simulated ? "simulated" : "live"} · {result.model} ·{" "}
                        {result.latencyMs}ms
                        {result.usage?.total_tokens ? ` · ${result.usage.total_tokens} tokens` : ""}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                      <dt>settled</dt>
                      <dd className="text-card-foreground">{String(result.settlement.success)}</dd>
                      <dt>network</dt>
                      <dd className="text-card-foreground">{result.settlement.network}</dd>
                      <dt>txid</dt>
                      <dd className="break-all text-card-foreground">
                        {result.settlement.transaction}
                      </dd>
                      <dt>payer</dt>
                      <dd className="break-all text-card-foreground">{result.settlement.payer}</dd>
                    </dl>
                    <div className="mt-4 rounded-lg border border-border/60 bg-background/40 p-4">
                      <MarkdownContent>{result.content}</MarkdownContent>
                    </div>
                    {result.settlement.transaction && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" asChild>
                          <a href={`/receipt/${encodeURIComponent(result.settlement.transaction)}`}>
                            View receipt
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Reveal>
            )}
          </section>
        </main>
      </Container>
    </div>
  );
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
