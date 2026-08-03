import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as resolveChatModel, n as getAiConfig, r as hasLiveCredentials, t as WORKSPACE_SKILLS } from "./resolve-model-CV2sMs92.mjs";
import { a as publicAiSettings } from "./settings-types-CI9vU3Ws.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-server-BfsU_lCo.js
function validateMcpServer(m) {
	return {
		id: String(m.id || "mcp").slice(0, 64),
		name: String(m.name || "mcp").slice(0, 80),
		enabled: m.enabled !== false,
		transport: m.transport === "sse" || m.transport === "stdio" || m.transport === "http" ? m.transport : "http",
		url: typeof m.url === "string" ? m.url.slice(0, 500) : "",
		authToken: typeof m.authToken === "string" ? m.authToken.slice(0, 500) : "",
		headersText: typeof m.headersText === "string" ? m.headersText.slice(0, 2e3) : "",
		command: typeof m.command === "string" ? m.command.slice(0, 200) : "",
		argsText: typeof m.argsText === "string" ? m.argsText.slice(0, 1e3) : "",
		envText: typeof m.envText === "string" ? m.envText.slice(0, 2e3) : ""
	};
}
function validateSettings(input) {
	if (!input || typeof input !== "object") return null;
	const s = input;
	return {
		setupComplete: Boolean(s.setupComplete),
		enabled: s.enabled !== false,
		backend: s.backend === "direct" || s.backend === "local" || s.backend === "deepagents" || s.backend === "claude-cli" || s.backend === "codex-cli" || s.backend === "grok-cli" ? s.backend : "deepagents",
		preferStreaming: s.preferStreaming !== false,
		provider: s.provider === "anthropic" || s.provider === "openai" || s.provider === "ollama" || s.provider === "openai_compatible" || s.provider === "xai" ? s.provider : "xai",
		model: typeof s.model === "string" ? s.model.slice(0, 120) : "grok-4.5",
		apiKey: typeof s.apiKey === "string" ? s.apiKey.slice(0, 500) : "",
		baseUrl: typeof s.baseUrl === "string" ? s.baseUrl.slice(0, 500) : "",
		temperature: Math.min(1.5, Math.max(0, Number(s.temperature) || .35)),
		recursionLimit: Math.min(80, Math.max(8, Number(s.recursionLimit) || 40)),
		mcpServers: Array.isArray(s.mcpServers) ? s.mcpServers.slice(0, 20).map((m) => validateMcpServer(m)) : [],
		enabledSkills: Array.isArray(s.enabledSkills) ? s.enabledSkills.map(String).slice(0, 50) : [...WORKSPACE_SKILLS]
	};
}
function validateRequest(input) {
	const data = input;
	if (!data || typeof data !== "object") throw new Error("Invalid AI request");
	const action = data.action;
	if (![
		"edit_block",
		"summarize",
		"action_items",
		"table",
		"outline",
		"mermaid",
		"custom"
	].includes(action)) throw new Error("Invalid AI action");
	return {
		action,
		instruction: typeof data.instruction === "string" ? data.instruction.slice(0, 4e3) : "",
		blockText: typeof data.blockText === "string" ? data.blockText.slice(0, 8e3) : "",
		blockType: data.blockType,
		pageTitle: typeof data.pageTitle === "string" ? data.pageTitle.slice(0, 500) : "",
		pageText: typeof data.pageText === "string" ? data.pageText.slice(0, 2e4) : "",
		clientSettings: validateSettings(data.clientSettings)
	};
}
function buildSystemPrompt(action) {
	const base = "You help edit a Notion-style notes workspace. Be concise, high-signal, and practical. Never use emoji unless the user asks. Return only the content requested — no preamble.";
	switch (action) {
		case "edit_block": return `${base} Rewrite the given block text per the instruction. Return plain text only (no quotes around the whole answer).`;
		case "summarize": return `${base} Summarize the page. Return JSON: {"blocks":[{"type":"heading2","content":"..."},{"type":"paragraph","content":"..."},{"type":"bullet","content":"..."}]} using types paragraph|heading1|heading2|heading3|bullet|numbered|todo|quote|callout|code|mermaid.`;
		case "action_items": return `${base} Extract action items as todos. Return JSON: {"blocks":[{"type":"heading2","content":"Action items"},{"type":"todo","content":"..."}]} only.`;
		case "table": return `${base} Create a markdown table from the page. Return JSON: {"blocks":[{"type":"heading2","content":"..."},{"type":"code","content":"| Col | ... |\\n|---|---|\\n| ... |"}]} — put the table in a code block.`;
		case "outline": return `${base} Create a hierarchical outline. Return JSON: {"blocks":[{"type":"heading2","content":"Outline"},{"type":"bullet","content":"..."},{"type":"bullet","content":"..."}]} .`;
		case "mermaid": return `${base} Create a Mermaid diagram for the page. Return JSON: {"blocks":[{"type":"heading2","content":"Diagram"},{"type":"mermaid","content":"flowchart TD\\n  A-->B"}]} . Valid mermaid only in content.`;
		case "custom": return `${base} Follow the user instruction using the page context. Prefer JSON {"blocks":[...]} when creating multiple blocks; otherwise plain text in {"text":"..."}. Allowed block types: paragraph,heading1,heading2,heading3,bullet,numbered,todo,quote,callout,code,mermaid.`;
		default: return base;
	}
}
function buildUserPrompt(req) {
	const parts = [];
	if (req.pageTitle) parts.push(`Page title: ${req.pageTitle}`);
	if (req.pageText) parts.push(`Page content:\n${req.pageText}`);
	if (req.blockText) parts.push(`Block (${req.blockType ?? "text"}):\n${req.blockText}`);
	if (req.instruction) parts.push(`Instruction:\n${req.instruction}`);
	if (req.action === "edit_block" && !req.instruction) parts.push("Instruction: Improve clarity and fix grammar while preserving meaning.");
	return parts.join("\n\n") || "Empty page.";
}
async function callDirect(settings, system, user) {
	const { model, provider, modelName } = await resolveChatModel(settings);
	const res = await model.invoke([{
		role: "system",
		content: system
	}, {
		role: "user",
		content: user
	}]);
	const text = typeof res.content === "string" ? res.content.trim() : Array.isArray(res.content) ? res.content.map((c) => typeof c === "string" ? c : c.text ?? "").join("").trim() : String(res.content ?? "").trim();
	if (!text) throw new Error("Empty model response");
	return {
		text,
		model: modelName,
		provider
	};
}
function parseModelPayload(raw, action) {
	const candidate = (raw.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? raw).trim();
	try {
		const parsed = JSON.parse(candidate);
		if (parsed.blocks && Array.isArray(parsed.blocks)) return {
			text: parsed.text ?? "",
			blocks: parsed.blocks.filter((b) => b && typeof b.content === "string").map((b) => ({
				type: b.type || "paragraph",
				content: String(b.content)
			})),
			provider: "xai"
		};
		if (typeof parsed.text === "string") return {
			text: parsed.text,
			provider: "xai"
		};
	} catch {}
	if (action === "edit_block" || action === "custom") return {
		text: raw.replace(/^["']|["']$/g, "").trim(),
		provider: "xai"
	};
	return {
		text: raw,
		blocks: [{
			type: "paragraph",
			content: raw
		}],
		provider: "xai"
	};
}
function localAi(req) {
	const page = (req.pageText || "").trim();
	const title = req.pageTitle || "Untitled";
	const lines = page.split("\n").map((l) => l.replace(/^#+\s*/, "").replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
	const unique = [...new Set(lines)].slice(0, 24);
	if (req.action === "edit_block") {
		let text = (req.blockText || "").trim();
		const instruction = (req.instruction || "").toLowerCase();
		if (!text) text = "Add a clear note here.";
		if (instruction.includes("short") || instruction.includes("concise")) {
			text = text.split(/[.!?]/).slice(0, 2).join(". ").trim();
			if (text && !/[.!?]$/.test(text)) text += ".";
		} else if (instruction.includes("long") || instruction.includes("expand")) text = `${text} In practice, this means spelling out the goal, the constraints, and the next concrete step so anyone can pick it up cold.`;
		else if (instruction.includes("professional") || instruction.includes("formal")) {
			text = text.replace(/\b(gonna|wanna|kinda|gotta)\b/gi, (m) => {
				return {
					gonna: "going to",
					wanna: "want to",
					kinda: "somewhat",
					gotta: "need to"
				}[m.toLowerCase()] ?? m;
			});
			text = text.charAt(0).toUpperCase() + text.slice(1);
		} else if (instruction.includes("fix") || instruction.includes("grammar")) {
			text = text.replace(/\s+/g, " ").replace(/\si\s/g, " I ").replace(/(^\w)/, (c) => c.toUpperCase());
			if (text && !/[.!?]$/.test(text)) text += ".";
		} else if (instruction) text = `${text}\n\n(${instruction.replace(/\.$/, "")} — local demo. Open AI setup to connect Grok, Claude, Ollama, etc.)`;
		else {
			text = text.replace(/\s+/g, " ").trim();
			if (text && !/[.!?]$/.test(text)) text += ".";
		}
		return {
			text,
			provider: "local"
		};
	}
	if (req.action === "summarize") {
		const bullets = unique.slice(0, 5);
		return {
			text: "",
			provider: "local",
			blocks: [
				{
					type: "heading2",
					content: `Summary — ${title}`
				},
				{
					type: "paragraph",
					content: bullets.length > 0 ? `This page covers ${bullets.length} main points: ${bullets.slice(0, 3).map((b) => b.replace(/\.$/, "")).join("; ")}.` : "This page is still light — add notes, then run AI summary again."
				},
				...bullets.map((b) => ({
					type: "bullet",
					content: b.slice(0, 200)
				}))
			]
		};
	}
	if (req.action === "action_items") {
		const todos = unique.filter((l) => /todo|need|should|must|fix|add|ship|write|create|update|check/i.test(l) || l.length < 80).slice(0, 6);
		const items = todos.length ? todos : unique.slice(0, 4);
		return {
			text: "",
			provider: "local",
			blocks: [{
				type: "heading2",
				content: "Action items"
			}, ...items.length ? items.map((c) => ({
				type: "todo",
				content: c.slice(0, 160)
			})) : [{
				type: "todo",
				content: "Capture next steps on this page"
			}]]
		};
	}
	if (req.action === "table") return {
		text: "",
		provider: "local",
		blocks: [{
			type: "heading2",
			content: "Table"
		}, {
			type: "code",
			content: [
				"| Topic | Note |",
				"| --- | --- |",
				...unique.slice(0, 6).map((r, i) => `| ${i + 1}. ${r.slice(0, 40).replace(/\|/g, "/")} | From page |`)
			].join("\n")
		}]
	};
	if (req.action === "outline") return {
		text: "",
		provider: "local",
		blocks: [
			{
				type: "heading2",
				content: "Outline"
			},
			{
				type: "bullet",
				content: title
			},
			...unique.slice(0, 8).map((c) => ({
				type: "bullet",
				content: c.slice(0, 120)
			}))
		]
	};
	if (req.action === "mermaid") {
		const nodes = unique.slice(0, 5).map((l, i) => {
			return {
				id: String.fromCharCode(65 + i),
				label: l.slice(0, 28).replace(/"/g, "'")
			};
		});
		return {
			text: "",
			provider: "local",
			blocks: [{
				type: "heading2",
				content: "Diagram"
			}, {
				type: "mermaid",
				content: (nodes.length >= 2 ? [
					"flowchart TD",
					...nodes.map((n) => `  ${n.id}["${n.label}"]`),
					...nodes.slice(0, -1).map((n, i) => `  ${n.id} --> ${nodes[i + 1].id}`)
				] : [
					"flowchart TD",
					`  A["${title.slice(0, 28)}"]`,
					"  B[\"Add more notes\"]",
					"  A --> B"
				]).join("\n")
			}]
		};
	}
	return {
		text: "",
		provider: "local",
		blocks: [
			{
				type: "heading2",
				content: "AI response"
			},
			{
				type: "paragraph",
				content: `Request: ${(req.instruction || "Help with this page").trim()}`
			},
			{
				type: "callout",
				content: "Local demo mode. Open Settings → Configure AI to connect Grok, Claude, OpenAI, Ollama, and MCP servers."
			},
			...unique.slice(0, 4).map((c) => ({
				type: "bullet",
				content: c.slice(0, 160)
			}))
		]
	};
}
function effectiveBackend(settings) {
	if (!settings) return getAiConfig().effective;
	if (!settings.enabled || settings.backend === "local") return "local";
	if (settings.backend === "claude-cli" || settings.backend === "codex-cli" || settings.backend === "grok-cli") return settings.backend;
	if (hasLiveCredentials(settings)) return settings.backend;
	if (settings.provider === "xai" && process.env.XAI_API_KEY?.trim()) return settings.backend;
	if (settings.provider === "anthropic" && process.env.ANTHROPIC_API_KEY?.trim()) return settings.backend;
	if (settings.provider === "openai" && process.env.OPENAI_API_KEY?.trim()) return settings.backend;
	if (settings.provider === "ollama") return settings.backend;
	return "local";
}
var runAi_createServerFn_handler = createServerRpc({
	id: "76d08ea8f0b0103fcaf7055c8b138a9579e4124d0d2f62a0686a1011273cd47a",
	name: "runAi",
	filename: "src/lib/ai-server.ts"
}, (opts) => runAi.__executeServer(opts));
var runAi = createServerFn({ method: "POST" }).validator((input) => validateRequest(input)).handler(runAi_createServerFn_handler, async ({ data }) => {
	const settings = data.clientSettings ?? null;
	const backend = effectiveBackend(settings);
	const req = {
		action: data.action,
		instruction: data.instruction,
		blockText: data.blockText,
		blockType: data.blockType,
		pageTitle: data.pageTitle,
		pageText: data.pageText
	};
	if (backend === "local") return localAi(req);
	if (backend === "claude-cli" || backend === "codex-cli" || backend === "grok-cli") try {
		const { runCliAgent } = await import("./cli-backends-BkZaX-Hk.mjs").then((n) => n.t);
		return await runCliAgent(backend, req);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error("[ai] cli backend failed:", message);
		throw new Error(message);
	}
	if (backend === "deepagents") try {
		const { runDeepAgent } = await import("./deep-agent-CPCjT_2e.mjs");
		return await runDeepAgent(req, settings);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (message !== "NO_KEY") console.error("[ai] deepagents failed:", message);
	}
	try {
		const { text, model, provider } = await callDirect(settings, buildSystemPrompt(req.action), buildUserPrompt(req));
		return {
			...parseModelPayload(text, req.action),
			model: `${provider}:${model}`
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (message !== "NO_KEY") console.error("[ai] direct failed:", message);
	}
	return localAi(req);
});
var testAiConnection_createServerFn_handler = createServerRpc({
	id: "5e6a13ce7e871cac8b1efc1cf5ccb213d79a60710661cd7012f69f2c7ccb6982",
	name: "testAiConnection",
	filename: "src/lib/ai-server.ts"
}, (opts) => testAiConnection.__executeServer(opts));
var testAiConnection = createServerFn({ method: "POST" }).validator((input) => ({ clientSettings: validateSettings(input?.clientSettings) })).handler(testAiConnection_createServerFn_handler, async ({ data }) => {
	const settings = data.clientSettings;
	if (!settings) return {
		ok: false,
		message: "No settings provided"
	};
	if (settings.backend === "local" || !settings.enabled) return {
		ok: true,
		message: "Local demo mode (no remote model)",
		mode: "local"
	};
	if (settings.backend === "claude-cli" || settings.backend === "codex-cli" || settings.backend === "grok-cli") {
		const { listCliBackends } = await import("./cli-backends-BkZaX-Hk.mjs").then((n) => n.t);
		const hit = (await listCliBackends()).find((b) => b.id === settings.backend);
		if (hit?.available) return {
			ok: true,
			message: `${hit.label} found on PATH (${hit.binary})`,
			mode: settings.backend
		};
		return {
			ok: false,
			message: `${settings.backend} not found on PATH. Install and authenticate the CLI.`,
			mode: settings.backend
		};
	}
	try {
		if (settings.backend === "deepagents") {
			const { probeDeepAgent } = await import("./deep-agent-CPCjT_2e.mjs");
			return {
				...await probeDeepAgent(settings),
				mode: "deepagents"
			};
		}
		const { model, provider, modelName } = await resolveChatModel(settings);
		await model.invoke([{
			role: "user",
			content: "Say ok"
		}]);
		return {
			ok: true,
			message: `Connected to ${provider} · ${modelName}`,
			model: `${provider}:${modelName}`,
			mode: "direct"
		};
	} catch (err) {
		return {
			ok: false,
			message: err instanceof Error ? err.message : String(err),
			mode: settings.backend
		};
	}
});
var testMcpConnection_createServerFn_handler = createServerRpc({
	id: "1e62b13d94b613cf423e7774bb51046a7dfc3005d0164d46cbd5f39fd41e65ae",
	name: "testMcpConnection",
	filename: "src/lib/ai-server.ts"
}, (opts) => testMcpConnection.__executeServer(opts));
var testMcpConnection = createServerFn({ method: "POST" }).validator((input) => {
	const server = input?.server;
	if (!server || typeof server !== "object") throw new Error("Missing server");
	return { server: validateMcpServer(server) };
}).handler(testMcpConnection_createServerFn_handler, async ({ data }) => {
	const { testMcpServer } = await import("./mcp-PdRpzr2V.mjs");
	return testMcpServer(data.server);
});
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "5252add61246cf72a4fa382b4734734c4e8ea74302302ba378f1ecb54d53868d",
	name: "getAiStatus",
	filename: "src/lib/ai-server.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	const cfg = getAiConfig();
	const { listCliBackends } = await import("./cli-backends-BkZaX-Hk.mjs").then((n) => n.t);
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
		clis
	};
});
var listAiCliBackends_createServerFn_handler = createServerRpc({
	id: "9bf431d4df4d57d04f011720753080a98c88face5f4f24058da2b17f8da151b8",
	name: "listAiCliBackends",
	filename: "src/lib/ai-server.ts"
}, (opts) => listAiCliBackends.__executeServer(opts));
var listAiCliBackends = createServerFn({ method: "GET" }).handler(listAiCliBackends_createServerFn_handler, async () => {
	const { listCliBackends } = await import("./cli-backends-BkZaX-Hk.mjs").then((n) => n.t);
	return listCliBackends();
});
var describeAiSettings_createServerFn_handler = createServerRpc({
	id: "12c220cad66e7d4a3abab6da0b2bab6053a48aee4b6a0cde9d321705b501bd69",
	name: "describeAiSettings",
	filename: "src/lib/ai-server.ts"
}, (opts) => describeAiSettings.__executeServer(opts));
var describeAiSettings = createServerFn({ method: "POST" }).validator((input) => ({ clientSettings: validateSettings(input?.clientSettings) })).handler(describeAiSettings_createServerFn_handler, async ({ data }) => {
	if (!data.clientSettings) return null;
	return publicAiSettings(data.clientSettings);
});
//#endregion
export { describeAiSettings_createServerFn_handler, getAiStatus_createServerFn_handler, listAiCliBackends_createServerFn_handler, runAi_createServerFn_handler, testAiConnection_createServerFn_handler, testMcpConnection_createServerFn_handler };
