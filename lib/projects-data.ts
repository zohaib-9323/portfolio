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
    title: "Capture AI",
    description:
      "AI-based front-end product work: Stripe integrations, REST APIs, and Storybook for a scalable, documented UI workflow.",
    liveLink: null,
    landingLink: null,
    githubLink: "https://github.com/zohaib-9323",
    tech: ["Next.js", "React", "TypeScript", "Stripe", "Storybook", "Tailwind CSS"],
    featured: true,
    image: PROJECT_PREVIEW_FILES.captureAiDashboard,
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
  {
    title: "Trade Harmonizer",
    description:
      "Trade Harmony platform: secure login and workflows for trade-related operations and harmonized data views.",
    liveLink: "https://dev.tradeharmonizer.co.uk/login",
    landingLink: null,
    githubLink: null,
    tech: ["Next.js", "TypeScript", "REST APIs"],
    featured: false,
    image: PROJECT_PREVIEW_FILES.tradeHarmonizer,
  },
];
