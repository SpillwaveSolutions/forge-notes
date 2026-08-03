import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const SCRIPTS = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(SCRIPTS, "..");
const CLI = join(SCRIPTS, "dev-ports.mjs");

/**
 * The bug these tests pin: a liveness check is not an identity check.
 *
 * Three repos on this laptop default to Vite on 8080. `isFree()` answers "is
 * anything listening", which is compatible with "a completely different app is
 * listening" — and Playwright's `reuseExistingServer` asks only that question
 * before running the whole e2e suite against whatever answered. The failures
 * then surface as assertion errors in this repo's specs, about this repo's
 * code, with the real cause in a subsystem nobody is looking at.
 *
 * A port well above 8080 stands in for the remembered assignment, so the test
 * never has to bind 8080 itself and cannot disturb a real dev server.
 */
const DECOY_PORT = 8137;

const STRANGER = `<html><head><title>OKFForge — Graph engineering workbench</title></head><body></body></html>`;
const OURS = `<html><head><title>ForgeNotes — notes, AI & harness</title></head><body></body></html>`;

let server;

afterEach(async () => {
  if (!server) return;
  await new Promise((done) => server.close(done));
  server = undefined;
});

function serve(html, port = DECOY_PORT) {
  return new Promise((done) => {
    server = createServer((_req, res) => {
      res.setHeader("content-type", "text/html");
      res.end(html);
    });
    server.listen(port, "0.0.0.0", () => done());
  });
}

/** A throwaway registry seeded to remember `port`, so the CLI never touches ~/.config. */
function registryRemembering(port) {
  const file = join(mkdtempSync(join(tmpdir(), "devports-")), "registry.json");
  writeFileSync(file, JSON.stringify({ version: 1, projects: { [REPO]: { vite: port } } }));
  return file;
}

async function resolveVitePort(registry) {
  const { stdout } = await execFileAsync(process.execPath, [CLI, "port", "vite"], {
    env: { ...process.env, TAURI_DEV_PORTS_FILE: registry },
  });
  return Number(stdout.trim());
}

describe("dev-ports: identity probe", () => {
  it("moves off a remembered port held by a DIFFERENT app", async () => {
    await serve(STRANGER);
    const port = await resolveVitePort(registryRemembering(DECOY_PORT));

    // The whole point: staying on DECOY_PORT would hand a sibling project's
    // dev server to this repo's e2e suite.
    expect(port).not.toBe(DECOY_PORT);
    expect(port).toBeGreaterThanOrEqual(8080);
  });

  it("keeps a remembered port that is serving THIS app", async () => {
    await serve(OURS);
    const port = await resolveVitePort(registryRemembering(DECOY_PORT));

    // Busy-with-our-own-server must stay sticky, or every `npm run test:e2e`
    // against a running `npm run dev` would drift to a fresh port.
    expect(port).toBe(DECOY_PORT);
  });

  it("moves off a remembered port held by something that never answers", async () => {
    // A bare TCP listener: accepts the connection, sends nothing, ever. Without
    // the 1.5 s timeout in servesThisApp the probe would hang here forever.
    const raw = await new Promise((done) => {
      const s = createServer(() => {});
      s.listen(DECOY_PORT, "0.0.0.0", () => done(s));
    });
    try {
      const port = await resolveVitePort(registryRemembering(DECOY_PORT));
      expect(port).not.toBe(DECOY_PORT);
    } finally {
      await new Promise((done) => raw.close(done));
    }
  }, 10_000);
});
