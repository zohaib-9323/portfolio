# MCP setup (Supabase + Qdrant)

This project includes **workspace-level** MCP configuration in [`.cursor/mcp.json`](../.cursor/mcp.json) so the agent can manage Supabase and inspect Qdrant alongside your code.

## What was installed (conceptually)

| Server | Role |
|--------|------|
| **supabase** (`https://mcp.supabase.com/mcp`) | Hosted Supabase MCP (HTTP). Sign in with Supabase when Cursor prompts — **no personal access token in the repo**. |
| **qdrant-portfolio** | Official [qdrant/mcp-server-qdrant](https://github.com/qdrant/mcp-server-qdrant), launched via [`scripts/run-qdrant-mcp.sh`](../scripts/run-qdrant-mcp.sh), reading **`QDRANT_URL`**, **`QDRANT_API_KEY`**, and optional **`COLLECTION_NAME`** from your root [`.env`](../.env). |

**Note:** Project listings on the site come from **Supabase** (`projects` table), not Qdrant. Qdrant powers the **chatbot RAG** (`portfolio_vectors`). MCP helps you run queries and maintenance without leaving the IDE.

## One-time prerequisites

### 1. `uv` (for `uvx mcp-server-qdrant`)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# or: brew install uv
```

Confirm: `uvx --version`

### 2. Environment variables

Copy [`.env.example`](../.env.example) to `.env` and set at least:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `QDRANT_URL`, `QDRANT_API_KEY` (for the Qdrant MCP script)

Optional overrides for the MCP wrapper (defaults shown):

- `COLLECTION_NAME` — default `portfolio_vectors` (matches the app + [sync script](../scripts/sync-to-qdrant.mjs))
- `QDRANT_READ_ONLY` — default `true` for safer exploration; set to `false` only if you need store/write tools

## Enable in Cursor

1. Open **Cursor Settings → MCP** (or **Features → MCP** depending on version).
2. Ensure **this workspace** loads [`.cursor/mcp.json`](../.cursor/mcp.json). If you only see global servers, use **“Add from project”** / reload the window after adding the file.
3. For **Supabase**, complete browser **OAuth** the first time the server is used.
4. For **qdrant-portfolio**, fix any error if `bash` cannot find `uvx` (install `uv`) or if `QDRANT_URL` is missing in `.env`.

## Global vs project MCP

You may already have Supabase configured in `~/.cursor/mcp.json` (e.g. `npx @supabase/mcp-server-supabase`). That is fine; you can keep both:

- **Hosted** `https://mcp.supabase.com/mcp` — simple browser login.
- **CLI** `npx @supabase/mcp-server-supabase` — uses a personal access token (keep only in **global** config, never commit).

If two Supabase entries feel redundant, disable one in Cursor MCP settings.

## Security

- **Never** commit `.env`, API keys, or Supabase personal access tokens.
- Rotate any token that was ever pasted into a chat or committed by mistake.
