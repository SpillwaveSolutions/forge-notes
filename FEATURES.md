# Features

Complete feature inventory for **ForgeNotes**. For how to use them, see [USER_GUIDE.md](./USER_GUIDE.md). For setup and builds, see [DEVELOPERS.md](./DEVELOPERS.md).

---

## 1. Workspace & navigation

| Feature | Description |
|---------|-------------|
| **Sidebar** | Collapsible sidebar with workspace name, search entry, new page, import/export, link markdown, agent harness |
| **Nested pages** | Hierarchical pages with expand/collapse, sub-pages, depth-aware layout |
| **Favorites** | Star pages; favorites section for quick access |
| **Trash** | Soft-delete pages; restore or permanently delete from Trash dialog |
| **Page menu** | Favorite / unfavorite, add sub-page, duplicate, delete |
| **Active page** | Single active page in the main editor; mount selection can take over for linked markdown |
| **Theme** | Light and dark modes (Settings) |
| **Workspace name** | Renamable workspace title (Settings) |
| **Reset workspace** | Restore seed demo pages (Settings; destructive) |
| **Mobile layout** | Responsive shell; mobile sidebar drawer; usable ~390px width |
| **Command palette / search** | Quick open pages and content (sidebar Search / palette) |

---

## 2. Block editor

Notion-style blocks stored per page as structured JSON.

### Block types

| Type | Role |
|------|------|
| `paragraph` | Body text |
| `heading1` / `heading2` / `heading3` | Section titles |
| `bullet` / `numbered` | Lists |
| `todo` | Checkable action items |
| `quote` | Quoted text |
| `code` | Monospace / code fence content |
| `divider` | Horizontal rule |
| `callout` | Highlighted note |
| `toggle` | Collapsible section |
| `mermaid` | Mermaid diagram (source + rendered SVG) |
| `ai` | AI block: prompt + page-context generation |

### Editing behavior

| Feature | Description |
|---------|-------------|
| **Inline editing** | Auto-growing textareas with reliable paint (not fragile contentEditable) |
| **Type changes** | Change block type (headings, lists, etc.) |
| **Insert / delete / reorder** | Insert after a block, delete, move up/down |
| **Indent** | List-style indent support on blocks |
| **Todo checked state** | Persist checked todos |
| **Mermaid source toggle** | Show source vs rendered diagram |
| **AI block output** | Stores last output / error under the prompt |

---

## 3. Pages & content model

| Feature | Description |
|---------|-------------|
| **Title + icon** | Per-page title and emoji/icon |
| **Cover** | Optional cover styling presets |
| **Timestamps** | `createdAt` / `updatedAt` on pages |
| **Parent/child** | `parentId` hierarchy; move/reparent support in store |
| **Duplicate** | Deep-ish page copy with new IDs |
| **Import bulk** | Import multiple markdown-derived pages into the workspace |
| **Seed content** | First-run demo pages for empty workspaces |

---

## 4. Persistence & auth

| Feature | Description |
|---------|-------------|
| **Guest / local mode** | Zustand + `localStorage` when not signed in |
| **Database mode** | Per-user workspace in Postgres / PGLite when authenticated |
| **Sync status** | UI: local / pending / saving / saved / error |
| **Auth (Better Auth)** | Sign-in, session, sign-out; optional OAuth-style popup flow in dev |
| **Sign in to sync** | Sidebar CTA when auth is enabled and user is guest |
| **Remote bootstrap** | Load workspace from DB on login; flush saves on change |
| **Local-only fallback** | Explicit local mode if user stays signed out |

---

## 5. Search

| Feature | Description |
|---------|-------------|
| **Postgres FTS** | Keyword search via `tsvector` / full-text index (`page_search`) |
| **Similarity fallback** | Trigram / similarity-style matching when configured |
| **Reindex on save** | Search index updated when workspace is saved |
| **Local search** | Client-side text search over page titles/blocks when offline/local |
| **Command palette** | UX entry point for finding pages/content |

---

## 6. AI generation

### Backends

| Backend | Description |
|---------|-------------|
| **LangChain Deep Agents** | In-process agent with skills + MCP tools |
| **Direct model API** | Single-shot chat (streamable) |
| **Claude Code CLI** | Shell `claude -p` (prefers stream-json) |
| **Codex CLI** | Shell `codex exec` (stdout stream) |
| **Grok CLI** | Shell `grok -p` (headless one-shot) |
| **Local demo** | Offline placeholders without keys/CLIs |

### Web vs desktop

On the **web** every backend runs server-side: the browser posts to
`/api/ai/stream` and the server spawns the CLI or calls the provider.

The **desktop app has no server**, so it runs the CLIs itself — through a Rust
command (`src-tauri/src/ai_cli.rs`) rather than HTTP. Consequences worth knowing:

- **Grok CLI is the desktop default**, then Claude, then Codex — whichever is
  installed. A fresh desktop install is switched off `deepagents` automatically,
  because that backend needs both an API key and a server.
- **The API-key backends (Deep Agents, Direct) do not work on desktop.** They
  need the server. Choosing one falls back to an installed CLI.
- **Binaries are found by searching**, not by `PATH` alone: an app launched from
  Finder gets a minimal `PATH` that excludes `~/.local/bin`, `~/.grok/bin`, and
  Homebrew — where all three CLIs actually live.
- Spawning happens in Rust, not via the shell plugin, so the webview can never
  choose the binary or its arguments.

### Model providers (API path)

- **xAI · Grok**
- **Anthropic · Claude**
- **OpenAI** (GPT / o-series)
- **Ollama** (local OpenAI-compatible)
- **OpenAI-compatible** custom base URL

### AI product surfaces

| Feature | Description |
|---------|-------------|
| **AI setup wizard** | Multi-step: welcome → backend/provider → credentials/CLI tips → MCP → skills → test & finish |
| **AI settings panel** | Stored in browser `localStorage`; keys not committed to repo |
| **Prefer streaming** | SSE stream when backend supports it |
| **AI block** | Page-context actions: Summary, Todos, Table, Outline, Mermaid, custom prompt |
| **Edit block with AI** | Rewrite selected block (improve, shorter, expand, grammar, pro, custom) |
| **Stop generation** | AbortController cancel on streaming runs |
| **Live stream preview** | Tokens appear as they arrive |
| **Connection test** | Probe API / Deep Agents / CLI on PATH |
| **MCP attach** | HTTP / SSE / stdio servers; test tool listing |
| **Skills** | Workspace skills (summarize, edit-block, action-items, table, mermaid, custom, …) |
| **Env keys fallback** | Server can use `XAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` if set |

### Streaming

- `POST /api/ai/stream` — Server-Sent Events (`token` / `status` / `done` / `error`)
- Used by AI blocks and edit-block dialog when streaming preferred

---

## 7. Mermaid diagrams

| Feature | Description |
|---------|-------------|
| **Mermaid blocks** | First-class block type |
| **Render** | Client-side Mermaid → SVG |
| **AI-generated diagrams** | “Diagram” preset on AI blocks returns mermaid blocks |
| **Source view** | Toggle between diagram and source |

---

## 8. Markdown: link, import, export

| Feature | Description |
|---------|-------------|
| **Link folder (no import)** | View markdown files from a directory without copying into workspace |
| **Server mounts** | Paths under allowed roots (e.g. `/workspace/markdown-samples`) |
| **Browser mounts** | File System Access API + IndexedDB-stored directory handles |
| **Sample linked notes** | Default sample mount for demos |
| **Browse mount tree** | Expand folders; open `.md` files in the same shell |
| **Import file / tree** | Parse markdown → pages/blocks; hierarchy from directories |
| **Export page / hierarchy** | Markdown files + folder structure |
| **Zip export** | Download export as zip (jszip / fflate) |
| **Server directory export** | Write markdown tree to a server path (allowed roots) |
| **Round-trip conversion** | Blocks ↔ markdown helpers for headings, lists, todos, code, mermaid, etc. |

---

## 9. Meta-harness (agent workflows)

Thin layer above coding agents so **workflows are not locked to one vendor CLI**.

| Feature | Description |
|---------|-------------|
| **Pluggable backends** | mock, local-deepagents, claude-cli, codex, grok-build, … |
| **Agent YAML** | Omnigent-shaped defs under `harness/agents/` |
| **Workflow YAML** | e.g. Plan → Implement → Review → Validate |
| **Durable plans** | `harness/plans/*.md` survive agent switches |
| **Run artifacts** | `harness/artifacts/{runId}/` + SUMMARY |
| **CLI (`wks`)** | `npm run wks -- harness …` / `node cli/wks.mjs` |
| **In-app Harness panel** | Sidebar “Agent harness” — pick backend, feature, run workflow |
| **Cross-vendor review** | Independent reviewer role vs implementer backend |

Details: [harness/README.md](./harness/README.md).

---

## 10. Desktop (Tauri)

| Feature | Description |
|---------|-------------|
| **Native window** | Tauri 2 shell around the web UI |
| **Standalone bundles** | Windows `.exe`/`.msi`, macOS `.app`/`.dmg`, Linux `.AppImage`/`.deb` |
| **Desktop badge** | Sidebar/settings show Desktop · platform when in Tauri |
| **Shell / dialog / fs plugins** | Open paths, system dialogs, filesystem APIs |
| **CLI detection** | Rust `which_binary` for host PATH tools |
| **Dev mode** | `tauri dev` loads Vite at `127.0.0.1:8080` |

Details: [TAURI.md](./TAURI.md).

---

## 11. Developer / platform features

| Feature | Description |
|---------|-------------|
| **TanStack Start + Router** | File routes, SSR/build to Vercel via Nitro when building |
| **Vite 8 + React 19 + TS** | Modern frontend stack |
| **Tailwind v4 + Radix/shadcn** | Design system primitives |
| **PGLite** | Embedded Postgres for local/serverless-friendly DB |
| **Kysely / migrations** | SQL migrations for workspaces, pages, search |
| **Typecheck / lint / format** | `tsc`, eslint, prettier scripts |
| **Smoke scripts** | Browser smoke helpers for QA |

---

## 12. Security & privacy notes (product)

| Topic | Behavior |
|-------|----------|
| **API keys** | Kept in browser local storage; sent only to this app’s AI endpoints |
| **CLI auth** | Handled by installed CLIs (`claude login`, etc.); not stored in workspace settings |
| **Markdown server paths** | Restricted to allowed roots under the workspace |
| **MCP tokens** | Optional bearer / headers; stored with client AI settings |

---

## See also

- [USER_GUIDE.md](./USER_GUIDE.md) — how to use and configure  
- [DEVELOPERS.md](./DEVELOPERS.md) — setup and build  
- [README.md](./README.md) — project overview  
