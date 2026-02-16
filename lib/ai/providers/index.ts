import { AIProvider } from "./base";
import { GeminiProvider } from "./gemini";
import { QdrantMistralRAGProvider } from "./qdrant-mistral";
import { OpenRouterProvider } from "./openrouter";

/**
 * Factory function to create AI provider
 * Supports: 'gemini' (default), 'qdrant' (RAG), 'openrouter'
 */
export function createAIProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  switch (providerType) {
    case 'openrouter':
      if (process.env.OPENROUTER_API_KEY) {
        return new OpenRouterProvider();
      }
      console.warn("OpenRouter API Key missing, falling back to Gemini");
      break;

    case 'qdrant':
      if (process.env.QDRANT_URL && process.env.QDRANT_API_KEY && process.env.MISTRAL_API_KEY) {
        try {
          return new QdrantMistralRAGProvider();
        } catch (error) {
          console.error("Failed to initialize QdrantMistralRAGProvider, falling back to Gemini:", error);
        }
      } else {
        console.warn("Qdrant/Mistral variables missing, falling back to Gemini");
      }
      break;

    case 'gemini':
    default:
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
      }
      return new GeminiProvider(apiKey);
  }

  // Final fallback
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) throw new Error("No AI providers configured correctly");
  return new GeminiProvider(geminiKey);
}


