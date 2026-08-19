import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { ScrollProgress } from "@/components/scroll-progress";
import {
  CATEGORY_BY_ID,
  githubSkillFile,
  githubSkillUrl,
  relatedSkills,
  type Skill,
} from "@/data/skills";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "use-when", label: "Use when" },
  { id: "what", label: "What it is" },
  { id: "install", label: "Install" },
  { id: "related", label: "Related" },
] as const;

export function SkillView({ skill }: { skill: Skill }) {
  const category = CATEGORY_BY_ID[skill.category];
  const related = relatedSkills(skill);
  const singleInstall = `git clone ${SITE.repo}\ncp -R akakika-skills/skills/${skill.category}/${skill.slug} ~/.claude/skills/`;
  const [active, setActive] = useState("overview");
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setStuck(false);
    function onScroll() {
      setStuck(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [skill.slug]);

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (n): n is HTMLElement => Boolean(n),
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, [skill.slug]);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="pb-16">
      <ScrollProgress />

      <div
        className={cn(
          "fixed top-14 right-0 left-0 z-30 border-b border-divider bg-bg/90 backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out",
          stuck
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="mx-auto flex h-11 max-w-3xl items-center gap-3 px-4 sm:px-6">
          <span className="truncate font-mono text-sm text-fg">{skill.name}</span>
          <span className="hidden truncate text-xs text-subtle sm:inline">
            {category.name}
          </span>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-xs text-subtle">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-fg">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/" hash="catalog" className="hover:text-fg">
                {category.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-muted">{skill.name}</li>
          </ol>
        </nav>

        <header id="overview" className="scroll-mt-28">
          <p className="mt-8 font-mono text-xs text-subtle">
            {category.index} · {category.name}
          </p>
          <h1 className="font-display mt-3 text-3xl tracking-tight text-fg">
            {skill.name}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {skill.summary}
          </p>
        </header>

        <nav
          aria-label="On this page"
          className="mt-8 flex gap-1 overflow-x-auto border-y border-divider py-2 lg:hidden"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(s.id)}
              className={cn(
                "h-10 shrink-0 px-3 text-sm transition-colors",
                active === s.id ? "text-fg" : "text-subtle hover:text-fg",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_9.5rem] lg:items-start lg:gap-12">
          <div>
            <section id="use-when" className="mt-10 scroll-mt-28">
              <h2 className="text-sm font-medium text-fg">Use when</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {skill.useWhen}
              </p>
            </section>

            <section id="what" className="mt-10 scroll-mt-28">
              <h2 className="text-sm font-medium text-fg">What this skill is</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {skill.name} is an agent skill in the {SITE.name} collection. It
                is a SKILL.md file that teaches Claude Code, Codex, Cursor, and
                other skill-aware agents how to handle this job without inventing
                a half-remembered version of it. Read it, copy the folder, or
                install the full set.
              </p>
            </section>

            <section id="install" className="mt-10 scroll-mt-28">
              <h2 className="text-sm font-medium text-fg">
                Install just this skill
              </h2>
              <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-divider px-3 py-1.5">
                  <span className="text-xs text-subtle">Copy into Claude Code</span>
                  <CopyButton value={singleInstall} />
                </div>
                <pre className="overflow-x-auto px-4 py-4 font-mono text-sm text-fg">
                  <code>{singleInstall}</code>
                </pre>
              </div>
              <p className="mt-3 text-sm text-subtle">
                Or install everything with the{" "}
                <Link
                  to="/"
                  hash="install"
                  className="text-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  one-liner
                </Link>
                .
              </p>
            </section>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={githubSkillFile(skill)}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
              >
                Read SKILL.md
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </a>
              <a
                href={githubSkillUrl(skill)}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm text-fg hover:bg-elevated"
              >
                Folder on GitHub
              </a>
            </div>

            {related.length > 0 ? (
              <section id="related" className="mt-16 scroll-mt-28 border-t border-divider pt-10">
                <h2 className="text-sm font-medium text-fg">
                  Also in {category.name}
                </h2>
                <ul className="mt-4 divide-y divide-divider">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to="/skills/$slug"
                        params={{ slug: item.slug }}
                        className="flex flex-col gap-1 py-3 hover:text-fg sm:flex-row sm:gap-6"
                      >
                        <span className="shrink-0 font-mono text-sm text-fg sm:w-52">
                          {item.name}
                        </span>
                        <span className="text-sm text-muted">{item.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <p className="mt-12">
              <Link
                to="/"
                hash="catalog"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
              >
                <ArrowLeft className="size-4" strokeWidth={1.75} />
                Back to the collection
              </Link>
            </p>
          </div>

          <aside className="mt-10 hidden lg:sticky lg:top-32 lg:mt-10 lg:block">
            <p className="text-[11px] tracking-[0.16em] text-subtle uppercase">
              On this page
            </p>
            <nav aria-label="On this page" className="mt-3 flex flex-col">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.id)}
                  className={cn(
                    "border-l px-3 py-1.5 text-left text-sm transition-colors",
                    active === s.id
                      ? "border-fg text-fg"
                      : "border-divider text-subtle hover:text-fg",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      </article>
    </div>
  );
}
