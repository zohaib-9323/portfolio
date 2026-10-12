"use client";

import { motion } from "framer-motion";
import { Brain, Database, Bot, ShieldCheck, Terminal } from "lucide-react";
import { SectionShell, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    icon: Brain,
    title: "LLM Integration",
    description:
      "Production integrations with the Claude API, OpenRouter, and Google Vertex AI, using prompt engineering and validated structured JSON outputs.",
    proof: "Requirement Analyst: 5-category structured analysis via OpenRouter",
    tags: ["Claude API", "OpenRouter", "Vertex AI", "Structured Outputs"],
    color: "from-fuchsia-500 to-violet-500",
  },
  {
    icon: Database,
    title: "RAG Pipelines",
    description:
      "End-to-end retrieval-augmented generation: document chunking, embeddings, semantic search, and vector databases that ground the model in real data.",
    proof: "Trade Harmonizer: full RAG system shipped in one week",
    tags: ["Chunking", "Embeddings", "Semantic Search", "Vector DBs"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Bot,
    title: "Agentic AI & MCP",
    description:
      "Agentic workflows built on the Model Context Protocol and sub-agent architectures: models that call tools and APIs to finish multi-step tasks.",
    proof: "Claude Code Mastery: MCP, sub-agents, hooks, and plugins",
    tags: ["MCP", "Sub-agents", "Tool Use", "Hooks"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Reliable AI in Production",
    description:
      "AI features that keep working when models are slow or fail: BullMQ + Redis request queues, timeouts, and graceful fallbacks inside multi-tenant SaaS.",
    proof: "Capture AI: chatbot SaaS backend that survives failed model calls",
    tags: ["BullMQ", "Redis", "Timeouts & Fallbacks", "Multi-Tenant"],
    color: "from-amber-500 to-orange-500",
  },
];

const aiNativeTools = ["Claude Code", "Cursor", "Codex", "Copilot"];

export default function AIEngineering() {
  return (
    <SectionShell id="ai">
      <SectionHeading
        eyebrow="AI Engineering"
        title="Building for the AI era"
        description="Full-stack engineer turned AI engineer: I ship LLM-powered features on a solid MERN and NestJS foundation."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {capabilities.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group"
            >
              <motion.div
                className="card-interactive glass-strong flex h-full flex-col p-8 md:p-10"
                whileHover={{ y: -6 }}
              >
                <div
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r shadow-glow",
                    item.color
                  )}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-heading-md font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mb-5 leading-relaxed text-text-secondary">{item.description}</p>
                <p className="mb-5 border-l-2 border-accent/50 pl-3 text-sm font-medium text-text-primary">
                  {item.proof}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-lg border border-border-muted bg-bg-secondary/80 px-3 py-1 font-mono text-caption text-text-secondary"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-4 rounded-3xl border border-border-muted bg-card-bg/70 p-6 text-center md:flex-row md:justify-between md:text-left"
      >
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm font-medium text-text-secondary">
            AI-native workflow: these tools are part of how I build every day.
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-2">
          {aiNativeTools.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-caption font-semibold text-accent"
            >
              {tool}
            </li>
          ))}
        </ul>
      </motion.div>
    </SectionShell>
  );
}
