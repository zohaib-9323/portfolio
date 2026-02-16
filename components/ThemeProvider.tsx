"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  systemTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved) return saved;

  // Check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [systemTheme, setSystemTheme] = useState<Theme>("dark");

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);

      // Only apply system theme if user hasn't set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(newSystemTheme);
        applyTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    // Remove both classes first
    root.classList.remove("dark", "light");

    // Add the appropriate class
    root.classList.add(newTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        newTheme === "dark" ? "#0B0F19" : "#F8FAFC"
      );
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Always provide context, even during SSR/hydration
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
