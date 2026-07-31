-- Notion-clone workspace schema (per-user pages + settings).
-- Scoped by user_id TEXT (Better Auth ids / preview 'dev-user').

create table if not exists workspaces (
  user_id text primary key,
  name text not null default 'Workspace',
  theme text not null default 'light',
  active_page_id text,
  sidebar_open boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists pages (
  id text not null,
  user_id text not null,
  title text not null default '',
  icon text not null default '📄',
  cover text,
  parent_id text,
  favorite boolean not null default false,
  archived boolean not null default false,
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists pages_user_id_idx on pages (user_id);
create index if not exists pages_user_parent_idx on pages (user_id, parent_id);
