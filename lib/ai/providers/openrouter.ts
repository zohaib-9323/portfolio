import { AIProvider, ChatMessage } from "./base";

export class OpenRouterProvider implements AIProvider {
    private apiKey: string;
    private model: string = "nvidia/nemotron-3-nano-30b-a3b:free";

    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY || "";
        if (!this.apiKey) {
            console.warn("OPENROUTER_API_KEY is not set");
        }
    }

    async chat(messages: ChatMessage[]): Promise<string> {
        try {
            // Using fetch directly as per OpenRouter's best practice for environments without full SDK support
            // or to maintain consistency with the other providers here.
            // But the user asked for the SDK style if possible.
            // Let's use the fetch API for better compatibility with Next.js Edge/Serverless if needed.

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "HTTP-Referer": "https://zohaib-portfolio.com", // Optional, for OpenRouter rankings
                    "X-Title": "Zohaib Portfolio", // Optional
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`OpenRouter API error: ${error}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
        } catch (error) {
            console.error("OpenRouter Error:", error);
            throw new Error("Failed to get response from OpenRouter");
        }
    }
}
