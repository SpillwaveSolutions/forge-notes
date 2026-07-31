import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
  source: string;
  className?: string;
}

let mermaidReady: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!mermaidReady) {
    mermaidReady = import("mermaid").then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
        fontFamily: "inherit",
      });
      return mermaid;
    });
  }
  return mermaidReady;
}

export function MermaidDiagram({ source, className }: MermaidDiagramProps) {
  const reactId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const code = source.trim();
    if (!code) {
      setSvg("");
      setError(null);
      return;
    }

    void (async () => {
      try {
        const mermaid = await loadMermaid();
        // Re-init theme if dark mode changed
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
          fontFamily: "inherit",
        });
        const id = `mmd_${reactId}_${Math.random().toString(36).slice(2, 8)}`;
        const { svg: rendered } = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setSvg("");
          setError(e instanceof Error ? e.message : "Invalid Mermaid diagram");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, reactId]);

  if (!source.trim()) {
    return (
      <p className="text-sm text-muted-foreground">
        Write Mermaid syntax (e.g. flowchart TD) — diagram previews here.
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-x-auto rounded-md border border-border bg-background px-3 py-4 [&_svg]:mx-auto [&_svg]:max-w-full",
        className,
      )}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
