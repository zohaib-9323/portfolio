import crypto from "crypto";
import { QdrantClient } from "@qdrant/js-client-rest";
import {
  ensureQdrantCollection,
  getQdrantClient,
  QDRANT_VECTOR_SIZE,
} from "./qdrant-client";

export interface SemanticCacheHit {
  response: string;
  score: number;
  matchedQuery: string;
}

export interface SemanticCacheLookupResult {
  hit: boolean;
  cache?: SemanticCacheHit;
}

function cacheCollectionName(): string {
  return (
    process.env.QDRANT_CACHE_COLLECTION?.trim() || "portfolio_semantic_cache"
  );
}

function cacheEnabled(): boolean {
  const flag = process.env.RAG_CACHE_ENABLED?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  return true;
}

function similarityThreshold(): number {
  const raw = process.env.RAG_CACHE_SIMILARITY_THRESHOLD?.trim();
  const parsed = raw ? Number.parseFloat(raw) : 0.88;
  if (Number.isNaN(parsed) || parsed <= 0 || parsed > 1) return 0.88;
  return parsed;
}

function pointIdForQuery(query: string): string {
  const hash = crypto.createHash("sha256").update(query.trim()).digest("hex");
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32),
  ].join("-");
}

/**
 * Qdrant-backed semantic cache for chat responses.
 * Similar questions (by embedding) return a stored answer without calling the LLM.
 * @see https://qdrant.tech/articles/semantic-cache-ai-data-retrieval/
 */
export class QdrantSemanticCache {
  private client: QdrantClient;
  private collectionName: string;
  private threshold: number;
  private enabled: boolean;
  private ready: Promise<void> | null = null;

  constructor() {
    this.client = getQdrantClient();
    this.collectionName = cacheCollectionName();
    this.threshold = similarityThreshold();
    this.enabled = cacheEnabled();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private async ensureReady(): Promise<void> {
    if (!this.enabled) return;
    if (!this.ready) {
      this.ready = ensureQdrantCollection(this.client, this.collectionName);
    }
    await this.ready;
  }

  /**
   * Find a cached answer for a paraphrased or similar question.
   */
  async lookup(queryEmbedding: number[]): Promise<SemanticCacheLookupResult> {
    if (!this.enabled) return { hit: false };

    try {
      await this.ensureReady();

      const results = await this.client.search(this.collectionName, {
        vector: queryEmbedding,
        limit: 1,
        with_payload: true,
      });

      const top = results?.[0];
      if (!top || top.score < this.threshold) {
        return { hit: false };
      }

      const payload = top.payload as Record<string, unknown> | undefined;
      const response =
        typeof payload?.response === "string" ? payload.response : "";
      const matchedQuery =
        typeof payload?.query === "string" ? payload.query : "";
      const hasRagContext = payload?.has_rag_context === true;

      if (!response || !hasRagContext) return { hit: false };

      return {
        hit: true,
        cache: {
          response,
          score: top.score,
          matchedQuery,
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn("[semantic-cache] lookup failed:", message);
      return { hit: false };
    }
  }

  /**
   * Store a successful Q&A pair for future semantic hits.
   */
  async store(
    query: string,
    queryEmbedding: number[],
    response: string,
    options?: { hasRagContext?: boolean }
  ): Promise<void> {
    if (!this.enabled || !response.trim()) return;
    if (!options?.hasRagContext) return;

    try {
      await this.ensureReady();

      if (queryEmbedding.length !== QDRANT_VECTOR_SIZE) {
        console.warn(
          `[semantic-cache] skipping store: expected ${QDRANT_VECTOR_SIZE} dims, got ${queryEmbedding.length}`
        );
        return;
      }

      await this.client.upsert(this.collectionName, {
        wait: true,
        points: [
          {
            id: pointIdForQuery(query),
            vector: queryEmbedding,
            payload: {
              query: query.trim(),
              response: response.trim(),
              has_rag_context: true,
              created_at: new Date().toISOString(),
            },
          },
        ],
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn("[semantic-cache] store failed:", message);
    }
  }
}
