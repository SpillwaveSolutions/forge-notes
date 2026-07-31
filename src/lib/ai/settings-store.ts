import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultUserAiSettings,
  type McpServerConfig,
  type UserAiSettings,
} from "@/lib/ai/settings-types";
import { uid } from "@/lib/utils";

interface AiSettingsState extends UserAiSettings {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  patch: (partial: Partial<UserAiSettings>) => void;
  reset: () => void;
  setProviderDefaults: (provider: UserAiSettings["provider"]) => void;
  addMcpServer: (partial?: Partial<McpServerConfig>) => string;
  updateMcpServer: (id: string, patch: Partial<McpServerConfig>) => void;
  removeMcpServer: (id: string) => void;
  getSettings: () => UserAiSettings;
}

export const useAiSettings = create<AiSettingsState>()(
  persist(
    (set, get) => ({
      ...defaultUserAiSettings(),
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      patch: (partial) => set((s) => ({ ...s, ...partial })),
      reset: () => set({ ...defaultUserAiSettings(), hydrated: true }),
      setProviderDefaults: (provider) =>
        set((s) => {
          const models = {
            xai: "grok-4.5",
            anthropic: "claude-sonnet-4-6",
            openai: "gpt-4.1",
            ollama: "llama3.2",
            openai_compatible: "gpt-4o",
          } as const;
          const base =
            provider === "ollama"
              ? s.baseUrl || "http://127.0.0.1:11434"
              : provider === "openai_compatible"
                ? s.baseUrl || "https://api.example.com/v1"
                : "";
          return {
            provider,
            model: models[provider],
            baseUrl: base,
          };
        }),
      addMcpServer: (partial) => {
        const id = uid("mcp");
        const server: McpServerConfig = {
          id,
          name: partial?.name ?? "New MCP server",
          enabled: partial?.enabled ?? true,
          transport: partial?.transport ?? "http",
          url: partial?.url ?? "https://",
          authToken: partial?.authToken ?? "",
          headersText: partial?.headersText ?? "",
          command: partial?.command ?? "npx",
          argsText: partial?.argsText ?? "-y @modelcontextprotocol/server-everything",
          envText: partial?.envText ?? "",
        };
        set((s) => ({ mcpServers: [...s.mcpServers, server] }));
        return id;
      },
      updateMcpServer: (id, patch) =>
        set((s) => ({
          mcpServers: s.mcpServers.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      removeMcpServer: (id) =>
        set((s) => ({ mcpServers: s.mcpServers.filter((m) => m.id !== id) })),
      getSettings: () => {
        const s = get();
        return {
          setupComplete: s.setupComplete,
          enabled: s.enabled,
          backend: s.backend,
          provider: s.provider,
          model: s.model,
          apiKey: s.apiKey,
          baseUrl: s.baseUrl,
          temperature: s.temperature,
          recursionLimit: s.recursionLimit,
          mcpServers: s.mcpServers,
          enabledSkills: s.enabledSkills,
          preferStreaming: s.preferStreaming !== false,
        };
      },
    }),
    {
      name: "workspace-ai-settings-v1",
      partialize: (s) => ({
        setupComplete: s.setupComplete,
        enabled: s.enabled,
        backend: s.backend,
        provider: s.provider,
        model: s.model,
        apiKey: s.apiKey,
        baseUrl: s.baseUrl,
        temperature: s.temperature,
        recursionLimit: s.recursionLimit,
        mcpServers: s.mcpServers,
        enabledSkills: s.enabledSkills,
        preferStreaming: s.preferStreaming !== false,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function snapshotAiSettings(): UserAiSettings {
  return useAiSettings.getState().getSettings();
}
