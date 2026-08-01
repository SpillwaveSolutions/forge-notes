import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { FileText, Loader2, Plus, Search, Star } from "lucide-react";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import { localSearchPages, type SearchHitClient } from "@/lib/markdown/convert";
import { searchPages, type SearchHit } from "@/lib/search-server";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Hit = SearchHit | SearchHitClient;

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const pages = useWorkspace((s) => s.pages);
  const storageMode = useWorkspace((s) => s.storageMode);
  const setActivePage = useWorkspace((s) => s.setActivePage);
  const createPage = useWorkspace((s) => s.createPage);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [searching, setSearching] = useState(false);
  const [trgm, setTrgm] = useState(false);
  const [mode, setMode] = useState<"local" | "postgres">("local");

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setHits([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);
    const t = setTimeout(() => {
      void (async () => {
        try {
          if (storageMode === "database") {
            const res = await searchPages({ data: { query: q, limit: 24 } });
            if (cancelled) return;
            setHits(res.hits);
            setTrgm(res.trgm);
            setMode("postgres");
          } else {
            const res = localSearchPages(pages, q, 24);
            if (cancelled) return;
            setHits(res);
            setTrgm(false);
            setMode("local");
          }
        } catch {
          if (cancelled) return;
          setHits(localSearchPages(pages, q, 24));
          setMode("local");
        } finally {
          if (!cancelled) setSearching(false);
        }
      })();
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, open, storageMode, pages]);

  const fallbackPages = useMemo(
    () => pages.filter((p) => !p.archived).slice(0, 30),
    [pages],
  );

  if (!open) return null;

  const showHits = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      {/* Hand-rolled rather than Radix (cmdk brings its own dialog handling), so
          the a11y wiring Radix would supply has to be written out. Without it
          the palette is an anonymous div: invisible to accessibility tooling and
          unaddressable by an agent reading the accessibility tree. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        data-testid="command-palette"
        className="absolute left-1/2 top-[18%] w-[min(560px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
      >
        <Command className="flex flex-col" label="Search pages" shouldFilter={false}>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder={
                storageMode === "database"
                  ? "Search pages (Postgres keyword + similarity)…"
                  : "Search pages…"
              }
              className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {searching ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                ESC
              </kbd>
            )}
          </div>

          {showHits && (
            <div className="border-b border-border px-3 py-1.5 text-[11px] text-muted-foreground">
              {mode === "postgres"
                ? `Postgres full-text${trgm ? " + pg_trgm similarity" : " + ILIKE fallback"}`
                : "Local search (sign in to sync for Postgres search)"}
            </div>
          )}

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              {searching ? "Searching…" : "No pages found"}
            </Command.Empty>

            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <Command.Item
                value="new page create"
                onSelect={() => {
                  createPage();
                  onOpenChange(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-muted",
                )}
              >
                <Plus className="size-4 text-muted-foreground" />
                New page
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading={showHits ? "Results" : "Pages"}
              className="mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {(showHits ? hits : fallbackPages.map(pageToHit)).map((hit) => (
                <Command.Item
                  key={hit.pageId}
                  value={`${hit.title} ${hit.pageId}`}
                  onSelect={() => {
                    setActivePage(hit.pageId);
                    window.dispatchEvent(new CustomEvent("workspace:clear-mount"));
                    onOpenChange(false);
                  }}
                  className="flex cursor-pointer flex-col gap-0.5 rounded-md px-2 py-2 text-sm aria-selected:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{hit.icon}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {hit.title || "Untitled"}
                    </span>
                    {hit.favorite && (
                      <Star className="size-3.5 fill-amber-400 text-amber-500" />
                    )}
                    {showHits && (
                      <span className="text-[10px] uppercase text-muted-foreground">
                        {hit.mode}
                      </span>
                    )}
                    <FileText className="size-3.5 text-muted-foreground" />
                  </div>
                  {showHits && hit.snippet && (
                    <p className="line-clamp-2 pl-7 text-xs text-muted-foreground">
                      {hit.snippet}
                    </p>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function pageToHit(page: {
  id: string;
  title: string;
  icon: string;
  parentId: string | null;
  favorite: boolean;
}): Hit {
  return {
    pageId: page.id,
    title: page.title,
    icon: page.icon,
    parentId: page.parentId,
    favorite: page.favorite,
    snippet: "",
    score: 0,
    mode: "keyword",
  };
}
