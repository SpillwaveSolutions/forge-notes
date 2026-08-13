# Changelog

Notable changes to ForgeNotes. Released sections are frozen — corrections go in
the next release's notes.

## 0.3.1 — 2026-08-12

The desktop app runs. v0.3.0 shipped source only because `cargo tauri build` had
never been run here; running it surfaced a chain of five defects, each of which
hid the next. Three of them shared a failure mode worth naming: **the code was
right, and the thing that read it was lying.**

### Added

- **AI runs on desktop by spawning the local coding CLIs.** `grok`, `claude` and
  `codex` are invoked directly, output streamed back over a `tauri::ipc::Channel`
  — so on desktop there is no server in the path at all, rather than a server we
  pretend is reachable. Grok and Claude are the defaults, picked by probing which
  binary actually exists on first run.

  Two decisions in it are load-bearing. **Spawning lives in Rust**, not behind
  the shell plugin, because scoping that plugin for this would need `args: true`
  — a webview → arbitrary-argv bridge, which is a much larger hole than the
  feature is worth. And **binaries are resolved by searching known install
  directories** before falling back to `PATH`: a `.app` launched from Finder
  inherits a minimal `PATH` with no `~/.local/bin`, `~/.grok/bin` or Homebrew, so
  `Command::new("grok")` works from a terminal and fails from the Dock.

### Fixed

- **`tauri.conf.json` named an icon `icons/henry.w@example.net`** — a scrubbing
  artefact from `128x128@2x.png`. v0.3.0's notes called this harmless because the
  file and the reference agreed. They did, and it still broke every build: the
  bundler infers image format from the extension, `.net` is not one, and
  `cargo tauri build` died with *"The image format could not be determined."*
  That is why the packaging path stayed unexercised — the first person to run it
  hit a wall. **Generalises past this file: "the references agree" is not "it
  works."** The consistency was checkable by reading; the format inference was not.
- **The desktop window painted nothing but "Something went wrong!"** Better Auth's
  `createAuthClient` infers its base URL from `window.location.origin` and throws
  on any non-http(s) protocol — at module scope, under `tauri://localhost`, so the
  route chunk died and the router boundary covered the whole app.
  `src/lib/auth/base-url.ts` overrides the base URL only when the origin is not
  http(s); every web origin is untouched. This is the one sanctioned edit inside
  the otherwise-frozen `src/lib/auth/*`.
- **Every fix before that one was invisible, because the binary carried a stale
  frontend.** Cargo does not track `dist-desktop/`, and Tauri embeds
  `frontendDist` at compile time — so rebuilding the frontend and re-running
  `tauri build` yields a binary containing the *previous* bundle, silently. Three
  rounds of desktop fixes were built, installed and tested without one of them
  reaching the running app. `scripts/build-desktop.mjs` now bumps a tracked Rust
  source to force the re-embed.
- **The error instrumentation could not see the error.** A React error boundary
  *catches* the exception, so `window.onerror` never fires — its silence proved
  nothing while the app was visibly showing a boundary. Route errors now report
  through the router's `defaultOnCatch`.
- **The AI block did nothing at all when Run was pressed.** An unknown path under
  `tauri://localhost` does not 404 — the asset protocol returns `index.html` with
  **HTTP 200**. So `res.ok` was true, `/api/ai/stream` "succeeded", and the client
  parsed HTML into an empty result with no error anywhere. Clients that fetch an
  app endpoint now check the **content type**, not just `res.ok`, and say plainly
  that the server is unreachable.

### Changed

- `dist-desktop/` and `.vercel/` are untracked build output (249 files left the
  index) and ESLint ignores them — they were contributing 10,468 of a reported
  10,990 lint problems.
- A claim in `safe-storage.ts` that WebKit denies storage under `tauri://localhost`
  was measured and found false. The guard stays — it is still correct for Safari
  private browsing — but the docstrings no longer assert something untrue.

### Known issues

- **The `.dmg` is unsigned and un-notarised**, so Gatekeeper blocks it on any
  machine but the one that built it.
- **Sign-in, database sync and server-side search do not work in the packaged
  desktop app.** They need a server the bundle does not contain; AI now sidesteps
  this rather than solving it, and the rest awaits a backend decision.
- The two pre-existing lint errors remain; lint stays advisory in CI.

## 0.3.0 — 2026-08-03

Closes the UI verification loop. v0.2.0 proved it on one screen; this release
specifies **all eleven**, captures every documented state from the running app,
and walks the rubrics — which found three defects, none of them visible to
someone reading the code.

Also ships two user-facing features and fixes a build-tooling bug whose failure
mode was worse than its difficulty.

### Added

- **Header theme toggle.** Theme was already changeable, but only from Settings,
  three clicks deep and unreachable from `/login`. Both controls write the same
  persisted field, so they cannot disagree. Its icon and accessible name name the
  *destination* — a Moon and "Switch to dark theme" while light — because a
  control labelled "Dark" is ambiguous about which one it means, and an agent
  reading the accessibility tree has only the name to go on.
- **Zoom: ⌘+ / ⌘- / ⌘0**, remembered per device. A root font size rather than a
  transform: Tailwind sizes everything here in rem, so one property scales type,
  padding, gaps and radii together, while `transform: scale()` would blur text
  and break every `position: fixed` child. Steps follow a fixed ladder because
  repeated multiplication accumulates float error into values like
  `1.3310000000000004` that never compare equal again. Stored under its own
  machine-local key, not in the synced workspace — a level set on a desktop
  should not follow you to a laptop.
- **Specs for the remaining ten screens** — 11 documents and 47 wireframes, up
  from 1 and 7. Every screen under `src/components/**` and `src/routes/**` now
  has a spec, addressability table, capture recipe, wireframe and rubric.
  `docs/ui/tokens.md` holds the shared vocabulary the others point at.
- **A capture harness** (`npm run ui:capture`) encoding all 30 recipes. Opt-in
  behind `CAPTURE=1`: it produces artefacts and asserts nothing, and a CI job
  that passes without checking anything is worse than none.
- **Port identity checking.** Three repos on this laptop default Vite to 8080, and
  `reuseExistingServer` asks whether a port answers, not whether *this app*
  answers. The broker now fetches `/` and requires the app's marker before
  reusing a port; `npm run ports` reports `this app` / `NOT this app`, which
  `lsof` cannot.

### Fixed

- **Three of fourteen block types were unaddressable.** `BlockRow` returns early
  for `divider`, `ai` and `mermaid` roughly 130 lines above the wrapper that sets
  `data-block-id` / `data-block-type`, and none of those wrappers had them. The
  blocks rendered perfectly; only selector-based tooling could tell.
- **The e2e test guarding exactly that was vacuous.** It collected
  `[data-block-type]` elements and checked each had an id — so a row carrying
  neither satisfied it trivially, and it stayed green through the whole defect.
  It now compares the rendered row count against the store. Generalisable: *a
  test that filters by the thing it is checking for cannot detect absence.*
- **The command palette's empty state was unreachable.** `cmdk` renders
  `<Command.Empty>` only when the whole list has zero items, and the Actions
  group always contributes "New page" — so a search matching nothing showed a
  bare "Results" heading with no rows and no message.
- **`npm run dev` silently defeated `VITE_PORT`.** Its `--port 8080` flag
  outranked the config, so none of the port work above would have taken effect.

### Changed

- `AGENTS.md` and `CLAUDE.md` record the traps the walk surfaced: four native OS
  dialogs that freeze the MCP bridge, the two-`aside` ambiguity below `md`, and
  that a marker proves which *app* is on a port, never which *build*.

### Known issues

- Still no binaries: `cargo tauri build` has never run here, so the desktop
  packaging path remains unexercised and this tag ships source only.
- Six behaviour inconsistencies are documented rather than fixed — "Move to
  trash" vs "Delete" for one operation, two different sync-icon vocabularies,
  `HarnessPanel`'s missing focus trap among them.
- The two pre-existing lint errors remain; lint stays advisory in CI.
- Three screen states cannot be captured offline (AI streaming output, mounted
  markdown, the harness result panel) because they need a backend or a native
  picker. Recorded in the specs rather than faked.

## 0.2.0 — 2026-08-01

First tagged release. Ships an **agent-runnable UI verification loop**: a written
spec and wireframe define what a screen should look like, the UI is addressable
enough to drive, and an agent compares a real screenshot of the real macOS
WKWebView against a rubric before calling work done.

The motivation was concrete. The email/password sign-in feature merged with
`tsc` and `eslint` green and its runtime path never exercised — and turned out to
contain two real bugs, both listed below, neither findable by reading code.

### Added

- **Test foundation.** Vitest 4 with a standalone config, and Playwright pinned to
  1.61.1 running WebKit — the engine the desktop build actually uses. 20 unit and
  15 e2e specs where previously there was no runner at all.
- **CI that runs code.** The repo's first Node workflow: typecheck, unit tests,
  e2e on WebKit, and lint (advisory). Previously CI only checked git-log invariants.
- **Debug-only Tauri MCP bridge.** `tauri-plugin-mcp-bridge` behind a cargo feature,
  so release builds never contain it. Gives an agent screenshots, accessibility
  snapshots, JS execution, and IPC monitoring against the running desktop app.
  Bound to `127.0.0.1` rather than the plugin's `0.0.0.0` default.
- **Cross-agent port broker** (`scripts/dev-ports.mjs`). Several agents run Tauri
  apps on one machine; this probes availability by actually binding — the only
  check that sees other agents' apps and Chrome, whose debug port is also 9223 —
  and remembers each repo's assignment.
- **UI addressability.** Structural attributes (`data-block-type`,
  `data-wizard-step`) rather than enumerated test ids, an accessible name on the
  one button that lacked it, and dialog semantics for the command palette, which
  had been an anonymous `div`.
- **Screenshot determinism.** `.ui-freeze` and `.ui-reveal`, seeded from
  `localStorage` so they can be set before page load and work with any capture
  tool. Stops animation, hides toasts and volatile values, and forces hover-gated
  affordances visible — those are `opacity-0`, not unmounted, so they are
  clickable but absent from a screenshot.
- **`docs/ui/` pipeline.** Per-screen spec, wireframe, rubric, and capture recipe,
  with PlantUML Salt sources rendering to committed PNGs. The AI Setup Wizard is
  fully specified across seven states.
- **CI gate on the loop** (`scripts/check-ui-docs.mjs`). A change under
  `src/components/**` or `src/routes/**` must arrive with a `docs/ui/` update.

### Fixed

- **`/login` could never render dark.** The effect applying `.dark` to `<html>`
  lived inside `AppShell`, which `/login` does not render, so the page's
  dark-mode styling was unreachable on a cold load.
- **`/login` had a React hydration mismatch.** `isLocalAuthOrigin()` reads
  `window.location`, so it returned `false` during SSR and `true` on the client
  while the loopback banner rendered straight off it. React recovered by
  re-rendering, so it surfaced only in a dev-server log nobody was reading.

### Changed

- `AGENTS.md`'s QA section rewritten. It had said *"a landing page screenshot is
  usually enough"* and pointed at `/workspace/screenshots/`, a path that does not
  exist outside the original sandbox. It is now canonical for the UI verification
  protocol and the work-tracking rules, which it previously did not mention at all.
- `playwright` pinned to 1.61.1 exact — `scripts/browser-smoke.mjs` depends on
  chromium revision 1228, and floating the version silently invalidates it.

### Known issues

- Two pre-existing lint errors remain: a build artifact under `src-tauri/target/`
  that ESLint should ignore, and a `rules-of-hooks` violation in `AppShell.tsx`.
  Lint is advisory in CI until they are fixed.
- `src-tauri/tauri.conf.json` lists an icon named `icons/henry.w@example.net`, a
  scrubbing artifact from `128x128@2x.png`. Harmless (file and reference agree)
  but wrong.
- Only the AI Setup Wizard has a `docs/ui/` spec. The remaining ~23 screens are
  outstanding, and the CI gate will block the first PR touching each of them —
  intentionally, so the backlog is paid down rather than staying invisible.
