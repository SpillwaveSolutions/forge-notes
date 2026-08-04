/**
 * Pure helpers for talking to the coding-agent CLIs.
 *
 * Split out of `cli-backends.ts` because that module imports `node:child_process`
 * and `node:fs`, so it can only ever run server-side. The desktop app spawns the
 * same CLIs through Rust and has to parse the same stdout, so the parsing had to
 * live somewhere both halves can import. Nothing here touches Node or the DOM.
 */

export type CliBackendId = "claude-cli" | "codex-cli" | "grok-cli";

export function isCliBackend(id: string | undefined | null): id is CliBackendId {
  return id === "claude-cli" || id === "codex-cli" || id === "grok-cli";
}

/**
 * Pull the text out of one line of `claude --output-format stream-json`.
 *
 * Returns "" for anything that is not a token-bearing frame — progress records,
 * tool-use blocks, blank lines — so callers can treat "" as "nothing to append"
 * rather than having to know the frame taxonomy.
 */
export function extractStreamJsonToken(line: string): string {
  const trimmed = line.trim();
  if (!trimmed.startsWith("{")) return "";
  try {
    const obj = JSON.parse(trimmed) as Record<string, unknown>;
    if (obj.type === "content_block_delta") {
      const delta = obj.delta as { type?: string; text?: string } | undefined;
      if (delta?.text) return delta.text;
    }
    if (obj.type === "assistant" && typeof obj.message === "object" && obj.message) {
      const msg = obj.message as { content?: Array<{ type?: string; text?: string }> };
      if (Array.isArray(msg.content)) {
        return msg.content.map((c) => c.text ?? "").join("");
      }
    }
    if (typeof obj.text === "string") return obj.text;
    if (typeof obj.content === "string") return obj.content;
    if (typeof obj.delta === "string") return obj.delta;
    if (obj.type === "item.completed" || obj.type === "message") {
      const item = obj.item as { text?: string; content?: string } | undefined;
      if (item?.text) return item.text;
      if (item?.content) return item.content;
    }
  } catch {
    return "";
  }
  return "";
}

/**
 * Order the desktop app tries local CLIs in, best first.
 *
 * Grok leads because its headless one-shot (`grok -p`) is the cheapest thing to
 * run; Claude follows because `--output-format stream-json` yields real token
 * deltas, so the preview fills in as it generates rather than all at once.
 */
export const CLI_PREFERENCE = ["grok-cli", "claude-cli", "codex-cli"] as const;

/** Only `claude-cli` is asked for structured frames; the others emit plain text. */
export function cliOutputMode(backend: CliBackendId): "stream-json" | "text" {
  return backend === "claude-cli" ? "stream-json" : "text";
}
