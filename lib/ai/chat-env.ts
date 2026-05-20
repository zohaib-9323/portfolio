/**
 * Validates environment variables required for /api/chat based on AI_PROVIDER and RAG_GENERATOR.
 * Does not log secrets.
 */

export function getMissingChatEnvVars(): string[] {
  const missing: string[] = [];
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const ragGen = (process.env.RAG_GENERATOR || "gemini").toLowerCase();

  if (provider === "openrouter") {
    if (!process.env.OPENROUTER_API_KEY?.trim()) {
      missing.push("OPENROUTER_API_KEY");
    }
    return missing;
  }

  if (provider === "qdrant") {
    if (!process.env.QDRANT_URL?.trim()) missing.push("QDRANT_URL");
    if (!process.env.QDRANT_API_KEY?.trim()) missing.push("QDRANT_API_KEY");
    if (!process.env.MISTRAL_API_KEY?.trim()) missing.push("MISTRAL_API_KEY");

    if (ragGen === "openrouter") {
      if (!process.env.OPENROUTER_API_KEY?.trim()) {
        missing.push("OPENROUTER_API_KEY");
      }
    } else {
      if (!process.env.GEMINI_API_KEY?.trim()) {
        missing.push("GEMINI_API_KEY");
      }
    }
    return missing;
  }

  // gemini (default)
  if (!process.env.GEMINI_API_KEY?.trim()) {
    missing.push("GEMINI_API_KEY");
  }
  return missing;
}

export function chatEnvHumanHint(missing: string[]): string {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (missing.length === 0) return "";

  const base = `Missing: ${missing.join(", ")}.`;

  if (provider === "qdrant") {
    return `${base} For Qdrant RAG set AI_PROVIDER=qdrant, QDRANT_URL, QDRANT_API_KEY, MISTRAL_API_KEY, and either GEMINI_API_KEY (RAG_GENERATOR=gemini) or OPENROUTER_API_KEY (RAG_GENERATOR=openrouter). Then run: node scripts/sync-to-qdrant.mjs`;
  }

  if (provider === "openrouter") {
    return `${base} Set OPENROUTER_API_KEY or switch AI_PROVIDER to gemini / qdrant.`;
  }

  return `${base} Set GEMINI_API_KEY or configure Qdrant RAG (see .env.example).`;
}
