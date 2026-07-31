import type { BlockType } from "@/lib/types";
import type { AiAction, AiGeneratedBlock, AiRequest, AiResponse } from "@/lib/ai/types";

export function buildSystemPrompt(action: AiAction): string {
  const base =
    "You help edit a Notion-style notes workspace. Be concise, high-signal, and practical. Never use emoji unless the user asks. Return only the content requested — no preamble.";
  switch (action) {
    case "edit_block":
      return `${base} Rewrite the given block text per the instruction. Return plain text only (no quotes around the whole answer).`;
    case "summarize":
      return `${base} Summarize the page. Return JSON: {"blocks":[{"type":"heading2","content":"..."},{"type":"paragraph","content":"..."},{"type":"bullet","content":"..."}]} using types paragraph|heading1|heading2|heading3|bullet|numbered|todo|quote|callout|code|mermaid.`;
    case "action_items":
      return `${base} Extract action items as todos. Return JSON: {"blocks":[{"type":"heading2","content":"Action items"},{"type":"todo","content":"..."}]} only.`;
    case "table":
      return `${base} Create a markdown table from the page. Return JSON: {"blocks":[{"type":"heading2","content":"..."},{"type":"code","content":"| Col | ... |\\n|---|---|\\n| ... |"}]} — put the table in a code block.`;
    case "outline":
      return `${base} Create a hierarchical outline. Return JSON: {"blocks":[{"type":"heading2","content":"Outline"},{"type":"bullet","content":"..."},{"type":"bullet","content":"..."}]} .`;
    case "mermaid":
      return `${base} Create a Mermaid diagram for the page. Return JSON: {"blocks":[{"type":"heading2","content":"Diagram"},{"type":"mermaid","content":"flowchart TD\\n  A-->B"}]} . Valid mermaid only in content.`;
    case "custom":
      return `${base} Follow the user instruction using the page context. Prefer JSON {"blocks":[...]} when creating multiple blocks; otherwise plain text in {"text":"..."}. Allowed block types: paragraph,heading1,heading2,heading3,bullet,numbered,todo,quote,callout,code,mermaid.`;
    default:
      return base;
  }
}

export function buildUserPrompt(req: AiRequest): string {
  const parts: string[] = [];
  if (req.pageTitle) parts.push(`Page title: ${req.pageTitle}`);
  if (req.pageText) parts.push(`Page content:\n${req.pageText}`);
  if (req.blockText) parts.push(`Block (${req.blockType ?? "text"}):\n${req.blockText}`);
  if (req.instruction) parts.push(`Instruction:\n${req.instruction}`);
  if (req.action === "edit_block" && !req.instruction) {
    parts.push("Instruction: Improve clarity and fix grammar while preserving meaning.");
  }
  return parts.join("\n\n") || "Empty page.";
}

export function parseModelPayload(
  raw: string,
  action: AiAction,
  provider: AiResponse["provider"] = "local",
): AiResponse {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? raw).trim();
  try {
    const parsed = JSON.parse(candidate) as {
      text?: string;
      blocks?: AiGeneratedBlock[];
    };
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return {
        text: parsed.text ?? "",
        blocks: parsed.blocks
          .filter((b) => b && typeof b.content === "string")
          .map((b) => ({
            type: (b.type as BlockType) || "paragraph",
            content: String(b.content),
          })),
        provider,
      };
    }
    if (typeof parsed.text === "string") {
      return { text: parsed.text, provider };
    }
  } catch {
    // plain text
  }

  if (action === "edit_block" || action === "custom") {
    return { text: raw.replace(/^["']|["']$/g, "").trim(), provider };
  }

  return {
    text: raw,
    blocks: [{ type: "paragraph", content: raw }],
    provider,
  };
}

export function composeCliPrompt(system: string, user: string): string {
  return `${system}\n\n---\n\n${user}`;
}
