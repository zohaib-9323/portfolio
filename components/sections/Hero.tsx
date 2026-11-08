"use client";

import { motion, useReducedMotion } from "framer-motion";
import IdCard from "@/components/IdCard";
import { usePersonal } from "@/lib/portfolio-data";
import { EXPERIENCE, PROFILE } from "@/lib/resume-data";

const FIGURES = [
  { figure: "−35%", text: "API response time after adding Redis caching" },
  { figure: "50%", text: "faster deployments with GitHub Actions, Docker and AWS" },
  { figure: "55+", text: "JWT- and RBAC-protected endpoints in production" },
  { figure: "7 days", text: "to ship the full RAG system behind Trade Harmonizer" },
];

// "Jan 2024 – Aug 2024" -> "2024"
const since = EXPERIENCE[EXPERIENCE.length - 1]?.period.match(/\d{4}/)?.[0] ?? "2023";

export default function Hero() {
  const me = usePersonal();
  const reduce = useReducedMotion();
  const firstName = me.name.split(" ")[0];
  const city = me.location.split(",")[0];

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section id="top" className="wrap pt-28 md:pt-36">
      <div className="grid items-center gap-y-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <motion.p {...rise(0)} className="label flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="tick" aria-hidden />
            <span className="text-ink">{me.availability}</span>
            <span className="text-line-strong">/</span>
            <span>{me.role}</span>
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="display mt-7 text-[clamp(2.75rem,5.6vw,5.4rem)] leading-[0.92] tracking-[-0.045em]"
          >
            I build AI features that keep working{" "}
            <span className="display-quiet">when the model doesn&apos;t.</span>
          </motion.h1>

          <motion.p {...rise(0.18)} className="mt-8 max-w-[46ch] text-lead text-ink-soft">
            I&apos;m {firstName}, a full-stack engineer in {city}. For the last year I&apos;ve been
            putting LLMs into real products: RAG pipelines, validated structured outputs, and queues
            that absorb slow or failed model calls so users never notice.
          </motion.p>

          <motion.div {...rise(0.26)} className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#work" className="btn-press">
              See selected work
              <span aria-hidden>↓</span>
            </a>
            <a href={`mailto:${me.email}`} className="btn-ghost">
              Email me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 40, rotate: -4 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <IdCard
            name={me.name}
            role={me.role}
            location={`${city}, PK`}
            since={since}
            availability={me.availability}
            email={me.email}
            focus={PROFILE.focus.slice(0, 6)}
            photo="/assets/profile/zohaib.jpg"
          />
        </motion.div>
      </div>

      <motion.dl
        {...rise(0.4)}
        className="mt-20 grid grid-cols-2 border-y-[1.5px] border-ink md:mt-28 lg:grid-cols-4"
      >
        {FIGURES.map((item, i) => (
          <div
            key={item.figure}
            className={`flex flex-col gap-3 py-6 pr-4 md:py-8 ${i % 2 === 1 ? "border-l border-line pl-4 md:pl-6" : ""} ${
              i > 1 ? "border-t border-line lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l lg:pl-6" : ""}`}
          >
            <dt className="display text-[clamp(2rem,3.6vw,3.1rem)] leading-none">{item.figure}</dt>
            <dd className="max-w-[26ch] text-[0.88rem] leading-snug text-muted">{item.text}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
