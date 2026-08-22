// Polyfill browser globals for Node.js SSR runtime (e.g. Vercel Serverless Functions)
if (typeof globalThis.self === "undefined") {
  (globalThis as any).self = globalThis;
}
if (typeof globalThis.window === "undefined") {
  (globalThis as any).window = globalThis;
}
(globalThis as any).addEventListener = (globalThis as any).addEventListener || (() => {});
(globalThis as any).removeEventListener = (globalThis as any).removeEventListener || (() => {});
(globalThis as any).location = (globalThis as any).location || { pathname: "/", search: "", hash: "", href: "http://localhost/" };
if (typeof globalThis.getComputedStyle === "undefined") {
  (globalThis as any).getComputedStyle = () => ({
    getPropertyValue: () => "",
    direction: "ltr",
  });
}
if (typeof globalThis.document === "undefined") {
  const mockContext = { fillStyle: "", fillRect: () => {}, getImageData: () => ({ data: [] }) };
  const dummyEl = { setAttribute: () => {}, getAttribute: () => null, style: {}, getContext: () => mockContext, appendChild: () => {} };
  (globalThis as any).document = {
    createElement: () => dummyEl,
    createTextNode: () => dummyEl,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementsByTagName: () => [],
    head: dummyEl,
    body: dummyEl,
    documentElement: dummyEl,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}
if (typeof globalThis.HTMLElement === "undefined") {
  class DummyNode {}
  (globalThis as any).HTMLElement = DummyNode;
  (globalThis as any).Element = DummyNode;
  (globalThis as any).Node = DummyNode;
  (globalThis as any).Event = DummyNode;
  (globalThis as any).CustomEvent = DummyNode;
}
if (typeof globalThis.customElements === "undefined") {
  (globalThis as any).customElements = {
    get: () => undefined,
    define: () => {},
    whenDefined: () => Promise.resolve(),
  };
}

if (typeof globalThis.ResizeObserver === "undefined") {
  (globalThis as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
