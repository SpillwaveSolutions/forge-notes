# Screen: Overlays (search, markdown I/O, AI setup, harness)

## Goal
Secondary surfaces that sit on the workspace without replacing the shell. Search jumps to a page. Markdown I/O imports, exports, or links a folder. AI setup and the meta-harness are optional panels.

## Layout

```
Workspace stays visible underneath.

⌘/Ctrl+K or sidebar search → Command palette dialog
Header FileDown             → Markdown I/O dialog (only when a page or mount is open)
Sidebar "Link markdown"     → LinkFolderDialog (mount, no copy)
AI setup / harness          → wizard / panel over the editor
/login                      → full route; guest editing still works
```

## Key Elements

| Element | Type | Behavior / Notes |
|---------|------|------------------|
| Command palette | cmdk dialog | Toggle with ⌘/Ctrl+K or sidebar search. Query + results. Database mode uses server search; guest falls back to local. |
| New page from palette | action | Creates a page when the query has no hit. |
| Markdown I/O | dialog | Import a tree or export the current page / hierarchy. Header FileDown is hidden when nothing is open. |
| Link folder | dialog | Mounts a folder without copying files into the workspace DB. |
| AI setup wizard | wizard | Providers (Claude, Grok, OpenAI, Ollama), credentials, MCP tools, workspace skills. Test and finish. |
| Meta-harness | panel | Plan → Implement → Review → Validate. Pluggable backends. Run results stay in the panel. |
| Login | route | `/login`. Label in the shell is **Sign in to sync**. Guest remains available. |

## States
- **Palette closed**: ⌘/Ctrl+K opens it; second press closes.
- **Empty query**: no hits, not an error.
- **Searching**: spinner in the palette.
- **Browser vs signed-in search**: local index vs Postgres (`trgm` when available).
- **I/O hidden**: no FileDown control unless a page or mount is selected.

## Acceptance Criteria
- [ ] ⌘/Ctrl+K toggles the command palette over the workspace.
- [ ] Selecting a search result sets the active page and closes the palette.
- [ ] Import, export, and link-folder actions are present.
- [ ] Linking a folder does not copy files into the workspace DB until import is chosen.
- [ ] Wizard has provider, credentials, tools/skills, and a Test and finish step.
- [ ] Wizard and harness can be dismissed without destroying the page editor.
- [ ] Harness stages are visible; backend can be swapped; run results render in the same panel.
- [ ] Sign-in is optional; guest can still edit locally.

## Notes
- Sources: CommandPalette.tsx, MarkdownIODialog.tsx, LinkFolderDialog.tsx, AiSetupWizard.tsx, HarnessPanel.tsx, routes/login.tsx.
