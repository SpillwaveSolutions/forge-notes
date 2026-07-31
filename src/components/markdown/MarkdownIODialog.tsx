import { useRef, useState } from "react";
import {
  Download,
  FolderInput,
  FolderOutput,
  Loader2,
  Upload,
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
import { useWorkspace } from "@/lib/store";
import {
  downloadBlob,
  exportPagesToZip,
  importMarkdownFile,
  importMarkdownTree,
  materializeImports,
} from "@/lib/markdown/export-import";
import { pageToMarkdownFile, slugifyFilename } from "@/lib/markdown/convert";
import { exportPagesToServerDir } from "@/lib/markdown/server-mounts";
import { toast } from "sonner";
import JSZip from "jszip";

type Tab = "export" | "import";

interface MarkdownIODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: Tab;
  pageId?: string | null;
}

export function MarkdownIODialog({
  open,
  onOpenChange,
  initialTab = "export",
  pageId,
}: MarkdownIODialogProps) {
  const pages = useWorkspace((s) => s.pages);
  const activePageId = useWorkspace((s) => s.activePageId);
  const importPages = useWorkspace((s) => s.importPages);
  const setActivePage = useWorkspace((s) => s.setActivePage);

  const targetId = pageId ?? activePageId;
  const page = pages.find((p) => p.id === targetId);

  const [tab, setTab] = useState<Tab>(initialTab);
  const [hierarchy, setHierarchy] = useState(true);
  const [busy, setBusy] = useState(false);
  const [serverDir, setServerDir] = useState("/workspace/markdown-mounts/export");
  const [importParent, setImportParent] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirRef = useRef<HTMLInputElement>(null);

  const doExportZip = async () => {
    if (!targetId) return;
    setBusy(true);
    try {
      const { blob, filename } = await exportPagesToZip(pages, {
        rootId: targetId,
        hierarchy,
      });
      downloadBlob(blob, filename);
      toast.success("Markdown zip downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(false);
    }
  };

  const doExportSingleMd = () => {
    if (!page) return;
    const md = pageToMarkdownFile(page);
    const blob = new Blob([md], { type: "text/markdown" });
    downloadBlob(blob, `${slugifyFilename(page.title || "page")}.md`);
    toast.success("Markdown file downloaded");
  };

  const doExportServer = async () => {
    if (!targetId) return;
    setBusy(true);
    try {
      const { blob } = await exportPagesToZip(pages, {
        rootId: targetId,
        hierarchy,
      });
      const zip = await JSZip.loadAsync(blob);
      const files: Array<{ relPath: string; content: string }> = [];
      const names = Object.keys(zip.files);
      for (const name of names) {
        const f = zip.files[name]!;
        if (f.dir) continue;
        files.push({ relPath: name, content: await f.async("string") });
      }
      const res = await exportPagesToServerDir({
        data: { targetDir: serverDir, files },
      });
      toast.success(`Wrote ${res.count} files to ${res.dir}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Server export failed");
    } finally {
      setBusy(false);
    }
  };

  const applyImports = (files: Array<{ path: string; content: string }>) => {
    const drafts =
      files.length === 1
        ? [importMarkdownFile(files[0]!.path, files[0]!.content)]
        : importMarkdownTree(files);
    const parentId = importParent ? targetId ?? null : null;
    const { pages: created, rootIds } = materializeImports(drafts, parentId);
    importPages(created, rootIds[0] ?? created[0]?.id ?? null);
    if (rootIds[0]) setActivePage(rootIds[0]);
    toast.success(`Imported ${created.length} page${created.length === 1 ? "" : "s"}`);
    onOpenChange(false);
  };

  const onPickFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setBusy(true);
    try {
      const files: Array<{ path: string; content: string }> = [];
      for (const file of Array.from(fileList)) {
        if (!file.name.toLowerCase().endsWith(".md") && !file.name.toLowerCase().endsWith(".zip")) {
          continue;
        }
        if (file.name.toLowerCase().endsWith(".zip")) {
          const zip = await JSZip.loadAsync(await file.arrayBuffer());
          for (const name of Object.keys(zip.files)) {
            const entry = zip.files[name]!;
            if (entry.dir || !name.toLowerCase().endsWith(".md")) continue;
            files.push({ path: name, content: await entry.async("string") });
          }
        } else {
          // webkitRelativePath preserves folder structure from directory input
          const path =
            (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
          files.push({ path, content: await file.text() });
        }
      }
      if (!files.length) {
        toast.error("No markdown files found");
        return;
      }
      applyImports(files);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOutput className="size-4" />
            Markdown import / export
          </DialogTitle>
          <DialogDescription>
            Move pages as folders of <code className="text-xs">.md</code> files — or export a
            hierarchy.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(["export", "import"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={
                tab === t
                  ? "flex-1 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
                  : "flex-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              }
            >
              {t === "export" ? "Export" : "Import"}
            </button>
          ))}
        </div>

        {tab === "export" ? (
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Current page:{" "}
              <span className="font-medium text-foreground">
                {page?.icon} {page?.title || "Untitled"}
              </span>
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hierarchy}
                onChange={(e) => setHierarchy(e.target.checked)}
              />
              Include child pages (folder hierarchy)
            </label>
            <div className="flex flex-col gap-2">
              <Button type="button" disabled={busy || !page} onClick={() => void doExportZip()}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                Download as .zip
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!page || hierarchy}
                onClick={doExportSingleMd}
              >
                Download single .md
              </Button>
            </div>
            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-foreground">Write to server folder</p>
              <Input value={serverDir} onChange={(e) => setServerDir(e.target.value)} />
              <p className="text-[11px] text-muted-foreground">
                Allowed under <code>/workspace</code> (e.g.{" "}
                <code>/workspace/markdown-mounts/export</code>)
              </p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busy || !page}
                onClick={() => void doExportServer()}
              >
                <FolderOutput className="size-3.5" /> Write markdown dir
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={importParent}
                onChange={(e) => setImportParent(e.target.checked)}
              />
              Nest under current page
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".md,.zip,text/markdown,application/zip"
              multiple
              className="hidden"
              onChange={(e) => void onPickFiles(e.target.files)}
            />
            <input
              ref={dirRef}
              type="file"
              // @ts-expect-error webkitdirectory
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
              onChange={(e) => void onPickFiles(e.target.files)}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                Import .md or .zip
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => dirRef.current?.click()}
              >
                <FolderInput className="size-4" /> Import folder of markdown
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Folders become parent pages; each <code>.md</code> becomes a page. Content is copied
              into the workspace (unlike linked mounts).
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
