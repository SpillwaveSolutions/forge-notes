import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";

export type MountKind = "server" | "browser";

export interface MarkdownMount {
  id: string;
  name: string;
  kind: MountKind;
  /** Absolute or workspace-relative server path (server mounts only) */
  serverPath?: string;
  createdAt: number;
}

/** Active selection for a linked markdown file (not a workspace page). */
export interface MountSelection {
  mountId: string;
  relPath: string;
}

interface MountsState {
  mounts: MarkdownMount[];
  selection: MountSelection | null;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setSelection: (sel: MountSelection | null) => void;
  addServerMount: (name: string, serverPath: string) => string;
  addBrowserMount: (name: string) => string;
  removeMount: (id: string) => void;
  renameMount: (id: string, name: string) => void;
}

const SAMPLE_MOUNT: MarkdownMount = {
  id: "mount_sample",
  name: "Sample notes (linked)",
  kind: "server",
  serverPath: "/workspace/markdown-samples",
  createdAt: Date.now(),
};

export const useMarkdownMounts = create<MountsState>()(
  persist(
    (set, get) => ({
      mounts: [SAMPLE_MOUNT],
      selection: null,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setSelection: (sel) => set({ selection: sel }),
      addServerMount: (name, serverPath) => {
        const id = uid("mount");
        set((s) => ({
          mounts: [
            ...s.mounts,
            {
              id,
              name: name || "Linked folder",
              kind: "server",
              serverPath,
              createdAt: Date.now(),
            },
          ],
        }));
        return id;
      },
      addBrowserMount: (name) => {
        const id = uid("mount");
        set((s) => ({
          mounts: [
            ...s.mounts,
            {
              id,
              name: name || "Local folder",
              kind: "browser",
              createdAt: Date.now(),
            },
          ],
        }));
        return id;
      },
      removeMount: (id) =>
        set((s) => ({
          mounts: s.mounts.filter((m) => m.id !== id),
          selection: s.selection?.mountId === id ? null : s.selection,
        })),
      renameMount: (id, name) =>
        set((s) => ({
          mounts: s.mounts.map((m) => (m.id === id ? { ...m, name } : m)),
        })),
      // ensure sample present for first-time users
      ...(function ensure() {
        return {};
      })(),
    }),
    {
      name: "workspace-md-mounts-v1",
      partialize: (s) => ({ mounts: s.mounts }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        // ensure sample mount exists
        if (state && !state.mounts.some((m) => m.id === "mount_sample")) {
          state.mounts = [SAMPLE_MOUNT, ...state.mounts];
        }
      },
    },
  ),
);

// ── IndexedDB for FileSystemDirectoryHandle (browser mounts) ──────────────

const IDB_NAME = "workspace-md-handles";
const IDB_STORE = "handles";

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDirectoryHandle(mountId: string, handle: FileSystemDirectoryHandle) {
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(handle, mountId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadDirectoryHandle(
  mountId: string,
): Promise<FileSystemDirectoryHandle | null> {
  const db = await openIdb();
  const handle = await new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(mountId);
    req.onsuccess = () => resolve((req.result as FileSystemDirectoryHandle) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return handle;
}

export async function deleteDirectoryHandle(mountId: string) {
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(mountId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export interface MountEntry {
  name: string;
  relPath: string;
  kind: "file" | "dir";
}

export async function listBrowserDir(
  handle: FileSystemDirectoryHandle,
  relPath = "",
): Promise<MountEntry[]> {
  const entries: MountEntry[] = [];
  // @ts-expect-error async iterator
  for await (const [name, entry] of handle.entries()) {
    if (name.startsWith(".")) continue;
    const path = relPath ? `${relPath}/${name}` : name;
    if (entry.kind === "directory") {
      entries.push({ name, relPath: path, kind: "dir" });
    } else if (name.toLowerCase().endsWith(".md")) {
      entries.push({ name, relPath: path, kind: "file" });
    }
  }
  return entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function readBrowserFile(
  root: FileSystemDirectoryHandle,
  relPath: string,
): Promise<string> {
  const parts = relPath.split("/").filter(Boolean);
  let dir = root;
  for (let i = 0; i < parts.length - 1; i++) {
    dir = await dir.getDirectoryHandle(parts[i]!);
  }
  const fileHandle = await dir.getFileHandle(parts[parts.length - 1]!);
  const file = await fileHandle.getFile();
  return file.text();
}

export async function writeBrowserFile(
  root: FileSystemDirectoryHandle,
  relPath: string,
  content: string,
) {
  const parts = relPath.split("/").filter(Boolean);
  let dir = root;
  for (let i = 0; i < parts.length - 1; i++) {
    dir = await dir.getDirectoryHandle(parts[i]!, { create: true });
  }
  const fileHandle = await dir.getFileHandle(parts[parts.length - 1]!, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}
