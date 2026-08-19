import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-divider">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="max-w-sm">
          <p className="text-sm text-fg">akakika-skills</p>
          <p className="mt-2 text-sm text-subtle">
            {SITE.skillCount} agent skills for building calm, native-feeling
            software — and for running AI coding agents well.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"
        >
          <Link to="/" className="hover:text-fg">
            Home
          </Link>
          <a href="/#catalog" className="hover:text-fg">
            Catalog
          </a>
          <a href={SITE.repo} className="hover:text-fg">
            GitHub
          </a>
          <a href={SITE.author.url} className="hover:text-fg">
            {SITE.author.name}
          </a>
          <a href="/llms.txt" className="hover:text-fg">
            llms.txt
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl border-t border-divider px-4 py-4 text-xs text-subtle sm:px-6">
        MIT © {SITE.year} {SITE.author.name}. Use them, ship with them, remix
        them.
      </div>
    </footer>
  );
}
