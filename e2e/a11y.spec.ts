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

  // The check above is necessary but was VACUOUS on its own: it only inspects
  // rows that already carry the attribute, so a row missing BOTH passes
  // trivially. That is exactly what happened — `BlockRow` returns early for
  // `ai` and `mermaid` about 130 lines above the wrapper that sets them, and
  // those two types were unaddressable while this test stayed green.
  //
  // Comparing the rendered count against the store catches the class, not the
  // instance: any future early return that forgets the attributes fails here.
  const expected = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("workspace-v1") ?? "{}").state;
    const active = state?.pages?.find((p: { id: string }) => p.id === state.activePageId);
    return active?.blocks?.length ?? -1;
  });
  expect(expected, "workspace-v1 did not hydrate").toBeGreaterThan(0);
  await expect(rows).toHaveCount(expected);

  // Named explicitly because they are the two that were broken, and a count
  // check alone would not say which type went missing.
  for (const type of ["ai", "mermaid"] as const) {
    await expect(
      page.locator(`[data-block-type="${type}"]`),
      `${type} blocks must be addressable by type`,
    ).not.toHaveCount(0);
  }
});
