"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Code, Database, Cloud, Wrench, Brain, Plug } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SectionShell, SectionHeading, SectionLoader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { SKILL_CATEGORIES } from "@/lib/resume-data";

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
  ai: {
    title: "AI Engineering",
    icon: Brain,
    color: "from-fuchsia-500 to-violet-500",
    description: "LLM integrations, RAG, and agentic workflows that run in production",
  },
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
  integrations: {
    title: "Integrations & AI Tools",
    icon: Plug,
    color: "from-sky-500 to-indigo-500",
    description: "Billing, accounting, and the AI tools I ship with daily",
  },
};

const CATEGORY_ORDER = ["ai", "backend", "frontend", "database", "devops", "integrations"];

function buildCategories(grouped: Record<string, Skill[]>): Category[] {
  return Object.keys(grouped)
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
      const ai = CATEGORY_ORDER.indexOf(a.id);
      const bi = CATEGORY_ORDER.indexOf(b.id);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

/** Resume snapshot used when Supabase is unavailable or empty */
const FALLBACK_GROUPED: Record<string, Skill[]> = Object.fromEntries(
  SKILL_CATEGORIES.map((c) => [c.id, c.skills.map((name) => ({ name, level: 0 }))])
);

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

          const categories =
            Object.keys(grouped).length > 0
              ? buildCategories(grouped)
              : buildCategories(FALLBACK_GROUPED);

          setSkillCategories(categories);
          if (categories.length > 0) setActiveTab(categories[0].id);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        const categories = buildCategories(FALLBACK_GROUPED);
        setSkillCategories(categories);
        setActiveTab(categories[0].id);
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
        description="From LLMs and RAG to the MERN stack underneath — the tools I use to ship AI products that hold up in production."
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

              <ul className="flex flex-wrap gap-3">
                {activeCategory.skills.map((skill, index) => (
                  <motion.li
                    key={skill.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-xl border border-border-muted bg-card-bg/70 px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {skill.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
