import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plug,
  Plus,
  Sparkles,
  Terminal,
  Trash2,
  Wifi,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAiSettings } from "@/lib/ai/settings-store";
import {
  BACKEND_META,
  DEFAULT_MODELS,
  PROVIDER_META,
  type AiBackendMode,
  type AiProviderId,
  type McpServerConfig,
  type UserAiSettings,
} from "@/lib/ai/settings-types";
import { WORKSPACE_SKILLS } from "@/lib/ai/config";
import { listAiCliBackends, testAiConnection, testMcpConnection } from "@/lib/ai-server";

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "provider", title: "Provider" },
  { id: "credentials", title: "Credentials" },
  { id: "mcp", title: "MCP tools" },
  { id: "skills", title: "Skills" },
  { id: "review", title: "Test & finish" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface AiSetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: StepId;
}

export function AiSetupWizard({ open, onOpenChange, initialStep = "welcome" }: AiSetupWizardProps) {
  const settings = useAiSettings();
  const [stepIndex, setStepIndex] = useState(0);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [mcpTestingId, setMcpTestingId] = useState<string | null>(null);
  const [cliStatus, setCliStatus] = useState<
    Array<{ id: string; label: string; available: boolean }>
  >([]);

  useEffect(() => {
    if (!open) return;
    const idx = STEPS.findIndex((s) => s.id === initialStep);
    setStepIndex(idx >= 0 ? idx : 0);
    setTestResult(null);
    void listAiCliBackends()
      .then((list) => setCliStatus(list.map((c) => ({ id: c.id, label: c.label, available: c.available }))))
      .catch(() => setCliStatus([]));
  }, [open, initialStep]);

  const step = STEPS[stepIndex]!;
  const isCliBackend =
    settings.backend === "claude-cli" ||
    settings.backend === "codex-cli" ||
    settings.backend === "grok-cli";

  const snapshot = (): UserAiSettings => settings.getSettings();

  const canNext = useMemo(() => {
    if (step.id === "provider") return Boolean(settings.backend);
    if (step.id === "credentials") {
      if (isCliBackend) return true;
      if (settings.provider === "openai_compatible" && !settings.baseUrl.trim()) return false;
      return Boolean(settings.model.trim());
    }
    return true;
  }, [step.id, settings.backend, settings.provider, settings.baseUrl, settings.model, isCliBackend]);

  const go = (delta: number) => {
    setTestResult(null);
    // Skip credentials when using CLI backends if user wants - still show for streaming toggle
    setStepIndex((i) => Math.min(STEPS.length - 1, Math.max(0, i + delta)));
  };

  const finish = () => {
    settings.patch({ setupComplete: true, enabled: true });
    onOpenChange(false);
  };

  const runConnectionTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testAiConnection({ data: { clientSettings: snapshot() } });
      setTestResult({ ok: res.ok, message: res.message });
    } catch (e) {
      setTestResult({
        ok: false,
        message: e instanceof Error ? e.message : "Test failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const runMcpTest = async (server: McpServerConfig) => {
    setMcpTestingId(server.id);
    try {
      const res = await testMcpConnection({ data: { server } });
      settings.updateMcpServer(server.id, {
        lastTestOk: res.ok,
        lastTestMessage: res.message,
        lastToolCount: res.toolNames?.length ?? 0,
      });
    } catch (e) {
      settings.updateMcpServer(server.id, {
        lastTestOk: false,
        lastTestMessage: e instanceof Error ? e.message : "Test failed",
      });
    } finally {
      setMcpTestingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <div className="border-b border-border px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-4" />
              AI setup · Deep Agents & coding CLIs
            </DialogTitle>
            <DialogDescription>
              Connect an API model, or shell out to Claude Code / Codex / Grok CLIs with streaming.
            </DialogDescription>
          </DialogHeader>
          <ol className="mt-4 flex flex-wrap gap-1.5">
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setStepIndex(i)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                    i === stepIndex
                      ? "bg-foreground text-background"
                      : i < stepIndex
                        ? "bg-muted text-foreground"
                        : "bg-muted/50 text-muted-foreground",
                  )}
                >
                  {i + 1}. {s.title}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {step.id === "welcome" && <WelcomeStep />}
          {step.id === "provider" && (
            <ProviderStep
              provider={settings.provider}
              backend={settings.backend}
              preferStreaming={settings.preferStreaming !== false}
              cliStatus={cliStatus}
              onProvider={(p) => settings.setProviderDefaults(p)}
              onBackend={(backend) => settings.patch({ backend })}
              onPreferStreaming={(preferStreaming) => settings.patch({ preferStreaming })}
            />
          )}
          {step.id === "credentials" && (
            isCliBackend ? (
              <CliCredentialsStep backend={settings.backend} cliStatus={cliStatus} />
            ) : (
              <CredentialsStep
                provider={settings.provider}
                model={settings.model}
                apiKey={settings.apiKey}
                baseUrl={settings.baseUrl}
                temperature={settings.temperature}
                recursionLimit={settings.recursionLimit}
                onChange={(p) => settings.patch(p)}
              />
            )
          )}
          {step.id === "mcp" && (
            <McpStep
              servers={settings.mcpServers}
              testingId={mcpTestingId}
              onAdd={() => settings.addMcpServer()}
              onUpdate={(id, patch) => settings.updateMcpServer(id, patch)}
              onRemove={(id) => settings.removeMcpServer(id)}
              onTest={(s) => void runMcpTest(s)}
            />
          )}
          {step.id === "skills" && (
            <SkillsStep
              enabled={settings.enabledSkills}
              onToggle={(name) => {
                const set = new Set(settings.enabledSkills);
                if (set.has(name)) set.delete(name);
                else set.add(name);
                settings.patch({ enabledSkills: [...set] });
              }}
              onAll={() => settings.patch({ enabledSkills: [...WORKSPACE_SKILLS] })}
            />
          )}
          {step.id === "review" && (
            <ReviewStep
              settings={snapshot()}
              testing={testing}
              testResult={testResult}
              onTest={() => void runConnectionTest()}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="ghost" disabled={stepIndex === 0} onClick={() => go(-1)}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <div className="flex gap-2">
            {step.id !== "review" ? (
              <Button type="button" disabled={!canNext} onClick={() => go(1)}>
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={finish}>
                <Check className="size-4" /> Save & finish
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WelcomeStep() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
      <p className="text-base text-foreground">
        Generate and edit content with <strong>Deep Agents</strong>, provider APIs, or{" "}
        <strong>coding CLIs</strong> (Claude Code, Codex, Grok) — with streaming when available.
      </p>
      <ul className="list-inside list-disc space-y-1.5">
        <li>API path: Grok / Claude / OpenAI / Ollama keys (browser-stored)</li>
        <li>
          CLI path: <code className="text-xs">claude</code>, <code className="text-xs">codex</code>,{" "}
          <code className="text-xs">grok</code> already logged in on the host
        </li>
        <li>Streaming tokens over SSE for live previews in AI blocks and edit dialogs</li>
        <li>Optional MCP servers + workspace skills for Deep Agents mode</li>
      </ul>
    </div>
  );
}

function ProviderStep({
  provider,
  backend,
  preferStreaming,
  cliStatus,
  onProvider,
  onBackend,
  onPreferStreaming,
}: {
  provider: AiProviderId;
  backend: AiBackendMode;
  preferStreaming: boolean;
  cliStatus: Array<{ id: string; label: string; available: boolean }>;
  onProvider: (p: AiProviderId) => void;
  onBackend: (b: AiBackendMode) => void;
  onPreferStreaming: (v: boolean) => void;
}) {
  const providers = Object.keys(PROVIDER_META) as AiProviderId[];
  const backends = Object.keys(BACKEND_META) as AiBackendMode[];
  const isCli = BACKEND_META[backend]?.isCli;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <Terminal className="size-4" /> Generation backend
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {backends.map((id) => {
            const meta = BACKEND_META[id];
            const cli = cliStatus.find((c) => c.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onBackend(id)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left transition-colors",
                  backend === id
                    ? "border-foreground bg-muted/60"
                    : "border-border hover:bg-muted/40",
                )}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {meta.label}
                  {meta.isCli && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        cli?.available
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {cli ? (cli.available ? "on PATH" : "not found") : "CLI"}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{meta.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={preferStreaming}
          onChange={(e) => onPreferStreaming(e.target.checked)}
        />
        Prefer streaming output (SSE) when the backend supports it
      </label>

      {!isCli && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-foreground">Model provider (API)</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {providers.map((id) => {
              const meta = PROVIDER_META[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onProvider(id)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left transition-colors",
                    provider === id
                      ? "border-foreground bg-muted/60"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <div className="text-sm font-semibold text-foreground">{meta.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{meta.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CliCredentialsStep({
  backend,
  cliStatus,
}: {
  backend: AiBackendMode;
  cliStatus: Array<{ id: string; label: string; available: boolean }>;
}) {
  const hit = cliStatus.find((c) => c.id === backend);
  const tips: Record<string, string[]> = {
    "claude-cli": [
      "Install Claude Code CLI and run `claude login`",
      "Streaming uses `claude -p … --output-format stream-json`",
      "Falls back to plain `-p` if stream-json is unavailable",
    ],
    "codex-cli": [
      "Install Codex CLI and authenticate",
      "Streaming uses `codex exec` stdout",
      "Workspace AI never stores your Codex credentials",
    ],
    "grok-cli": [
      "Install Grok CLI / Grok Build (`grok login` or XAI_API_KEY)",
      "Streaming prefers `grok chat --stream`",
      "Falls back to `grok -p` / chat without stream flags",
    ],
  };
  return (
    <div className="space-y-4 text-sm">
      <div
        className={cn(
          "rounded-lg border px-3 py-2 text-xs",
          hit?.available
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
            : "border-border bg-muted/40 text-muted-foreground",
        )}
      >
        {hit?.available
          ? `${BACKEND_META[backend]?.label ?? backend} is available on PATH.`
          : `${BACKEND_META[backend]?.label ?? backend} was not found on PATH in this environment. Install it on the machine running the app server.`}
      </div>
      <ul className="list-inside list-disc space-y-1.5 text-muted-foreground">
        {(tips[backend] ?? ["Authenticate the CLI on the host machine."]).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        No API key is stored in the workspace for CLI backends — auth is handled by the CLI itself.
      </p>
    </div>
  );
}

function CredentialsStep({
  provider,
  model,
  apiKey,
  baseUrl,
  temperature,
  recursionLimit,
  onChange,
}: {
  provider: AiProviderId;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  recursionLimit: number;
  onChange: (p: Partial<UserAiSettings>) => void;
}) {
  const meta = PROVIDER_META[provider];
  const models = DEFAULT_MODELS[provider];
  const showBase = provider === "ollama" || provider === "openai_compatible";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        Provider: <span className="font-medium text-foreground">{meta.label}</span>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{meta.keyLabel}</span>
        <Input
          type="password"
          autoComplete="off"
          placeholder={meta.keyPlaceholder}
          value={apiKey}
          onChange={(e) => onChange({ apiKey: e.target.value })}
        />
        <span className="text-[11px] text-muted-foreground">
          Stored in this browser’s local storage. Not written to the project repo.
        </span>
      </label>

      {showBase && (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Base URL</span>
          <Input
            placeholder={meta.baseUrlDefault}
            value={baseUrl}
            onChange={(e) => onChange({ baseUrl: e.target.value })}
          />
          {meta.baseUrlHint && (
            <span className="text-[11px] text-muted-foreground">{meta.baseUrlHint}</span>
          )}
        </label>
      )}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Model</span>
        <select
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
          value={model}
          onChange={(e) => onChange({ model: e.target.value })}
        >
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <Input
          className="mt-1"
          placeholder="Or type a custom model id"
          value={model}
          onChange={(e) => onChange({ model: e.target.value })}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Temperature ({temperature.toFixed(2)})</span>
          <input
            type="range"
            min={0}
            max={1.2}
            step={0.05}
            value={temperature}
            onChange={(e) => onChange({ temperature: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Agent recursion limit</span>
          <Input
            type="number"
            min={8}
            max={80}
            value={recursionLimit}
            onChange={(e) => onChange({ recursionLimit: Number(e.target.value) || 40 })}
          />
        </label>
      </div>
    </div>
  );
}

function McpStep({
  servers,
  testingId,
  onAdd,
  onUpdate,
  onRemove,
  onTest,
}: {
  servers: McpServerConfig[];
  testingId: string | null;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<McpServerConfig>) => void;
  onRemove: (id: string) => void;
  onTest: (s: McpServerConfig) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          MCP tools are used when backend is <strong>Deep Agents</strong>.
        </p>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          <Plus className="size-3.5" /> Add server
        </Button>
      </div>
      {servers.length === 0 && (
        <p className="text-xs text-muted-foreground">No MCP servers yet.</p>
      )}
      {servers.map((s) => (
        <div key={s.id} className="space-y-2 rounded-xl border border-border p-3">
          <div className="flex items-center gap-2">
            <Plug className="size-4 text-muted-foreground" />
            <Input
              value={s.name}
              onChange={(e) => onUpdate(s.id, { name: e.target.value })}
              className="h-8"
            />
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={s.enabled}
                onChange={(e) => onUpdate(s.id, { enabled: e.target.checked })}
              />
              On
            </label>
            <Button type="button" size="icon-sm" variant="ghost" onClick={() => onRemove(s.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <select
            className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs"
            value={s.transport}
            onChange={(e) =>
              onUpdate(s.id, {
                transport: e.target.value as McpServerConfig["transport"],
              })
            }
          >
            <option value="http">HTTP</option>
            <option value="sse">SSE</option>
            <option value="stdio">stdio</option>
          </select>
          {s.transport === "stdio" ? (
            <>
              <Input
                placeholder="command"
                value={s.command ?? ""}
                onChange={(e) => onUpdate(s.id, { command: e.target.value })}
              />
              <Input
                placeholder="args (space-separated)"
                value={s.argsText ?? ""}
                onChange={(e) => onUpdate(s.id, { argsText: e.target.value })}
              />
            </>
          ) : (
            <Input
              placeholder="https://…"
              value={s.url ?? ""}
              onChange={(e) => onUpdate(s.id, { url: e.target.value })}
            />
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={testingId === s.id}
              onClick={() => onTest(s)}
            >
              {testingId === s.id ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Wifi className="size-3.5" />
              )}
              Test
            </Button>
            {s.lastTestMessage && (
              <span
                className={cn(
                  "text-[11px]",
                  s.lastTestOk ? "text-emerald-600" : "text-destructive",
                )}
              >
                {s.lastTestMessage}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsStep({
  enabled,
  onToggle,
  onAll,
}: {
  enabled: string[];
  onToggle: (name: string) => void;
  onAll: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Skills for Deep Agents mode.</p>
        <Button type="button" size="sm" variant="ghost" onClick={onAll}>
          Enable all
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {WORKSPACE_SKILLS.map((name) => {
          const on = enabled.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => onToggle(name)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm",
                on ? "border-foreground bg-muted/50" : "border-border text-muted-foreground",
              )}
            >
              <span className="font-medium">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewStep({
  settings,
  testing,
  testResult,
  onTest,
}: {
  settings: UserAiSettings;
  testing: boolean;
  testResult: { ok: boolean; message: string } | null;
  onTest: () => void;
}) {
  return (
    <div className="space-y-4 text-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
        <dt className="text-muted-foreground">Backend</dt>
        <dd className="font-medium">{BACKEND_META[settings.backend]?.label ?? settings.backend}</dd>
        <dt className="text-muted-foreground">Streaming</dt>
        <dd>{settings.preferStreaming !== false ? "Preferred" : "Off"}</dd>
        {!BACKEND_META[settings.backend]?.isCli && (
          <>
            <dt className="text-muted-foreground">Provider</dt>
            <dd>
              {PROVIDER_META[settings.provider]?.label} · {settings.model}
            </dd>
            <dt className="text-muted-foreground">API key</dt>
            <dd>{settings.apiKey ? "Set" : "Not set"}</dd>
          </>
        )}
        <dt className="text-muted-foreground">MCP servers</dt>
        <dd>{settings.mcpServers.filter((m) => m.enabled).length} enabled</dd>
        <dt className="text-muted-foreground">Skills</dt>
        <dd>{settings.enabledSkills.length}</dd>
      </dl>
      <Button type="button" variant="secondary" disabled={testing} onClick={onTest}>
        {testing ? <Loader2 className="size-4 animate-spin" /> : <Wifi className="size-4" />}
        Test connection
      </Button>
      {testResult && (
        <p
          className={cn(
            "text-xs",
            testResult.ok ? "text-emerald-600" : "text-destructive",
          )}
        >
          {testResult.message}
        </p>
      )}
    </div>
  );
}

export function AiSetupBanner({ onOpen }: { onOpen: () => void }) {
  const setupComplete = useAiSettings((s) => s.setupComplete);
  const backend = useAiSettings((s) => s.backend);
  if (setupComplete) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted/40"
    >
      <Sparkles className="size-3.5 shrink-0" />
      <span>
        Set up AI — Grok, Claude, Codex CLI, MCP…{" "}
        <span className="text-foreground">({BACKEND_META[backend]?.label ?? backend})</span>
      </span>
    </button>
  );
}
