"use client";

import { motion } from "framer-motion";
import { Code2, Zap, Shield, Layers } from "lucide-react";

const principles = [
  {
    icon: Code2,
    title: "Clean Architecture",
    description:
      "Writing maintainable, scalable code with clear separation of concerns and modular design patterns.",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Zap,
    title: "Performance First",
    description:
      "Optimizing every aspect from database queries to frontend rendering for lightning-fast user experiences.",
    color: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
  },
  {
    icon: Shield,
    title: "Secure Coding",
    description:
      "Implementing best practices for authentication, authorization, and data protection in every application.",
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    icon: Layers,
    title: "Scalability",
    description:
      "Designing systems that grow seamlessly with user demand, using cloud infrastructure and microservices.",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
];

export default function TechPhilosophy() {
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
            <span className="gradient-text-static">Tech Philosophy</span>
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            The principles that guide my development approach
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  className={`
                    relative glass-strong rounded-2xl p-8 md:p-10
                    bg-gradient-to-br ${principle.bgGradient}
                    transition-all duration-500
                  `}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${principle.color} flex items-center justify-center mb-6 shadow-glow`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-heading-md font-bold mb-4 gradient-text-static">
                    {principle.title}
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-body">
                    {principle.description}
                  </p>

                  {/* Glow Effect */}
                  <div
                    className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-r ${principle.color}
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
