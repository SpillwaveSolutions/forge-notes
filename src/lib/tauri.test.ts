import { afterEach, describe, expect, it, vi } from "vitest";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { getDesktopInfo, isTauri, openPath, whichBinary } from "@/lib/tauri";

/**
 * Both branches matter. There is deliberately NO global setup file installing
 * mockIPC: a global mock makes `isTauri()` true everywhere, which would
 * silently stop the web-mode half of this module from ever being exercised.
 *
 * `clearMocks()` clears the handler but leaves `window.__TAURI_INTERNALS__` in
 * place, so it has to be deleted by hand or a later web-mode test still sees
 * `isTauri() === true`.
 */
afterEach(() => {
  clearMocks();
  const w = window as unknown as Record<string, unknown>;
  delete w.__TAURI_INTERNALS__;
  delete w.__TAURI__;
  delete w.__WORKSPACE_DESKTOP__;
});

describe("desktop mode", () => {
  it("detects Tauri and round-trips both commands over IPC", async () => {
    mockIPC((cmd, args) => {
      if (cmd === "desktop_info") {
        return { isDesktop: true, platform: "macos", arch: "aarch64", version: "0.1.0" };
      }
      if (cmd === "which_binary") return (args as { name: string }).name === "claude";
      throw new Error(`unexpected command: ${cmd}`);
    });

    // mockIPC sets __TAURI_INTERNALS__, which is exactly what isTauri() checks
    expect(isTauri()).toBe(true);
    expect(await getDesktopInfo()).toMatchObject({ platform: "macos", arch: "aarch64" });
    expect(await whichBinary("claude")).toBe(true);
    expect(await whichBinary("definitely-not-installed")).toBe(false);
  });

  it("degrades to a minimal payload when the command throws", async () => {
    mockIPC(() => {
      throw new Error("backend exploded");
    });
    // the catch in getDesktopInfo reports desktop-ness without the details
    expect(await getDesktopInfo()).toEqual({ isDesktop: true });
    expect(await whichBinary("claude")).toBe(false);
  });

  it("is detected via withGlobalTauri's __TAURI__ alone", () => {
    (window as unknown as Record<string, unknown>).__TAURI__ = {};
    expect(isTauri()).toBe(true);
  });
});

describe("web mode", () => {
  it("no-ops without Tauri rather than throwing", async () => {
    expect(isTauri()).toBe(false);
    expect(await getDesktopInfo()).toBeNull();
    expect(await whichBinary("claude")).toBe(false);
  });

  it("falls back to window.open for openPath", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    await openPath("https://example.com");
    expect(open).toHaveBeenCalledWith("https://example.com", "_blank", "noopener,noreferrer");
  });
});
