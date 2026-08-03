import { defineConfig } from "vitest/config";

/**
 * Deliberately standalone — NOT a `test` block in `vite.config.ts`.
 *
 * Vitest resolves `vitest.config.*` with priority and does not merge the Vite
 * config, so none of the dev-server plugins load here. That matters:
 * `pgliteBootstrapPlugin` is `apply: "serve"` and its `configureServer` awaits
 * `ensureDbReady()` and rethrows, which would abort every run before a single
 * test executed. Reusing `vite.config.ts` would mean adding a guard to disable
 * four fifths of the config we chose to reuse.
 *
 * `tsconfigPaths` is Vite 8 native (there is no `vite-tsconfig-paths` package
 * installed) — restating one line is cheaper than inheriting 153 lines of
 * dev-server machinery to get it.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    // `scripts/` is plain ESM with no `@/` imports and no DOM, but it holds
    // real logic worth pinning (the dev-port broker's identity probe). One glob
    // beats standing up a second runner for one file.
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
    restoreMocks: true,
  },
});
