/**
 * Desktop (Tauri) helpers — safe to import from web; no-ops when not in Tauri.
 */

export function isTauri(): boolean {
  if (typeof window === "undefined") return false;
  // Tauri 2 injects internals; withGlobalTauri also sets window.__TAURI__
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return Boolean(w.__TAURI_INTERNALS__ || w.__TAURI__ || w.__WORKSPACE_DESKTOP__);
}

export async function getDesktopInfo(): Promise<{
  isDesktop: boolean;
  platform?: string;
  arch?: string;
  version?: string;
} | null> {
  if (!isTauri()) return null;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return (await invoke("desktop_info")) as {
      isDesktop: boolean;
      platform?: string;
      arch?: string;
      version?: string;
    };
  } catch {
    return { isDesktop: true };
  }
}

export async function whichBinary(name: string): Promise<boolean> {
  if (!isTauri()) return false;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return Boolean(await invoke("which_binary", { name }));
  } catch {
    return false;
  }
}

/** Open a path or URL with the OS default handler. */
export async function openPath(path: string): Promise<void> {
  if (!isTauri()) {
    window.open(path, "_blank", "noopener,noreferrer");
    return;
  }
  const { open } = await import("@tauri-apps/plugin-shell");
  await open(path);
}
