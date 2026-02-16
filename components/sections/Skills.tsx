"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Code, Database, Cloud, Wrench } from "lucide-react";
import { useState } from "react";

const skillCategories = [
  {
    id: "frontend",
    title: "Frontend",
    icon: Code,
    skills: [
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 88 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Bootstrap", level: 80 },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 90 },
    ],
    color: "from-blue-500 to-cyan-500",
    description: "Building modern, responsive user interfaces",
  },
  {
    id: "backend",
    title: "Backend",
    icon: Cloud,
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 85 },
      { name: "NestJS", level: 80 },
      { name: "RESTful APIs", level: 90 },
      { name: "Secure Authentication", level: 87 },
    ],
    color: "from-purple-500 to-pink-500",
    description: "Scalable server-side architecture and APIs",
  },
  {
    id: "database",
    title: "Database",
    icon: Database,
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "Mongoose", level: 88 },
      { name: "Supabase", level: 80 },
      { name: "Firebase", level: 82 },
    ],
    color: "from-green-500 to-emerald-500",
    description: "Data modeling and database optimization",
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    icon: Wrench,
    skills: [
      { name: "Docker", level: 80 },
      { name: "AWS (EC2, S3)", level: 75 },
      { name: "GitHub Actions", level: 85 },
      { name: "Vercel", level: 90 },
      { name: "Stripe Integration", level: 88 },
    ],
    color: "from-orange-500 to-red-500",
    description: "Deployment, CI/CD, and cloud infrastructure",
  },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState(skillCategories[0].id);

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
        </AnimatePresence>
      </div>
    </section>
  );
}
