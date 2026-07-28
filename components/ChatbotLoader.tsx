"use client";

import dynamic from "next/dynamic";

/**
 * Client-side lazy loader for the Chatbot. Keeps react-markdown + the chat
 * widget out of the initial page bundle — it loads only in the browser,
 * after the main content is interactive.
 */
const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

export default function ChatbotLoader() {
  return <Chatbot />;
}
