"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, BadgeCheck, Calendar, Clock, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FEATURED_CERTIFICATIONS,
  type Certification,
} from "@/lib/certifications-data";
import { SectionShell, SectionHeading, SectionLoader } from "@/components/ui/Section";

interface CertificationRow {
  id: string;
  title: string;
  issuer: string | null;
  year: number | null;
  summary: string | null;
  highlights: string[] | null;
  credential_url: string | null;
  sort_order: number | null;
}

function rowToCert(row: CertificationRow): Certification | null {
  const featured = FEATURED_CERTIFICATIONS.find(
    (c) => c.title.toLowerCase() === row.title.toLowerCase()
  );
  if (featured) return featured;

  if (!row.title) return null;
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer ?? "Verified issuer",
    year: row.year ?? new Date().getFullYear(),
    summary: row.summary ?? "",
    highlights: row.highlights ?? [],
    credentialUrl: row.credential_url,
    imageSrc: "/assets/certificates/claude-code-mastery.png",
    imageAlt: `${row.title} certificate`,
    sortOrder: row.sort_order ?? 99,
  };
}

function CertificationCard({ cert, index }: { cert: Certification; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="overflow-hidden rounded-3xl border-2 border-card-border bg-card-bg shadow-brutal"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(280px,1fr)_1.15fr]">
        {/* Certificate image */}
        <div className="relative border-b-2 border-card-border bg-bg-tertiary/40 p-6 lg:border-b-0 lg:border-r-2">
          <div className="mb-4 flex items-center gap-2 text-caption font-semibold uppercase tracking-widest text-accent">
            <BadgeCheck className="h-4 w-4" />
            Verified credential
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-card-border bg-bg-primary shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-brutal">
            <Image
              src={cert.imageSrc}
              alt={cert.imageAlt}
              fill
              className="object-contain p-2"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority={index === 0}
            />
          </div>
          {cert.credentialId && (
            <p className="mt-4 font-mono text-caption text-text-muted">
              ID:{" "}
              <span className="text-text-secondary">{cert.credentialId}</span>
            </p>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col p-8 md:p-10">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber text-black shadow-brutal">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-heading-md font-bold text-text-primary">
                  {cert.title}
                </h3>
                <p className="mt-1 font-semibold text-accent">{cert.issuer}</p>
              </div>
            </div>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-card-border bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent hover:text-accent"
              >
                Verify online
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {cert.completedOn && (
              <span className="inline-flex items-center gap-2 rounded-lg border border-border-muted bg-bg-secondary/80 px-3 py-1.5 text-caption font-medium text-text-secondary">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                Completed {cert.completedOn}
              </span>
            )}
            {cert.hours != null && (
              <span className="inline-flex items-center gap-2 rounded-lg border border-border-muted bg-bg-secondary/80 px-3 py-1.5 text-caption font-medium text-text-secondary">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {cert.hours} hours
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-caption font-semibold text-accent">
              {cert.year} Cohort
            </span>
          </div>

          <p className="mb-8 leading-relaxed text-text-secondary">{cert.summary}</p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {cert.highlights.map((line, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border-muted bg-bg-secondary/50 px-4 py-3 text-sm text-text-secondary"
              >
                <span className="mt-0.5 shrink-0 font-bold text-accent">▸</span>
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

export default function Certificates() {
  const [remoteItems, setRemoteItems] = useState<CertificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const { data, error } = await supabase
          .from("certifications")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("year", { ascending: false });
        if (error) {
          // Missing table (404) — use FEATURED_CERTIFICATIONS only
          const code = (error as { code?: string }).code;
          const missingTable =
            code === "PGRST205" ||
            code === "42P01" ||
            error.message?.includes("certifications") ||
            error.message?.includes("does not exist");
          if (!missingTable) throw error;
          return;
        }
        if (data) {
          const normalized = (data as CertificationRow[]).map((row) => ({
            ...row,
            highlights: Array.isArray(row.highlights)
              ? (row.highlights as unknown[]).filter(
                  (x): x is string => typeof x === "string"
                )
              : null,
          }));
          setRemoteItems(normalized);
        }
      } catch (e) {
        console.error("Error fetching certifications:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCertifications();
  }, []);

  const certifications = useMemo(() => {
    const merged = new Map<string, Certification>();

    for (const featured of FEATURED_CERTIFICATIONS) {
      merged.set(featured.id, featured);
    }

    for (const row of remoteItems) {
      const cert = rowToCert(row);
      if (!cert) continue;
      const existing = Array.from(merged.values()).find(
        (c) => c.title.toLowerCase() === cert.title.toLowerCase()
      );
      if (existing) {
        merged.set(existing.id, {
          ...existing,
          summary: cert.summary || existing.summary,
          highlights:
            cert.highlights.length > 0 ? cert.highlights : existing.highlights,
          credentialUrl: cert.credentialUrl ?? existing.credentialUrl,
        });
      } else {
        merged.set(cert.id, cert);
      }
    }

    return Array.from(merged.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [remoteItems]);

  if (loading) {
    return (
      <SectionShell id="certifications" variant="elevated">
        <SectionLoader />
      </SectionShell>
    );
  }

  return (
    <SectionShell id="certifications" variant="elevated">
      <SectionHeading
        eyebrow="Credentials"
        title="Certifications"
        description="Verified learning that strengthens AI-augmented full-stack delivery."
      />

      <div className="mx-auto max-w-6xl space-y-10">
        {certifications.map((cert, index) => (
          <CertificationCard key={cert.id} cert={cert} index={index} />
        ))}
      </div>
    </SectionShell>
  );
}
