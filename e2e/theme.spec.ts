import { expect, test } from "@playwright/test";

/**
 * Regression cover for a real bug: the effect that puts `.dark` on <html> used
 * to live inside AppShell, so `/login` never got it on a cold load and the login
 * page's dark styling was unreachable. It now lives in __root via useTheme().
 *
 * Theme is seeded through localStorage rather than by clicking, because the only
 * toggle in the app is buried in Sidebar's Settings dialog — three clicks deep,
 * and unreachable from /login at all.
 */
const STORE_KEY = "workspace-v1";

/** Seed zustand's persisted store before any app code runs. */
async function seedTheme(page: import("@playwright/test").Page, theme: "light" | "dark") {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, JSON.stringify({ state: { theme: value }, version: 0 }));
    },
    [STORE_KEY, theme] as const,
  );
}

for (const route of ["/", "/login"] as const) {
  test(`${route} applies dark on a cold load`, async ({ page }) => {
    await seedTheme(page, "dark");
    await page.goto(route);

    // The class is applied by an effect, so it lands after hydration.
    await expect(page.locator("html")).toHaveClass(/\bdark\b/, { timeout: 10_000 });
  });

  test(`${route} stays light when the store says light`, async ({ page }) => {
    await seedTheme(page, "light");
    await page.goto(route);

    // Wait for hydration to have had its chance before asserting an absence,
    // otherwise this passes for the wrong reason on any slow load.
    await expect(page.locator("body")).not.toBeEmpty();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });
}

test("dark mode actually changes the rendered background", async ({ page }) => {
  // Guards against the class being applied while the tokens fail to take effect.
  await seedTheme(page, "light");
  await page.goto("/login");
  const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await seedTheme(page, "dark");
  await page.goto("/login");
  await expect(page.locator("html")).toHaveClass(/\bdark\b/, { timeout: 10_000 });
  const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  expect(dark).not.toBe(light);
});
