import JSZip from "jszip";
import type { Page } from "@/lib/types";
import { createEmptyPage } from "@/lib/seed";
import { uid } from "@/lib/utils";
import {
  markdownToBlocks,
  pageToMarkdownFile,
  slugifyFilename,
  titleFromMarkdown,
} from "./convert";

function collectSubtree(pages: Page[], rootId: string): Page[] {
  const byParent = new Map<string | null, Page[]>();
  for (const p of pages) {
    if (p.archived) continue;
    const list = byParent.get(p.parentId) ?? [];
    list.push(p);
    byParent.set(p.parentId, list);
  }
  const out: Page[] = [];
  const walk = (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page || page.archived) return;
    out.push(page);
    for (const child of byParent.get(id) ?? []) walk(child.id);
  };
  walk(rootId);
  return out;
}

function uniquePath(used: Set<string>, base: string): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let i = 2;
  while (used.has(`${base}-${i}`)) i += 1;
  const p = `${base}-${i}`;
  used.add(p);
  return p;
}

/**
 * Build a zip of markdown files for one page or a full hierarchy.
 * Folders mirror the page tree; each page is `slug.md` and children live in `slug/`.
 */
export async function exportPagesToZip(
  pages: Page[],
  opts: { rootId: string; hierarchy: boolean },
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  const roots = opts.hierarchy
    ? collectSubtree(pages, opts.rootId)
    : pages.filter((p) => p.id === opts.rootId);

  if (roots.length === 0) throw new Error("Page not found");

  const root = pages.find((p) => p.id === opts.rootId)!;
  const used = new Set<string>();

  // Map page id → directory prefix for children
  const dirOf = new Map<string, string>();

  // Root page file
  const rootSlug = uniquePath(used, slugifyFilename(root.title || "page"));
  zip.file(`${rootSlug}.md`, pageToMarkdownFile(root));
  dirOf.set(root.id, rootSlug);

  if (opts.hierarchy) {
    // BFS by parent order within roots list
    for (const page of roots) {
      if (page.id === root.id) continue;
      const parentDir = page.parentId ? dirOf.get(page.parentId) : rootSlug;
      if (!parentDir) continue;
      const slug = uniquePath(used, `${parentDir}/${slugifyFilename(page.title || "page")}`);
      // Ensure folder exists via nested path in file name
      zip.file(`${slug}.md`, pageToMarkdownFile(page));
      dirOf.set(page.id, slug);
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const filename = `${slugifyFilename(root.title || "export")}${opts.hierarchy ? "-tree" : ""}.zip`;
  return { blob, filename };
}

export interface ImportedPageDraft {
  tempId: string;
  title: string;
  icon: string;
  parentTempId: string | null;
  blocks: Page["blocks"];
  relPath: string;
}

/** Import a single .md file into a page draft. */
export function importMarkdownFile(
  filename: string,
  content: string,
  parentTempId: string | null = null,
): ImportedPageDraft {
  const base = filename.split(/[/\\]/).pop() || "page.md";
  const title = titleFromMarkdown(content, base);
  let body = content;
  // Drop leading H1 if it matches title
  body = body.replace(new RegExp(`^#\\s+${escapeReg(title)}\\s*\\n+`), "");
  return {
    tempId: uid("imp"),
    title,
    icon: "📝",
    parentTempId,
    blocks: markdownToBlocks(body),
    relPath: filename,
  };
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Import a tree of relative paths → content (e.g. from zip or directory picker).
 * Nested folders become parent pages.
 */
export function importMarkdownTree(
  files: Array<{ path: string; content: string }>,
): ImportedPageDraft[] {
  const mdFiles = files
    .map((f) => ({
      path: f.path.replace(/\\/g, "/").replace(/^\.\//, ""),
      content: f.content,
    }))
    .filter((f) => f.path.toLowerCase().endsWith(".md"));

  // Build folder nodes for intermediate directories
  const folderIds = new Map<string, string>(); // folder path without trailing slash → tempId
  const drafts: ImportedPageDraft[] = [];

  const ensureFolder = (folderPath: string): string | null => {
    if (!folderPath || folderPath === ".") return null;
    if (folderIds.has(folderPath)) return folderIds.get(folderPath)!;
    const parts = folderPath.split("/");
    const name = parts[parts.length - 1]!;
    const parentPath = parts.slice(0, -1).join("/");
    const parentTempId = parentPath ? ensureFolder(parentPath) : null;
    const tempId = uid("imp");
    folderIds.set(folderPath, tempId);
    drafts.push({
      tempId,
      title: name,
      icon: "📁",
      parentTempId,
      blocks: [{ id: uid("b"), type: "paragraph", content: `Folder: ${name}`, indent: 0 }],
      relPath: folderPath + "/",
    });
    return tempId;
  };

  // Sort so shorter paths first
  mdFiles.sort((a, b) => a.path.localeCompare(b.path));

  for (const f of mdFiles) {
    const parts = f.path.split("/");
    const fileName = parts.pop()!;
    const folder = parts.join("/");
    const parentTempId = folder ? ensureFolder(folder) : null;
    drafts.push(importMarkdownFile(fileName, f.content, parentTempId));
    // rewrite last draft relPath to full path
    drafts[drafts.length - 1]!.relPath = f.path;
  }

  return drafts;
}

/** Materialize drafts into real Page objects and return pages + root ids. */
export function materializeImports(
  drafts: ImportedPageDraft[],
  parentPageId: string | null,
): { pages: Page[]; rootIds: string[] } {
  const idMap = new Map<string, string>(); // temp → real
  const pages: Page[] = [];
  const rootIds: string[] = [];

  for (const d of drafts) {
    idMap.set(d.tempId, uid("page"));
  }

  for (const d of drafts) {
    const realId = idMap.get(d.tempId)!;
    const realParent = d.parentTempId
      ? (idMap.get(d.parentTempId) ?? parentPageId)
      : parentPageId;
    const page = createEmptyPage({
      id: realId,
      title: d.title,
      icon: d.icon,
      parentId: realParent,
      blocks: d.blocks,
    });
    pages.push(page);
    if (!d.parentTempId) rootIds.push(realId);
  }

  return { pages, rootIds };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
