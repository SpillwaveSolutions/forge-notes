import { describe, expect, it } from "vitest";
import { cliOutputMode, extractStreamJsonToken, isCliBackend } from "./cli-protocol";

describe("isCliBackend", () => {
  it("accepts exactly the three CLI backends", () => {
    expect(isCliBackend("grok-cli")).toBe(true);
    expect(isCliBackend("claude-cli")).toBe(true);
    expect(isCliBackend("codex-cli")).toBe(true);
  });

  it("rejects the server-backed modes and junk", () => {
    for (const id of ["deepagents", "direct", "local", "", null, undefined]) {
      expect(isCliBackend(id)).toBe(false);
    }
  });
});

describe("extractStreamJsonToken", () => {
  it("pulls text out of an anthropic content_block_delta", () => {
    expect(
      extractStreamJsonToken('{"type":"content_block_delta","delta":{"type":"text_delta","text":"Hi"}}'),
    ).toBe("Hi");
  });

  it("joins the parts of an assistant message", () => {
    expect(
      extractStreamJsonToken('{"type":"assistant","message":{"content":[{"text":"a"},{"text":"b"}]}}'),
    ).toBe("ab");
  });

  it("returns empty for frames that carry no text", () => {
    // The caller treats "" as "nothing to append", so non-token frames must not
    // leak their JSON into the note.
    expect(extractStreamJsonToken('{"type":"tool_use","id":"x"}')).toBe("");
    expect(extractStreamJsonToken("")).toBe("");
    expect(extractStreamJsonToken("not json at all")).toBe("");
    expect(extractStreamJsonToken("{ broken")).toBe("");
  });
});

describe("cliOutputMode", () => {
  it("asks only Claude for structured frames", () => {
    expect(cliOutputMode("claude-cli")).toBe("stream-json");
    expect(cliOutputMode("grok-cli")).toBe("text");
    expect(cliOutputMode("codex-cli")).toBe("text");
  });
});
