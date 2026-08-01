import { defineConfig, devices } from "@playwright/test";

/**
 * WebKit-only on purpose: the desktop app ships in a macOS WKWebView, so WebKit
 * is the engine that actually matters here. Chromium stays reserved for
 * `scripts/browser-smoke.mjs`, which is a separate, still-referenced ship gate.
 *
 * Note there are no pixel-diff baselines (`toHaveScreenshot`). WebKit rendering
 * shifts across macOS point releases and there is no Linux baseline, so
 * committed PNGs churn. Visual approval happens against the wireframes and
 * rubrics in `docs/ui/`, judged from real screenshots — not by pixel compare.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:8080",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "webkit",
      // viewport AFTER the spread: Desktop Safari defaults to 1280x720, but
      // 1280x800 is the convention already used by scripts/browser-smoke.mjs.
      use: { ...devices["Desktop Safari"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:8080/",
    // The dev server binds strictPort:8080, so a second one hard-fails. Reuse
    // whatever the developer already has running; always start clean in CI.
    reuseExistingServer: !process.env.CI,
    // First boot runs pgliteBootstrapPlugin -> ensureDbReady(); PGlite WASM init
    // is slow, and the plugin rethrows on failure, which kills the server.
    timeout: 180_000,
  },
});
