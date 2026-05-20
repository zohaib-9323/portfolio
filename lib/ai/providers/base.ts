/**
 * Base interface for AI providers
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/** How the answer was produced — visible in /api/chat JSON and chat UI */
export type ChatSource =
  | "semantic_cache"
  | "rag_llm"
  | "gemini"
  | "openrouter";

export interface ChatResponseMeta {
  /** Active AI_PROVIDER env value */
  provider: string;
  /** Detailed source for debugging */
  source: ChatSource;
  /** true when served from Qdrant semantic cache without LLM */
  cached: boolean;
  /** LLM used after RAG (gemini | openrouter) */
  generator?: string;
  /** Number of Qdrant chunks retrieved for RAG */
  ragChunks?: number;
  /** Best cosine score from portfolio_vectors search */
  ragTopScore?: number;
  /** Qdrant collection used for knowledge retrieval */
  ragCollection?: string;
  /** Cache hit similarity score */
  cacheScore?: number;
  /** Original cached question (when source is semantic_cache) */
  cacheMatchedQuery?: string;
  /** End-to-end handler time in ms */
  latencyMs: number;
}

export interface ChatResult {
  response: string;
  meta: ChatResponseMeta;
}

export interface AIProvider {
  chat(messages: ChatMessage[]): Promise<ChatResult>;
}
