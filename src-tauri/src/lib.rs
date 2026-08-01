use tauri::Manager;

/// App identity for the frontend (`window.__TAURI_INTERNALS__` is also set by Tauri).
#[tauri::command]
fn desktop_info() -> serde_json::Value {
  serde_json::json!({
    "isDesktop": true,
    "platform": std::env::consts::OS,
    "arch": std::env::consts::ARCH,
    "version": env!("CARGO_PKG_VERSION"),
  })
}

/// Probe whether a binary is available on PATH (for Claude / Codex / Grok CLIs).
#[tauri::command]
fn which_binary(name: String) -> bool {
  let name = name.trim();
  if name.is_empty() || name.contains('/') || name.contains('\\') {
    return false;
  }
  std::process::Command::new("which")
    .arg(name)
    .stdout(std::process::Stdio::null())
    .stderr(std::process::Stdio::null())
    .status()
    .map(|s| s.success())
    .unwrap_or(false)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  // The chain is broken into a rebind so the bridge can hang off a cfg. Enabled
  // only by the `mcp-bridge` feature (see Cargo.toml) — release builds never
  // compile it in.
  let builder = tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init());

  // Several agents run Tauri apps on one laptop, so the bridge must not always
  // start scanning from 9223 — that is also Chrome's remote-debugging port.
  // `scripts/dev-ports.mjs` picks a base per repo and exports MCP_BRIDGE_PORT;
  // the plugin still scans upward from it, so a stale value degrades rather
  // than fails. Bound to 127.0.0.1 rather than the 0.0.0.0 default: this is a
  // debug tool that can drive the app, and it has no business on the network.
  #[cfg(feature = "mcp-bridge")]
  let builder = builder.plugin({
    let base_port = std::env::var("MCP_BRIDGE_PORT")
      .ok()
      .and_then(|p| p.parse::<u16>().ok())
      .unwrap_or(9223);
    tauri_plugin_mcp_bridge::Builder::new()
      .bind_address("127.0.0.1")
      .base_port(base_port)
      .build()
  });

  builder
    .invoke_handler(tauri::generate_handler![desktop_info, which_binary])
    .setup(|app| {
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_title("ForgeNotes");
      }

      // The bridge's commands are denied by Tauri's ACL unless a capability
      // grants `mcp-bridge:default`. That capability CANNOT live in
      // `capabilities/` — tauri-build globs that directory at compile time and
      // validates every permission against the compiled plugin set, so a
      // default (no-features) build would fail on an unknown permission.
      // Registering it here instead keeps it entirely inside the cfg: the
      // include_str! is compiled out with the rest of the block.
      #[cfg(feature = "mcp-bridge")]
      app
        .handle()
        .add_capability(include_str!("../mcp-bridge.capability.json"))?;

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running ForgeNotes desktop app");
}
