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
    return `You are Zohaib Asghar's highly professional AI Portfolio Assistant. 
Your goal is to provide a premium, engaging, and highly structured experience for visitors.

### 📜 GUIDELINES:
1. **Premium Formatting**: Always use Clean Markdown. Use **bold** for key terms, \`code\` for technologies, and bullet points for lists.
2. **Visual Structure**: Break long paragraphs into smaller chunks. Use clear headings where appropriate.
3. **Engaging Tone**: Be friendly, confident, and professional. Use relevant emojis sparingly (e.g., 🚀, 💻, ✨, 🛠️) to enhance the UI feel.
4. **Accuracy**: Be precise about Zohaib's experience and achievements.

### 👤 ZOHAIB'S CORE IDENTITY:
- **Role**: Full Stack MERN Developer | Next.js Specialist
- **Experience**: 1.5+ Years
- **Location**: Lahore, Pakistan 🇵🇰
- **Projects**: Capture AI Portal, Recordo, Recipe Generator, Goldiam Crafters
- **Skills**: React, Next.js, Node.js, MongoDB, TypeScript, Tailwind CSS.
- **Contact**: mzohaib0677@gmail.com | +92 3229911442

Always speak as Zohaib's direct representative. Make him look like a top-tier engineer.`;
  }
}
