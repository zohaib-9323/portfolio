-- Portfolio content seed aligned with resume (Zohaib Asghar — MERN STACK DEVELOPER PDF).
-- Run in Supabase → SQL Editor against your project. Review and adjust if your column types differ.
--
-- 1) Extensions (for gen_random_uuid if not already enabled)
create extension if not exists "pgcrypto";

-- 2) Certifications table + public read
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
  on public.certifications for select to anon using (true);

-- 3) Hero / header / contact — single profile row (updates every row if you have more than one, tighten the WHERE clause)
update public.personal_data set
  display_name = 'Zohaib Asghar',
  role = 'MERN Stack Developer',
  bio = 'Results-driven Full Stack Developer with approximately 2 years of experience designing and delivering scalable, high-performance web applications. Proficient in the MERN Stack (MongoDB, Express.js, React.js, Node.js), Next.js, and TypeScript, with a strong track record of optimizing application performance and implementing secure backend integrations. Experienced in responsive UI/UX development, RESTful API design, and database management across MongoDB, Supabase, and Firebase. Hands-on expertise in cloud deployment and containerization using AWS and Docker. Adept at collaborating within cross-functional teams, following agile methodologies, and delivering production-ready solutions on time.',
  email = 'mzohaib0677@gmail.com',
  phone = '+923229911442',
  social_links = coalesce(social_links, '{}'::jsonb) || jsonb_build_object(
    'github', coalesce(social_links->>'github', 'https://github.com/zohaib-9323')
  ),
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'location', 'Lahore, Punjab, Pakistan',
    'availability', coalesce(metadata->>'availability', 'Open to opportunities')
  );

-- 4) Experience — replace DevExcel row(s) or clear and re-insert (adjust if you use different constraints)
delete from public.work_history where company_name ilike '%DevExcel%';

insert into public.work_history (role, company_name, start_date, end_date, currently_working, achievements)
values (
  'MERN Stack Developer',
  'DevExcel IT Solutions',
  '2024-09-01',
  null,
  true,
  -- If your column is text[] instead of jsonb, replace the value with:
  -- array[
  --   'Capture AI: led AI-based front-end work, integrated Stripe and APIs, implemented Storybook for streamlined UI development.',
  --   'Recordo Admin: built full front-end and back-end with Node.js and Next.js.',
  --   'PPS Police Professional Services: engineered and deployed NestJS backends with generalized APIs for mobile and web.'
  -- ]::text[]
  '[
    "Capture AI: led AI-based front-end work, integrated Stripe and APIs, implemented Storybook for streamlined UI development.",
    "Recordo Admin: built full front-end and back-end with Node.js and Next.js.",
    "PPS Police Professional Services: engineered and deployed NestJS backends with generalized APIs for mobile and web."
  ]'::jsonb
);

-- 5) Skills — full refresh from resume (WARNING: deletes all existing skill rows)
truncate table public.skills restart identity cascade;

insert into public.skills (name, category, proficiency) values
  ('Next.js', 'frontend', 95),
  ('React.js', 'frontend', 95),
  ('Tailwind CSS', 'frontend', 90),
  ('Bootstrap', 'frontend', 80),
  ('CSS', 'frontend', 92),
  ('HTML5', 'frontend', 92),
  ('JavaScript (ES6+)', 'frontend', 93),
  ('NestJS', 'backend', 88),
  ('RESTful APIs', 'backend', 92),
  ('Node.js', 'backend', 94),
  ('Express.js', 'backend', 93),
  ('TypeScript', 'backend', 92),
  ('MongoDB', 'database', 90),
  ('Supabase', 'database', 88),
  ('Firebase', 'database', 85),
  ('Redis', 'database', 80),
  ('Docker', 'devops', 85),
  ('AWS', 'devops', 82);

-- 6) Certifications content (idempotent: clear then insert — optional)
delete from public.certifications where title = 'Claude Code Mastery' and coalesce(issuer, '') = 'LWS Academy';

insert into public.certifications (title, issuer, year, summary, highlights, credential_url, sort_order)
values (
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
);
