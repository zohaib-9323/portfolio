/**
 * Models to try when GEMINI_MODEL is not set.
 * gemini-2.5-flash was the original default (works on current API).
 * gemini-1.5-flash returns 404 on v1 — do not use.
 */
export const DEFAULT_GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
] as const;

export function getGeminiModelCandidates(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim();
  const defaults = [...DEFAULT_GEMINI_MODELS];
  if (primary) {
    return [primary, ...defaults.filter((m) => m !== primary)];
  }
  return defaults;
}

export function isModelNotFoundError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("404") ||
    lower.includes("not found") ||
    lower.includes("is not supported for generatecontent")
  );
}

export function isTransientGeminiError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("503") ||
    lower.includes("429") ||
    lower.includes("unavailable") ||
    lower.includes("high demand") ||
    lower.includes("overloaded") ||
    lower.includes("resource exhausted") ||
    lower.includes("try again later")
  );
}

export function toUserFacingAiError(message: string): string {
  if (isTransientGeminiError(message)) {
    return "The AI service is temporarily busy. Please wait a moment and try again.";
  }
  if (message.includes("API_KEY") || message.includes("API key")) {
    return "AI is not configured correctly. Check GEMINI_API_KEY in your environment.";
  }
  if (message.startsWith("AI service error: ")) {
    return toUserFacingAiError(message.slice("AI service error: ".length));
  }
  return message.length > 200 ? `${message.slice(0, 200)}…` : message;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
