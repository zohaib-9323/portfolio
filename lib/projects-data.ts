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
}

/** Shown if Supabase returns no rows or the query fails */
export const FALLBACK_PROJECTS: ProjectShowcase[] = [
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
    liveLink: null,
    landingLink: null,
    githubLink: "https://github.com/zohaib-9323/Requirment-Analyst",
    tech: ["Node.js", "Express.js", "OpenRouter", "Structured JSON Outputs", "Prompt Engineering"],
    featured: true,
    image: null,
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
    title: "PPS — Police Professional Services",
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
