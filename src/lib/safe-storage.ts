/**
 * `localStorage` that cannot take the app down.
 *
 * Reading `window.localStorage` is not merely "might return null" — in several
 * real environments the *property access itself* throws a `SecurityError`, and
 * an unguarded throw during store initialisation kills the render tree before
 * anything paints.
 *
 * Where this happens: Safari private browsing, and partitioned third-party
 * iframes (which is how the Grok live preview embeds this app).
 *
 * NOT on Tauri/macOS, despite what this file used to claim. Storage under
 * `tauri://localhost` was measured working — the probe reports `"works"` in
 * that webview. The blank desktop window this was written for had a different
 * cause entirely (see `auth/base-url.ts`), and the two were conflated because
 * denying storage synthetically reproduced the same error-boundary text. A
 * reproduction that matches the symptom is not evidence of the cause.
 *
 * So this is defensive hardening for the iframe/private-browsing cases, kept on
 * its own merits — not a fix for anything currently broken.
 *
 * Falling back to an in-memory Map means state stops *persisting* but the app
 * keeps *working*: a desktop user gets a functioning workspace for the session
 * rather than a dead window. That trade is the whole point — a notes app that
 * runs and forgets beats one that refuses to start.
 */
type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function probe(): StorageLike | null {
  try {
    // The access AND a round trip: some environments hand back an object whose
    // methods throw only on write, which a truthiness check would not catch.
    const s = window.localStorage;
    const k = "__forgenotes_probe__";
    s.setItem(k, "1");
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

let cached: StorageLike | null = null;
let persistent = false;

/**
 * The real `localStorage` when it works, an in-memory stand-in when it does not.
 * Probed once — the answer cannot change within a document, and probing on every
 * access would mean a `setItem`/`removeItem` pair per read.
 */
export function safeStorage(): StorageLike {
  if (cached) return cached;
  const real = typeof window === "undefined" ? null : probe();
  persistent = real !== null;
  cached = real ?? memoryStorage();
  return cached;
}

/** True when writes actually survive a reload. Lets a caller warn instead of silently forgetting. */
export function storageIsPersistent(): boolean {
  safeStorage();
  return persistent;
}
