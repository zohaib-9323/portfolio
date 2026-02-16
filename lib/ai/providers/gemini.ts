import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, ChatMessage } from "./base";

/**
 * Gemini AI Provider Implementation
 * This can be replaced with Qdrant+RAG or other providers
 * by implementing the AIProvider interface
 */
export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash with proper generation config
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      // Get system prompt
      const systemPrompt = this.getSystemPrompt();

      // Get the last user message
      const lastUserMessage = messages
        .filter((msg) => msg.role === "user")
        .pop()?.content || "";

      if (!lastUserMessage) {
        throw new Error("No user message found");
      }

      // Build conversation context
      const conversationContext = messages
        .slice(-6) // Last 6 messages for context
        .map((msg) => {
          if (msg.role === "user") {
            return `User: ${msg.content}`;
          } else if (msg.role === "assistant") {
            return `Assistant: ${msg.content}`;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n");

      // Create prompt with system instruction and conversation
      const prompt = conversationContext
        ? `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${lastUserMessage}\n\nAssistant:`
        : `${systemPrompt}\n\nUser: ${lastUserMessage}\n\nAssistant:`;

      // Generate response
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from AI");
      }

      return text;
    } catch (error: any) {
      console.error("Gemini API Error Details:", {
        message: error?.message,
        error: error?.toString(),
        stack: error?.stack,
      });

      // Return more detailed error message for debugging
      const errorMessage = error?.message || error?.toString() || "Unknown error";

      // Check for specific API errors
      if (errorMessage.includes("API_KEY")) {
        throw new Error("Invalid or missing Gemini API key. Please check your GEMINI_API_KEY environment variable.");
      }

      throw new Error(`AI service error: ${errorMessage}`);
    }
  }

  private getSystemPrompt(): string {
    return `You are an AI assistant for Zohaib Asghar's portfolio website. You help visitors learn about:

- Zohaib's experience as a Full Stack MERN Developer
- His projects (Capture AI Portal, Recordo, Recipe Generator, Goldiam Crafters)
- His technical skills (React, Next.js, Node.js, MongoDB, etc.)
- His achievements (25% performance boost, 40% user satisfaction increase, etc.)
- Contact information (email: mzohaib0677@gmail.com, phone: +92 3229911442, location: Lahore, Pakistan)
- His tech philosophy (clean architecture, performance, security, scalability)

Be friendly, professional, and concise. If asked about something not related to Zohaib or his work, politely redirect the conversation back to his portfolio.`;
  }
}
