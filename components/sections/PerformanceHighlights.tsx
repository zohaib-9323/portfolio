"use client";

import { motion } from "framer-motion";
import { TrendingUp, Zap, Users, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    label: "Performance Boost",
    value: 25,
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
  },
  {
    label: "User Satisfaction",
    value: 40,
    icon: Users,
    color: "from-green-400 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    label: "API Efficiency",
    value: 30,
    icon: TrendingUp,
    color: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    label: "Faster Deployment",
    value: 50,
    icon: Rocket,
    color: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
];

export default function PerformanceHighlights() {
  const [countedValues, setCountedValues] = useState(
    stats.map(() => 0)
  );
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
          if (index === stats.length - 1) {
            setHasAnimated(true);
          }
        }
        setCountedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = Math.floor(current);
          return newValues;
        });
      }, interval);
    });
  }, [hasAnimated]);

  return (
    <section className="relative py-32 md:py-40 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
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
            <span className="gradient-text-static">Performance Highlights</span>
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Measurable impact delivered through optimization and best practices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <motion.div
                  className={`
                    relative glass-strong rounded-2xl p-8 text-center
                    bg-gradient-to-br ${stat.bgGradient}
                    transition-all duration-500
                  `}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Icon */}
                  <motion.div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-glow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    key={countedValues[index]}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl md:text-6xl font-bold mb-3 gradient-text-static"
                  >
                    {countedValues[index]}%
                  </motion.div>

                  {/* Label */}
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium text-sm md:text-base">
                    {stat.label}
                  </p>

                  {/* Glow Effect */}
                  <div
                    className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color}
                      opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500
                    `}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
