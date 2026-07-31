A **meta-harness** is a thin compatibility layer above coding agents.

You define workflow once (policies, plan → implement → review → validate, durable artifacts)
and treat Claude Code, Codex, Grok Build, etc. as pluggable backends via `executor.harness`.

The lock-in you avoid is not the model — it is the automation wired to one vendor CLI.

_Mock agent: hello_agent_