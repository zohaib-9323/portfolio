"use client";

import { motion } from "framer-motion";
import { Code2, Zap, Shield, Layers } from "lucide-react";
import { SectionShell, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const principles = [
  {
    icon: Code2,
    title: "Clean Architecture",
    description:
      "Maintainable, scalable code with clear separation of concerns and modular design.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Performance First",
    description:
      "From database queries to UI rendering — every layer tuned for speed.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure Coding",
    description:
      "Auth, authorization, and data protection baked into every application.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Layers,
    title: "Scalability",
    description:
      "Systems that grow with demand — cloud-native patterns and solid APIs.",
    color: "from-violet-500 to-fuchsia-500",
  },
];

export default function TechPhilosophy() {
  return (
    <SectionShell>
      <SectionHeading
        eyebrow="Approach"
        title="Tech Philosophy"
        description="Principles that guide how I design, build, and ship software."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {principles.map((principle, index) => {
          const Icon = principle.icon;
          return (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group"
            >
              <motion.div
                className="card-interactive glass-strong h-full p-8 md:p-10"
                whileHover={{ y: -6 }}
              >
                <div
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r shadow-glow",
                    principle.color
                  )}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-heading-md font-bold text-text-primary">
                  {principle.title}
                </h3>
                <p className="leading-relaxed text-text-secondary">{principle.description}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
