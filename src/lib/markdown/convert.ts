import type { Block, BlockType, Page } from "@/lib/types";
import { uid } from "@/lib/utils";

/** Flatten page blocks to plain text (for search index). */
export function blocksToSearchText(page: Pick<Page, "title" | "blocks">): string {
  const parts = [page.title || ""];
  for (const b of page.blocks) {
    if (b.type === "divider" || b.type === "ai") continue;
    if (b.content?.trim()) parts.push(b.content.trim());
  }
  return parts.join("\n");
}

/** Serialize a page to markdown body (no frontmatter). */
export function blocksToMarkdown(blocks: Block[]): string {
  const lines: string[] = [];
  let numbered = 0;

  for (const b of blocks) {
    const c = b.content ?? "";
    switch (b.type) {
      case "heading1":
        lines.push(`# ${c}`);
        numbered = 0;
        break;
      case "heading2":
        lines.push(`## ${c}`);
        numbered = 0;
        break;
      case "heading3":
        lines.push(`### ${c}`);
        numbered = 0;
        break;
      case "bullet":
        lines.push(`${"  ".repeat(b.indent ?? 0)}- ${c}`);
        numbered = 0;
        break;
      case "numbered":
        numbered += 1;
        lines.push(`${"  ".repeat(b.indent ?? 0)}${numbered}. ${c}`);
        break;
      case "todo":
        lines.push(`${"  ".repeat(b.indent ?? 0)}- [${b.checked ? "x" : " "}] ${c}`);
        numbered = 0;
        break;
      case "quote":
        lines.push(
          c
            .split("\n")
            .map((l) => `> ${l}`)
            .join("\n"),
        );
        numbered = 0;
        break;
      case "callout":
        lines.push(`> 💡 ${c}`);
        numbered = 0;
        break;
      case "code":
        lines.push("```");
        lines.push(c);
        lines.push("```");
        numbered = 0;
        break;
      case "mermaid":
        lines.push("```mermaid");
        lines.push(c);
        lines.push("```");
        numbered = 0;
        break;
      case "table":
        lines.push(c.trim() || "|  |  |\n| --- | --- |\n|  |  |");
        numbered = 0;
        break;
      case "bookmark": {
        const [urlLine, ...rest] = c.split("\n");
        const url = (urlLine || "").trim();
        const title = rest.join("\n").trim();
        if (url && title) lines.push(`[${title}](${url})`);
        else if (url) lines.push(url);
        numbered = 0;
        break;
      }
      case "image": {
        const [urlLine, ...rest] = c.split("\n");
        const url = (urlLine || "").trim();
        const alt = rest.join("\n").trim();
        if (url) lines.push(`![${alt}](${url})`);
        numbered = 0;
        break;
      }
      case "divider":
        lines.push("---");
        numbered = 0;
        break;
      case "toggle":
        lines.push(`<details><summary>${c || "Toggle"}</summary>`);
        lines.push("");
        lines.push(`</details>`);
        numbered = 0;
        break;
      case "ai":
        break;
      default:
        lines.push(c);
        numbered = 0;
    }
    lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function pageToMarkdownFile(page: Page): string {
  const title = page.title || "Untitled";
  const body = blocksToMarkdown(page.blocks);
  if (body.startsWith(`# ${title}`)) return body;
  return `# ${title}\n\n${body}`;
}

function makeBlock(type: BlockType, content: string, extra?: Partial<Block>): Block {
  return {
    id: uid("b"),
    type,
    content,
    indent: 0,
    ...extra,
  };
}

/** Parse markdown into workspace blocks (best-effort). */
export function markdownToBlocks(md: string): Block[] {
  const text = md.replace(/\r\n/g, "\n");
  const blocks: Block[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;

    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i]!.match(/^```\s*$/)) {
        body.push(lines[i]!);
        i += 1;
      }
      i += 1;
      if (lang === "mermaid") {
        blocks.push(makeBlock("mermaid", body.join("\n"), { showSource: false }));
      } else {
        blocks.push(makeBlock("code", body.join("\n")));
      }
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      blocks.push(makeBlock("divider", ""));
      i += 1;
      continue;
    }

    // Standalone markdown image → image: ![alt](url)
    const mdImage = line.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)\)\s*$/);
    if (mdImage) {
      const alt = (mdImage[1] || "").trim();
      const url = (mdImage[2] || "").trim();
      blocks.push(makeBlock("image", alt ? `${url}\n${alt}` : url));
      i += 1;
      continue;
    }

    // Standalone markdown link → bookmark: [title](url)
    const mdLink = line.match(/^\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)\s*$/);
    if (mdLink) {
      blocks.push(makeBlock("bookmark", `${mdLink[2]}\n${mdLink[1]}`));
      i += 1;
      continue;
    }

    // Bare URL line → image (common extensions) or bookmark
    const bareUrl = line.match(/^\s*(https?:\/\/\S+)\s*$/);
    if (bareUrl) {
      const u = bareUrl[1]!;
      if (/\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?.*)?$/i.test(u)) {
        blocks.push(makeBlock("image", u));
      } else {
        blocks.push(makeBlock("bookmark", u));
      }
      i += 1;
      continue;
    }

    if (line.includes("|") && /\|/.test(line)) {
      const chunk: string[] = [];
      while (i < lines.length && (lines[i]!.includes("|") || /^\s*$/.test(lines[i]!))) {
        if (/^\s*$/.test(lines[i]!) && chunk.length) break;
        if (!/^\s*$/.test(lines[i]!)) chunk.push(lines[i]!);
        i += 1;
      }
      const hasSep = chunk.some((l) => /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(l));
      if (hasSep || chunk.length >= 2) {
        blocks.push(makeBlock("table", chunk.join("\n")));
        continue;
      }
      i -= chunk.length;
    }

    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const level = h[1]!.length;
      const type: BlockType =
        level === 1 ? "heading1" : level === 2 ? "heading2" : "heading3";
      blocks.push(makeBlock(type, h[2] ?? ""));
      i += 1;
      continue;
    }

    const todo = line.match(/^(\s*)[-*+]\s+\[([ xX])\]\s+(.*)$/);
    if (todo) {
      const indent = Math.min(4, Math.floor((todo[1]?.length ?? 0) / 2));
      blocks.push(
        makeBlock("todo", todo[3] ?? "", {
          checked: todo[2]!.toLowerCase() === "x",
          indent,
        }),
      );
      i += 1;
      continue;
    }

    const bullet = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (bullet) {
      const indent = Math.min(4, Math.floor((bullet[1]?.length ?? 0) / 2));
      blocks.push(makeBlock("bullet", bullet[2] ?? "", { indent }));
      i += 1;
      continue;
    }

    const num = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (num) {
      const indent = Math.min(4, Math.floor((num[1]?.length ?? 0) / 2));
      blocks.push(makeBlock("numbered", num[2] ?? "", { indent }));
      i += 1;
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i]!.startsWith(">")) {
        quoteLines.push(lines[i]!.replace(/^>\s?/, ""));
        i += 1;
      }
      const joined = quoteLines.join("\n");
      if (joined.startsWith("💡") || joined.startsWith(":bulb:")) {
        blocks.push(makeBlock("callout", joined.replace(/^💡\s*|^:bulb:\s*/, "")));
      } else {
        blocks.push(makeBlock("quote", joined));
      }
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const para: string[] = [line];
    i += 1;
    while (i < lines.length) {
      const n = lines[i]!;
      if (
        !n.trim() ||
        n.startsWith("#") ||
        n.startsWith(">") ||
        n.startsWith("```") ||
        /^[-*+]\s/.test(n) ||
        /^\d+\.\s/.test(n) ||
        /^---+\s*$/.test(n)
      ) {
        break;
      }
      para.push(n);
      i += 1;
    }
    blocks.push(makeBlock("paragraph", para.join("\n")));
  }

  if (blocks.length === 0) blocks.push(makeBlock("paragraph", ""));
  return blocks;
}

export function titleFromMarkdown(md: string, fallback: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  if (m?.[1]?.trim()) return m[1].trim().slice(0, 200);
  return fallback.replace(/\.md$/i, "") || "Untitled";
}

export function slugifyFilename(title: string): string {
  const s = (title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return s || "untitled";
}

export interface SearchHitClient {
  pageId: string;
  title: string;
  icon: string;
  parentId: string | null;
  favorite: boolean;
  snippet: string;
  score: number;
  mode: "keyword" | "similarity" | "hybrid";
}

/** Client-side keyword-ish search when not signed in to Postgres. */
export function localSearchPages(
  pages: Page[],
  query: string,
  limit = 20,
): SearchHitClient[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: SearchHitClient[] = [];

  for (const page of pages) {
    if (page.archived) continue;
    const text = blocksToSearchText(page);
    const hay = `${page.title}\n${text}`.toLowerCase();
    let score = 0;
    if (page.title.toLowerCase().includes(q)) score += 2;
    for (const t of terms) {
      if (hay.includes(t)) score += 1;
    }
    const title = page.title.toLowerCase();
    let common = 0;
    for (let i = 0; i < Math.min(title.length, q.length); i++) {
      if (title[i] === q[i]) common += 1;
      else break;
    }
    score += common * 0.1;
    if (score <= 0) continue;
    const flat = text.replace(/\s+/g, " ").trim();
    const idx = flat.toLowerCase().indexOf(q);
    let snippet = flat.slice(0, 120) + (flat.length > 120 ? "…" : "");
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(flat.length, idx + q.length + 80);
      snippet =
        (start > 0 ? "…" : "") + flat.slice(start, end) + (end < flat.length ? "…" : "");
    }
    hits.push({
      pageId: page.id,
      title: page.title || "Untitled",
      icon: page.icon,
      parentId: page.parentId,
      favorite: page.favorite,
      snippet,
      score,
      mode: score >= 2 ? "keyword" : "similarity",
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
