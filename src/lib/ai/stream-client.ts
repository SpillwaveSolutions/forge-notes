import type { AiRequest, AiResponse, AiStreamEvent } from "@/lib/ai/types";
import type { UserAiSettings } from "@/lib/ai/settings-types";

export interface StreamAiOptions {
  request: AiRequest;
  clientSettings: UserAiSettings | null;
  /** Force backend (e.g. claude-cli) */
  backend?: string;
  signal?: AbortSignal;
  onToken?: (text: string, full: string) => void;
  onStatus?: (message: string) => void;
  onDone?: (result: AiResponse, full: string) => void;
  onError?: (message: string) => void;
}

/**
 * Stream AI generation via SSE (`POST /api/ai/stream`).
 * Prefers coding-agent CLIs when selected in settings (claude / codex / grok).
 */
export async function streamAi(opts: StreamAiOptions): Promise<AiResponse> {
  const res = await fetch("/api/ai/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({
      ...opts.request,
      clientSettings: opts.clientSettings,
      backend: opts.backend,
    }),
    signal: opts.signal,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `Stream failed (${res.status})`);
  }
  if (!res.body) throw new Error("No response body for stream");

  // `res.ok` is NOT enough. The packaged desktop app has no server, and Tauri's
  // asset protocol answers an unknown path with `index.html` and HTTP **200** —
  // so this reads as success, the SSE parser is handed HTML, finds no `data:`
  // lines, and returns an empty result with no error. Pressing Run then does
  // visibly nothing at all, which is how this shipped unnoticed.
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("text/event-stream")) {
    throw new Error(
      contentType.includes("text/html")
        ? "AI needs the ForgeNotes server, and this build has none reachable. " +
          "Run `npm run dev` and reopen the desktop app, or use the web app."
        : `Expected an event stream, got ${contentType || "no content type"}.`,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  let final: AiResponse | null = null;
  let streamError: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Parse SSE frames
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const line = part
        .split("\n")
        .filter((l) => l.startsWith("data:"))
        .map((l) => l.slice(5).trim())
        .join("");
      if (!line) continue;
      let ev: AiStreamEvent;
      try {
        ev = JSON.parse(line) as AiStreamEvent;
      } catch {
        continue;
      }
      if (ev.type === "token" && ev.text) {
        full += ev.text;
        opts.onToken?.(ev.text, full);
      } else if (ev.type === "status" && ev.message) {
        opts.onStatus?.(ev.message);
      } else if (ev.type === "done") {
        if (ev.text) full = ev.text;
        if (ev.result) final = ev.result;
        else {
          final = {
            text: full,
            provider: "local",
          };
        }
        opts.onDone?.(final, full);
      } else if (ev.type === "error") {
        streamError = ev.message || "Stream error";
        opts.onError?.(streamError);
      }
    }
  }

  if (streamError && !final && !full.trim()) {
    throw new Error(streamError);
  }

  return (
    final ?? {
      text: full,
      provider: "local",
    }
  );
}
