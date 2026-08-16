export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bullet"
  | "numbered"
  | "todo"
  | "quote"
  | "code"
  | "divider"
  | "callout"
  | "toggle"
  | "mermaid"
  | "table"
  | "ai";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  collapsed?: boolean;
  indent?: number;
  /** AI block: last generated output (shown under the prompt) */
  aiOutput?: string;
  /** AI block: last run error */
  aiError?: string;
  /** Mermaid: show source editor instead of diagram */
  showSource?: boolean;
}

export interface Page {
  id: string;
  title: string;
  icon: string;
  cover?: string | null;
  parentId: string | null;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
  blocks: Block[];
  archived?: boolean;
}

export interface Workspace {
  name: string;
  pages: Page[];
  activePageId: string | null;
  sidebarOpen: boolean;
  theme: "light" | "dark";
}
