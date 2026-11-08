/**
 * Fallback project showcase when Supabase is unavailable, RLS blocks reads,
 * or the `projects` table is empty. Mirrors the public Project card shape (without gradient).
 * Qdrant is only used for the AI chatbot RAG — project cards always come from Supabase or this fallback.
 */

import { PROJECT_PREVIEW_FILES } from "./project-preview-images";

export interface ProjectShowcase {
  title: string;
  description: string;
  liveLink: string | null;
  landingLink: string | null;
  githubLink: string | null;
  tech: string[];
  featured: boolean;
  image: string | null;
  /** Optional label shown above the title, e.g. "In development" */
  status?: string;
}

/**
 * Newer projects that aren't in Supabase yet. These are always shown, merged on top of
 * whatever Supabase returns, so they don't disappear once the live rows load.
 */
export const PINNED_PROJECTS: ProjectShowcase[] = [
  {
    title: "ResearchFlow AI",
    description:
      "An AI research assistant that answers from your own documents, with a citation for every claim. A LangGraph agent drafts an answer, fact-checks it against the retrieved passages, searches again within a fixed retry budget, and says \"not found in your documents\" instead of guessing. Deep research mode plans tasks, picks LangChain tools (document and web search, source comparison, a safe calculator) and writes a cited report you can download.",
    liveLink: "https://researchflow-ai-pro.streamlit.app/",
    landingLink: null,
    githubLink: "https://github.com/zohaib-9323/researchflow-ai",
    tech: ["Python", "LangChain", "LangGraph", "Gemini", "FAISS", "sentence-transformers", "FastAPI", "Streamlit", "SQLite"],
    featured: true,
    image: "/assets/projects/researchflow-ai.jpg",
  },
  {
    title: "CafeFlow",
    description:
      "Ordering and back-office software for a café: a customer site with menu, cart, checkout and order tracking; an admin dashboard with four roles, stock deducted per recipe, promotions and a small CMS; and a separate Python service for sales analytics and a 7-day revenue forecast. Covered by 64 Laravel and 29 Python tests.",
    liveLink: null,
    landingLink: null,
    githubLink: "https://github.com/zohaib-9323/cafeflow",
    tech: ["Laravel", "PHP", "MySQL", "Sanctum", "Bootstrap", "FastAPI", "pandas", "Docker"],
    featured: true,
    image: "/assets/projects/cafeflow.jpg",
    status: "In development",
  },
];

/** Shown if Supabase returns no rows or the query fails */
export const FALLBACK_PROJECTS: ProjectShowcase[] = [
  ...PINNED_PROJECTS,
  {
    title: "Trade Harmonizer",
    description:
      "Multi-tenant trade compliance SaaS with a RAG knowledge base built in one week: document chunking, embeddings, and semantic search feeding the LLM. Admin tools cover guidance prompts, knowledge testing, publishing, and version history. Google Vertex AI requests are queued through BullMQ + Redis. Includes JWT/RBAC tenant isolation and a third-party pen test that found only low-severity issues.",
    liveLink: "https://dev.tradeharmonizer.co.uk",
    landingLink: null,
    githubLink: null,
    tech: ["NestJS", "MongoDB", "RAG", "Google Vertex AI", "BullMQ", "Redis", "JWT/RBAC", "Stripe", "QuickBooks/Xero", "Trivy"],
    featured: true,
    image: PROJECT_PREVIEW_FILES.tradeHarmonizer,
  },
  {
    title: "Capture AI",
    description:
      "AI-powered chatbot management SaaS for automation, customer engagement, and lead management. I built the backend modules for analytics, chatbot configuration, the AI knowledge base, engagement workflows, and Stripe subscriptions. Slow or failed LLM calls are handled on the server so they don't break the rest of the workflow.",
    liveLink: "https://app.cptr.ai",
    landingLink: null,
    githubLink: null,
    tech: ["NestJS", "Node.js", "LLM APIs", "Stripe", "TypeScript"],
    featured: true,
    image: PROJECT_PREVIEW_FILES.captureAiDashboard,
  },
  {
    title: "Requirement Analyst",
    description:
      "AI requirements analysis tool that finds missing, vague, or risky requirements, such as edge cases and business-logic gaps. It uses OpenRouter chat completions to return validated structured JSON across 5 analysis categories and exports reports to Markdown.",
    liveLink: "https://requirment-analyst.vercel.app/",
    landingLink: null,
    githubLink: "https://github.com/zohaib-9323/Requirment-Analyst",
    tech: ["Node.js", "Express.js", "OpenRouter", "Structured JSON Outputs", "Prompt Engineering"],
    featured: true,
    image: PROJECT_PREVIEW_FILES.requirementAnalyst,
  },
  {
    title: "Recordo Dashboard",
    description:
      "AI-powered admin dashboard for converting voice, text, and images into structured operational data.",
    liveLink: null,
    landingLink: null,
    githubLink: "https://github.com/zohaib-9323",
    tech: ["Next.js", "Node.js", "TypeScript", "REST APIs"],
    featured: true,
    image: PROJECT_PREVIEW_FILES.recordoDashboard,
  },
  {
    title: "Recordo Landing Page",
    description:
      "Marketing landing experience for Recordo with modern layout, animations, and conversion-focused UI.",
    liveLink: null,
    landingLink: null,
    githubLink: "https://github.com/zohaib-9323",
    tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    featured: false,
    image: PROJECT_PREVIEW_FILES.recordoLanding,
  },
  {
    title: "Goldium Crafter",
    description:
      "E-commerce and crafting platform with modern UI, product flows, and performance-focused front-end delivery.",
    liveLink: null,
    landingLink: null,
    githubLink: null,
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    featured: false,
    image: PROJECT_PREVIEW_FILES.goldiumCrafter,
  },
  {
    title: "Recipe Generator",
    description:
      "AI-assisted recipe generation app with intuitive UX and fast client-side interactions.",
    liveLink: null,
    landingLink: null,
    githubLink: null,
    tech: ["React", "Node.js", "TypeScript"],
    featured: false,
    image: PROJECT_PREVIEW_FILES.recipeGenerator,
  },
  {
    title: "PPS (Police Professional Services)",
    description:
      "Backend systems delivered with NestJS: generalized APIs consumed by mobile and web clients, deployed for production use.",
    liveLink: "https://develop.dizsrd2khzh34.amplifyapp.com/",
    landingLink: null,
    githubLink: null,
    tech: ["NestJS", "Node.js", "TypeScript", "REST APIs", "MongoDB"],
    featured: false,
    image: PROJECT_PREVIEW_FILES.pps,
  },
];
