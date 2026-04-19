// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    ssr: {
      // Pre-bundle these CJS/ESM-mixed email rendering packages so Vite
      // resolves their internal htmlparser2 import (lib/esm vs dist/esm)
      // correctly instead of failing at runtime.
      noExternal: [
        "@react-email/render",
        "@react-email/components",
        "html-to-text",
        "@selderee/plugin-htmlparser2",
        "selderee",
        "htmlparser2",
      ],
    },
  },
});
