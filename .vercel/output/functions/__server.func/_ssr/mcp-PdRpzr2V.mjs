//#region node_modules/.nitro/vite/services/ssr/assets/mcp-PdRpzr2V.js
function parseHeaders(server) {
	const headers = {};
	if (server.authToken?.trim()) headers.Authorization = `Bearer ${server.authToken.trim()}`;
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
function parseEnv(text) {
	const env = {};
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
function parseArgs(text) {
	if (!text?.trim()) return [];
	return text.trim().split(/\s+/).filter(Boolean);
}
function buildMcpConnections(servers) {
	const connections = {};
	for (const s of servers) {
		if (!s.enabled) continue;
		const name = s.name || s.id;
		if (s.transport === "stdio") {
			if (!s.command?.trim()) continue;
			connections[name] = {
				transport: "stdio",
				command: s.command.trim(),
				args: parseArgs(s.argsText),
				env: parseEnv(s.envText)
			};
		} else {
			if (!s.url?.trim()) continue;
			connections[name] = {
				transport: s.transport === "sse" ? "sse" : "http",
				url: s.url.trim(),
				headers: parseHeaders(s)
			};
		}
	}
	return connections;
}
async function loadMcpTools(settings) {
	const connections = buildMcpConnections(settings.mcpServers);
	if (Object.keys(connections).length === 0) return {
		tools: [],
		errors: [],
		toolNames: []
	};
	try {
		const { MultiServerMCPClient } = await import("../_libs/@langchain/mcp-adapters+[...].mjs").then((n) => n.t);
		const tools = await new MultiServerMCPClient({ mcpServers: connections }).getTools();
		return {
			tools,
			errors: [],
			toolNames: tools.map((t) => t.name)
		};
	} catch (err) {
		return {
			tools: [],
			errors: [err instanceof Error ? err.message : String(err)],
			toolNames: []
		};
	}
}
async function testMcpServer(server) {
	const fake = {
		setupComplete: true,
		enabled: true,
		backend: "deepagents",
		provider: "xai",
		model: "test",
		apiKey: "",
		baseUrl: "",
		temperature: 0,
		recursionLimit: 10,
		mcpServers: [{
			...server,
			enabled: true
		}],
		enabledSkills: [],
		preferStreaming: true
	};
	try {
		const connections = buildMcpConnections(fake.mcpServers);
		if (Object.keys(connections).length === 0) return {
			ok: false,
			message: "Incomplete MCP config (URL or command required)",
			toolNames: []
		};
		const { MultiServerMCPClient } = await import("../_libs/@langchain/mcp-adapters+[...].mjs").then((n) => n.t);
		const names = (await new MultiServerMCPClient({ mcpServers: connections }).getTools()).map((t) => t.name);
		return {
			ok: true,
			message: `OK · ${names.length} tool${names.length === 1 ? "" : "s"}`,
			toolNames: names
		};
	} catch (err) {
		return {
			ok: false,
			message: err instanceof Error ? err.message : String(err),
			toolNames: []
		};
	}
}
//#endregion
export { loadMcpTools, testMcpServer };
