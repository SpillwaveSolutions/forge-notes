import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Block, Page } from "@/lib/types";
import { seedWorkspace } from "@/lib/seed";
import { reindexUserPages } from "@/lib/search-server";

export interface WorkspaceSnapshot {
  name: string;
  theme: "light" | "dark";
  activePageId: string | null;
  sidebarOpen: boolean;
  pages: Page[];
}

type WorkspaceRow = {
  user_id: string;
  name: string;
  theme: string;
  active_page_id: string | null;
  sidebar_open: boolean;
};

type PageRow = {
  id: string;
  user_id: string;
  title: string;
  icon: string;
  cover: string | null;
  parent_id: string | null;
  favorite: boolean;
  archived: boolean;
  blocks: Block[] | string;
  created_at: string | Date;
  updated_at: string | Date;
};

function parseBlocks(raw: Block[] | string): Block[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as Block[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toMs(value: string | Date | number | null | undefined): number {
  if (value == null) return Date.now();
  if (typeof value === "number") return value;
  if (value instanceof Date) return value.getTime();
  const t = Date.parse(value);
  return Number.isNaN(t) ? Date.now() : t;
}

function rowToPage(row: PageRow): Page {
  return {
    id: row.id,
    title: row.title ?? "",
    icon: row.icon || "📄",
    cover: row.cover,
    parentId: row.parent_id,
    favorite: Boolean(row.favorite),
    archived: Boolean(row.archived),
    blocks: parseBlocks(row.blocks),
    createdAt: toMs(row.created_at),
    updatedAt: toMs(row.updated_at),
  };
}

function validateSnapshot(input: unknown): WorkspaceSnapshot {
  const data = input as WorkspaceSnapshot;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid workspace snapshot");
  }
  if (typeof data.name !== "string") throw new Error("Invalid name");
  if (data.theme !== "light" && data.theme !== "dark") throw new Error("Invalid theme");
  if (!Array.isArray(data.pages)) throw new Error("Invalid pages");
  return {
    name: data.name.slice(0, 120),
    theme: data.theme,
    activePageId: data.activePageId ?? null,
    sidebarOpen: Boolean(data.sidebarOpen),
    pages: data.pages.map((p) => ({
      id: String(p.id),
      title: String(p.title ?? "").slice(0, 500),
      icon: String(p.icon ?? "📄").slice(0, 16),
      cover: p.cover ?? null,
      parentId: p.parentId ?? null,
      favorite: Boolean(p.favorite),
      archived: Boolean(p.archived),
      createdAt: Number(p.createdAt) || Date.now(),
      updatedAt: Number(p.updatedAt) || Date.now(),
      blocks: Array.isArray(p.blocks) ? p.blocks : [],
    })),
  };
}

export const loadWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<WorkspaceSnapshot & { source: "db" | "seeded" }> => {
    const sql = await getSql();
    const userId = context.userId;

    const workspaces = await sql<WorkspaceRow>`
      select user_id, name, theme, active_page_id, sidebar_open
      from workspaces
      where user_id = ${userId}
      limit 1
    `;

    const pageRows = await sql<PageRow>`
      select id, user_id, title, icon, cover, parent_id, favorite, archived,
             blocks, created_at, updated_at
      from pages
      where user_id = ${userId}
      order by created_at asc
    `;

    if (workspaces.length === 0 && pageRows.length === 0) {
      const seeded = seedWorkspace();
      const snapshot: WorkspaceSnapshot = {
        name: "My Workspace",
        theme: "light",
        activePageId: seeded.activePageId,
        sidebarOpen: true,
        pages: seeded.pages,
      };
      await writeSnapshot(sql, userId, snapshot);
      return { ...snapshot, source: "seeded" };
    }

    const ws = workspaces[0];
    const pages = pageRows.map(rowToPage);
    return {
      name: ws?.name ?? "My Workspace",
      theme: ws?.theme === "dark" ? "dark" : "light",
      activePageId: ws?.active_page_id ?? pages.find((p) => !p.archived)?.id ?? null,
      sidebarOpen: ws?.sidebar_open ?? true,
      pages,
      source: "db",
    };
  });

export const saveWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => validateSnapshot(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await writeSnapshot(sql, context.userId, data);
    return { ok: true as const };
  });

async function writeSnapshot(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  snapshot: WorkspaceSnapshot,
) {
  await sql`
    insert into workspaces (user_id, name, theme, active_page_id, sidebar_open, updated_at)
    values (
      ${userId},
      ${snapshot.name},
      ${snapshot.theme},
      ${snapshot.activePageId},
      ${snapshot.sidebarOpen},
      now()
    )
    on conflict (user_id) do update set
      name = excluded.name,
      theme = excluded.theme,
      active_page_id = excluded.active_page_id,
      sidebar_open = excluded.sidebar_open,
      updated_at = now()
  `;

  await sql`delete from pages where user_id = ${userId}`;

  for (const page of snapshot.pages) {
    const blocksJson = JSON.stringify(page.blocks ?? []);
    await sql`
      insert into pages (
        id, user_id, title, icon, cover, parent_id, favorite, archived,
        blocks, created_at, updated_at
      ) values (
        ${page.id},
        ${userId},
        ${page.title},
        ${page.icon},
        ${page.cover},
        ${page.parentId},
        ${page.favorite},
        ${Boolean(page.archived)},
        ${blocksJson}::jsonb,
        to_timestamp(${page.createdAt / 1000.0}),
        to_timestamp(${page.updatedAt / 1000.0})
      )
    `;
  }

  // Keep FTS / similarity index in sync
  try {
    await reindexUserPages(sql, userId, snapshot.pages);
  } catch (err) {
    console.error("[search] reindex failed:", err);
  }
}
