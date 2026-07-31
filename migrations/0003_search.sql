-- Full-text search index for workspace pages.
-- Keyword: to_tsvector / plainto_tsquery
-- Similarity: pg_trgm when available (Neon); otherwise ts_rank + ILIKE fallback.

create table if not exists page_search (
  user_id text not null,
  page_id text not null,
  title text not null default '',
  icon text not null default '📄',
  parent_id text,
  favorite boolean not null default false,
  archived boolean not null default false,
  content_text text not null default '',
  tsv tsvector,
  updated_at timestamptz not null default now(),
  primary key (user_id, page_id)
);

create index if not exists page_search_user_idx on page_search (user_id);
create index if not exists page_search_tsv_idx on page_search using gin (tsv);

-- Optional trigram indexes (Neon / full Postgres). Safe to skip on PGLite.
do $$
begin
  create extension if not exists pg_trgm;
exception
  when others then
    raise notice 'pg_trgm not available — similarity falls back to rank + ILIKE';
end $$;

do $$
begin
  create index if not exists page_search_title_trgm_idx
    on page_search using gin (title gin_trgm_ops);
  create index if not exists page_search_content_trgm_idx
    on page_search using gin (content_text gin_trgm_ops);
exception
  when others then
    raise notice 'trigram indexes skipped';
end $$;
