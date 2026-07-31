import { createFileRoute } from "@tanstack/react-router";
import type { AiAction, AiRequest, AiStreamEvent } from "@/lib/ai/types";
import type { UserAiSettings } from "@/lib/ai/settings-types";
import { isCliBackend, streamCliAgent } from "@/lib/ai/cli-backends";
import {
  buildSystemPrompt,
  buildUserPrompt,
  parseModelPayload,
} from "@/lib/ai/prompts";
import { hasLiveCredentials, resolveChatModel } from "@/lib/ai/resolve-model";

function sse(event: AiStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function validateBody(raw: unknown): {
  req: AiRequest;
  clientSettings: UserAiSettings | null;
  backendOverride?: string;
} {
  const data = raw as {
    action?: AiAction;
    instruction?: string;
    blockText?: string;
    blockType?: AiRequest["blockType"];
    pageTitle?: string;
    pageText?: string;
    clientSettings?: UserAiSettings | null;
    backend?: string;
  };
  const allowed: AiAction[] = [
    "edit_block",
    "summarize",
    "action_items",
    "table",
    "outline",
    "mermaid",
    "custom",
  ];
  if (!data?.action || !allowed.includes(data.action)) {
    throw new Error("Invalid action");
  }
  return {
    req: {
      action: data.action,
      instruction: typeof data.instruction === "string" ? data.instruction.slice(0, 4000) : "",
      blockText: typeof data.blockText === "string" ? data.blockText.slice(0, 8000) : "",
      blockType: data.blockType,
      pageTitle: typeof data.pageTitle === "string" ? data.pageTitle.slice(0, 500) : "",
      pageText: typeof data.pageText === "string" ? data.pageText.slice(0, 20000) : "",
    },
    clientSettings: data.clientSettings ?? null,
    backendOverride: typeof data.backend === "string" ? data.backend : undefined,
  };
}

function resolveBackend(settings: UserAiSettings | null, override?: string): string {
  if (override) return override;
  if (!settings) return "local";
  if (!settings.enabled) return "local";
  return settings.backend;
}

async function* streamDirect(
  settings: UserAiSettings | null,
  req: AiRequest,
): AsyncGenerator<AiStreamEvent> {
  if (!hasLiveCredentials(settings) && settings?.provider !== "ollama") {
    // try env
    if (
      !process.env.XAI_API_KEY &&
      !process.env.ANTHROPIC_API_KEY &&
      !process.env.OPENAI_API_KEY
    ) {
      yield { type: "error", message: "No API credentials for direct streaming" };
      return;
    }
  }
  yield { type: "status", message: "Streaming from model…" };
  const { model, provider, modelName } = await resolveChatModel(settings);
  const system = buildSystemPrompt(req.action);
  const user = buildUserPrompt(req);

  // Prefer LangChain stream if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = model as any;
  let full = "";
  if (typeof m.stream === "function") {
    const stream = await m.stream([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    for await (const chunk of stream) {
      const content = chunk?.content;
      let piece = "";
      if (typeof content === "string") piece = content;
      else if (Array.isArray(content)) {
        piece = content
          .map((c: unknown) =>
            typeof c === "string" ? c : ((c as { text?: string }).text ?? ""),
          )
          .join("");
      }
      if (piece) {
        full += piece;
        yield { type: "token", text: piece };
      }
    }
  } else {
    const res = await model.invoke([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    full =
      typeof res.content === "string"
        ? res.content
        : Array.isArray(res.content)
          ? res.content
              .map((c) => (typeof c === "string" ? c : (c as { text?: string }).text ?? ""))
              .join("")
          : String(res.content ?? "");
    yield { type: "token", text: full };
  }

  const result = {
    ...parseModelPayload(full, req.action, "direct"),
    model: `${provider}:${modelName}`,
    provider: "direct" as const,
  };
  yield { type: "done", text: full, result };
}

export const Route = createFileRoute("/api/ai/stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
        }

        let parsed: ReturnType<typeof validateBody>;
        try {
          parsed = validateBody(body);
        } catch (e) {
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Bad request" }),
            { status: 400 },
          );
        }

        const backend = resolveBackend(parsed.clientSettings, parsed.backendOverride);
        const encoder = new TextEncoder();

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const send = (ev: AiStreamEvent) => {
              controller.enqueue(encoder.encode(sse(ev)));
            };
            try {
              if (isCliBackend(backend)) {
                let full = "";
                for await (const chunk of streamCliAgent(backend, parsed.req)) {
                  if (chunk.type === "token" && chunk.text) {
                    full += chunk.text;
                    send({ type: "token", text: chunk.text });
                  } else if (chunk.type === "status") {
                    send({ type: "status", message: chunk.message });
                  } else if (chunk.type === "done") {
                    full = chunk.text || full;
                    const result = {
                      ...parseModelPayload(full, parsed.req.action, backend),
                      model: backend,
                      provider: backend,
                    };
                    send({ type: "done", text: full, result });
                  } else if (chunk.type === "error") {
                    send({ type: "error", message: chunk.message });
                  }
                }
              } else if (backend === "direct" || backend === "deepagents") {
                // Stream tokens for direct; deepagents falls through to direct stream
                // then one-shot if needed
                try {
                  for await (const ev of streamDirect(parsed.clientSettings, parsed.req)) {
                    send(ev);
                  }
                } catch (err) {
                  send({
                    type: "error",
                    message: err instanceof Error ? err.message : String(err),
                  });
                }
              } else {
                send({
                  type: "status",
                  message: "Local demo (no live stream)",
                });
                const demo =
                  "Local demo mode. Choose Claude Code, Codex, Grok CLI, or configure an API key for live generation.";
                send({ type: "token", text: demo });
                send({
                  type: "done",
                  text: demo,
                  result: {
                    text: demo,
                    provider: "local",
                    blocks: [{ type: "paragraph", content: demo }],
                  },
                });
              }
            } catch (err) {
              send({
                type: "error",
                message: err instanceof Error ? err.message : String(err),
              });
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
