export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: number;
  completedOn?: string;
  hours?: number;
  summary: string;
  highlights: string[];
  credentialId?: string;
  credentialUrl?: string | null;
  imageSrc: string;
  imageAlt: string;
  sortOrder: number;
}

/** Always available — does not depend on Supabase seed. */
export const FEATURED_CERTIFICATIONS: Certification[] = [
  {
    id: "claude-code-mastery-2026",
    title: "Claude Code Mastery",
    issuer: "LWS Academy · DevExcel 2026 Cohort",
    year: 2026,
    completedOn: "May 8, 2026",
    hours: 14,
    summary:
      "Verified 14-hour advanced certification in AI-augmented development with Claude Code — MCP integrations, sub-agents, hooks, plugins, and CLI workflows for faster MERN & Next.js delivery.",
    highlights: [
      "AI-augmented development workflows with Claude Code",
      "MCP integrations connecting models to tools and APIs",
      "Sub-agent architectures for multi-step autonomous execution",
      "Hooks and plugins extending the dev pipeline",
      "CLI automation for repetitive full-stack tasks",
      "Applied to accelerate MERN Stack and Next.js delivery",
    ],
    credentialId: "cd8153d188d8291e",
    credentialUrl: null,
    imageSrc: "/assets/certificates/claude-code-mastery.png",
    imageAlt:
      "Certificate of Achievement — Claude Code Mastery for DevExcel 2026 Cohort, awarded to Zohaib Asghar",
    sortOrder: 0,
  },
];
