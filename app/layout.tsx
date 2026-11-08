import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: "Zohaib Asghar | MERN Stack + AI Engineer",
  description:
    "MERN Stack + AI Engineer with nearly 3 years of experience building full-stack apps and production AI: LLM integrations (Claude API, OpenRouter, Vertex AI), RAG pipelines, and agentic workflows with MCP.",
  keywords: ["AI Engineer", "LLM Integration", "RAG", "Agentic AI", "MCP", "Full Stack Developer", "MERN Stack", "NestJS", "Next.js", "TypeScript"],
  authors: [{ name: "Zohaib Asghar" }],
  openGraph: {
    title: "Zohaib Asghar | MERN Stack + AI Engineer",
    description: "Full-stack engineer building LLM integrations, RAG pipelines, and agentic AI workflows",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EEE3" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

// Runs before first paint so the saved / system theme never flashes the wrong colours.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add("light")}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="grain min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
