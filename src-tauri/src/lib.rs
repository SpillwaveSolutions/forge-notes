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
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(tauri::generate_handler![desktop_info, which_binary])
    .setup(|app| {
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_title("ForgeNotes");
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running ForgeNotes desktop app");
}
