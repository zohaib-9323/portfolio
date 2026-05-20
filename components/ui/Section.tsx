"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionVariant = "default" | "elevated" | "muted";

interface SectionShellProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: SectionVariant;
  /** Show subtle dot grid + mesh orbs */
  ambient?: boolean;
}

const variantBg: Record<SectionVariant, string> = {
  default: "bg-bg-primary",
  elevated: "bg-bg-secondary/80",
  muted: "bg-bg-primary",
};

export function SectionShell({
  id,
  children,
  className,
  variant = "default",
  ambient = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate scroll-mt-24 overflow-hidden py-28 md:py-36",
        variantBg[variant],
        className
      )}
    >
      {ambient && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 section-mesh" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.25]"
            style={{
              backgroundImage:
                "radial-gradient(var(--border-muted) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden
          />
        </>
      )}
      <div className="section-container relative z-10">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-14 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-caption font-semibold uppercase tracking-[0.22em] text-text-muted">
          {eyebrow}
        </p>
      )}
      <h2 className="mb-5 text-balance font-bold text-heading-xl text-text-primary">
        <span className="gradient-text-static">{title}</span>
      </h2>
      {description && (
        <p className="text-body text-pretty text-text-secondary">{description}</p>
      )}
    </motion.header>
  );
}

export function SectionLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}
