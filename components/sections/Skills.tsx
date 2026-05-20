"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Code, Database, Cloud, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SectionShell, SectionHeading, SectionLoader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  level: number;
}

interface Category {
  id: string;
  title: string;
  icon: typeof Code;
  skills: Skill[];
  color: string;
  description: string;
}

const categoryConfig: Record<
  string,
  { title: string; icon: typeof Code; color: string; description: string }
> = {
  frontend: {
    title: "Frontend",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    description: "Modern, responsive interfaces with React & Next.js",
  },
  backend: {
    title: "Backend",
    icon: Cloud,
    color: "from-violet-500 to-fuchsia-500",
    description: "APIs, auth, and server architecture at scale",
  },
  database: {
    title: "Database",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
    description: "Modeling, queries, and data layer optimization",
  },
  devops: {
    title: "DevOps & Tools",
    icon: Wrench,
    color: "from-amber-500 to-orange-500",
    description: "CI/CD, cloud deploys, and developer tooling",
  },
};

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("proficiency", { ascending: false });
        if (error) throw error;
        if (data) {
          const grouped = data.reduce((acc: Record<string, Skill[]>, s: { category: string; name: string; proficiency?: number }) => {
            const catId = s.category.toLowerCase();
            if (!acc[catId]) acc[catId] = [];
            acc[catId].push({ name: s.name, level: s.proficiency || 0 });
            return acc;
          }, {});

          const categories: Category[] = Object.keys(grouped)
            .map((catId) => {
              const config = categoryConfig[catId] || {
                title: catId.charAt(0).toUpperCase() + catId.slice(1),
                icon: Code,
                color: "from-slate-500 to-zinc-500",
                description: "Technical skills and proficiencies",
              };
              return { id: catId, ...config, skills: grouped[catId] };
            })
            .sort((a, b) => {
              const order = ["frontend", "backend", "database", "devops"];
              return order.indexOf(a.id) - order.indexOf(b.id);
            });

          setSkillCategories(categories);
          if (categories.length > 0) setActiveTab(categories[0].id);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <SectionShell id="skills" variant="elevated">
        <SectionLoader />
      </SectionShell>
    );
  }

  const activeCategory =
    skillCategories.find((cat) => cat.id === activeTab) || skillCategories[0];

  return (
    <SectionShell id="skills" variant="elevated">
      <SectionHeading
        eyebrow="Expertise"
        title="Skills & Technologies"
        description="The stack I use to ship fast, secure, and maintainable products."
      />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {skillCategories.map((category) => {
          const Icon = category.icon;
          const isActive = activeTab === category.id;
          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "text-black" : "text-text-muted hover:text-text-secondary"
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isActive && (
                <motion.div
                  layoutId="skillTab"
                    className="surface-amber absolute inset-0 rounded-full shadow-glow"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
                <Icon className={cn("relative z-10 h-4 w-4", isActive && "text-black")} />
              <span className="relative z-10">{category.title}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-4xl"
          >
            <div className="shimmer-border glass-strong rounded-3xl p-8 md:p-12">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r shadow-glow",
                    activeCategory.color
                  )}
                >
                  <activeCategory.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-heading-md font-bold text-text-primary">
                    {activeCategory.title}
                  </h3>
                  <p className="text-text-secondary">{activeCategory.description}</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {activeCategory.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-text-primary">{skill.name}</span>
                      <span className="font-mono text-caption text-text-muted">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.9, delay: index * 0.06, ease: "easeOut" }}
                        className={cn("h-full rounded-full bg-gradient-to-r", activeCategory.color)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
