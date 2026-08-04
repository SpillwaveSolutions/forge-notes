//! Run a local coding-agent CLI (Grok / Claude / Codex) and stream its output.
//!
//! The web app reaches AI through `POST /api/ai/stream`, which spawns these same
//! CLIs server-side. The packaged desktop app has no server — Tauri's asset
//! protocol answers `/api/*` with `index.html` and HTTP 200 — so that path
//! cannot work there and fails silently when tried. On desktop the CLIs are
//! already on the machine, so the server is not a missing piece to rebuild: it
//! is a detour to skip.
//!
//! Spawning happens HERE rather than through `@tauri-apps/plugin-shell` on the
//! JS side. The shell plugin's scope would have to grant `args: true` on the
//! binary for the frontend to pass a prompt through, which is a webview →
//! arbitrary-argv bridge. Keeping it in Rust means the webview can only ask for
//! "backend X, prompt P": the binary comes from a fixed allowlist and every
//! other argument is built below, where page content can never reach argv.

use std::io::{BufRead, BufReader};
use std::path::PathBuf;
use std::process::{Command, Stdio};

use serde::Serialize;
use tauri::ipc::Channel;

#[derive(Clone, Serialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum CliEvent {
  /// One line of stdout, exactly as the CLI wrote it. Parsing stays in
  /// TypeScript, where the stream-json shapes are already handled.
  Line { text: String },
  Status { message: String },
  Done { code: i32 },
  Error { message: String },
}

/// The only binaries this command will ever run.
fn binary_for(backend: &str) -> Option<&'static str> {
  match backend {
    "grok-cli" => Some("grok"),
    "claude-cli" => Some("claude"),
    "codex-cli" => Some("codex"),
    _ => None,
  }
}

/// Arguments, built here so nothing from the page can become a flag.
///
/// The prompt is always passed as a single trailing value of an explicit flag,
/// never interpolated into a string a shell would re-split.
fn args_for(backend: &str, prompt: &str) -> Vec<String> {
  let p = prompt.to_string();
  match backend {
    // `-p/--single` is the headless one-shot form.
    "grok-cli" => vec!["-p".into(), p],
    // stream-json emits token deltas, which is what makes the preview live.
    "claude-cli" => vec![
      "-p".into(),
      p,
      "--output-format".into(),
      "stream-json".into(),
      "--verbose".into(),
    ],
    "codex-cli" => vec!["exec".into(), "--skip-git-repo-check".into(), p],
    _ => vec![],
  }
}

/// Find a CLI on disk.
///
/// A `.app` launched from Finder does NOT inherit the user's shell PATH — it
/// gets roughly `/usr/bin:/bin:/usr/sbin:/sbin`. Every one of these tools
/// installs outside that set (`~/.grok/bin`, `~/.local/bin`, Homebrew), so a
/// bare `Command::new("grok")` works from a terminal and fails from the Dock.
/// That asymmetry is worth searching explicitly for rather than rediscovering
/// as "it works on my machine".
fn resolve_binary(name: &str) -> Option<PathBuf> {
  let mut roots: Vec<PathBuf> = Vec::new();

  if let Some(home) = std::env::var_os("HOME").map(PathBuf::from) {
    roots.push(home.join(".local/bin"));
    roots.push(home.join(".grok/bin"));
    roots.push(home.join(".bun/bin"));
    roots.push(home.join(".cargo/bin"));
    roots.push(home.join(".npm-global/bin"));
  }
  roots.push(PathBuf::from("/opt/homebrew/bin"));
  roots.push(PathBuf::from("/usr/local/bin"));

  if let Some(path) = std::env::var_os("PATH") {
    roots.extend(std::env::split_paths(&path));
  }

  roots
    .into_iter()
    .map(|dir| dir.join(name))
    .find(|candidate| candidate.is_file())
}

/// Whether a backend's CLI is installed. Drives the UI's backend picker.
#[tauri::command]
pub fn ai_cli_available(backend: String) -> bool {
  binary_for(&backend)
    .and_then(resolve_binary)
    .is_some()
}

/// Run a backend and stream stdout back a line at a time.
///
/// Runs on Tauri's blocking pool (`async` + blocking reads would stall the
/// runtime), and returns only once the child has exited.
#[tauri::command]
pub async fn run_ai_cli(
  backend: String,
  prompt: String,
  on_event: Channel<CliEvent>,
) -> Result<(), String> {
  if prompt.trim().is_empty() {
    return Err("Nothing to send — the prompt is empty.".into());
  }

  let name = binary_for(&backend).ok_or_else(|| format!("Unknown AI backend: {backend}"))?;
  let bin = resolve_binary(name).ok_or_else(|| {
    format!("`{name}` is not installed, or not in a location ForgeNotes searches.")
  })?;

  let args = args_for(&backend, &prompt);

  tauri::async_runtime::spawn_blocking(move || {
    let _ = on_event.send(CliEvent::Status {
      message: format!("Running {}…", bin.display()),
    });

    // NO_COLOR/FORCE_COLOR=0: these CLIs wrap output in ANSI escapes when they
    // believe a terminal is attached, and those escapes would land in the note.
    let mut child = match Command::new(&bin)
      .args(&args)
      .env("NO_COLOR", "1")
      .env("FORCE_COLOR", "0")
      .stdin(Stdio::null())
      .stdout(Stdio::piped())
      .stderr(Stdio::piped())
      .spawn()
    {
      Ok(c) => c,
      Err(e) => {
        let _ = on_event.send(CliEvent::Error {
          message: format!("Could not start {}: {e}", bin.display()),
        });
        return;
      }
    };

    if let Some(stdout) = child.stdout.take() {
      for line in BufReader::new(stdout).lines().map_while(Result::ok) {
        let _ = on_event.send(CliEvent::Line { text: line });
      }
    }

    let status = child.wait();
    let code = status.as_ref().map(|s| s.code().unwrap_or(-1)).unwrap_or(-1);

    // stderr is only read on failure. Reading it eagerly would mean draining two
    // pipes concurrently; reading it after a SUCCESSFUL run risks blocking on a
    // pipe nobody is filling. On a non-zero exit it usually holds the reason.
    if code != 0 {
      let mut detail = String::new();
      if let Some(stderr) = child.stderr.take() {
        for line in BufReader::new(stderr).lines().map_while(Result::ok).take(20) {
          detail.push_str(&line);
          detail.push('\n');
        }
      }
      let detail = detail.trim();
      let _ = on_event.send(CliEvent::Error {
        message: if detail.is_empty() {
          format!("{name} exited with code {code}")
        } else {
          format!("{name} failed: {detail}")
        },
      });
    }

    let _ = on_event.send(CliEvent::Done { code });
  })
  .await
  .map_err(|e| format!("AI process failed to run: {e}"))
}
