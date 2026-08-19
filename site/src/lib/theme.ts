const STORAGE_KEY = "kika-theme";

export type Theme = "dark" | "light";

export function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export const THEME_INIT_SCRIPT = `(function(){try{var k='kika-theme';var s=localStorage.getItem(k);var light=s==='light'||(!s&&window.matchMedia('(prefers-color-scheme: light)').matches);document.documentElement.classList.toggle('light',light);document.documentElement.classList.toggle('dark',!light);}catch(e){document.documentElement.classList.add('dark');}})();`;
