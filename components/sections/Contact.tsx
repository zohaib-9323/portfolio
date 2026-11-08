"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { usePersonal } from "@/lib/portfolio-data";

type Status = "idle" | "sending" | "sent" | "error";

function formatPhone(phone: string) {
  // +923229911442 -> +92 322 9911442
  const m = phone.replace(/\s+/g, "").match(/^\+92(\d{3})(\d{7})$/);
  return m ? `+92 ${m[1]} ${m[2]}` : phone;
}

export default function Contact() {
  const me = usePersonal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "The message couldn't be sent.");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const details = [
    { k: "Phone", v: formatPhone(me.phone), href: `tel:${me.phone.replace(/\s+/g, "")}` },
    { k: "GitHub", v: me.github.replace(/^https?:\/\//, ""), href: me.github, external: true },
    me.linkedin && { k: "LinkedIn", v: me.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: me.linkedin, external: true },
    { k: "Based in", v: me.location },
  ].filter(Boolean) as { k: string; v: string; href?: string; external?: boolean }[];

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20 md:py-32">
      <div className="wrap">
        <p className="label flex items-center gap-2.5">
          <span className="tick" aria-hidden />
          <span className="text-ink">05</span>
          <span className="text-line-strong">/</span>
          Contact
        </p>

        <Reveal>
          <h2 id="contact-title" className="display mt-8 max-w-[13ch] text-mega">
            Got something worth building?
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <p className="max-w-[40ch] text-lead text-ink-soft">
              Hiring for an AI or full-stack role, or need a backend that holds up under real users? Email
              is quickest. I usually reply within a day.
            </p>
            <a
              href={`mailto:${me.email}`}
              className="group mt-8 inline-flex max-w-full items-center gap-3 break-all text-[clamp(1.25rem,2.4vw,1.8rem)] font-semibold tracking-[-0.02em] text-ink"
            >
              <span className="underline decoration-line-strong decoration-[1.5px] underline-offset-[0.25em] transition-colors group-hover:decoration-accent">
                {me.email}
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <dl className="mt-10 border-t border-line">
              {details.map((d) => (
                <div key={d.k} className="grid grid-cols-[6.5rem_1fr] items-baseline border-b border-line py-3.5 text-[0.95rem]">
                  <dt className="label">{d.k}</dt>
                  <dd className="min-w-0 truncate text-ink">
                    {d.href ? (
                      <a href={d.href} {...(d.external ? { target: "_blank", rel: "noreferrer" } : {})} className="link">
                        {d.v}
                      </a>
                    ) : (
                      d.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={submit} className="rounded-[26px] border border-line bg-paper-raised p-5 sm:p-8">
              <p className="display text-[1.4rem]">Or leave a note</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label mb-2 block">Name</span>
                  <input required name="name" autoComplete="name" placeholder="Ada Lovelace" value={form.name} onChange={update("name")} className="field" />
                </label>
                <label className="block">
                  <span className="label mb-2 block">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={update("email")}
                    className="field"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="label mb-2 block">Message</span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="What are you working on?"
                  value={form.message}
                  onChange={update("message")}
                  className="field resize-none"
                />
              </label>

              <div className="mt-8 flex flex-wrap-reverse items-center justify-between gap-5">
                <p className="text-[0.92rem]" role="status" aria-live="polite">
                  {status === "sent" && <span className="text-ink">Sent. I&apos;ll get back to you soon.</span>}
                  {status === "error" && <span className="text-ink">{error}</span>}
                </p>
                <button type="submit" disabled={status === "sending"} className="btn-press">
                  {status === "sending" ? "Sending…" : "Send message"}
                  <span aria-hidden>→</span>
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
