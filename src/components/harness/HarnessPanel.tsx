import { useEffect, useState } from "react";
import {
  Bot,
  Check,
  Loader2,
  Play,
  Terminal,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  harnessRunAgent,
  harnessRunWorkflow,
  harnessStatus,
} from "@/lib/harness/server";
import type { BackendDescriptor, HarnessRunResult } from "@/lib/harness/types";
import { toast } from "sonner";

interface HarnessPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HarnessPanel({ open, onOpenChange }: HarnessPanelProps) {
  const [backends, setBackends] = useState<BackendDescriptor[]>([]);
  const [agents, setAgents] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [backend, setBackend] = useState("mock");
  const [feature, setFeature] = useState("JWT authentication");
  const [agentName, setAgentName] = useState("hello");
  const [message, setMessage] = useState("What is a meta-harness?");
  const [workflow, setWorkflow] = useState("jwt-auth.yaml");
  const [result, setResult] = useState<HarnessRunResult | null>(null);
  const [tab, setTab] = useState<"workflow" | "agent" | "backends">("workflow");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    void harnessStatus()
      .then((s) => {
        setBackends(s.backends);
        setAgents(s.agents);
        setWorkflows(s.workflows);
        if (s.agents[0]) setAgentName(s.agents[0].replace(/\.ya?ml$/, ""));
        const jwt = s.workflows.find((w) => w.includes("jwt"));
        if (jwt) setWorkflow(jwt);
        else if (s.workflows[0]) setWorkflow(s.workflows[0]);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load harness"))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const runWf = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const res = (await harnessRunWorkflow({
        data: {
          workflow,
          feature: feature || "feature",
          backend: backend || "mock",
        },
      })) as HarnessRunResult;
      setResult(res);
      toast.success(`Workflow done · ${res.runId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Run failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  };

  const runAg = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const res = (await harnessRunAgent({
        data: {
          agent: agentName,
          message,
          backend: backend || "mock",
        },
      })) as HarnessRunResult;
      setResult(res);
      toast.success(`Agent done · ${res.runId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Run failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/40"
        aria-label="Dismiss"
        onClick={() => {
          if (!running) onOpenChange(false);
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="harness-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 id="harness-title" className="flex items-center gap-2 text-lg font-semibold">
                <Terminal className="size-4" />
                Meta-harness · CLI agents
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Plan → Implement → Review → Validate. Swap backends without rewriting the workflow.
              </p>
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(
              [
                ["workflow", "Workflow", Workflow],
                ["agent", "Single agent", Bot],
                ["backends", "Backends", Zap],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                  tab === id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5 text-sm">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading harness…
            </div>
          ) : (
            <>
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Backend slot (executor.harness)
                </span>
                <select
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                  value={backend}
                  onChange={(e) => setBackend(e.target.value)}
                >
                  {backends.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.available ? "●" : "○"} {b.label} ({b.id})
                    </option>
                  ))}
                </select>
              </label>

              {tab === "workflow" && (
                <div className="space-y-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Workflow</span>
                    <select
                      className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                      value={workflow}
                      onChange={(e) => setWorkflow(e.target.value)}
                    >
                      {workflows.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Feature</span>
                    <Input value={feature} onChange={(e) => setFeature(e.target.value)} />
                  </label>
                  <Button type="button" disabled={running || !workflow} onClick={() => void runWf()}>
                    {running ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Play className="size-4" />
                    )}
                    Run workflow
                  </Button>
                  <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
                    {`wks harness workflow ${workflow.replace(/\.ya?ml$/, "")} \\\n  --feature "${feature}" --backend ${backend}`}
                  </pre>
                </div>
              )}

              {tab === "agent" && (
                <div className="space-y-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Agent YAML</span>
                    <select
                      className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                    >
                      {agents.map((a) => (
                        <option key={a} value={a.replace(/\.ya?ml$/, "")}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Message</span>
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} />
                  </label>
                  <Button type="button" disabled={running} onClick={() => void runAg()}>
                    {running ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Play className="size-4" />
                    )}
                    Run agent
                  </Button>
                  <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground">
                    {`wks harness run ${agentName} --message "${message}" --backend ${backend}`}
                  </pre>
                </div>
              )}

              {tab === "backends" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Install CLIs locally for live runs; <strong>mock</strong> always works in
                    preview. Grok Build via <code>grok agent stdio</code> (ACP).
                  </p>
                  {backends.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-start gap-2 rounded-lg border border-border px-3 py-2"
                    >
                      <span
                        className={cn(
                          "mt-0.5 size-2 shrink-0 rounded-full",
                          b.available ? "bg-emerald-500" : "bg-muted-foreground/40",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{b.label}</div>
                        <div className="text-[11px] text-muted-foreground">
                          <code>{b.id}</code>
                          {b.command ? ` · ${b.command}` : ""}
                        </div>
                        {b.notes && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{b.notes}</p>
                        )}
                      </div>
                      {b.available && <Check className="size-3.5 text-emerald-600" />}
                    </div>
                  ))}
                </div>
              )}

              {result && (
                <div
                  className="space-y-2 rounded-xl border border-border p-3"
                  data-testid="harness-result"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-medium",
                        result.ok
                          ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                          : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {result.ok ? "ok" : "failed"}
                    </span>
                    <span className="text-muted-foreground">
                      {result.runId} · {result.backend} · {result.durationMs}ms
                    </span>
                    {result.planPath && (
                      <span className="text-muted-foreground">plan: {result.planPath}</span>
                    )}
                  </div>
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-2 text-[11px] leading-relaxed">
                    {result.summary}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
