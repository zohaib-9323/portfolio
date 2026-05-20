"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Github,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/Badge";
import { SectionLoader } from "@/components/ui/Section";
import { Typewriter } from "@/components/ui/Typewriter";
import { heroTagline } from "@/lib/bio";

interface PersonalData {
  display_name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  social_links: {
    github?: string;
    linkedin?: string;
  };
  metadata: {
    location?: string;
    availability?: string;
  };
}

const rotatingLines = [
  "Scalable AI-driven web apps",
  "MERN & Next.js production systems",
  "Performance-first architecture",
  "Secure, cloud-ready delivery",
];

const quickStats = [
  { value: "2+", label: "Years experience" },
  { value: "10+", label: "Projects shipped" },
  { value: "4", label: "Core stacks" },
];

export default function Hero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [headlineDone, setHeadlineDone] = useState(false);
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const { data, error } = await supabase
          .from("personal_data")
          .select("*")
          .single();
        if (error) throw error;
        if (data) setData(data);
      } catch (error) {
        console.error("Error fetching personal data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPersonalData();
  }, []);

  useEffect(() => {
    if (!headlineDone) return;
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % rotatingLines.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [headlineDone]);

  const firstName = useMemo(
    () => (data?.display_name || "Zohaib Asghar").split(" ")[0],
    [data?.display_name]
  );

  const headlineSegments = useMemo(
    () => [
      { text: "Hi, I'm ", className: "text-text-primary" },
      { text: firstName, className: "gradient-text-static" },
      { text: "\n— I craft ", className: "text-text-primary" },
      { text: "digital products", className: "text-highlight" },
      { text: " that scale.", className: "text-text-primary" },
    ],
    [firstName]
  );

  if (loading) {
    return (
      <section
        id="about"
        className="flex min-h-screen items-center justify-center bg-bg-primary pt-20"
      >
        <SectionLoader />
      </section>
    );
  }

  const availability = data?.metadata?.availability || "Open to opportunities";

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16 md:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 grid-background opacity-30" />
      <div className="pointer-events-none absolute inset-0 hero-spotlight" />

      {/* Animated glow ring behind headline */}
      <div className="pointer-events-none absolute left-1/2 top-[36%] -z-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 md:h-64 md:w-64">
        <div className="hero-glow-ring h-full w-full" />
      </div>

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Badge variant="accent">
              <span className="eyebrow-dot animate-pulse" />
              {availability}
            </Badge>
            <Badge>{data?.metadata?.location || "Lahore, Pakistan"}</Badge>
          </motion.div>

          <h1 className="min-h-[2.2em] text-center text-balance font-bold text-display-xl md:min-h-[2.6em]">
            <Typewriter
              segments={headlineSegments}
              speed={38}
              linePause={400}
              lineClassName="leading-[1.1]"
              onComplete={() => setHeadlineDone(true)}
            />
          </h1>

          <AnimatePresence>
            {headlineDone && (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="mx-auto mt-6 max-w-xl text-center text-heading-sm font-medium text-text-secondary"
                >
                  {data?.role || "Full Stack MERN Developer"}
                </motion.p>

                <div className="relative mx-auto mt-4 flex h-10 max-w-lg items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={lineIndex}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.35 }}
                      className="text-center text-body font-medium text-highlight"
                    >
                      {rotatingLines[lineIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="mx-auto mt-6 max-w-lg text-center text-body text-text-muted"
                >
                  {heroTagline(data?.bio)}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mt-3 text-center"
                >
                  <a
                    href="#about-detail"
                    className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                  >
                    Read full story →
                  </a>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <motion.a
                    href="#contact"
                    className="btn-primary inline-flex items-center gap-2 group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail className="h-5 w-5" />
                    Let&apos;s work together
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.a>
                  <motion.a
                    href={
                      data?.social_links?.github || "https://github.com/zohaib-9323"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="h-5 w-5" />
                    View GitHub
                  </motion.a>
                  <motion.a
                    href="#projects"
                    className="inline-flex items-center gap-2 rounded-xl border border-border-muted bg-card-bg/80 px-6 py-3 text-sm font-semibold text-text-primary backdrop-blur-md transition hover:border-accent/40 hover:text-accent"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="h-4 w-4 text-accent" />
                    Featured work
                  </motion.a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.22 }}
                    className="bento-cell col-span-2 row-span-2 flex flex-col justify-center p-6 md:p-8"
                  >
                    <p className="font-mono text-caption font-bold uppercase tracking-widest text-text-muted">
                      Experience
                    </p>
                    <p className="mt-2 text-5xl font-black leading-none text-text-primary md:text-6xl">
                      {quickStats[0].value}
                    </p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-wide text-text-secondary">
                      {quickStats[0].label}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.28 }}
                    className="bento-cell flex flex-col justify-center p-5"
                  >
                    <p className="text-4xl font-black text-text-primary">
                      {quickStats[1].value}
                    </p>
                    <p className="mt-2 text-caption font-bold uppercase tracking-wide text-text-muted">
                      {quickStats[1].label}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.32 }}
                    className="bento-cell-accent flex flex-col justify-center p-5"
                  >
                    <p className="text-4xl font-black">{quickStats[2].value}</p>
                    <p className="mt-2 text-caption font-bold uppercase tracking-wide opacity-90">
                      {quickStats[2].label}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.36 }}
                    className="bento-cell col-span-2 flex items-center justify-center p-4 md:col-span-2"
                  >
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text-muted md:text-sm">
                      MERN · Next.js · TypeScript · NestJS
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-10 flex flex-wrap items-center justify-center gap-6 text-caption text-text-muted"
                >
                  {data?.metadata?.location && (
                    <a
                      href={`https://maps.google.com/?q=${data.metadata.location}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                    >
                      <MapPin className="h-4 w-4" />
                      {data.metadata.location}
                    </a>
                  )}
                  {data?.email && (
                    <a
                      href={`mailto:${data.email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                    >
                      <Mail className="h-4 w-4" />
                      {data.email}
                    </a>
                  )}
                  {data?.phone && (
                    <a
                      href={`tel:${data.phone}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                    >
                      <Phone className="h-4 w-4" />
                      {data.phone}
                    </a>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: headlineDone ? 1 : 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-text-muted"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-border-strong p-2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-amber"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
