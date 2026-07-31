# Meta-harness (CLI + durable workflows)

A thin compatibility layer above coding agents. **Workflow logic lives here**; Claude Code, Codex, Grok Build, OpenCode, Hermes, Pi, and in-process Deep Agents are **pluggable backends**.

Inspired by [Omnigent](https://github.com/) / ai-engineering-harness patterns described in *Hightower’s AI Harness Engineering*.

## Why

Six months of scripts wired to one vendor CLI is the real lock-in. Define:

- Plan → Parallel Implement → Independent Review → Validate  
- policies, durable plan files, cross-vendor review  

…once. Swap `executor.harness` when pricing or quality shifts.

## CLI

```bash
# from repo root
node cli/wks.mjs harness backends
node cli/wks.mjs harness agents
node cli/wks.mjs harness workflows

node cli/wks.mjs harness run hello --message "What is a meta-harness?"
node cli/wks.mjs harness workflow jwt-auth --backend mock
node cli/wks.mjs harness workflow plan-implement-review-validate \
  --feature "Add search facets" --backend mock
```

Optional npm script: `npm run wks -- harness backends`

## Agent YAML (Omnigent-shaped)

```yaml
name: hello_agent
prompt: |
  You are a concise assistant.
executor:
  harness: mock          # or local-deepagents | claude-cli | grok-build | …
  model: grok-4.5
```

## Workflow

See `workflows/plan-implement-review-validate.yaml` and `workflows/jwt-auth.yaml`.

Artifacts:

- `harness/plans/{feature}-plan.md` — durable plan (survives agent switches)
- `harness/artifacts/{runId}/` — per-role outputs + SUMMARY.md

## Grok Build via ACP

```bash
# on a machine with Grok Build installed
grok login
# register conceptually as acp:grok-build — set executor.harness: grok-build
```

## UI

Sidebar → **Agent harness** — run the same workflows from the app preview.

## Backends

| id | Role |
|----|------|
| `mock` | Always-on dry run |
| `local-deepagents` / `local-direct` | Workspace LangChain stack |
| `claude-cli` / `codex-cli` / `cursor-cli` | Native CLIs when installed |
| `grok-build` | `grok agent --always-approve stdio` |
| `shell` / `acp` | Custom command in YAML |

The thermostat (workflow) is yours. Furnaces are swappable.
