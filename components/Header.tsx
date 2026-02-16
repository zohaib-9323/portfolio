"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section
      const sections = navItems.map(item => item.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(currentSection ? `#${currentSection}` : "");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60]"
        style={{
          scaleX,
          background: "var(--gradient-primary)",
        }}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-strong"
            : ""
        )}
        style={
          isScrolled
            ? {
              borderBottom: "1px solid var(--border-muted)",
              boxShadow: "var(--shadow-soft)",
            }
            : {}
        }
      >
        <nav className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#about");
              }}
              className="text-xl md:text-2xl font-bold gradient-text-static"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Zohaib Asghar
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={cn(
                    "nav-link",
                    activeSection === item.href && "active"
                  )}
                >
                  {item.name}
                </a>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle />
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg focus-outline"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-muted)",
                }}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" style={{ color: "var(--text-primary)" }} />
                ) : (
                  <Menu className="w-6 h-6" style={{ color: "var(--text-primary)" }} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? "auto" : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pb-4 pt-2 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={cn(
                    "block py-3 px-4 rounded-lg text-sm font-medium transition-all",
                    activeSection === item.href
                      ? "active"
                      : ""
                  )}
                  style={
                    activeSection === item.href
                      ? {
                        color: "var(--accent-primary)",
                        background: "var(--accent-glow)",
                      }
                      : {
                        color: "var(--text-muted)",
                      }
                  }
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        </nav>
      </motion.header>
    </>
  );
}
