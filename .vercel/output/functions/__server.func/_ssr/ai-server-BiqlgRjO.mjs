import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-server-BiqlgRjO.js
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
		pageText: typeof data.pageText === "string" ? data.pageText.slice(0, 2e4) : ""
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
async function callXai(system, user) {
	const apiKey = process.env.XAI_API_KEY?.trim();
	if (!apiKey) throw new Error("NO_KEY");
	const model = process.env.XAI_MODEL?.trim() || "grok-4.5";
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			temperature: .4,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		throw new Error(`xAI error ${res.status}: ${errText.slice(0, 200)}`);
	}
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) throw new Error("Empty model response");
	return {
		text,
		model
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
/** Local heuristic fallback so the preview is demoable without XAI_API_KEY. */
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
		} else if (instruction) text = `${text}\n\n(${instruction.replace(/\.$/, "")} — applied locally; connect XAI_API_KEY for full model rewrites.)`;
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
				content: unique.length > 0 ? `Based on this page (${unique.length} lines). Connect an XAI_API_KEY for full Grok responses; local mode drafted this structure from your notes.` : "Add page content, then run again — or connect XAI_API_KEY for full Grok responses."
			},
			...unique.slice(0, 4).map((c) => ({
				type: "bullet",
				content: c.slice(0, 160)
			}))
		]
	};
}
var runAi_createServerFn_handler = createServerRpc({
	id: "76d08ea8f0b0103fcaf7055c8b138a9579e4124d0d2f62a0686a1011273cd47a",
	name: "runAi",
	filename: "src/lib/ai-server.ts"
}, (opts) => runAi.__executeServer(opts));
var runAi = createServerFn({ method: "POST" }).validator((input) => validateRequest(input)).handler(runAi_createServerFn_handler, async ({ data }) => {
	const system = buildSystemPrompt(data.action);
	const user = buildUserPrompt(data);
	try {
		const { text, model } = await callXai(system, user);
		return {
			...parseModelPayload(text, data.action),
			provider: "xai",
			model
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (message === "NO_KEY" || message.startsWith("xAI error") || message.includes("fetch")) {
			const local = localAi(data);
			if (message !== "NO_KEY") {
				if (local.blocks?.[0]) local.blocks = [{
					type: "callout",
					content: `Used local AI fallback (${message.slice(0, 80)}). Set XAI_API_KEY for Grok.`
				}, ...local.blocks];
			}
			return local;
		}
		throw err;
	}
});
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "5252add61246cf72a4fa382b4734734c4e8ea74302302ba378f1ecb54d53868d",
	name: "getAiStatus",
	filename: "src/lib/ai-server.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	return {
		configured: Boolean(process.env.XAI_API_KEY?.trim()),
		model: process.env.XAI_MODEL?.trim() || "grok-4.5"
	};
});
//#endregion
export { getAiStatus_createServerFn_handler, runAi_createServerFn_handler };
