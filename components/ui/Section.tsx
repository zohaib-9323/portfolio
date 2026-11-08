import { Reveal } from "./Reveal";

/**
 * Section opener: a numbered label on the left, a two-weight headline on the right.
 * `title` is the loud half, `quiet` the narrower muted half that follows it.
 */
export function SectionHead({
  id,
  index,
  label,
  title,
  quiet,
  intro,
}: {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  quiet?: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <div className="grid gap-y-6 md:grid-cols-12 md:gap-x-8">
      <p className="label flex items-center gap-2.5 self-start md:col-span-3 md:pt-4">
        <span className="tick" aria-hidden />
        <span className="text-ink">{index}</span>
        <span className="text-line-strong">/</span>
        {label}
      </p>
      <Reveal className="md:col-span-9">
        <h2 id={`${id}-title`} className="display text-title">
          {title}
          {quiet && (
            <>
              {" "}
              <span className="display-quiet">{quiet}</span>
            </>
          )}
        </h2>
        {intro && <div className="mt-6 max-w-prose text-lead text-ink-soft">{intro}</div>}
      </Reveal>
    </div>
  );
}

export function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 md:py-28 ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}
