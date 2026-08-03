import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
//#region node_modules/.nitro/vite/services/ssr/assets/cli-backends-BkZaX-Hk.js
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
function parseModelPayload(raw, action, provider = "local") {
	const candidate = (raw.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? raw).trim();
	try {
		const parsed = JSON.parse(candidate);
		if (parsed.blocks && Array.isArray(parsed.blocks)) return {
			text: parsed.text ?? "",
			blocks: parsed.blocks.filter((b) => b && typeof b.content === "string").map((b) => ({
				type: b.type || "paragraph",
				content: String(b.content)
			})),
			provider
		};
		if (typeof parsed.text === "string") return {
			text: parsed.text,
			provider
		};
	} catch {}
	if (action === "edit_block" || action === "custom") return {
		text: raw.replace(/^["']|["']$/g, "").trim(),
		provider
	};
	return {
		text: raw,
		blocks: [{
			type: "paragraph",
			content: raw
		}],
		provider
	};
}
function composeCliPrompt(system, user) {
	return `${system}\n\n---\n\n${user}`;
}
/**
* Coding-agent CLI backends for workspace AI generation.
* Claude Code · Codex · Grok Build — with streaming stdout when available.
*/
var cli_backends_exports = /* @__PURE__ */ __exportAll({
	isCliBackend: () => isCliBackend,
	listCliBackends: () => listCliBackends,
	runCliAgent: () => runCliAgent,
	streamCliAgent: () => streamCliAgent
});
var BIN = {
	"claude-cli": "claude",
	"codex-cli": "codex",
	"grok-cli": "grok"
};
async function which(bin) {
	if (bin.includes("/")) try {
		await access(bin, constants.X_OK);
		return true;
	} catch {
		return false;
	}
	return new Promise((resolve) => {
		const child = spawn("which", [bin], { stdio: "ignore" });
		child.on("close", (code) => resolve(code === 0));
		child.on("error", () => resolve(false));
	});
}
async function listCliBackends() {
	const defs = [
		{
			id: "claude-cli",
			label: "Claude Code CLI",
			binary: "claude",
			supportsStream: true,
			notes: "Uses `claude -p` with stream-json when available.",
			example: "claude -p \"…\" --output-format stream-json"
		},
		{
			id: "codex-cli",
			label: "Codex CLI",
			binary: "codex",
			supportsStream: true,
			notes: "Uses `codex exec` (streams stdout).",
			example: "codex exec \"…\""
		},
		{
			id: "grok-cli",
			label: "Grok CLI / Grok Build",
			binary: "grok",
			supportsStream: true,
			notes: "Prefers `grok chat --stream`; falls back to plain prompt flags.",
			example: "grok chat --stream \"…\""
		}
	];
	const out = [];
	for (const d of defs) out.push({
		...d,
		available: await which(d.binary)
	});
	return out;
}
function isCliBackend(id) {
	return id === "claude-cli" || id === "codex-cli" || id === "grok-cli";
}
function buildArgs(backend, prompt, stream) {
	const bin = BIN[backend];
	if (backend === "claude-cli") {
		if (stream) return {
			bin,
			args: [
				"-p",
				prompt,
				"--output-format",
				"stream-json",
				"--verbose"
			],
			mode: "stream-json"
		};
		return {
			bin,
			args: [
				"-p",
				prompt,
				"--output-format",
				"text"
			],
			mode: "text"
		};
	}
	if (backend === "codex-cli") return {
		bin,
		args: [
			"exec",
			"--skip-git-repo-check",
			prompt
		],
		mode: "text"
	};
	if (stream) return {
		bin,
		args: [
			"chat",
			"--stream",
			prompt
		],
		mode: "text"
	};
	return {
		bin,
		args: ["chat", prompt],
		mode: "text"
	};
}
function fallbackArgs(backend, prompt) {
	const bin = BIN[backend];
	if (backend === "claude-cli") return {
		bin,
		args: ["-p", prompt],
		mode: "text"
	};
	if (backend === "codex-cli") return {
		bin,
		args: ["exec", prompt],
		mode: "text"
	};
	if (backend === "grok-cli") return {
		bin,
		args: ["-p", prompt],
		mode: "text"
	};
	return null;
}
function extractStreamJsonToken(line) {
	const trimmed = line.trim();
	if (!trimmed.startsWith("{")) return "";
	try {
		const obj = JSON.parse(trimmed);
		if (obj.type === "content_block_delta") {
			const delta = obj.delta;
			if (delta?.text) return delta.text;
		}
		if (obj.type === "assistant" && typeof obj.message === "object" && obj.message) {
			const msg = obj.message;
			if (Array.isArray(msg.content)) return msg.content.map((c) => c.text ?? "").join("");
		}
		if (typeof obj.text === "string") return obj.text;
		if (typeof obj.content === "string") return obj.content;
		if (typeof obj.delta === "string") return obj.delta;
		if (obj.type === "item.completed" || obj.type === "message") {
			const item = obj.item;
			if (item?.text) return item.text;
			if (item?.content) return item.content;
		}
	} catch {
		return "";
	}
	return "";
}
function runProcessToQueue(bin, args, mode, push, timeoutMs = 18e4) {
	let child;
	try {
		child = spawn(bin, args, {
			env: {
				...process.env,
				FORCE_COLOR: "0",
				NO_COLOR: "1"
			},
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
	} catch (err) {
		push({
			type: "__err__",
			error: err instanceof Error ? err : new Error(String(err))
		});
		push({ type: "__end__" });
		return;
	}
	let stdout = "";
	let stderr = "";
	let lineBuf = "";
	let assembled = "";
	let sawStreamTokens = false;
	let settled = false;
	const settle = (item) => {
		if (settled) return;
		settled = true;
		clearTimeout(timer);
		if (item) push(item);
		push({ type: "__end__" });
	};
	const timer = setTimeout(() => {
		child.kill("SIGTERM");
		settle({
			type: "__err__",
			error: /* @__PURE__ */ new Error(`${bin} timed out after ${timeoutMs}ms`)
		});
	}, timeoutMs);
	child.stdout?.on("data", (chunk) => {
		const s = String(chunk);
		stdout += s;
		if (mode === "stream-json") {
			lineBuf += s;
			const parts = lineBuf.split("\n");
			lineBuf = parts.pop() ?? "";
			for (const line of parts) {
				const token = extractStreamJsonToken(line);
				if (token) {
					sawStreamTokens = true;
					assembled += token;
					push({
						type: "token",
						text: token
					});
				}
			}
		} else push({
			type: "token",
			text: s
		});
	});
	child.stderr?.on("data", (chunk) => {
		stderr += String(chunk);
	});
	child.on("error", (err) => {
		settle({
			type: "__err__",
			error: err
		});
	});
	child.on("close", (code) => {
		if (mode === "stream-json" && lineBuf.trim()) {
			const token = extractStreamJsonToken(lineBuf);
			if (token) {
				sawStreamTokens = true;
				assembled += token;
				push({
					type: "token",
					text: token
				});
			}
		}
		const finalText = (sawStreamTokens ? assembled : stdout).trim();
		if (code !== 0 && !finalText) {
			settle({
				type: "__err__",
				error: new Error(stderr.trim() || `${bin} exited ${code}`)
			});
			return;
		}
		push({
			type: "done",
			text: finalText || stdout.trim()
		});
		settle();
	});
}
async function* drainQueue(start) {
	const queue = [];
	let wake = null;
	const push = (item) => {
		queue.push(item);
		wake?.();
	};
	start(push);
	let finished = false;
	while (!finished) {
		if (queue.length === 0) {
			await new Promise((r) => {
				wake = r;
			});
			wake = null;
		}
		while (queue.length) {
			const item = queue.shift();
			if (item.type === "__end__") {
				finished = true;
				break;
			}
			if (item.type === "__err__") {
				yield {
					type: "error",
					message: item.error.message
				};
				finished = true;
				break;
			}
			yield item;
		}
	}
}
async function* streamCliAgent(backend, req) {
	if (!await which(BIN[backend])) {
		yield {
			type: "error",
			message: `${BIN[backend]} not found on PATH. Install the CLI and authenticate (claude login / codex login / grok login).`
		};
		return;
	}
	const prompt = composeCliPrompt(buildSystemPrompt(req.action), buildUserPrompt(req));
	const primary = buildArgs(backend, prompt, true);
	yield {
		type: "status",
		message: `Starting ${backend}…`
	};
	yield {
		type: "status",
		message: `$ ${primary.bin} ${primary.args[0] ?? ""} …`
	};
	let hadError = false;
	let hadDone = false;
	for await (const chunk of drainQueue((push) => runProcessToQueue(primary.bin, primary.args, primary.mode, push))) {
		if (chunk.type === "error") {
			hadError = true;
			const fb = fallbackArgs(backend, prompt);
			if (!fb) {
				yield chunk;
				return;
			}
			yield {
				type: "status",
				message: `Primary failed (${chunk.message}). Retrying fallback…`
			};
			for await (const c2 of drainQueue((push) => runProcessToQueue(fb.bin, fb.args, fb.mode, push))) {
				if (c2.type === "done") hadDone = true;
				yield c2;
			}
			return;
		}
		if (chunk.type === "done") hadDone = true;
		yield chunk;
	}
	if (!hadDone && !hadError) yield {
		type: "error",
		message: "CLI produced no output"
	};
}
async function runCliAgent(backend, req) {
	let full = "";
	let error = null;
	for await (const chunk of streamCliAgent(backend, req)) {
		if (chunk.type === "token" && chunk.text) full += chunk.text;
		if (chunk.type === "done" && chunk.text) full = chunk.text;
		if (chunk.type === "error") error = chunk.message ?? "CLI error";
	}
	if (error && !full.trim()) throw new Error(error);
	const provider = backend;
	return {
		...parseModelPayload(full, req.action, provider),
		model: backend,
		provider
	};
}
//#endregion
export { buildUserPrompt as a, buildSystemPrompt as i, isCliBackend as n, parseModelPayload as o, streamCliAgent as r, cli_backends_exports as t };
