"use client";

import { motion } from "framer-motion";
import { TrendingUp, Zap, Users, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionShell, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Faster API responses (Redis caching)",
    value: 35,
    suffix: "%",
    icon: Zap,
    color: "from-amber-400 to-orange-500",
  },
  {
    label: "Faster deployments (CI/CD)",
    value: 50,
    suffix: "%",
    icon: Rocket,
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    label: "JWT-secured REST endpoints",
    value: 30,
    suffix: "+",
    icon: Users,
    color: "from-emerald-400 to-teal-500",
  },
  {
    label: "Days to ship a full RAG system",
    value: 7,
    suffix: "",
    icon: TrendingUp,
    color: "from-cyan-400 to-blue-500",
  },
];

export default function PerformanceHighlights() {
  const [countedValues, setCountedValues] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      const increment = stat.value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
          if (index === stats.length - 1) setHasAnimated(true);
        }
        setCountedValues((prev) => {
          const next = [...prev];
          next[index] = Math.round(current);
          return next;
        });
      }, interval);
    });
  }, [hasAnimated]);

  return (
    <SectionShell variant="elevated">
      <SectionHeading
        eyebrow="Impact"
        title="Performance Highlights"
        description="Measured results from production work: performance, delivery, security, and AI."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group"
            >
              <motion.div
                className="relative card-interactive glass-strong p-8 text-center"
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className={cn(
                    "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r shadow-glow",
                    stat.color
                  )}
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                >
                  <Icon className="h-8 w-8 text-white" />
                </motion.div>
                <p className="mb-2 text-4xl font-bold gradient-text-static md:text-5xl">
                  {countedValues[index]}
                  {stat.suffix}
                </p>
                <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15",
                    stat.color
                  )}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
