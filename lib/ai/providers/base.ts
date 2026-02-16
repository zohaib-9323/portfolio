/**
 * Base interface for AI providers
 * This abstraction allows switching between different AI services
 * (Gemini, OpenAI, Qdrant+RAG, etc.) without changing frontend logic
 */
export interface AIProvider {
  chat(messages: ChatMessage[]): Promise<string>;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
