# Phase 2: debug-only Tauri MCP bridge

`01KYZ8XKXZHJ767E31NKS05WPR` · story/ops · **done**

Wire tauri-plugin-mcp-bridge as an optional dependency behind a cargo feature, since cfg(debug_assertions) cannot gate a dependency.

## Hierarchy

- epic: [[Ticket-01KYZ8X1X1V76HYNK8B5JYMD9W]] Agent-runnable UI verification loop — Adopt an agent-runnable UI verification loop for ForgeNotes: a written spec and PlantUML Salt wireframe define intent, the UI is made addressable, and an agent takes a real screenshot of the macOS WKWebView via the Tauri MCP bridge and compares it against the wireframe and a written rubric before calling work done.

## Linked PRs

- [[PR-8]]
