"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "texthelper-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage can throw in private browsing / blocked storage - fall through
  }
  return "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const pref = readStoredPreference();
    setPreferenceState(pref);
    setTheme(pref === "system" ? getSystemTheme() : pref);
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setTheme(getSystemTheme());
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [preference]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      if (pref === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // ignore storage failures - theme still applies for this session
    }
    setTheme(pref === "system" ? getSystemTheme() : pref);
  }, []);

  const value = useMemo(() => ({ theme, preference, setPreference }), [theme, preference, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
