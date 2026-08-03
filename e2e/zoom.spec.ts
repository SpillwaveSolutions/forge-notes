import { expect, test } from "@playwright/test";

/**
 * The unit tests in `src/lib/use-zoom.test.ts` cover the ladder arithmetic. What
 * they cannot cover is the part that actually breaks: whether the keydown
 * listener is bound, whether `⌘=` reaches it, and whether the resulting root
 * font size survives a reload. All three need a real browser.
 */

/** Computed root font size in px, which is what the zoom actually changes. */
async function rootFontPx(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
}

// No storage clearing here on purpose. Playwright gives each test a fresh
// context, so localStorage already starts empty — and `addInitScript` would run
// again on `page.reload()`, wiping the very key the persistence test exists to
// check. It passed the first three tests and silently broke the fourth.

test("Cmd+= grows the UI and Cmd+- shrinks it back", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  const base = await rootFontPx(page);

  // Retry: the listener is attached by an effect at the root, so a press before
  // hydration lands on inert markup — the same SSR race the palette hits.
  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+=");
    expect(await rootFontPx(page)).toBeGreaterThan(base);
  }).toPass({ timeout: 15_000 });

  const grown = await rootFontPx(page);
  expect(grown).toBeCloseTo(base * 1.15, 1);

  await page.keyboard.press("ControlOrMeta+-");
  expect(await rootFontPx(page)).toBeCloseTo(base, 1);
});

test("Cmd+0 resets from any level", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();
  const base = await rootFontPx(page);

  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+=");
    expect(await rootFontPx(page)).toBeGreaterThan(base);
  }).toPass({ timeout: 15_000 });

  await page.keyboard.press("ControlOrMeta+=");
  await page.keyboard.press("ControlOrMeta+0");
  expect(await rootFontPx(page)).toBeCloseTo(base, 1);
});

test("the zoom level survives a reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();
  const base = await rootFontPx(page);

  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+=");
    expect(await rootFontPx(page)).toBeGreaterThan(base);
  }).toPass({ timeout: 15_000 });

  const grown = await rootFontPx(page);
  expect(await page.evaluate(() => localStorage.getItem("forgenotes-zoom"))).toBe("1.15");

  // The whole point of persisting: a new document, not a re-render.
  await page.reload();
  await expect(page.locator("body")).not.toBeEmpty();
  await expect(async () => {
    expect(await rootFontPx(page)).toBeCloseTo(grown, 1);
  }).toPass({ timeout: 15_000 });
});

test("zoom stops at the ends of the ladder instead of running away", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();
  const base = await rootFontPx(page);

  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+=");
    expect(await rootFontPx(page)).toBeGreaterThan(base);
  }).toPass({ timeout: 15_000 });

  // Well past the 8-entry ladder.
  for (let i = 0; i < 12; i++) await page.keyboard.press("ControlOrMeta+=");
  expect(await rootFontPx(page)).toBeCloseTo(base * 2, 1);

  for (let i = 0; i < 20; i++) await page.keyboard.press("ControlOrMeta+-");
  expect(await rootFontPx(page)).toBeCloseTo(base * 0.75, 1);
});
