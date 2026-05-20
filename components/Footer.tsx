"use client";

import { motion } from "framer-motion";
import { Github, Mail, Phone, MapPin, ArrowUp, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PersonalData {
  display_name: string;
  email: string;
  phone: string;
  social_links: { github?: string };
  metadata: { location?: string };
}

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Certificates", href: "#certifications" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const { data, error } = await supabase.from("personal_data").select("*").single();
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (loading) return null;

  const name = data?.display_name || "Zohaib Asghar";

  return (
    <footer className="relative border-t border-border-muted bg-bg-secondary/50">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        aria-hidden
      />
      <div className="section-container py-14 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <h3 className="mb-4 text-xl font-bold gradient-text-static">{name}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
              Full Stack MERN developer shipping scalable apps with Next.js, NestJS, and
              cloud-ready deployments.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Quick links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-accent"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${data?.email || "mzohaib0677@gmail.com"}`}
                  className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4" />
                  {data?.email || "mzohaib0677@gmail.com"}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${data?.phone || "+923229911442"}`}
                  className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4" />
                  {data?.phone || "+92 3229911442"}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-muted">
                <MapPin className="h-4 w-4" />
                {data?.metadata?.location || "Lahore, Pakistan"}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-muted pt-8 sm:flex-row">
          <p className="flex items-center gap-1.5 text-sm text-text-muted">
            © {currentYear} {name}. Built with
            <Heart className="inline h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            & Next.js
          </p>
          <div className="flex items-center gap-4">
            <motion.a
              href={data?.social_links?.github || "https://github.com/zohaib-9323"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border-muted bg-card-bg p-2.5 text-text-muted transition hover:border-accent/40 hover:text-accent"
              aria-label="GitHub"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <motion.button
              onClick={scrollToTop}
              className="rounded-xl border border-border-muted bg-card-bg p-2.5 text-text-muted transition hover:border-accent/40 hover:text-accent"
              aria-label="Scroll to top"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
