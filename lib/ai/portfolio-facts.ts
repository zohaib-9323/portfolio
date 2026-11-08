/**
 * A plain-text fact sheet for the chatbot, built from the same data the website renders
 * (resume-data, projects-data, certifications-data). It's always in the system prompt, so the
 * bot can answer core questions ("What did he build for Trade Harmonizer?") even when the
 * Qdrant index is empty, stale, or the vector search misses.
 */

import { PROFILE, EXPERIENCE, EDUCATION, SKILL_CATEGORIES } from "@/lib/resume-data";
import { FALLBACK_PROJECTS } from "@/lib/projects-data";
import { FEATURED_CERTIFICATIONS } from "@/lib/certifications-data";

function projectLinks(p: (typeof FALLBACK_PROJECTS)[number]) {
  return [
    p.liveLink && `live: ${p.liveLink}`,
    p.landingLink && `landing page: ${p.landingLink}`,
    p.githubLink && `source: ${p.githubLink}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export function buildPortfolioFacts(): string {
  const jobs = EXPERIENCE.map(
    (j) =>
      `- ${j.role} at ${j.company} (${j.period}, ${j.location}):\n${j.achievements.map((a) => `  - ${a}`).join("\n")}`
  ).join("\n");

  const projects = FALLBACK_PROJECTS.map((p) => {
    const links = projectLinks(p);
    return `- **${p.title}**${p.status ? ` (${p.status})` : ""}: ${p.description}\n  Stack: ${p.tech.join(", ")}${
      links ? `\n  Links: ${links}` : ""
    }`;
  }).join("\n");

  const skills = SKILL_CATEGORIES.map((c) => `- ${c.title}: ${c.skills.join(", ")}`).join("\n");

  const certs = FEATURED_CERTIFICATIONS.map(
    (c) => `- ${c.title}, ${c.issuer} (${c.completedOn ?? c.year}): ${c.summary}`
  ).join("\n");

  return `Name: ${PROFILE.displayName}
Role: ${PROFILE.role}
Location: ${PROFILE.location}
Availability: ${PROFILE.availability}
Email: ${PROFILE.email}
GitHub: ${PROFILE.github}

About:
${PROFILE.bio.join("\n")}

Experience:
${jobs}

Projects:
${projects}

Skills:
${skills}

Education: ${EDUCATION.degree}, ${EDUCATION.school} (${EDUCATION.period}), CGPA ${EDUCATION.cgpa}

Certifications:
${certs}`;
}
