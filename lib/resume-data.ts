/**
 * Source of truth for profile, skills, and experience — mirrors the latest resume
 * ("MERN Stack + AI Engineer", 2026). Sections render from here so the site stays
 * correct even when Supabase is paused or holds older rows.
 * Keep scripts/seed-resume-ai-2026.sql in sync so the chatbot RAG matches.
 */

export const PROFILE = {
  displayName: "Zohaib Asghar",
  role: "MERN Stack + AI Engineer",
  tagline:
    "Full-stack engineer building production AI: LLM integrations, RAG pipelines, and agentic workflows on the MERN stack.",
  email: "mzohaib0677@gmail.com",
  phone: "+923229911442",
  location: "Lahore, Punjab, Pakistan",
  availability: "Open to AI & full-stack roles",
  github: "https://github.com/zohaib-9323",
  bio: [
    "MERN Stack + AI Engineer with nearly 3 years of experience building full-stack applications with MongoDB, Express.js, React, Node.js, NestJS, and Next.js — and a focus on AI engineering for the last year.",
    "I build AI features that run in production: a RAG knowledge base (chunking, embeddings, semantic search) with admin tools for guidance prompts, knowledge testing, publishing, and version history; a chatbot SaaS backend that stays up when model calls are slow or fail; and a Google Vertex AI request queue built on BullMQ and Redis.",
    "I integrate LLMs through the Claude API, OpenRouter, and Vertex AI with structured JSON outputs, and I work AI-natively every day with Claude Code, Cursor, and Codex — including MCP integrations and sub-agent workflows.",
    "Underneath the AI is solid engineering: multi-tenant SaaS security (30+ JWT-secured and 25+ RBAC-protected endpoints), Redis caching that cut API response times by ~35%, and CI/CD with GitHub Actions, Docker, and AWS that made deployments ~50% faster.",
  ],
  focus: [
    "LLM Integration",
    "RAG Pipelines",
    "Agentic AI & MCP",
    "MERN Stack",
    "NestJS",
    "Next.js",
    "Multi-Tenant SaaS",
  ],
};

export const HERO_STATS = {
  years: "3",
  aiProducts: "3",
  endpoints: "55+",
  stackLine: "MERN · NestJS · LLMs · RAG · Agentic AI",
};

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "ai",
    title: "AI Engineering",
    description: "LLM integrations, RAG, and agentic workflows that run in production",
    skills: [
      "Claude API",
      "OpenRouter",
      "Google Vertex AI",
      "LLM APIs",
      "Prompt Engineering",
      "LLM Structured JSON Outputs",
      "Model Context Protocol (MCP)",
      "Agentic Workflows & Sub-agents",
      "RAG Pipelines",
      "Semantic Search",
      "Embeddings",
      "Document Chunking",
      "Vector Databases",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "APIs, queues, auth, and multi-tenant architecture",
    skills: [
      "Node.js",
      "NestJS",
      "Express.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "REST APIs",
      "WebSockets",
      "Swagger/OpenAPI",
      "BullMQ",
      "JWT Authentication",
      "RBAC",
      "Multi-Tenant Architecture",
      "Scalable Application Architecture",
      "SOLID Principles",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "Responsive React and Next.js interfaces",
    skills: [
      "React",
      "Next.js",
      "Redux Toolkit",
      "Zustand",
      "Tailwind CSS",
      "Material UI",
      "Storybook",
      "Responsive Design",
      "HTML5",
      "CSS3",
    ],
  },
  {
    id: "database",
    title: "Data",
    description: "Data modeling, caching, and query performance",
    skills: ["MongoDB", "Mongoose", "Prisma", "Redis", "Firebase"],
  },
  {
    id: "devops",
    title: "Cloud & DevOps",
    description: "CI/CD, containers, cloud deploys, and security scanning",
    skills: [
      "AWS (EC2, S3)",
      "Docker",
      "GitHub Actions",
      "CI/CD Pipelines",
      "Trivy",
      "Git",
      "GitHub",
      "Agile/Scrum",
    ],
  },
  {
    id: "integrations",
    title: "Integrations & AI Tools",
    description: "Billing, accounting, and the AI tools I ship with daily",
    skills: [
      "Stripe",
      "QuickBooks",
      "Xero",
      "Claude Code",
      "Cursor",
      "Codex",
      "Copilot",
    ],
  },
];

export interface WorkExperience {
  role: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

export const EXPERIENCE: WorkExperience[] = [
  {
    role: "Full Stack Developer / Software Engineer",
    company: "DevExcelIT Solutions",
    location: "Lahore, Pakistan",
    period: "Sep 2024 – Present",
    achievements: [
      "Integrated third-party LLM APIs and Stripe billing — the server handles timeouts and failed model calls so slow AI responses never leave users waiting.",
      "Built a complete RAG system for Trade Harmonizer in one week: document chunking, embeddings, and semantic search feeding the LLM, plus a BullMQ + Redis queue for Google Vertex AI requests.",
      "Wrote 30+ JWT-secured and 25+ RBAC-protected REST endpoints used by the frontend team.",
      "Added Redis caching to slow MongoDB/Mongoose endpoints, cutting average response time by 35%.",
      "Set up CI/CD with GitHub Actions, Docker, and AWS — deployments are now 50% faster.",
      "Build React, Next.js, and TypeScript frontends with React Hooks, reusable components, and Redux Toolkit.",
    ],
  },
  {
    role: "Associate Software Engineer",
    company: "AOT Solutions (Pvt) Ltd",
    location: "Lahore, Pakistan",
    period: "Jan 2024 – Aug 2024",
    achievements: [
      "Built web applications with React, Next.js, Node.js, Express.js, and MongoDB — UI screens, REST APIs, and the wiring between them.",
      "Fixed bugs and technical issues in existing codebases and worked with the team to deliver each project.",
    ],
  },
];

export const EDUCATION = {
  school: "Minhaj University, Lahore",
  degree: "BS Computer Software Engineering",
  period: "Nov 2021 – Jun 2025",
  cgpa: "3.66 / 4.00",
};
