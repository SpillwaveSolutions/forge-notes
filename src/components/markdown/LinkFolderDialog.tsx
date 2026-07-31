import { useState } from "react";
import { FolderPlus, HardDrive, Link2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveDirectoryHandle,
  useMarkdownMounts,
} from "@/lib/markdown/mounts-store";
import { listServerMount } from "@/lib/markdown/server-mounts";
import { toast } from "sonner";

interface LinkFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkFolderDialog({ open, onOpenChange }: LinkFolderDialogProps) {
  const addServerMount = useMarkdownMounts((s) => s.addServerMount);
  const addBrowserMount = useMarkdownMounts((s) => s.addBrowserMount);
  const setSelection = useMarkdownMounts((s) => s.setSelection);

  const [name, setName] = useState("Linked notes");
  const [serverPath, setServerPath] = useState("/workspace/markdown-samples");
  const [busy, setBusy] = useState(false);

  const linkServer = async () => {
    setBusy(true);
    try {
      await listServerMount({ data: { root: serverPath, relPath: "" } });
      const id = addServerMount(name || "Linked folder", serverPath);
      setSelection({ mountId: id, relPath: "" });
      toast.success("Folder linked (view only until you open a file)");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open path");
    } finally {
      setBusy(false);
    }
  };

  const linkBrowser = async () => {
    // File System Access API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.showDirectoryPicker !== "function") {
      toast.error("Your browser doesn’t support folder access. Use a server path instead.");
      return;
    }
    setBusy(true);
    try {
      const handle = (await w.showDirectoryPicker({
        mode: "readwrite",
      })) as FileSystemDirectoryHandle;
      const id = addBrowserMount(name || handle.name || "Local folder");
      await saveDirectoryHandle(id, handle);
      setSelection({ mountId: id, relPath: "" });
      toast.success("Local folder linked without importing");
      onOpenChange(false);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      toast.error(e instanceof Error ? e.message : "Could not link folder");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="size-4" />
            Link markdown folder
          </DialogTitle>
          <DialogDescription>
            Browse <code className="text-xs">.md</code> files in the same UI{" "}
            <strong>without importing</strong> them into the workspace.
          </DialogDescription>
        </DialogHeader>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Display name</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="space-y-2 rounded-xl border border-border p-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <HardDrive className="size-4" /> This computer
          </p>
          <p className="text-xs text-muted-foreground">
            Uses the browser’s folder picker. Files stay on disk; we only read/write when you open
            or save.
          </p>
          <Button type="button" disabled={busy} onClick={() => void linkBrowser()}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <FolderPlus className="size-4" />}
            Choose local folder
          </Button>
        </div>

        <div className="space-y-2 rounded-xl border border-border p-3">
          <p className="text-sm font-medium">Server path (sandbox / deploy host)</p>
          <Input
            value={serverPath}
            onChange={(e) => setServerPath(e.target.value)}
            placeholder="/workspace/markdown-samples"
          />
          <p className="text-[11px] text-muted-foreground">
            Allowed under <code>/workspace</code>. Sample:{" "}
            <code>/workspace/markdown-samples</code>
          </p>
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={() => void linkServer()}
          >
            Link server folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
