/**
 * Meta-harness types — vendor-neutral agent + workflow definitions.
 * Inspired by Omnigent / ai-engineering-harness patterns:
 * workflow logic lives here; CLIs/agents are pluggable backends.
 */

export type HarnessBackendId =
  | "local-deepagents"
  | "local-direct"
  | "shell"
  | "acp"
  | "claude-cli"
  | "codex-cli"
  | "cursor-cli"
  | "grok-build"
  | "opencode"
  | "hermes"
  | "pi"
  | "mock";

export interface AgentAuthConfig {
  type: "env" | "profile" | "none";
  env?: string;
  profile?: string;
}

export interface AgentExecutorConfig {
  harness: HarnessBackendId | string;
  model?: string;
  command?: string;
  args?: string[];
  auth?: AgentAuthConfig;
  cwd?: string;
  timeoutMs?: number;
}

export interface AgentToolRef {
  type: "mcp" | "function" | "agent" | "handoff";
  name: string;
  harness?: string;
  prompt?: string;
  mcpServerId?: string;
}

export interface AgentDefinition {
  name: string;
  description?: string;
  prompt: string;
  executor: AgentExecutorConfig;
  tools?: AgentToolRef[];
  policies?: {
    allowWrite?: boolean;
    allowNetwork?: boolean;
    requireApproval?: boolean;
    maxSteps?: number;
  };
  os_env?: {
    allowShell?: boolean;
    allowFiles?: string[];
  };
}

export type WorkflowPhase =
  | "plan"
  | "implement"
  | "review"
  | "validate"
  | "custom";

export interface WorkflowRole {
  id: string;
  role: "orchestrator" | "implementer" | "reviewer" | "validator" | "custom";
  phase: WorkflowPhase;
  agent: string;
  package?: string;
  readOnly?: boolean;
  parallel?: boolean;
}

export interface WorkflowDefinition {
  name: string;
  description?: string;
  feature?: string;
  phases: Array<{
    id: WorkflowPhase | string;
    title: string;
    parallel?: boolean;
    roles: WorkflowRole[];
  }>;
  artifacts: {
    planPath: string;
    runDir: string;
  };
  policies?: {
    crossVendorReview?: boolean;
    requireGreenTests?: boolean;
    planFileRequired?: boolean;
  };
}

export interface BackendDescriptor {
  id: string;
  label: string;
  kind: "builtin" | "cli" | "acp" | "mock";
  available: boolean;
  command?: string;
  notes?: string;
}

export interface HarnessRunEvent {
  ts: number;
  phase: string;
  roleId: string;
  level: "info" | "warn" | "error" | "result";
  message: string;
}

export interface HarnessRunResult {
  ok: boolean;
  runId: string;
  workflow?: string;
  agent?: string;
  backend: string;
  feature?: string;
  planPath?: string;
  events: HarnessRunEvent[];
  outputs: Record<string, string>;
  summary: string;
  durationMs: number;
}
