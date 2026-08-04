#!/usr/bin/env node
/**
 * Build a static frontend bundle for Tauri. Output: ./dist-desktop
 *
 * The default build targets Vercel and is SERVER-rendered: it emits
 * `.vercel/output/static/assets/**` and no `index.html` anywhere, because the
 * HTML is produced per request by a function. A Tauri webview loads from disk
 * and has no server, so there is nothing for it to open.
 *
 * The fix is TanStack Start's SPA mode, which prerenders a shell that boots the
 * client router. `DESKTOP_BUILD=1` switches `vite.config.ts` over to it and
 * drops the Nitro/Vercel target for this build only.
 *
 * This script previously papered over the missing entry by writing a
 * placeholder `index.html` — one that loaded no JavaScript at all. The desktop
 * app therefore built, launched, showed "Desktop shell ready…" forever, and
 * reported success. Verification now hard-fails instead: an `index.html` with
 * no module script is not a build, it is a lie.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const OUT = join(ROOT, "dist-desktop");

function run(cmd, args, env = {}) {
  const prefix = Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");
  console.log(`$ ${prefix} ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", cwd: ROOT, env: { ...process.env, ...env } });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// A stale SSR build in .vercel/output would otherwise be picked up as a
// candidate below and silently win over the SPA output.
rmSync(join(ROOT, ".vercel"), { recursive: true, force: true });
rmSync(OUT, { recursive: true, force: true });

run("npx", ["vite", "build"], { DESKTOP_BUILD: "1" });

/** Where the SPA shell lands varies with the Start version; take the first that has one. */
const candidates = [
  join(ROOT, "dist", "client"),
  join(ROOT, "dist"),
  join(ROOT, ".output", "public"),
  join(ROOT, ".vercel", "output", "static"),
];

const src = candidates.find((p) => existsSync(p) && existsSync(join(p, "index.html")));
if (!src) {
  console.error(
    "No static frontend output with an index.html was produced.\n" +
      "Looked in:\n" +
      candidates
        .map((c) => `  ${c}${existsSync(c) ? "  (exists, but no index.html)" : ""}`)
        .join("\n") +
      "\n\nSPA mode should emit one. Check that DESKTOP_BUILD=1 reached vite.config.ts\n" +
      "and that `tanstackStart({ spa: { enabled: true } })` is active.",
  );
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
cpSync(src, OUT, { recursive: true });

// ── Verification ─────────────────────────────────────────────────────────────
// Fail here rather than three steps later, in front of someone staring at a
// blank window.
const indexPath = join(OUT, "index.html");
const html = readFileSync(indexPath, "utf8");

if (!/<script[^>]+src=/i.test(html)) {
  console.error(
    `${indexPath} contains no <script src=...>, so it cannot boot the app.\n` +
      "That is the exact shape of the placeholder this script used to write, and\n" +
      "it is how a broken desktop build passed for a working one.",
  );
  process.exit(1);
}

const assets = join(OUT, "assets");
if (!existsSync(assets) || readdirSync(assets).length === 0) {
  console.error(`${assets} is missing or empty — the scripts index.html references will 404.`);
  process.exit(1);
}

writeFileSync(join(OUT, "desktop.json"), JSON.stringify({ desktop: true, source: src }, null, 2));

// Force the next `tauri build` to re-embed these assets.
//
// Tauri bakes `frontendDist` into the binary at COMPILE time via
// `generate_context!`, but Cargo does not track the contents of `dist-desktop/`
// as an input. So rebuilding the frontend and rebuilding the app produces a
// binary carrying the PREVIOUS bundle, silently — which is how three rounds of
// desktop fixes were shipped, installed, and tested without any of them ever
// reaching the running app. Bumping a tracked source's mtime costs one
// recompile of this one crate and removes the entire failure mode.
const TOUCHED = ["src-tauri/src/lib.rs", "src-tauri/build.rs"];
for (const f of TOUCHED) {
  const p = join(ROOT, f);
  if (existsSync(p)) utimesSync(p, new Date(), new Date());
}

const scripts = html.match(/<script[^>]+src="[^"]+"/gi)?.length ?? 0;
console.log(
  `Desktop static assets → ${OUT}\n` +
    `  from      ${src}\n` +
    `  index.html carries ${scripts} script tag(s); ${readdirSync(assets).length} asset(s)`,
);
