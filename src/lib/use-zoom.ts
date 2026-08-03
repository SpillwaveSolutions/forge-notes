import { useEffect } from "react";
import { safeStorage } from "./safe-storage";

/**
 * App-level zoom: ⌘+ / ⌘- scale every rem in the app, remembered per device.
 *
 * Implemented as a root font size rather than a CSS `zoom` or `transform`,
 * because Tailwind v4 sizes everything here in rem — so one property scales
 * type, padding, gaps and radii together, and nothing needs to know it happened.
 * `transform: scale()` would blur text and break `position: fixed` children
 * (the command palette, every dialog); `zoom` is still inconsistent across
 * engines, and this app ships on WebKit.
 *
 * Deliberately NOT in the workspace store. `workspace-v1` is partialized into
 * the remote workspace and comes back through `loadFromRemote`, so a zoom level
 * set on a 4K desktop would follow you to a laptop and overwrite what that
 * screen needs. Zoom is a property of the display you are sitting at, so it
 * gets its own machine-local key.
 */
const KEY = "forgenotes-zoom";

/**
 * A fixed ladder rather than repeated multiplication. `scale *= 1.1` accumulates
 * float error and lands on values like 1.3310000000000004, which then round-trip
 * through localStorage and never compare equal to anything.
 */
export const ZOOM_STEPS = [0.75, 0.85, 1, 1.15, 1.3, 1.5, 1.75, 2] as const;
export const DEFAULT_ZOOM = 1;

/** Index of the ladder entry closest to `scale`. Never returns -1. */
export function nearestStep(scale: number): number {
  let best = 0;
  for (let i = 1; i < ZOOM_STEPS.length; i++) {
    if (Math.abs(ZOOM_STEPS[i]! - scale) < Math.abs(ZOOM_STEPS[best]! - scale)) best = i;
  }
  return best;
}

/**
 * The next zoom level in `direction` (+1 in, -1 out, 0 reset).
 *
 * Snapping to the nearest step first means a value hand-edited in localStorage,
 * or left behind by an older ladder, still steps sensibly instead of jumping.
 */
export function stepZoom(current: number, direction: -1 | 0 | 1): number {
  if (direction === 0) return DEFAULT_ZOOM;
  const i = nearestStep(current) + direction;
  return ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, Math.max(0, i))]!;
}

export function readZoom(): number {
  if (typeof window === "undefined") return DEFAULT_ZOOM;
  const raw = Number.parseFloat(safeStorage().getItem(KEY) ?? "");
  // A NaN, a zero, or a hand-edited absurdity must not make the app unreadable.
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_ZOOM;
  return Math.min(ZOOM_STEPS.at(-1)!, Math.max(ZOOM_STEPS[0]!, raw));
}

function applyZoom(scale: number): void {
  // Percentage of the user's own browser font size, not a hardcoded px value —
  // someone who has set 20px as their default deserves to keep it.
  document.documentElement.style.fontSize = scale === DEFAULT_ZOOM ? "" : `${scale * 100}%`;
}

/**
 * Binds the zoom shortcuts and applies the remembered level. Root-level, like
 * `useTheme` — `/login` needs it too, and it renders outside `AppShell`.
 */
export function useZoom(): void {
  useEffect(() => {
    let scale = readZoom();
    applyZoom(scale);

    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;

      // "=" is the unshifted key on a US layout; "+" is what arrives when the
      // user actually holds shift, which is how most people type ⌘+. "_" is the
      // same story for "-". Matching only "+"/"-" misses half the presses.
      const direction =
        e.key === "=" || e.key === "+" ? 1 : e.key === "-" || e.key === "_" ? -1 : e.key === "0" ? 0 : null;
      if (direction === null) return;

      const next = stepZoom(scale, direction);
      // preventDefault regardless: in the Tauri window this fully replaces the
      // webview's own zoom. In a plain browser the native shortcut may still
      // fire on top of ours — browsers do not reliably let a page cancel their
      // zoom chrome — so a browser user can end up zooming twice. That is a
      // known limitation of the web build, not a bug in this handler.
      e.preventDefault();
      if (next === scale) return;

      scale = next;
      applyZoom(scale);
      safeStorage().setItem(KEY, String(scale));
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
