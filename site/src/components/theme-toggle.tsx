import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, readTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-11 place-items-center rounded-md text-muted transition-colors duration-150 hover:bg-elevated hover:text-fg"
    >
      {theme === "dark" ? (
        <Moon className="size-4" strokeWidth={1.75} />
      ) : (
        <Sun className="size-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
