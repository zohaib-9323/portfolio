"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Certificates", href: "#certifications" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [displayName, setDisplayName] = useState("Zohaib Asghar");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    async function fetchDisplayName() {
      try {
        const { data, error } = await supabase
          .from("personal_data")
          .select("display_name")
          .single();
        if (error) throw error;
        if (data) setDisplayName(data.display_name);
      } catch (error) {
        console.error("Error fetching display name:", error);
      }
    }
    fetchDisplayName();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const sections = navItems.map((item) => item.href.substring(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      setActiveSection(currentSection ? `#${currentSection}` : "");
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left"
        style={{ scaleX, background: "var(--amber)" }}
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-6"
      >
        <nav
          className={cn(
            "section-container mx-auto flex items-center justify-between rounded-md px-4 transition-all duration-300 md:px-6",
            isScrolled
              ? "glass-strong h-16"
              : "h-16 md:h-[4.5rem] bg-transparent"
          )}
        >
          <motion.a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#about");
            }}
            className="group flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="surface-amber flex h-10 w-10 items-center justify-center rounded-md border-2 border-border-strong text-sm font-bold shadow-[var(--shadow-soft)]">
              {initials}
            </span>
            <span className="hidden font-bold gradient-text-static sm:inline text-lg">
              {displayName.split(" ")[0]}
            </span>
          </motion.a>

          <div className="hidden items-center gap-1 rounded-md border-2 border-border-muted bg-bg-secondary p-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeSection === item.href
                    ? "text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                {activeSection === item.href && (
                  <motion.span
                    layoutId="navPill"
                    className="surface-amber absolute inset-0 rounded-md border-2 border-border-strong"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10",
                    activeSection === item.href && "font-bold text-black"
                  )}
                >
                  {item.name}
                </span>
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contact");
              }}
              className="btn-primary inline-flex items-center gap-1.5 !py-2.5 !px-5 text-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Hire me
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl border border-border-muted bg-card-bg p-2.5 focus-outline"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-text-primary" />
              )}
            </motion.button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="section-container mx-auto mt-2 overflow-hidden rounded-md border-2 border-border-strong glass-strong md:hidden"
            >
              <div className="space-y-1 p-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      activeSection === item.href
                        ? "bg-accent/15 text-accent"
                        : "text-text-muted hover:bg-card-bg hover:text-text-primary"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  className="btn-primary mt-2 flex w-full items-center justify-center gap-2"
                >
                  Hire me
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
