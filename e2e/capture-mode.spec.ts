import { expect, test } from "@playwright/test";

/**
 * Capture mode is what makes screenshots comparable against a rubric. These
 * assert observable EFFECTS, not just that a class landed — a class applied
 * while the CSS fails to match would otherwise pass silently and every rubric
 * downstream would be comparing noise.
 */
const FREEZE_KEY = "forgenotes-ui-freeze";
const REVEAL_KEY = "forgenotes-ui-reveal";

async function seed(page: import("@playwright/test").Page, keys: Record<string, string>) {
  await page.addInitScript((kv) => {
    for (const [k, v] of Object.entries(kv)) window.localStorage.setItem(k, v);
  }, keys);
}

test("freeze mode is off by default", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();
  await expect(page.locator("html")).not.toHaveClass(/ui-freeze/);
  await expect(page.locator("html")).not.toHaveClass(/ui-reveal/);
});

test("freeze mode disables transitions and animations", async ({ page }) => {
  await seed(page, { [FREEZE_KEY]: "1" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/ui-freeze/, { timeout: 10_000 });

  // The effect, not the class: every element must report no animation and no
  // transition, which is what stops a screenshot catching a mid-tween frame.
  const moving = await page.evaluate(() =>
    Array.from(document.querySelectorAll("*")).filter((el) => {
      const s = getComputedStyle(el);
      const animated = s.animationName !== "none" && s.animationName !== "";
      const transitioned = parseFloat(s.transitionDuration) > 0;
      return animated || transitioned;
    }).length,
  );
  expect(moving).toBe(0);
});

test("reveal mode makes hover-gated affordances visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  const affordance = page.locator("[data-hover-reveal]").first();
  await expect(affordance).toBeAttached({ timeout: 10_000 });

  // In the DOM and clickable, but transparent — this is exactly the trap:
  // Playwright will happily click it while a screenshot shows nothing.
  const restOpacity = await affordance.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(restOpacity)).toBe(0);

  await page.evaluate((k) => window.localStorage.setItem(k, "1"), REVEAL_KEY);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/ui-reveal/, { timeout: 10_000 });

  const revealed = page.locator("[data-hover-reveal]").first();
  await expect(revealed).toBeAttached();
  const revealedOpacity = await revealed.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(revealedOpacity)).toBe(1);
});

test("freeze mode hides volatile values without reflowing layout", async ({ page }) => {
  await seed(page, { [FREEZE_KEY]: "1" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/ui-freeze/, { timeout: 10_000 });

  // visibility, not display: the box must keep its size or the "stable"
  // screenshot is a differently-laid-out one.
  const rule = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.setAttribute("data-volatile", "");
    probe.textContent = "run-1234 · 87ms";
    document.body.appendChild(probe);
    const s = getComputedStyle(probe);
    const out = { visibility: s.visibility, display: s.display, width: probe.offsetWidth };
    probe.remove();
    return out;
  });

  expect(rule.visibility).toBe("hidden");
  expect(rule.display).not.toBe("none");
  expect(rule.width).toBeGreaterThan(0);
});
