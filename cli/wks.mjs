#!/usr/bin/env node
/**
 * wks — workspace meta-harness CLI
 *
 * Thin compatibility layer above agent backends (mock, Deep Agents, Claude Code,
 * Codex, Grok Build ACP, …). Define workflow once; swap executor.harness.
 *
 *   wks harness backends
 *   wks harness agents
 *   wks harness run hello --message "ping"
 *   wks harness workflow plan-implement-review-validate --feature "JWT auth"
 *   wks harness workflow jwt-auth
 *   wks md --help
 */
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const cmd = args[0];

function help() {
  console.log(`
wks — workspace meta-harness CLI

Usage:
  wks harness backends              List pluggable agent backends
  wks harness agents                List agent YAML definitions
  wks harness workflows             List workflow YAML definitions
  wks harness run <agent>           Run a single agent YAML
       --message "…"  --backend mock|local-deepagents|claude-cli|…
  wks harness workflow <name>       Run Plan→Implement→Review→Validate
       --feature "…"  --backend mock|…
  wks harness status                Summary of harness + backends

  wks md export-help                Markdown import/export lives in the UI
  wks help

Examples:
  wks harness run hello --message "What is a meta-harness?"
  wks harness workflow jwt-auth --backend mock
  wks harness workflow plan-implement-review-validate --feature "Add search facets"

Agent YAML lives in harness/agents/
Workflows live in harness/workflows/
Artifacts land in harness/artifacts/ and harness/plans/
`);
}

async function loadRunner() {
  // Prefer compiled/ts via vite-node or tsx if available; else dynamic import of dist.
  // In this monorepo we run through node with tsx or jiti.
  const runnerUrl = pathToFileURL(path.join(ROOT, "src/lib/harness/runner.ts")).href;
  try {
    return await import(runnerUrl);
  } catch {
    // try registering ts via tsx
  }
  return new Promise((resolve, reject) => {
    // Spawn with npx tsx -e is heavy; use child to execute harness-run helper
    reject(new Error("direct"));
  }).catch(async () => {
    // Fallback: spawn npx tsx on a small runner script
    return null;
  });
}

async function runWithTsx(moduleExportCall) {
  // Execute harness ops via a tiny TS entry that prints JSON
  const entry = path.join(ROOT, "cli/harness-entry.ts");
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      ["--yes", "tsx", entry, ...moduleExportCall],
      { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env: process.env },
    );
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += String(d);
    });
    child.stderr.on("data", (d) => {
      err += String(d);
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(err || out || `exit ${code}`));
        return;
      }
      resolve(out);
    });
  });
}

function flag(name, fallback = undefined) {
  const i = args.indexOf(`--${name}`);
  if (i >= 0 && args[i + 1] && !args[i + 1].startsWith("--")) return args[i + 1];
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  return fallback;
}

async function main() {
  if (!cmd || cmd === "help" || cmd === "-h" || cmd === "--help") {
    help();
    return;
  }

  if (cmd === "md") {
    console.log(
      "Markdown import/export is available in the app UI (sidebar → Import / export).\n" +
        "Linked folders: sidebar → Link markdown (no import).",
    );
    return;
  }

  if (cmd !== "harness") {
    console.error(`Unknown command: ${cmd}`);
    help();
    process.exit(1);
  }

  const sub = args[1];

  if (sub === "backends" || sub === "status" || sub === "agents" || sub === "workflows") {
    const out = await runWithTsx(["status"]);
    const data = JSON.parse(out);
    if (sub === "backends") {
      console.log("\nBackends (pluggable slots):\n");
      for (const b of data.backends) {
        const mark = b.available ? "✓" : "·";
        console.log(`  ${mark} ${b.id.padEnd(20)} ${b.label}`);
        if (b.notes) console.log(`    ${b.notes}`);
      }
      console.log("");
      return;
    }
    if (sub === "agents") {
      console.log("\nAgents:\n");
      data.agents.forEach((a) => console.log(`  - ${a}`));
      console.log("");
      return;
    }
    if (sub === "workflows") {
      console.log("\nWorkflows:\n");
      data.workflows.forEach((w) => console.log(`  - ${w}`));
      console.log("");
      return;
    }
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (sub === "run") {
    const agent = args[2];
    if (!agent) {
      console.error("Usage: wks harness run <agent> --message \"…\"");
      process.exit(1);
    }
    const message = flag("message", "Hello from wks meta-harness");
    const backend = flag("backend");
    const out = await runWithTsx([
      "run-agent",
      agent,
      message,
      backend || "",
    ]);
    const result = JSON.parse(out);
    console.log(result.outputs?.output || result.summary);
    console.log(`\n— run ${result.runId} · ${result.backend} · ${result.durationMs}ms`);
    process.exit(result.ok ? 0 : 1);
  }

  if (sub === "workflow") {
    const name = args[2];
    if (!name) {
      console.error("Usage: wks harness workflow <name> --feature \"…\"");
      process.exit(1);
    }
    const feature = flag("feature", name === "jwt-auth" ? "JWT authentication" : "feature");
    const backend = flag("backend");
    const out = await runWithTsx([
      "run-workflow",
      name,
      feature,
      backend || "",
    ]);
    const result = JSON.parse(out);
    console.log(result.summary);
    console.log(`\nPlan: ${result.planPath}`);
    console.log(`Run:  harness/artifacts/${result.runId}/`);
    process.exit(result.ok ? 0 : 1);
  }

  console.error(`Unknown harness subcommand: ${sub}`);
  help();
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
