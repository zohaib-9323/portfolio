import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, ChatMessage, ChatResult } from "./base";
import { getActiveProviderName } from "../rag-utils";

/**
 * Gemini AI Provider Implementation
 */
export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(messages: ChatMessage[]): Promise<ChatResult> {
    const started = Date.now();
    try {
      const systemFromMessages = [...messages]
        .reverse()
        .find((m) => m.role === "system")?.content;
      const systemPrompt = systemFromMessages || this.getSystemPrompt();
      const useRagSystem = Boolean(systemFromMessages);

      const lastUserMessage = messages
        .filter((msg) => msg.role === "user")
        .pop()?.content || "";

      if (!lastUserMessage) {
        throw new Error("No user message found");
      }

      const historyMessages = messages.filter(
        (m) => m.role === "user" || m.role === "assistant"
      );

      const conversationMessages = useRagSystem
        ? historyMessages.filter(
            (m) =>
              !(
                m.role === "assistant" &&
                m.content.includes("Zohaib's AI Assistant") &&
                m.content.includes("Ask about his")
              )
          )
        : historyMessages;

      const priorTurns = conversationMessages.slice(0, -1);
      const conversationContext = priorTurns
        .map((msg) =>
          msg.role === "user"
            ? `User: ${msg.content}`
            : `Assistant: ${msg.content}`
        )
        .join("\n");

      const prompt = conversationContext
        ? `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${lastUserMessage}\n\nAssistant:`
        : `${systemPrompt}\n\nUser: ${lastUserMessage}\n\nAssistant:`;

      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: useRagSystem ? 0.4 : 0.7,
          maxOutputTokens: 8192,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        throw new Error("Empty response from AI");
      }

      return {
        response: text,
        meta: {
          provider: getActiveProviderName(),
          source: useRagSystem ? "rag_llm" : "gemini",
          cached: false,
          generator: "gemini",
          latencyMs: Date.now() - started,
        },
      };
    } catch (error: unknown) {
      const err = error as { message?: string; toString?: () => string; stack?: string };
      console.error("Gemini API Error Details:", {
        message: err?.message,
        error: err?.toString?.(),
        stack: err?.stack,
      });

      const errorMessage = err?.message || err?.toString?.() || "Unknown error";

      if (errorMessage.includes("API_KEY")) {
        throw new Error(
          "Invalid or missing Gemini API key. Please check your GEMINI_API_KEY environment variable."
        );
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
- **Experience**: ~2 years designing and shipping scalable web applications (current role since Sep 2024)
- **Location**: Lahore, Pakistan 🇵🇰
- **Projects**: Capture AI, Recordo Admin, PPS Police Professional Services (\`https://develop.dizsrd2khzh34.amplifyapp.com/\`), Trade Harmonizer (\`https://dev.tradeharmonizer.co.uk/login\`)
- **Skills**: React, Next.js, Node.js, NestJS, Express, MongoDB, Supabase, Firebase, TypeScript, Tailwind CSS, REST APIs, Docker, AWS, Redis.
- **Certifications**: Claude Code Mastery (LWS Academy, 2026) — AI-augmented workflows, MCP, sub-agents, hooks, plugins.
- **Contact**: mzohaib0677@gmail.com | +92 3229911442

Always speak as Zohaib's direct representative. Make him look like a top-tier engineer.`;
  }
}
