"use client";

import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { usePersonal } from "@/lib/portfolio-data";

const CAPABILITIES = [
  {
    title: "LLM integration",
    body: "Production integrations with the Claude API, OpenRouter and Google Vertex AI. Prompts return structured JSON that is validated before anything downstream touches it.",
    proof: "Requirement Analyst: five analysis categories, all typed",
    tags: ["Claude API", "OpenRouter", "Vertex AI", "Structured outputs"],
  },
  {
    title: "RAG pipelines",
    body: "Retrieval first, generation second: chunking, embeddings and semantic search over vector databases, so answers come from the customer's documents.",
    proof: "Trade Harmonizer: a full RAG system shipped in a week",
    tags: ["Chunking", "Embeddings", "Semantic search", "Vector DBs"],
  },
  {
    title: "Agentic AI & MCP",
    body: "Workflows built on the Model Context Protocol and sub-agents: models that call tools and APIs to finish multi-step tasks, with hooks around them.",
    proof: "Claude Code Mastery: MCP, sub-agents, hooks and plugins",
    tags: ["MCP", "Sub-agents", "Tool use", "Hooks"],
  },
  {
    title: "Reliable in production",
    body: "Timeouts, retries and fallbacks live on the server. BullMQ and Redis queue the expensive calls so a slow provider never freezes the UI.",
    proof: "Capture AI: a chatbot backend that survives failed model calls",
    tags: ["BullMQ", "Redis", "Fallbacks", "Multi-tenant"],
  },
];

const PRINCIPLES = [
  ["Clean architecture", "Clear boundaries, SOLID where it pays, modules you can delete."],
  ["Performance first", "From the query plan to the render, every layer gets measured."],
  ["Secure by default", "Auth, roles and tenant isolation designed in, not bolted on."],
  ["AI-native workflow", "Claude Code, Cursor, Codex and Copilot, with MCP wired into delivery."],
];

export default function Engineering() {
  const me = usePersonal();
  const [lede, ...rest] = me.bio;

  return (
    <Section id="ai">
      <SectionHead id="ai" index="02" label="AI engineering" title="Full-stack first." quiet="AI where it earns its place." />

      <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-9 md:col-start-4">
          <p className="text-[clamp(1.35rem,2.2vw,1.8rem)] font-medium leading-[1.35] tracking-[-0.015em] text-ink">{lede}</p>
          <div className="mt-8 gap-10 text-[1.02rem] leading-relaxed text-ink-soft lg:columns-2">
            {rest.map((p) => (
              <p key={p} className="mb-6 break-inside-avoid">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      <ol className="mt-16 grid gap-5 md:mt-24 md:grid-cols-2">
        {CAPABILITIES.map((c, i) => (
          <Reveal as="li" key={c.title} delay={(i % 2) * 0.07}>
            <Tilt max={5} lift={18} radius="24px" className="h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-line bg-paper-raised p-7 md:p-9">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1]">{c.title}</h3>
                  <span className="display text-[2.6rem] leading-[0.8] text-line-strong" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-ink-soft">{c.body}</p>
                <ul className="mb-7 mt-6 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <li key={t} className="rounded-full bg-ink/[0.06] px-3 py-1 font-mono text-[0.7rem] text-ink-soft">
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto flex items-start gap-2.5 border-t border-line pt-5 text-[0.88rem] text-ink">
                  <span className="tick mt-[0.4rem]" aria-hidden />
                  {c.proof}
                </p>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </ol>

      <div className="mt-16 grid gap-y-6 md:mt-24 md:grid-cols-12 md:gap-x-8">
        <p className="label md:col-span-3">How I work</p>
        <dl className="border-t-[1.5px] border-ink md:col-span-9">
          {PRINCIPLES.map(([k, v]) => (
            <Reveal key={k} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
              <dt className="font-semibold text-ink">{k}</dt>
              <dd className="text-ink-soft">{v}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
