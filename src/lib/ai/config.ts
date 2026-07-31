/**
 * AI configuration for the workspace.
 *
 * Never write a `.env` file in this sandbox — the platform (or your deploy)
 * injects secrets. Configure via process env only.
 *
 * | Var | Purpose |
 * |-----|---------|
 * | XAI_API_KEY | xAI / Grok API key (required for live model) |
 * | XAI_MODEL | Model id (default: grok-4.5) |
 * | AI_BACKEND | deepagents (default) \| direct \| local |
 * | AI_RECURSION_LIMIT | Deep Agents graph step limit (default 40) |
 */

export type AiBackendMode = "deepagents" | "direct" | "local";

export function getAiConfig() {
  const apiKey = process.env.XAI_API_KEY?.trim() || "";
  const model = process.env.XAI_MODEL?.trim() || "grok-4.5";
  const rawBackend = (process.env.AI_BACKEND?.trim().toLowerCase() || "deepagents") as AiBackendMode;
  const backend: AiBackendMode =
    rawBackend === "direct" || rawBackend === "local" || rawBackend === "deepagents"
      ? rawBackend
      : "deepagents";

  const recursionLimit = Math.min(
    80,
    Math.max(8, Number(process.env.AI_RECURSION_LIMIT || 40) || 40),
  );

  const configured = Boolean(apiKey);
  // Effective runtime mode: without a key we always fall back to local heuristics
  const effective: AiBackendMode = !configured
    ? "local"
    : backend === "local"
      ? "local"
      : backend;

  return {
    apiKey,
    model,
    backend,
    effective,
    configured,
    recursionLimit,
    deepAgentsRoot: "deepagents-root",
    skillsPath: "/skills/",
  };
}

export const WORKSPACE_SKILLS = [
  "summarize-page",
  "edit-block",
  "action-items",
  "table-from-notes",
  "mermaid-diagram",
  "custom-page-task",
] as const;
