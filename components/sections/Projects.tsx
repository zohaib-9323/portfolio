"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const projects = [
  {
    title: "Capture AI Portal",
    description:
      "AI-based platform with Stripe integration and scalable architecture. Built with modern Next.js and TypeScript for optimal performance.",
    liveLink: "https://app.cptr.ai/",
    landingLink: "https://cptr.ai/",
    githubLink: null,
    tech: ["Next.js", "TypeScript", "Stripe", "AI Integration"],
    featured: true,
    image: "/assets/capture-ai.png",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Recordo Landing Page",
    description:
      "Enterprise-grade landing page with a full-stack architecture. Optimized for high conversion and seamless user experience.",
    liveLink: null,
    landingLink: "https://recordo.ai/en/",
    githubLink: null,
    tech: ["Next.js", "Node.js", "Landing Page"],
    featured: true,
    image: "/assets/recodo-landing-page.png",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Recordo Dashboard",
    description:
      "Professional administrative dashboard featuring real-time data management, secure authentication, and an intuitive user interface.",
    liveLink: "https://admin-latest.recordo.ai/signin",
    landingLink: null,
    githubLink: null,
    tech: ["Next.js", "Tailwind CSS", "Admin Dashboard"],
    featured: true,
    image: "/assets/recodo-dashboard.png",
    gradient: "from-indigo-500/20 to-blue-500/20",
  },
  {
    title: "Recipe Generator",
    description: "AI-powered recipe generation platform with intelligent suggestions and personalized meal planning capabilities.",
    liveLink: "https://recipe-ges.vercel.app/",
    landingLink: null,
    githubLink: null,
    tech: ["Next.js", "AI", "Vercel"],
    featured: false,
    image: "/assets/recipe-gen.png",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Goldiam Crafters",
    description: "E-commerce solution with optimized UI and scalable backend. Delivering seamless shopping experiences with modern architecture.",
    liveLink: "https://goldiamcrafters.com/",
    landingLink: null,
    githubLink: null,
    tech: ["E-commerce", "Next.js", "Scalable Backend"],
    featured: true,
    image: "/assets/goldium-crafter.png",
    gradient: "from-orange-500/20 to-red-500/20",
  },
];

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="projects"
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
            <span className="gradient-text-static">Featured Projects</span>
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Showcasing production-ready applications built with modern
            technologies and best practices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <motion.div
                className={`
                  relative h-full glass-strong rounded-2xl p-8 overflow-hidden
                  transition-all duration-500
                  ${hoveredIndex === index ? "scale-[1.02] shadow-premium-lg" : ""}
                `}
                whileHover={{ y: -4 }}
              >
                {/* Gradient Background */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${project.gradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  `}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-heading-md font-bold mb-3 gradient-text-static">
                        {project.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <motion.div
                      className="w-12 h-12 rounded-lg glass flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 45 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpRight className="w-6 h-6 text-accent" />
                    </motion.div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-medium rounded-full glass border border-neutral-200/50 dark:border-neutral-800/50 text-neutral-700 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {project.liveLink && (
                      <motion.a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </motion.a>
                    )}
                    {project.landingLink && (
                      <motion.a
                        href={project.landingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Landing Page
                      </motion.a>
                    )}
                    {project.githubLink && (
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-4 h-4" />
                        Source Code
                      </motion.a>
                    )}
                  </div>

                  {/* Preview Image */}
                  <div className="mt-8 h-64 rounded-xl bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden relative group/image">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/image:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full glass mx-auto mb-4 flex items-center justify-center">
                            <ExternalLink className="w-8 h-8 text-neutral-500" />
                          </div>
                          <p className="text-sm text-neutral-500">Project Preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://github.com/zohaib-9323"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            View All Projects on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
