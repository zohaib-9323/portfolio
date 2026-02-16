import { AIProvider } from "./base";
import { GeminiProvider } from "./gemini";

/**
 * Factory function to create AI provider
 * This is where you can switch between different providers
 * For example: return new QdrantRAGProvider() instead of GeminiProvider
 */
export function createAIProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  // Currently using Gemini, but can be easily switched to:
  // return new QdrantRAGProvider();
  // return new OpenAIProvider();
  return new GeminiProvider(apiKey);
}
