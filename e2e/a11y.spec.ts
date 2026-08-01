import { expect, test } from "@playwright/test";

/**
 * Guards the accessibility affordances an agent depends on. The MCP bridge's
 * `webview_dom_snapshot` returns an accessibility tree, so a control without a
 * name is a control the agent cannot see — these are not cosmetic assertions.
 */

test("command palette is an addressable, labelled dialog", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  // Retry: the keydown listener is attached by an effect, so a press before
  // hydration lands on nothing (same SSR race as the login toggle).
  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByTestId("command-palette")).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });

  // It used to be an anonymous <div> — no role, no modal semantics, no name.
  const palette = page.getByTestId("command-palette");
  await expect(palette).toHaveAttribute("role", "dialog");
  await expect(palette).toHaveAttribute("aria-modal", "true");
  await expect(page.getByRole("dialog", { name: /command palette/i })).toBeVisible();
});

test("page action buttons all expose an accessible name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  // An icon-only button with no aria-label resolves to an empty name. The
  // PageEditor overflow menu was exactly this until it got "Page actions".
  const unnamed = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main button"))
      .filter((b) => {
        const label = b.getAttribute("aria-label") ?? b.textContent?.trim() ?? "";
        return label.length === 0;
      })
      .map((b) => b.outerHTML.slice(0, 120)),
  );

  expect(unnamed, `buttons with no accessible name:\n${unnamed.join("\n")}`).toEqual([]);
});

test("block rows carry structural type and id attributes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  // One attribute makes all 14 block types addressable; reading type off class
  // names is the alternative and breaks on any restyle.
  const rows = page.locator("[data-block-type]");
  await expect(rows.first()).toBeVisible({ timeout: 10_000 });

  const missingId = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll("[data-block-type]")).filter(
        (el) => !el.getAttribute("data-block-id"),
      ).length,
  );
  expect(missingId).toBe(0);
});
