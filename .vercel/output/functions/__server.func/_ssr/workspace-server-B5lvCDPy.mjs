import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-BLv9nwdP.mjs";
import { a as seedWorkspace } from "./seed-CQXoc2iK.mjs";
import { t as authMiddleware } from "./middleware-DoQ2eaJS.mjs";
import { a as reindexUserPages } from "./search-server-B-Vicnmt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-server-B5lvCDPy.js
function parseBlocks(raw) {
	if (Array.isArray(raw)) return raw;
	if (typeof raw === "string") try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
	return [];
}
function toMs(value) {
	if (value == null) return Date.now();
	if (typeof value === "number") return value;
	if (value instanceof Date) return value.getTime();
	const t = Date.parse(value);
	return Number.isNaN(t) ? Date.now() : t;
}
function rowToPage(row) {
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
		updatedAt: toMs(row.updated_at)
	};
}
function validateSnapshot(input) {
	const data = input;
	if (!data || typeof data !== "object") throw new Error("Invalid workspace snapshot");
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
			blocks: Array.isArray(p.blocks) ? p.blocks : []
		}))
	};
}
var loadWorkspace_createServerFn_handler = createServerRpc({
	id: "e3fb77d67dfdadad5d019581d79338a7f7cf2e42797c44110574e289b39fd293",
	name: "loadWorkspace",
	filename: "src/lib/workspace-server.ts"
}, (opts) => loadWorkspace.__executeServer(opts));
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadWorkspace_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const userId = context.userId;
	const workspaces = await sql`
      select user_id, name, theme, active_page_id, sidebar_open
      from workspaces
      where user_id = ${userId}
      limit 1
    `;
	const pageRows = await sql`
      select id, user_id, title, icon, cover, parent_id, favorite, archived,
             blocks, created_at, updated_at
      from pages
      where user_id = ${userId}
      order by created_at asc
    `;
	if (workspaces.length === 0 && pageRows.length === 0) {
		const seeded = seedWorkspace();
		const snapshot = {
			name: "My Workspace",
			theme: "light",
			activePageId: seeded.activePageId,
			sidebarOpen: true,
			pages: seeded.pages
		};
		await writeSnapshot(sql, userId, snapshot);
		return {
			...snapshot,
			source: "seeded"
		};
	}
	const ws = workspaces[0];
	const pages = pageRows.map(rowToPage);
	return {
		name: ws?.name ?? "My Workspace",
		theme: ws?.theme === "dark" ? "dark" : "light",
		activePageId: ws?.active_page_id ?? pages.find((p) => !p.archived)?.id ?? null,
		sidebarOpen: ws?.sidebar_open ?? true,
		pages,
		source: "db"
	};
});
var saveWorkspace_createServerFn_handler = createServerRpc({
	id: "7bd9976b9723bbefb2399d41723684e8ed7d3bfcf4f814066bb422e47b4bb658",
	name: "saveWorkspace",
	filename: "src/lib/workspace-server.ts"
}, (opts) => saveWorkspace.__executeServer(opts));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => validateSnapshot(input)).handler(saveWorkspace_createServerFn_handler, async ({ context, data }) => {
	await writeSnapshot(await getSql(), context.userId, data);
	return { ok: true };
});
async function writeSnapshot(sql, userId, snapshot) {
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
        to_timestamp(${page.createdAt / 1e3}),
        to_timestamp(${page.updatedAt / 1e3})
      )
    `;
	}
	try {
		await reindexUserPages(sql, userId, snapshot.pages);
	} catch (err) {
		console.error("[search] reindex failed:", err);
	}
}
//#endregion
export { loadWorkspace_createServerFn_handler, saveWorkspace_createServerFn_handler };
