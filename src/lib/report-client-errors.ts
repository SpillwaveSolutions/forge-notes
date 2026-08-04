import { isTauri } from "./tauri";

/**
 * Forward webview exceptions to the desktop process's stderr.
 *
 * A packaged Tauri app has no devtools and no console anyone can read. A
 * JavaScript exception during boot therefore presents as a blank window and
 * nothing else — which is precisely how this app shipped a dead desktop build
 * twice, each time looking like a Rust or bundling problem.
 *
 * Running the binary from a terminal now prints the real error:
 *
 *     ./src-tauri/target/debug/workspace-desktop
 *     [client-error] <message>
 *
 * Web builds are untouched: `isTauri()` is false there and the browser console
 * already has everything.
 */
const send = (message: string, stack?: string) => {
  if (typeof window === "undefined" || !isTauri()) return;
  void import("@tauri-apps/api/core")
    .then(({ invoke }) => invoke("log_client_error", { message, stack }))
    // If the bridge to Rust is itself broken there is nowhere left to report
    // to; swallowing beats an error handler that throws its own error.
    .catch(() => undefined);
};

/**
 * Report an error React already caught.
 *
 * The window listeners below are blind to this class of failure by
 * construction: a React error boundary CONSUMES the exception, so it never
 * reaches `window.onerror`. That is why instrumenting only the window
 * produced a silent log while the app was visibly showing an error boundary —
 * the silence was structural, not evidence of health. Wire this into the
 * router's `defaultOnCatch`, which is the boundary's own catch point.
 */
export function reportCaughtError(error: unknown): void {
  send(
    error instanceof Error ? `[boundary] ${error.message}` : `[boundary] ${String(error)}`,
    error instanceof Error ? error.stack : undefined,
  );
}

export function reportClientErrors(): void {
  if (typeof window === "undefined" || !isTauri()) return;

  window.addEventListener("error", (e) => {
    send(e.message || String(e.error), e.error instanceof Error ? e.error.stack : undefined);
  });

  window.addEventListener("unhandledrejection", (e) => {
    const r: unknown = e.reason;
    send(
      r instanceof Error ? r.message : `Unhandled rejection: ${String(r)}`,
      r instanceof Error ? r.stack : undefined,
    );
  });
}
