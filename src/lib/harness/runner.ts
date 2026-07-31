import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseAgentYaml, parseWorkflowYaml } from "./parse";
import { executeAgent, listBackends } from "./backends";
import type {
  AgentDefinition,
  HarnessRunEvent,
  HarnessRunResult,
  WorkflowDefinition,
} from "./types";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

const ROOT = process.cwd();
const HARNESS_DIR = path.join(ROOT, "harness");

function slug(s: string) {
  return (
    (s || "feature")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "feature"
  );
}

function resolveTemplate(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function listAgentFiles(): Promise<string[]> {
  const dir = path.join(HARNESS_DIR, "agents");
  try {
    return (await readdir(dir)).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml")).sort();
  } catch {
    return [];
  }
}

export async function listWorkflowFiles(): Promise<string[]> {
  const dir = path.join(HARNESS_DIR, "workflows");
  try {
    return (await readdir(dir)).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml")).sort();
  } catch {
    return [];
  }
}

export async function loadAgentFile(relOrName: string): Promise<AgentDefinition> {
  const candidates = [
    path.resolve(ROOT, relOrName),
    path.join(HARNESS_DIR, "agents", relOrName),
    path.join(HARNESS_DIR, "agents", `${relOrName}.yaml`),
    path.join(HARNESS_DIR, "agents", `${relOrName}.yml`),
  ];
  for (const p of candidates) {
    try {
      const text = await readFile(p, "utf8");
      return parseAgentYaml(text);
      // eslint-disable-next-line no-empty
    } catch {}
  }
  throw new Error(`Agent not found: ${relOrName}`);
}

export async function loadWorkflowFile(relOrName: string): Promise<WorkflowDefinition> {
  const candidates = [
    path.resolve(ROOT, relOrName),
    path.join(HARNESS_DIR, "workflows", relOrName),
    path.join(HARNESS_DIR, "workflows", `${relOrName}.yaml`),
  ];
  for (const p of candidates) {
    try {
      const text = await readFile(p, "utf8");
      return parseWorkflowYaml(text);
      // eslint-disable-next-line no-empty
    } catch {}
  }
  throw new Error(`Workflow not found: ${relOrName}`);
}

export async function runAgentFile(opts: {
  agentPath: string;
  message: string;
  backendOverride?: string;
}): Promise<HarnessRunResult> {
  const started = Date.now();
  const runId = uid("run");
  const events: HarnessRunEvent[] = [];
  const agent = await loadAgentFile(opts.agentPath);
  if (opts.backendOverride) {
    agent.executor.harness = opts.backendOverride;
  }

  const result = await executeAgent({
    agent,
    userMessage: opts.message,
    onEvent: (e) => events.push({ ...e, ts: Date.now() }),
  });

  const runDir = path.join(HARNESS_DIR, "artifacts", runId);
  await mkdir(runDir, { recursive: true });
  await writeFile(path.join(runDir, "output.md"), result.text, "utf8");
  await writeFile(
    path.join(runDir, "meta.json"),
    JSON.stringify({ agent: agent.name, backend: result.backend, ok: result.ok }, null, 2),
    "utf8",
  );

  return {
    ok: result.ok,
    runId,
    agent: agent.name,
    backend: result.backend,
    events,
    outputs: { output: result.text },
    summary: result.ok
      ? `Agent \`${agent.name}\` finished via \`${result.backend}\``
      : `Agent failed: ${result.error}`,
    durationMs: Date.now() - started,
  };
}

export async function runWorkflow(opts: {
  workflowPath: string;
  feature: string;
  backendOverride?: string;
}): Promise<HarnessRunResult> {
  const started = Date.now();
  const runId = uid("run");
  const feature = opts.feature.trim() || "feature";
  const featureSlug = slug(feature);
  const events: HarnessRunEvent[] = [];
  const outputs: Record<string, string> = {};
  const wf = await loadWorkflowFile(opts.workflowPath);

  const vars = { feature: featureSlug, runId, FEATURE: feature };
  const planPath = path.resolve(ROOT, resolveTemplate(wf.artifacts.planPath, vars));
  const runDir = path.resolve(ROOT, resolveTemplate(wf.artifacts.runDir, vars));
  await mkdir(runDir, { recursive: true });
  await mkdir(path.dirname(planPath), { recursive: true });

  const push = (e: Omit<HarnessRunEvent, "ts">) => {
    events.push({ ...e, ts: Date.now() });
  };

  push({
    phase: "start",
    roleId: "orchestrator",
    level: "info",
    message: `Workflow \`${wf.name}\` · feature: ${feature}`,
  });

  let planText = "";
  let lastBackend = "mock";

  for (const phase of wf.phases) {
    push({
      phase: String(phase.id),
      roleId: "orchestrator",
      level: "info",
      message: `Phase: ${phase.title}${phase.parallel ? " (parallel)" : ""}`,
    });

    const roles = phase.roles;
    const runRole = async (role: (typeof roles)[0]) => {
      let agent: AgentDefinition;
      try {
        agent = await loadAgentFile(role.agent);
      } catch {
        agent = {
          name: role.id,
          prompt: defaultPromptForRole(role.role, role.readOnly),
          executor: {
            harness: opts.backendOverride || "mock",
          },
        };
      }
      if (opts.backendOverride) {
        agent.executor.harness = opts.backendOverride;
      }
      if (wf.policies?.crossVendorReview && role.role === "reviewer" && !opts.backendOverride) {
        agent.executor.harness = pickReviewBackend(String(agent.executor.harness));
      }

      const userMessage = buildRoleMessage({
        role,
        feature,
        phase: phase.id,
        planPath,
      });

      const res = await executeAgent({
        agent,
        userMessage,
        context: planText ? `## Existing plan\n${planText}` : undefined,
        onEvent: (e) =>
          push({
            ...e,
            phase: String(phase.id),
            roleId: role.id,
          }),
      });
      lastBackend = res.backend;
      outputs[role.id] = res.text;

      const outFile = path.join(runDir, `${phase.id}-${role.id}.md`);
      await writeFile(outFile, res.text, "utf8");

      if (role.role === "orchestrator" || phase.id === "plan" || role.id.includes("plan")) {
        planText = res.text;
        await writeFile(planPath, res.text, "utf8");
        push({
          phase: String(phase.id),
          roleId: role.id,
          level: "info",
          message: `Wrote plan → ${path.relative(ROOT, planPath)}`,
        });
      }

      return res;
    };

    if (phase.parallel) {
      await Promise.all(roles.map((r) => runRole(r)));
    } else {
      for (const r of roles) {
        await runRole(r);
      }
    }
  }

  const summary = [
    `# Harness run ${runId}`,
    ``,
    `- Workflow: ${wf.name}`,
    `- Feature: ${feature}`,
    `- Plan: ${path.relative(ROOT, planPath)}`,
    `- Backend (last): ${lastBackend}`,
    `- Duration: ${Date.now() - started}ms`,
    ``,
    `## Artifacts`,
    ...Object.keys(outputs).map((k) => `- ${k}`),
    ``,
    `## Events`,
    ...events.map(
      (e) =>
        `- [${e.level}] ${e.phase}/${e.roleId}: ${e.message.replace(/\n/g, " ").slice(0, 160)}`,
    ),
  ].join("\n");

  await writeFile(path.join(runDir, "SUMMARY.md"), summary, "utf8");
  await writeFile(path.join(runDir, "events.json"), JSON.stringify(events, null, 2), "utf8");

  return {
    ok: true,
    runId,
    workflow: wf.name,
    backend: lastBackend,
    feature,
    planPath: path.relative(ROOT, planPath),
    events,
    outputs,
    summary,
    durationMs: Date.now() - started,
  };
}

function defaultPromptForRole(role: string, readOnly?: boolean): string {
  if (role === "reviewer" || readOnly) {
    return "You are an independent reviewer. Judge only against the acceptance contract. Do not edit code. Report blocking vs non-blocking issues.";
  }
  if (role === "orchestrator") {
    return "You are the orchestrator. Decompose work into independent packages with clear acceptance criteria. Never write product code yourself.";
  }
  if (role === "validator") {
    return "You validate that blocking review items are addressed and tests are green. Produce a final summary of changes and remaining risks.";
  }
  return "You are an implementer. Stay within your package scope. Leave tests green for your scope.";
}

function buildRoleMessage(opts: {
  role: { id: string; role: string; package?: string; readOnly?: boolean };
  feature: string;
  phase: string;
  planPath: string;
}): string {
  if (opts.role.role === "orchestrator" || opts.phase === "plan") {
    return [
      `Create a plan for: ${opts.feature}`,
      `Break into 3 independent packages with clear acceptance criteria.`,
      `Write the plan as markdown (this will be saved to ${opts.planPath}).`,
    ].join("\n");
  }
  if (opts.role.role === "implementer") {
    return [
      `Implement package for feature: ${opts.feature}`,
      opts.role.package ? `Package focus: ${opts.role.package}` : `Role id: ${opts.role.id}`,
      `Stay in scope. Leave tests green for this package.`,
      `Summarize files you would change and tests you would add.`,
    ].join("\n");
  }
  if (opts.role.role === "reviewer" || opts.role.readOnly) {
    return [
      `Review the implementation plan/output for: ${opts.feature}`,
      `Focus: ${opts.role.package || opts.role.id}`,
      `Read-only: do not edit code.`,
      `Report blocking vs non-blocking issues.`,
    ].join("\n");
  }
  if (opts.role.role === "validator") {
    return [
      `Validate feature: ${opts.feature}`,
      `Synthesize reviews, apply only blocking fixes (describe them),`,
      `run the full test suite (or describe commands), and produce a final summary.`,
    ].join("\n");
  }
  return `Work on feature: ${opts.feature} (${opts.role.id})`;
}

function pickReviewBackend(implHarness: string): string {
  const alt = ["mock", "local-direct", "local-deepagents"];
  return alt.find((h) => h !== implHarness) || "mock";
}

export async function getHarnessStatus() {
  const backends = await listBackends();
  const agents = await listAgentFiles();
  const workflows = await listWorkflowFiles();
  return {
    backends,
    agents,
    workflows,
    harnessDir: "harness/",
  };
}
