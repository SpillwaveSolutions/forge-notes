/**
 * Lightweight model call for harness roles using env keys.
 * Avoids @/ path alias so CLI (tsx) and Vite both work.
 */
export async function runHarnessModel(opts: {
  system: string;
  user: string;
  model?: string;
  mode: "deepagents" | "direct";
}): Promise<string> {
  const xaiKey = process.env.XAI_API_KEY?.trim() || "";
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim() || "";
  const openaiKey = process.env.OPENAI_API_KEY?.trim() || "";
  const xaiModel = process.env.XAI_MODEL?.trim() || "grok-4.5";

  if (!xaiKey && !anthropicKey && !openaiKey) {
    throw new Error("NO_KEY");
  }

  if (xaiKey) {
    const { ChatXAI } = await import("@langchain/xai");
    const model = new ChatXAI({
      apiKey: xaiKey,
      model: opts.model || xaiModel,
      temperature: 0.3,
    });
    const res = await model.invoke([
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ]);
    return contentToText(res.content);
  }

  if (anthropicKey) {
    const { ChatAnthropic } = await import("@langchain/anthropic");
    const model = new ChatAnthropic({
      apiKey: anthropicKey,
      model: opts.model || "claude-sonnet-4-6",
      temperature: 0.3,
    });
    const res = await model.invoke([
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ]);
    return contentToText(res.content);
  }

  const { ChatOpenAI } = await import("@langchain/openai");
  const model = new ChatOpenAI({
    apiKey: openaiKey,
    model: opts.model || "gpt-4.1",
    temperature: 0.3,
  });
  const res = await model.invoke([
    { role: "system", content: opts.system },
    { role: "user", content: opts.user },
  ]);
  return contentToText(res.content);
}

function contentToText(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === "string" ? c : (c as { text?: string }).text ?? ""))
      .join("")
      .trim();
  }
  return String(content ?? "").trim();
}
