import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";

/**
 * Walks the capture recipes in `docs/ui/*.md` and produces one screenshot per
 * screen state, so a rubric can be judged against the real render.
 *
 * A Playwright spec rather than a standalone script, for one reason: the dev
 * server. `webServer` already starts one, tears it down, and — since the port
 * work — refuses to adopt a sibling project's. A separate launcher would be a
 * second copy of that logic to keep correct, and a detached `npm run dev` dies
 * with whatever shell spawned it.
 *
 *   CAPTURE=1 npx playwright test e2e/capture.spec.ts
 *   CAPTURE=1 CAPTURE_OUT=/tmp/shots npx playwright test e2e/capture.spec.ts -g sidebar
 *
 * Skipped unless CAPTURE is set: these produce artefacts, they do not assert,
 * and a CI job that "passes" without checking anything is worse than no job.
 *
 * WebKit at 1280x800 — the engine the desktop build actually uses, at the
 * viewport every recipe assumes. This is the cheap half of the loop; reach for
 * the MCP bridge when a finding depends on real WKWebView chrome (window
 * controls, native menus). For structure, presence and ordering it is the same
 * engine.
 */

const OUT = resolve(process.env.CAPTURE_OUT ?? "screenshots/ui");
const DARK = JSON.stringify({ state: { theme: "dark" }, version: 0 });

test.skip(!process.env.CAPTURE, "set CAPTURE=1 to write screenshots");
test.describe.configure({ mode: "parallel" });

// Playwright's 30 s default is shorter than the waits inside a single shot: a
// cold PGlite boot plus a hydration-retry loop can legitimately take longer,
// and the resulting failure reports a missing element rather than a timeout
// budget — which sends you looking at the app instead of at the config.
test.setTimeout(150_000);

/**
 * A workspace holding one of every block type. The seed data covers 11 of 14 —
 * heading3, numbered and toggle never appear — so `blocks.md`'s "all types"
 * capture needs a page built for it.
 */
const ALL_TYPES_PAGE = {
  id: "p_all",
  title: "Every block type",
  icon: "🧱",
  parentId: null,
  favorite: false,
  archived: false,
  cover: null,
  createdAt: 1,
  updatedAt: 1,
  blocks: (
    [
      ["heading1", "heading1"],
      ["heading2", "heading2"],
      ["heading3", "heading3"],
      ["paragraph", "paragraph — body text, no ornament"],
      ["bullet", "bullet"],
      ["numbered", "numbered"],
      ["numbered", "numbered — restarts after any other type"],
      ["todo", "todo, unchecked"],
      ["todo", "todo, checked"],
      ["toggle", "toggle — collapsed hides children"],
      ["quote", "quote — left rule, indented, muted"],
      ["callout", "callout — filled panel with an emoji"],
      ["code", 'function hello() {\n  console.log("hi");\n}'],
      ["mermaid", "flowchart LR\n  A[Spec] --> B[Capture]\n  B --> C[Rubric]"],
      ["divider", ""],
      ["ai", "Summarize this page as three bullets"],
    ] as const
  ).map(([type, content], i) => ({
    id: `b_${i}`,
    type,
    content,
    indent: 0,
    ...(type === "todo" ? { checked: i === 8 } : {}),
    ...(type === "mermaid" ? { showSource: false } : {}),
  })),
};

type Shot = {
  name: string;
  url: string;
  wait: string;
  dark?: boolean;
  reveal?: boolean;
  allTypes?: boolean;
  clip?: string;
  viewport?: { width: number; height: number };
  act?: (page: Page) => Promise<void>;
};

/** ⌘K, retried: the keydown listener attaches after hydration. */
async function openPalette(page: Page) {
  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByTestId("command-palette")).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 30_000 });
}

const SHOTS: Shot[] = [
  // ── login ────────────────────────────────────────────────────────────────
  { name: "login-01-signin", url: "/login", wait: 'button:has-text("Sign in with email")' },
  {
    name: "login-02-signup",
    url: "/login",
    wait: 'button:has-text("Sign in with email")',
    async act(page) {
      await expect(async () => {
        await page.getByRole("button", { name: /Need an account/ }).click({ timeout: 1000 });
        await expect(page.locator("#name")).toBeVisible({ timeout: 1000 });
      }).toPass({ timeout: 30_000 });
    },
  },
  {
    name: "login-03-local-note",
    url: "/login",
    // isLocalAuthOrigin() is true on 127.0.0.1, but the note mounts one frame
    // AFTER hydration — waiting on the submit button alone races it.
    wait: "text=Desktop / local note",
  },
  {
    name: "login-04-dark",
    url: "/login",
    dark: true,
    wait: 'button:has-text("Sign in with email")',
  },

  // ── app shell ────────────────────────────────────────────────────────────
  { name: "app-shell-02-page", url: "/", wait: "header" },
  { name: "app-shell-02-page-dark", url: "/", dark: true, wait: "header" },
  {
    name: "app-shell-03-empty",
    url: "/",
    wait: "header",
    async act(page) {
      // Empty the page list rather than clearing storage: the state is "no page
      // selected", not "no workspace".
      await page.evaluate(() => {
        const raw = JSON.parse(localStorage.getItem("workspace-v1") ?? "{}");
        raw.state.pages = [];
        raw.state.activePageId = null;
        localStorage.setItem("workspace-v1", JSON.stringify(raw));
      });
      await page.reload();
      await expect(page.getByText("No page open")).toBeVisible({ timeout: 30_000 });
    },
  },
  {
    name: "app-shell-04-mobile-drawer",
    url: "/",
    viewport: { width: 375, height: 812 },
    wait: "header",
    async act(page) {
      const open = page.getByRole("button", { name: "Open sidebar" });
      await expect(open).toBeVisible({ timeout: 60_000 });
      // Click ONCE, then wait on the scrim. A retry loop is wrong here: the
      // drawer covers the button it just used, so every retry after a
      // successful click times out on an element that is merely occluded.
      // And `aside` is the wrong readiness signal at this width — the desktop
      // sidebar is `hidden md:block`, not unmounted, so there are two.
      await expect(async () => {
        await open.click({ timeout: 1000 });
        await expect(page.locator(".fixed.inset-0.z-50")).toBeVisible({ timeout: 1000 });
      }).toPass({ timeout: 30_000 });
    },
  },

  // ── sidebar ──────────────────────────────────────────────────────────────
  { name: "sidebar-01-rest", url: "/", wait: "aside", clip: "aside" },
  { name: "sidebar-02-reveal", url: "/", reveal: true, wait: "aside", clip: "aside" },
  {
    name: "sidebar-03-trash",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Trash", page.getByRole("dialog", { name: "Trash" }));
    },
  },
  {
    name: "sidebar-04-settings",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Settings", page.getByRole("dialog", { name: "Settings" }));
    },
  },

  // ── command palette ──────────────────────────────────────────────────────
  { name: "command-palette-01-browse", url: "/", wait: "header", act: openPalette },
  {
    name: "command-palette-02-results",
    url: "/",
    wait: "header",
    async act(page) {
      await openPalette(page);
      await page.keyboard.type("start");
      // The mode banner is the honest ready signal: options linger from the
      // previous query, so waiting on role=option can capture stale hits.
      await expect(page.getByText(/Local search|Postgres full-text/)).toBeVisible({
        timeout: 15_000,
      });
    },
  },
  {
    name: "command-palette-03-empty",
    url: "/",
    wait: "header",
    async act(page) {
      await openPalette(page);
      await page.keyboard.type("zzzzqqq");
      await expect(page.getByText("No pages found")).toBeVisible({ timeout: 15_000 });
    },
  },

  // ── page editor ──────────────────────────────────────────────────────────
  { name: "page-editor-01-default", url: "/", wait: "[data-block-id]" },
  {
    name: "page-editor-03-icon-picker",
    url: "/",
    wait: "[data-block-id]",
    async act(page) {
      await clickUntil(page, "Change page icon", page.getByText("Page icon"));
    },
  },
  {
    name: "page-editor-04-page-menu",
    url: "/",
    wait: "[data-block-id]",
    async act(page) {
      await clickUntil(page, "Page actions", page.getByText("Move to trash"));
    },
  },

  // ── blocks ───────────────────────────────────────────────────────────────
  {
    name: "blocks-01-all-types",
    url: "/",
    allTypes: true,
    wait: '[data-block-type="mermaid"] svg',
    async act(page) {
      // Move focus and the pointer off every row: a focused OR hovered row
      // shows its handles, and a rest capture containing them is wrong in
      // exactly the way the rubric's "Must NOT Appear" list exists to catch.
      await page.mouse.move(1270, 60);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    },
  },
  {
    name: "blocks-02-reveal",
    url: "/",
    allTypes: true,
    reveal: true,
    wait: '[data-block-type="mermaid"] svg',
  },
  {
    name: "blocks-03-slash-menu",
    url: "/",
    wait: "[data-block-id]",
    async act(page) {
      await expect(async () => {
        await page.getByRole("button", { name: "Add block at end" }).click({ timeout: 1000 });
        await page.keyboard.type("/");
        await expect(page.getByRole("listbox")).toBeVisible({ timeout: 1000 });
      }).toPass({ timeout: 30_000 });
    },
  },
  {
    name: "blocks-04-block-menu",
    url: "/",
    wait: "[data-block-id]",
    async act(page) {
      await expect(async () => {
        await page.locator("[data-block-id]").first().hover();
        await page.getByRole("button", { name: "Block menu" }).first().click({ timeout: 1000 });
        await expect(page.getByText("Turn into")).toBeVisible({ timeout: 1000 });
      }).toPass({ timeout: 30_000 });
    },
  },

  // ── dialogs ──────────────────────────────────────────────────────────────
  {
    name: "dialogs-01-io-export",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Import / export", page.getByText("Markdown import / export"));
    },
  },
  {
    name: "dialogs-02-io-import",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Import / export", page.getByText("Markdown import / export"));
      await page.getByRole("button", { name: "Import", exact: true }).click();
      await expect(page.getByText("Nest under current page")).toBeVisible();
    },
  },
  {
    name: "dialogs-03-link-folder",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Link markdown", page.getByText("Link markdown folder"));
    },
  },
  {
    name: "dialogs-04-ai-edit-idle",
    url: "/",
    wait: "[data-block-id]",
    async act(page) {
      await expect(async () => {
        await page.locator('[data-block-type="paragraph"]').first().hover();
        await page.getByRole("button", { name: "Block menu" }).first().click({ timeout: 1000 });
        await expect(page.getByText("Turn into")).toBeVisible({ timeout: 1000 });
      }).toPass({ timeout: 30_000 });
      // By role, not text: the seed page's own content contains the string
      // "Edit with AI" in a bullet, so getByText matches two nodes.
      await page.getByRole("menuitem", { name: "Edit with AI" }).click();
      await expect(page.getByText("Edit block with AI")).toBeVisible({ timeout: 15_000 });
    },
  },

  // ── harness ──────────────────────────────────────────────────────────────
  {
    name: "harness-01-workflow",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Agent harness", page.getByText("Meta-harness"));
    },
  },
  {
    name: "harness-03-backends",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Agent harness", page.getByText("Meta-harness"));
      await page.getByRole("button", { name: "Backends" }).click();
      await expect(page.getByText(/Install CLIs locally/)).toBeVisible({ timeout: 15_000 });
    },
  },

  // ── AI panels ────────────────────────────────────────────────────────────
  {
    name: "ai-panels-01-idle",
    url: "/",
    wait: '[data-block-type="ai"]',
    clip: '[data-block-type="ai"]',
    async act(page) {
      await page.locator('[data-block-type="ai"]').first().scrollIntoViewIfNeeded();
    },
  },

  // ── setup wizard ─────────────────────────────────────────────────────────
  {
    name: "ai-setup-wizard-02-provider",
    url: "/",
    wait: "aside",
    async act(page) {
      await clickUntil(page, "Settings", page.getByRole("dialog", { name: "Settings" }));
      await page.getByRole("button", { name: "Configure AI" }).click();
      await expect(page.locator('[data-wizard-step="provider"]')).toBeVisible({ timeout: 15_000 });
    },
  },
];

/**
 * Click a named button until something appears. Every first interaction in this
 * app races hydration — handlers attach after the server-rendered markup is
 * already clickable, so one click can land on inert DOM and do nothing.
 */
async function clickUntil(page: Page, button: string, appears: ReturnType<Page["getByText"]>) {
  await expect(async () => {
    await page.getByRole("button", { name: button }).first().click({ timeout: 1000 });
    await expect(appears.first()).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 30_000 });
}

mkdirSync(OUT, { recursive: true });

for (const shot of SHOTS) {
  test(shot.name, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: shot.viewport ?? { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });

    await context.addInitScript(
      ([dark, reveal, darkValue, allTypes, allTypesPage]) => {
        localStorage.setItem("forgenotes-ui-freeze", "1");
        // Every recipe assumes zoom 1. At 1.3 every measurement in every rubric
        // is wrong at once, which reads as many findings instead of one setting.
        localStorage.setItem("forgenotes-zoom", "1");
        if (reveal) localStorage.setItem("forgenotes-ui-reveal", "1");
        if (dark) localStorage.setItem("workspace-v1", darkValue as string);
        if (allTypes) {
          localStorage.setItem(
            "workspace-v1",
            JSON.stringify({
              state: {
                pages: [allTypesPage],
                activePageId: (allTypesPage as { id: string }).id,
                sidebarOpen: true,
              },
              version: 0,
            }),
          );
        }
      },
      [!!shot.dark, !!shot.reveal, DARK, !!shot.allTypes, ALL_TYPES_PAGE] as const,
    );

    const page = await context.newPage();
    await page.goto(shot.url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(shot.wait, { timeout: 60_000 });
    if (shot.act) await shot.act(page);
    // One settle frame: freeze mode stops animation, but a just-opened Radix
    // popover still needs a paint before its content is on screen.
    await page.waitForTimeout(500);

    const target = shot.clip ? page.locator(shot.clip).first() : page;
    await target.screenshot({ path: `${OUT}/${shot.name}.png` });
    await context.close();
  });
}
