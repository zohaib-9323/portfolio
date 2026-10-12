import { QdrantClient } from "@qdrant/js-client-rest";
import { getEmbeddingDims } from "./embeddings";

/** Vector size of the active embedding provider (Gemini 768, Mistral 1024) */
export const QDRANT_VECTOR_SIZE = getEmbeddingDims();

let cachedClient: QdrantClient | null = null;

export function getQdrantClient(): QdrantClient {
  if (cachedClient) return cachedClient;

  const url = process.env.QDRANT_URL?.trim();
  const apiKey = process.env.QDRANT_API_KEY?.trim();
  if (!url || !apiKey) {
    throw new Error("QDRANT_URL and QDRANT_API_KEY are required");
  }

  cachedClient = new QdrantClient({
    url,
    apiKey,
    checkCompatibility: false,
  });
  return cachedClient;
}

export async function ensureQdrantCollection(
  client: QdrantClient,
  collectionName: string
): Promise<void> {
  const collections = await client.getCollections();
  const exists = collections.collections.some((c) => c.name === collectionName);

  if (!exists) {
    await client.createCollection(collectionName, {
      vectors: {
        size: QDRANT_VECTOR_SIZE,
        distance: "Cosine",
      },
    });
  }
}
