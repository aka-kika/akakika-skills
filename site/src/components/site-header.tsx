import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ onSearch }: { onSearch: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-baseline gap-1.5 text-sm tracking-tight text-fg"
        >
          <span className="font-medium">akakika</span>
          <span className="text-subtle">skills</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm text-muted md:flex"
        >
          <a href="/#catalog" className="transition-colors hover:text-fg">
            Skills
          </a>
          <a href="/#install" className="transition-colors hover:text-fg">
            Install
          </a>
          <a href="/#how" className="transition-colors hover:text-fg">
            How it works
          </a>
          <a href="/#faq" className="transition-colors hover:text-fg">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex h-11 items-center gap-2 rounded-md px-2.5 text-subtle transition-colors hover:bg-elevated hover:text-fg"
            aria-label="Search skills"
          >
            <Search className="size-4" strokeWidth={1.75} />
            <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:inline">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <a
            href="https://github.com/aka-kika/akakika-skills"
            className="hidden h-11 items-center px-2 text-sm text-muted transition-colors hover:text-fg sm:inline-flex"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
