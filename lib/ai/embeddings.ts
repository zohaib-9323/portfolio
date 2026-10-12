import { getMistralEmbedding } from "./mistral-embed";

/**
 * Embedding provider for RAG + semantic cache.
 * - gemini (default): `gemini-embedding-001` at 768 dims, uses GEMINI_API_KEY (free tier)
 * - mistral: `mistral-embed` at 1024 dims, uses MISTRAL_API_KEY
 * Gemini vectors live in `<collection>_gemini` so the two never mix in one collection.
 * Keep in sync with scripts/sync-to-qdrant.mjs.
 */
export type EmbeddingProvider = "gemini" | "mistral";
export type EmbeddingTask = "query" | "document";

const GEMINI_EMBED_DIMS = 768;
const MISTRAL_EMBED_DIMS = 1024;

export function getEmbeddingProvider(): EmbeddingProvider {
  const raw = (process.env.EMBEDDING_PROVIDER || "gemini").trim().toLowerCase();
  return raw === "mistral" ? "mistral" : "gemini";
}

export function getEmbeddingDims(): number {
  return getEmbeddingProvider() === "mistral" ? MISTRAL_EMBED_DIMS : GEMINI_EMBED_DIMS;
}

export function getEmbeddingApiKeyName(): "GEMINI_API_KEY" | "MISTRAL_API_KEY" {
  return getEmbeddingProvider() === "mistral" ? "MISTRAL_API_KEY" : "GEMINI_API_KEY";
}

function withProviderSuffix(base: string): string {
  return getEmbeddingProvider() === "gemini" ? `${base}_gemini` : base;
}

export function getVectorCollectionName(): string {
  return withProviderSuffix(process.env.QDRANT_COLLECTION?.trim() || "portfolio_vectors");
}

export function getCacheCollectionName(): string {
  return withProviderSuffix(
    process.env.QDRANT_CACHE_COLLECTION?.trim() || "portfolio_semantic_cache"
  );
}

async function getGeminiEmbedding(text: string, task: EmbeddingTask): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is required for Gemini embeddings");

  const model = process.env.GEMINI_EMBED_MODEL?.trim() || "gemini-embedding-001";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        content: { parts: [{ text: text.trim() }] },
        taskType: task === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
        outputDimensionality: GEMINI_EMBED_DIMS,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini embedding error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("Gemini returned an empty embedding");
  }
  return values;
}

export async function getEmbedding(
  text: string,
  task: EmbeddingTask = "query"
): Promise<number[]> {
  if (getEmbeddingProvider() === "mistral") {
    return getMistralEmbedding(text, process.env.MISTRAL_API_KEY || "");
  }
  return getGeminiEmbedding(text, task);
}
