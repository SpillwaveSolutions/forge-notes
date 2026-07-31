import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Page } from "@/lib/types";
import { blocksToSearchText } from "@/lib/markdown/convert";

export interface SearchHit {
  pageId: string;
  title: string;
  icon: string;
  parentId: string | null;
  favorite: boolean;
  snippet: string;
  score: number;
  mode: "keyword" | "similarity" | "hybrid";
}

function pageToIndexRow(userId: string, page: Page) {
  const contentText = blocksToSearchText(page);
  return {
    userId,
    pageId: page.id,
    title: page.title || "Untitled",
    icon: page.icon || "📄",
    parentId: page.parentId,
    favorite: Boolean(page.favorite),
    archived: Boolean(page.archived),
    contentText,
  };
}

/** Rebuild the search index for a user from page list. */
export async function reindexUserPages(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  pages: Page[],
) {
  await sql`delete from page_search where user_id = ${userId}`;

  for (const page of pages) {
    const row = pageToIndexRow(userId, page);
    await sql`
      insert into page_search (
        user_id, page_id, title, icon, parent_id, favorite, archived,
        content_text, tsv, updated_at
      ) values (
        ${row.userId},
        ${row.pageId},
        ${row.title},
        ${row.icon},
        ${row.parentId},
        ${row.favorite},
        ${row.archived},
        ${row.contentText},
        setweight(to_tsvector('english', coalesce(${row.title}, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(${row.contentText}, '')), 'B'),
        now()
      )
    `;
  }
}

let trgmAvailable: boolean | null = null;

async function hasTrgm(sql: Awaited<ReturnType<typeof getSql>>): Promise<boolean> {
  if (trgmAvailable != null) return trgmAvailable;
  try {
    await sql.query(`select similarity('a','a') as s`);
    trgmAvailable = true;
  } catch {
    trgmAvailable = false;
  }
  return trgmAvailable;
}

export const searchPages = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const d = input as { query?: string; limit?: number };
    return {
      query: typeof d?.query === "string" ? d.query.slice(0, 200).trim() : "",
      limit: Math.min(40, Math.max(1, Number(d?.limit) || 20)),
    };
  })
  .handler(async ({ context, data }): Promise<{ hits: SearchHit[]; trgm: boolean }> => {
    const q = data.query;
    if (!q) return { hits: [], trgm: false };

    const sql = await getSql();
    const userId = context.userId;
    const trgm = await hasTrgm(sql);

    const keywordRows = await sql.query<{
      page_id: string;
      title: string;
      icon: string;
      parent_id: string | null;
      favorite: boolean;
      content_text: string;
      rank: number;
    }>(
      `
      select page_id, title, icon, parent_id, favorite, content_text,
             ts_rank(tsv, plainto_tsquery('english', $2))::float8 as rank
      from page_search
      where user_id = $1
        and archived = false
        and tsv @@ plainto_tsquery('english', $2)
      order by rank desc
      limit $3
      `,
      [userId, q, data.limit],
    );

    let simRows: typeof keywordRows = [];
    if (trgm) {
      try {
        simRows = await sql.query(
          `
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
          `,
          [userId, q, data.limit],
        );
      } catch {
        simRows = [];
      }
    } else {
      simRows = await sql.query(
        `
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
        `,
        [userId, q, `%${q}%`, data.limit],
      );
    }

    const map = new Map<string, SearchHit>();

    for (const r of keywordRows) {
      map.set(r.page_id, {
        pageId: r.page_id,
        title: r.title,
        icon: r.icon,
        parentId: r.parent_id,
        favorite: Boolean(r.favorite),
        snippet: makeSnippet(r.content_text, q),
        score: Number(r.rank) || 0,
        mode: "keyword",
      });
    }

    for (const r of simRows) {
      const existing = map.get(r.page_id);
      const score = Number(r.rank) || 0;
      if (!existing) {
        map.set(r.page_id, {
          pageId: r.page_id,
          title: r.title,
          icon: r.icon,
          parentId: r.parent_id,
          favorite: Boolean(r.favorite),
          snippet: makeSnippet(r.content_text, q),
          score,
          mode: "similarity",
        });
      } else {
        existing.score = existing.score + score;
        existing.mode = "hybrid";
      }
    }

    const hits = [...map.values()].sort((a, b) => b.score - a.score).slice(0, data.limit);
    return { hits, trgm };
  });

function makeSnippet(text: string, q: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  const lower = flat.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx < 0) return flat.slice(0, 120) + (flat.length > 120 ? "…" : "");
  const start = Math.max(0, idx - 40);
  const end = Math.min(flat.length, idx + q.length + 80);
  return (
    (start > 0 ? "…" : "") + flat.slice(start, end) + (end < flat.length ? "…" : "")
  );
}
