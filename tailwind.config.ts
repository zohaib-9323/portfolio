import type { Config } from "tailwindcss";

const channel = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: channel("paper"), raised: channel("paper-raised"), sunk: channel("paper-sunk") },
        ink: { DEFAULT: channel("ink"), soft: channel("ink-soft") },
        muted: channel("muted"),
        line: { DEFAULT: channel("line"), strong: channel("line-strong") },
        accent: { DEFAULT: channel("accent"), edge: channel("accent-edge"), on: channel("on-accent") },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        mega: ["clamp(3rem, 8.6vw, 8.25rem)", { lineHeight: "0.9", letterSpacing: "-0.045em" }],
        title: ["clamp(2.3rem, 5.2vw, 4.6rem)", { lineHeight: "0.96", letterSpacing: "-0.04em" }],
        "title-sm": ["clamp(1.6rem, 2.6vw, 2.25rem)", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        lead: ["clamp(1.1rem, 1.5vw, 1.3rem)", { lineHeight: "1.55" }],
      },
      maxWidth: {
        prose: "62ch",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
