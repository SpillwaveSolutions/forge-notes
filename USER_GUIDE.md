# User guide

How to use and configure **ForgeNotes**.  
Feature list: [FEATURES.md](./FEATURES.md) · Developer setup: [DEVELOPERS.md](./DEVELOPERS.md).

---

## 1. Getting around

### Sidebar

| Control | What it does |
|---------|----------------|
| **Workspace name** (top) | Opens Settings |
| **Search** | Opens command palette / page search |
| **New page** | Creates a page and focuses the editor |
| **Import / export** | Markdown zip or tree import/export |
| **Link markdown** | Attach a folder to *view* without importing |
| **Agent harness** | Run Plan → Implement → Review → Validate workflows |
| **Favorites** | Starred pages |
| **Private** | Your page tree (expand for sub-pages) |
| **Linked markdown** | Linked folders and `.md` files |
| **Trash** | Restore or permanently delete |
| **Settings** | Name, theme, AI, storage, reset |
| **Sign in to sync** | When auth is on and you are a guest |

### Main editor

- Open a page from the sidebar.
- Edit the title and blocks in place.
- Use page menus (⋯) for favorite, sub-page, duplicate, delete.

### Mobile

- Use the menu control to open the sidebar.
- Primary actions stay reachable; avoid relying on hover-only menus.

---

## 2. Working with pages

1. **New page** → type a title → add blocks below.
2. **Sub-page**: hover a page → ⋯ → **Add sub-page**, or the **+** control.
3. **Favorite**: ⋯ → Favorite (appears under Favorites).
4. **Duplicate**: ⋯ → Duplicate.
5. **Delete**: ⋯ → Delete (moves to Trash).
6. **Restore**: Trash → Restore (returns to top level).

Icons and covers (where available) personalize pages; update them from the page header / editor chrome.

---

## 3. Editing blocks

### Common types

Paragraphs, headings (H1–H3), bullets, numbered lists, todos, quotes, code, dividers, callouts, toggles, Mermaid, AI.

### Tips

- Click a block and type; the field grows with content.
- Change structure with block type controls on the row (headings, lists, etc.).
- **Todos**: check the box to mark done.
- **Mermaid**: write diagram source; switch to rendered view when ready.
- Insert blocks below the current one; reorder with move controls where shown.

---

## 4. Search

1. Click **Search** (or the palette shortcut if your host provides one).
2. Type keywords from titles or body text.
3. When signed in with database sync, search uses **Postgres full-text** (and similarity fallbacks). Local/guest mode searches in-browser content.

---

## 5. Persistence: local vs database

| Mode | When | Behavior |
|------|------|----------|
| **Local only** | Signed out / guest | Data in this browser (`localStorage`) |
| **Database** | Signed in | Workspace loaded/saved per user in Postgres/PGLite |

- Cloud icon in the sidebar reflects sync: saving / saved / error / local.
- **Sign in** to move from local-only to synced storage (when auth is enabled for your deployment).
- Signing out keeps guest local behavior; do not assume automatic merge of guest data unless your admin documents a migration path.

---

## 6. Configuring AI

Open **Settings → Configure AI**, or the banner on an AI block / edit dialog.

### Wizard steps

1. **Welcome** — overview of API vs CLI paths  
2. **Provider / backend** — pick how generation runs  
3. **Credentials** — API keys *or* CLI install tips  
4. **MCP tools** — optional tool servers (Deep Agents)  
5. **Skills** — which workspace skills Deep Agents may use  
6. **Test & finish** — connection test, save  

Settings live in **browser local storage**. API keys are sent only to this app’s AI endpoints.

### Choose a backend

| Backend | Use when |
|---------|----------|
| **Deep Agents** | Skills + MCP tools, multi-step agent loop |
| **Direct chat** | Simple single-shot model calls |
| **Claude Code CLI** | Host has `claude` installed & logged in |
| **Codex CLI** | Host has `codex` installed & authenticated |
| **Grok CLI** | Host has `grok` / Grok Build |
| **Local demo** | No keys/CLIs; offline placeholders |

Leave **Prefer streaming** on for live token previews (recommended).

### API providers

For Deep Agents or Direct:

1. Select **xAI**, **Anthropic**, **OpenAI**, **Ollama**, or **OpenAI-compatible**.
2. Paste API key (if required).
3. Set **model** (and **base URL** for Ollama / compatible hosts).
4. Adjust temperature / recursion limit if needed.
5. **Test connection**.

Server env vars (`XAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) can backfill when client keys are empty (deployment-dependent).

### Coding CLIs

1. Install and log in on the **machine running the app server** (or desktop binary):
   - Claude Code → `claude login`
   - Codex → vendor login flow
   - Grok → `grok login` / XAI credentials
2. In the wizard, select the matching CLI backend.
3. Test connection — should report binary **on PATH**.

Streaming uses CLI stdout (stream-json for Claude when available).

**On the desktop app a CLI is the only thing that works, and it is the default.**
The desktop build has no server, so the API-key backends (Deep Agents, Direct
model API) cannot run there; a fresh install is pointed at **Grok CLI**, falling
back to Claude then Codex depending on what is installed. The app finds these
binaries itself — including in `~/.local/bin`, `~/.grok/bin`, and Homebrew,
which are *not* on the PATH an app launched from the Dock inherits — so there is
nothing to configure. If none of the three is installed, AI says so rather than
appearing to run.

### MCP servers (Deep Agents)

1. Wizard → **MCP tools** → **Add server**.
2. Transport:
   - **HTTP / SSE** — URL + optional bearer / headers  
   - **stdio** — command + args + env  
3. **Test** to list tools.
4. Enable only servers you trust.

### Skills

Toggle skills such as summarize-page, edit-block, action-items, table-from-notes, mermaid-diagram, custom-page-task. Disabled skills still allow a best-effort run without that skill pack.

---

## 7. Using AI in the product

### AI block

1. Insert an **AI** block on a page.
2. Optionally open **Configure AI** if the banner shows.
3. Run a preset: **Summary**, **Todos**, **Table**, **Outline**, **Diagram** — or write a custom instruction and **Run**.
4. Watch the **stream preview**; use **Stop** to cancel.
5. Accept/insert results as blocks below (per panel actions).

Context includes page title and page text.

### Edit block with AI

1. Open **Edit with AI** on a content block.
2. Pick a preset (Improve, Shorter, Expand, Fix grammar, Professional) or custom instruction.
3. Review the streaming preview → **Apply to block**.

### Mermaid via AI

Use the **Diagram** preset on an AI block, or ask for a mermaid flowchart in a custom instruction. Results should land as `mermaid` blocks.

---

## 8. Markdown workflows

### Link a folder (view without import)

1. Sidebar → **Link markdown**.
2. **Server path** (allowed under workspace roots) **or** pick a **browser folder** (File System Access API).
3. Expand the mount under **Linked markdown** and open `.md` files.
4. Content opens in the same UI shell; unlinking removes the mount (does not delete disk files).

Use this for large note directories you do not want to copy into the workspace database.

### Import

1. **Import / export**.
2. Import a single file or a directory/zip of markdown.
3. Pages and hierarchy are created from paths and headings/content.

### Export

1. **Import / export**.
2. Export the current page or a hierarchy as markdown.
3. Download as **zip**, or write to a **server directory** (allowed paths).

Round-trip preserves common structures (headings, lists, todos, code, mermaid) as best-effort.

---

## 9. Agent harness

For multi-step coding-agent workflows that are **not** locked to one vendor.

### In the UI

1. Sidebar → **Agent harness**.
2. Choose a **backend** (mock for dry-run, or a real agent backend).
3. Enter a **feature** name / description.
4. **Run workflow** (e.g. Plan → Implement → Review → Validate).
5. Inspect JSON/result summary; durable files also land under `harness/plans` and `harness/artifacts` on the host.

### From the terminal (developers / power users)

```bash
npm run wks -- harness backends
npm run wks -- harness workflow plan-implement-review-validate --feature "My feature" --backend mock
```

See [harness/README.md](./harness/README.md).

---

## 10. Running the Tauri desktop app

Workspace can run as a **native desktop app** (Tauri) with the same UI as the browser. Use this when you want a standalone window, OS integration, and host PATH for coding CLIs.

### Option A — Run a built / installed app (end users)

Someone already built the desktop package (see [DEVELOPERS.md](./DEVELOPERS.md) § Desktop builds).

| Platform | How to run |
|----------|------------|
| **Windows** | Double-click **ForgeNotes** from the Start menu (if you used the installer), or run `ForgeNotes.exe` / the release binary. Portable: run the `.exe` next to any required DLLs. **WebView2** must be present (most Windows 10/11 machines already have it). |
| **macOS** | Open **ForgeNotes.app** (from Applications or the `.dmg`). First open may need **Right-click → Open** if Gatekeeper blocks an unsigned build. |
| **Linux** | Make the **`.AppImage`** executable and run it (`chmod +x ForgeNotes_*.AppImage && ./ForgeNotes_*.AppImage`), or install the **`.deb`** and launch **ForgeNotes** from the app menu. |

**What you should see**

1. A native window titled **ForgeNotes** (not only a browser tab).
2. The same sidebar, editor, AI, markdown, and harness as the web app.
3. In **Settings**, a badge like **Desktop · windows** / **darwin** / **linux** (confirms you are in the Tauri shell).

**Using AI CLIs on desktop**

- Claude Code, Codex, and Grok CLIs use **your computer’s PATH**.
- Install and log in on that machine (`claude login`, Codex login, `grok login`, etc.).
- Then choose the matching backend under **Configure AI** and run an AI block or edit.

**Data**

- Guest data still lives in the embedded webview storage (similar to browser local storage for that app).
- Sign-in / database sync works the same as the web build when auth is configured for your deployment.

### Option B — Run desktop in development (from source)

If you have the repo checked out and want a live desktop window while coding:

1. Install prerequisites once: **Node 22**, **Rust** (`rustup`), and OS WebView deps ([TAURI.md](./TAURI.md) / [DEVELOPERS.md](./DEVELOPERS.md)).
2. From the project root:

```bash
npm install
npm run tauri:dev
# same as: npm run desktop
```

3. Tauri starts Vite (`npm run dev` on port **8080**) and opens a **native window** pointed at that server.
4. Edit source files; the UI hot-reloads in the desktop window like the browser.

Close the window or stop the terminal process to quit. You do **not** need a separate browser tab for day-to-day desktop dev.

### Option C — Run the portable release binary without an installer

After a release build (developers produce this with `npm run tauri:build`):

```text
src-tauri/target/release/          # raw binary (e.g. forgenotes-desktop or ForgeNotes.exe)
src-tauri/target/release/bundle/   # installers & AppImage / dmg / msi
```

- **Windows:** run the release `.exe` (WebView2 required).
- **Linux:** prefer the **AppImage** for a single-file portable app.
- **macOS:** open the `.app` from the bundle folder.

If the window opens blank, the frontend assets may be missing — ask whoever built it to re-run a full `tauri:build` (it packages `dist-desktop`). Details for builders: [DEVELOPERS.md](./DEVELOPERS.md) and [TAURI.md](./TAURI.md).

### Desktop vs browser (quick comparison)

| | Browser (`npm run dev` / hosted URL) | Tauri desktop |
|--|--------------------------------------|---------------|
| Window | Browser tab | Native app window |
| Install | None (or PWA) | Installer / AppImage / .app / portable exe |
| AI CLIs | Server machine PATH | **Your** machine PATH |
| Badge in Settings | No “Desktop · …” | Shows platform |
| Best for | Preview, shared deploy | Local app, CLI tooling, offline-feeling install |

---

## 11. Troubleshooting

| Symptom | What to try |
|---------|-------------|
| AI returns demo text | Configure API key or CLI backend; turn enabled on; finish wizard |
| CLI “not found on PATH” | Install CLI on the host running the server/desktop app; re-test |
| Stream stuck | Stop and retry; check network; fall back to non-stream if needed |
| Search empty | Type more keywords; ensure page saved; sign in for DB FTS |
| Markdown mount fails | Path must be under allowed roots; re-grant browser folder permission |
| Sync error | Check sign-in session; retry save; inspect network for API errors |
| Blank page after deploy | Production asset base path / rebuild; see DEVELOPERS.md |
| Desktop window blank | Re-run full `npm run tauri:build`; check WebView2 (Windows) / WebKit packages (Linux) |
| `tauri:dev` fails | Install Rust + platform deps ([TAURI.md](./TAURI.md)); free port 8080 |
| macOS “app damaged” / blocked | Right-click → Open, or sign/notarize the build for distribution |

---

## See also

- [FEATURES.md](./FEATURES.md)  
- [DEVELOPERS.md](./DEVELOPERS.md) — includes **how to build** the desktop app  
- [TAURI.md](./TAURI.md)  
- [README.md](./README.md)  
