import { loadWorkspace, saveWorkspace, type WorkspaceSnapshot } from "@/lib/workspace-server";
import { useWorkspace } from "@/lib/store";

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let saving = false;
let pending = false;
let remoteMode = false;
let bootstrapped = false;
let unsub: (() => void) | null = null;

export function isRemoteMode() {
  return remoteMode;
}

function snapshotFromStore(): WorkspaceSnapshot {
  const s = useWorkspace.getState();
  return {
    name: s.name,
    theme: s.theme,
    activePageId: s.activePageId,
    sidebarOpen: s.sidebarOpen,
    pages: s.pages,
  };
}

function attachAutosave() {
  unsub?.();
  unsub = useWorkspace.subscribe((state, prev) => {
    if (!remoteMode || !bootstrapped) return;
    // Ignore pure UI flags that aren't part of the snapshot content
    if (
      state.name === prev.name &&
      state.theme === prev.theme &&
      state.activePageId === prev.activePageId &&
      state.sidebarOpen === prev.sidebarOpen &&
      state.pages === prev.pages
    ) {
      return;
    }
    scheduleRemoteSave();
  });
}

/** Load workspace from Postgres for the signed-in user (or seed on first visit). */
export async function bootstrapRemoteWorkspace(): Promise<"db" | "seeded" | "error"> {
  try {
    const data = await loadWorkspace();
    bootstrapped = false;
    useWorkspace.setState({
      name: data.name,
      theme: data.theme,
      activePageId: data.activePageId,
      sidebarOpen: data.sidebarOpen,
      pages: data.pages,
      hydrated: true,
      syncStatus: "saved",
      storageMode: "database",
    });
    remoteMode = true;
    bootstrapped = true;
    attachAutosave();
    return data.source;
  } catch {
    remoteMode = false;
    bootstrapped = false;
    unsub?.();
    unsub = null;
    useWorkspace.setState({
      storageMode: "local",
      syncStatus: "local",
      hydrated: true,
    });
    return "error";
  }
}

export function scheduleRemoteSave() {
  if (!remoteMode || !bootstrapped) return;
  useWorkspace.setState({ syncStatus: "pending" });
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void flushRemoteSave();
  }, 600);
}

async function flushRemoteSave() {
  if (!remoteMode) return;
  if (saving) {
    pending = true;
    return;
  }
  saving = true;
  useWorkspace.setState({ syncStatus: "saving" });
  try {
    await saveWorkspace({ data: snapshotFromStore() });
    useWorkspace.setState({ syncStatus: "saved" });
  } catch {
    useWorkspace.setState({ syncStatus: "error" });
  } finally {
    saving = false;
    if (pending) {
      pending = false;
      scheduleRemoteSave();
    }
  }
}

/** Immediate save (e.g. before unload). */
export async function flushRemoteSaveNow() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (!remoteMode) return;
  try {
    await saveWorkspace({ data: snapshotFromStore() });
    useWorkspace.setState({ syncStatus: "saved" });
  } catch {
    useWorkspace.setState({ syncStatus: "error" });
  }
}

export function useLocalOnlyMode() {
  remoteMode = false;
  bootstrapped = false;
  unsub?.();
  unsub = null;
  useWorkspace.setState({
    storageMode: "local",
    syncStatus: "local",
    hydrated: true,
  });
}
