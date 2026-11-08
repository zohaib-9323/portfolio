"use client";

import { useTheme } from "./ThemeProvider";

/** A small switch: the knob slides to the dark / light side. Half-filled disc instead of sun / moon. */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={toggleTheme}
      aria-label="Dark theme"
      title={`Switch to ${dark ? "light" : "dark"} theme`}
      className="relative h-8 w-[3.25rem] flex-none rounded-full border-[1.5px] border-ink bg-paper shadow-[inset_0_2px_3px_rgb(0_0_0/0.15)]"
    >
      <span
        aria-hidden
        className={`absolute top-[3px] grid h-[22px] w-[22px] place-items-center rounded-full bg-ink text-paper shadow-[0_2px_0_rgb(0_0_0/0.25)] transition-transform duration-300 ease-out ${
          dark ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      >
        <svg viewBox="0 0 20 20" className={`h-3 w-3 transition-transform duration-500 ${dark ? "rotate-180" : ""}`}>
          <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M10 3a7 7 0 0 1 0 14z" fill="currentColor" />
        </svg>
      </span>
    </button>
  );
}
