import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as load } from "../_libs/js-yaml.mjs";
import { spawn } from "node:child_process";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Bvhad4nz.js
function parseAgentYaml(text) {
	const doc = load(text);
	if (!doc || typeof doc !== "object") throw new Error("Invalid agent YAML");
	if (typeof doc.name !== "string" || !doc.name.trim()) throw new Error("Agent YAML requires `name`");
	if (typeof doc.prompt !== "string") throw new Error("Agent YAML requires `prompt`");
	const exec = doc.executor ?? {};
	if (typeof exec.harness !== "string") throw new Error("Agent YAML requires `executor.harness`");
	return {
		name: doc.name.trim(),
		description: typeof doc.description === "string" ? doc.description : void 0,
		prompt: doc.prompt,
		executor: {
			harness: exec.harness,
			model: typeof exec.model === "string" ? exec.model : void 0,
			command: typeof exec.command === "string" ? exec.command : void 0,
			args: Array.isArray(exec.args) ? exec.args.map(String) : void 0,
			cwd: typeof exec.cwd === "string" ? exec.cwd : void 0,
			timeoutMs: typeof exec.timeoutMs === "number" ? exec.timeoutMs : void 0,
			auth: exec.auth
		},
		tools: Array.isArray(doc.tools) ? doc.tools : void 0,
		policies: doc.policies,
		os_env: doc.os_env
	};
}
function parseWorkflowYaml(text) {
	const doc = load(text);
	if (!doc || typeof doc !== "object") throw new Error("Invalid workflow YAML");
	if (typeof doc.name !== "string") throw new Error("Workflow requires `name`");
	if (!Array.isArray(doc.phases)) throw new Error("Workflow requires `phases`");
	const artifacts = doc.artifacts ?? {};
	return {
		name: doc.name,
		description: typeof doc.description === "string" ? doc.description : void 0,
		feature: typeof doc.feature === "string" ? doc.feature : void 0,
		phases: doc.phases,
		artifacts: {
			planPath: artifacts.planPath || "harness/plans/{feature}-plan.md",
			runDir: artifacts.runDir || "harness/artifacts/{runId}"
		},
		policies: doc.policies
	};
}
async function commandExists(cmd) {
	const bin = cmd.split(/\s+/)[0];
	if (bin.includes("/")) try {
		await access(bin, constants.X_OK);
		return true;
	} catch {
		return false;
	}
	return new Promise((resolve) => {
		const child = spawn("which", [bin], { stdio: "ignore" });
		child.on("close", (code) => resolve(code === 0));
		child.on("error", () => resolve(false));
	});
}
async function listBackends() {
	const candidates = [
		{
			id: "local-deepagents",
			label: "Workspace Deep Agents (LangChain)",
			kind: "builtin",
			notes: "In-process via workspace AI settings / XAI_API_KEY"
		},
		{
			id: "local-direct",
			label: "Workspace direct chat",
			kind: "builtin",
			notes: "Single-shot model call without agent loop"
		},
		{
			id: "mock",
			label: "Mock (deterministic demo)",
			kind: "mock",
			notes: "No external deps — always available for dry-runs"
		},
		{
			id: "claude-cli",
			label: "Claude Code CLI",
			kind: "cli",
			command: "claude",
			check: "claude",
			notes: "Anthropic Claude Code"
		},
		{
			id: "codex-cli",
			label: "Codex CLI",
			kind: "cli",
			command: "codex",
			check: "codex",
			notes: "OpenAI Codex"
		},
		{
			id: "cursor-cli",
			label: "Cursor agent CLI",
			kind: "cli",
			command: "cursor-agent",
			check: "cursor-agent"
		},
		{
			id: "grok-build",
			label: "Grok Build (ACP)",
			kind: "acp",
			command: "grok agent --always-approve stdio",
			check: "grok",
			notes: "Register as acp:grok-build in Omnigent; auth via grok login"
		},
		{
			id: "opencode",
			label: "OpenCode",
			kind: "cli",
			command: "opencode",
			check: "opencode"
		},
		{
			id: "hermes",
			label: "Hermes",
			kind: "cli",
			command: "hermes",
			check: "hermes"
		},
		{
			id: "pi",
			label: "Pi",
			kind: "cli",
			command: "pi",
			check: "pi"
		},
		{
			id: "shell",
			label: "Generic shell command",
			kind: "cli",
			notes: "executor.command required in agent YAML"
		},
		{
			id: "acp",
			label: "Generic ACP agent",
			kind: "acp",
			notes: "executor.command must speak Agent Client Protocol on stdio"
		}
	];
	const out = [];
	for (const c of candidates) {
		let available = c.kind === "builtin" || c.kind === "mock";
		if (c.check) available = await commandExists(c.check);
		if (c.id === "shell" || c.id === "acp") available = true;
		out.push({
			id: c.id,
			label: c.label,
			kind: c.kind,
			available,
			command: c.command,
			notes: c.notes
		});
	}
	return out;
}
function emit(onEvent, partial) {
	onEvent?.(partial);
}
async function executeAgent(input) {
	const harness = String(input.agent.executor.harness);
	const fullPrompt = [
		input.agent.prompt.trim(),
		input.context ? `\n\n## Context\n${input.context}` : "",
		`\n\n## Task\n${input.userMessage}`
	].join("");
	emit(input.onEvent, {
		phase: "execute",
		roleId: input.agent.name,
		level: "info",
		message: `Running via backend \`${harness}\``
	});
	if (harness === "mock") {
		const text = mockRespond(input.agent.name, input.userMessage);
		emit(input.onEvent, {
			phase: "execute",
			roleId: input.agent.name,
			level: "result",
			message: text.slice(0, 200)
		});
		return {
			text,
			backend: "mock",
			ok: true
		};
	}
	if (harness === "local-deepagents" || harness === "local-direct") try {
		const { runHarnessModel } = await import("./local-model-DJKwz5o1.mjs");
		const text = await runHarnessModel({
			system: input.agent.prompt,
			user: `${input.context ? input.context + "\n\n" : ""}${input.userMessage}`,
			model: input.agent.executor.model,
			mode: harness === "local-direct" ? "direct" : "deepagents"
		});
		emit(input.onEvent, {
			phase: "execute",
			roleId: input.agent.name,
			level: "result",
			message: text.slice(0, 240)
		});
		return {
			text,
			backend: harness,
			ok: true
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		emit(input.onEvent, {
			phase: "execute",
			roleId: input.agent.name,
			level: "warn",
			message: `Live model unavailable (${message}); using mock fallback`
		});
		return {
			text: mockRespond(input.agent.name, input.userMessage),
			backend: "mock",
			ok: true,
			error: message
		};
	}
	if (harness === "shell" || harness === "acp" || harness === "claude-cli" || harness === "codex-cli" || harness === "cursor-cli" || harness === "grok-build" || harness === "opencode" || harness === "hermes" || harness === "pi" || harness.startsWith("acp:")) {
		const cmd = resolveCliCommand(harness, input.agent);
		if (!cmd) return {
			text: "",
			backend: harness,
			ok: false,
			error: `No command configured for harness ${harness}`
		};
		try {
			const text = await runShellAgent(cmd, fullPrompt, input.agent.executor.timeoutMs ?? 12e4);
			emit(input.onEvent, {
				phase: "execute",
				roleId: input.agent.name,
				level: "result",
				message: text.slice(0, 240)
			});
			return {
				text,
				backend: harness,
				ok: true
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			emit(input.onEvent, {
				phase: "execute",
				roleId: input.agent.name,
				level: "error",
				message
			});
			return {
				text: `${mockRespond(input.agent.name, input.userMessage)}\n\n_Note: CLI backend \`${harness}\` failed: ${message}_`,
				backend: harness,
				ok: false,
				error: message
			};
		}
	}
	return {
		text: "",
		backend: harness,
		ok: false,
		error: `Unknown harness: ${harness}`
	};
}
function resolveCliCommand(harness, agent) {
	if (agent.executor.command) {
		const parts = agent.executor.command.split(/\s+/).filter(Boolean);
		return {
			bin: parts[0],
			args: [...parts.slice(1), ...agent.executor.args ?? []]
		};
	}
	const map = {
		"claude-cli": {
			bin: "claude",
			args: ["-p"]
		},
		"codex-cli": {
			bin: "codex",
			args: ["exec"]
		},
		"cursor-cli": {
			bin: "cursor-agent",
			args: []
		},
		"grok-build": {
			bin: "grok",
			args: [
				"agent",
				"--always-approve",
				"stdio"
			]
		},
		opencode: {
			bin: "opencode",
			args: ["run"]
		},
		hermes: {
			bin: "hermes",
			args: []
		},
		pi: {
			bin: "pi",
			args: []
		}
	};
	if (harness.startsWith("acp:")) return map["grok-build"] ?? null;
	return map[harness] ?? null;
}
function runShellAgent(cmd, prompt, timeoutMs) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd.bin, cmd.args, {
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: process.env
		});
		let stdout = "";
		let stderr = "";
		const timer = setTimeout(() => {
			child.kill("SIGTERM");
			reject(/* @__PURE__ */ new Error(`Timeout after ${timeoutMs}ms`));
		}, timeoutMs);
		child.stdout.on("data", (d) => {
			stdout += String(d);
		});
		child.stderr.on("data", (d) => {
			stderr += String(d);
		});
		child.on("error", (err) => {
			clearTimeout(timer);
			reject(err);
		});
		child.on("close", (code) => {
			clearTimeout(timer);
			if (code !== 0 && !stdout.trim()) {
				reject(new Error(stderr.trim() || `Exit ${code}`));
				return;
			}
			resolve(stdout.trim() || stderr.trim());
		});
		child.stdin.write(prompt);
		child.stdin.end();
	});
}
function mockRespond(agentName, task) {
	const short = task.slice(0, 160).replace(/\n/g, " ");
	const name = agentName.toLowerCase();
	if (name.includes("review")) return [
		`# Review (read-only)`,
		``,
		`## Blocking`,
		`- None identified in mock mode`,
		``,
		`## Non-blocking`,
		`- Add edge-case tests for error paths`,
		`- Document public API surface`,
		``,
		`_Reviewer agent: ${agentName}_`,
		`_Scope: ${short}_`
	].join("\n");
	if (name.includes("validat")) return [
		`# Validation`,
		``,
		`- Tests: simulated green (mock backend)`,
		`- Blocking review items: none or addressed`,
		`- Remaining risks: mock run — re-run with a live CLI for real signal`,
		``,
		`## Summary`,
		`Feature task completed under meta-harness workflow.`,
		``,
		`_Validator: ${agentName}_`
	].join("\n");
	if (name.includes("orchestr") || name.includes("plan") || /create a plan|decompos/i.test(task)) return [
		`# Plan`,
		``,
		`## Package A — Core utilities`,
		`- Acceptance: pure functions covered by unit tests`,
		``,
		`## Package B — API / integration surface`,
		`- Acceptance: endpoints return expected contracts`,
		``,
		`## Package C — Tests & docs`,
		`- Acceptance: suite green; README updated`,
		``,
		`_Generated by mock harness for: ${short}_`
	].join("\n");
	if (name.includes("hello") || /\?/.test(task)) return [
		`A **meta-harness** is a thin compatibility layer above coding agents.`,
		``,
		`You define workflow once (policies, plan → implement → review → validate, durable artifacts)`,
		`and treat Claude Code, Codex, Grok Build, etc. as pluggable backends via \`executor.harness\`.`,
		``,
		`The lock-in you avoid is not the model — it is the automation wired to one vendor CLI.`,
		``,
		`_Mock agent: ${agentName}_`
	].join("\n");
	return [
		`# Implementation notes (${agentName})`,
		``,
		`Scope: ${short}`,
		``,
		`- Stayed within package boundary`,
		`- Left local tests green (simulated)`,
		`- Ready for independent review`
	].join("\n");
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
var ROOT = process.cwd();
var HARNESS_DIR = path.join(ROOT, "harness");
function slug(s) {
	return (s || "feature").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "feature";
}
function resolveTemplate(tpl, vars) {
	return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
async function listAgentFiles() {
	const dir = path.join(HARNESS_DIR, "agents");
	try {
		return (await readdir(dir)).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml")).sort();
	} catch {
		return [];
	}
}
async function listWorkflowFiles() {
	const dir = path.join(HARNESS_DIR, "workflows");
	try {
		return (await readdir(dir)).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml")).sort();
	} catch {
		return [];
	}
}
async function loadAgentFile(relOrName) {
	const candidates = [
		path.resolve(ROOT, relOrName),
		path.join(HARNESS_DIR, "agents", relOrName),
		path.join(HARNESS_DIR, "agents", `${relOrName}.yaml`),
		path.join(HARNESS_DIR, "agents", `${relOrName}.yml`)
	];
	for (const p of candidates) try {
		return parseAgentYaml(await readFile(p, "utf8"));
	} catch {}
	throw new Error(`Agent not found: ${relOrName}`);
}
async function loadWorkflowFile(relOrName) {
	const candidates = [
		path.resolve(ROOT, relOrName),
		path.join(HARNESS_DIR, "workflows", relOrName),
		path.join(HARNESS_DIR, "workflows", `${relOrName}.yaml`)
	];
	for (const p of candidates) try {
		return parseWorkflowYaml(await readFile(p, "utf8"));
	} catch {}
	throw new Error(`Workflow not found: ${relOrName}`);
}
async function runAgentFile(opts) {
	const started = Date.now();
	const runId = uid("run");
	const events = [];
	const agent = await loadAgentFile(opts.agentPath);
	if (opts.backendOverride) agent.executor.harness = opts.backendOverride;
	const result = await executeAgent({
		agent,
		userMessage: opts.message,
		onEvent: (e) => events.push({
			...e,
			ts: Date.now()
		})
	});
	const runDir = path.join(HARNESS_DIR, "artifacts", runId);
	await mkdir(runDir, { recursive: true });
	await writeFile(path.join(runDir, "output.md"), result.text, "utf8");
	await writeFile(path.join(runDir, "meta.json"), JSON.stringify({
		agent: agent.name,
		backend: result.backend,
		ok: result.ok
	}, null, 2), "utf8");
	return {
		ok: result.ok,
		runId,
		agent: agent.name,
		backend: result.backend,
		events,
		outputs: { output: result.text },
		summary: result.ok ? `Agent \`${agent.name}\` finished via \`${result.backend}\`` : `Agent failed: ${result.error}`,
		durationMs: Date.now() - started
	};
}
async function runWorkflow(opts) {
	const started = Date.now();
	const runId = uid("run");
	const feature = opts.feature.trim() || "feature";
	const featureSlug = slug(feature);
	const events = [];
	const outputs = {};
	const wf = await loadWorkflowFile(opts.workflowPath);
	const vars = {
		feature: featureSlug,
		runId,
		FEATURE: feature
	};
	const planPath = path.resolve(ROOT, resolveTemplate(wf.artifacts.planPath, vars));
	const runDir = path.resolve(ROOT, resolveTemplate(wf.artifacts.runDir, vars));
	await mkdir(runDir, { recursive: true });
	await mkdir(path.dirname(planPath), { recursive: true });
	const push = (e) => {
		events.push({
			...e,
			ts: Date.now()
		});
	};
	push({
		phase: "start",
		roleId: "orchestrator",
		level: "info",
		message: `Workflow \`${wf.name}\` · feature: ${feature}`
	});
	let planText = "";
	let lastBackend = "mock";
	for (const phase of wf.phases) {
		push({
			phase: String(phase.id),
			roleId: "orchestrator",
			level: "info",
			message: `Phase: ${phase.title}${phase.parallel ? " (parallel)" : ""}`
		});
		const roles = phase.roles;
		const runRole = async (role) => {
			let agent;
			try {
				agent = await loadAgentFile(role.agent);
			} catch {
				agent = {
					name: role.id,
					prompt: defaultPromptForRole(role.role, role.readOnly),
					executor: { harness: opts.backendOverride || "mock" }
				};
			}
			if (opts.backendOverride) agent.executor.harness = opts.backendOverride;
			if (wf.policies?.crossVendorReview && role.role === "reviewer" && !opts.backendOverride) agent.executor.harness = pickReviewBackend(String(agent.executor.harness));
			const userMessage = buildRoleMessage({
				role,
				feature,
				phase: phase.id,
				planPath
			});
			const res = await executeAgent({
				agent,
				userMessage,
				context: planText ? `## Existing plan\n${planText}` : void 0,
				onEvent: (e) => push({
					...e,
					phase: String(phase.id),
					roleId: role.id
				})
			});
			lastBackend = res.backend;
			outputs[role.id] = res.text;
			await writeFile(path.join(runDir, `${phase.id}-${role.id}.md`), res.text, "utf8");
			if (role.role === "orchestrator" || phase.id === "plan" || role.id.includes("plan")) {
				planText = res.text;
				await writeFile(planPath, res.text, "utf8");
				push({
					phase: String(phase.id),
					roleId: role.id,
					level: "info",
					message: `Wrote plan → ${path.relative(ROOT, planPath)}`
				});
			}
			return res;
		};
		if (phase.parallel) await Promise.all(roles.map((r) => runRole(r)));
		else for (const r of roles) await runRole(r);
	}
	const summary = [
		`# Harness run ${runId}`,
		``,
		`- Workflow: ${wf.name}`,
		`- Feature: ${feature}`,
		`- Plan: ${path.relative(ROOT, planPath)}`,
		`- Backend (last): ${lastBackend}`,
		`- Duration: ${Date.now() - started}ms`,
		``,
		`## Artifacts`,
		...Object.keys(outputs).map((k) => `- ${k}`),
		``,
		`## Events`,
		...events.map((e) => `- [${e.level}] ${e.phase}/${e.roleId}: ${e.message.replace(/\n/g, " ").slice(0, 160)}`)
	].join("\n");
	await writeFile(path.join(runDir, "SUMMARY.md"), summary, "utf8");
	await writeFile(path.join(runDir, "events.json"), JSON.stringify(events, null, 2), "utf8");
	return {
		ok: true,
		runId,
		workflow: wf.name,
		backend: lastBackend,
		feature,
		planPath: path.relative(ROOT, planPath),
		events,
		outputs,
		summary,
		durationMs: Date.now() - started
	};
}
function defaultPromptForRole(role, readOnly) {
	if (role === "reviewer" || readOnly) return "You are an independent reviewer. Judge only against the acceptance contract. Do not edit code. Report blocking vs non-blocking issues.";
	if (role === "orchestrator") return "You are the orchestrator. Decompose work into independent packages with clear acceptance criteria. Never write product code yourself.";
	if (role === "validator") return "You validate that blocking review items are addressed and tests are green. Produce a final summary of changes and remaining risks.";
	return "You are an implementer. Stay within your package scope. Leave tests green for your scope.";
}
function buildRoleMessage(opts) {
	if (opts.role.role === "orchestrator" || opts.phase === "plan") return [
		`Create a plan for: ${opts.feature}`,
		`Break into 3 independent packages with clear acceptance criteria.`,
		`Write the plan as markdown (this will be saved to ${opts.planPath}).`
	].join("\n");
	if (opts.role.role === "implementer") return [
		`Implement package for feature: ${opts.feature}`,
		opts.role.package ? `Package focus: ${opts.role.package}` : `Role id: ${opts.role.id}`,
		`Stay in scope. Leave tests green for this package.`,
		`Summarize files you would change and tests you would add.`
	].join("\n");
	if (opts.role.role === "reviewer" || opts.role.readOnly) return [
		`Review the implementation plan/output for: ${opts.feature}`,
		`Focus: ${opts.role.package || opts.role.id}`,
		`Read-only: do not edit code.`,
		`Report blocking vs non-blocking issues.`
	].join("\n");
	if (opts.role.role === "validator") return [
		`Validate feature: ${opts.feature}`,
		`Synthesize reviews, apply only blocking fixes (describe them),`,
		`run the full test suite (or describe commands), and produce a final summary.`
	].join("\n");
	return `Work on feature: ${opts.feature} (${opts.role.id})`;
}
function pickReviewBackend(implHarness) {
	return [
		"mock",
		"local-direct",
		"local-deepagents"
	].find((h) => h !== implHarness) || "mock";
}
async function getHarnessStatus() {
	return {
		backends: await listBackends(),
		agents: await listAgentFiles(),
		workflows: await listWorkflowFiles(),
		harnessDir: "harness/"
	};
}
/** Flatten to plain JSON-safe DTO for TanStack server fns */
function toDto(r) {
	return {
		ok: Boolean(r.ok),
		runId: String(r.runId),
		workflow: r.workflow ? String(r.workflow) : void 0,
		agent: r.agent ? String(r.agent) : void 0,
		backend: String(r.backend),
		feature: r.feature ? String(r.feature) : void 0,
		planPath: r.planPath ? String(r.planPath) : void 0,
		events: (r.events || []).map((e) => ({
			ts: Number(e.ts) || 0,
			phase: String(e.phase),
			roleId: String(e.roleId),
			level: e.level,
			message: String(e.message).slice(0, 500)
		})),
		outputs: Object.fromEntries(Object.entries(r.outputs || {}).map(([k, v]) => [k, String(v).slice(0, 8e3)])),
		summary: String(r.summary || "").slice(0, 2e4),
		durationMs: Number(r.durationMs) || 0
	};
}
var harnessStatus_createServerFn_handler = createServerRpc({
	id: "19e00543f0313fe7905c045b33772265c61fa51d18574d69244c3f084698fddb",
	name: "harnessStatus",
	filename: "src/lib/harness/server.ts"
}, (opts) => harnessStatus.__executeServer(opts));
var harnessStatus = createServerFn({ method: "GET" }).handler(harnessStatus_createServerFn_handler, async () => {
	return getHarnessStatus();
});
var harnessListBackends_createServerFn_handler = createServerRpc({
	id: "9869410eeb67daab81f5d2ed574198eae379b3efb7eb41fe5a887f5ee51051d9",
	name: "harnessListBackends",
	filename: "src/lib/harness/server.ts"
}, (opts) => harnessListBackends.__executeServer(opts));
var harnessListBackends = createServerFn({ method: "GET" }).handler(harnessListBackends_createServerFn_handler, async () => {
	return listBackends();
});
var harnessRunAgent_createServerFn_handler = createServerRpc({
	id: "3a3b06354c92fa523d323b08f8cb2c04194a6d325c5629dfe4c092272682e98a",
	name: "harnessRunAgent",
	filename: "src/lib/harness/server.ts"
}, (opts) => harnessRunAgent.__executeServer(opts));
var harnessRunAgent = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.agent) throw new Error("agent required");
	return {
		agent: String(d.agent).slice(0, 120),
		message: String(d.message || "Hello").slice(0, 8e3),
		backend: d.backend ? String(d.backend).slice(0, 64) : ""
	};
}).handler(harnessRunAgent_createServerFn_handler, async ({ data }) => {
	return toDto(await runAgentFile({
		agentPath: data.agent,
		message: data.message,
		backendOverride: data.backend || void 0
	}));
});
var harnessRunWorkflow_createServerFn_handler = createServerRpc({
	id: "64ebef571e60681eaece2b296de9be5f6f33209c413aad1e4ff65d57e56c9c83",
	name: "harnessRunWorkflow",
	filename: "src/lib/harness/server.ts"
}, (opts) => harnessRunWorkflow.__executeServer(opts));
var harnessRunWorkflow = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.workflow) throw new Error("workflow required");
	return {
		workflow: String(d.workflow).slice(0, 120),
		feature: String(d.feature || "feature").slice(0, 200),
		backend: d.backend ? String(d.backend).slice(0, 64) : ""
	};
}).handler(harnessRunWorkflow_createServerFn_handler, async ({ data }) => {
	return toDto(await runWorkflow({
		workflowPath: data.workflow,
		feature: data.feature,
		backendOverride: data.backend || void 0
	}));
});
//#endregion
export { harnessListBackends_createServerFn_handler, harnessRunAgent_createServerFn_handler, harnessRunWorkflow_createServerFn_handler, harnessStatus_createServerFn_handler };
