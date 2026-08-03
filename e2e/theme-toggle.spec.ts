import { expect, test, type Page } from "@playwright/test";

/**
 * The header toggle exists because Settings is three clicks deep. What matters
 * is that it writes the SAME persisted state Settings does — a second toggle
 * with its own state would be worse than none.
 */

/**
 * Two waits, deliberately separate.
 *
 * `AppShell` renders a full-viewport loading state — no header, no toggle —
 * until the store hydrates, and on a loaded CI runner that takes a while. Then,
 * separately, the click handler attaches after React hydrates, so an early
 * click lands on inert markup and silently does nothing.
 *
 * Folding both into one `toPass` retry (which is what this used to do) spends
 * the entire budget re-clicking a button that does not exist yet, then fails
 * reporting a missing control — a rendering problem wearing an interaction
 * problem's error message. So: wait generously for the control to EXIST, then
 * retry the click on a short leash for the hydration race alone.
 */
async function clickToggle(page: Page, name: string) {
  const toggle = page.getByRole("button", { name });
  await expect(toggle).toBeVisible({ timeout: 60_000 });

  await expect(async () => {
    await toggle.click({ timeout: 2_000 });
    await expect(page.locator("html")).toHaveClass(/\bdark\b/, { timeout: 2_000 });
  }).toPass({ timeout: 20_000 });
}

// Each test gets a fresh context, so `workspace-v1` starts absent and the theme
// starts light. No addInitScript clearing it: that re-runs on `page.reload()`
// and would defeat the persistence test below.

test("the header toggle flips the theme and renames itself", async ({ page }) => {
  await page.goto("/");
  await clickToggle(page, "Switch to dark theme");

  // The name tracks the destination, not the current state.
  const back = page.getByRole("button", { name: "Switch to light theme" });
  await expect(back).toBeVisible();

  await back.click();
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
});

test("the toggle persists through a reload", async ({ page }) => {
  await page.goto("/");
  await clickToggle(page, "Switch to dark theme");

  await page.reload();
  // Proves it went through the store's `workspace-v1` persist rather than being
  // local component state that merely looked right until the next load.
  await expect(page.locator("html")).toHaveClass(/\bdark\b/, { timeout: 60_000 });
});
