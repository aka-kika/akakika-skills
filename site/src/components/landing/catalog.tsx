import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { CATEGORIES, SKILLS, type CategoryId } from "@/data/skills";
import { cn } from "@/lib/cn";

type Filter = "all" | CategoryId;

export function Catalog({ initialQuery = "" }: { initialQuery?: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState(initialQuery);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SKILLS.filter((s) => {
      if (filter !== "all" && s.category !== filter) return false;
      if (!q) return true;
      return (
        s.name.includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.useWhen.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  return (
    <section id="catalog" className="scroll-mt-16 border-b border-divider">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.18em] text-subtle uppercase">
              The collection
            </p>
            <h2 className="mt-3 text-xl font-medium tracking-tight text-fg">
              Forty skills. Nine chapters.
            </h2>
          </div>
          <p className="text-sm text-subtle" aria-live="polite">
            {visible.length} of {SKILLS.length}
          </p>
        </div>

        <label className="sr-only" htmlFor="skill-filter">
          Filter skills
        </label>
        <input
          id="skill-filter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name or job…"
          className="mt-8 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:max-w-sm"
        />

        <div className="mt-8 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
          <nav
            aria-label="Skill categories"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:sticky lg:top-20 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
          >
            <FilterChip
              active={filter === "all"}
              onClick={() => {
                setFilter("all");
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              All
              <span className="text-subtle">{SKILLS.length}</span>
            </FilterChip>
            {CATEGORIES.map((cat) => {
              const count = SKILLS.filter((s) => s.category === cat.id).length;
              return (
                <FilterChip
                  key={cat.id}
                  active={filter === cat.id}
                  onClick={() => {
                    setFilter(cat.id);
                    window.requestAnimationFrame(() => {
                      document
                        .getElementById(`cat-${cat.id}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    });
                  }}
                >
                  <span className="font-mono text-[10px] text-subtle">
                    {cat.index}
                  </span>
                  {cat.name}
                  <span className="text-subtle">{count}</span>
                </FilterChip>
              );
            })}
          </nav>

          <div className="mt-6 divide-y divide-divider border-t border-divider lg:mt-0">
            {CATEGORIES.map((cat) => {
              const items = visible.filter((s) => s.category === cat.id);
              if (items.length === 0) return null;
              return (
                <section
                  key={cat.id}
                  className="py-8"
                  aria-labelledby={`cat-${cat.id}`}
                >
                  <header className="mb-4">
                    <h3
                      id={`cat-${cat.id}`}
                      className="text-sm font-medium text-fg"
                    >
                      <span className="mr-2 font-mono text-xs text-subtle">
                        {cat.index}
                      </span>
                      {cat.name}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm text-muted">{cat.line}</p>
                  </header>
                  <ul>
                    {items.map((skill) => (
                      <li key={skill.slug}>
                        <Link
                          to="/skills/$slug"
                          params={{ slug: skill.slug }}
                          className="group flex flex-col gap-1 rounded-md px-2 py-3 transition-colors hover:bg-elevated sm:flex-row sm:items-baseline sm:gap-6"
                        >
                          <span className="shrink-0 font-mono text-sm text-fg sm:w-56">
                            {skill.name}
                            {skill.featured ? (
                              <span className="ml-2 text-[10px] tracking-wide text-accent uppercase">
                                start here
                              </span>
                            ) : null}
                          </span>
                          <span className="text-sm leading-relaxed text-muted group-hover:text-fg">
                            {skill.summary}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
            {visible.length === 0 ? (
              <p className="py-12 text-sm text-subtle">
                Nothing matches that filter. Try a category, or search
                “palette”, “privacy”, or “gate”.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150",
        active
          ? "bg-elevated text-fg"
          : "text-muted hover:bg-elevated hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
