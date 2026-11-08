"use client";

/**
 * Client hooks that read the portfolio content from Supabase and fall back to the
 * resume snapshot in lib/*-data.ts. Every hook returns usable data on the first
 * render (the snapshot), then swaps in Supabase rows if they arrive, so sections
 * never sit behind a spinner when Supabase is paused or missing.
 */

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PROFILE, EXPERIENCE, SKILL_CATEGORIES } from "@/lib/resume-data";
import { FALLBACK_PROJECTS, PINNED_PROJECTS, type ProjectShowcase } from "@/lib/projects-data";
import { FEATURED_CERTIFICATIONS, type Certification } from "@/lib/certifications-data";
import { projectDedupeKey, shouldReplaceProjectRow } from "@/lib/project-preview-images";
import {
  resolveProjectCardPreview,
  resolveShowcasePreviewImage,
} from "@/lib/resolve-project-image-url";
import { bioParagraphs } from "@/lib/bio";

/* ------------------------------------------------------------------ */
/* Personal data — one shared request for hero, about and contact      */
/* ------------------------------------------------------------------ */

interface PersonalRow {
  display_name?: string;
  role?: string;
  email?: string;
  phone?: string;
  bio?: string;
  social_links?: { github?: string; linkedin?: string };
  metadata?: { location?: string; availability?: string };
}

export interface Personal {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  github: string;
  linkedin: string | null;
  bio: string[];
}

const FALLBACK_PERSONAL: Personal = {
  name: PROFILE.displayName,
  role: PROFILE.role,
  email: PROFILE.email,
  phone: PROFILE.phone,
  location: PROFILE.location,
  availability: PROFILE.availability,
  github: PROFILE.github,
  linkedin: null,
  bio: PROFILE.bio,
};

let personalRequest: Promise<PersonalRow | null> | null = null;

function loadPersonal() {
  if (!personalRequest) {
    personalRequest = Promise.resolve(
      supabase.from("personal_data").select("*").single()
    )
      .then(({ data, error }) => (error ? null : (data as PersonalRow)))
      .catch(() => null);
  }
  return personalRequest;
}

export function usePersonal(): Personal {
  const [row, setRow] = useState<PersonalRow | null>(null);

  useEffect(() => {
    let alive = true;
    loadPersonal().then((r) => alive && setRow(r));
    return () => {
      alive = false;
    };
  }, []);

  return useMemo(() => {
    if (!row) return FALLBACK_PERSONAL;
    return {
      name: row.display_name || FALLBACK_PERSONAL.name,
      role: row.role || FALLBACK_PERSONAL.role,
      email: row.email || FALLBACK_PERSONAL.email,
      phone: row.phone || FALLBACK_PERSONAL.phone,
      location: row.metadata?.location || FALLBACK_PERSONAL.location,
      availability: row.metadata?.availability || FALLBACK_PERSONAL.availability,
      github: row.social_links?.github || FALLBACK_PERSONAL.github,
      linkedin: row.social_links?.linkedin || null,
      bio: row.bio?.trim() ? bioParagraphs(row.bio) : FALLBACK_PERSONAL.bio,
    };
  }, [row]);
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type Project = ProjectShowcase;

function normalizeTechValue(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") {
    return v
      .split(/[,;]|(?:\s+•\s+)/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeTech(meta: unknown, techStack: unknown): string[] {
  if (meta && typeof meta === "object") {
    const m = meta as { stack?: unknown; technologies?: unknown; tags?: unknown };
    const fromMeta = normalizeTechValue(m.stack ?? m.technologies ?? m.tags);
    if (fromMeta.length) return fromMeta.slice(0, 12);
  }
  return normalizeTechValue(techStack).slice(0, 12);
}

function mapProjectRow(p: Record<string, unknown>): Project {
  const title = String(p.title ?? "Untitled");
  const isLandingPage = title.toLowerCase().includes("landing page");
  // Live URLs for projects whose Supabase row may not have one yet
  const knownLive = FALLBACK_PROJECTS.find((f) => projectDedupeKey(f.title) === projectDedupeKey(title))?.liveLink ?? null;
  const link = (p.project_link as string | null) || (isLandingPage ? null : knownLive);
  const liveLink = isLandingPage ? null : link;
  const landingLink = isLandingPage ? link : null;

  return {
    title,
    description: String(p.short_description ?? p.description ?? ""),
    liveLink,
    landingLink,
    githubLink: (p.repo_link as string | null) ?? null,
    tech: normalizeTech(p.tech_stack_meta, p.tech_stack),
    featured: Boolean(p.is_featured ?? p.featured),
    image: resolveProjectCardPreview(p, liveLink, landingLink),
  };
}

function dedupeProjects(list: Project[]): Project[] {
  const byKey = new Map<string, Project>();
  for (const card of list) {
    const key = projectDedupeKey(card.title);
    const existing = byKey.get(key);
    if (!existing || shouldReplaceProjectRow(card, existing)) byKey.set(key, card);
  }
  return Array.from(byKey.values()).sort((a, b) => Number(b.featured) - Number(a.featured));
}

const FALLBACK_PROJECT_LIST = dedupeProjects(
  FALLBACK_PROJECTS.map((p) => ({ ...p, image: resolveShowcasePreviewImage(p) }))
);

export function useProjects(): Project[] {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECT_LIST);

  useEffect(() => {
    let alive = true;
    Promise.resolve(
      supabase
        .from("projects")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
    )
      .then(({ data, error }) => {
        if (!alive || error || !data?.length) return;
        const rows = dedupeProjects(data.map((r) => mapProjectRow(r as Record<string, unknown>)));
        // Pinned projects come first unless Supabase already has a row for them
        const have = new Set(rows.map((r) => projectDedupeKey(r.title)));
        const pinned = PINNED_PROJECTS.filter((p) => !have.has(projectDedupeKey(p.title))).map((p) => ({
          ...p,
          image: resolveShowcasePreviewImage(p),
        }));
        setProjects([...pinned, ...rows].sort((a, b) => Number(b.featured) - Number(a.featured)));
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return projects;
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export interface Job {
  role: string;
  company: string;
  location: string | null;
  period: string;
  points: string[];
}

const FALLBACK_JOBS: Job[] = EXPERIENCE.map((e) => ({
  role: e.role,
  company: e.company,
  location: e.location,
  period: e.period,
  points: e.achievements,
}));

function monthYear(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function useExperience(): Job[] {
  const [jobs, setJobs] = useState<Job[]>(FALLBACK_JOBS);

  useEffect(() => {
    let alive = true;
    Promise.resolve(
      supabase.from("work_history").select("*").order("start_date", { ascending: false })
    )
      .then(({ data, error }) => {
        if (!alive || error || !data?.length) return;
        setJobs(
          data.map(
            (r: {
              role: string;
              company_name: string;
              location?: string;
              start_date: string;
              end_date?: string;
              currently_working?: boolean;
              achievements?: string[];
            }) => ({
              role: r.role,
              company: r.company_name,
              location: r.location ?? null,
              period: `${monthYear(r.start_date)} – ${
                r.currently_working ? "Present" : r.end_date ? monthYear(r.end_date) : ""
              }`,
              points: r.achievements ?? [],
            })
          )
        );
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return jobs;
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

const GROUP_TITLES: Record<string, string> = {
  ai: "AI engineering",
  backend: "Backend",
  frontend: "Frontend",
  database: "Data",
  devops: "Cloud & DevOps",
  integrations: "Integrations & tools",
};
const GROUP_ORDER = ["ai", "backend", "frontend", "database", "devops", "integrations"];

const FALLBACK_SKILLS: SkillGroup[] = SKILL_CATEGORIES.map((c) => ({
  id: c.id,
  title: GROUP_TITLES[c.id] ?? c.title,
  skills: c.skills,
}));

export function useSkills(): SkillGroup[] {
  const [groups, setGroups] = useState<SkillGroup[]>(FALLBACK_SKILLS);

  useEffect(() => {
    let alive = true;
    Promise.resolve(
      supabase.from("skills").select("*").order("proficiency", { ascending: false })
    )
      .then(({ data, error }) => {
        if (!alive || error || !data?.length) return;
        const grouped: Record<string, string[]> = {};
        for (const s of data as { category: string; name: string }[]) {
          const id = s.category.toLowerCase();
          (grouped[id] ??= []).push(s.name);
        }
        const rank = (id: string) => {
          const i = GROUP_ORDER.indexOf(id);
          return i === -1 ? 99 : i;
        };
        setGroups(
          Object.keys(grouped)
            .sort((a, b) => rank(a) - rank(b))
            .map((id) => ({
              id,
              title: GROUP_TITLES[id] ?? id.charAt(0).toUpperCase() + id.slice(1),
              skills: grouped[id],
            }))
        );
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return groups;
}

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

interface CertificationRow {
  id: string;
  title: string;
  issuer: string | null;
  year: number | null;
  summary: string | null;
  highlights: unknown;
  credential_url: string | null;
  sort_order: number | null;
}

export function useCertifications(): Certification[] {
  const [rows, setRows] = useState<CertificationRow[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.resolve(
      supabase
        .from("certifications")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("year", { ascending: false })
    )
      .then(({ data, error }) => {
        if (alive && !error && data) setRows(data as CertificationRow[]);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return useMemo(() => {
    const merged = new Map<string, Certification>();
    for (const c of FEATURED_CERTIFICATIONS) merged.set(c.title.toLowerCase(), c);

    for (const row of rows) {
      if (!row.title) continue;
      const key = row.title.toLowerCase();
      const highlights = Array.isArray(row.highlights)
        ? row.highlights.filter((x): x is string => typeof x === "string")
        : [];
      const existing = merged.get(key);
      if (existing) {
        merged.set(key, {
          ...existing,
          summary: row.summary || existing.summary,
          highlights: highlights.length ? highlights : existing.highlights,
          credentialUrl: row.credential_url ?? existing.credentialUrl,
        });
      } else {
        merged.set(key, {
          id: row.id,
          title: row.title,
          issuer: row.issuer ?? "",
          year: row.year ?? new Date().getFullYear(),
          summary: row.summary ?? "",
          highlights,
          credentialUrl: row.credential_url,
          imageSrc: "",
          imageAlt: `${row.title} certificate`,
          sortOrder: row.sort_order ?? 99,
        });
      }
    }
    return Array.from(merged.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [rows]);
}
