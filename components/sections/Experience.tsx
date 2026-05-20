"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Zap,
  Users,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SectionShell, SectionHeading, SectionLoader } from "@/components/ui/Section";

interface Achievement {
  text: string;
  metric: string | null;
  icon: typeof Zap;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: Achievement[];
}

const defaultIcons = [Zap, TrendingUp, Users, Rocket, CheckCircle2];

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const { data, error } = await supabase
          .from("work_history")
          .select("*")
          .order("start_date", { ascending: false });
        if (error) throw error;
        if (data) {
          const mapped = data.map((exp: {
            role: string;
            company_name: string;
            start_date: string;
            end_date?: string;
            currently_working?: boolean;
            achievements?: string[];
          }) => {
            const start = new Date(exp.start_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            const end = exp.currently_working
              ? "Present"
              : exp.end_date
                ? new Date(exp.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "2024";

            const achievements = (exp.achievements || []).map((ach: string, idx: number) => {
              const metricMatch = ach.match(/(\d+%)/);
              const metric = metricMatch ? metricMatch[1] : null;
              const text = metric ? ach.replace(metric, "").trim() : ach;
              return {
                text,
                metric,
                icon: defaultIcons[idx % defaultIcons.length],
              };
            });

            return {
              title: exp.role,
              company: exp.company_name,
              period: `${start} – ${end}`,
              achievements,
            };
          });
          setExperiences(mapped);
        }
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, []);

  if (loading) {
    return (
      <SectionShell id="experience">
        <SectionLoader />
      </SectionShell>
    );
  }

  return (
    <SectionShell id="experience">
      <SectionHeading
        eyebrow="Career"
        title="Professional Experience"
        description="Delivering measurable impact through clean architecture and performance."
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="absolute left-6 top-0 bottom-0 hidden w-px md:block">
          <div className="h-full w-full bg-gradient-to-b from-accent via-violet-500 to-fuchsia-500 opacity-40" />
        </div>

        <div className="space-y-10 md:space-y-14">
          {experiences.map((exp, index) => (
            <motion.article
              key={`${exp.company}-${index}`}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative md:pl-20"
            >
              <div className="absolute left-3 top-8 hidden h-6 w-6 items-center justify-center rounded-full border-4 border-bg-primary bg-gradient-to-r from-accent to-violet-500 md:flex">
                <span className="h-2 w-2 rounded-full bg-white" />
              </div>

              <div className="card-interactive glass-strong p-8 md:p-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-violet-500 shadow-glow">
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-heading-md font-bold text-text-primary">
                        {exp.title}
                      </h3>
                      <p className="text-lg font-semibold text-accent">{exp.company}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 self-start rounded-xl border border-border-muted bg-bg-secondary/60 px-4 py-2 text-sm font-medium text-text-muted">
                    <Calendar className="h-4 w-4 text-accent" />
                    {exp.period}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {exp.achievements.map((achievement, idx) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.06 }}
                        className="rounded-xl border border-border-muted bg-card-bg/50 p-4 transition-colors hover:border-accent/25"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <p className="text-sm leading-relaxed text-text-secondary">
                            {achievement.text}
                            {achievement.metric && (
                              <span className="ml-2 font-bold gradient-text-static">
                                {achievement.metric}
                              </span>
                            )}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
