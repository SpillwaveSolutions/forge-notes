# Developers

Setup, architecture, and build notes for **ForgeNotes**.  
Product docs: [README.md](./README.md) · [FEATURES.md](./FEATURES.md) · [USER_GUIDE.md](./USER_GUIDE.md).

How **users run** the desktop app (installers, portable binaries, `tauri:dev`): [USER_GUIDE.md § Running the Tauri desktop app](./USER_GUIDE.md#10-running-the-tauri-desktop-app).  
This file focuses on **building** and packaging it.

---

## 1. Stack

| Layer | Choice |
|-------|--------|
| UI | React 19, TypeScript, Tailwind v4, Radix / shadcn-style components |
| App framework | TanStack Start + TanStack Router + Vite 8 |
| State | Zustand (+ persist for workspace & AI settings) |
| Database | PGLite / Postgres, Kysely, SQL migrations |
| Auth | Better Auth |
| AI | LangChain, Deep Agents, MCP adapters, multi-provider chat models |
| Markdown | Custom convert + jszip/fflate; File System Access API for browser mounts |
| Desktop | Tauri 2 (`src-tauri/`) |
| CLI | `cli/wks.mjs` meta-harness |

---

## 2. Prerequisites

### Web / server

- **Node.js 22** (or 20+)
- `npm` (lockfile-friendly)

### Database

- Default path uses **PGLite** (embedded) — no external Postgres required for local demos.
- Production can point at real Postgres via your env/config (see migrations).

### Optional

| Need | Install |
|------|---------|
| AI API | Provider API keys |
| Claude / Codex / Grok CLI backends | Respective CLIs on PATH + login |
| Desktop builds | Rust (`rustup`), platform WebView deps — see §10 and [TAURI.md](./TAURI.md) |
| System packages (Linux Tauri) | webkit2gtk, gtk3, etc. |

---

## 3. Install & run (web)

```bash
git clone <repo-url> workspace && cd workspace
npm install
npm run dev
```

Dev server binds **`0.0.0.0:8080`** (preview-friendly).

```bash
# other scripts
npm run typecheck
npm run build          # production web + db migrate
npm run preview        # serve production build on 8080
npm run db:migrate
npm run lint
npm run format
```

### `startup.sh` (optional host revive)

If you use a process supervisor that re-runs a startup script after hibernate:

```sh
#!/bin/sh
set -eu
cd /workspace   # or your deploy root
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
```

Keep this **idempotent** and non-blocking.

---

## 4. Environment variables

Common variables (names may vary by deployment; set only what you need):

| Variable | Purpose |
|----------|---------|
| `XAI_API_KEY` | Server-side Grok fallback |
| `ANTHROPIC_API_KEY` | Server-side Claude fallback |
| `OPENAI_API_KEY` | Server-side OpenAI fallback |
| `VITE_AUTH_ENABLED` | `false` disables real auth (dev-only user patterns) |
| Auth secrets / DB URLs | Per Better Auth + DB bootstrap in `src/lib/auth`, `src/lib/db` |

**Never commit secrets.** Client AI keys intentionally live in **browser localStorage** for multi-tenant demos; production deployments may prefer server-only keys.

---

## 5. Project structure

```text
src/
  components/
    ai/           # Setup wizard
    editor/       # Page editor, blocks, AI panels
    harness/      # In-app workflow runner UI
    layout/       # AppShell, Sidebar
    markdown/     # Link folder, import/export, mounted view
    search/       # Command palette
    ui/           # Primitives
  lib/
    ai/           # settings, deep-agent, CLI backends, stream client, MCP
    auth/         # Better Auth client/server
    harness/      # YAML runner, backends
    markdown/     # convert, mounts, server mounts, export-import
    store.ts      # Workspace Zustand store
    workspace-server.ts / workspace-sync.ts
    search-server.ts
    db.ts
    tauri.ts
  routes/         # /, /login, /api/auth/*, /api/ai/stream
src-tauri/        # Desktop
harness/
  agents/         # *.yaml
  workflows/
  plans/          # durable plans (runtime)
  artifacts/      # run outputs (runtime)
cli/
  wks.mjs
  harness-entry.ts
migrations/       # 0002_workspace, 0003_search, …
scripts/          # migrate, build-desktop, browser-smoke
```

---

## 6. Architecture notes

### Workspace data

- **Client store** (`useWorkspace`) owns pages/blocks UI state.
- **Guest**: `persist` middleware → localStorage.
- **Signed-in**: `workspace-sync` loads/saves via server functions → Postgres/PGLite JSONB pages.
- Avoid circular imports between store and sync (sync hooks live in shell).

### AI pipeline

```text
UI (AiBlockPanel / AiEditDialog)
  ├─ preferStreaming → POST /api/ai/stream (SSE)
  │     ├─ claude-cli | codex-cli | grok-cli → spawn + stream stdout
  │     ├─ direct/deepagents → model stream or invoke
  │     └─ local → demo text
  └─ else → runAi server fn
        ├─ Deep Agents (skills + MCP)
        ├─ direct chat
        ├─ CLI one-shot
        └─ localAi fallback
```

Shared prompt/parse: `src/lib/ai/prompts.ts`.  
CLI spawn logic: `src/lib/ai/cli-backends.ts`.  
Settings validation: `src/lib/ai-server.ts`.

### Markdown mounts

- **Server**: `listServerMount` / read / write under allowlisted roots.
- **Browser**: directory handles in IndexedDB; read via File System Access API.
- Import/export: `src/lib/markdown/export-import.ts` + convert helpers.

### Search

- Table `page_search` + tsvector (migration `0003_search`).
- Reindex on workspace save; `searchPages` server fn for queries.

### Meta-harness

- YAML agents/workflows under `harness/`.
- Runner: `src/lib/harness/`.
- CLI entry: `cli/wks.mjs` → `harness-entry.ts`.
- Ignore artifact watch in Vite if HMR reloads on write (see vite config watch ignores if present).

### Tauri (desktop shell)

| Piece | Role |
|-------|------|
| `src-tauri/tauri.conf.json` | Product name, window, bundle targets, `devUrl`, `frontendDist` |
| `beforeDevCommand` | `npm run dev` — Vite on **8080** |
| `devUrl` | `http://127.0.0.1:8080` |
| `beforeBuildCommand` | `npm run build:desktop` |
| `frontendDist` | `../dist-desktop` (static assets for the webview) |
| `src-tauri/src/lib.rs` | Commands: `desktop_info`, `which_binary`; plugins shell/dialog/fs |
| `src/lib/tauri.ts` | Frontend helpers: `isTauri()`, `getDesktopInfo()`, `openPath()` |
| `scripts/build-desktop.mjs` | Production web build → copy static tree into `dist-desktop/` |

Full packaging notes: [TAURI.md](./TAURI.md).

---

## 7. Scripts reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev, host 0.0.0.0, port **8080** |
| `npm run build` | Vite production build + `db:migrate` |
| `npm run build:desktop` | Web build → copy static assets to `dist-desktop/` (used by Tauri) |
| `npm run preview` | Preview production on 8080 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Apply SQL migrations |
| `npm run wks` / `harness` | Meta-harness CLI |
| `npm run tauri:dev` / `desktop` | **Run** desktop + Vite (dev) |
| `npm run tauri:build` / `desktop:build` | **Build** standalone bundles |

### Meta-harness examples

```bash
npm run wks -- harness backends
npm run wks -- harness agents
npm run wks -- harness workflows
npm run wks -- harness run hello --message "ping" --backend mock
npm run wks -- harness workflow jwt-auth --backend mock
npm run wks -- harness workflow plan-implement-review-validate \
  --feature "Add search facets" --backend mock
```

---

## 8. Database & migrations

```bash
npm run db:migrate
```

Expect schema for:

- **Workspaces / pages** (JSONB blocks, user scoping)
- **page_search** (FTS / similarity support)

PGLite bootstrap may run during dev server setup (`pgliteBootstrapPlugin` in Vite config).

When adding schema:

1. New file under `migrations/`
2. Run migrate
3. Update server load/save + reindex paths

---

## 9. Production / Vercel notes

- Build uses Nitro with `vercel` preset **only on `command === "build"`** so dev stays single-port.
- Do **not** import vendored `vite-tanstack-config` presets that break standalone `npm run build`.
- After build, verify:
  1. `npm run build` succeeds  
  2. Served production output **renders** (not only HTTP 200)  
  3. No `Failed to load module script … MIME type "text/html"` (asset base path issues)

Deploy target is Vercel-compatible static/SSR output under the project’s configured adapter.

---

## 10. Building the Tauri desktop app

This section is the **developer** path: compile Rust + package the frontend into platform installers and portable binaries.  
End users who only need to *open* an already-built app should follow [USER_GUIDE.md §10](./USER_GUIDE.md#10-running-the-tauri-desktop-app).

### 10.1 Prerequisites (build machine)

**All platforms**

- Node 20+ / 22  
- `npm install` at repo root (includes `@tauri-apps/cli`)  
- [Rust](https://rustup.rs) stable (`rustc`, `cargo`)

**Linux**

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev \
  librsvg2-dev patchelf libssl-dev pkg-config build-essential
```

**macOS**

```bash
xcode-select --install
```

**Windows**

- [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)  
- [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (bootstrapper can be bundled via `tauri.conf.json`)

Confirm tools:

```bash
node -v
rustc --version
npx tauri --version   # or: npm run tauri -- --help
```

### 10.2 What the build does

```bash
npm run tauri:build
# aliases: npm run desktop:build
```

Internally Tauri:

1. Runs **`npm run build:desktop`** (`scripts/build-desktop.mjs`):
   - `npm run build` (Vite + Nitro production frontend)
   - Copies static assets into **`dist-desktop/`** (from `.vercel/output/static` or other known output dirs)
   - Ensures a root `index.html` for the webview
2. Compiles the Rust crate in **`src-tauri/`** (release profile: LTO, stripped).
3. Bundles platform targets from `tauri.conf.json` → **`bundle.targets`: `"all"`**.

Dev loop (not a release build):

```bash
npm run tauri:dev
# or: npm run desktop
```

That only runs Vite + opens a window; it does **not** produce installers.

### 10.3 Step-by-step release build

```bash
# 1. Clean install (CI-friendly)
npm ci   # or: npm install

# 2. Optional: typecheck web first
npm run typecheck

# 3. Build desktop frontend assets only (debug packaging issues)
npm run build:desktop
ls dist-desktop   # should contain index.html and assets/

# 4. Full Tauri release (frontend + Rust + bundles)
npm run tauri:build
```

If `build:desktop` fails, fix the web `npm run build` first — Tauri will not package a broken frontend.

### 10.4 Artifact locations

After a successful build:

```text
src-tauri/target/release/
  forgenotes-desktop          # Linux/macOS binary name (see Cargo package)
  ForgeNotes.exe              # Windows (productName)

src-tauri/target/release/bundle/
  appimage/   → *.AppImage      # Linux portable
  deb/        → *.deb           # Debian/Ubuntu installer
  msi/        → *.msi           # Windows installer
  nsis/       → *.exe installer # Windows NSIS
  macos/      → *.app, *.dmg    # macOS
```

| Goal | Ship |
|------|------|
| Portable Linux | `.AppImage` |
| Portable Windows | release `.exe` (+ zip with DLLs if any); WebView2 required |
| End-user Windows | `.msi` or NSIS installer |
| macOS distribute | `.dmg` / signed `.app` (signing/notarization is your responsibility) |

### 10.5 Icons and product metadata

- Icons: `src-tauri/icons/` (`32x32.png`, `128x128.png`, `icon.png`, …).
- Regenerate from a 1024px source:

```bash
npm run tauri -- icon path/to/app-icon-1024.png
```

- Product id / name: `src-tauri/tauri.conf.json` (`productName`, `identifier`, window size, bundle descriptions).

### 10.6 CI / sandbox notes

- **Minimal containers** (no WebKit/GTK) often fail `cargo`/`tauri build` with `pkg-config` / `glib` / `webkit2gtk` errors. Use a desktop host or a CI image with the packages in §10.1.
- Cache `~/.cargo` and `src-tauri/target` in CI for faster rebuilds.
- Build **per OS** (or use cross-compilation setups you maintain); Tauri typically produces native artifacts on each runner OS.

### 10.7 Verify a desktop build

1. Launch the platform artifact (AppImage / `.app` / `.exe`).
2. Confirm UI loads (sidebar + page content, not a blank webview).
3. Settings shows **Desktop · …**.
4. Optional: AI → CLI backend → test connection (CLI on PATH).
5. Optional: `npm run typecheck` still clean on the same commit.

### 10.8 Related config files

| Path | Purpose |
|------|---------|
| `src-tauri/tauri.conf.json` | Dev URL, frontend dist, bundle targets |
| `src-tauri/Cargo.toml` | Rust deps, release profile |
| `src-tauri/capabilities/default.json` | Permissions (shell, dialog, fs, …) |
| `scripts/build-desktop.mjs` | Static frontend for packaging |
| `package.json` scripts | `tauri:dev`, `tauri:build`, `build:desktop` |

More narrative detail: [TAURI.md](./TAURI.md).

---

## 11. QA suggestions

```bash
# type safety
npm run typecheck

# unit tests (Vitest, colocated as src/**/*.test.ts)
npm run test

# e2e (Playwright, WebKit only — the engine the desktop build uses)
npm run test:e2e:install   # once: fetches WebKit 2311
npm run test:e2e           # works with or without `npm run dev` already running

# browser smoke (example helper)
mkdir -p screenshots
node scripts/browser-smoke.mjs http://127.0.0.1:8080/ screenshots/smoke.png

# AI stream (local backend)
curl -sN -X POST http://127.0.0.1:8080/api/ai/stream \
  -H 'Content-Type: application/json' \
  -d '{"action":"summarize","pageTitle":"T","pageText":"Hello","clientSettings":{"backend":"local","enabled":true,"preferStreaming":true,"setupComplete":true,"provider":"xai","model":"x","apiKey":"","baseUrl":"","temperature":0.3,"recursionLimit":20,"mcpServers":[],"enabledSkills":[]}}'
```

Check:

- Sidebar + editor paint (text not blank)
- Mobile width ~390px no horizontal overflow
- AI stream events parse
- Harness mock workflow completes
- Markdown sample mount lists files
- Desktop: §10.7 after `tauri:build`

---

## 12. Coding conventions (short)

- Prefer editing existing modules over new abstractions.
- Keep AI secrets out of git; validate server inputs in `ai-server` / stream route.
- Allowlist filesystem roots for markdown server mounts.
- Don’t kill long-lived `npm run dev` casually during agent sessions if HMR is enough.
- Update docs ([FEATURES.md](./FEATURES.md) / this file / USER_GUIDE desktop section) when user-visible capabilities change.

---

## 13. Related docs

| File | Audience |
|------|----------|
| [README.md](./README.md) | Everyone — overview + links |
| [FEATURES.md](./FEATURES.md) | Product / PM / users — capability inventory |
| [USER_GUIDE.md](./USER_GUIDE.md) | End users — how to use, configure, **and run desktop** |
| [TAURI.md](./TAURI.md) | Desktop packaging deep dive |
| [harness/README.md](./harness/README.md) | Meta-harness deep dive |
