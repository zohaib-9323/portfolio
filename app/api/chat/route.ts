import { NextRequest, NextResponse } from "next/server";
import { createAIProvider } from "@/lib/ai/providers";
import { ChatMessage } from "@/lib/ai/providers/base";
import {
  chatEnvHumanHint,
  getMissingChatEnvVars,
} from "@/lib/ai/chat-env";

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

    const missingEnv = getMissingChatEnvVars();
    if (missingEnv.length > 0) {
      console.error("[api/chat] Missing env:", missingEnv.join(", "));
      return NextResponse.json(
        {
          error: "AI service is not configured for the selected provider.",
          details: chatEnvHumanHint(missingEnv),
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
