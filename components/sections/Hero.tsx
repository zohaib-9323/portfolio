"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

const roles = [
  "Building Scalable AI-Driven Web Applications",
  "Full Stack MERN Developer",
  "Performance-Optimized Solutions",
  "Production-Ready Applications",
];

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 grid-background opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="section-container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Main Headline */}
          <motion.div variants={itemVariants}>
            <h1 className="text-display-xl font-bold mb-6">
              <span className="gradient-text">Building Scalable</span>
              <br />
              <span className="gradient-text">AI-Driven Web</span>
              <br />
              <span className="gradient-text">Applications</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <h2 className="text-heading-lg font-semibold mb-6 text-neutral-600 dark:text-neutral-400">
              Full Stack MERN Developer
            </h2>
          </motion.div>

          {/* Rotating Role */}
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="h-20 md:h-24 mb-8 flex items-center justify-center"
          >
            <p className="text-xl md:text-2xl font-medium gradient-text-static">
              {roles[currentRole]}
            </p>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Results-driven Full Stack Developer with 1.5+ years of experience
              building scalable web applications using MERN Stack, Next.js, and
              TypeScript. Strong expertise in performance optimization, secure
              backend integrations, RESTful API development, database
              architecture, and cloud deployments.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.a
              href="#contact"
              className="btn-primary flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail className="w-5 h-5" />
              Get In Touch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="https://github.com/zohaib-9323"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-5 h-5" />
              View Projects
            </motion.a>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 md:gap-8 text-caption text-neutral-500 dark:text-neutral-500"
          >
            <motion.a
              href="https://maps.google.com/?q=Lahore,Pakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent transition-colors group"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="w-4 h-4" />
              <span>Lahore, Pakistan</span>
            </motion.a>
            <motion.a
              href="mailto:mzohaib0677@gmail.com"
              className="flex items-center gap-2 hover:text-accent transition-colors group"
              whileHover={{ scale: 1.05 }}
            >
              <Mail className="w-4 h-4" />
              <span>mzohaib0677@gmail.com</span>
            </motion.a>
            <motion.a
              href="tel:+923229911442"
              className="flex items-center gap-2 hover:text-accent transition-colors group"
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="w-4 h-4" />
              <span>+92 3229911442</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-neutral-500"
        >
          <span className="text-xs font-medium">Scroll</span>
          <div className="w-6 h-10 border-2 border-neutral-600 dark:border-neutral-400 rounded-full flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-neutral-600 dark:bg-neutral-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
