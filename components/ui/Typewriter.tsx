"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type TypewriterSegment = {
  text: string;
  className?: string;
};

type TypewriterProps = {
  segments: TypewriterSegment[];
  /** ms per character */
  speed?: number;
  /** ms pause between lines */
  linePause?: number;
  className?: string;
  lineClassName?: string;
  showCursor?: boolean;
  onComplete?: () => void;
};

function flattenSegments(segments: TypewriterSegment[]) {
  const chars: { char: string; className?: string; lineBreakBefore?: boolean }[] = [];
  segments.forEach((seg, segIndex) => {
    const lines = seg.text.split("\n");
    lines.forEach((line, lineIdx) => {
      if (lineIdx > 0) {
        chars.push({ char: "\n", className: seg.className, lineBreakBefore: true });
      }
      for (const char of line) {
        chars.push({ char, className: seg.className });
      }
    });
    if (segIndex < segments.length - 1 && !seg.text.endsWith("\n")) {
      // no-op between segments on same line
    }
  });
  return chars;
}

function groupIntoLines(
  chars: { char: string; className?: string }[],
  visibleCount: number
) {
  const visible = chars.slice(0, visibleCount);
  const lines: { char: string; className?: string }[][] = [[]];
  for (const item of visible) {
    if (item.char === "\n") {
      lines.push([]);
      continue;
    }
    lines[lines.length - 1].push(item);
  }
  return lines.filter((line) => line.length > 0 || visible.some((c) => c.char === "\n"));
}

export function Typewriter({
  segments,
  speed = 42,
  linePause = 280,
  className,
  lineClassName,
  showCursor = true,
  onComplete,
}: TypewriterProps) {
  const chars = useMemo(() => flattenSegments(segments), [segments]);
  const [count, setCount] = useState(0);
  const done = count >= chars.length;

  useEffect(() => {
    setCount(0);
  }, [segments]);

  useEffect(() => {
    if (done) {
      onComplete?.();
      return;
    }
    const prev = chars[count - 1];
    const delay =
      prev?.char === "\n" ? linePause : speed;
    const id = setTimeout(() => setCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [count, chars, done, speed, linePause, onComplete]);

  const lines = groupIntoLines(chars, count);

  return (
    <span className={cn("inline-block", className)} aria-live="polite">
      {lines.map((line, lineIdx) => (
        <span
          key={lineIdx}
          className={cn("block", lineClassName)}
        >
          {line.map((item, i) => (
            <span key={`${lineIdx}-${i}`} className={item.className}>
              {item.char}
            </span>
          ))}
          {showCursor && lineIdx === lines.length - 1 && !done && (
            <span className="typewriter-cursor ml-0.5 inline-block w-[3px] align-middle" />
          )}
        </span>
      ))}
      {showCursor && done && (
        <span className="typewriter-cursor ml-0.5 inline-block w-[3px] align-middle opacity-60" />
      )}
    </span>
  );
}
