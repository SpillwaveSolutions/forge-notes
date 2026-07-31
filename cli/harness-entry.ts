/**
 * JSON CLI entry for meta-harness ops (invoked by wks.mjs via tsx).
 */
import {
  getHarnessStatus,
  runAgentFile,
  runWorkflow,
} from "../src/lib/harness/runner";

const [op, ...rest] = process.argv.slice(2);

async function main() {
  if (op === "status") {
    console.log(JSON.stringify(await getHarnessStatus()));
    return;
  }
  if (op === "run-agent") {
    const [agent, message, backend] = rest;
    const result = await runAgentFile({
      agentPath: agent!,
      message: message || "Hello",
      backendOverride: backend || undefined,
    });
    console.log(JSON.stringify(result));
    return;
  }
  if (op === "run-workflow") {
    const [wf, feature, backend] = rest;
    const result = await runWorkflow({
      workflowPath: wf!,
      feature: feature || "feature",
      backendOverride: backend || undefined,
    });
    console.log(JSON.stringify(result));
    return;
  }
  throw new Error(`Unknown op: ${op}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
