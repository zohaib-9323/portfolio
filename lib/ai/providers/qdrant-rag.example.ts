/**
 * EXAMPLE: Qdrant + RAG Provider Implementation
 * 
 * This is a reference implementation showing how to switch from Gemini to Qdrant+RAG.
 * To use this:
 * 1. Install required packages: npm install @qdrant/js-client-rest openai
 * 2. Rename this file to qdrant-rag.ts
 * 3. Update lib/ai/providers/index.ts to use QdrantRAGProvider instead of GeminiProvider
 * 4. Set up QDRANT_URL and QDRANT_API_KEY in .env
 */

import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import { AIProvider, ChatMessage } from "./base";

export class QdrantRAGProvider implements AIProvider {
  private qdrantClient: QdrantClient;
  private openaiClient: OpenAI;
  private collectionName: string;

  constructor() {
    const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
    const qdrantApiKey = process.env.QDRANT_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is required for Qdrant RAG provider");
    }

    this.qdrantClient = new QdrantClient({
      url: qdrantUrl,
      apiKey: qdrantApiKey,
    });

    this.openaiClient = new OpenAI({ apiKey: openaiApiKey });
    this.collectionName = "zohaib-portfolio-knowledge";
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const lastUserMessage = messages
        .filter((m) => m.role === "user")
        .pop()?.content || "";

      // Step 1: Convert user query to embedding
      const embeddingResponse = await this.openaiClient.embeddings.create({
        model: "text-embedding-ada-002",
        input: lastUserMessage,
      });
      const queryEmbedding = embeddingResponse.data[0].embedding;

      // Step 2: Search Qdrant for relevant context
      const searchResults = await this.qdrantClient.search(
        this.collectionName,
        {
          vector: queryEmbedding,
          limit: 3,
          score_threshold: 0.7,
        }
      );

      // Step 3: Build context from search results
      const context = searchResults
        .map((result) => result.payload?.content || "")
        .join("\n\n");

      // Step 4: Build system prompt with context
      const systemPrompt = `You are an AI assistant for Zohaib Asghar's portfolio website. Use the following context to answer questions accurately:

${context}

If the context doesn't contain relevant information, use your general knowledge about Zohaib:
- Full Stack MERN Developer
- 1.5+ years of experience
- Projects: Capture AI Portal, Recordo, Recipe Generator, Goldiam Crafters
- Skills: React, Next.js, Node.js, MongoDB, TypeScript, etc.
- Contact: mzohaib0677@gmail.com, +92 3229911442, Lahore, Pakistan

Be friendly, professional, and concise.`;

      // Step 5: Get response from LLM with context
      const completion = await this.openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-5), // Last 5 messages for context
        ],
      });

      return completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
    } catch (error) {
      console.error("Qdrant RAG Error:", error);
      throw new Error("Failed to get response from AI");
    }
  }

  /**
   * Helper method to initialize Qdrant collection with portfolio data
   * Run this once to set up the knowledge base
   */
  async initializeCollection() {
    // Create collection if it doesn't exist
    try {
      await this.qdrantClient.getCollection(this.collectionName);
    } catch {
      await this.qdrantClient.createCollection(this.collectionName, {
        vectors: { size: 1536, distance: "Cosine" }, // OpenAI ada-002 embedding size
      });
    }

    // Add portfolio knowledge documents
    const portfolioData = [
      {
        content: "Zohaib Asghar is a Full Stack MERN Developer with 1.5+ years of experience...",
        metadata: { type: "about", section: "hero" },
      },
      // Add more documents about projects, skills, experience, etc.
    ];

    // Convert to embeddings and upload to Qdrant
    // Implementation details...
  }
}
