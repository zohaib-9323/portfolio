const DEFAULT_TAGLINE =
  "Full Stack developer shipping scalable MERN & Next.js apps with clean architecture.";

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
      "Results-driven Full Stack Developer with experience building scalable web applications using the MERN stack, Next.js, and modern cloud tooling.",
    ];
  }
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
  const defaults = ["MERN Stack", "Next.js", "TypeScript", "NestJS", "AWS / Docker"];
  if (!bio) return defaults;

  const keywords = [
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
    "REST API",
    "UI/UX",
  ];
  const found = keywords.filter((k) => bio.toLowerCase().includes(k.toLowerCase()));
  return found.length >= 3 ? found.slice(0, 6) : defaults;
}
