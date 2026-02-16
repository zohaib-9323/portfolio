"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl overflow-hidden group focus-outline"
            style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-muted)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {/* Background gradient on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: "var(--gradient-subtle)",
                }}
            />

            {/* Icon container with morph animation */}
            <div className="relative w-5 h-5">
                {/* Sun Icon - Light Mode */}
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 0 : 1,
                        rotate: isDark ? 90 : 0,
                        opacity: isDark ? 0 : 1,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Sun
                        className="w-5 h-5 text-amber-500"
                        strokeWidth={2.5}
                    />
                </motion.div>

                {/* Moon Icon - Dark Mode */}
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 1 : 0,
                        rotate: isDark ? 0 : -90,
                        opacity: isDark ? 1 : 0,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Moon
                        className="w-5 h-5"
                        style={{ color: "var(--accent-primary)" }}
                        strokeWidth={2.5}
                    />
                </motion.div>
            </div>

            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                    background: "var(--accent-glow)",
                    filter: "blur(12px)",
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}
