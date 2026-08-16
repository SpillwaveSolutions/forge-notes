# Screen: Overlays (search, markdown I/O, AI setup, harness)

## Goal
Secondary surfaces that sit on the workspace without replacing the shell.

## Command palette

Search pages and jump. Opened from sidebar search. Dialog with query + results.

Acceptance:
- [ ] Opens as a dialog over the workspace.
- [ ] Selecting a result sets the active page and closes.

## Markdown import / export / link folder

Header FileDown opens MarkdownIODialog. LinkFolderDialog mounts a folder without importing. Export page or hierarchy. Import a tree.

Acceptance:
- [ ] Import, export, and link-folder actions are present.
- [ ] Linking a folder does not copy files into the workspace DB until import is chosen.

## AI setup wizard

Connect providers (Claude, Grok, OpenAI, Ollama), credentials, MCP tools, workspace skills. Test and finish.

Acceptance:
- [ ] Wizard has provider, credentials, tools/skills, and a Test and finish step.
- [ ] Can be dismissed without destroying the page editor.

## Meta-harness panel

Plan to Implement to Review to Validate. Pluggable backends. Shows run results.

Acceptance:
- [ ] Workflow stages are visible.
- [ ] Backend can be swapped without leaving the panel.
- [ ] Run results render in the same panel.

## Login

/login for sync. Guest mode remains available without signing in.

Acceptance:
- [ ] Sign-in is optional; guest can still edit locally.

## Notes
- Sources: CommandPalette.tsx, MarkdownIODialog.tsx, LinkFolderDialog.tsx, AiSetupWizard.tsx, HarnessPanel.tsx, routes/login.tsx.
