/** Per-model USDC pricing for the x402 protocol demo (atomic units, 6 decimals). */
export const DEMO_MODEL_PRICING = {
  "openai/gpt-oss-20b": {
    amount: "10000",
    amountFormatted: "$0.01",
    label: "GPT-OSS 20B",
  },
  "qwen/qwen3.6-27b": {
    amount: "50000",
    amountFormatted: "$0.05",
    label: "Qwen 3.6 27B",
  },
} as const;

export type DemoGroqModel = keyof typeof DEMO_MODEL_PRICING;

export function demoPriceForModel(model: string) {
  return (
    DEMO_MODEL_PRICING[model as DemoGroqModel] ?? DEMO_MODEL_PRICING["openai/gpt-oss-20b"]
  );
}

export function isDemoGroqModel(model: string): model is DemoGroqModel {
  return model in DEMO_MODEL_PRICING;
}
