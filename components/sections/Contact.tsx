"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Send, Github, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1000);
  };

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: "mzohaib0677@gmail.com",
      href: "mailto:mzohaib0677@gmail.com",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+92 3229911442",
      href: "tel:+923229911442",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Lahore, Pakistan",
      href: "https://maps.google.com/?q=Lahore,Pakistan",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/zohaib-9323",
      href: "https://github.com/zohaib-9323",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-32 md:py-40 bg-neutral-50 dark:bg-neutral-950 overflow-hidden"
    >
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
            <span className="gradient-text-static">Get In Touch</span>
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Let's discuss your next project or just say hello!
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-2xl p-8 md:p-10"
          >
            <h3 className="text-heading-md font-bold mb-8 gradient-text-static">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Name"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
              />
              <Input
                label="Email"
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your.email@example.com"
              />
              <Textarea
                label="Message"
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Your message..."
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Message sent successfully!
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="glass-strong rounded-2xl p-8 md:p-10">
              <h3 className="text-heading-md font-bold mb-8 gradient-text-static">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  const Component = item.href ? motion.a : motion.div;
                  return (
                    <Component
                      key={item.label}
                      href={item.href}
                      target={item.href?.startsWith("http") ? "_blank" : undefined}
                      rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-5 rounded-xl glass hover:bg-neutral-800/50 dark:hover:bg-neutral-200/50 transition-all group cursor-pointer"
                      whileHover={{ x: 4 }}
                    >
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-glow flex-shrink-0`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          {item.label}
                        </p>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-accent transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </Component>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
