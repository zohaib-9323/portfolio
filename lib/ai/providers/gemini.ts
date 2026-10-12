import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getGeminiModelCandidates,
  isModelNotFoundError,
  isTransientGeminiError,
  sleep,
} from "../gemini-utils";
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

      const text = await this.generateWithFallback(prompt, useRagSystem);

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

  private async generateWithFallback(
    prompt: string,
    useRagSystem: boolean
  ): Promise<string> {
    const models = getGeminiModelCandidates();
    let lastError = "Unknown error";

    for (const modelName of models) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: useRagSystem ? 0.4 : 0.7,
              maxOutputTokens: 8192,
            },
          });

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text) return text;
          lastError = "Empty response from AI";
        } catch (error: unknown) {
          const err = error as { message?: string };
          lastError = err?.message || String(error);
          const transient = isTransientGeminiError(lastError);

          if (transient && attempt < 2) {
            await sleep(400 * (attempt + 1));
            continue;
          }
          if (transient || isModelNotFoundError(lastError)) {
            console.warn(
              `[Gemini] ${modelName} skipped (${lastError.slice(0, 100)}), trying next model…`
            );
            break;
          }
          throw error;
        }
      }
    }

    throw new Error(lastError);
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
- **Role**: MERN Stack + AI Engineer
- **Experience**: Nearly 3 years. Full Stack Developer / Software Engineer at DevExcelIT Solutions (Sep 2024 to present); Associate Software Engineer at AOT Solutions (Jan 2024 to Aug 2024). Focused on AI engineering for the last year.
- **Location**: Lahore, Pakistan 🇵🇰
- **AI work**: LLM integrations (Claude API, OpenRouter, Google Vertex AI), RAG pipelines (chunking, embeddings, semantic search, vector DBs), agentic workflows with MCP and sub-agents, structured JSON outputs, BullMQ + Redis AI request queues.
- **Projects**: Trade Harmonizer (RAG + Vertex AI queue, multi-tenant SaaS, \`https://dev.tradeharmonizer.co.uk\`), Capture AI (AI chatbot management platform backend, \`https://app.cptr.ai\`), Requirement Analyst (OpenRouter structured-output requirements analysis, \`https://github.com/zohaib-9323/Requirment-Analyst\`), plus Recordo and PPS.
- **Skills**: Node.js, NestJS, Express, React, Next.js, TypeScript, MongoDB/Mongoose, Prisma, Redis, BullMQ, JWT/RBAC, multi-tenant architecture, Stripe, QuickBooks/Xero, Firebase, Docker, AWS, GitHub Actions, Trivy; AI tools: Claude Code, Cursor, Codex, Copilot.
- **Impact**: 30+ JWT-secured and 25+ RBAC-protected endpoints, ~35% faster APIs with Redis caching, ~50% faster deployments with CI/CD.
- **Education**: BS Computer Software Engineering, Minhaj University Lahore (2021–2025), CGPA 3.66/4.00.
- **Certifications**: Claude Code Mastery (LWS Academy, 2026) — AI-augmented workflows, MCP, sub-agents, hooks, plugins.
- **Contact**: mzohaib0677@gmail.com | +92 3229911442

Always speak as Zohaib's direct representative. Make him look like a top-tier engineer.`;
  }
}
