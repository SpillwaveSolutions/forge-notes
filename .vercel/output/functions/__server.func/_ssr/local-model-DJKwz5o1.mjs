//#region node_modules/.nitro/vite/services/ssr/assets/local-model-DJKwz5o1.js
/**
* Lightweight model call for harness roles using env keys.
* Avoids @/ path alias so CLI (tsx) and Vite both work.
*/
async function runHarnessModel(opts) {
	const xaiKey = process.env.XAI_API_KEY?.trim() || "";
	const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim() || "";
	const openaiKey = process.env.OPENAI_API_KEY?.trim() || "";
	const xaiModel = process.env.XAI_MODEL?.trim() || "grok-4.5";
	if (!xaiKey && !anthropicKey && !openaiKey) throw new Error("NO_KEY");
	if (xaiKey) {
		const { ChatXAI } = await import("../_libs/langchain__xai.mjs").then((n) => n.t);
		return contentToText((await new ChatXAI({
			apiKey: xaiKey,
			model: opts.model || xaiModel,
			temperature: .3
		}).invoke([{
			role: "system",
			content: opts.system
		}, {
			role: "user",
			content: opts.user
		}])).content);
	}
	if (anthropicKey) {
		const { ChatAnthropic } = await import("../_libs/@langchain/anthropic+[...].mjs").then((n) => n.t);
		return contentToText((await new ChatAnthropic({
			apiKey: anthropicKey,
			model: opts.model || "claude-sonnet-4-6",
			temperature: .3
		}).invoke([{
			role: "system",
			content: opts.system
		}, {
			role: "user",
			content: opts.user
		}])).content);
	}
	const { ChatOpenAI } = await import("../_libs/langchain__openai+openai.mjs").then((n) => n.t);
	return contentToText((await new ChatOpenAI({
		apiKey: openaiKey,
		model: opts.model || "gpt-4.1",
		temperature: .3
	}).invoke([{
		role: "system",
		content: opts.system
	}, {
		role: "user",
		content: opts.user
	}])).content);
}
function contentToText(content) {
	if (typeof content === "string") return content.trim();
	if (Array.isArray(content)) return content.map((c) => typeof c === "string" ? c : c.text ?? "").join("").trim();
	return String(content ?? "").trim();
}
//#endregion
export { runHarnessModel };
