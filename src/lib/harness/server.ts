import { createServerFn } from "@tanstack/react-start";
import { getHarnessStatus, runAgentFile, runWorkflow } from "./runner";
import { listBackends } from "./backends";
import type { BackendDescriptor, HarnessRunResult } from "./types";

export type HarnessStatusDto = {
  backends: BackendDescriptor[];
  agents: string[];
  workflows: string[];
  harnessDir: string;
};

/** Flatten to plain JSON-safe DTO for TanStack server fns */
function toDto(r: HarnessRunResult): HarnessRunResult {
  return {
    ok: Boolean(r.ok),
    runId: String(r.runId),
    workflow: r.workflow ? String(r.workflow) : undefined,
    agent: r.agent ? String(r.agent) : undefined,
    backend: String(r.backend),
    feature: r.feature ? String(r.feature) : undefined,
    planPath: r.planPath ? String(r.planPath) : undefined,
    events: (r.events || []).map((e) => ({
      ts: Number(e.ts) || 0,
      phase: String(e.phase),
      roleId: String(e.roleId),
      level: e.level,
      message: String(e.message).slice(0, 500),
    })),
    outputs: Object.fromEntries(
      Object.entries(r.outputs || {}).map(([k, v]) => [k, String(v).slice(0, 8000)]),
    ),
    summary: String(r.summary || "").slice(0, 20000),
    durationMs: Number(r.durationMs) || 0,
  };
}

export const harnessStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<HarnessStatusDto> => {
    return getHarnessStatus();
  },
);

export const harnessListBackends = createServerFn({ method: "GET" }).handler(
  async (): Promise<BackendDescriptor[]> => {
    return listBackends();
  },
);

export const harnessRunAgent = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { agent?: string; message?: string; backend?: string };
    if (!d?.agent) throw new Error("agent required");
    return {
      agent: String(d.agent).slice(0, 120),
      message: String(d.message || "Hello").slice(0, 8000),
      backend: d.backend ? String(d.backend).slice(0, 64) : "",
    };
  })
  .handler(async ({ data }): Promise<HarnessRunResult> => {
    const r = await runAgentFile({
      agentPath: data.agent,
      message: data.message,
      backendOverride: data.backend || undefined,
    });
    return toDto(r);
  });

export const harnessRunWorkflow = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { workflow?: string; feature?: string; backend?: string };
    if (!d?.workflow) throw new Error("workflow required");
    return {
      workflow: String(d.workflow).slice(0, 120),
      feature: String(d.feature || "feature").slice(0, 200),
      backend: d.backend ? String(d.backend).slice(0, 64) : "",
    };
  })
  .handler(async ({ data }): Promise<HarnessRunResult> => {
    const r = await runWorkflow({
      workflowPath: data.workflow,
      feature: data.feature,
      backendOverride: data.backend || undefined,
    });
    return toDto(r);
  });
