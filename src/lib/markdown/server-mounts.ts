import { createServerFn } from "@tanstack/react-start";
import { readdir, readFile, writeFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";

/** Only allow reading/writing under these roots (safety). */
const ALLOWED_ROOTS = [
  path.resolve("/workspace/markdown-samples"),
  path.resolve("/workspace/markdown-mounts"),
  path.resolve("/workspace"),
];

function resolveSafe(userPath: string): string {
  const resolved = path.resolve(userPath);
  const ok = ALLOWED_ROOTS.some(
    (root) => resolved === root || resolved.startsWith(root + path.sep),
  );
  if (!ok) {
    throw new Error(
      "Path not allowed. Use a folder under /workspace (e.g. /workspace/markdown-samples).",
    );
  }
  return resolved;
}

export interface ServerMountEntry {
  name: string;
  relPath: string;
  kind: "file" | "dir";
}

export const listServerMount = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { root: string; relPath?: string };
    if (!d?.root || typeof d.root !== "string") throw new Error("root required");
    return {
      root: d.root.slice(0, 500),
      relPath: typeof d.relPath === "string" ? d.relPath.slice(0, 500) : "",
    };
  })
  .handler(async ({ data }): Promise<ServerMountEntry[]> => {
    const root = resolveSafe(data.root);
    const dir = data.relPath ? path.join(root, data.relPath) : root;
    const resolvedDir = resolveSafe(dir);
    const st = await stat(resolvedDir);
    if (!st.isDirectory()) throw new Error("Not a directory");

    const names = await readdir(resolvedDir);
    const entries: ServerMountEntry[] = [];
    for (const name of names) {
      if (name.startsWith(".")) continue;
      const full = path.join(resolvedDir, name);
      const s = await stat(full);
      const relPath = data.relPath ? `${data.relPath}/${name}` : name;
      if (s.isDirectory()) {
        entries.push({ name, relPath, kind: "dir" });
      } else if (name.toLowerCase().endsWith(".md")) {
        entries.push({ name, relPath, kind: "file" });
      }
    }
    return entries.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  });

export const readServerMountFile = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { root: string; relPath: string };
    if (!d?.root || !d?.relPath) throw new Error("root and relPath required");
    return { root: d.root.slice(0, 500), relPath: d.relPath.slice(0, 500) };
  })
  .handler(async ({ data }): Promise<{ content: string; absPath: string }> => {
    const root = resolveSafe(data.root);
    const full = resolveSafe(path.join(root, data.relPath));
    if (!full.toLowerCase().endsWith(".md")) throw new Error("Only .md files");
    const content = await readFile(full, "utf8");
    return { content, absPath: full };
  });

export const writeServerMountFile = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { root: string; relPath: string; content: string };
    if (!d?.root || !d?.relPath || typeof d.content !== "string") {
      throw new Error("root, relPath, content required");
    }
    return {
      root: d.root.slice(0, 500),
      relPath: d.relPath.slice(0, 500),
      content: d.content.slice(0, 2_000_000),
    };
  })
  .handler(async ({ data }) => {
    const root = resolveSafe(data.root);
    const full = resolveSafe(path.join(root, data.relPath));
    if (!full.toLowerCase().endsWith(".md")) throw new Error("Only .md files");
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, data.content, "utf8");
    return { ok: true as const };
  });

export const exportPagesToServerDir = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as {
      targetDir: string;
      files: Array<{ relPath: string; content: string }>;
    };
    if (!d?.targetDir || !Array.isArray(d.files)) throw new Error("Invalid export");
    return {
      targetDir: d.targetDir.slice(0, 500),
      files: d.files.slice(0, 500).map((f) => ({
        relPath: String(f.relPath).slice(0, 400),
        content: String(f.content).slice(0, 2_000_000),
      })),
    };
  })
  .handler(async ({ data }) => {
    const base = resolveSafe(data.targetDir);
    await mkdir(base, { recursive: true });
    for (const f of data.files) {
      const full = resolveSafe(path.join(base, f.relPath));
      await mkdir(path.dirname(full), { recursive: true });
      await writeFile(full, f.content, "utf8");
    }
    return { ok: true as const, dir: base, count: data.files.length };
  });
