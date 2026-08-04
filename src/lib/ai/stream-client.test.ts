import { afterEach, describe, expect, it, vi } from "vitest";
import { streamAi } from "./stream-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

function respond(body: string, contentType: string, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(body, { status, headers: { "content-type": contentType } })),
  );
}

const REQUEST: Parameters<typeof streamAi>[0] = {
  request: { action: "summarize" },
  clientSettings: null,
};

describe("streamAi", () => {
  it("rejects an HTML body served with 200", async () => {
    // Tauri's asset protocol answers unknown paths with index.html and HTTP
    // 200. Without a content-type check the SSE parser finds no `data:` lines
    // and returns an empty success — the AI block runs and shows nothing, with
    // no error anywhere. A silent no-op is worse than a visible failure.
    respond("<!DOCTYPE html><html><body></body></html>", "text/html");
    await expect(streamAi(REQUEST)).rejects.toThrow(/needs the ForgeNotes server/);
  });

  it("rejects any other non-stream content type", async () => {
    respond('{"error":"nope"}', "application/json");
    await expect(streamAi(REQUEST)).rejects.toThrow(/Expected an event stream/);
  });

  it("still fails loudly on a non-ok response", async () => {
    respond("upstream exploded", "text/plain", 500);
    await expect(streamAi(REQUEST)).rejects.toThrow(/upstream exploded/);
  });

  it("parses a real event stream", async () => {
    respond(
      'data: {"type":"token","text":"Hel"}\n\n' +
        'data: {"type":"token","text":"lo"}\n\n' +
        'data: {"type":"done"}\n\n',
      "text/event-stream",
    );
    const tokens: string[] = [];
    const res = await streamAi({ ...REQUEST, onToken: (t) => tokens.push(t) });
    expect(tokens).toEqual(["Hel", "lo"]);
    expect(res.text).toBe("Hello");
  });
});
