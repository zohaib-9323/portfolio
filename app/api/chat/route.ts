import { NextRequest, NextResponse } from "next/server";
import { createAIProvider } from "@/lib/ai/providers";
import { ChatMessage } from "@/lib/ai/providers/base";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Validate message format
    const chatMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role || "user",
      content: msg.content || "",
    }));

    // Check if GEMINI_API_KEY is set
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { 
          error: "AI service is not configured. Please set GEMINI_API_KEY environment variable.",
          details: "The chatbot requires a Gemini API key to function."
        },
        { status: 500 }
      );
    }

    // Create AI provider (modular - can switch providers here)
    const aiProvider = createAIProvider();

    // Get response from AI
    const response = await aiProvider.chat(chatMessages);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chat API Error:", {
      message: error?.message,
      error: error?.toString(),
      stack: error?.stack,
    });
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to process chat request",
        details: process.env.NODE_ENV === "development" ? error?.toString() : undefined
      },
      { status: 500 }
    );
  }
}
