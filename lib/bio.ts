const DEFAULT_TAGLINE =
  "MERN Stack + AI Engineer building LLM integrations, RAG pipelines, and agentic workflows.";

/** One-line hook for the hero — never dump the full Supabase bio there. */
export function heroTagline(bio?: string | null): string {
  if (!bio?.trim()) return DEFAULT_TAGLINE;
  const cleaned = bio.replace(/\s+/g, " ").trim();
  const firstSentence = cleaned.match(/^[^.!?]+[.!?]?/)?.[0]?.trim();
  if (firstSentence && firstSentence.length <= 120) return firstSentence;
  if (cleaned.length <= 120) return cleaned;
  return `${cleaned.slice(0, 117).trim()}…`;
}

/** Split long bio into readable paragraphs for the About section. */
export function bioParagraphs(bio?: string | null): string[] {
  if (!bio?.trim()) {
    return [
      "MERN Stack + AI Engineer with nearly 3 years of experience building full-stack applications and production AI features.",
    ];
  }
  // Respect explicit paragraph breaks before whitespace is collapsed
  const explicit = bio
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (explicit.length > 1) return explicit;

  const normalized = bio.replace(/\s+/g, " ").trim();
  const byDouble = normalized.split(/\s{2,}|\n+/).filter(Boolean);
  if (byDouble.length > 1) return byDouble;

  const sentences = normalized.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [normalized];
  if (sentences.length <= 3) return sentences;

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(" "));
  }
  return paragraphs;
}

/** Pull short highlight chips from bio keywords (fallback set). */
export function bioHighlights(bio?: string | null): string[] {
  const defaults = ["LLM Integration", "RAG Pipelines", "Agentic AI & MCP", "MERN Stack", "NestJS", "Next.js"];
  if (!bio) return defaults;

  const keywords = [
    "LLM",
    "RAG",
    "Agentic",
    "MCP",
    "MERN",
    "Next.js",
    "TypeScript",
    "NestJS",
    "React",
    "Node.js",
    "MongoDB",
    "Supabase",
    "AWS",
    "Docker",
    "BullMQ",
  ];
  const found = keywords.filter((k) => bio.toLowerCase().includes(k.toLowerCase()));
  return found.length >= 3 ? found.slice(0, 8) : defaults;
}
