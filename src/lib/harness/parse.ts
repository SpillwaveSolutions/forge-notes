import { load as yamlLoad, dump as yamlDump } from "js-yaml";
import type { AgentDefinition, WorkflowDefinition } from "./types";

export function parseAgentYaml(text: string): AgentDefinition {
  const doc = yamlLoad(text) as Record<string, unknown>;
  if (!doc || typeof doc !== "object") throw new Error("Invalid agent YAML");
  if (typeof doc.name !== "string" || !doc.name.trim()) {
    throw new Error("Agent YAML requires `name`");
  }
  if (typeof doc.prompt !== "string") {
    throw new Error("Agent YAML requires `prompt`");
  }
  const exec = (doc.executor ?? {}) as Record<string, unknown>;
  if (typeof exec.harness !== "string") {
    throw new Error("Agent YAML requires `executor.harness`");
  }

  return {
    name: doc.name.trim(),
    description: typeof doc.description === "string" ? doc.description : undefined,
    prompt: doc.prompt,
    executor: {
      harness: exec.harness as string,
      model: typeof exec.model === "string" ? exec.model : undefined,
      command: typeof exec.command === "string" ? exec.command : undefined,
      args: Array.isArray(exec.args) ? exec.args.map(String) : undefined,
      cwd: typeof exec.cwd === "string" ? exec.cwd : undefined,
      timeoutMs: typeof exec.timeoutMs === "number" ? exec.timeoutMs : undefined,
      auth: exec.auth as AgentDefinition["executor"]["auth"],
    },
    tools: Array.isArray(doc.tools) ? (doc.tools as AgentDefinition["tools"]) : undefined,
    policies: doc.policies as AgentDefinition["policies"],
    os_env: doc.os_env as AgentDefinition["os_env"],
  };
}

export function parseWorkflowYaml(text: string): WorkflowDefinition {
  const doc = yamlLoad(text) as Record<string, unknown>;
  if (!doc || typeof doc !== "object") throw new Error("Invalid workflow YAML");
  if (typeof doc.name !== "string") throw new Error("Workflow requires `name`");
  if (!Array.isArray(doc.phases)) throw new Error("Workflow requires `phases`");

  const artifacts = (doc.artifacts ?? {}) as Record<string, string>;
  return {
    name: doc.name,
    description: typeof doc.description === "string" ? doc.description : undefined,
    feature: typeof doc.feature === "string" ? doc.feature : undefined,
    phases: doc.phases as WorkflowDefinition["phases"],
    artifacts: {
      planPath: artifacts.planPath || "harness/plans/{feature}-plan.md",
      runDir: artifacts.runDir || "harness/artifacts/{runId}",
    },
    policies: doc.policies as WorkflowDefinition["policies"],
  };
}

export function dumpAgentYaml(agent: AgentDefinition): string {
  return yamlDump(agent, { lineWidth: 100, noRefs: true });
}

export function dumpWorkflowYaml(wf: WorkflowDefinition): string {
  return yamlDump(wf, { lineWidth: 100, noRefs: true });
}
