import { execFileSync } from "node:child_process";
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

/**
 * Ask the broker which port to use, and let it verify identity before handing
 * one back. Sync because Playwright loads this config synchronously.
 *
 * This is not a nicety. `reuseExistingServer` asks "is something answering on
 * this port", never "is it MY app" — and three repos on this laptop
 * (forge-notes, okf-forge, agent-brain-ui) all default to 8080. Without the
 * broker's marker check, running `npm run test:e2e` here while a sibling's dev
 * server holds 8080 executes the whole suite against a completely different
 * application. Nothing errors. The assertions just fail, in this repo's specs,
 * pointing at this repo's code — which is the most expensive failure shape
 * there is, because the symptom names the wrong subsystem.
 *
 * `dev-ports.mjs port vite` returns a port that is either free or already
 * serving THIS app, so reuse is safe by construction.
 */
const port = Number(
  execFileSync(process.execPath, ["scripts/dev-ports.mjs", "port", "vite"], {
    encoding: "utf8",
    // stderr passes through: the broker explains on it when it moves off 8080,
    // and swallowing that turns a legible message into a mystery port change.
    stdio: ["ignore", "pipe", "inherit"],
  }).trim(),
);

if (!Number.isInteger(port) || port < 1) {
  throw new Error(`dev-ports.mjs returned no usable port for vite (got: ${port})`);
}

const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
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
    url: `${baseURL}/`,
    // VITE_PORT must be threaded through: vite.config.ts binds `strictPort`, so
    // a server started without it would hard-fail on an occupied 8080 instead
    // of using the port the broker just picked.
    env: { VITE_PORT: String(port) },
    // Safe here only because the broker already proved this port is free or
    // ours. Always start clean in CI.
    reuseExistingServer: !process.env.CI,
    // First boot runs pgliteBootstrapPlugin -> ensureDbReady(); PGlite WASM init
    // is slow, and the plugin rethrows on failure, which kills the server.
    timeout: 180_000,
  },
});
