//#region node_modules/.nitro/vite/services/ssr/assets/resolve-model-CV2sMs92.js
function getAiConfig() {
	const apiKey = process.env.XAI_API_KEY?.trim() || "";
	const model = process.env.XAI_MODEL?.trim() || "grok-4.5";
	const rawBackend = process.env.AI_BACKEND?.trim().toLowerCase() || "deepagents";
	const backend = rawBackend === "direct" || rawBackend === "local" || rawBackend === "deepagents" ? rawBackend : "deepagents";
	const recursionLimit = Math.min(80, Math.max(8, Number(process.env.AI_RECURSION_LIMIT || 40) || 40));
	const configured = Boolean(apiKey);
	return {
		apiKey,
		model,
		backend,
		effective: !configured ? "local" : backend === "local" ? "local" : backend,
		configured,
		recursionLimit,
		deepAgentsRoot: "deepagents-root",
		skillsPath: "/skills/"
	};
}
var WORKSPACE_SKILLS = [
	"summarize-page",
	"edit-block",
	"action-items",
	"table-from-notes",
	"mermaid-diagram",
	"custom-page-task"
];
/**
* Build a LangChain chat model from user settings, falling back to process env.
*/
async function resolveChatModel(settings) {
	const env = getAiConfig();
	const provider = settings?.provider ?? "xai";
	const modelName = settings?.model?.trim() || env.model || "grok-4.5";
	const temperature = settings?.temperature ?? .35;
	const userKey = settings?.apiKey?.trim() || "";
	const envXai = env.apiKey;
	const baseUrl = settings?.baseUrl?.trim() || "";
	if (provider === "xai") {
		const apiKey = userKey || envXai;
		if (!apiKey) throw new Error("NO_KEY");
		const { ChatXAI } = await import("../_libs/langchain__xai.mjs").then((n) => n.t);
		return {
			model: new ChatXAI({
				apiKey,
				model: modelName,
				temperature
			}),
			provider: "xai",
			modelName,
			source: userKey ? "user" : "env"
		};
	}
	if (provider === "anthropic") {
		const apiKey = userKey || process.env.ANTHROPIC_API_KEY?.trim() || "";
		if (!apiKey) throw new Error("NO_KEY");
		const { ChatAnthropic } = await import("../_libs/@langchain/anthropic+[...].mjs").then((n) => n.t);
		return {
			model: new ChatAnthropic({
				apiKey,
				model: modelName,
				temperature
			}),
			provider: "anthropic",
			modelName,
			source: userKey ? "user" : "env"
		};
	}
	if (provider === "openai") {
		const apiKey = userKey || process.env.OPENAI_API_KEY?.trim() || "";
		if (!apiKey) throw new Error("NO_KEY");
		const { ChatOpenAI } = await import("../_libs/langchain__openai+openai.mjs").then((n) => n.t);
		return {
			model: new ChatOpenAI({
				apiKey,
				model: modelName,
				temperature
			}),
			provider: "openai",
			modelName,
			source: userKey ? "user" : "env"
		};
	}
	if (provider === "ollama") {
		const { ChatOllama } = await import("../_libs/@langchain/ollama+[...].mjs").then((n) => n.t);
		return {
			model: new ChatOllama({
				baseUrl: baseUrl || "http://127.0.0.1:11434",
				model: modelName,
				temperature
			}),
			provider: "ollama",
			modelName,
			source: "user"
		};
	}
	const apiKey = userKey || process.env.OPENAI_API_KEY?.trim() || "not-needed";
	if (!baseUrl) throw new Error("BASE_URL_REQUIRED");
	const { ChatOpenAI } = await import("../_libs/langchain__openai+openai.mjs").then((n) => n.t);
	return {
		model: new ChatOpenAI({
			apiKey,
			model: modelName,
			temperature,
			configuration: { baseURL: baseUrl }
		}),
		provider: "openai_compatible",
		modelName,
		source: "user"
	};
}
function hasLiveCredentials(settings) {
	if (!settings?.enabled) return false;
	if (settings.backend === "local") return false;
	const provider = settings.provider;
	if (provider === "ollama") return true;
	if (provider === "openai_compatible") return Boolean(settings.baseUrl?.trim());
	if (settings.apiKey?.trim()) return true;
	if (provider === "xai" && process.env.XAI_API_KEY?.trim()) return true;
	if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY?.trim()) return true;
	if (provider === "openai" && process.env.OPENAI_API_KEY?.trim()) return true;
	return false;
}
//#endregion
export { resolveChatModel as i, getAiConfig as n, hasLiveCredentials as r, WORKSPACE_SKILLS as t };
