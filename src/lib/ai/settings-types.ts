import { WORKSPACE_SKILLS } from "@/lib/ai/config";

export type AiProviderId =
  | "xai"
  | "anthropic"
  | "openai"
  | "ollama"
  | "openai_compatible";

/** How generation runs — API agents vs coding-agent CLIs */
export type AiBackendMode =
  | "deepagents"
  | "direct"
  | "local"
  | "claude-cli"
  | "codex-cli"
  | "grok-cli";

export type McpTransport = "http" | "sse" | "stdio";

export interface McpServerConfig {
  id: string;
  name: string;
  enabled: boolean;
  transport: McpTransport;
  url?: string;
  authToken?: string;
  headersText?: string;
  command?: string;
  argsText?: string;
  envText?: string;
  lastTestOk?: boolean;
  lastTestMessage?: string;
  lastToolCount?: number;
}

export interface UserAiSettings {
  setupComplete: boolean;
  enabled: boolean;
  backend: AiBackendMode;
  provider: AiProviderId;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  recursionLimit: number;
  mcpServers: McpServerConfig[];
  enabledSkills: string[];
  /** Prefer SSE streaming when backend supports it */
  preferStreaming: boolean;
}

export const DEFAULT_MODELS: Record<AiProviderId, string[]> = {
  xai: ["grok-4.5", "grok-4", "grok-3", "grok-3-mini", "grok-2"],
  anthropic: [
    "claude-sonnet-4-6",
    "claude-opus-4-6",
    "claude-haiku-4-5-20251001",
    "claude-3-5-sonnet-latest",
  ],
  openai: ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "o4-mini", "gpt-4o-mini"],
  ollama: ["llama3.2", "llama3.1", "mistral", "qwen2.5", "gemma3", "deepseek-r1"],
  openai_compatible: ["gpt-4o", "llama3.1", "custom-model"],
};

export const BACKEND_META: Record<
  AiBackendMode,
  { label: string; description: string; needsApiKey: boolean; isCli: boolean }
> = {
  deepagents: {
    label: "LangChain Deep Agents",
    description: "In-process agent with skills + MCP tools.",
    needsApiKey: true,
    isCli: false,
  },
  direct: {
    label: "Direct model API",
    description: "Single-shot chat via provider API (streamable).",
    needsApiKey: true,
    isCli: false,
  },
  "claude-cli": {
    label: "Claude Code CLI",
    description: "Shell out to `claude` with stream-json when available.",
    needsApiKey: false,
    isCli: true,
  },
  "codex-cli": {
    label: "Codex CLI",
    description: "Shell out to `codex exec` (streams stdout).",
    needsApiKey: false,
    isCli: true,
  },
  "grok-cli": {
    label: "Grok CLI",
    description: "Shell out to `grok chat --stream` / Grok Build.",
    needsApiKey: false,
    isCli: true,
  },
  local: {
    label: "Local demo",
    description: "No remote model — offline placeholders.",
    needsApiKey: false,
    isCli: false,
  },
};

export const PROVIDER_META: Record<
  AiProviderId,
  {
    label: string;
    description: string;
    keyLabel: string;
    keyPlaceholder: string;
    needsKey: boolean;
    baseUrlDefault?: string;
    baseUrlHint?: string;
  }
> = {
  xai: {
    label: "xAI · Grok",
    description: "Grok models via the xAI API (OpenAI-compatible).",
    keyLabel: "xAI API key",
    keyPlaceholder: "xai-…",
    needsKey: true,
  },
  anthropic: {
    label: "Anthropic · Claude",
    description: "Claude models (Sonnet, Opus, Haiku).",
    keyLabel: "Anthropic API key",
    keyPlaceholder: "sk-ant-…",
    needsKey: true,
  },
  openai: {
    label: "OpenAI",
    description: "GPT and o-series models from OpenAI.",
    keyLabel: "OpenAI API key",
    keyPlaceholder: "sk-…",
    needsKey: true,
  },
  ollama: {
    label: "Ollama (local)",
    description: "Run open models on your machine or LAN.",
    keyLabel: "API key (optional)",
    keyPlaceholder: "Usually blank",
    needsKey: false,
    baseUrlDefault: "http://127.0.0.1:11434",
    baseUrlHint: "Ollama OpenAI-compatible base (no /v1 suffix needed).",
  },
  openai_compatible: {
    label: "OpenAI-compatible",
    description: "Any OpenAI-style endpoint (Groq, Together, Azure proxy, etc.).",
    keyLabel: "API key",
    keyPlaceholder: "Optional / required by host",
    needsKey: false,
    baseUrlDefault: "https://api.example.com/v1",
    baseUrlHint: "Must include /v1 if the host expects it.",
  },
};

export function defaultUserAiSettings(): UserAiSettings {
  return {
    setupComplete: false,
    enabled: true,
    backend: "deepagents",
    provider: "xai",
    model: DEFAULT_MODELS.xai[0]!,
    apiKey: "",
    baseUrl: "",
    temperature: 0.35,
    recursionLimit: 40,
    mcpServers: [],
    enabledSkills: [...WORKSPACE_SKILLS],
    preferStreaming: true,
  };
}

export function publicAiSettings(s: UserAiSettings) {
  return {
    setupComplete: s.setupComplete,
    enabled: s.enabled,
    backend: s.backend,
    provider: s.provider,
    model: s.model,
    hasApiKey: Boolean(s.apiKey?.trim()),
    baseUrl: s.baseUrl,
    temperature: s.temperature,
    recursionLimit: s.recursionLimit,
    preferStreaming: s.preferStreaming !== false,
    mcpCount: s.mcpServers.filter((m) => m.enabled).length,
    mcpServers: s.mcpServers.map((m) => ({
      id: m.id,
      name: m.name,
      enabled: m.enabled,
      transport: m.transport,
      url: m.url,
      hasAuth: Boolean(m.authToken?.trim()),
      command: m.command,
    })),
    enabledSkills: s.enabledSkills,
  };
}
