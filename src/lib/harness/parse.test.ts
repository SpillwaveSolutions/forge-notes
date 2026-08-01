import { describe, expect, it } from "vitest";
import { dumpAgentYaml, parseAgentYaml, parseWorkflowYaml } from "@/lib/harness/parse";

describe("parseAgentYaml", () => {
  const valid = `
name: reviewer
prompt: Review the diff.
executor:
  harness: claude
`;

  it("parses a minimal agent and trims the name", () => {
    const agent = parseAgentYaml("name: '  spaced  '\nprompt: p\nexecutor:\n  harness: claude\n");
    expect(agent.name).toBe("spaced");
    expect(agent.executor.harness).toBe("claude");
  });

  it("keeps optional executor fields only when correctly typed", () => {
    const agent = parseAgentYaml(`
name: a
prompt: p
executor:
  harness: codex
  model: gpt-5
  timeoutMs: 1000
  args: [--flag, 2]
`);
    expect(agent.executor.model).toBe("gpt-5");
    expect(agent.executor.timeoutMs).toBe(1000);
    // args are coerced to strings, so a YAML number survives as "2"
    expect(agent.executor.args).toEqual(["--flag", "2"]);
  });

  it("drops wrongly-typed optional fields instead of throwing", () => {
    const agent = parseAgentYaml(`
name: a
prompt: p
executor:
  harness: claude
  model: 42
  timeoutMs: "nope"
tools: not-an-array
`);
    expect(agent.executor.model).toBeUndefined();
    expect(agent.executor.timeoutMs).toBeUndefined();
    expect(agent.tools).toBeUndefined();
  });

  it.each([
    ["null document", "null", "Invalid agent YAML"],
    ["missing name", "prompt: p\nexecutor:\n  harness: c\n", "requires `name`"],
    ["blank name", "name: '   '\nprompt: p\nexecutor:\n  harness: c\n", "requires `name`"],
    ["missing prompt", "name: a\nexecutor:\n  harness: c\n", "requires `prompt`"],
    ["missing harness", "name: a\nprompt: p\n", "requires `executor.harness`"],
  ])("rejects %s", (_label, yaml, message) => {
    expect(() => parseAgentYaml(yaml)).toThrow(message);
  });

  it("round-trips through dumpAgentYaml", () => {
    const agent = parseAgentYaml(valid);
    expect(parseAgentYaml(dumpAgentYaml(agent))).toEqual(agent);
  });
});

describe("parseWorkflowYaml", () => {
  it("fills default artifact paths when absent", () => {
    const wf = parseWorkflowYaml("name: build\nphases: []\n");
    expect(wf.artifacts.planPath).toBe("harness/plans/{feature}-plan.md");
    expect(wf.artifacts.runDir).toBe("harness/artifacts/{runId}");
  });

  it("keeps explicit artifact paths", () => {
    const wf = parseWorkflowYaml("name: b\nphases: []\nartifacts:\n  runDir: custom/{runId}\n");
    expect(wf.artifacts.runDir).toBe("custom/{runId}");
    // the unspecified one still falls back
    expect(wf.artifacts.planPath).toBe("harness/plans/{feature}-plan.md");
  });

  it.each([
    ["null document", "null", "Invalid workflow YAML"],
    ["missing name", "phases: []\n", "requires `name`"],
    ["missing phases", "name: b\n", "requires `phases`"],
    ["non-array phases", "name: b\nphases: nope\n", "requires `phases`"],
  ])("rejects %s", (_label, yaml, message) => {
    expect(() => parseWorkflowYaml(yaml)).toThrow(message);
  });
});
