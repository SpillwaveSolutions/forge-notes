import { createServerFn } from "@tanstack/react-start";
import type { BlockType } from "@/lib/types";
import type { AiAction, AiGeneratedBlock, AiRequest, AiResponse } from "@/lib/ai/types";
import { getAiConfig, WORKSPACE_SKILLS } from "@/lib/ai/config";
import type { McpServerConfig, UserAiSettings } from "@/lib/ai/settings-types";
import { publicAiSettings } from "@/lib/ai/settings-types";
import { hasLiveCredentials, resolveChatModel } from "@/lib/ai/resolve-model";

export type { AiAction, AiGeneratedBlock, AiRequest, AiResponse };

export interface AiRunInput extends AiRequest {
  clientSettings?: UserAiSettings | null;
}

function validateMcpServer(m: Partial<McpServerConfig>): McpServerConfig {
  return {
    id: String(m.id || "mcp").slice(0, 64),
    name: String(m.name || "mcp").slice(0, 80),
    enabled: m.enabled !== false,
    transport:
      m.transport === "sse" || m.transport === "stdio" || m.transport === "http"
        ? m.transport
        : "http",
    url: typeof m.url === "string" ? m.url.slice(0, 500) : "",
    authToken: typeof m.authToken === "string" ? m.authToken.slice(0, 500) : "",
    headersText: typeof m.headersText === "string" ? m.headersText.slice(0, 2000) : "",
    command: typeof m.command === "string" ? m.command.slice(0, 200) : "",
    argsText: typeof m.argsText === "string" ? m.argsText.slice(0, 1000) : "",
    envText: typeof m.envText === "string" ? m.envText.slice(0, 2000) : "",
  };
}

function validateSettings(input: unknown): UserAiSettings | null {
  if (!input || typeof input !== "object") return null;
  const s = input as UserAiSettings;
  return {
    setupComplete: Boolean(s.setupComplete),
    enabled: s.enabled !== false,
    backend:
      s.backend === "direct" ||
      s.backend === "local" ||
      s.backend === "deepagents" ||
      s.backend === "claude-cli" ||
      s.backend === "codex-cli" ||
      s.backend === "grok-cli"
        ? s.backend
        : "deepagents",
    preferStreaming: s.preferStreaming !== false,
    provider:
      s.provider === "anthropic" ||
      s.provider === "openai" ||
      s.provider === "ollama" ||
      s.provider === "openai_compatible" ||
      s.provider === "xai"
        ? s.provider
        : "xai",
    model: typeof s.model === "string" ? s.model.slice(0, 120) : "grok-4.5",
    apiKey: typeof s.apiKey === "string" ? s.apiKey.slice(0, 500) : "",
    baseUrl: typeof s.baseUrl === "string" ? s.baseUrl.slice(0, 500) : "",
    temperature: Math.min(1.5, Math.max(0, Number(s.temperature) || 0.35)),
    recursionLimit: Math.min(80, Math.max(8, Number(s.recursionLimit) || 40)),
    mcpServers: Array.isArray(s.mcpServers)
      ? s.mcpServers.slice(0, 20).map((m) => validateMcpServer(m))
      : [],
    enabledSkills: Array.isArray(s.enabledSkills)
      ? s.enabledSkills.map(String).slice(0, 50)
      : [...WORKSPACE_SKILLS],
  };
}

function validateRequest(input: unknown): AiRunInput {
  const data = input as AiRunInput;
  if (!data || typeof data !== "object") throw new Error("Invalid AI request");
  const action = data.action;
  const allowed: AiAction[] = [
    "edit_block",
    "summarize",
    "action_items",
    "table",
    "outline",
    "mermaid",
    "custom",
  ];
  if (!allowed.includes(action)) throw new Error("Invalid AI action");
  return {
    action,
    instruction: typeof data.instruction === "string" ? data.instruction.slice(0, 4000) : "",
    blockText: typeof data.blockText === "string" ? data.blockText.slice(0, 8000) : "",
    blockType: data.blockType,
    pageTitle: typeof data.pageTitle === "string" ? data.pageTitle.slice(0, 500) : "",
    pageText: typeof data.pageText === "string" ? data.pageText.slice(0, 20000) : "",
    clientSettings: validateSettings(data.clientSettings),
  };
}

function buildSystemPrompt(action: AiAction): string {
  const base =
    "You help edit a Notion-style notes workspace. Be concise, high-signal, and practical. Never use emoji unless the user asks. Return only the content requested — no preamble.";
  switch (action) {
    case "edit_block":
      return `${base} Rewrite the given block text per the instruction. Return plain text only (no quotes around the whole answer).`;
    case "summarize":
      return `${base} Summarize the page. Return JSON: {"blocks":[{"type":"heading2","content":"..."},{"type":"paragraph","content":"..."},{"type":"bullet","content":"..."}]} using types paragraph|heading1|heading2|heading3|bullet|numbered|todo|quote|callout|code|mermaid.`;
    case "action_items":
      return `${base} Extract action items as todos. Return JSON: {"blocks":[{"type":"heading2","content":"Action items"},{"type":"todo","content":"..."}]} only.`;
    case "table":
      return `${base} Create a markdown table from the page. Return JSON: {"blocks":[{"type":"heading2","content":"..."},{"type":"code","content":"| Col | ... |\\n|---|---|\\n| ... |"}]} — put the table in a code block.`;
    case "outline":
      return `${base} Create a hierarchical outline. Return JSON: {"blocks":[{"type":"heading2","content":"Outline"},{"type":"bullet","content":"..."},{"type":"bullet","content":"..."}]} .`;
    case "mermaid":
      return `${base} Create a Mermaid diagram for the page. Return JSON: {"blocks":[{"type":"heading2","content":"Diagram"},{"type":"mermaid","content":"flowchart TD\\n  A-->B"}]} . Valid mermaid only in content.`;
    case "custom":
      return `${base} Follow the user instruction using the page context. Prefer JSON {"blocks":[...]} when creating multiple blocks; otherwise plain text in {"text":"..."}. Allowed block types: paragraph,heading1,heading2,heading3,bullet,numbered,todo,quote,callout,code,mermaid.`;
    default:
      return base;
  }
}

function buildUserPrompt(req: AiRequest): string {
  const parts: string[] = [];
  if (req.pageTitle) parts.push(`Page title: ${req.pageTitle}`);
  if (req.pageText) parts.push(`Page content:\n${req.pageText}`);
  if (req.blockText) parts.push(`Block (${req.blockType ?? "text"}):\n${req.blockText}`);
  if (req.instruction) parts.push(`Instruction:\n${req.instruction}`);
  if (req.action === "edit_block" && !req.instruction) {
    parts.push("Instruction: Improve clarity and fix grammar while preserving meaning.");
  }
  return parts.join("\n\n") || "Empty page.";
}

async function callDirect(
  settings: UserAiSettings | null,
  system: string,
  user: string,
): Promise<{ text: string; model: string; provider: string }> {
  const { model, provider, modelName } = await resolveChatModel(settings);
  const res = await model.invoke([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);
  const text =
    typeof res.content === "string"
      ? res.content.trim()
      : Array.isArray(res.content)
        ? res.content
            .map((c) => (typeof c === "string" ? c : (c as { text?: string }).text ?? ""))
            .join("")
            .trim()
        : String(res.content ?? "").trim();
  if (!text) throw new Error("Empty model response");
  return { text, model: modelName, provider };
}

function parseModelPayload(raw: string, action: AiAction): AiResponse {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? raw).trim();
  try {
    const parsed = JSON.parse(candidate) as {
      text?: string;
      blocks?: AiGeneratedBlock[];
    };
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return {
        text: parsed.text ?? "",
        blocks: parsed.blocks
          .filter((b) => b && typeof b.content === "string")
          .map((b) => ({
            type: (b.type as BlockType) || "paragraph",
            content: String(b.content),
          })),
        provider: "xai",
      };
    }
    if (typeof parsed.text === "string") {
      return { text: parsed.text, provider: "xai" };
    }
  } catch {
    // plain text
  }

  if (action === "edit_block" || action === "custom") {
    return { text: raw.replace(/^["']|["']$/g, "").trim(), provider: "xai" };
  }

  return {
    text: raw,
    blocks: [{ type: "paragraph", content: raw }],
    provider: "xai",
  };
}

function localAi(req: AiRequest): AiResponse {
  const page = (req.pageText || "").trim();
  const title = req.pageTitle || "Untitled";
  const lines = page
    .split("\n")
    .map((l) =>
      l
        .replace(/^#+\s*/, "")
        .replace(/^[-*•]\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .trim(),
    )
    .filter(Boolean);
  const unique = [...new Set(lines)].slice(0, 24);

  if (req.action === "edit_block") {
    let text = (req.blockText || "").trim();
    const instruction = (req.instruction || "").toLowerCase();
    if (!text) text = "Add a clear note here.";
    if (instruction.includes("short") || instruction.includes("concise")) {
      text = text.split(/[.!?]/).slice(0, 2).join(". ").trim();
      if (text && !/[.!?]$/.test(text)) text += ".";
    } else if (instruction.includes("long") || instruction.includes("expand")) {
      text = `${text} In practice, this means spelling out the goal, the constraints, and the next concrete step so anyone can pick it up cold.`;
    } else if (instruction.includes("professional") || instruction.includes("formal")) {
      text = text.replace(/\b(gonna|wanna|kinda|gotta)\b/gi, (m) => {
        const map: Record<string, string> = {
          gonna: "going to",
          wanna: "want to",
          kinda: "somewhat",
          gotta: "need to",
        };
        return map[m.toLowerCase()] ?? m;
      });
      text = text.charAt(0).toUpperCase() + text.slice(1);
    } else if (instruction.includes("fix") || instruction.includes("grammar")) {
      text = text
        .replace(/\s+/g, " ")
        .replace(/\si\s/g, " I ")
        .replace(/(^\w)/, (c) => c.toUpperCase());
      if (text && !/[.!?]$/.test(text)) text += ".";
    } else if (instruction) {
      text = `${text}\n\n(${instruction.replace(/\.$/, "")} — local demo. Open AI setup to connect Grok, Claude, Ollama, etc.)`;
    } else {
      text = text.replace(/\s+/g, " ").trim();
      if (text && !/[.!?]$/.test(text)) text += ".";
    }
    return { text, provider: "local" };
  }

  if (req.action === "summarize") {
    const bullets = unique.slice(0, 5);
    return {
      text: "",
      provider: "local",
      blocks: [
        { type: "heading2", content: `Summary — ${title}` },
        {
          type: "paragraph",
          content:
            bullets.length > 0
              ? `This page covers ${bullets.length} main points: ${bullets
                  .slice(0, 3)
                  .map((b) => b.replace(/\.$/, ""))
                  .join("; ")}.`
              : "This page is still light — add notes, then run AI summary again.",
        },
        ...bullets.map((b) => ({ type: "bullet" as const, content: b.slice(0, 200) })),
      ],
    };
  }

  if (req.action === "action_items") {
    const todos = unique
      .filter(
        (l) =>
          /todo|need|should|must|fix|add|ship|write|create|update|check/i.test(l) || l.length < 80,
      )
      .slice(0, 6);
    const items = todos.length ? todos : unique.slice(0, 4);
    return {
      text: "",
      provider: "local",
      blocks: [
        { type: "heading2", content: "Action items" },
        ...(items.length
          ? items.map((c) => ({ type: "todo" as const, content: c.slice(0, 160) }))
          : [{ type: "todo" as const, content: "Capture next steps on this page" }]),
      ],
    };
  }

  if (req.action === "table") {
    const rows = unique.slice(0, 6);
    const table = [
      "| Topic | Note |",
      "| --- | --- |",
      ...rows.map((r, i) => `| ${i + 1}. ${r.slice(0, 40).replace(/\|/g, "/")} | From page |`),
    ].join("\n");
    return {
      text: "",
      provider: "local",
      blocks: [
        { type: "heading2", content: "Table" },
        { type: "code", content: table },
      ],
    };
  }

  if (req.action === "outline") {
    return {
      text: "",
      provider: "local",
      blocks: [
        { type: "heading2", content: "Outline" },
        { type: "bullet", content: title },
        ...unique.slice(0, 8).map((c) => ({ type: "bullet" as const, content: c.slice(0, 120) })),
      ],
    };
  }

  if (req.action === "mermaid") {
    const nodes = unique.slice(0, 5).map((l, i) => {
      const id = String.fromCharCode(65 + i);
      const label = l.slice(0, 28).replace(/"/g, "'");
      return { id, label };
    });
    const linesOut =
      nodes.length >= 2
        ? [
            "flowchart TD",
            ...nodes.map((n) => `  ${n.id}["${n.label}"]`),
            ...nodes.slice(0, -1).map((n, i) => `  ${n.id} --> ${nodes[i + 1]!.id}`),
          ]
        : [
            "flowchart TD",
            `  A["${title.slice(0, 28)}"]`,
            '  B["Add more notes"]',
            "  A --> B",
          ];
    return {
      text: "",
      provider: "local",
      blocks: [
        { type: "heading2", content: "Diagram" },
        { type: "mermaid", content: linesOut.join("\n") },
      ],
    };
  }

  const instruction = (req.instruction || "Help with this page").trim();
  return {
    text: "",
    provider: "local",
    blocks: [
      { type: "heading2", content: "AI response" },
      { type: "paragraph", content: `Request: ${instruction}` },
      {
        type: "callout",
        content:
          "Local demo mode. Open Settings → Configure AI to connect Grok, Claude, OpenAI, Ollama, and MCP servers.",
      },
      ...unique.slice(0, 4).map((c) => ({ type: "bullet" as const, content: c.slice(0, 160) })),
    ],
  };
}

function effectiveBackend(settings: UserAiSettings | null) {
  if (!settings) {
    const cfg = getAiConfig();
    return cfg.effective;
  }
  if (!settings.enabled || settings.backend === "local") return "local" as const;
  // Coding-agent CLIs don't need API keys in-app (auth is on the CLI)
  if (
    settings.backend === "claude-cli" ||
    settings.backend === "codex-cli" ||
    settings.backend === "grok-cli"
  ) {
    return settings.backend;
  }
  if (hasLiveCredentials(settings)) return settings.backend;
  if (settings.provider === "xai" && process.env.XAI_API_KEY?.trim()) return settings.backend;
  if (settings.provider === "anthropic" && process.env.ANTHROPIC_API_KEY?.trim())
    return settings.backend;
  if (settings.provider === "openai" && process.env.OPENAI_API_KEY?.trim()) return settings.backend;
  if (settings.provider === "ollama") return settings.backend;
  return "local" as const;
}

export const runAi = createServerFn({ method: "POST" })
  .validator((input: unknown) => validateRequest(input))
  .handler(async ({ data }): Promise<AiResponse> => {
    const settings: UserAiSettings | null = data.clientSettings ?? null;
    const backend = effectiveBackend(settings);
    const req: AiRequest = {
      action: data.action,
      instruction: data.instruction,
      blockText: data.blockText,
      blockType: data.blockType,
      pageTitle: data.pageTitle,
      pageText: data.pageText,
    };

    if (backend === "local") {
      return localAi(req);
    }

    if (
      backend === "claude-cli" ||
      backend === "codex-cli" ||
      backend === "grok-cli"
    ) {
      try {
        const { runCliAgent } = await import("@/lib/ai/cli-backends");
        return await runCliAgent(backend, req);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[ai] cli backend failed:", message);
        throw new Error(message);
      }
    }

    if (backend === "deepagents") {
      try {
        const { runDeepAgent } = await import("@/lib/ai/deep-agent");
        return await runDeepAgent(req, settings);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message !== "NO_KEY") console.error("[ai] deepagents failed:", message);
      }
    }

    try {
      const system = buildSystemPrompt(req.action);
      const user = buildUserPrompt(req);
      const { text, model, provider } = await callDirect(settings, system, user);
      return {
        ...parseModelPayload(text, req.action),
        model: `${provider}:${model}`,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message !== "NO_KEY") console.error("[ai] direct failed:", message);
    }

    return localAi(req);
  });

export const testAiConnection = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({
    clientSettings: validateSettings((input as { clientSettings?: unknown })?.clientSettings),
  }))
  .handler(async ({ data }) => {
    const settings = data.clientSettings;
    if (!settings) return { ok: false, message: "No settings provided" };
    if (settings.backend === "local" || !settings.enabled) {
      return { ok: true, message: "Local demo mode (no remote model)", mode: "local" as const };
    }
    if (
      settings.backend === "claude-cli" ||
      settings.backend === "codex-cli" ||
      settings.backend === "grok-cli"
    ) {
      const { listCliBackends } = await import("@/lib/ai/cli-backends");
      const list = await listCliBackends();
      const hit = list.find((b) => b.id === settings.backend);
      if (hit?.available) {
        return {
          ok: true,
          message: `${hit.label} found on PATH (${hit.binary})`,
          mode: settings.backend,
        };
      }
      return {
        ok: false,
        message: `${settings.backend} not found on PATH. Install and authenticate the CLI.`,
        mode: settings.backend,
      };
    }
    try {
      if (settings.backend === "deepagents") {
        const { probeDeepAgent } = await import("@/lib/ai/deep-agent");
        const result = await probeDeepAgent(settings);
        return { ...result, mode: "deepagents" as const };
      }
      const { model, provider, modelName } = await resolveChatModel(settings);
      await model.invoke([{ role: "user", content: "Say ok" }]);
      return {
        ok: true,
        message: `Connected to ${provider} · ${modelName}`,
        model: `${provider}:${modelName}`,
        mode: "direct" as const,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, message, mode: settings.backend };
    }
  });

export const testMcpConnection = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const server = (input as { server?: McpServerConfig })?.server;
    if (!server || typeof server !== "object") throw new Error("Missing server");
    return { server: validateMcpServer(server) };
  })
  .handler(async ({ data }) => {
    const { testMcpServer } = await import("@/lib/ai/mcp");
    return testMcpServer(data.server);
  });

export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  const cfg = getAiConfig();
  const { listCliBackends } = await import("@/lib/ai/cli-backends");
  const clis = await listCliBackends();
  return {
    configured: cfg.configured,
    backend: cfg.backend,
    effective: cfg.effective,
    model: cfg.model,
    skills: [...WORKSPACE_SKILLS],
    recursionLimit: cfg.recursionLimit,
    envHasXai: Boolean(process.env.XAI_API_KEY?.trim()),
    envHasAnthropic: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    envHasOpenai: Boolean(process.env.OPENAI_API_KEY?.trim()),
    clis,
  };
});

export const listAiCliBackends = createServerFn({ method: "GET" }).handler(async () => {
  const { listCliBackends } = await import("@/lib/ai/cli-backends");
  return listCliBackends();
});

export const describeAiSettings = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({
    clientSettings: validateSettings((input as { clientSettings?: unknown })?.clientSettings),
  }))
  .handler(async ({ data }) => {
    if (!data.clientSettings) return null;
    return publicAiSettings(data.clientSettings);
  });
