"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  Sparkles,
  Code2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { SectionShell, SectionHeading, SectionLoader } from "@/components/ui/Section";
import { FALLBACK_PROJECTS, type ProjectShowcase } from "@/lib/projects-data";
import {
  projectDedupeKey,
  shouldReplaceProjectRow,
} from "@/lib/project-preview-images";
import {
  isRemoteImageSrc,
  resolveProjectCardPreview,
  resolveShowcasePreviewImage,
} from "@/lib/resolve-project-image-url";

const gradients = [
  "from-violet-500/25 via-fuchsia-500/10 to-transparent",
  "from-cyan-500/20 via-blue-500/10 to-transparent",
  "from-emerald-500/20 via-teal-500/10 to-transparent",
  "from-amber-500/20 via-orange-500/10 to-transparent",
  "from-rose-500/20 via-pink-500/10 to-transparent",
  "from-indigo-500/25 via-blue-500/10 to-transparent",
];

type ProjectCard = ProjectShowcase & { gradient: string };

function normalizeTech(meta: unknown, techStack: unknown): string[] {
  let fromMeta: string[] = [];
  if (meta && typeof meta === "object") {
    const m = meta as { stack?: unknown; technologies?: unknown; tags?: unknown };
    const raw = m.stack ?? m.technologies ?? m.tags;
    fromMeta = normalizeTechValue(raw);
  }
  if (fromMeta.length) return fromMeta.slice(0, 12);
  return normalizeTechValue(techStack).slice(0, 12);
}

function normalizeTechValue(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") {
    return v
      .split(/[,;]|(?:\s+•\s+)/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function mapSupabaseRow(p: Record<string, unknown>, index: number): ProjectCard {
  const title = String(p.title ?? "Untitled");
  const isLandingPage = title.toLowerCase().includes("landing page");
  const tech = normalizeTech(p.tech_stack_meta, p.tech_stack);
  const fallbackTech =
    tech.length > 0 ? tech : ["TypeScript", "React", "Next.js", "Node.js"];

  const liveLink = isLandingPage ? null : (p.project_link as string | null) ?? null;
  const landingLink = isLandingPage ? (p.project_link as string | null) ?? null : null;

  return {
    title,
    description: String(
      p.short_description ?? p.description ?? "Professional full-stack delivery."
    ),
    liveLink,
    landingLink,
    githubLink: (p.repo_link as string | null) ?? null,
    tech: fallbackTech,
    featured: Boolean(p.is_featured ?? p.featured),
    image: resolveProjectCardPreview(p, liveLink, landingLink),
    gradient: gradients[index % gradients.length],
  };
}

function dedupeProjectCards(cards: ProjectCard[]): ProjectCard[] {
  const byKey = new Map<string, ProjectCard>();
  for (const card of cards) {
    const key = projectDedupeKey(card.title);
    const existing = byKey.get(key);
    if (
      !existing ||
      shouldReplaceProjectRow(
        {
          title: card.title,
          featured: card.featured,
          liveLink: card.liveLink,
        },
        {
          title: existing.title,
          featured: existing.featured,
          liveLink: existing.liveLink,
        }
      )
    ) {
      byKey.set(key, card);
    }
  }
  return Array.from(byKey.values());
}

function mergeShowcaseIntoCard(
  p: ProjectShowcase,
  index: number
): ProjectCard {
  const tech =
    p.tech.length > 0 ? p.tech : ["TypeScript", "React", "Next.js", "Node.js"];
  return {
    ...p,
    image: resolveShowcasePreviewImage(p),
    tech,
    gradient: gradients[index % gradients.length],
  };
}

function shouldUseNativeImgForPreview(src: string): boolean {
  // Local PNGs are large; next/image optimizer often fails (text/html or ResponseAborted)
  return (
    isRemoteImageSrc(src) ||
    src.startsWith("/api/project-preview?") ||
    src.startsWith("/assets/")
  );
}

function ProjectPreviewPlaceholder({ title }: { title: string }) {
  return (
    <div className="relative flex min-h-[200px] w-full flex-1 flex-col items-center justify-center bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-primary p-8 lg:min-h-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-glow),transparent_60%)] opacity-50" />
      <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-border-muted bg-card-bg/80 text-2xl font-bold text-accent shadow-medium">
        {title.slice(0, 1).toUpperCase()}
      </div>
      <p className="relative text-center text-caption font-medium text-text-muted">
        Preview · add a full URL or storage path in `image_url`
      </p>
      <Code2 className="relative mt-4 h-5 w-5 text-text-muted opacity-60" />
    </div>
  );
}

function ProjectPreviewMedia({
  title,
  image,
}: {
  title: string;
  image: string | null;
}) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return <ProjectPreviewPlaceholder title={title} />;
  }

  if (shouldUseNativeImgForPreview(image)) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote URLs + dynamic /api project preview: avoid next/image optimizer issues */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
          referrerPolicy={image.startsWith("/api/project-preview") ? undefined : "no-referrer"}
          onError={() => setFailed(true)}
        />
      </>
    );
  }

  return (
    <Image
      src={image}
      alt={title}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover transition duration-700 group-hover:scale-[1.03]"
      onError={() => setFailed(true)}
    />
  );
}

function ProjectSkeleton() {
  return (
    <div className="rounded-3xl border border-border-muted bg-card-bg/30 p-8 backdrop-blur-xl animate-pulse">
      <div className="mb-6 h-6 w-2/3 rounded-lg bg-bg-tertiary" />
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full rounded bg-bg-tertiary" />
        <div className="h-4 w-5/6 rounded bg-bg-tertiary" />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-16 rounded-full bg-bg-tertiary" />
        ))}
      </div>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-bg-tertiary" />
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromFallback, setFromFallback] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (error) {
          console.warn("[Projects] Supabase error, using resume snapshot:", error.message);
          setProjects(dedupeProjectCards(FALLBACK_PROJECTS.map(mergeShowcaseIntoCard)));
          setFromFallback(true);
          return;
        }

        if (data && data.length > 0) {
          const mapped = data.map((row, index) =>
            mapSupabaseRow(row as Record<string, unknown>, index)
          );
          setProjects(dedupeProjectCards(mapped));
          setFromFallback(false);
          return;
        }

        setProjects(dedupeProjectCards(FALLBACK_PROJECTS.map(mergeShowcaseIntoCard)));
        setFromFallback(true);
      } catch (e) {
        console.warn("[Projects] Fetch failed, using resume snapshot:", e);
        if (!cancelled) {
          setProjects(dedupeProjectCards(FALLBACK_PROJECTS.map(mergeShowcaseIntoCard)));
          setFromFallback(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...projects].sort(
      (a, b) => Number(b.featured) - Number(a.featured)
    );
  }, [projects]);

  if (loading) {
    return (
      <SectionShell id="projects">
        <div className="mb-12 h-24 animate-pulse rounded-2xl bg-bg-tertiary" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProjectSkeleton />
          <ProjectSkeleton />
        </div>
        <div className="mt-12 flex justify-center">
          <SectionLoader />
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id="projects">
      <div className="relative">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects that ship"
          description="Production-focused builds across AI tooling, admin platforms, and NestJS APIs — performance, clarity, and maintainability first."
        />
        {fromFallback && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="-mt-8 mb-12 mx-auto flex max-w-xl flex-wrap items-center justify-center gap-2 rounded-full border border-border-muted bg-bg-secondary/60 px-4 py-2 text-center text-caption text-text-muted backdrop-blur-md"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
            Live snapshot — connect Supabase to sync dynamic projects.
          </motion.p>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {sorted.map((project, index) => (
            <motion.article
              key={projectDedupeKey(project.title)}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <div
                className={`
                  card-interactive relative h-full overflow-hidden rounded-3xl
                  bg-card-bg/60 p-7 backdrop-blur-md
                  ${hoveredIndex === index ? "!border-accent/35 shadow-glow" : ""}
                `}
              >
                {/* Hover wash */}
                <div
                  className={`
                    pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${project.gradient}
                    opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100
                  `}
                />

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      {project.featured && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-caption font-medium text-accent">
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          Featured
                        </span>
                      )}
                      <h3 className="text-balance font-bold text-heading-md text-text-primary">
                        {project.title}
                      </h3>
                    </div>
                    <motion.div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-muted bg-bg-elevated/80"
                      whileHover={{ rotate: 40, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    >
                      <ArrowUpRight className="h-5 w-5 text-accent" />
                    </motion.div>
                  </div>

                  <p className="mb-6 text-pretty leading-relaxed text-text-secondary line-clamp-4 md:line-clamp-none">
                    {project.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-border-muted bg-bg-tertiary/80 px-2.5 py-1 text-caption font-medium text-text-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3">
                    {project.liveLink && (
                      <motion.a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live demo
                      </motion.a>
                    )}
                    {project.landingLink && (
                      <motion.a
                        href={project.landingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Landing
                      </motion.a>
                    )}
                    {project.githubLink && (
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="h-4 w-4" />
                        Code
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="relative z-10 mt-8 aspect-video overflow-hidden rounded-2xl border border-border-muted bg-bg-secondary/40">
                  <ProjectPreviewMedia title={project.title} image={project.image} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-16 flex justify-center"
        >
          <motion.a
            href="https://github.com/zohaib-9323"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="h-5 w-5" />
            More on GitHub
          </motion.a>
        </motion.div>
      </div>
    </SectionShell>
  );
}
