import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-BLv9nwdP.mjs";
import { t as authMiddleware } from "./middleware-DoQ2eaJS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-server-D9tG3kEu.js
/** Rebuild the search index for a user from page list. */
var trgmAvailable = null;
async function hasTrgm(sql) {
	if (trgmAvailable != null) return trgmAvailable;
	try {
		await sql.query(`select similarity('a','a') as s`);
		trgmAvailable = true;
	} catch {
		trgmAvailable = false;
	}
	return trgmAvailable;
}
var searchPages_createServerFn_handler = createServerRpc({
	id: "a98064319e8852a83544a57d2b08358536b8e71b7accdbbc3c7a0bc01b34e11a",
	name: "searchPages",
	filename: "src/lib/search-server.ts"
}, (opts) => searchPages.__executeServer(opts));
var searchPages = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const d = input;
	return {
		query: typeof d?.query === "string" ? d.query.slice(0, 200).trim() : "",
		limit: Math.min(40, Math.max(1, Number(d?.limit) || 20))
	};
}).handler(searchPages_createServerFn_handler, async ({ context, data }) => {
	const q = data.query;
	if (!q) return {
		hits: [],
		trgm: false
	};
	const sql = await getSql();
	const userId = context.userId;
	const trgm = await hasTrgm(sql);
	const keywordRows = await sql.query(`
      select page_id, title, icon, parent_id, favorite, content_text,
             ts_rank(tsv, plainto_tsquery('english', $2))::float8 as rank
      from page_search
      where user_id = $1
        and archived = false
        and tsv @@ plainto_tsquery('english', $2)
      order by rank desc
      limit $3
      `, [
		userId,
		q,
		data.limit
	]);
	let simRows = [];
	if (trgm) try {
		simRows = await sql.query(`
          select page_id, title, icon, parent_id, favorite, content_text,
                 greatest(
                   similarity(title, $2),
                   similarity(left(content_text, 2000), $2)
                 )::float8 as rank
          from page_search
          where user_id = $1
            and archived = false
            and (
              title % $2
              or content_text % $2
              or title ilike '%' || $2 || '%'
              or content_text ilike '%' || $2 || '%'
            )
          order by rank desc
          limit $3
          `, [
			userId,
			q,
			data.limit
		]);
	} catch {
		simRows = [];
	}
	else simRows = await sql.query(`
        select page_id, title, icon, parent_id, favorite, content_text,
               case
                 when title ilike $2 then 0.9
                 when title ilike $3 then 0.7
                 when content_text ilike $3 then 0.5
                 else 0.3
               end::float8 as rank
        from page_search
        where user_id = $1
          and archived = false
          and (title ilike $3 or content_text ilike $3)
        order by rank desc
        limit $4
        `, [
		userId,
		q,
		`%${q}%`,
		data.limit
	]);
	const map = /* @__PURE__ */ new Map();
	for (const r of keywordRows) map.set(r.page_id, {
		pageId: r.page_id,
		title: r.title,
		icon: r.icon,
		parentId: r.parent_id,
		favorite: Boolean(r.favorite),
		snippet: makeSnippet(r.content_text, q),
		score: Number(r.rank) || 0,
		mode: "keyword"
	});
	for (const r of simRows) {
		const existing = map.get(r.page_id);
		const score = Number(r.rank) || 0;
		if (!existing) map.set(r.page_id, {
			pageId: r.page_id,
			title: r.title,
			icon: r.icon,
			parentId: r.parent_id,
			favorite: Boolean(r.favorite),
			snippet: makeSnippet(r.content_text, q),
			score,
			mode: "similarity"
		});
		else {
			existing.score = existing.score + score;
			existing.mode = "hybrid";
		}
	}
	return {
		hits: [...map.values()].sort((a, b) => b.score - a.score).slice(0, data.limit),
		trgm
	};
});
function makeSnippet(text, q) {
	const flat = text.replace(/\s+/g, " ").trim();
	if (!flat) return "";
	const idx = flat.toLowerCase().indexOf(q.toLowerCase());
	if (idx < 0) return flat.slice(0, 120) + (flat.length > 120 ? "…" : "");
	const start = Math.max(0, idx - 40);
	const end = Math.min(flat.length, idx + q.length + 80);
	return (start > 0 ? "…" : "") + flat.slice(start, end) + (end < flat.length ? "…" : "");
}
//#endregion
export { searchPages_createServerFn_handler };
