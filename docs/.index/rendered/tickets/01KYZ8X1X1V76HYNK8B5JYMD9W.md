# Agent-runnable UI verification loop

`01KYZ8X1X1V76HYNK8B5JYMD9W` · epic/ops · **done**

Adopt an agent-runnable UI verification loop for ForgeNotes: a written spec and PlantUML Salt wireframe define intent, the UI is made addressable, and an agent takes a real screenshot of the macOS WKWebView via the Tauri MCP bridge and compares it against the wireframe and a written rubric before calling work done.

## Children

- [[Ticket-01KYZ8XKMKNZXG4VH7JD53QVJ6]] Phase 0: clear decks — commit CLAUDE.md, close out worklog state — Force-add CLAUDE.md past the global gitignore so teammates get the guidance, open and merge the pending close-auth-item PR, normalize doc metadata, and file the work items for this effort. (done)
- [[Ticket-01KYZ8XKS8JTKW475Z0V18GSYF]] Phase 1: Vitest + Playwright WebKit foundation — Install vitest+jsdom and @playwright/test pinned to 1.61.1 (matching the installed chromium rev 1228 that scripts/browser-smoke.mjs depends on). (done)
- [[Ticket-01KYZ8XKXZHJ767E31NKS05WPR]] Phase 2: debug-only Tauri MCP bridge — Wire tauri-plugin-mcp-bridge as an optional dependency behind a cargo feature, since cfg(debug_assertions) cannot gate a dependency. (done)
- [[Ticket-01KYZ8XM2SCZG43J0MD59P4ZHK]] Phase 3: testability retrofit + login dark-mode fix — Add structural data attributes (data-block-type, data-wizard-step) rather than enumerated testids, aria-labels for the ~20 unnamed icon-only buttons, role/aria-modal on CommandPalette, id/htmlFor on form controls. (done)
- [[Ticket-01KYZ8XM7DGK443WDFCVJTVC40]] Phase 4: screenshot determinism and reveal controls — A .ui-freeze class seeded from localStorage plus ~8 lines of CSS kills spinners, toasts and animations at once, and works with any capture tool since MCP browser tools have no mask parameter. (done)
- [[Ticket-01KYZ8XMBYBDR7M7V95CZZ63F3]] Phase 5: spec/wireframe/rubric pipeline, piloted on AiSetupWizard — One markdown per screen family under docs/ui (invisible to the worklog IA, so zero coupling), PlantUML Salt wireframes rendered by two package.json lines. (done)
- [[Ticket-01KYZ8XMGPWDJ8KXXK23KV47NT]] Phase 6: roll out to remaining screens, make the loop mandatory — Six waves of per-screen docs, the AGENTS.md protocol replacing the stale Browser QA section, and the repo's first Node CI workflow. (done)

Progress: 7/7 done

## Related tickets

- [github #12](https://github.com/SpillwaveSolutions/forge-notes/issues/12)
