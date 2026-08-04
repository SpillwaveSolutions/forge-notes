import { describe, expect, it } from "vitest";
import { DESKTOP_AUTH_ORIGIN, resolveAuthBaseURL } from "./base-url";

describe("resolveAuthBaseURL", () => {
  it("defers to Better Auth's own inference on the web", () => {
    expect(resolveAuthBaseURL("https:")).toBeUndefined();
    expect(resolveAuthBaseURL("http:")).toBeUndefined();
  });

  it("overrides the custom scheme the desktop build runs on", () => {
    // The regression: `tauri://localhost` reaches Better Auth's URL validator,
    // which throws `Invalid base URL … must include 'http://' or 'https://'`
    // during module evaluation and blanks the desktop window.
    expect(resolveAuthBaseURL("tauri:")).toBe(DESKTOP_AUTH_ORIGIN);
  });

  it("is an http(s) URL, which is the only thing Better Auth accepts", () => {
    expect(new URL(DESKTOP_AUTH_ORIGIN).protocol).toBe("http:");
  });

  it("leaves SSR alone, where there is no window to read", () => {
    expect(resolveAuthBaseURL(undefined)).toBeUndefined();
  });
});
