"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SectionShell, SectionHeading, SectionLoader } from "@/components/ui/Section";
import { bioParagraphs, bioHighlights } from "@/lib/bio";

export default function About() {
  const [bio, setBio] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("personal_data")
          .select("bio, role")
          .single();
        if (error) throw error;
        if (data) {
          setBio(data.bio);
          setRole(data.role);
        }
      } catch (e) {
        console.error("Error fetching about data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <SectionShell id="about-detail" variant="elevated">
        <SectionLoader />
      </SectionShell>
    );
  }

  const paragraphs = bioParagraphs(bio);
  const highlights = bioHighlights(bio);

  return (
    <SectionShell id="about-detail" variant="elevated">
      <SectionHeading
        eyebrow="About me"
        title="What I do"
        description={
          role ||
          "Building production-ready full stack applications with a focus on performance and clarity."
        }
      />

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_280px] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-8 md:p-10"
        >
          <div className="space-y-5 text-body leading-relaxed text-text-secondary">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="h-fit rounded-3xl border border-border-muted bg-card-bg p-6 lg:sticky lg:top-28"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Core focus
          </h3>
          <ul className="flex flex-wrap gap-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border-muted bg-bg-secondary/80 px-3 py-1.5 text-caption font-medium text-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </SectionShell>
  );
}
