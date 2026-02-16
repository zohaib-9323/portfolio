"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, TrendingUp, Zap, Users, Rocket, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Achievement {
  text: string;
  metric: string | null;
  icon: any;
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
          const mapped = data.map((exp: any) => {
            const start = new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const end = exp.currently_working ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2024');

            const achievements = (exp.achievements || []).map((ach: string, idx: number) => {
              // Try to find a metric (percentage)
              const metricMatch = ach.match(/(\d+%)/);
              const metric = metricMatch ? metricMatch[1] : null;
              const text = metric ? ach.replace(metric, '').trim() : ach;

              return {
                text,
                metric,
                icon: defaultIcons[idx % defaultIcons.length]
              };
            });

            return {
              title: exp.role,
              company: exp.company_name,
              period: `${start} – ${end}`,
              achievements
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
      <section id="experience" className="py-32 md:py-40 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="relative py-32 md:py-40 bg-neutral-50 dark:bg-neutral-950 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-heading-xl font-bold mb-6">
            <span className="gradient-text-static">Professional Experience</span>
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Building scalable solutions and driving measurable results
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Glowing Timeline Line */}
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-50" />
            </div>

            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative mb-16 md:mb-20 pl-0 md:pl-24"
              >
                {/* Glowing Timeline Dot */}
                <div className="absolute left-4 md:left-8 top-6 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-4 border-neutral-50 dark:border-neutral-950 z-10 hidden md:flex items-center justify-center shadow-glow-lg">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                <motion.div
                  className="glass-strong rounded-2xl p-8 md:p-10 hover:scale-[1.01] transition-all duration-300 glow-effect"
                  whileHover={{ y: -4 }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-glow">
                        <Briefcase className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-md font-bold mb-2 gradient-text-static">
                          {exp.title}
                        </h3>
                        <h4 className="text-lg font-semibold text-accent">
                          {exp.company}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 glass px-4 py-2 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Achievements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exp.achievements.map((achievement, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="glass rounded-xl p-4 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {achievement.icon && (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <achievement.icon className="w-5 h-5 text-accent" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                              {achievement.text}
                              {achievement.metric && (
                                <span className="ml-2 font-bold text-lg gradient-text-static">
                                  {achievement.metric}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
