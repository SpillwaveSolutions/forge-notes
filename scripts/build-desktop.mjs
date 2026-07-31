#!/usr/bin/env node
/**
 * Build a static frontend bundle for Tauri (no Nitro/Vercel SSR).
 * Output: /workspace/dist-desktop
 *
 * Reuses the production Vite build when available, then copies
 * static assets into dist-desktop. Falls back to a thin static shell
 * that points at the built client assets.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const OUT = join(ROOT, "dist-desktop");

function run(cmd, args) {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", cwd: ROOT, env: process.env });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// Full app build (TanStack Start + Nitro → .vercel/output/static)
run("npm", ["run", "build"]);

const candidates = [
  join(ROOT, ".vercel", "output", "static"),
  join(ROOT, "dist", "client"),
  join(ROOT, "dist"),
  join(ROOT, ".output", "public"),
];

const src = candidates.find((p) => existsSync(p));
if (!src) {
  console.error("No static frontend output found after build.");
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(src, OUT, { recursive: true });

// Ensure index.html exists at root for Tauri webview
const indexCandidates = [
  join(OUT, "index.html"),
  join(OUT, "_index.html"),
  ...readdirSync(OUT)
    .filter((f) => f.endsWith(".html"))
    .map((f) => join(OUT, f)),
];
const hasIndex = existsSync(join(OUT, "index.html"));
if (!hasIndex) {
  const anyHtml = indexCandidates.find((p) => existsSync(p) && !p.endsWith("index.html"));
  if (anyHtml) {
    cpSync(anyHtml, join(OUT, "index.html"));
  } else {
    // SPA shell for client-router apps
    writeFileSync(
      join(OUT, "index.html"),
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ForgeNotes</title>
    <script>window.__WORKSPACE_DESKTOP__ = true;</script>
  </head>
  <body>
    <div id="root"></div>
    <p style="font-family:system-ui;padding:2rem">
      Desktop shell ready. If the app UI does not load, re-run
      <code>npm run build:desktop</code> after a successful web build.
    </p>
  </body>
</html>
`,
    );
  }
}

// Mark desktop runtime
writeFileSync(join(OUT, "desktop.json"), JSON.stringify({ desktop: true, source: src }, null, 2));
console.log(`Desktop static assets → ${OUT} (from ${src})`);
