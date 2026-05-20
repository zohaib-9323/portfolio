#!/usr/bin/env bash
# Starts the official Qdrant MCP server (qdrant/mcp-server-qdrant) with env from this project's .env
# Prerequisites: uv (`curl -LsSf https://astral.sh/uv/install.sh | sh`) or `brew install uv`
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi
export COLLECTION_NAME="${COLLECTION_NAME:-portfolio_vectors}"
# Safer default for AI exploration; set QDRANT_READ_ONLY=false in .env to allow writes
export QDRANT_READ_ONLY="${QDRANT_READ_ONLY:-true}"
if [[ -z "${QDRANT_URL:-}" ]]; then
  echo "QDRANT_URL is not set. Add it to .env (see .env.example)." >&2
  exit 1
fi
exec uvx mcp-server-qdrant
