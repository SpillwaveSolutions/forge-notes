import { useCallback, useEffect, useState } from "react";
import { FolderOpen, Link2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markdownToBlocks, pageToMarkdownFile, titleFromMarkdown } from "@/lib/markdown/convert";
import {
  listServerMount,
  readServerMountFile,
  writeServerMountFile,
  type ServerMountEntry,
} from "@/lib/markdown/server-mounts";
import {
  listBrowserDir,
  loadDirectoryHandle,
  readBrowserFile,
  writeBrowserFile,
  type MountEntry,
  useMarkdownMounts,
} from "@/lib/markdown/mounts-store";
import type { Block } from "@/lib/types";
import { BlockRow } from "@/components/editor/BlockRow";
import { uid } from "@/lib/utils";

/**
 * Browse + view/edit a linked markdown file without importing into the workspace.
 */
export function MountedMarkdownView() {
  const mounts = useMarkdownMounts((s) => s.mounts);
  const selection = useMarkdownMounts((s) => s.selection);
  const setSelection = useMarkdownMounts((s) => s.setSelection);

  const mount = mounts.find((m) => m.id === selection?.mountId);
  const [entries, setEntries] = useState<Array<MountEntry | ServerMountEntry>>([]);
  const [dirPath, setDirPath] = useState("");
  const [content, setContent] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"browse" | "file">("browse");

  const loadDir = useCallback(
    async (rel = "") => {
      if (!mount) return;
      setLoading(true);
      setError(null);
      try {
        if (mount.kind === "server" && mount.serverPath) {
          const list = await listServerMount({
            data: { root: mount.serverPath, relPath: rel },
          });
          setEntries(list);
        } else {
          const handle = await loadDirectoryHandle(mount.id);
          if (!handle) throw new Error("Local folder permission lost — re-link the folder.");
          // navigate into nested path
          let dir = handle;
          if (rel) {
            for (const part of rel.split("/").filter(Boolean)) {
              dir = await dir.getDirectoryHandle(part);
            }
          }
          const list = await listBrowserDir(dir, rel);
          // fix rel paths to be full from root
          setEntries(
            list.map((e) => ({
              ...e,
              relPath: rel ? `${rel}/${e.name}` : e.name,
            })),
          );
        }
        setDirPath(rel);
        setMode("browse");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to list folder");
      } finally {
        setLoading(false);
      }
    },
    [mount],
  );

  const loadFile = useCallback(
    async (relPath: string) => {
      if (!mount) return;
      setLoading(true);
      setError(null);
      try {
        let text = "";
        if (mount.kind === "server" && mount.serverPath) {
          const res = await readServerMountFile({
            data: { root: mount.serverPath, relPath },
          });
          text = res.content;
        } else {
          const handle = await loadDirectoryHandle(mount.id);
          if (!handle) throw new Error("Local folder permission lost — re-link the folder.");
          text = await readBrowserFile(handle, relPath);
        }
        setContent(text);
        const t = titleFromMarkdown(text, relPath.split("/").pop() || "note");
        setTitle(t);
        setBlocks(markdownToBlocks(text.replace(new RegExp(`^#\\s+${t}\\s*\\n+`), "")));
        setDirty(false);
        setMode("file");
        setSelection({ mountId: mount.id, relPath });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to read file");
      } finally {
        setLoading(false);
      }
    },
    [mount, setSelection],
  );

  useEffect(() => {
    if (!mount) return;
    if (selection?.relPath && selection.relPath.toLowerCase().endsWith(".md")) {
      void loadFile(selection.relPath);
    } else {
      void loadDir(selection?.relPath && !selection.relPath.endsWith(".md") ? selection.relPath : "");
    }
  }, [mount?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    if (!mount || !selection?.relPath) return;
    setSaving(true);
    setError(null);
    try {
      const md = pageToMarkdownFile({
        id: "x",
        title,
        icon: "📝",
        cover: null,
        parentId: null,
        favorite: false,
        createdAt: 0,
        updatedAt: 0,
        blocks,
      });
      if (mount.kind === "server" && mount.serverPath) {
        await writeServerMountFile({
          data: { root: mount.serverPath, relPath: selection.relPath, content: md },
        });
      } else {
        const handle = await loadDirectoryHandle(mount.id);
        if (!handle) throw new Error("Local folder permission lost");
        await writeBrowserFile(handle, selection.relPath, md);
      }
      setContent(md);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!mount || !selection) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <Link2 className="size-8 opacity-40" />
        <p className="text-sm">Select a linked markdown file from the sidebar.</p>
      </div>
    );
  }

  const crumbs = (mode === "file" ? selection.relPath : dirPath)
    .split("/")
    .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-6 sm:px-12">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 font-medium text-foreground">
          <Link2 className="size-3" /> Linked · not imported
        </span>
        <button type="button" className="hover:text-foreground" onClick={() => void loadDir("")}>
          {mount.name}
        </button>
        {crumbs.map((c, i) => {
          const path = crumbs.slice(0, i + 1).join("/");
          const isLast = i === crumbs.length - 1 && mode === "file";
          return (
            <span key={path} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="text-foreground">{c}</span>
              ) : (
                <button
                  type="button"
                  className="hover:text-foreground"
                  onClick={() => {
                    if (c.toLowerCase().endsWith(".md")) void loadFile(path);
                    else void loadDir(path);
                  }}
                >
                  {c}
                </button>
              )}
            </span>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : mode === "browse" ? (
        <div className="space-y-1">
          {dirPath && (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => {
                const parent = dirPath.split("/").slice(0, -1).join("/");
                void loadDir(parent);
              }}
            >
              <FolderOpen className="size-4 text-muted-foreground" />
              ..
            </button>
          )}
          {entries.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No markdown files here</p>
          )}
          {entries.map((e) => (
            <button
              key={e.relPath}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => {
                if (e.kind === "dir") void loadDir(e.relPath);
                else void loadFile(e.relPath);
              }}
            >
              <span>{e.kind === "dir" ? "📁" : "📝"}</span>
              <span className="font-medium">{e.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <input
              className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight outline-none"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setDirty(true);
              }}
            />
            <Button type="button" size="sm" disabled={!dirty || saving} onClick={() => void save()}>
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              Save to disk
            </Button>
          </div>
          <div className="relative space-y-0.5 pl-2">
            {blocks.map((block, index) => (
              <div key={block.id} className="rounded-md py-1">
                <textarea
                  className="w-full resize-y rounded-md border border-transparent bg-transparent px-1 py-1 text-base leading-relaxed outline-none hover:border-border focus:border-border focus:bg-background"
                  rows={Math.max(1, block.content.split("\n").length)}
                  value={block.content}
                  onChange={(e) => {
                    const next = blocks.map((b) =>
                      b.id === block.id ? { ...b, content: e.target.value } : b,
                    );
                    setBlocks(next);
                    setDirty(true);
                  }}
                  placeholder={block.type}
                />
                <div className="px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {block.type}
                </div>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="mt-2"
              onClick={() => {
                setBlocks([
                  ...blocks,
                  { id: uid("b"), type: "paragraph", content: "", indent: 0 },
                ]);
                setDirty(true);
              }}
            >
              Add block
            </Button>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            Edits write back to the linked file. This page is <strong>not</strong> stored in your
            workspace until you Import.
          </p>
        </div>
      )}
    </div>
  );
}

// silence unused import
void BlockRow;
