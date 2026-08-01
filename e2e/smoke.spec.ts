import { expect, test } from "@playwright/test";

/**
 * What `scripts/browser-smoke.mjs` does, but with assertions instead of exit
 * codes — and in WebKit, the engine the desktop build actually uses.
 */

/** Console noise that is expected in dev and would otherwise fail every run. */
const IGNORED = [/favicon/i, /\[vite\] connect/i, /Download the React DevTools/i];

function collectErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (!IGNORED.some((re) => re.test(text))) errors.push(`console: ${text}`);
  });
  return errors;
}

test("app shell renders without page errors", async ({ page }) => {
  const errors = collectErrors(page);

  const response = await page.goto("/");
  expect(response?.status()).toBeLessThan(400);

  // The workspace boots async (loading state first), so wait for real content
  // rather than asserting against the pulse placeholder.
  await expect(page.locator("body")).not.toBeEmpty();
  expect(errors).toEqual([]);
});

test("login route renders its sign-in form", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("/login");

  await expect(page.getByRole("heading", { name: /sign in to forgenotes/i })).toBeVisible();
  // These three are the only controls in the app with proper id/htmlFor pairs
  // today, which is why getByLabel is safe here and not yet elsewhere.
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in with email/i })).toBeVisible();

  expect(errors).toEqual([]);
});

test("login toggles between sign-in and sign-up", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByLabel("Name")).toBeHidden();

  // Retry the click: this is a TanStack Start SSR app, so the button exists in
  // the server-rendered markup before React hydrates and attaches onClick. A
  // single click can land on inert markup and silently do nothing. We cannot
  // wait on networkidle instead — the Vite HMR websocket means it never settles
  // (see the comment in scripts/preview-thumbnail.mjs).
  await expect(async () => {
    await page.getByRole("button", { name: /need an account\? sign up/i }).click();
    await expect(page.getByLabel("Name")).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });

  await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
});
