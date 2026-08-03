import { expect, test } from "@playwright/test";

/**
 * The header toggle exists because Settings is three clicks deep. What matters
 * is that it writes the SAME persisted state Settings does — a second toggle
 * with its own state would be worse than none.
 */

test("the header toggle flips the theme and renames itself", async ({ page }) => {
  // Each test gets a fresh context, so `workspace-v1` is already absent. An
  // addInitScript clearing it would re-run on reload and defeat the second test.
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  // Retry the first interaction: handlers attach after hydration.
  await expect(async () => {
    await page.getByRole("button", { name: "Switch to dark theme" }).click({ timeout: 1000 });
    await expect(page.locator("html")).toHaveClass(/dark/);
  }).toPass({ timeout: 15_000 });

  // The name tracks the destination, not the current state.
  const back = page.getByRole("button", { name: "Switch to light theme" });
  await expect(back).toBeVisible();

  await back.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("the toggle persists through a reload", async ({ page }) => {
  // Each test gets a fresh context, so `workspace-v1` is already absent. An
  // addInitScript clearing it would re-run on reload and defeat the second test.
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  await expect(async () => {
    await page.getByRole("button", { name: "Switch to dark theme" }).click({ timeout: 1000 });
    await expect(page.locator("html")).toHaveClass(/dark/);
  }).toPass({ timeout: 15_000 });

  await page.reload();
  // Proves it went through the store's `workspace-v1` persist rather than being
  // local component state that merely looked right until the next load.
  await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 15_000 });
});
