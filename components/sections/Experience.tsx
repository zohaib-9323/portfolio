"use client";

import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { useCertifications, useExperience } from "@/lib/portfolio-data";
import { EDUCATION } from "@/lib/resume-data";

/** Set the numbers in a sentence (35%, 30+, 25+) in ink and semibold so results scan first. */
function withFigures(text: string) {
  return text.split(/(\d+(?:\.\d+)?(?:%|\+)?)/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-ink">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function Row({ when, kind, children }: { when: string; kind: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-5 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-14">
      <div className="md:col-span-3">
        <p className="display text-[1.05rem] !tracking-[-0.01em]">{when}</p>
        <p className="label mt-1.5">{kind}</p>
      </div>
      <div className="md:col-span-9">{children}</div>
    </Reveal>
  );
}

export default function Experience() {
  const jobs = useExperience();
  const certs = useCertifications();

  return (
    <Section id="experience">
      <SectionHead
        id="experience"
        index="03"
        label="Experience"
        title="Where I've worked,"
        quiet="and what changed because I was there."
      />

      <div className="mt-12 border-t-[1.5px] border-ink md:mt-20">
        {jobs.map((job, i) => (
          <Row key={job.company + job.period} when={job.period} kind={job.location ?? "Role"}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="display text-title-sm">{job.role}</h3>
              {i === 0 && /present/i.test(job.period) && (
                <span className="label flex items-center gap-2 text-ink">
                  <span className="tick" aria-hidden />
                  Current
                </span>
              )}
            </div>
            <p className="mt-2 text-[1.05rem] font-medium text-ink-soft">{job.company}</p>
            <ul className="mt-7 grid gap-x-10 gap-y-4 lg:grid-cols-2">
              {job.points.map((point) => (
                <li key={point} className="relative pl-5 text-[0.98rem] leading-relaxed text-ink-soft">
                  <span className="absolute left-0 top-[0.62em] h-[1.5px] w-2.5 bg-line-strong" aria-hidden />
                  {withFigures(point)}
                </li>
              ))}
            </ul>
          </Row>
        ))}

        <Row when={EDUCATION.period} kind="Education">
          <h3 className="display text-[1.6rem] leading-tight">{EDUCATION.degree}</h3>
          <p className="mt-2 text-[1.02rem] text-ink-soft">
            {EDUCATION.school} · CGPA {EDUCATION.cgpa}
          </p>
        </Row>

        {certs.map((cert) => (
          <Row key={cert.id} when={String(cert.completedOn ?? cert.year)} kind="Certification">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start md:gap-12">
              <div>
                <h3 className="display text-[1.6rem] leading-tight">{cert.title}</h3>
                <p className="mt-2 text-[1.02rem] text-ink-soft">
                  {cert.issuer}
                  {cert.hours ? ` · ${cert.hours} hours` : ""}
                </p>
                {cert.summary && <p className="mt-4 max-w-prose text-[0.98rem] leading-relaxed text-ink-soft">{cert.summary}</p>}
                <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.92rem]">
                  {cert.imageSrc && (
                    <a href={cert.imageSrc} target="_blank" rel="noreferrer" className="link">
                      View certificate ↗
                    </a>
                  )}
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="link">
                      Verify ↗
                    </a>
                  )}
                  {cert.credentialId && <span className="label">ID {cert.credentialId}</span>}
                </p>
              </div>
              {cert.imageSrc && (
                <Tilt max={12} lift={24} radius="10px" className="w-full max-w-[280px]">
                  <a
                    href={cert.imageSrc}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${cert.title} certificate`}
                    className="block rounded-[10px] border border-line bg-paper-raised p-2 shadow-[0_1px_0_rgb(var(--line-strong)),0_2px_0_rgb(var(--line-strong)),0_3px_0_rgb(var(--line-strong)),0_28px_40px_-22px_rgb(0_0_0/0.5)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cert.imageSrc} alt={cert.imageAlt} loading="lazy" className="w-full rounded-[5px]" />
                  </a>
                </Tilt>
              )}
            </div>
          </Row>
        ))}
      </div>
    </Section>
  );
}
