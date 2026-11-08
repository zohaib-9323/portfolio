"use client";

import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useSkills } from "@/lib/portfolio-data";

export default function Toolkit() {
  const skills = useSkills();

  return (
    <Section id="toolkit" className="!pt-0">
      <SectionHead
        id="toolkit"
        index="04"
        label="Toolkit"
        title="What I reach for,"
        quiet="grouped the way I think about a system."
        intro={<>No progress bars, because &ldquo;80% React&rdquo; doesn&apos;t mean anything.</>}
      />

      <dl className="mt-12 grid gap-x-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.id} delay={(i % 3) * 0.05} className="border-t-[1.5px] border-ink py-6">
            <dt className="flex items-baseline justify-between">
              <span className="display text-[1.3rem]">{group.title}</span>
              <span className="label">{String(group.skills.length).padStart(2, "0")}</span>
            </dt>
            <dd className="mt-4 flex flex-wrap gap-1.5">
              {group.skills.map((s) => (
                <span key={s} className="rounded-full border border-line px-2.5 py-1 text-[0.85rem] text-ink-soft">
                  {s}
                </span>
              ))}
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
