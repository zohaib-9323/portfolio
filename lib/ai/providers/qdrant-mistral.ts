import { GeminiProvider } from "./gemini";
import { OpenRouterProvider } from "./openrouter";
import { AIProvider, ChatMessage, ChatResult } from "./base";
import { getActiveProviderName } from "../rag-utils";
import { getMistralEmbedding } from "../mistral-embed";
import { getQdrantClient } from "../qdrant-client";
import { QdrantSemanticCache } from "../semantic-cache";
import {
  ragContextIsSubstantial,
  shouldUseSemanticCache,
} from "../rag-utils";

const RAG_CONTEXT_LIMIT = Number.parseInt(
  process.env.RAG_CONTEXT_LIMIT?.trim() || "5",
  10
);

export class QdrantMistralRAGProvider implements AIProvider {
  private qdrantClient = getQdrantClient();
  private generator: AIProvider;
  private mistralApiKey: string;
  private collectionName: string;
  private semanticCache: QdrantSemanticCache;

  constructor() {
    this.collectionName =
      process.env.QDRANT_COLLECTION?.trim() || "portfolio_vectors";
    const geminiApiKey = process.env.GEMINI_API_KEY || "";
    this.mistralApiKey = process.env.MISTRAL_API_KEY || "";

    const generatorType = (process.env.RAG_GENERATOR || "gemini")
      .trim()
      .toLowerCase();

    if (generatorType === "openrouter" && process.env.OPENROUTER_API_KEY) {
      this.generator = new OpenRouterProvider();
    } else {
      this.generator = new GeminiProvider(geminiApiKey);
    }

    this.semanticCache = new QdrantSemanticCache();
  }

  async chat(messages: ChatMessage[]): Promise<ChatResult> {
    const started = Date.now();
    const generatorName =
      (process.env.RAG_GENERATOR || "gemini").trim().toLowerCase() ===
      "openrouter"
        ? "openrouter"
        : "gemini";

    try {
      const lastUserMessage = messages
        .filter((m) => m.role === "user")
        .pop()?.content || "";

      if (!lastUserMessage) throw new Error("No user message found");

      const queryEmbedding = await getMistralEmbedding(
        lastUserMessage,
        this.mistralApiKey
      );

      const useCache = shouldUseSemanticCache(lastUserMessage);

      // 1. Semantic cache — only for substantive questions with prior RAG-backed answers
      if (useCache && this.semanticCache.isEnabled()) {
        const cached = await this.semanticCache.lookup(queryEmbedding);
        if (cached.hit && cached.cache) {
          console.info(
            `[RAG] semantic cache hit (score=${cached.cache.score.toFixed(3)}, matched="${cached.cache.matchedQuery.slice(0, 40)}")`
          );
          return {
            response: cached.cache.response,
            meta: {
              provider: getActiveProviderName(),
              source: "semantic_cache",
              cached: true,
              cacheScore: cached.cache.score,
              cacheMatchedQuery: cached.cache.matchedQuery,
              latencyMs: Date.now() - started,
            },
          };
        }
      }

      // 2. RAG retrieval from portfolio knowledge base
      let context = "No specific database records found for this query.";
      let topRagScore: number | undefined;
      let ragChunks = 0;

      try {
        const searchResults = await this.qdrantClient.search(
          this.collectionName,
          {
            vector: queryEmbedding,
            limit: Number.isNaN(RAG_CONTEXT_LIMIT) ? 5 : RAG_CONTEXT_LIMIT,
          }
        );

        ragChunks = searchResults?.length ?? 0;
        topRagScore = searchResults?.[0]?.score;

        if (searchResults?.length > 0) {
          context = searchResults
            .map((result) => {
              const payload = result.payload as Record<string, unknown>;
              const text = payload?._text;
              return typeof text === "string" ? text : JSON.stringify(payload);
            })
            .join("\n\n");
        }

        if (process.env.NODE_ENV === "development") {
          console.info(
            `[RAG] retrieval: chunks=${searchResults?.length ?? 0} topScore=${topRagScore?.toFixed(3) ?? "n/a"} query="${lastUserMessage.slice(0, 60)}"`
          );
        }
      } catch (ragError: unknown) {
        const message =
          ragError instanceof Error ? ragError.message : String(ragError);
        console.warn(
          "Context retrieval failed, proceeding with general knowledge:",
          message
        );
      }

      const hasRagContext = ragContextIsSubstantial(context, topRagScore);

      const systemPrompt = `You are Zohaib Asghar's highly professional AI Portfolio Assistant. 
Your goal is to provide a premium, engaging, and highly structured experience for visitors.

### 📜 GUIDELINES:
1. **Premium Formatting**: Always use Clean Markdown. Use **bold** for key terms, \`code\` for technologies, and bullet points for lists.
2. **Visual Structure**: Break long paragraphs into smaller chunks. Use clear headings where appropriate.
3. **Engaging Tone**: Be friendly, confident, and professional. Use relevant emojis sparingly (e.g., 🚀, 💻, ✨, 🛠️) to enhance the UI feel.
4. **Accuracy**: Answer ONLY from the RETRIEVED DATABASE CONTEXT below when it contains relevant facts. Quote project names, tech stacks, and dates from that section. Do not invent projects or skills not listed in context.
5. If context is empty or irrelevant, say you do not have that detail in the portfolio database and offer contact email.

### 📂 RETRIEVED DATABASE CONTEXT:
${context}

### 👤 ZOHAIB'S CORE IDENTITY (fallback only if context lacks the answer):
- **Role**: Full Stack MERN Developer | Next.js Specialist
- **Location**: Lahore, Pakistan 🇵🇰
- **Email**: mzohaib0677@gmail.com

Always speak as Zohaib's direct representative.`;

      const promptMessages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-5),
      ];

      const generated = await this.generator.chat(promptMessages);

      // 3. Cache only substantive RAG-backed Q&A (never greetings)
      if (useCache && hasRagContext) {
        await this.semanticCache.store(
          lastUserMessage,
          queryEmbedding,
          generated.response,
          { hasRagContext: true }
        );
      }

      return {
        response: generated.response,
        meta: {
          provider: getActiveProviderName(),
          source: "rag_llm",
          cached: false,
          generator: generatorName,
          ragChunks,
          ragTopScore: topRagScore,
          ragCollection: this.collectionName,
          latencyMs: Date.now() - started,
        },
      };
    } catch (error) {
      console.error("RAG Error:", error);
      throw new Error("Failed to get response from AI");
    }
  }
}
