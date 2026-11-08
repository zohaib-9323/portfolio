"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#ai", label: "AI" },
  { href: "#experience", label: "Experience" },
  { href: "#toolkit", label: "Toolkit" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in the middle of the viewport
  useEffect(() => {
    const sections = ["#top", ...NAV.map((n) => n.href), "#contact"]
      .map((sel) => document.querySelector(sel))
      .filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "top" ? "" : `#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        open ? "border-line bg-paper" : scrolled ? "border-line bg-paper/85 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <div className="wrap relative flex h-[4.5rem] items-center justify-between">
        <a href="#top" onClick={() => setOpen(false)} className="flex items-center gap-3 text-ink" aria-label="Zohaib Asghar, back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/profile/avatar.jpg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-[1.5px] ring-ink ring-offset-2 ring-offset-paper"
          />
          <span className="hidden text-[0.95rem] font-semibold tracking-[-0.01em] sm:inline">Zohaib Asghar</span>
        </a>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line p-1 md:flex"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "true" : undefined}
              className={`rounded-full px-4 py-1.5 text-[0.9rem] transition-colors ${
                active === item.href ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden rounded-full bg-ink px-4 py-2 text-[0.9rem] font-medium text-paper transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="relative h-10 w-10 rounded-full border-[1.5px] border-ink text-ink md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 bg-current transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 bg-current transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="wrap h-[calc(100dvh-4.5rem)] bg-paper pb-10 pt-4 md:hidden">
          <ul className="border-t-[1.5px] border-ink">
            {[...NAV, { href: "#contact", label: "Contact" }].map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display flex items-baseline justify-between py-5 text-[2.4rem] leading-none"
                >
                  {item.label}
                  <span className="label">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
