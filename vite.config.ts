// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const isNetlify = Boolean(process.env.NETLIFY);
const browserOnlyStub = path.resolve(rootDir, "src/stubs/react-three-stub.ts");
const peraStub = path.resolve(rootDir, "src/stubs/pera-stub.ts");

export default defineConfig(async () => {
  const netlifyPlugins = isNetlify
    ? [(await import("@netlify/vite-plugin-tanstack-start")).default()]
    : [];

  return {
    tanstackStart: {
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    },
    vite: {
      plugins: netlifyPlugins,
      ssr: {
        resolve: {
          alias: {
            "@react-three/fiber": browserOnlyStub,
            "@react-three/drei": browserOnlyStub,
            three: browserOnlyStub,
            "@perawallet/connect": peraStub,
          },
        },
      },
    },
    nitro: {
      // Default to Vercel unless explicitly building for Netlify.
      preset: isNetlify ? "netlify" : "vercel",
      alias: {
        "@react-three/fiber": browserOnlyStub,
        "@react-three/drei": browserOnlyStub,
        three: browserOnlyStub,
        "@perawallet/connect": peraStub,
      },
      vercel: {
        functions: {
          runtime: "nodejs20.x",
          maxDuration: 60,
        },
      },
    },
  };
});
