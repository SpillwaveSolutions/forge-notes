#!/usr/bin/env node
/**
 * Port broker for local dev, so several agents can each run a Tauri app on one
 * laptop without fighting over ports.
 *
 * Two mechanisms, deliberately:
 *
 * 1. A REALITY PROBE (actually binding the port) decides whether a port is
 *    usable. This is the part that works across agents, repos, and tools that
 *    know nothing about this script — including Chrome, whose remote-debugging
 *    port defaults to 9223, the same as the Tauri MCP bridge.
 * 2. A REGISTRY remembers assignments so a project keeps the same ports between
 *    runs, and so cooperating projects avoid each other's reservations even
 *    while those apps are stopped. The registry is a hint; the probe is truth.
 *
 * Registry lives at ~/.config/tauri-dev-ports.json, keyed by repo path, and is
 * machine-local (never committed).
 *
 *   node scripts/dev-ports.mjs resolve          # assign+persist, print JSON
 *   node scripts/dev-ports.mjs resolve --env    # same, as shell exports
 *   node scripts/dev-ports.mjs status           # who holds what right now
 *   node scripts/dev-ports.mjs check 9223       # is one port free?
 *   node scripts/dev-ports.mjs port vite        # print just that port
 *   node scripts/dev-ports.mjs release          # drop this repo's reservation
 *
 * A third mechanism guards the case the first two miss: an IDENTITY PROBE.
 * `isFree` answers "is anything listening", which is not the same question as
 * "is MY app listening" — and three repos on this laptop default to 8080. See
 * `servesThisApp`.
 */
import { createServer } from "node:net";
import { get } from "node:http";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { homedir } from "node:os";

const REGISTRY = process.env.TAURI_DEV_PORTS_FILE
  ?? resolvePath(homedir(), ".config", "tauri-dev-ports.json");
const REPO = resolvePath(dirname(new URL(import.meta.url).pathname), "..");

/**
 * Services we broker. `span` is how far to scan before giving up.
 *
 * `marker` is a string that MUST appear in the HTML served from `/` for the
 * port to count as ours. Only HTTP services can have one.
 */
const SERVICES = {
  // 8080 is the documented default (Grok live preview + tauri devUrl both
  // assume it). We only move off it when it is genuinely taken by someone else.
  vite: { base: 8080, span: 40, marker: "ForgeNotes" },
  // The MCP bridge speaks its own protocol, not HTTP — no marker to check.
  mcpBridge: { base: 9223, span: 100, marker: null },
};

function readRegistry() {
  try {
    return JSON.parse(readFileSync(REGISTRY, "utf8"));
  } catch {
    return { version: 1, projects: {} };
  }
}

function writeRegistry(reg) {
  mkdirSync(dirname(REGISTRY), { recursive: true });
  writeFileSync(REGISTRY, JSON.stringify(reg, null, 2) + "\n");
}

/**
 * True when nothing is listening. Binds for real rather than trusting the
 * registry — another agent's app, or Chrome, will not have registered.
 * Binds 0.0.0.0 because a service on 0.0.0.0 blocks 127.0.0.1 too.
 */
function isFree(port) {
  return new Promise((done) => {
    const srv = createServer();
    srv.once("error", () => done(false));
    srv.once("listening", () => srv.close(() => done(true)));
    srv.listen(port, "0.0.0.0");
  });
}

/**
 * True when the server on `port` is THIS app, proven by fetching `/` and
 * looking for the service's marker in the HTML.
 *
 * A liveness check is not an identity check, and that distinction is the whole
 * point of this function. Several sibling repos on this laptop default to 8080,
 * so "something is listening" is compatible with "it is a completely different
 * application". Playwright's `reuseExistingServer` only asks the first question,
 * then runs the entire e2e suite against whatever answered — failures that look
 * like app bugs and cost an hour before anyone suspects the port.
 */
function servesThisApp(port, marker) {
  if (!marker) return Promise.resolve(false);
  return new Promise((done) => {
    // Settle exactly once. A socket held open by something that never answers
    // (a bare TCP listener, a sibling dev server mid-boot) emits neither `end`
    // nor `error`, so without the timer this promise hangs forever and takes
    // the whole resolution down with it.
    let settled = false;
    const settle = (v) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      req.destroy();
      done(v);
    };
    const timer = setTimeout(() => settle(false), 1500);

    const req = get({ host: "127.0.0.1", port, path: "/" }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => {
        body += c;
        // The marker is in <head>; no need to buffer a whole SPA document.
        if (body.length > 65536) settle(body.includes(marker));
      });
      res.on("end", () => settle(body.includes(marker)));
      res.on("error", () => settle(false));
    });
    req.on("error", () => settle(false));
  });
}

/** Best-effort "what is on this port" for humans. Never throws. */
function holder(port) {
  try {
    const out = execFileSync("lsof", ["-nP", `-i:${port}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const line = out.split("\n").find((l) => l.includes("LISTEN"));
    return line ? line.split(/\s+/)[0] : null;
  } catch {
    return null;
  }
}

/** Ports reserved by OTHER projects in the registry — avoid them when scanning. */
function reservedElsewhere(reg, service) {
  const taken = new Set();
  for (const [path, entry] of Object.entries(reg.projects ?? {})) {
    if (path === REPO) continue;
    const p = entry?.[service];
    if (typeof p === "number") taken.add(p);
  }
  return taken;
}

async function resolveService(reg, service) {
  const { base, span, marker } = SERVICES[service];
  const remembered = reg.projects?.[REPO]?.[service];
  const avoid = reservedElsewhere(reg, service);

  // An existing assignment is STICKY while the port is free or holds OUR OWN
  // server — drifting on every check would defeat the point of remembering.
  //
  // The one case that must not be sticky is a port held by a DIFFERENT app.
  // Three repos on this laptop default to 8080, so that is not hypothetical,
  // and staying put would hand a sibling's dev server to our own e2e suite.
  // For a service with no marker we cannot tell the difference, so it keeps the
  // old behaviour: warn and stay, because busy there is nearly always our app.
  if (typeof remembered === "number") {
    if (await isFree(remembered)) return { port: remembered, reused: true };

    if (!marker) {
      process.stderr.write(
        `dev-ports: ${service} ${remembered} is in use by ${holder(remembered) ?? "unknown"} ` +
          `— keeping the assignment (run \`status\` if that isn't your app)\n`,
      );
      return { port: remembered, reused: true };
    }

    if (await servesThisApp(remembered, marker)) return { port: remembered, reused: true };

    process.stderr.write(
      `dev-ports: ${service} ${remembered} is held by ${holder(remembered) ?? "unknown"}, ` +
        `which is NOT this app (no "${marker}" in its HTML) — moving off it\n`,
    );
  }

  for (let port = base; port < base + span; port++) {
    if (avoid.has(port)) continue;
    if (await isFree(port)) return { port, reused: false };
  }
  throw new Error(
    `no free port for ${service} in ${base}..${base + span - 1} ` +
      `(checked with a real bind; ${avoid.size} more reserved by other projects)`,
  );
}

async function cmdResolve(asEnv) {
  const reg = readRegistry();
  const out = {};
  for (const service of Object.keys(SERVICES)) {
    const { port, reused } = await resolveService(reg, service);
    out[service] = port;
    if (!reused) process.stderr.write(`dev-ports: ${service} -> ${port}\n`);
  }

  reg.projects ??= {};
  reg.projects[REPO] = { ...out, updatedAt: new Date().toISOString() };
  writeRegistry(reg);

  if (asEnv) {
    // devUrl must track the vite port or the Tauri window loads nothing.
    console.log(`export VITE_PORT=${out.vite}`);
    console.log(`export MCP_BRIDGE_PORT=${out.mcpBridge}`);
    console.log(`export TAURI_DEV_URL=http://127.0.0.1:${out.vite}`);
  } else {
    console.log(JSON.stringify(out, null, 2));
  }
}

/**
 * Print ONE service's port and nothing else, so a config file can read it with
 * `execFileSync`. Playwright loads its config synchronously, so it cannot await
 * `resolveService` directly — a subprocess is cheaper than duplicating the
 * probe logic into a second, drift-prone copy.
 */
async function cmdPort(service) {
  if (!(service in SERVICES)) {
    console.error(`unknown service: ${service} (have: ${Object.keys(SERVICES).join(", ")})`);
    process.exit(2);
  }
  const reg = readRegistry();
  const { port } = await resolveService(reg, service);
  reg.projects ??= {};
  reg.projects[REPO] = {
    ...(reg.projects[REPO] ?? {}),
    [service]: port,
    updatedAt: new Date().toISOString(),
  };
  writeRegistry(reg);
  console.log(port);
}

async function cmdStatus() {
  const reg = readRegistry();
  const mine = reg.projects?.[REPO];
  console.log(`registry: ${REGISTRY}`);
  console.log(`repo:     ${REPO}\n`);

  if (!mine) console.log("no ports assigned to this repo yet — run `resolve`\n");

  for (const service of Object.keys(SERVICES)) {
    const port = mine?.[service];
    if (port == null) {
      console.log(`${service.padEnd(10)} unassigned`);
      continue;
    }
    const free = await isFree(port);
    let who = "";
    if (!free) {
      const proc = holder(port) ?? "unknown";
      // Naming the process is not enough — two of these repos run `node` on
      // 8080 and look identical in lsof. Only the marker distinguishes them.
      const mine = await servesThisApp(port, SERVICES[service].marker);
      const whose = SERVICES[service].marker
        ? mine
          ? " — this app"
          : " — NOT this app"
        : "";
      who = ` (held by ${proc}${whose})`;
    }
    console.log(`${service.padEnd(10)} ${port}  ${free ? "free" : "IN USE"}${who}`);
  }

  const others = Object.entries(reg.projects ?? {}).filter(([p]) => p !== REPO);
  if (others.length) {
    console.log("\nreserved by other projects:");
    for (const [path, entry] of others) {
      const ports = Object.keys(SERVICES)
        .map((s) => `${s}=${entry[s] ?? "-"}`)
        .join(" ");
      console.log(`  ${ports}  ${path}`);
    }
  }
}

async function cmdCheck(port) {
  const n = Number(port);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    console.error(`not a port: ${port}`);
    process.exit(2);
  }
  const free = await isFree(n);
  console.log(free ? `${n} free` : `${n} IN USE (${holder(n) ?? "unknown"})`);
  process.exit(free ? 0 : 1);
}

/**
 * Pin a service to a port explicitly. Needed because assignments are sticky: if
 * this repo's own dev server is already up when you first `resolve`, the probe
 * correctly reports its port as taken and moves you off it. `claim` says "no,
 * that one is mine".
 */
async function cmdClaim(service, port) {
  if (!(service in SERVICES)) {
    console.error(`unknown service: ${service} (have: ${Object.keys(SERVICES).join(", ")})`);
    process.exit(2);
  }
  const n = Number(port);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    console.error(`not a port: ${port}`);
    process.exit(2);
  }

  const reg = readRegistry();
  const clash = Object.entries(reg.projects ?? {})
    .filter(([p]) => p !== REPO)
    .find(([, e]) => e?.[service] === n);
  if (clash) {
    console.error(`refusing: ${service} ${n} is reserved by ${clash[0]}`);
    console.error("run `release` there first, or pick another port");
    process.exit(1);
  }

  reg.projects ??= {};
  reg.projects[REPO] = { ...(reg.projects[REPO] ?? {}), [service]: n, updatedAt: new Date().toISOString() };
  writeRegistry(reg);
  const free = await isFree(n);
  console.log(`${service} pinned to ${n}${free ? "" : ` (currently held by ${holder(n) ?? "unknown"})`}`);
}

function cmdRelease() {
  const reg = readRegistry();
  if (reg.projects?.[REPO]) {
    delete reg.projects[REPO];
    writeRegistry(reg);
    console.log("released this repo's reservation");
  } else {
    console.log("nothing reserved for this repo");
  }
}

const [cmd, ...rest] = process.argv.slice(2);
switch (cmd) {
  case "resolve":
    await cmdResolve(rest.includes("--env"));
    break;
  case "status":
    await cmdStatus();
    break;
  case "check":
    await cmdCheck(rest[0]);
    break;
  case "port":
    await cmdPort(rest[0]);
    break;
  case "claim":
    await cmdClaim(rest[0], rest[1]);
    break;
  case "release":
    cmdRelease();
    break;
  default:
    console.error(
      "usage: dev-ports.mjs resolve [--env] | status | check <port> | " +
        "port <service> | claim <service> <port> | release",
    );
    process.exit(2);
}
