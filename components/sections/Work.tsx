"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { useProjects, type Project } from "@/lib/portfolio-data";

function linksFor(p: Project) {
  return [
    p.liveLink && { href: p.liveLink, label: "Live site" },
    p.landingLink && { href: p.landingLink, label: "Landing page" },
    p.githubLink && { href: p.githubLink, label: "Source" },
  ].filter(Boolean) as { href: string; label: string }[];
}

function Shot({ project, className = "" }: { project: Project; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!project.image || failed) {
    // Typographic plate for projects without a screenshot
    return (
      <div className={`flex h-full w-full flex-col justify-between bg-paper-sunk p-6 md:p-10 ${className}`}>
        <span className="label">{project.tech.slice(0, 3).join(" · ")}</span>
        <span className="display text-[clamp(1.8rem,4vw,3.4rem)] leading-[0.92]">{project.title}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local /assets and remote previews; next/image chokes on the large PNGs
    <img
      src={project.image}
      alt={`Screenshot of ${project.title}`}
      loading="lazy"
      decoding="async"
      referrerPolicy={project.image.startsWith("/") ? undefined : "no-referrer"}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover object-left-top ${className}`}
    />
  );
}

/** Thickness under a screen: stacked 1px offsets in the edge colour, then a soft drop shadow */
const SLAB = Array.from({ length: 7 }, (_, i) => `0 ${i + 1}px 0 rgb(var(--line-strong))`)
  .concat("0 40px 60px -30px rgb(0 0 0 / 0.55)")
  .join(", ");

/**
 * A project screen that starts tipped back in 3D and settles flat as it scrolls into view,
 * then follows the pointer once it's there.
 */
function Screen({ project, side }: { project: Project; side: "left" | "right" }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const rotateX = useTransform(progress, [0, 1], [28, 0]);
  const rotateY = useTransform(progress, [0, 1], [side === "left" ? 14 : -14, 0]);
  const scale = useTransform(progress, [0, 1], [0.88, 1]);
  const link = linksFor(project)[0];

  const screen = (
    <Tilt max={6} lift={20} radius="18px">
      <div className="rounded-[18px] border border-line bg-paper-raised p-2" style={{ boxShadow: SLAB }}>
        <div className="flex items-center gap-1.5 px-2 pb-2 pt-1" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
        </div>
        <div className="aspect-[16/10] overflow-hidden rounded-[11px] bg-paper-sunk">
          <Shot project={project} />
        </div>
      </div>
    </Tilt>
  );

  return (
    <div ref={ref} className="[perspective:1600px]">
      <motion.div style={reduce ? undefined : { rotateX, rotateY, scale }} className="preserve-3d origin-bottom">
        {link ? (
          <a href={link.href} target="_blank" rel="noreferrer" aria-label={`${project.title}: ${link.label}`} className="block rounded-[18px]">
            {screen}
          </a>
        ) : (
          screen
        )}
      </motion.div>
    </div>
  );
}

function CaseStudy({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const links = linksFor(project);

  return (
    <article className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-12">
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Screen project={project} side={flip ? "right" : "left"} />
      </div>

      <Reveal className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="label flex items-center gap-3">
          <span className="display text-[0.95rem] !tracking-normal text-ink">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {project.status ?? (project.liveLink ? "In production" : project.githubLink ? "Open source" : "Client work")}
        </p>
        <h3 className="display mt-5 text-title-sm">{project.title}</h3>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-soft">{project.description}</p>
        {project.tech.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[0.72rem] text-ink-soft">
                {t}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
          {links.length ? (
            links.map((l) => (
              <a key={l.href + l.label} href={l.href} target="_blank" rel="noreferrer" className="link">
                {l.label} ↗
              </a>
            ))
          ) : (
            <span className="label">Private repository</span>
          )}
        </p>
      </Reveal>
    </article>
  );
}

function SmallProject({ project, index }: { project: Project; index: number }) {
  const link = linksFor(project)[0];
  const Wrapper = link ? "a" : "div";
  return (
    <Reveal as="li" delay={(index % 2) * 0.06}>
      <Tilt max={7} lift={14} radius="20px" className="h-full">
        <Wrapper
          {...(link ? { href: link.href, target: "_blank", rel: "noreferrer" } : {})}
          className="group flex h-full flex-col rounded-[20px] border border-line bg-paper-raised p-3"
        >
          <div className="aspect-[16/10] overflow-hidden rounded-[12px] bg-paper-sunk">
            <Shot project={project} className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          </div>
          <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
            <h4 className="display flex items-start justify-between gap-4 text-[1.35rem] leading-tight">
              {project.title}
              {link && (
                <span aria-hidden className="mt-1 text-[1rem] text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              )}
            </h4>
            <p className="mt-2 line-clamp-3 text-[0.93rem] leading-relaxed text-ink-soft">{project.description}</p>
            <p className="mt-auto pt-5 font-mono text-[0.7rem] text-muted">{project.tech.slice(0, 4).join(" · ")}</p>
          </div>
        </Wrapper>
      </Tilt>
    </Reveal>
  );
}

export default function Work() {
  const projects = useProjects();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="band relative mx-2 rounded-[28px] py-20 sm:mx-3 md:mx-4 md:rounded-[44px] md:py-32"
    >
      <div className="wrap">
        <SectionHead
          id="work"
          index="01"
          label="Selected work"
          title="Products I've built,"
          quiet="mostly the parts you don't see."
          intro="Multi-tenant SaaS backends, AI features, and the occasional front end. Screenshots are from live or staging builds."
        />

        <div className="mt-10 divide-y divide-line md:mt-16">
          {featured.map((p, i) => (
            <CaseStudy key={p.title} project={p} index={i} />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-10 border-t-[1.5px] border-ink pt-10 md:mt-16">
            <p className="label flex items-center gap-2.5">
              <span className="tick" aria-hidden />
              Also built
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {rest.map((p, i) => (
                <SmallProject key={p.title} project={p} index={i} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
