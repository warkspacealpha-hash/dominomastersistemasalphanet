-- CopyAI new-equivalent schema draft. Review before apply.
create extension if not exists pgcrypto;

create table if not exists public.rpcs (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rpcs enable row level security;
