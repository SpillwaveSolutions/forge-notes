import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The case that matters is not "getItem returned null" — it is `window.localStorage`
 * THROWING on property access, which Safari does in private browsing and in
 * partitioned third-party iframes. An unguarded throw there happens during
 * zustand store creation, before React renders, and takes the whole app down.
 */
const REAL = Object.getOwnPropertyDescriptor(window, "localStorage");

afterEach(() => {
  if (REAL) Object.defineProperty(window, "localStorage", REAL);
  vi.resetModules();
});

function denyStorage() {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get() {
      throw new DOMException("The operation is insecure.", "SecurityError");
    },
  });
}

describe("safeStorage", () => {
  it("uses the real localStorage when it works", async () => {
    const { safeStorage, storageIsPersistent } = await import("./safe-storage");
    safeStorage().setItem("k", "v");
    expect(window.localStorage.getItem("k")).toBe("v");
    expect(storageIsPersistent()).toBe(true);
    window.localStorage.clear();
  });

  it("survives localStorage throwing on ACCESS, not just on write", async () => {
    denyStorage();
    const { safeStorage, storageIsPersistent } = await import("./safe-storage");

    // The assertion is that none of this throws.
    expect(() => safeStorage().setItem("k", "v")).not.toThrow();
    expect(safeStorage().getItem("k")).toBe("v");
    expect(safeStorage().getItem("absent")).toBeNull();
    expect(() => safeStorage().removeItem("k")).not.toThrow();
    expect(safeStorage().getItem("k")).toBeNull();
    expect(storageIsPersistent()).toBe(false);
  });

  it("rejects a storage whose methods throw only on write", async () => {
    // Some environments hand back an object that looks fine until you use it,
    // which a truthiness check would happily accept.
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => ({
        getItem: () => null,
        setItem() {
          throw new DOMException("QuotaExceededError");
        },
        removeItem: () => undefined,
      }),
    });
    const { safeStorage, storageIsPersistent } = await import("./safe-storage");
    expect(storageIsPersistent()).toBe(false);
    expect(() => safeStorage().setItem("k", "v")).not.toThrow();
  });
});
