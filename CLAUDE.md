<!-- worklog:policy:start -->
## Work tracking policy

- Every plan MUST end by running `worklog plan-capture` — it writes
  `docs/plans/<date>-<slug>.md` and appends the plan's steps as work items.
- Work discovered mid-flight that wasn't in the plan: run
  `worklog add --unplanned --discovered-during <item>` BEFORE doing the work.
- Never hand-edit `.work/*.jsonl` (use `worklog`) or `docs/roadmap.md`
  (it is generated; change the work items instead).
- After changing work items, run `worklog roadmap-render` and commit the log
  and roadmap together.
<!-- worklog:policy:end -->

<!-- worklog:taxonomy:start -->
## Work taxonomy

Every work item sits on four independent axes:

| Axis | Field | Values | Answers |
|---|---|---|---|
| Level | `level` | epic / story / task / subtask | size & place in the parent tree |
| Kind | `kind` | feature / bug / ops / triage | nature of the work |
| Milestone | `milestone` | free string (e.g. v0.6.0) or null | what ships together |
| Planned | `unplanned` + `discovered_during` | bool + ULID | deliberate vs discovered |

Rules (the validator enforces these; apply them when proposing items):
1. Kind is free at story/task/subtask.
2. Epics are `feature` or `ops` only — a bug is never epic-sized.
3. `kind` defaults to `triage` when omitted — never silently default to feature.
4. `bug.parent` is optional; bugs may float free of any epic.
5. `milestone` lives on leaves (story and below); an epic's milestone derives from its children.
6. `triage` and `ops` both trend down: triage shrinks by classifying, ops by automating.

When trackable work surfaces in conversation, propose an item inline as part of
the normal response — "want me to file this? `level:story kind:feature
parent:<ulid> milestone:v0.6.0`" — and create it only on assent, via the
work-track or plan-capture skill. When unsure of the kind, propose `kind:triage`
with the open question stated — triage is the honest default, never a confident
guess. This inline path is the default; the flag-gated classifier (`classifier:`
in `.work/config.yml`, off by default) is the escape hatch for teams where work
keeps escaping the log.
<!-- worklog:taxonomy:end -->

---

# ForgeNotes

A block-based notes app with AI assistance, shipping as **both** a web app (Vercel) and a
desktop app (Tauri) from one React SPA. Grown from a Grok app-builder template, so parts of
the tree are pre-wired template code that must not be rewritten — see **Frozen files** below.

## Commands

```bash
npm run dev          # vite dev on 0.0.0.0:8080 — port is a hard contract, see below
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run test         # vitest run — unit tests, colocated as src/**/*.test.ts
npm run test:e2e     # playwright test — WebKit, specs in e2e/
npm run ui:render    # docs/ui wireframes: .puml -> png/
npm run ui:check     # wireframe syntax only
npm run ports        # which dev ports this repo holds
npm run desktop:mcp  # desktop app + agent bridge, on brokered ports
npm run build        # vite build && db:migrate  (what Vercel runs)
npm run tauri:dev    # desktop shell against the same dev server
npm run build:desktop && npm run tauri:build   # two-stage desktop build
node scripts/browser-smoke.mjs http://127.0.0.1:8080/ screenshots/smoke.png
```

## Testing

**Unit tests are Vitest, colocated as `src/**/*.test.ts`** so `tsconfig`'s `include: ["src"]`
typechecks them for free. Import test globals explicitly from `vitest` — `globals` is off on
purpose, so every source file doesn't see ambient `describe`/`it`.

`vitest.config.ts` is **standalone and must stay that way.** It deliberately does not reuse
`vite.config.ts`: `pgliteBootstrapPlugin` is `apply: "serve"` and its `configureServer` awaits
`ensureDbReady()` and rethrows, which would abort every run before a test executes. The
standalone config loads no plugins at all, so that never fires.

**There is no global setup file, deliberately.** A global `mockIPC` would make `isTauri()`
return `true` everywhere and silently stop the web-mode half of `src/lib/tauri.ts` from ever
being tested. Mock per file. One gotcha: `clearMocks()` leaves `window.__TAURI_INTERNALS__`
behind, so delete it in `afterEach` or a later web-mode test still sees `isTauri() === true`.

Don't unit-test the 7 `createServerFn` modules — they need the TanStack Start transform, which
means the real dev server, which means e2e. `vi.mock` them at the call site instead. Never add
`tanstackStart()` to the Vitest config to work around this.

**E2E is Playwright, WebKit only** — that's the engine the desktop build actually uses.
`playwright` and `@playwright/test` are pinned to **1.61.1 exact**: `scripts/browser-smoke.mjs`
depends on chromium revision 1228, and floating the version silently invalidates it. Run
`npm run test:e2e:install` once to fetch WebKit 2311.

`webServer.reuseExistingServer` is on outside CI, so `npm run test:e2e` works whether or not
`npm run dev` is already up — necessary because `strictPort` makes a second server hard-fail.

**`reuseExistingServer` is a liveness check, not an identity check**, and that distinction
has teeth here: three repos on this laptop (`forge-notes`, `okf-forge`, `agent-brain-ui`)
default Vite to 8080. Left naive, `npm run test:e2e` run while a sibling holds 8080 executes
this repo's entire suite against a *different application* — nothing errors, the assertions
just fail, in this repo's specs, pointing at this repo's code.

So `playwright.config.ts` does not hardcode a port. It shells out to
`node scripts/dev-ports.mjs port vite`, which returns a port that is either free or already
serving **this** app (proven by fetching `/` and finding `ForgeNotes` in the HTML), then
threads it through `webServer.env.VITE_PORT`. Reuse is safe by construction.

Related trap: **`npm run dev` deliberately carries no `--port` flag.** A CLI flag outranks
`vite.config.ts`, so re-adding `--port 8080` silently defeats `VITE_PORT` and takes the
Playwright wiring with it.

And the caveat on the caveat: **the marker proves which *app*, not which *build*.** A dev
server left running from before your edit is still ForgeNotes, so the broker keeps it and
Playwright reuses it — and the suite tests the old code while looking exactly like a logic
bug. Symptom: an assertion fails on a control the accessibility snapshot says isn't there,
and the same spec passes in isolation. Kill the server, or `rm -rf node_modules/.vite`.

**Watch for the SSR hydration race.** Buttons exist in server-rendered markup before React
attaches handlers, so a single click can land on inert markup and do nothing. Wrap
click-then-assert in `expect(...).toPass()`. You cannot wait on `networkidle` instead — the
Vite HMR websocket means it never settles.

No pixel-diff baselines (`toHaveScreenshot`): WebKit rendering shifts across macOS point
releases and there is no Linux baseline, so committed PNGs churn.

Two lint errors are pre-existing and unrelated to app code: a build artifact under
`src-tauri/target/` that ESLint should be ignoring, and `rules-of-hooks` at
`src/components/layout/AppShell.tsx:78`. Don't treat a clean-lint run as achievable yet.

## UI verification — mandatory, and gated in CI

**Any change under `src/components/**` or `src/routes/**` must update the matching
`docs/ui/<screen>.md` and its `.puml`, then `npm run ui:render`.** CI enforces this
(`scripts/check-ui-docs.mjs`); a genuinely non-visual change can carry `[skip-ui-docs]` in the
PR title, with the reason stated in the body.

The full protocol lives in **`AGENTS.md`** — that file is what Grok/Codex/OpenCode read, so it
is canonical rather than this one. `docs/ui/README.md` is the index.

What CI can and cannot check is worth being precise about: the **rubric walk is judgement** —
an agent reading a screenshot against a checklist — and no CI job can do it. What CI enforces
is the cheap deterministic invariant: screen code moved, so the spec describing it moved too.
It cannot tell whether the doc was updated *well*, only that it was not skipped.

**Capture mode** (dev-only) is seeded through `localStorage` so it can be set before the page
loads, which is why it works with any capture tool — the MCP browser tools have no `mask`
option:

| Key | Effect |
|---|---|
| `workspace-v1` | Theme: `{"state":{"theme":"dark"},"version":0}` |
| `forgenotes-ui-freeze` | Stops animation/transitions, hides toasts and `[data-volatile]`, blanks the caret |
| `forgenotes-ui-reveal` | Forces `[data-hover-reveal]` affordances visible |

Hover affordances are `opacity-0`, **not unmounted** — clickable but absent from a screenshot.
That asymmetry is the trap `.ui-reveal` exists to close, so screens with them need two
captures, `-rest` and `-reveal`.

When writing new UI: prefer one structural `data-*` carrying a variant
(`data-block-type={block.type}`) over N testids; give every icon-only button an `aria-label`
(the agent reads an accessibility tree, so an unnamed control is invisible to it); give every
form control `id` + `htmlFor`.

## Ports (several agents share this laptop)

Multiple agents run Tauri apps here, so ports collide. `scripts/dev-ports.mjs` brokers them
with three mechanisms:

1. a **reality probe** — actually binding the port, the only check that sees other agents'
   apps, and Chrome, whose remote-debugging port is also 9223;
2. an **identity probe** — fetching `/` and requiring `ForgeNotes` in the HTML, because
   "something is listening" and "*my app* is listening" are different questions;
3. a **registry** at `~/.config/tauri-dev-ports.json`, keyed by repo path, so assignments
   survive between runs.

```bash
npm run ports                              # what's assigned, and who holds it
npm run ports:resolve                      # assign + persist
node scripts/dev-ports.mjs port vite       # print just that port (for configs)
node scripts/dev-ports.mjs check 9223      # is one port free? exit 0/1
node scripts/dev-ports.mjs claim vite 8080 # pin explicitly
node scripts/dev-ports.mjs release         # give this repo's ports back
```

Assignments are **sticky while the port is free or holds our own server** — drifting on every
check would defeat the point of remembering. The one case that is *not* sticky is a port held
by a different app: staying put there is exactly how a sibling's dev server ends up under this
repo's e2e suite. `mcpBridge` has no HTTP marker to check, so it keeps the old warn-and-stay
behaviour. `npm run ports` labels a busy port `this app` or `NOT this app` — `lsof` says
`node` either way, which is no help at all.

`scripts/dev-ports.test.mjs` pins all three branches (stranger, ours, and a bare TCP listener
that never answers — the case that hangs a probe without a timeout).

`8080` is still the default (Grok live preview and `devUrl` assume it); `VITE_PORT` only
overrides locally.

## Desktop MCP bridge

`npm run desktop:mcp` launches the app with the agent bridge and reuses a running dev server.
Then connect with the port it prints.

**The port it prints is the one that matters.** The plugin scans upward from its base, so the
port it binds is often *not* the one requested — base 9223 landing on 9224 is normal, and a
client assuming 9223 gets `no Tauri app found` while everything is in fact fine. The launcher
parses the real port from `MCP Bridge plugin initialized … on HOST:PORT` and records it. Never
run the launcher through a pipe that buffers (`| tail`), or you lose that line.

Two more gotchas, both cost real time:
- **The bridge only binds after the webview loads.** No dev server → no socket → looks
  identical to "the plugin isn't registered".
- **An unscoped `webview_dom_snapshot` times out** on this app's DOM. Pass `--selector` to
  scope it; scoped accessibility snapshots return fast and are what the rubric loop wants.
  Screenshots need a generous `--call-timeout` (30s is not enough; 120s works).

The bridge is compiled **only** under the `mcp-bridge` cargo feature, so release builds never
contain it. Its ACL capability lives at `src-tauri/mcp-bridge.capability.json` — deliberately
**outside** `src-tauri/capabilities/`, because `tauri-build` globs that directory at compile
time and validates permissions against the compiled plugin set; a default build would fail on
the unknown `mcp-bridge:default` permission. It is registered at runtime inside the cfg block.

## Stack

React 19 · TanStack Start / Router / Query · Vite 8 · Tailwind **v4** · TypeScript strict ·
Better Auth · PGlite *or* Postgres · Tauri 2 · LangChain + deepagents.

## Frozen files — do not edit

The template pre-wires auth and expects to be left alone. Rewriting these breaks live-preview
sign-in in ways that are slow to diagnose.

| Path | Rule |
| --- | --- |
| `src/lib/auth/*` | **Only `email-password.ts` is editable.** Everything else is pre-wired. |
| `src/lib/auth/server.ts` | Frozen. It *reads* `emailAndPasswordEnabled`; flip the flag, never the config. |
| `migrations/0001_auth.sql` | Better Auth CLI output. camelCase columns must stay double-quoted. |
| `src/routeTree.gen.ts` | TanStack Router output. `@ts-nocheck`, eslint-ignored, but committed. |
| `src/routes/auth/popup.tsx` | **Must not exist.** `/auth/popup` is served by `authPopupPlugin` in `vite.config.ts`; a React route there paints the app shell into the popup and breaks OAuth. |

Also: **never create `.env` / `.env.local` / `.env.example`.** Nothing is required to run —
auth falls back to a baked preview client, the DB falls back to in-memory PGlite.

## Traps worth knowing before you touch anything

**Port 8080 is a contract.** `vite.config.ts` binds `0.0.0.0:8080` with `strictPort`, Tauri's
`devUrl` is `http://127.0.0.1:8080`, and the Grok live preview assumes it. Changing the port
breaks preview and desktop at once. Relatedly, `nitro({ preset: "vercel" })` is gated on
`command === "build"` — enabling it in dev opens a second port and breaks the single-port
preview.

**Loopback and auth.** Google/X sign-in federates through a shared broker whose preview OAuth
client only accepts `*.grok-sandbox.com` callbacks, so social sign-in **cannot** work on
`localhost`/Tauri. Email+password (`emailAndPasswordEnabled`) is the desktop path, and
`src/lib/auth/server.ts` deliberately trusts all three loopback spellings on 8080. Fix an
"Invalid origin" by opening the right origin — never by loosening CSRF.

**Auth flicker.** Gate on `isPending`, never on `user === null` alone — `null` means *loading
or signed out*, so redirecting on it bounces signed-in users on every hard reload.

**The `.server` suffix is load-bearing.** Modules importing `@tanstack/react-start/server`
must keep it, or Vite ships them to the browser and the app dies with
`AsyncLocalStorage is not a constructor`.

**Data access has no ORM.** Raw SQL through the tagged-template wrapper in `src/lib/db.ts`.
Always go through `getSql()` — it normalizes driver differences between PGlite and `pg`
(int8 → Number, date → `YYYY-MM-DD`, interval → text) so results stay JSON-safe. Bypassing it
reintroduces `BigInt` values that `JSON.stringify` rejects. Kysely appears only as the Better
Auth adapter dialect.

**Migrations are recorded by filename in `_migrations` and never re-run.** Editing an applied
file is a silent no-op — add a new ordered file (`0004_*.sql`). App tables are snake_case with
`user_id TEXT` (TEXT, not UUID, because the dev user id is the literal `'dev-user'`).

**`globalThis` state in `db.ts` / `auth/server.ts` is deliberate**, not sloppiness. It exists
to survive HMR re-evaluation; making it module-level would double-open pools, race migrations,
and invalidate live sessions mid-dev. Don't "clean it up."

**Server functions must be called from client code.** `assertSameSiteRequest()` runs at the
`authMiddleware` chokepoint and needs `Sec-Fetch-Site: same-origin`. Every server function
touching per-user data needs `.middleware([authMiddleware])` and must scope **reads and
writes** by `context.userId`.

**`useSecureCookies: false` is intentional.** It suppresses Better Auth's `__Secure-` prefix so
the code can set `__Host-`-prefixed names itself; `__Host-` forbids a `Domain` attribute, which
is what stops a sibling `*.grok.me` app from injecting a session cookie. Do not "fix" it.

**Known latent bug:** `src-tauri/tauri.conf.json` lists an icon named
`icons/henry.w@example.net` — a scrubbing artifact from `128x128@2x.png`. Harmless today
(file and reference agree) but wrong; fixing it means renaming the file and the config together.

## Conventions

- **Path alias `@/*` → `./src/*`**, declared in `tsconfig.json` only; Vite resolves via
  `resolve: { tsconfigPaths: true }` — there is no `vite-tsconfig-paths` plugin.
- **Tailwind v4 is CSS-first.** There is no `tailwind.config.*` and no `postcss.config.*`.
  All tokens live in `src/styles.css` under `@theme`, with a `.dark` block. Add tokens there.
- **UI primitives are hand-maintained**, shadcn-*style* but not CLI-managed — no
  `components.json`, so `npx shadcn add` is not wired. Only 8 exist in `src/components/ui/`
  (button, dialog, dropdown-menu, input, popover, scroll-area, separator, tooltip). Many
  `@radix-ui/*` packages are installed without local wrappers; follow `button.tsx`'s pattern
  (Radix + `Slot` for `asChild` + `cva` + `cn()`).
- Naming: `*.server.ts` / `*-server.ts` = server-only. Feature folders under `components/`.
  State via zustand with `persist`.
- Prettier: double quotes, semicolons, trailing commas, **printWidth 100**.
- `@typescript-eslint/no-explicit-any` is **off**; unused vars warn, with a `^_` escape.

## Docs map

Prefer editing these over adding new docs; several already cover what you might document.

| File | What it holds |
| --- | --- |
| `AGENTS.md` | **Canonical for the UI verification protocol and the work-tracking rules** — it is what Grok/Codex/OpenCode read, so policy lives there and this file points at it. Also the Grok sandbox operating manual (container/preview contract, port rules, scaffold requirements), parts of which are stale now the repo lives outside `/workspace`. Not a symlink to this file. |
| `docs/ui/` | Per-screen spec + wireframe + rubric + capture recipe. `README.md` is the index; `TEMPLATE.md` starts a new screen. Deliberately outside the worklog IA, so no frontmatter and no `ia-normalize`. |
| `DEVELOPERS.md` | Setup, env vars, architecture, Tauri walkthrough, §11 QA, §12 conventions. |
| `.grok/skills/*/SKILL.md` | 16 skill packages. `auth/` and `neon/` carry the binding auth and DB doctrine quoted above. |
| `FEATURES.md` / `USER_GUIDE.md` | Capability inventory / end-user manual — update when user-visible behavior changes. |
| `TAURI.md`, `harness/README.md` | Desktop packaging; the meta-harness CLI and YAML. |
| `deepagents-root/AGENTS.md` | Runtime system prompt for the **in-app** AI agent, not developer guidance. |
