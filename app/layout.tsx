import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: "Zohaib Asghar | Full Stack MERN Developer",
  description: "Results-driven Full Stack Developer with ~2 years of experience building scalable web applications using MERN Stack, Next.js, TypeScript, and secure backend integrations.",
  keywords: ["Full Stack Developer", "MERN Stack", "Next.js", "TypeScript", "React", "Node.js"],
  authors: [{ name: "Zohaib Asghar" }],
  openGraph: {
    title: "Zohaib Asghar | Full Stack MERN Developer",
    description: "Results-driven Full Stack Developer building scalable web applications",
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
