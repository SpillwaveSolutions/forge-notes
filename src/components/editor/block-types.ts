import type { LucideIcon } from "lucide-react";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  MessageSquare,
  ChevronRight,
  Workflow,
  Table2,
  Sparkles,
  Bookmark,
} from "lucide-react";
import type { BlockType } from "@/lib/types";

export interface BlockTypeMeta {
  type: BlockType;
  label: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  placeholder: string;
}

export const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    type: "paragraph",
    label: "Text",
    description: "Just start writing with plain text.",
    icon: Type,
    keywords: ["text", "paragraph", "plain"],
    placeholder: "Type '/' for commands",
  },
  {
    type: "heading1",
    label: "Heading 1",
    description: "Big section heading.",
    icon: Heading1,
    keywords: ["h1", "title", "heading"],
    placeholder: "Heading 1",
  },
  {
    type: "heading2",
    label: "Heading 2",
    description: "Medium section heading.",
    icon: Heading2,
    keywords: ["h2", "heading", "subtitle"],
    placeholder: "Heading 2",
  },
  {
    type: "heading3",
    label: "Heading 3",
    description: "Small section heading.",
    icon: Heading3,
    keywords: ["h3", "heading"],
    placeholder: "Heading 3",
  },
  {
    type: "bullet",
    label: "Bulleted list",
    description: "Create a simple bulleted list.",
    icon: List,
    keywords: ["ul", "list", "bullet", "unordered"],
    placeholder: "List item",
  },
  {
    type: "numbered",
    label: "Numbered list",
    description: "Create a list with numbering.",
    icon: ListOrdered,
    keywords: ["ol", "list", "number", "ordered"],
    placeholder: "List item",
  },
  {
    type: "todo",
    label: "To-do list",
    description: "Track tasks with a to-do checkbox.",
    icon: CheckSquare,
    keywords: ["todo", "task", "checkbox", "check"],
    placeholder: "To-do",
  },
  {
    type: "toggle",
    label: "Toggle",
    description: "Hide and show content inside.",
    icon: ChevronRight,
    keywords: ["toggle", "collapse", "details"],
    placeholder: "Toggle heading",
  },
  {
    type: "quote",
    label: "Quote",
    description: "Capture a quote.",
    icon: Quote,
    keywords: ["quote", "blockquote", "cite"],
    placeholder: "Empty quote",
  },
  {
    type: "callout",
    label: "Callout",
    description: "Make writing stand out.",
    icon: MessageSquare,
    keywords: ["callout", "note", "info", "tip"],
    placeholder: "Callout",
  },
  {
    type: "code",
    label: "Code",
    description: "Capture a code snippet.",
    icon: Code2,
    keywords: ["code", "snippet", "pre"],
    placeholder: "Code",
  },
  {
    type: "mermaid",
    label: "Mermaid",
    description: "Diagram with Mermaid syntax.",
    icon: Workflow,
    keywords: ["mermaid", "diagram", "flowchart", "sequence", "graph"],
    placeholder: "flowchart TD\n  A[Start] --> B[End]",
  },
  {
    type: "table",
    label: "Table",
    description: "Rows and columns as a markdown table.",
    icon: Table2,
    keywords: ["table", "grid", "spreadsheet", "columns"],
    placeholder: "| Column 1 | Column 2 |\n| --- | --- |\n|  |  |",
  },
  {
    type: "bookmark",
    label: "Bookmark",
    description: "Save a link as a card.",
    icon: Bookmark,
    keywords: ["bookmark", "link", "url", "web", "website", "href"],
    placeholder: "https://",
  },
  {
    type: "ai",
    label: "AI",
    description: "Generate from the rest of this page.",
    icon: Sparkles,
    keywords: ["ai", "gpt", "grok", "summary", "assistant", "llm"],
    placeholder: "Summarize this page as a launch checklist…",
  },
  {
    type: "divider",
    label: "Divider",
    description: "Visually divide blocks.",
    icon: Minus,
    keywords: ["divider", "line", "hr", "separator"],
    placeholder: "",
  },
];

export function getBlockMeta(type: BlockType): BlockTypeMeta {
  return BLOCK_TYPES.find((b) => b.type === type) ?? BLOCK_TYPES[0]!;
}
