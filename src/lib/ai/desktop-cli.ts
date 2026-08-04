/**
 * Run AI through a locally installed coding-agent CLI, from the desktop app.
 *
 * The web build posts to `/api/ai/stream` and a server spawns the CLI. The
 * packaged desktop app has no server, but it does have the CLIs — so it invokes
 * them through Rust (`src-tauri/src/ai_cli.rs`) and skips HTTP entirely. Same
 * binaries, same output, one less moving part.
 */
import type { AiResponse } from "@/lib/ai/types";
import {
  CLI_PREFERENCE,
  cliOutputMode,
  extractStreamJsonToken,
  type CliBackendId,
} from "@/lib/ai/cli-protocol";
import { isTauri } from "@/lib/tauri";

type CliEvent =
  | { type: "line"; text: string }
  | { type: "status"; message: string }
  | { type: "done"; code: number }
  | { type: "error"; message: string };

export interface DesktopCliOptions {
  backend: CliBackendId;
  prompt: string;
  signal?: AbortSignal;
  onToken?: (text: string, full: string) => void;
  onStatus?: (message: string) => void;
}

/** Whether this backend's CLI is actually installed on this machine. */
export async function desktopCliAvailable(backend: CliBackendId): Promise<boolean> {
  if (!isTauri()) return false;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return await invoke<boolean>("ai_cli_available", { backend });
  } catch {
    return false;
  }
}

/**
 * The best CLI actually installed, or null.
 *
 * Used as a fallback when the chosen backend is a server-backed mode that
 * cannot work on desktop at all. The stored default (`deepagents`) is switched
 * to a CLI on rehydrate, but that check is async — a Run pressed in the first
 * second of a fresh install would otherwise still take the dead server path and
 * report a confusing "no server" error on a machine where a CLI is sitting
 * right there.
 */
export async function firstAvailableDesktopCli(): Promise<CliBackendId | null> {
  for (const backend of CLI_PREFERENCE) {
    if (await desktopCliAvailable(backend)) return backend;
  }
  return null;
}

export async function runDesktopCli(opts: DesktopCliOptions): Promise<AiResponse> {
  const { invoke, Channel } = await import("@tauri-apps/api/core");

  const mode = cliOutputMode(opts.backend);
  let full = "";
  let failure: string | null = null;

  const channel = new Channel<CliEvent>();
  channel.onmessage = (event) => {
    if (event.type === "status") {
      opts.onStatus?.(event.message);
      return;
    }
    if (event.type === "error") {
      failure = event.message;
      return;
    }
    if (event.type !== "line") return;

    // `stream-json` frames carry the text inside JSON; everything else writes
    // plain lines, where the newline the reader stripped is part of the output.
    const text = mode === "stream-json" ? extractStreamJsonToken(event.text) : `${event.text}\n`;
    if (!text) return;
    full += text;
    opts.onToken?.(text, full);
  };

  await invoke("run_ai_cli", { backend: opts.backend, prompt: opts.prompt, onEvent: channel });

  // A CLI that fails after printing something still produced usable output, so
  // partial text wins over the error. Nothing at all is a real failure.
  if (failure && !full.trim()) throw new Error(failure);

  return { text: full.trim(), provider: opts.backend };
}
