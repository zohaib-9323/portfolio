import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: "Zohaib Asghar | MERN Stack + AI Engineer",
  description: "MERN Stack + AI Engineer with nearly 3 years of experience building full-stack apps and production AI: LLM integrations (Claude API, OpenRouter, Vertex AI), RAG pipelines, and agentic workflows with MCP.",
  keywords: ["AI Engineer", "LLM Integration", "RAG", "Agentic AI", "MCP", "Full Stack Developer", "MERN Stack", "NestJS", "Next.js", "TypeScript"],
  authors: [{ name: "Zohaib Asghar" }],
  openGraph: {
    title: "Zohaib Asghar | MERN Stack + AI Engineer",
    description: "Full-stack engineer building LLM integrations, RAG pipelines, and agentic AI workflows",
    type: "website",
  },
  other: {
    "theme-color": "#0a0a0a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="min-h-screen antialiased bg-bg-primary text-text-secondary">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
