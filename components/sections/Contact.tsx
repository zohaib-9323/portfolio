"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, Send, Github, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { supabase } from "@/lib/supabase";
import { SectionShell, SectionHeading, SectionLoader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

interface PersonalData {
  email: string;
  phone: string;
  social_links: { github?: string };
  metadata: { location?: string };
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const { data, error } = await supabase.from("personal_data").select("*").single();
        if (error) throw error;
        if (data) setData(data);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPersonalData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SectionShell id="contact">
        <SectionLoader />
      </SectionShell>
    );
  }

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: data?.email || "mzohaib0677@gmail.com",
      href: `mailto:${data?.email || "mzohaib0677@gmail.com"}`,
      iconClass: "bg-accent/15 text-accent",
    },
    {
      icon: Phone,
      label: "Phone",
      value: data?.phone || "+92 3229911442",
      href: `tel:${data?.phone || "+923229911442"}`,
      iconClass: "bg-accent/15 text-accent",
    },
    {
      icon: MapPin,
      label: "Location",
      value: data?.metadata?.location || "Lahore, Pakistan",
      href: `https://maps.google.com/?q=${data?.metadata?.location || "Lahore,Pakistan"}`,
      iconClass: "bg-accent/15 text-accent",
    },
    {
      icon: Github,
      label: "GitHub",
      value:
        data?.social_links?.github?.replace("https://", "") || "github.com/zohaib-9323",
      href: data?.social_links?.github || "https://github.com/zohaib-9323",
      iconClass: "bg-accent/15 text-accent",
    },
  ];

  return (
    <SectionShell id="contact">
      <SectionHeading
        eyebrow="Connect"
        title="Get In Touch"
        description="Have a project in mind or want to collaborate? I'd love to hear from you."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="shimmer-border glass-strong rounded-3xl p-8 md:p-10"
        >
          <h3 className="mb-8 text-heading-md font-bold text-text-primary">
            Send a message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Name"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
            />
            <Input
              label="Email"
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@company.com"
            />
            <Textarea
              label="Message"
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell me about your project..."
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex w-full items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send message
                </>
              )}
            </motion.button>
            {submitStatus === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Thanks! Your message was sent — I&apos;ll get back to you soon.
              </motion.p>
            )}
            {submitStatus === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                {errorMessage}
              </motion.p>
            )}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-8 md:p-10"
        >
          <h3 className="mb-8 text-heading-md font-bold text-text-primary">
            Contact details
          </h3>
          <div className="space-y-4">
            {contactItems.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <>
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      item.iconClass
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-caption text-text-muted">{item.label}</p>
                    <p className="font-semibold text-text-primary transition-colors hover:text-accent">
                      {item.value}
                    </p>
                  </div>
                </>
              );
              const motionProps = {
                initial: { opacity: 0, x: 16 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true } as const,
                transition: { delay: index * 0.08 },
                className: "card-interactive flex items-center gap-4 rounded-2xl p-5",
                whileHover: { x: 4 },
              };
              return item.href ? (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  {...motionProps}
                >
                  {content}
                </motion.a>
              ) : (
                <motion.div key={item.label} {...motionProps}>
                  {content}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
