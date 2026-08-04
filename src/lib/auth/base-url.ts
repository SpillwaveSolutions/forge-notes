/**
 * Pick the Better Auth client's base URL.
 *
 * Better Auth validates the base URL and throws on any protocol that is not
 * `http:`/`https:` (`better-auth/dist/utils/url.mjs`). Left to infer its own,
 * it reads `window.location.origin` — which on the desktop build is the custom
 * scheme `tauri://localhost`. That throw happens while `client.ts` is being
 * EVALUATED, so it takes the whole route chunk down and the TanStack Router
 * boundary swallows it: the desktop window renders "Something went wrong!" and
 * nothing else, with no console to read it from.
 *
 * `undefined` means "let Better Auth infer it", so the web build — every
 * origin that is already http(s), including the live preview — is untouched.
 */
export const DESKTOP_AUTH_ORIGIN = "http://127.0.0.1:8080";

export function resolveAuthBaseURL(protocol: string | undefined): string | undefined {
  if (protocol === "http:" || protocol === "https:") return undefined;
  // No protocol at all means no window (SSR) — inference is fine there too.
  return protocol ? DESKTOP_AUTH_ORIGIN : undefined;
}
