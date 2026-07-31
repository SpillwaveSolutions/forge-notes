import type { BlockType } from "@/lib/types";

export type AiAction =
  | "edit_block"
  | "summarize"
  | "action_items"
  | "table"
  | "outline"
  | "mermaid"
  | "custom";

export interface AiRequest {
  action: AiAction;
  instruction?: string;
  blockText?: string;
  blockType?: BlockType;
  pageTitle?: string;
  pageText?: string;
}

export interface AiGeneratedBlock {
  type: BlockType;
  content: string;
}

export type AiProviderTag =
  | "xai"
  | "deepagents"
  | "local"
  | "claude-cli"
  | "codex-cli"
  | "grok-cli"
  | "anthropic"
  | "openai"
  | "ollama"
  | "direct";

export interface AiResponse {
  text: string;
  blocks?: AiGeneratedBlock[];
  provider: AiProviderTag;
  model?: string;
}

export interface AiStreamEvent {
  type: "token" | "status" | "done" | "error";
  text?: string;
  message?: string;
  /** Final structured result on `done` */
  result?: AiResponse;
}
