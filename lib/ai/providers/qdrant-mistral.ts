import { QdrantClient } from "@qdrant/js-client-rest";
import { GeminiProvider } from "./gemini";
import { OpenRouterProvider } from "./openrouter";
import { AIProvider, ChatMessage } from "./base";

export class QdrantMistralRAGProvider implements AIProvider {
    private qdrantClient: QdrantClient;
    private generator: AIProvider;
    private mistralApiKey: string;
    private collectionName: string = "portfolio_vectors";

    constructor() {
        const qdrantUrl = process.env.QDRANT_URL;
        const qdrantApiKey = process.env.QDRANT_API_KEY;
        const geminiApiKey = process.env.GEMINI_API_KEY || "";
        this.mistralApiKey = process.env.MISTRAL_API_KEY || "";

        // Decide which generator to use for RAG
        const generatorType = (process.env.RAG_GENERATOR || 'gemini').toLowerCase();

        if (generatorType === 'openrouter' && process.env.OPENROUTER_API_KEY) {
            this.generator = new OpenRouterProvider();
        } else {
            this.generator = new GeminiProvider(geminiApiKey);
        }

        this.qdrantClient = new QdrantClient({
            url: qdrantUrl,
            apiKey: qdrantApiKey,
        });
    }

    private async getMistralEmbedding(text: string): Promise<number[]> {
        try {
            const response = await fetch('https://api.mistral.ai/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.mistralApiKey}`,
                },
                body: JSON.stringify({
                    model: 'mistral-embed',
                    input: text,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Mistral API error (${response.status}):`, errorText);

                if (response.status === 403) {
                    throw new Error("Mistral API key reported as leaked or unauthorized.");
                }

                throw new Error(`Mistral API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data[0].embedding;
        } catch (error: any) {
            console.error("Embedding generation failed:", error.message);
            throw error;
        }
    }

    async chat(messages: ChatMessage[]): Promise<string> {
        try {
            const lastUserMessage = messages
                .filter((m) => m.role === "user")
                .pop()?.content || "";

            if (!lastUserMessage) throw new Error("No user message found");

            let context = "No specific database records found for this query.";

            try {
                // 1. Get embedding for the user query
                const queryEmbedding = await this.getMistralEmbedding(lastUserMessage);

                // 2. Search Qdrant for relevant context
                const searchResults = await this.qdrantClient.search(
                    this.collectionName,
                    {
                        vector: queryEmbedding,
                        limit: 5,
                    }
                );

                // 3. Build context from search results
                if (searchResults && searchResults.length > 0) {
                    context = searchResults
                        .map((result) => {
                            const payload = result.payload as any;
                            return payload?._text || JSON.stringify(payload);
                        })
                        .join("\n\n");
                }
            } catch (embError: any) {
                console.warn("Context retrieval failed, proceeding with general knowledge:", embError.message);
            }

            // 4. Build system prompt with context
            const systemPrompt = `You are Zohaib Asghar's highly professional AI Portfolio Assistant. 
Your goal is to provide a premium, engaging, and highly structured experience for visitors.

### 📜 GUIDELINES:
1. **Premium Formatting**: Always use Clean Markdown. Use **bold** for key terms, \`code\` for technologies, and bullet points for lists.
2. **Visual Structure**: Break long paragraphs into smaller chunks. Use clear headings where appropriate.
3. **Engaging Tone**: Be friendly, confident, and professional. Use relevant emojis sparingly (e.g., 🚀, 💻, ✨, 🛠️) to enhance the UI feel.
4. **Accuracy**: Use the provided context as your source of truth. If the context doesn't have the info, rely on your knowledge about Zohaib as a MERN/Next.js developer.

### 📂 RETRIEVED DATABASE CONTEXT:
${context}

### 👤 ZOHAIB'S CORE IDENTITY:
- **Role**: Full Stack MERN Developer | Next.js Specialist
- **Experience**: 1.5+ Years of building scalable web apps.
- **Location**: Lahore, Pakistan 🇵🇰
- **Email**: mzohaib0677@gmail.com
- **Core Tech**: React, Next.js, Node.js, MongoDB, TypeScript, Tailwind CSS.

Always speak as Zohaib's direct representative. Make him look like the top-tier engineer he is.`;

            // 5. Build conversation history
            const promptMessages: ChatMessage[] = [
                { role: 'system', content: systemPrompt },
                ...messages.slice(-5)
            ];

            // 6. Generate response from chosen generator
            return await this.generator.chat(promptMessages);

        } catch (error) {
            console.error("RAG Error:", error);
            throw new Error("Failed to get response from AI");
        }
    }
}
