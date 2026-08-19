import type { ReactNode } from "react";

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-b border-divider">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-subtle uppercase">
          How skills work
        </p>
        <h2 className="mt-3 max-w-lg text-xl font-medium tracking-tight text-fg">
          A folder. A “Use when…”. The craft underneath.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Each skill is a self-contained folder with a SKILL.md. Agents read the
          frontmatter to decide relevance, then pull the body on demand. You can
          also just open the file — it is Markdown, not a plugin.
        </p>

        <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-surface">
          <figcaption className="border-b border-divider px-4 py-2 text-xs text-subtle">
            skills/apple-hig/apple-hig-sidebars/SKILL.md
          </figcaption>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-fg">
            <code>{`---
name: apple-hig-sidebars
description: Use when designing, reviewing,
  or implementing a sidebar for an
  Apple-platform app.
---

# Apple HIG Sidebars
…the craft.`}</code>
          </pre>
        </figure>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <Point title="Specific, not generic">
            Real expertise over promptable advice. A sharp trigger so the agent
            knows when to reach for it — and when not to.
          </Point>
          <Point title="Complete, not a sketch">
            Rules, code, and checklists in one file. Enough to do the job
            without a second conversation to fill the gaps.
          </Point>
          <Point title="Taste as the through-line">
            Calm UI, native patterns, privacy by default, and agent workflows
            that do not fall apart on the second run.
          </Point>
        </div>
      </div>
    </section>
  );
}

function Point({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-fg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}
