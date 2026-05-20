"use client";

import { motion } from "framer-motion";
import { TrendingUp, Zap, Users, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionShell, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Performance boost",
    value: 25,
    icon: Zap,
    color: "from-amber-400 to-orange-500",
  },
  {
    label: "User satisfaction",
    value: 40,
    icon: Users,
    color: "from-emerald-400 to-teal-500",
  },
  {
    label: "API efficiency",
    value: 30,
    icon: TrendingUp,
    color: "from-cyan-400 to-blue-500",
  },
  {
    label: "Faster deployment",
    value: 50,
    icon: Rocket,
    color: "from-violet-400 to-fuchsia-500",
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
          next[index] = Math.floor(current);
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
        description="Measurable outcomes from optimization, architecture, and best practices."
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
                  {countedValues[index]}%
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
