import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import type { AgentDefinition, BackendDescriptor, HarnessRunEvent } from "./types";

async function commandExists(cmd: string): Promise<boolean> {
  const bin = cmd.split(/\s+/)[0]!;
  if (bin.includes("/")) {
    try {
      await access(bin, constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }
  return new Promise((resolve) => {
    const child = spawn("which", [bin], { stdio: "ignore" });
    child.on("close", (code) => resolve(code === 0));
    child.on("error", () => resolve(false));
  });
}

export async function listBackends(): Promise<BackendDescriptor[]> {
  const candidates: Array<Omit<BackendDescriptor, "available"> & { check?: string }> = [
    {
      id: "local-deepagents",
      label: "Workspace Deep Agents (LangChain)",
      kind: "builtin",
      notes: "In-process via workspace AI settings / XAI_API_KEY",
    },
    {
      id: "local-direct",
      label: "Workspace direct chat",
      kind: "builtin",
      notes: "Single-shot model call without agent loop",
    },
    {
      id: "mock",
      label: "Mock (deterministic demo)",
      kind: "mock",
      notes: "No external deps — always available for dry-runs",
    },
    {
      id: "claude-cli",
      label: "Claude Code CLI",
      kind: "cli",
      command: "claude",
      check: "claude",
      notes: "Anthropic Claude Code",
    },
    {
      id: "codex-cli",
      label: "Codex CLI",
      kind: "cli",
      command: "codex",
      check: "codex",
      notes: "OpenAI Codex",
    },
    {
      id: "cursor-cli",
      label: "Cursor agent CLI",
      kind: "cli",
      command: "cursor-agent",
      check: "cursor-agent",
    },
    {
      id: "grok-build",
      label: "Grok Build (ACP)",
      kind: "acp",
      command: "grok agent --always-approve stdio",
      check: "grok",
      notes: "Register as acp:grok-build in Omnigent; auth via grok login",
    },
    {
      id: "opencode",
      label: "OpenCode",
      kind: "cli",
      command: "opencode",
      check: "opencode",
    },
    {
      id: "hermes",
      label: "Hermes",
      kind: "cli",
      command: "hermes",
      check: "hermes",
    },
    {
      id: "pi",
      label: "Pi",
      kind: "cli",
      command: "pi",
      check: "pi",
    },
    {
      id: "shell",
      label: "Generic shell command",
      kind: "cli",
      notes: "executor.command required in agent YAML",
    },
    {
      id: "acp",
      label: "Generic ACP agent",
      kind: "acp",
      notes: "executor.command must speak Agent Client Protocol on stdio",
    },
  ];

  const out: BackendDescriptor[] = [];
  for (const c of candidates) {
    let available = c.kind === "builtin" || c.kind === "mock";
    if (c.check) available = await commandExists(c.check);
    if (c.id === "shell" || c.id === "acp") available = true;
    out.push({
      id: c.id,
      label: c.label,
      kind: c.kind,
      available,
      command: c.command,
      notes: c.notes,
    });
  }
  return out;
}

export interface ExecuteAgentInput {
  agent: AgentDefinition;
  userMessage: string;
  context?: string;
  onEvent?: (e: Omit<HarnessRunEvent, "ts">) => void;
}

export interface ExecuteAgentOutput {
  text: string;
  backend: string;
  ok: boolean;
  error?: string;
}

function emit(
  onEvent: ExecuteAgentInput["onEvent"],
  partial: Omit<HarnessRunEvent, "ts">,
) {
  onEvent?.(partial);
}

export async function executeAgent(input: ExecuteAgentInput): Promise<ExecuteAgentOutput> {
  const harness = String(input.agent.executor.harness);
  const fullPrompt = [
    input.agent.prompt.trim(),
    input.context ? `\n\n## Context\n${input.context}` : "",
    `\n\n## Task\n${input.userMessage}`,
  ].join("");

  emit(input.onEvent, {
    phase: "execute",
    roleId: input.agent.name,
    level: "info",
    message: `Running via backend \`${harness}\``,
  });

  if (harness === "mock") {
    const text = mockRespond(input.agent.name, input.userMessage);
    emit(input.onEvent, {
      phase: "execute",
      roleId: input.agent.name,
      level: "result",
      message: text.slice(0, 200),
    });
    return { text, backend: "mock", ok: true };
  }

  if (harness === "local-deepagents" || harness === "local-direct") {
    try {
      const { runHarnessModel } = await import("./local-model");
      const text = await runHarnessModel({
        system: input.agent.prompt,
        user: `${input.context ? input.context + "\n\n" : ""}${input.userMessage}`,
        model: input.agent.executor.model,
        mode: harness === "local-direct" ? "direct" : "deepagents",
      });
      emit(input.onEvent, {
        phase: "execute",
        roleId: input.agent.name,
        level: "result",
        message: text.slice(0, 240),
      });
      return { text, backend: harness, ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      emit(input.onEvent, {
        phase: "execute",
        roleId: input.agent.name,
        level: "warn",
        message: `Live model unavailable (${message}); using mock fallback`,
      });
      const text = mockRespond(input.agent.name, input.userMessage);
      return { text, backend: "mock", ok: true, error: message };
    }
  }

  if (
    harness === "shell" ||
    harness === "acp" ||
    harness === "claude-cli" ||
    harness === "codex-cli" ||
    harness === "cursor-cli" ||
    harness === "grok-build" ||
    harness === "opencode" ||
    harness === "hermes" ||
    harness === "pi" ||
    harness.startsWith("acp:")
  ) {
    const cmd = resolveCliCommand(harness, input.agent);
    if (!cmd) {
      return {
        text: "",
        backend: harness,
        ok: false,
        error: `No command configured for harness ${harness}`,
      };
    }
    try {
      const text = await runShellAgent(cmd, fullPrompt, input.agent.executor.timeoutMs ?? 120_000);
      emit(input.onEvent, {
        phase: "execute",
        roleId: input.agent.name,
        level: "result",
        message: text.slice(0, 240),
      });
      return { text, backend: harness, ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      emit(input.onEvent, {
        phase: "execute",
        roleId: input.agent.name,
        level: "error",
        message,
      });
      const text = mockRespond(input.agent.name, input.userMessage);
      return {
        text: `${text}\n\n_Note: CLI backend \`${harness}\` failed: ${message}_`,
        backend: harness,
        ok: false,
        error: message,
      };
    }
  }

  return {
    text: "",
    backend: harness,
    ok: false,
    error: `Unknown harness: ${harness}`,
  };
}

function resolveCliCommand(
  harness: string,
  agent: AgentDefinition,
): { bin: string; args: string[] } | null {
  if (agent.executor.command) {
    const parts = agent.executor.command.split(/\s+/).filter(Boolean);
    return {
      bin: parts[0]!,
      args: [...parts.slice(1), ...(agent.executor.args ?? [])],
    };
  }
  const map: Record<string, { bin: string; args: string[] }> = {
    "claude-cli": { bin: "claude", args: ["-p"] },
    "codex-cli": { bin: "codex", args: ["exec"] },
    "cursor-cli": { bin: "cursor-agent", args: [] },
    "grok-build": { bin: "grok", args: ["agent", "--always-approve", "stdio"] },
    opencode: { bin: "opencode", args: ["run"] },
    hermes: { bin: "hermes", args: [] },
    pi: { bin: "pi", args: [] },
  };
  if (harness.startsWith("acp:")) {
    return map["grok-build"] ?? null;
  }
  return map[harness] ?? null;
}

function runShellAgent(
  cmd: { bin: string; args: string[] },
  prompt: string,
  timeoutMs: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd.bin, cmd.args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`Timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on("data", (d) => {
      stdout += String(d);
    });
    child.stderr.on("data", (d) => {
      stderr += String(d);
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0 && !stdout.trim()) {
        reject(new Error(stderr.trim() || `Exit ${code}`));
        return;
      }
      resolve(stdout.trim() || stderr.trim());
    });
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

function mockRespond(agentName: string, task: string): string {
  const short = task.slice(0, 160).replace(/\n/g, " ");
  const name = agentName.toLowerCase();

  // Role-name first so reviewers/validators don't match "plan" in the task text
  if (name.includes("review")) {
    return [
      `# Review (read-only)`,
      ``,
      `## Blocking`,
      `- None identified in mock mode`,
      ``,
      `## Non-blocking`,
      `- Add edge-case tests for error paths`,
      `- Document public API surface`,
      ``,
      `_Reviewer agent: ${agentName}_`,
      `_Scope: ${short}_`,
    ].join("\n");
  }
  if (name.includes("validat")) {
    return [
      `# Validation`,
      ``,
      `- Tests: simulated green (mock backend)`,
      `- Blocking review items: none or addressed`,
      `- Remaining risks: mock run — re-run with a live CLI for real signal`,
      ``,
      `## Summary`,
      `Feature task completed under meta-harness workflow.`,
      ``,
      `_Validator: ${agentName}_`,
    ].join("\n");
  }
  if (name.includes("orchestr") || name.includes("plan") || /create a plan|decompos/i.test(task)) {
    return [
      `# Plan`,
      ``,
      `## Package A — Core utilities`,
      `- Acceptance: pure functions covered by unit tests`,
      ``,
      `## Package B — API / integration surface`,
      `- Acceptance: endpoints return expected contracts`,
      ``,
      `## Package C — Tests & docs`,
      `- Acceptance: suite green; README updated`,
      ``,
      `_Generated by mock harness for: ${short}_`,
    ].join("\n");
  }
  if (name.includes("hello") || /\?/.test(task)) {
    return [
      `A **meta-harness** is a thin compatibility layer above coding agents.`,
      ``,
      `You define workflow once (policies, plan → implement → review → validate, durable artifacts)`,
      `and treat Claude Code, Codex, Grok Build, etc. as pluggable backends via \`executor.harness\`.`,
      ``,
      `The lock-in you avoid is not the model — it is the automation wired to one vendor CLI.`,
      ``,
      `_Mock agent: ${agentName}_`,
    ].join("\n");
  }
  return [
    `# Implementation notes (${agentName})`,
    ``,
    `Scope: ${short}`,
    ``,
    `- Stayed within package boundary`,
    `- Left local tests green (simulated)`,
    `- Ready for independent review`,
  ].join("\n");
}
