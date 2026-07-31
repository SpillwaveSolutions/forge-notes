import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { UserAiSettings } from "@/lib/ai/settings-types";
import { getAiConfig } from "@/lib/ai/config";

/**
 * Build a LangChain chat model from user settings, falling back to process env.
 */
export async function resolveChatModel(settings?: UserAiSettings | null): Promise<{
  model: BaseChatModel;
  provider: string;
  modelName: string;
  source: "user" | "env";
}> {
  const env = getAiConfig();
  const provider = settings?.provider ?? "xai";
  const modelName = settings?.model?.trim() || env.model || "grok-4.5";
  const temperature = settings?.temperature ?? 0.35;

  // Prefer user key; fall back to env for xAI
  const userKey = settings?.apiKey?.trim() || "";
  const envXai = env.apiKey;
  const baseUrl = settings?.baseUrl?.trim() || "";

  if (provider === "xai") {
    const apiKey = userKey || envXai;
    if (!apiKey) throw new Error("NO_KEY");
    const { ChatXAI } = await import("@langchain/xai");
    return {
      model: new ChatXAI({ apiKey, model: modelName, temperature }),
      provider: "xai",
      modelName,
      source: userKey ? "user" : "env",
    };
  }

  if (provider === "anthropic") {
    const apiKey = userKey || process.env.ANTHROPIC_API_KEY?.trim() || "";
    if (!apiKey) throw new Error("NO_KEY");
    const { ChatAnthropic } = await import("@langchain/anthropic");
    return {
      model: new ChatAnthropic({ apiKey, model: modelName, temperature }),
      provider: "anthropic",
      modelName,
      source: userKey ? "user" : "env",
    };
  }

  if (provider === "openai") {
    const apiKey = userKey || process.env.OPENAI_API_KEY?.trim() || "";
    if (!apiKey) throw new Error("NO_KEY");
    const { ChatOpenAI } = await import("@langchain/openai");
    return {
      model: new ChatOpenAI({ apiKey, model: modelName, temperature }),
      provider: "openai",
      modelName,
      source: userKey ? "user" : "env",
    };
  }

  if (provider === "ollama") {
    const { ChatOllama } = await import("@langchain/ollama");
    return {
      model: new ChatOllama({
        baseUrl: baseUrl || "http://127.0.0.1:11434",
        model: modelName,
        temperature,
      }),
      provider: "ollama",
      modelName,
      source: "user",
    };
  }

  // openai_compatible
  const apiKey = userKey || process.env.OPENAI_API_KEY?.trim() || "not-needed";
  if (!baseUrl) throw new Error("BASE_URL_REQUIRED");
  const { ChatOpenAI } = await import("@langchain/openai");
  return {
    model: new ChatOpenAI({
      apiKey,
      model: modelName,
      temperature,
      configuration: { baseURL: baseUrl },
    }),
    provider: "openai_compatible",
    modelName,
    source: "user",
  };
}

export function hasLiveCredentials(settings?: UserAiSettings | null): boolean {
  if (!settings?.enabled) return false;
  if (settings.backend === "local") return false;
  const provider = settings.provider;
  if (provider === "ollama") return true;
  if (provider === "openai_compatible") return Boolean(settings.baseUrl?.trim());
  if (settings.apiKey?.trim()) return true;
  // env fallbacks
  if (provider === "xai" && process.env.XAI_API_KEY?.trim()) return true;
  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY?.trim()) return true;
  if (provider === "openai" && process.env.OPENAI_API_KEY?.trim()) return true;
  return false;
}
