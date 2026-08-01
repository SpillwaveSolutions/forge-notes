#!/usr/bin/env node
/**
 * Launch the desktop app with the MCP bridge, on this repo's assigned ports.
 *
 * Exists because three things have to agree and none of them share a default:
 *   - vite binds VITE_PORT with strictPort, so it hard-fails on a collision
 *   - tauri.conf.json's devUrl must point at that same port or the window is blank
 *   - the bridge scans upward from MCP_BRIDGE_PORT (9223 by default, which is
 *     also Chrome's remote-debugging port)
 *
 * Ports come from scripts/dev-ports.mjs, which probes for real and remembers
 * the assignment, so several agents can each run a Tauri app on one laptop.
 *
 *   node scripts/launch-desktop-mcp.mjs           # reuse a running dev server
 *   node scripts/launch-desktop-mcp.mjs --serve   # start the dev server too
 */
import { execFileSync, spawn } from "node:child_process";
import { createConnection } from "node:net";

const HERE = new URL(".", import.meta.url).pathname;
const serveToo = process.argv.includes("--serve");

const ports = JSON.parse(
  execFileSync("node", [`${HERE}dev-ports.mjs`, "resolve"], { encoding: "utf8" }),
);
const devUrl = `http://127.0.0.1:${ports.vite}`;

/** Is something already serving on the vite port? */
function inUse(port) {
  return new Promise((done) => {
    const sock = createConnection({ port, host: "127.0.0.1" });
    sock.setTimeout(1500);
    sock.once("connect", () => (sock.destroy(), done(true)));
    sock.once("error", () => done(false));
    sock.once("timeout", () => (sock.destroy(), done(false)));
  });
}

const serverUp = await inUse(ports.vite);
if (!serverUp && !serveToo) {
  console.error(
    `No dev server on ${devUrl}.\n` +
      `Start one with \`npm run dev\` (it will use port ${ports.vite}), or re-run with --serve.`,
  );
  process.exit(1);
}
if (serverUp && serveToo) {
  console.error(`Dev server already on ${devUrl} — ignoring --serve and reusing it.`);
}

// Override BOTH build fields: beforeDevCommand is emptied when a server is
// already up, because `npm run dev` would hard-fail on strictPort rather than
// notice the existing one.
const overrides = {
  build: {
    devUrl,
    beforeDevCommand: serverUp ? "" : "npm run dev",
  },
};

console.error(
  `desktop:mcp  vite=${ports.vite}  mcpBridge=${ports.mcpBridge}  ` +
    `(server ${serverUp ? "reused" : "starting"})`,
);
console.error(`connect with: tauri-mcp driver-session start --host 127.0.0.1 --port ${ports.mcpBridge}`);

const child = spawn(
  "npx",
  ["tauri", "dev", "--features", "mcp-bridge", "--config", JSON.stringify(overrides)],
  {
    // Piped, not inherited, so we can read the bridge's init line. Everything is
    // re-emitted, so this still behaves like a normal foreground run.
    stdio: ["inherit", "pipe", "pipe"],
    env: {
      ...process.env,
      MCP_BRIDGE_PORT: String(ports.mcpBridge),
      // vite.config.ts reads this so the dev server and devUrl cannot disagree
      VITE_PORT: String(ports.vite),
    },
  },
);

/**
 * The plugin scans upward from the base port, so the port it actually binds is
 * frequently NOT the one we asked for — and the client has no way to guess.
 * (This exact mismatch, base 9223 vs actual 9224, is what made the bridge look
 * broken until the log was read.) Catch the real port and persist it, so the
 * next run asks for the one that worked.
 */
const INIT_LINE = /MCP Bridge plugin initialized .*? on ([\d.]+):(\d+)/;
let recorded = false;

function watch(chunk, out) {
  out.write(chunk);
  if (recorded) return;
  const m = INIT_LINE.exec(chunk.toString());
  if (!m) return;
  recorded = true;
  const [, host, port] = m;
  if (Number(port) !== ports.mcpBridge) {
    process.stderr.write(
      `dev-ports: bridge scanned past ${ports.mcpBridge} and bound ${port} — recording it\n`,
    );
    try {
      execFileSync("node", [`${HERE}dev-ports.mjs`, "claim", "mcpBridge", port], {
        stdio: "ignore",
      });
    } catch {
      /* a failed claim is not worth killing the app over */
    }
  }
  process.stderr.write(
    `\n  bridge ready — tauri-mcp driver-session start --host ${host} --port ${port}\n\n`,
  );
}

child.stdout.on("data", (c) => watch(c, process.stdout));
child.stderr.on("data", (c) => watch(c, process.stderr));
child.on("exit", (code) => process.exit(code ?? 0));
