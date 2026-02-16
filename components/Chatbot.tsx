"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { ChatMessage } from "@/lib/ai/providers/base";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Zohaib's AI assistant. I can help you learn about his experience, projects, skills, and more. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later or contact Zohaib directly at mzohaib0677@gmail.com",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center text-white group"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-glow-strong)",
        }}
        aria-label="Toggle chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Effect */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "var(--gradient-primary)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-28 right-8 z-50 w-[calc(100vw-4rem)] sm:w-96 h-[600px] max-h-[calc(100vh-8rem)] glass-strong rounded-2xl flex flex-col overflow-hidden"
              style={{
                boxShadow: "var(--shadow-strong)",
              }}
            >
              {/* Header */}
              <div
                className="p-5 flex items-center justify-between"
                style={{
                  borderBottom: "1px solid var(--border-muted)",
                  background: "var(--gradient-subtle)",
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-glow)",
                    }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg gradient-text-static">
                      Zohaib's AI Assistant
                    </h3>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    color: "var(--text-muted)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                </motion.button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {message.role === "assistant" && (
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "var(--gradient-primary)",
                          boxShadow: "var(--shadow-glow)",
                        }}
                      >
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <motion.div
                      className="max-w-[80%] rounded-2xl p-4"
                      style={
                        message.role === "user"
                          ? {
                            background: "var(--gradient-primary)",
                            color: "white",
                            boxShadow: "var(--shadow-glow)",
                          }
                          : {
                            background: "var(--glass-bg)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--glass-border)",
                          }
                      }
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </motion.div>
                    {message.role === "user" && (
                      <div className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "var(--shadow-glow)",
                      }}
                    >
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="glass rounded-2xl p-4">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ background: "var(--accent-primary)" }}
                            animate={{
                              y: [0, -8, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                className="p-5"
                style={{
                  borderTop: "1px solid var(--border-muted)",
                  background: "var(--bg-secondary)",
                }}
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about Zohaib's experience..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-xl glass focus-outline disabled:opacity-50 transition-all"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-glow)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
