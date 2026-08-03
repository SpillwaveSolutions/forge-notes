import { i as resolveChatModel, n as getAiConfig } from "./resolve-model-CV2sMs92.mjs";
import { $t as string, Bt as array, It as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { loadMcpTools } from "./mcp-PdRpzr2V.mjs";
import { n as createDeepAgent, r as toolStrategy, t as FilesystemBackend } from "../_libs/deepagents+[...].mjs";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/deep-agent-CPCjT_2e.js
var blockTypeEnum = _enum([
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
	"mermaid"
]);
var agentResponseSchema = object({
	text: string().default("").describe("Plain replacement text for single-block edits; empty when only inserting blocks"),
	blocks: array(object({
		type: blockTypeEnum,
		content: string()
	})).optional().describe("Blocks to insert under the AI block")
});
function skillForAction(action) {
	switch (action) {
		case "summarize": return "summarize-page";
		case "edit_block": return "edit-block";
		case "action_items": return "action-items";
		case "table": return "table-from-notes";
		case "mermaid": return "mermaid-diagram";
		case "outline": return "custom-page-task";
		default: return "custom-page-task";
	}
}
function buildUserMessage(req, settings) {
	const skill = skillForAction(req.action);
	const parts = [!settings?.enabledSkills?.length || settings.enabledSkills.includes(skill) ? `Load and follow the skill: ${skill}` : `Skill ${skill} is disabled — still complete the action using general workspace rules.`, `Action: ${req.action}`];
	if (req.pageTitle) parts.push(`Page title: ${req.pageTitle}`);
	if (req.pageText) parts.push(`Page content:\n${req.pageText}`);
	if (req.blockText) {
		parts.push(`Target block type: ${req.blockType ?? "paragraph"}`);
		parts.push(`Target block text:\n${req.blockText}`);
	}
	if (req.instruction) parts.push(`Instruction:\n${req.instruction}`);
	if (req.action === "outline") parts.push("Produce a hierarchical outline using heading2 + bullet blocks.");
	parts.push("Return structured output with `text` and optional `blocks` per the schema.");
	return parts.join("\n\n");
}
function extractStructured(result) {
	if (!result || typeof result !== "object") return null;
	const r = result;
	for (const key of ["structuredResponse", "structured_response"]) if (r[key] && typeof r[key] === "object") {
		const parsed = agentResponseSchema.safeParse(r[key]);
		if (parsed.success) return parsed.data;
	}
	const messages = r.messages;
	if (Array.isArray(messages) && messages.length > 0) {
		const last = messages[messages.length - 1];
		const content = last?.content ?? last?.kwargs?.content;
		let text = "";
		if (typeof content === "string") text = content;
		else if (Array.isArray(content)) text = content.map((c) => typeof c === "string" ? c : c && typeof c === "object" && "text" in c ? String(c.text) : "").join("\n");
		if (text) {
			const candidate = (text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? text).trim();
			try {
				const parsed = agentResponseSchema.safeParse(JSON.parse(candidate));
				if (parsed.success) return parsed.data;
			} catch {
				return {
					text: candidate,
					blocks: void 0
				};
			}
		}
	}
	return null;
}
function fingerprint(settings, modelName, provider) {
	return JSON.stringify({
		provider,
		modelName,
		baseUrl: settings?.baseUrl ?? "",
		recursionLimit: settings?.recursionLimit,
		temperature: settings?.temperature,
		skills: settings?.enabledSkills ?? [],
		mcp: (settings?.mcpServers ?? []).filter((m) => m.enabled).map((m) => ({
			n: m.name,
			t: m.transport,
			u: m.url,
			c: m.command,
			a: m.argsText
		}))
	});
}
var cached = null;
async function getAgent(settings) {
	const { model, provider, modelName } = await resolveChatModel(settings);
	const key = fingerprint(settings, modelName, provider);
	if (cached?.key === key) return {
		agent: cached.agent,
		provider,
		modelName
	};
	const cfg = getAiConfig();
	const rootDir = path.join(process.cwd(), cfg.deepAgentsRoot);
	const { tools: mcpTools, errors: mcpErrors } = settings ? await loadMcpTools(settings) : {
		tools: [],
		errors: []
	};
	if (mcpErrors.length) console.warn("[ai] MCP load warnings:", mcpErrors.join("; "));
	const agent = createDeepAgent({
		model,
		name: "workspace-deep-agent",
		systemPrompt: "You are the workspace Deep Agent (LangChain). Use skills for specialized page tasks. You may call MCP tools when helpful for research or external context. Prefer structured output. Be concise.",
		backend: new FilesystemBackend({
			rootDir,
			virtualMode: true
		}),
		skills: [cfg.skillsPath],
		memory: ["/AGENTS.md"],
		tools: mcpTools,
		responseFormat: toolStrategy(agentResponseSchema),
		permissions: [{
			operations: ["read"],
			paths: ["/skills/**", "/AGENTS.md"]
		}, {
			operations: ["write"],
			paths: ["/**"],
			mode: "deny"
		}]
	});
	cached = {
		key,
		agent
	};
	return {
		agent,
		provider,
		modelName
	};
}
async function runDeepAgent(req, settings) {
	const { agent, provider, modelName } = await getAgent(settings);
	const userMessage = buildUserMessage(req, settings);
	const recursionLimit = Math.min(80, Math.max(8, settings?.recursionLimit || getAiConfig().recursionLimit || 40));
	const structured = extractStructured(await agent.invoke({ messages: [{
		role: "user",
		content: userMessage
	}] }, { recursionLimit }));
	if (!structured) throw new Error("Deep Agent returned no structured output");
	const blocks = structured.blocks?.map((b) => ({
		type: b.type,
		content: b.content
	}));
	return {
		text: structured.text ?? "",
		blocks,
		provider: "deepagents",
		model: `${provider}:${modelName}`
	};
}
/** Lightweight connectivity check */
async function probeDeepAgent(settings) {
	try {
		const { model, provider, modelName } = await resolveChatModel(settings);
		const res = await model.invoke([{
			role: "user",
			content: "Reply with exactly: {\"ok\":true}"
		}]);
		typeof res.content === "string" ? res.content : Array.isArray(res.content) ? res.content.map((c) => typeof c === "string" ? c : "").join("") : String(res.content ?? "");
		let mcpTools = [];
		if (settings) mcpTools = (await loadMcpTools(settings)).toolNames;
		return {
			ok: true,
			message: `Connected to ${provider} · ${modelName}`,
			model: `${provider}:${modelName}`,
			mcpTools
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (message === "NO_KEY") return {
			ok: false,
			message: "Missing API key for this provider"
		};
		if (message === "BASE_URL_REQUIRED") return {
			ok: false,
			message: "Base URL is required for this provider"
		};
		return {
			ok: false,
			message
		};
	}
}
//#endregion
export { probeDeepAgent, runDeepAgent };
