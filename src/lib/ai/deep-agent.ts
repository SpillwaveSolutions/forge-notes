import path from "node:path";
import { z } from "zod";
import { createDeepAgent, FilesystemBackend } from "deepagents";
import { toolStrategy } from "langchain";
import type { AiAction, AiGeneratedBlock, AiRequest, AiResponse } from "@/lib/ai/types";
import { getAiConfig } from "@/lib/ai/config";
import type { UserAiSettings } from "@/lib/ai/settings-types";
import { resolveChatModel } from "@/lib/ai/resolve-model";
import { loadMcpTools } from "@/lib/ai/mcp";

const blockTypeEnum = z.enum([
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "bullet",
  "numbered",
  "todo",
  "quote",
  "callout",
  "code",
  "mermaid",
]);

const agentResponseSchema = z.object({
  text: z
    .string()
    .default("")
    .describe("Plain replacement text for single-block edits; empty when only inserting blocks"),
  blocks: z
    .array(
      z.object({
        type: blockTypeEnum,
        content: z.string(),
      }),
    )
    .optional()
    .describe("Blocks to insert under the AI block"),
});

type AgentStructured = z.infer<typeof agentResponseSchema>;

function skillForAction(action: AiAction): string {
  switch (action) {
    case "summarize":
      return "summarize-page";
    case "edit_block":
      return "edit-block";
    case "action_items":
      return "action-items";
    case "table":
      return "table-from-notes";
    case "mermaid":
      return "mermaid-diagram";
    case "outline":
      return "custom-page-task";
    case "custom":
    default:
      return "custom-page-task";
  }
}

function buildUserMessage(req: AiRequest, settings?: UserAiSettings | null): string {
  const skill = skillForAction(req.action);
  const skillAllowed =
    !settings?.enabledSkills?.length || settings.enabledSkills.includes(skill);
  const parts = [
    skillAllowed
      ? `Load and follow the skill: ${skill}`
      : `Skill ${skill} is disabled — still complete the action using general workspace rules.`,
    `Action: ${req.action}`,
  ];
  if (req.pageTitle) parts.push(`Page title: ${req.pageTitle}`);
  if (req.pageText) parts.push(`Page content:\n${req.pageText}`);
  if (req.blockText) {
    parts.push(`Target block type: ${req.blockType ?? "paragraph"}`);
    parts.push(`Target block text:\n${req.blockText}`);
  }
  if (req.instruction) parts.push(`Instruction:\n${req.instruction}`);
  if (req.action === "outline") {
    parts.push("Produce a hierarchical outline using heading2 + bullet blocks.");
  }
  parts.push(
    "Return structured output with `text` and optional `blocks` per the schema.",
  );
  return parts.join("\n\n");
}

function extractStructured(result: unknown): AgentStructured | null {
  if (!result || typeof result !== "object") return null;
  const r = result as Record<string, unknown>;

  for (const key of ["structuredResponse", "structured_response"] as const) {
    if (r[key] && typeof r[key] === "object") {
      const parsed = agentResponseSchema.safeParse(r[key]);
      if (parsed.success) return parsed.data;
    }
  }

  const messages = r.messages;
  if (Array.isArray(messages) && messages.length > 0) {
    const last = messages[messages.length - 1] as {
      content?: unknown;
      kwargs?: { content?: unknown };
    };
    const content = last?.content ?? last?.kwargs?.content;
    let text = "";
    if (typeof content === "string") text = content;
    else if (Array.isArray(content)) {
      text = content
        .map((c) =>
          typeof c === "string"
            ? c
            : c && typeof c === "object" && "text" in c
              ? String((c as { text: unknown }).text)
              : "",
        )
        .join("\n");
    }
    if (text) {
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      const candidate = (fenced?.[1] ?? text).trim();
      try {
        const parsed = agentResponseSchema.safeParse(JSON.parse(candidate));
        if (parsed.success) return parsed.data;
      } catch {
        return { text: candidate, blocks: undefined };
      }
    }
  }
  return null;
}

function fingerprint(settings: UserAiSettings | null | undefined, modelName: string, provider: string) {
  return JSON.stringify({
    provider,
    modelName,
    baseUrl: settings?.baseUrl ?? "",
    recursionLimit: settings?.recursionLimit,
    temperature: settings?.temperature,
    skills: settings?.enabledSkills ?? [],
    mcp: (settings?.mcpServers ?? [])
      .filter((m) => m.enabled)
      .map((m) => ({
        n: m.name,
        t: m.transport,
        u: m.url,
        c: m.command,
        a: m.argsText,
      })),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: { key: string; agent: any } | null = null;

async function getAgent(settings?: UserAiSettings | null) {
  const { model, provider, modelName } = await resolveChatModel(settings);
  const key = fingerprint(settings, modelName, provider);
  if (cached?.key === key) return { agent: cached.agent, provider, modelName };

  const cfg = getAiConfig();
  const rootDir = path.join(process.cwd(), cfg.deepAgentsRoot);
  const { tools: mcpTools, errors: mcpErrors } = settings
    ? await loadMcpTools(settings)
    : { tools: [], errors: [] as string[] };

  if (mcpErrors.length) {
    console.warn("[ai] MCP load warnings:", mcpErrors.join("; "));
  }

  const agent = createDeepAgent({
    model,
    name: "workspace-deep-agent",
    systemPrompt:
      "You are the workspace Deep Agent (LangChain). Use skills for specialized page tasks. " +
      "You may call MCP tools when helpful for research or external context. " +
      "Prefer structured output. Be concise.",
    backend: new FilesystemBackend({
      rootDir,
      virtualMode: true,
    }),
    skills: [cfg.skillsPath],
    memory: ["/AGENTS.md"],
    tools: mcpTools,
    responseFormat: toolStrategy(agentResponseSchema),
    permissions: [
      { operations: ["read"], paths: ["/skills/**", "/AGENTS.md"] },
      { operations: ["write"], paths: ["/**"], mode: "deny" },
    ],
  });

  cached = { key, agent };
  return { agent, provider, modelName };
}

export async function runDeepAgent(
  req: AiRequest,
  settings?: UserAiSettings | null,
): Promise<AiResponse> {
  const { agent, provider, modelName } = await getAgent(settings);
  const userMessage = buildUserMessage(req, settings);
  const recursionLimit = Math.min(
    80,
    Math.max(8, settings?.recursionLimit || getAiConfig().recursionLimit || 40),
  );

  const result = await agent.invoke(
    {
      messages: [{ role: "user", content: userMessage }],
    },
    { recursionLimit },
  );

  const structured = extractStructured(result);
  if (!structured) {
    throw new Error("Deep Agent returned no structured output");
  }

  const blocks: AiGeneratedBlock[] | undefined = structured.blocks?.map((b) => ({
    type: b.type,
    content: b.content,
  }));

  return {
    text: structured.text ?? "",
    blocks,
    provider: "deepagents",
    model: `${provider}:${modelName}`,
  };
}

/** Lightweight connectivity check */
export async function probeDeepAgent(settings?: UserAiSettings | null): Promise<{
  ok: boolean;
  message: string;
  model?: string;
  mcpTools?: string[];
}> {
  try {
    const { model, provider, modelName } = await resolveChatModel(settings);
    const res = await model.invoke([
      {
        role: "user",
        content: 'Reply with exactly: {"ok":true}',
      },
    ]);
    const content =
      typeof res.content === "string"
        ? res.content
        : Array.isArray(res.content)
          ? res.content.map((c) => (typeof c === "string" ? c : "")).join("")
          : String(res.content ?? "");

    let mcpTools: string[] = [];
    if (settings) {
      const loaded = await loadMcpTools(settings);
      mcpTools = loaded.toolNames;
    }

    return {
      ok: true,
      message: `Connected to ${provider} · ${modelName}`,
      model: `${provider}:${modelName}`,
      mcpTools,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "NO_KEY") {
      return { ok: false, message: "Missing API key for this provider" };
    }
    if (message === "BASE_URL_REQUIRED") {
      return { ok: false, message: "Base URL is required for this provider" };
    }
    return { ok: false, message };
  }
}
