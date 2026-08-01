import { useEffect } from "react";
import { useWorkspace } from "@/lib/store";

/**
 * Applies the persisted theme to <html>.
 *
 * Lives at the root, not inside AppShell. It used to be an effect in AppShell,
 * which meant `/login` never got the `.dark` class on a cold load — the login
 * page uses theme-aware tokens, so its dark rendering was simply unreachable
 * unless you navigated there from `/` in the same document.
 */
export function useTheme(): void {
  const theme = useWorkspace((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
}
