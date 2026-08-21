import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CurlExportButton({
  method,
  url,
  body,
  headers,
  label = "Copy curl",
}: {
  method: string;
  url: string;
  body?: string;
  headers?: Record<string, string>;
  label?: string;
}) {
  const curl = buildCurl(method, url, body, headers);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="font-mono text-[11px]"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(curl);
          toast.success("curl copied to clipboard");
        } catch {
          toast.error("Could not copy — select and copy manually");
        }
      }}
    >
      {label}
    </Button>
  );
}

export function buildCurl(
  method: string,
  url: string,
  body?: string,
  headers: Record<string, string> = {},
) {
  const lines = [`curl -X ${method.toUpperCase()} '${url}' \\`];
  for (const [key, value] of Object.entries(headers)) {
    lines.push(`  -H '${key}: ${value.replace(/'/g, "'\\''")}' \\`);
  }
  if (body) {
    lines.push(`  -d '${body.replace(/'/g, "'\\''")}'`);
  } else {
    lines[lines.length - 1] = lines[lines.length - 1]!.replace(/ \\$/, "");
  }
  return lines.join("\n");
}
