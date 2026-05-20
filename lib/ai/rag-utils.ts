/** Minimum cosine score for a RAG hit to count as useful context */
const MIN_RAG_SCORE = Number.parseFloat(
  process.env.RAG_MIN_CONTEXT_SCORE?.trim() || "0.72"
);

const GREETING_PATTERN =
  /^(hi|hello|hey|hiya|thanks|thank you|ok|okay|bye|goodbye|sup|yo|good morning|good afternoon|good evening)[\s!.?,]*$/i;

/** Skip semantic cache for short or greeting-only messages */
export function shouldUseSemanticCache(query: string): boolean {
  const q = query.trim();
  if (q.length < 12) return false;
  if (GREETING_PATTERN.test(q)) return false;
  return true;
}

export function ragContextIsSubstantial(
  context: string,
  topScore?: number
): boolean {
  if (context.includes("No specific database records found")) {
    return false;
  }
  const threshold = Number.isNaN(MIN_RAG_SCORE) ? 0.72 : MIN_RAG_SCORE;
  if (topScore !== undefined && topScore < threshold) {
    return false;
  }
  return context.trim().length > 80;
}

export function getActiveProviderName(): string {
  return (process.env.AI_PROVIDER || "gemini").trim().toLowerCase();
}
