-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/olmodhsmoxzhzaagvyok/sql/new
--
-- Creates public.certifications + RLS + seed row for Claude Code Mastery.
-- Safe to run multiple times (IF NOT EXISTS / idempotent insert).

create extension if not exists "pgcrypto";

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  year int,
  summary text,
  highlights jsonb not null default '[]'::jsonb,
  credential_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.certifications is 'Portfolio certificates shown in Certificates section and synced to Qdrant';

alter table public.certifications enable row level security;

drop policy if exists "Public read certifications" on public.certifications;
create policy "Public read certifications"
  on public.certifications
  for select
  to anon
  using (true);

insert into public.certifications (title, issuer, year, summary, highlights, credential_url, sort_order)
select
  'Claude Code Mastery',
  'LWS Academy',
  2026,
  'Completed a 14-hour advanced course on AI-augmented development workflows using Claude Code.',
  '[
    "AI-augmented development workflows using Claude Code",
    "MCP (Model Context Protocol) integrations connecting models with real-world tools and APIs",
    "Sub-agent architectures for multi-step autonomous AI execution",
    "Hooks to customize AI behavior within development pipelines",
    "CLI-based workflows to automate repetitive tasks and speed up delivery",
    "Plugin systems extending AI capabilities across the full stack",
    "Applied AI optimization to accelerate MERN Stack and Next.js delivery"
  ]'::jsonb,
  null,
  0
where not exists (
  select 1
  from public.certifications
  where title = 'Claude Code Mastery'
    and coalesce(issuer, '') = 'LWS Academy'
);

-- Verify
select id, title, issuer, year, sort_order from public.certifications order by sort_order, year desc;
