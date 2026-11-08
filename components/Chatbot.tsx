"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "@/lib/ai/providers/base";

const SUGGESTIONS = [
  "What did he build for Trade Harmonizer?",
  "How does he handle failed LLM calls?",
  "Is he open to remote roles?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi. I'm an assistant trained on Zohaib's resume and projects. Ask about his work, his stack, or how to reach him.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || "Failed to get response");
      if (data.meta) console.info("[chat] response meta:", data.meta);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            message && message.length < 280
              ? message
              : "Sorry, I can't connect right now. You can reach Zohaib directly at mzohaib0677@gmail.com.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onlyGreeting = messages.length === 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        aria-label={isOpen ? "Close chat" : "Ask about my work"}
        className="fixed bottom-5 right-4 z-50 inline-flex items-center gap-2.5 rounded-full bg-ink p-2 text-[0.9rem] font-medium text-paper ring-1 ring-paper/30 sm:py-2 sm:pl-2 sm:pr-4 shadow-[0_5px_0_rgb(0_0_0/0.35),0_16px_30px_-14px_rgb(0_0_0/0.5)] transition-transform hover:-translate-y-0.5 active:translate-y-1 sm:bottom-6 sm:right-6"
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-on sm:h-7 sm:w-7" aria-hidden>
          <span className="font-display text-[0.8rem] font-bold leading-none">{isOpen ? "×" : "ZA"}</span>
        </span>
        <span className="hidden sm:inline">{isOpen ? "Close" : "Ask about my work"}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label="Chat about Zohaib's work"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[4.5rem] right-4 z-50 flex h-[min(560px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[22px] border border-line bg-paper-raised shadow-[0_30px_60px_-30px_rgb(var(--ink)/0.5)] sm:bottom-[5.5rem] sm:right-6 sm:w-[380px]"
          >
            <div className="flex items-baseline justify-between border-b border-line px-5 py-4">
              <p className="display text-[1.2rem] leading-none">Ask about my work</p>
              <p className="label">AI assistant</p>
            </div>

            <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-[16px] rounded-br-[4px] bg-ink px-3.5 py-2.5 text-[0.92rem] leading-relaxed text-paper"
                        : "max-w-[92%] text-[0.94rem] leading-relaxed text-ink-soft"
                    }
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                        strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
                        a: ({ children, href }) => (
                          <a href={href} target="_blank" rel="noreferrer" className="link">
                            {children}
                          </a>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-ink/[0.06] px-1 py-0.5 font-mono text-[0.8rem]">{children}</code>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {onlyGreeting && (
                <div className="flex flex-col items-start gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-line px-3 py-1.5 text-left text-[0.85rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <p className="label animate-pulse" aria-live="polite">
                  Thinking…
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-line px-3 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question"
                disabled={isLoading}
                aria-label="Your question"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[0.95rem] text-ink outline-none placeholder:text-muted/70 focus-visible:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-ink px-4 py-2 text-[0.85rem] font-medium text-paper transition-colors hover:-translate-y-0.5 disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
