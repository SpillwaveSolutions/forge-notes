import type { StructuredToolInterface } from "@langchain/core/tools";
import type { McpServerConfig, UserAiSettings } from "@/lib/ai/settings-types";

function parseHeaders(server: McpServerConfig): Record<string, string> {
  const headers: Record<string, string> = {};
  if (server.authToken?.trim()) {
    headers.Authorization = `Bearer ${server.authToken.trim()}`;
  }
  const raw = server.headersText?.trim() ?? "";
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) headers[key] = value;
  }
  return headers;
}

function parseEnv(text?: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!text?.trim()) return env;
  for (const line of text.split("\n")) {
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) env[key] = value;
  }
  return env;
}

function parseArgs(text?: string): string[] {
  if (!text?.trim()) return [];
  // simple split; quoted tokens not required for wizard defaults
  return text.trim().split(/\s+/).filter(Boolean);
}

export function buildMcpConnections(servers: McpServerConfig[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connections: Record<string, any> = {};
  for (const s of servers) {
    if (!s.enabled) continue;
    const name = s.name || s.id;
    if (s.transport === "stdio") {
      if (!s.command?.trim()) continue;
      connections[name] = {
        transport: "stdio",
        command: s.command.trim(),
        args: parseArgs(s.argsText),
        env: parseEnv(s.envText),
      };
    } else {
      if (!s.url?.trim()) continue;
      connections[name] = {
        transport: s.transport === "sse" ? "sse" : "http",
        url: s.url.trim(),
        headers: parseHeaders(s),
      };
    }
  }
  return connections;
}

export async function loadMcpTools(
  settings: UserAiSettings,
): Promise<{ tools: StructuredToolInterface[]; errors: string[]; toolNames: string[] }> {
  const connections = buildMcpConnections(settings.mcpServers);
  if (Object.keys(connections).length === 0) {
    return { tools: [], errors: [], toolNames: [] };
  }
  try {
    const { MultiServerMCPClient } = await import("@langchain/mcp-adapters");
    const client = new MultiServerMCPClient({ mcpServers: connections });
    const tools = await client.getTools();
    return {
      tools,
      errors: [],
      toolNames: tools.map((t) => t.name),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { tools: [], errors: [message], toolNames: [] };
  }
}

export async function testMcpServer(server: McpServerConfig): Promise<{
  ok: boolean;
  message: string;
  toolNames: string[];
}> {
  const fake: UserAiSettings = {
    setupComplete: true,
    enabled: true,
    backend: "deepagents",
    provider: "xai",
    model: "test",
    apiKey: "",
    baseUrl: "",
    temperature: 0,
    recursionLimit: 10,
    mcpServers: [{ ...server, enabled: true }],
    enabledSkills: [],
    preferStreaming: true,
  };

  try {
    const connections = buildMcpConnections(fake.mcpServers);
    if (Object.keys(connections).length === 0) {
      return { ok: false, message: "Incomplete MCP config (URL or command required)", toolNames: [] };
    }
    const { MultiServerMCPClient } = await import("@langchain/mcp-adapters");
    const client = new MultiServerMCPClient({ mcpServers: connections });
    const tools = await client.getTools();
    const names = tools.map((t) => t.name);
    return {
      ok: true,
      message: `OK · ${names.length} tool${names.length === 1 ? "" : "s"}`,
      toolNames: names,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
      toolNames: [],
    };
  }
}
