# Changelog

Notable changes to ForgeNotes. Released sections are frozen — corrections go in
the next release's notes.

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
