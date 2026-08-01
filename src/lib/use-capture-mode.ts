import { useEffect } from "react";

/**
 * Screenshot capture mode, driven by localStorage so an agent can seed it
 * before the page loads — the same trick the theme uses, and the reason neither
 * needs a click path or a URL parameter.
 *
 *   localStorage.setItem("forgenotes-ui-freeze", "1")   // hold the UI still
 *   localStorage.setItem("forgenotes-ui-reveal", "1")   // force hover affordances visible
 *
 * DEV-only: production never reads the flags, so no shipped build can be put
 * into a frozen state by a stray localStorage key.
 *
 * See the "Capture mode" block in styles.css for what each class does.
 */
export const FREEZE_KEY = "forgenotes-ui-freeze";
export const REVEAL_KEY = "forgenotes-ui-reveal";

function enabled(key: string): boolean {
  try {
    const v = window.localStorage.getItem(key);
    return v === "1" || v === "true";
  } catch {
    // Storage can throw in private mode / partitioned iframes; never take the
    // app down over a debug affordance.
    return false;
  }
}

export function useCaptureMode(): void {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle("ui-freeze", enabled(FREEZE_KEY));
      root.classList.toggle("ui-reveal", enabled(REVEAL_KEY));
    };
    apply();

    // Lets an agent flip modes mid-session (e.g. capture rest, then revealed)
    // without a reload, and keeps multiple tabs consistent.
    window.addEventListener("storage", apply);
    return () => window.removeEventListener("storage", apply);
  }, []);
}
