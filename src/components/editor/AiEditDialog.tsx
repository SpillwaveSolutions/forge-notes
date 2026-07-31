import { useRef, useState } from "react";
import { Loader2, Sparkles, Square, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BlockType } from "@/lib/types";
import { runAi } from "@/lib/ai-server";
import { streamAi } from "@/lib/ai/stream-client";
import { cn } from "@/lib/utils";
import { snapshotAiSettings } from "@/lib/ai/settings-store";
import { AiSetupBanner, AiSetupWizard } from "@/components/ai/AiSetupWizard";

const PRESETS = [
  { id: "improve", label: "Improve", instruction: "Improve clarity and flow while preserving meaning." },
  { id: "shorter", label: "Shorter", instruction: "Make this shorter and more concise." },
  { id: "longer", label: "Expand", instruction: "Expand this with one more sentence of useful detail." },
  { id: "fix", label: "Fix grammar", instruction: "Fix grammar and spelling only." },
  { id: "pro", label: "Professional", instruction: "Rewrite in a clear, professional tone." },
] as const;

interface AiEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockText: string;
  blockType: BlockType;
  pageTitle: string;
  pageText: string;
  onApply: (text: string) => void;
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

export function AiEditDialog({
  open,
  onOpenChange,
  blockText,
  blockType,
  pageTitle,
  pageText,
  onApply,
}: AiEditDialogProps) {
  const [instruction, setInstruction] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  };

  const run = async (instr: string) => {
    setLoading(true);
    setError(null);
    setPreview("");
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
            action: "edit_block",
            instruction: instr,
            blockText,
            blockType,
            pageTitle,
            pageText,
          },
          clientSettings: settings,
          backend: settings.backend,
          signal: ac.signal,
          onToken: (_t, full) => setPreview(full),
          onStatus: (m) => setStatus(m),
        });
        setPreview(res.text);
        setProvider(providerLabel(res.provider, res.model));
      } else {
        const res = await runAi({
          data: {
            action: "edit_block",
            instruction: instr,
            blockText,
            blockType,
            pageTitle,
            pageText,
            clientSettings: settings,
          },
        });
        setPreview(res.text);
        setProvider(providerLabel(res.provider, res.model));
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") {
        setError(e instanceof Error ? e.message : "AI request failed");
      }
    } finally {
      abortRef.current = null;
      setLoading(false);
      setStatus(null);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) {
            stop();
            setPreview(null);
            setError(null);
            setInstruction("");
          }
          onOpenChange(v);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Edit block with AI
            </DialogTitle>
            <DialogDescription>
              Rewrite this block. Uses your configured backend (API or Claude / Codex / Grok CLI)
              with streaming when available.
              {provider && (
                <span className="mt-1 block text-xs text-muted-foreground">{provider}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <AiSetupBanner onOpen={() => setWizardOpen(true)} />

          <div className="rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Original</span>
            <p className="mt-1 line-clamp-4 whitespace-pre-wrap">{blockText || "(empty)"}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <Button
                key={p.id}
                type="button"
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={() => void run(p.instruction)}
              >
                <Wand2 className="size-3.5" />
                {p.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Custom instruction…"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && instruction.trim()) void run(instruction.trim());
              }}
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
                disabled={!instruction.trim()}
                onClick={() => void run(instruction.trim())}
              >
                Run
              </Button>
            )}
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {status ?? "Generating…"}
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}

          {preview != null && preview !== "" && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Preview</div>
              <pre
                className={cn(
                  "max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-background p-3 text-sm",
                  loading && "opacity-80",
                )}
              >
                {preview}
              </pre>
              <Button
                type="button"
                className="w-full"
                disabled={loading}
                onClick={() => {
                  onApply(preview);
                  onOpenChange(false);
                }}
              >
                Apply to block
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AiSetupWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  );
}
