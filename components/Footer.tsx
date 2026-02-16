"use client";

import { motion } from "framer-motion";
import { Github, Mail, Phone, MapPin, ArrowUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PersonalData {
  display_name: string;
  email: string;
  phone: string;
  social_links: {
    github?: string;
  };
  metadata: {
    location?: string;
  };
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const { data, error } = await supabase
          .from("personal_data")
          .select("*")
          .single();

        if (error) throw error;
        if (data) setData(data);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPersonalData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  if (loading) return null;

  return (
    <footer className="relative border-t border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-950">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text-static">
              {data?.display_name || "Zohaib Asghar"}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              Full Stack MERN Developer building scalable web applications with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${data?.email || "mzohaib0677@gmail.com"}`}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {data?.email || "mzohaib0677@gmail.com"}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${data?.phone || "+923229911442"}`}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {data?.phone || "+92 3229911442"}
                </a>
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {data?.metadata?.location || "Lahore, Pakistan"}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            © {currentYear} {data?.display_name || "Zohaib Asghar"}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <motion.a
              href={data?.social_links?.github || "https://github.com/zohaib-9323"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors"
              aria-label="GitHub"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.button
              onClick={scrollToTop}
              className="text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors p-2 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              aria-label="Scroll to top"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
