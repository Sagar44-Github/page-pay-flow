import { Check, CircleDashed, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type StepState = "idle" | "active" | "done" | "error";

export interface FlowStep {
  key: string;
  label: string;
  hint: string;
  state: StepState;
}

/** Animated payment/protocol state indicator. */
export function PaymentTimeline({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="space-y-1">
      {steps.map((step, index) => (
        <li key={step.key} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-500",
                step.state === "done" && "border-primary bg-primary/15 text-primary",
                step.state === "active" &&
                  "scale-110 border-primary bg-primary/20 text-primary shadow-[0_0_0_4px] shadow-primary/10",
                step.state === "error" && "border-destructive bg-destructive/15 text-destructive",
                step.state === "idle" && "border-border text-muted-foreground",
              )}
            >
              {step.state === "done" && <Check className="h-3.5 w-3.5" />}
              {step.state === "active" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {step.state === "error" && <X className="h-3.5 w-3.5" />}
              {step.state === "idle" && <CircleDashed className="h-3.5 w-3.5" />}
            </span>
            {index < steps.length - 1 && (
              <span
                className={cn(
                  "my-1 w-px flex-1 transition-colors duration-500",
                  step.state === "done" ? "bg-primary/50" : "bg-border",
                )}
              />
            )}
          </div>
          <div className="pb-3">
            <p
              className={cn(
                "text-sm font-medium transition-colors",
                step.state === "idle" ? "text-muted-foreground" : "text-card-foreground",
              )}
            >
              {step.label}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">{step.hint}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
