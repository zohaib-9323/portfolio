# Supabase setup for this portfolio

Your project dashboard: [Supabase project](https://supabase.com/dashboard/project/olmodhsmoxzhzaagvyok).

## 1. Environment variables

In **Project Settings → API**:

1. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`  
   Example: `https://olmodhsmoxzhzaagvyok.supabase.co`

2. **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   The site uses the browser client, so the **anon** key is correct (not the `service_role` key).

Restart `npm run dev` after changing `.env`.

## 2. Tables the app expects

Client components query:

| Table             | Used in                    |
|-------------------|----------------------------|
| `personal_data`   | Header, Hero, Contact, Footer |
| `projects`        | Projects                    |
| `skills`          | Skills                      |
| `work_history`    | Experience                  |
| `certifications`  | Certificates                |

Row/column names must match what each component selects (see files under `components/sections/`). If your schema differs, adjust the queries or add views.

## 3. Row Level Security (RLS)

The anon key only returns rows that **RLS allows**. For a public portfolio, add **SELECT** policies for `anon` (and optionally `authenticated`).

Run in **SQL Editor** (adjust table names if yours differ):

```sql
-- Example: allow anyone to read portfolio rows (typical marketing site)

ALTER TABLE personal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read personal_data"
  ON personal_data FOR SELECT TO anon USING (true);

CREATE POLICY "Public read projects"
  ON projects FOR SELECT TO anon USING (true);

CREATE POLICY "Public read skills"
  ON skills FOR SELECT TO anon USING (true);

CREATE POLICY "Public read work_history"
  ON work_history FOR SELECT TO anon USING (true);

CREATE POLICY "Public read certifications"
  ON certifications FOR SELECT TO anon USING (true);
```

**Certifications table missing (404 on `/rest/v1/certifications`)?**  
Run **[`scripts/create-certifications-table.sql`](../scripts/create-certifications-table.sql)** in [SQL Editor](https://supabase.com/dashboard/project/olmodhsmoxzhzaagvyok/sql/new) — creates the table, RLS policy, and seeds Claude Code Mastery.

For a full profile/skills/experience refresh, run **[`scripts/seed-zohaib-resume-2026.sql`](../scripts/seed-zohaib-resume-2026.sql)** (review destructive `truncate`/`delete` sections first).

If a policy already exists with another name, drop or alter it instead of duplicating.

## 4. Project preview images (`image_url`)

The Projects section loads **`image_url`** from the `projects` table. You can store either:

1. **Full URL** — `https://…` (Supabase public URL, GitHub raw, CDN, etc.), or  
2. **Storage object key** — e.g. `screenshots/capture.png`  
   The app builds:  
   `NEXT_PUBLIC_SUPABASE_URL/storage/v1/object/public/<BUCKET>/<key>`  
   The default bucket name is **`portfolio`**. Override with **`NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`** in `.env` if your bucket has another name.

**Project previews:** Screenshots live in **`components/assets/`** (served from **`/public/assets/projects/`**). The app maps titles to those files automatically. For Supabase-backed rows, run:

```bash
node scripts/upload-project-images.mjs   # needs SUPABASE_SERVICE_ROLE_KEY in .env
```

Then run **`scripts/update-project-images.sql`** in the SQL Editor (sets `image_url` storage keys and removes duplicate Goldium Crafter rows).

If `image_url` is empty, the UI still falls back to the static `/public/assets/projects/` image for known project names.

**Supabase Storage:** create a public bucket (or public read policy), upload images, then copy either the full public URL from the object details into `image_url`, or save only the path and set the bucket env variable to match.

**Storage RLS:** `anon` must be allowed to **read** objects in that bucket for the image to load in the browser (bucket “public” + policy, or equivalent).

## 5. Sync portfolio text into Qdrant (chatbot RAG)

After Supabase has data and `.env` includes Qdrant + Mistral keys:

```bash
node scripts/sync-to-qdrant.mjs
```

This embeds selected tables and upserts into collection **`portfolio_vectors`** (or `QDRANT_COLLECTION` if set). The chatbot uses Qdrant when `AI_PROVIDER=qdrant` — see [`.env.example`](../.env.example).

## 6. Troubleshooting

- **Empty sections / no projects**: Check RLS policies, table names, and browser Network tab for Supabase errors.
- **`Invalid API key`**: Confirm the anon key matches the project URL (no extra spaces in `.env`).
