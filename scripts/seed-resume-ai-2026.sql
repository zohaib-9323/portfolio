-- Portfolio content aligned with resume "MERN Stack + AI Engineer" (2026).
-- Applied via: npx supabase db query --linked --project-ref olmodhsmoxzhzaagvyok -f scripts/seed-resume-ai-2026.sql
begin;

-- Profile
update public.personal_data set
  role = 'MERN Stack + AI Engineer',
  bio = 'MERN Stack + AI Engineer with nearly 3 years of experience building full-stack applications with MongoDB, Express.js, React, Node.js, NestJS, and Next.js — and a focus on AI engineering for the last year.

I build AI features that run in production: a RAG knowledge base (chunking, embeddings, semantic search) with admin tools for guidance prompts, knowledge testing, publishing, and version history; a chatbot SaaS backend that stays up when model calls are slow or fail; and a Google Vertex AI request queue built on BullMQ and Redis.

I integrate LLMs through the Claude API, OpenRouter, and Vertex AI with structured JSON outputs, and I work AI-natively every day with Claude Code, Cursor, and Codex — including MCP integrations and sub-agent workflows.

Underneath the AI is solid engineering: multi-tenant SaaS security (30+ JWT-secured and 25+ RBAC-protected endpoints), Redis caching that cut API response times by ~35%, and CI/CD with GitHub Actions, Docker, and AWS that made deployments ~50% faster.',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('location', 'Lahore, Punjab, Pakistan', 'availability', 'Open to AI & full-stack roles'),
  updated_at = now();

-- Experience
update public.work_history set
  company_name = 'DevExcelIT Solutions',
  role = 'Full Stack Developer / Software Engineer',
  location = 'Lahore, Pakistan',
  start_date = '2024-09-01',
  end_date = null,
  currently_working = true,
  achievements = array['Integrated third-party LLM APIs and Stripe billing — the server handles timeouts and failed model calls so slow AI responses never leave users waiting.', 'Built a complete RAG system for Trade Harmonizer in one week: document chunking, embeddings, and semantic search feeding the LLM, plus a BullMQ + Redis queue for Google Vertex AI requests.', 'Wrote 30+ JWT-secured and 25+ RBAC-protected REST endpoints used by the frontend team.', 'Added Redis caching to slow MongoDB/Mongoose endpoints, cutting average response time by 35%.', 'Set up CI/CD with GitHub Actions, Docker, and AWS — deployments are now 50% faster.', 'Build React, Next.js, and TypeScript frontends with React Hooks, reusable components, and Redux Toolkit.']::text[],
  updated_at = now()
where company_name ilike '%devexcel%';

delete from public.work_history where company_name ilike '%AOT Solutions%';
insert into public.work_history (company_name, role, location, start_date, end_date, currently_working, achievements)
values ('AOT Solutions (Pvt) Ltd', 'Associate Software Engineer', 'Lahore, Pakistan', '2024-01-01', '2024-08-31', false, array['Built web applications with React, Next.js, Node.js, Express.js, and MongoDB — UI screens, REST APIs, and the wiring between them.', 'Fixed bugs and technical issues in existing codebases and worked with the team to deliver each project.']::text[]);

-- Skills (update in place: projects.tech_stack and join tables reference skill ids)
delete from public.skills where name in ('Supabase', 'Framer Motion', 'Axios', 'GraphQL', 'Socket.io', 'PostgreSQL', 'Vercel', 'Postman');
update public.skills set name = 'React' where name = 'React.js';
update public.skills set name = 'REST APIs' where name = 'RESTful APIs';
update public.skills set name = 'Stripe' where name = 'Stripe Integration';
update public.skills set name = 'Git' where name = 'Git/GitHub';
update public.skills set category = lower(category);
with v(name, category, proficiency) as (values
  ('Claude API', 'ai', 100),
  ('OpenRouter', 'ai', 99),
  ('Google Vertex AI', 'ai', 98),
  ('LLM APIs', 'ai', 97),
  ('Prompt Engineering', 'ai', 96),
  ('LLM Structured JSON Outputs', 'ai', 95),
  ('Model Context Protocol (MCP)', 'ai', 94),
  ('Agentic Workflows & Sub-agents', 'ai', 93),
  ('RAG Pipelines', 'ai', 92),
  ('Semantic Search', 'ai', 91),
  ('Embeddings', 'ai', 90),
  ('Document Chunking', 'ai', 89),
  ('Vector Databases', 'ai', 88),
  ('Node.js', 'backend', 87),
  ('NestJS', 'backend', 86),
  ('Express.js', 'backend', 85),
  ('TypeScript', 'backend', 84),
  ('JavaScript (ES6+)', 'backend', 83),
  ('REST APIs', 'backend', 82),
  ('WebSockets', 'backend', 81),
  ('Swagger/OpenAPI', 'backend', 80),
  ('BullMQ', 'backend', 79),
  ('JWT Authentication', 'backend', 78),
  ('RBAC', 'backend', 77),
  ('Multi-Tenant Architecture', 'backend', 76),
  ('Scalable Application Architecture', 'backend', 75),
  ('SOLID Principles', 'backend', 74),
  ('React', 'frontend', 73),
  ('Next.js', 'frontend', 72),
  ('Redux Toolkit', 'frontend', 71),
  ('Zustand', 'frontend', 70),
  ('Tailwind CSS', 'frontend', 69),
  ('Material UI', 'frontend', 68),
  ('Storybook', 'frontend', 67),
  ('Responsive Design', 'frontend', 66),
  ('HTML5', 'frontend', 65),
  ('CSS3', 'frontend', 64),
  ('MongoDB', 'database', 63),
  ('Mongoose', 'database', 62),
  ('Prisma', 'database', 61),
  ('Redis', 'database', 60),
  ('Firebase', 'database', 59),
  ('AWS (EC2, S3)', 'devops', 58),
  ('Docker', 'devops', 57),
  ('GitHub Actions', 'devops', 56),
  ('CI/CD Pipelines', 'devops', 55),
  ('Trivy', 'devops', 54),
  ('Git', 'devops', 53),
  ('GitHub', 'devops', 52),
  ('Agile/Scrum', 'devops', 51),
  ('Stripe', 'integrations', 50),
  ('QuickBooks', 'integrations', 49),
  ('Xero', 'integrations', 48),
  ('Claude Code', 'integrations', 47),
  ('Cursor', 'integrations', 46),
  ('Codex', 'integrations', 45),
  ('Copilot', 'integrations', 44)
), upd as (
  update public.skills s set category = v.category, proficiency = v.proficiency, updated_at = now()
  from v where s.name = v.name returning s.name
)
insert into public.skills (name, category, proficiency)
select v.name, v.category, v.proficiency from v where v.name not in (select name from upd);

-- Projects
update public.projects set
  title = 'Trade Harmonizer',
  short_description = 'Multi-tenant trade compliance SaaS with a RAG knowledge base built in one week: document chunking, embeddings, and semantic search feeding the LLM. Admin tools cover guidance prompts, knowledge testing, publishing, and version history. Google Vertex AI requests are queued through BullMQ + Redis. Includes JWT/RBAC tenant isolation and a third-party pen test that found only low-severity issues.',
  description = 'Multi-tenant trade compliance SaaS with a RAG knowledge base built in one week: document chunking, embeddings, and semantic search feeding the LLM. Admin tools cover guidance prompts, knowledge testing, publishing, and version history. Google Vertex AI requests are queued through BullMQ + Redis. Includes JWT/RBAC tenant isolation and a third-party pen test that found only low-severity issues.',
  project_link = 'https://dev.tradeharmonizer.co.uk',
  image_url = coalesce(image_url, '/assets/projects/trade-harmonizer.jpg'),
  tech_stack_meta = '{"technologies": ["NestJS", "MongoDB", "RAG", "Google Vertex AI", "BullMQ", "Redis", "JWT/RBAC", "Stripe", "QuickBooks/Xero", "Trivy"]}'::jsonb,
  is_featured = true,
  updated_at = now()
where title ilike 'Trade Harmoni%';

update public.projects set
  title = 'Capture AI',
  short_description = 'AI-powered chatbot management SaaS for automation, customer engagement, and lead management. I built the backend modules for analytics, chatbot configuration, the AI knowledge base, engagement workflows, and Stripe subscriptions. Slow or failed LLM calls are handled on the server so they don''t break the rest of the workflow.',
  description = 'AI-powered chatbot management SaaS for automation, customer engagement, and lead management. I built the backend modules for analytics, chatbot configuration, the AI knowledge base, engagement workflows, and Stripe subscriptions. Slow or failed LLM calls are handled on the server so they don''t break the rest of the workflow.',
  tech_stack_meta = '{"technologies": ["NestJS", "Node.js", "LLM APIs", "Stripe", "TypeScript"]}'::jsonb,
  is_featured = true,
  updated_at = now()
where title = 'Capture AI Web Application';

delete from public.projects where title = 'Requirement Analyst';
insert into public.projects (title, slug, short_description, description, repo_link, tech_stack_meta, is_featured)
values ('Requirement Analyst', 'requirement-analyst', 'AI requirements analysis tool that finds missing, vague, or risky requirements, such as edge cases and business-logic gaps. It uses OpenRouter chat completions to return validated structured JSON across 5 analysis categories and exports reports to Markdown.', 'AI requirements analysis tool that finds missing, vague, or risky requirements, such as edge cases and business-logic gaps. It uses OpenRouter chat completions to return validated structured JSON across 5 analysis categories and exports reports to Markdown.', 'https://github.com/zohaib-9323/Requirment-Analyst',
  '{"technologies": ["Node.js", "Express.js", "OpenRouter", "Structured JSON Outputs", "Prompt Engineering"]}'::jsonb, true);

commit;
