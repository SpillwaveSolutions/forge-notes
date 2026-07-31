import { useRef, useState } from "react";
import {
  Loader2,
  Sparkles,
  ListTodo,
  Table2,
  ListTree,
  Workflow,
  FileText,
  Play,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AiAction, AiGeneratedBlock } from "@/lib/ai/types";
import { runAi } from "@/lib/ai-server";
import { streamAi } from "@/lib/ai/stream-client";
import { snapshotAiSettings } from "@/lib/ai/settings-store";
import { AiSetupBanner, AiSetupWizard } from "@/components/ai/AiSetupWizard";
import { BACKEND_META } from "@/lib/ai/settings-types";

export type { AiGeneratedBlock };

const PRESETS: Array<{
  action: Exclude<AiAction, "edit_block" | "custom">;
  label: string;
  icon: typeof Sparkles;
  hint: string;
}> = [
  { action: "summarize", label: "Summary", icon: FileText, hint: "Condense the page" },
  { action: "action_items", label: "Todos", icon: ListTodo, hint: "Extract action items" },
  { action: "table", label: "Table", icon: Table2, hint: "Markdown table" },
  { action: "outline", label: "Outline", icon: ListTree, hint: "Hierarchical outline" },
  { action: "mermaid", label: "Diagram", icon: Workflow, hint: "Mermaid flowchart" },
];

interface AiBlockPanelProps {
  content: string;
  aiOutput?: string;
  aiError?: string;
  pageTitle: string;
  pageText: string;
  onChangePrompt: (value: string) => void;
  onResult: (result: {
    output: string;
    blocks?: AiGeneratedBlock[];
    error?: string;
  }) => void;
}

function providerLabel(provider: string | undefined, model?: string) {
  if (provider === "claude-cli") return "Claude Code CLI";
  if (provider === "codex-cli") return "Codex CLI";
  if (provider === "grok-cli") return "Grok CLI";
  if (provider === "deepagents") return `Deep Agents · ${model ?? "model"}`;
  if (provider === "direct") return model ?? "Direct API";
  if (provider === "xai") return model ?? "Grok";
  return "Local demo AI";
}

export function AiBlockPanel({
  content,
  aiOutput,
  aiError,
  pageTitle,
  pageText,
  onChangePrompt,
  onResult,
}: AiBlockPanelProps) {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [streamPreview, setStreamPreview] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setStatus("Stopped");
  };

  const execute = async (action: AiAction, instruction?: string) => {
    setLoading(true);
    setStreamPreview("");
    setStatus(null);
    const settings = snapshotAiSettings();
    const preferStream = settings.preferStreaming !== false;
    const isCli =
      settings.backend === "claude-cli" ||
      settings.backend === "codex-cli" ||
      settings.backend === "grok-cli";
    const useStream =
      preferStream &&
      (isCli || settings.backend === "direct" || settings.backend === "deepagents");

    try {
      if (useStream) {
        const ac = new AbortController();
        abortRef.current = ac;
        const res = await streamAi({
          request: {
            action,
            instruction: instruction ?? content,
            pageTitle,
            pageText,
          },
          clientSettings: settings,
          backend: settings.backend,
          signal: ac.signal,
          onToken: (_t, full) => setStreamPreview(full),
          onStatus: (m) => setStatus(m),
        });
        setProvider(providerLabel(res.provider, res.model));
        const output =
          res.text ||
          (res.blocks ? res.blocks.map((b) => `${b.type}: ${b.content}`).join("\n") : "");
        onResult({ output, blocks: res.blocks });
        setStreamPreview("");
      } else {
        const res = await runAi({
          data: {
            action,
            instruction: instruction ?? content,
            pageTitle,
            pageText,
            clientSettings: settings,
          },
        });
        setProvider(providerLabel(res.provider, res.model));
        const output =
          res.text ||
          (res.blocks ? res.blocks.map((b) => `${b.type}: ${b.content}`).join("\n") : "");
        onResult({ output, blocks: res.blocks });
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") {
        onResult({ output: streamPreview, error: "Generation stopped" });
      } else {
        onResult({
          output: "",
          error: e instanceof Error ? e.message : "AI request failed",
        });
      }
    } finally {
      abortRef.current = null;
      setLoading(false);
      setStatus(null);
    }
  };

  const settingsSnap = snapshotAiSettings();
  const backendHint = BACKEND_META[settingsSnap.backend]?.label ?? settingsSnap.backend;

  return (
    <div className="w-full space-y-3 rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
          <Sparkles className="size-3.5" />
        </span>
        AI block
        <span className="ml-auto text-[11px] font-normal text-muted-foreground">
          {provider ?? backendHint}
        </span>
      </div>

      <AiSetupBanner onOpen={() => setWizardOpen(true)} />

      <p className="text-xs text-muted-foreground">
        Uses page context. Backends: Deep Agents, API keys, or coding CLIs (Claude Code / Codex /
        Grok) with live streaming when available.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          return (
            <Button
              key={p.action}
              type="button"
              size="sm"
              variant="outline"
              className="bg-background"
              disabled={loading}
              title={p.hint}
              onClick={() => void execute(p.action)}
            >
              <Icon className="size-3.5" />
              {p.label}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <textarea
          className="min-h-[64px] flex-1 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
          placeholder="Custom instruction…"
          value={content}
          onChange={(e) => onChangePrompt(e.target.value)}
          disabled={loading}
        />
        {loading ? (
          <Button type="button" size="sm" variant="destructive" onClick={stop}>
            <Square className="size-3.5" />
            Stop
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={!content.trim()}
            onClick={() => void execute("custom", content)}
          >
            <Play className="size-3.5" />
            Run
          </Button>
        )}
      </div>

      {(loading || streamPreview) && (
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            {loading && <Loader2 className="size-3 animate-spin" />}
            {status ?? (loading ? "Streaming…" : "Preview")}
          </div>
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">
            {streamPreview || "…"}
          </pre>
        </div>
      )}

      {aiError && <p className="text-xs text-destructive">{aiError}</p>}
      {aiOutput && !streamPreview && (
        <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-background p-3 text-xs">
          {aiOutput}
        </pre>
      )}

      <AiSetupWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
