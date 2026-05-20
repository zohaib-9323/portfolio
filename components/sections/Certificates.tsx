"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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

export default function Certificates() {
  const [items, setItems] = useState<CertificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const { data, error } = await supabase
          .from("certifications")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("year", { ascending: false });
        if (error) throw error;
        if (data) {
          const normalized = (data as CertificationRow[]).map((row) => ({
            ...row,
            highlights: Array.isArray(row.highlights)
              ? (row.highlights as unknown[]).filter(
                  (x): x is string => typeof x === "string"
                )
              : null,
          }));
          setItems(normalized);
        }
      } catch (e) {
        console.error("Error fetching certifications:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCertifications();
  }, []);

  if (loading) {
    return (
      <SectionShell id="certifications" variant="elevated">
        <SectionLoader />
      </SectionShell>
    );
  }

  if (items.length === 0) return null;

  return (
    <SectionShell id="certifications" variant="elevated">
      <SectionHeading
        eyebrow="Credentials"
        title="Certifications"
        description="Structured learning that complements hands-on delivery."
      />

      <div className="mx-auto max-w-4xl space-y-6">
        {items.map((cert, index) => (
          <motion.article
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="card-interactive glass-strong p-8 md:p-10"
          >
            <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-glow">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-heading-md font-bold text-text-primary">
                    {cert.title}
                  </h3>
                  <p className="font-semibold text-accent">
                    {[cert.issuer, cert.year != null ? String(cert.year) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-border-muted bg-bg-secondary/60 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/40"
                >
                  Verify
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {cert.summary && (
              <p className="mb-6 leading-relaxed text-text-secondary">{cert.summary}</p>
            )}

            {cert.highlights && cert.highlights.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {cert.highlights.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-border-muted bg-card-bg/40 px-4 py-3 text-sm text-text-secondary"
                  >
                    <span className="mt-0.5 text-accent">▸</span>
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
