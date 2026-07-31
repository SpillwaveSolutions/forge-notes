# ForgeNotes — Tauri standalone desktop app

Package ForgeNotes as a **standalone desktop app** with [Tauri 2](https://tauri.app).

## What you get

| Platform | Standalone / installers (after `tauri build`) |
|----------|-----------------------------------------------|
| **Windows** | `ForgeNotes.exe` + `.msi` under `src-tauri/target/release/bundle/` |
| **macOS** | `.app` + `.dmg` |
| **Linux** | `.AppImage` + `.deb` |

Truly portable on Windows: the release `.exe` runs without an installer if the machine has **WebView2** (and VC++ redist when required). Bundle any extra DLLs beside the exe or ship a zip. Modern Tauri mainly needs **WebView2**.

## Prerequisites

### All platforms
- Node 20+ / 22
- Rust (`rustup`) — https://rustup.rs
- `@tauri-apps/cli` (installed as a devDependency)

### Linux
```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev \
  librsvg2-dev patchelf libssl-dev pkg-config build-essential
```

### macOS
- Xcode Command Line Tools: `xcode-select --install`

### Windows
- [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- WebView2 (bootstrapper is bundled by default in `tauri.conf.json`)

## Dev (desktop window + Vite on :8080)

```bash
npm install
npm run tauri:dev
```

This runs `npm run dev` and opens a native window pointed at `http://127.0.0.1:8080`.

## Production standalone build

```bash
npm run tauri:build
```

That runs:

1. `npm run build:desktop` — production web build → copies static assets to `dist-desktop/`
2. `tauri build` — compiles Rust and produces platform bundles

### Artifact locations

```
src-tauri/target/release/               # raw executable (e.g. forgenotes-desktop / ForgeNotes.exe)
src-tauri/target/release/bundle/
  macos/   → .app, .dmg
  deb/     → .deb
  appimage/→ .AppImage
  msi/     → .msi
  nsis/    → .exe installer
```

Copy the raw release binary for a minimal portable run; prefer installers for end users.

## Desktop-specific features

- `src/lib/tauri.ts` — `isTauri()`, `getDesktopInfo()`, `whichBinary()`, `openPath()`
- Rust commands: `desktop_info`, `which_binary`
- Plugins: **shell**, **dialog**, **fs** (for future local markdown / CLI integration)

AI coding CLIs (Claude Code / Codex / Grok) use the host PATH when the app runs as a desktop binary — same as the meta-harness.

## Icons

Replace PNGs in `src-tauri/icons/`, then:

```bash
npm run tauri -- icon path/to/app-icon-1024.png
```

## Notes

- Web **live preview** (browser) is unchanged: `npm run dev` on port 8080.
- This sandbox may lack WebKitGTK packages; run `tauri:build` on a full desktop machine or CI with the deps above.
- Updater / sidecars need extra config if you want auto-update in pure portable mode.
