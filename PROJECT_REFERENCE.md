# Portfolio project — technical reference

This document summarizes the **Zohaib Asghar** portfolio codebase: architecture, data flow, configuration, and where to change things for future work. It is meant as a long-lived internal reference alongside `README.md`, `DEPLOYMENT.md`, and `THEME_SYSTEM.md`.

**Package name:** `zohaib-portfolio` (see `package.json`)  
**Framework:** Next.js **14.1** (App Router), React 18, TypeScript (strict)

---

## 1. What this app is

A single-page marketing portfolio with:

- **Section-based landing page** (`app/page.tsx`): Header, Hero, Skills, Experience, Certificates, Projects, Performance Highlights, Tech Philosophy, Contact, Footer, plus a floating **AI chatbot**.
- **Dark/light theme** with CSS variables and a `ThemeProvider` (details in `THEME_SYSTEM.md`).
- **Server-side AI chat** at `POST /api/chat` using a **pluggable provider** (Gemini, Qdrant+RAG, or OpenRouter).
- **Supabase** as the runtime data source for at least the Projects section (and as the **source of truth** for syncing vectors to Qdrant).

---

## 2. Tech stack (runtime)

| Area | Choice |
|------|--------|
| UI | React 18, Next.js App Router |
| Styling | Tailwind CSS 3, `clsx`, `tailwind-merge` |
| Motion | Framer Motion |
| Icons | Lucide React |
| Chat UI | `react-markdown` for assistant replies |
| LLM | Google Gemini (`@google/generative-ai`), model `gemini-2.5-flash` in `GeminiProvider` |
| Optional LLM | OpenRouter (default model string: `nvidia/nemotron-3-nano-30b-a3b:free`) |
| Embeddings (RAG) | Mistral API, model `mistral-embed` |
| Vector DB | Qdrant (`@qdrant/js-client-rest`), collection `portfolio_vectors` |
| Database / CMS-ish | Supabase (`@supabase/supabase-js`) |
| Scripts | `dotenv` for `scripts/sync-to-qdrant.mjs` |

**Path alias:** `@/*` → project root (`tsconfig.json`).

---

## 3. Repository layout (high signal)

```
portfolio/
├── app/
│   ├── api/chat/route.ts    # POST handler for chat; uses createAIProvider()
│   ├── globals.css          # Design tokens, theme classes, utilities
│   ├── layout.tsx           # Metadata, ThemeProvider, scroll-smooth html
│   └── page.tsx             # Composes all sections + Chatbot
├── components/
│   ├── sections/            # Hero, Skills, Experience, Projects, etc.
│   ├── Chatbot.tsx          # Client UI; calls /api/chat
│   ├── Header.tsx, Footer.tsx
│   ├── ThemeProvider.tsx, ThemeToggle.tsx
│   └── ui/                  # Input, Textarea helpers
├── lib/
│   ├── ai/providers/
│   │   ├── base.ts          # AIProvider interface + ChatMessage type
│   │   ├── index.ts         # createAIProvider() factory + env switching
│   │   ├── gemini.ts        # Plain Gemini chat + system prompt
│   │   ├── qdrant-mistral.ts# RAG: Mistral embed → Qdrant search → generator
│   │   └── openrouter.ts    # Direct OpenRouter chat
│   ├── supabase.ts          # createClient + placeholder if env missing
│   └── utils.ts
├── scripts/
│   └── sync-to-qdrant.mjs   # Supabase → embeddings → Qdrant upsert
├── public/                  # Static assets (see §10)
├── next.config.js           # Images domain: github.com; serverComponentsExternalPackages
├── tailwind.config.ts       # Maps CSS variables to theme colors, typography
├── .env.example             # Template for env vars
├── README.md, DEPLOYMENT.md, THEME_SYSTEM.md
└── PROJECT_REFERENCE.md    # This file
```

---

## 4. Page composition

`app/page.tsx` renders, in order:

1. `Header`
2. `Hero`, `Skills`, `Experience`, `Certificates`, `Projects`
3. `PerformanceHighlights`, `TechPhilosophy`, `Contact`
4. `Footer`
5. `Chatbot` (client component)

SEO and Open Graph live in `app/layout.tsx` via `metadata`.  
`metadataBase` uses `process.env.NEXT_PUBLIC_SITE_URL` or falls back to `http://localhost:3001`.

---

## 5. AI system architecture

### 5.1 Contract

- **`AIProvider`** (`lib/ai/providers/base.ts`): `chat(messages: ChatMessage[]): Promise<string>`.
- **`ChatMessage`**: `{ role: 'user' | 'assistant' | 'system', content: string }`.
- **HTTP API** (`app/api/chat/route.ts`): expects JSON `{ messages: [...] }`, returns `{ response: string }`.
- The route **requires `GEMINI_API_KEY` to be set** even when the logical provider is OpenRouter or Qdrant (the handler checks this env var before calling `createAIProvider()`). If you add a mode that truly does not use Gemini, adjust this guard to match.

### 5.2 Factory (`createAIProvider` in `lib/ai/providers/index.ts`)

Controlled by **`AI_PROVIDER`** (`gemini` | `qdrant` | `openrouter`, default `gemini`):

| `AI_PROVIDER` | Behavior |
|---------------|----------|
| `gemini` | `GeminiProvider` — conversational Gemini with built-in system prompt about the portfolio owner. |
| `openrouter` | `OpenRouterProvider` if `OPENROUTER_API_KEY` is set; else warns and falls back. |
| `qdrant` | `QdrantMistralRAGProvider` if `QDRANT_URL`, `QDRANT_API_KEY`, and `MISTRAL_API_KEY` are set; else warns and falls back to Gemini. |

**Fallback chain** ends at `GeminiProvider` when keys are missing or initialization throws.

### 5.3 RAG path (`QdrantMistralRAGProvider`)

1. Last user message → **Mistral** `mistral-embed` → query vector.
2. **Qdrant** search on `portfolio_vectors`, limit 5; context from payload `_text` (or stringified payload).
3. System prompt includes **retrieved context** and identity blurb.
4. **Generator** for the final reply: controlled by **`RAG_GENERATOR`** (`gemini` | `openrouter`, default `gemini`).  
   - If `openrouter` + `OPENROUTER_API_KEY`, uses `OpenRouterProvider`; else `GeminiProvider`.
5. **Important:** `GeminiProvider.chat()` does **not** treat `role: system` specially—it only uses the last user message as the “current” question and stitches **user/assistant** history as text. The RAG layer passes `[system, ...recent messages]`; verify in tests that Gemini behavior matches expectations (you may need to merge system into the user prompt if models ignore synthetic system rows).

### 5.4 OpenRouter

Uses `fetch` to `https://openrouter.ai/api/v1/chat/completions` with optional `HTTP-Referer` / `X-Title` headers (portfolio branding).

### 5.5 Chatbot UI (`components/Chatbot.tsx`)

- Client-only; posts full `messages` array + new user message to `/api/chat`.
- Renders assistant text with **ReactMarkdown**.
- Framer Motion for panel open/close and message transitions.

---

## 6. Data layer: Supabase

- **`lib/supabase.ts`**: Single browser/server client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Warns and uses placeholders if unset (calls may fail until configured).

- **`components/sections/Projects.tsx`**: Fetches from table **`projects`**, maps columns such as `title`, `short_description`, `description`, `project_link`, `repo_link`, `tech_stack_meta` / `tech_stack`, `is_featured`, `image_url`, etc. Uses `next/image` with URLs from data (GitHub domain allowed in `next.config.js`).

### 6.1 Sync script: Supabase → Qdrant

`scripts/sync-to-qdrant.mjs`:

- Reads rows from tables: **`personal_data`**, **`skills`**, **`projects`**, **`work_history`**, **`certifications`**, **`education`**, **`project_contributions`** (skips tables that error or are empty).
- Converts each row to a text blob, embeds with Mistral, upserts into Qdrant collection **`portfolio_vectors`** (vector size **1024**, cosine).
- Uses deterministic UUIDs derived from content hashes for point IDs.
- Includes rate-limit handling (sleep/retry) for Mistral free tier.

**Run:** `node scripts/sync-to-qdrant.mjs` (after `.env` is filled and Qdrant collection can be created).

---

## 7. Styling and theme

- **Design tokens** live in `app/globals.css` as CSS variables; **Tailwind** maps them under names like `bg-primary`, `text-primary`, `accent` (`tailwind.config.ts`).
- **`darkMode: 'class'`** — theme class toggled on `<html>` via `ThemeProvider`.
- Full token list, accessibility notes, and DO/DON’T patterns: **`THEME_SYSTEM.md`**.

---

## 8. Environment variables (reference)

From **`.env.example`** and code usage:

| Variable | Purpose |
|----------|---------|
| `AI_PROVIDER` | `gemini` \| `qdrant` \| `openrouter` |
| `RAG_GENERATOR` | With RAG: `gemini` \| `openrouter` |
| `GEMINI_API_KEY` | Gemini API (required by `/api/chat` guard; used by Gemini provider and RAG fallback) |
| `MISTRAL_API_KEY` | Embeddings for RAG + sync script |
| `MISTRAL_EMBED_MODEL` | Documented in example (code uses `mistral-embed` in fetch bodies) |
| `QDRANT_URL`, `QDRANT_API_KEY` | Qdrant Cloud or self-hosted |
| `OPENROUTER_API_KEY` | OpenRouter direct or RAG generator |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for `metadataBase` in `app/layout.tsx` (add to `.env` for production) |

**Security:** Never commit real `.env` files. `.env.example` is the safe template.

---

## 9. NPM scripts

| Script | Command |
|--------|---------|
| `dev` | `next dev` (default port 3000) |
| `dev:3001` | `next dev -p 3001` (matches fallback in `layout` metadata) |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `next lint` |

---

## 10. Assets and current repo notes

- **`next.config.js`** allows `images.domains: ['github.com']` for remote images in `next/image`.
- A **`public/`** tree for local screenshots/assets may be empty or changed in git; `git status` previously showed deleted PNGs under `public/assets/`. If thumbnails break, restore files or point `image_url` in Supabase to valid URLs.

---

## 11. Related documentation

| File | Contents |
|------|----------|
| `README.md` | End-user setup, feature list, high-level structure |
| `DEPLOYMENT.md` | Vercel/Netlify/AWS/Docker notes (partially overlaps README; env list may be incomplete vs RAG variables) |
| `THEME_SYSTEM.md` | Theme tokens, `ThemeProvider`, accessibility, extending themes |
| `PROJECT_REFERENCE.md` | This consolidated technical overview |

---

## 12. Sensible next edits (when you return to the code)

- Align **`/api/chat` env checks** with the active `AI_PROVIDER` so OpenRouter-only deployments do not require a Gemini key unnecessarily.
- If RAG quality matters, refactor **`GeminiProvider`** to accept an optional system instruction or use Gemini’s native multi-turn API so **system messages** from RAG are honored reliably.
- Add **`NEXT_PUBLIC_SITE_URL`** to `.env.example` to match `layout.tsx`.
- Restore or replace **project images** if `public/` or Supabase URLs are incomplete.

---

*Generated from repository analysis for ongoing maintenance. Update this file when architecture or env contracts change.*
