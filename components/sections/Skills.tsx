"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Code, Database, Cloud, Wrench, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Skill {
  name: string;
  level: number;
}

interface Category {
  id: string;
  title: string;
  icon: any;
  skills: Skill[];
  color: string;
  description: string;
}

const categoryConfig: Record<string, { title: string; icon: any; color: string; description: string }> = {
  frontend: {
    title: "Frontend",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    description: "Building modern, responsive user interfaces",
  },
  backend: {
    title: "Backend",
    icon: Cloud,
    color: "from-purple-500 to-pink-500",
    description: "Scalable server-side architecture and APIs",
  },
  database: {
    title: "Database",
    icon: Database,
    color: "from-green-500 to-emerald-500",
    description: "Data modeling and database optimization",
  },
  devops: {
    title: "DevOps & Tools",
    icon: Wrench,
    color: "from-orange-500 to-red-500",
    description: "Deployment, CI/CD, and cloud infrastructure",
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
          const grouped = data.reduce((acc: Record<string, Skill[]>, s: any) => {
            const catId = s.category.toLowerCase();
            if (!acc[catId]) acc[catId] = [];
            acc[catId].push({
              name: s.name,
              level: s.proficiency || 0,
            });
            return acc;
          }, {});

          const categories: Category[] = Object.keys(grouped).map((catId) => {
            const config = categoryConfig[catId] || {
              title: catId.charAt(0).toUpperCase() + catId.slice(1),
              icon: Code,
              color: "from-gray-500 to-slate-500",
              description: "Technical skills and proficiencies",
            };
            return {
              id: catId,
              ...config,
              skills: grouped[catId],
            };
          }).sort((a, b) => {
            const order = ["frontend", "backend", "database", "devops"];
            return order.indexOf(a.id) - order.indexOf(b.id);
          });

          setSkillCategories(categories);
          if (categories.length > 0) {
            setActiveTab(categories[0].id);
          }
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
      <section id="skills" className="py-32 md:py-40 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </section>
    );
  }

  const activeCategory = skillCategories.find((cat) => cat.id === activeTab) || skillCategories[0];

  return (
    <section
      id="skills"
      className="relative py-32 md:py-40 bg-neutral-50 dark:bg-neutral-950 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-heading-xl font-bold mb-6">
            <span className="gradient-text-static">Skills & Technologies</span>
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Technologies I use to build scalable and performant applications
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`
                  relative px-6 py-3 rounded-lg font-medium text-sm
                  transition-all duration-300 flex items-center gap-2
                  ${isActive
                    ? "text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-white" : ""}`} />
                <span className="relative z-10">{category.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Category Content */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-strong rounded-2xl p-8 md:p-12">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${activeCategory.color} flex items-center justify-center shadow-glow`}
                  >
                    <activeCategory.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-md font-bold mb-1 gradient-text-static">
                      {activeCategory.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {activeCategory.description}
                    </p>
                  </div>
                </div>

                {/* Skills List with Progress */}
                <div className="space-y-6">
                  {activeCategory.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {skill.name}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${activeCategory.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
