-- Certifications table for portfolio Certificates section + Qdrant sync

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

alter table public.certifications enable row level security;

drop policy if exists "Public read certifications" on public.certifications;
create policy "Public read certifications"
  on public.certifications
  for select
  to anon
  using (true);
