import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme-aware colors via CSS variables
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          elevated: "var(--bg-elevated)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
        },
        accent: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
          glow: "var(--accent-glow)",
        },
        border: {
          subtle: "var(--border-subtle)",
          muted: "var(--border-muted)",
          strong: "var(--border-strong)",
        },
        card: {
          bg: "var(--card-bg)",
          border: "var(--card-border)",
          hover: "var(--card-hover-bg)",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "Monaco", "Courier New", "monospace"],
      },
      fontSize: {
        // Display - For Hero sections
        "display-xl": ["clamp(3.5rem, 8vw, 6rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-lg": ["clamp(3rem, 6vw, 4.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],

        // Headings - For Section headings
        "heading-xl": ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-lg": ["clamp(2rem, 4vw, 2.75rem)", { lineHeight: "1.25", letterSpacing: "0", fontWeight: "600" }],
        "heading-md": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "600" }],
        "heading-sm": ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.35", letterSpacing: "0", fontWeight: "600" }],

        // Body - For general text
        "body-lg": ["1.125rem", { lineHeight: "1.7", letterSpacing: "0" }],
        "body": ["1rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0" }],
        "caption": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],

        // Legacy compatibility
        "hero": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "section": ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "subheading": ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.4" }],
      },
      spacing: {
        // 8px Base Grid
        "0.5": "0.125rem",  // 2px
        "1": "0.25rem",     // 4px
        "2": "0.5rem",      // 8px
        "3": "0.75rem",     // 12px
        "4": "1rem",        // 16px
        "5": "1.25rem",     // 20px
        "6": "1.5rem",      // 24px
        "8": "2rem",        // 32px
        "10": "2.5rem",     // 40px
        "12": "3rem",       // 48px
        "16": "4rem",       // 64px
        "20": "5rem",       // 80px
        "24": "6rem",       // 96px
        "32": "8rem",       // 128px
        "40": "10rem",      // 160px
        "48": "12rem",      // 192px
        // Custom
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "container": "1280px",
        "content": "1200px",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "soft": "var(--shadow-soft)",
        "medium": "var(--shadow-medium)",
        "strong": "var(--shadow-strong)",
        "glow": "var(--shadow-glow)",
        "glow-strong": "var(--shadow-glow-strong)",
        // Legacy compatibility
        "premium": "var(--shadow-medium)",
        "premium-lg": "var(--shadow-strong)",
        "glow-lg": "var(--shadow-glow-strong)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "gradient": "gradient 8s linear infinite",
        "gradient-text": "gradientText 3s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        gradientText: {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "var(--shadow-glow)" },
          "100%": { boxShadow: "var(--shadow-glow-strong)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
