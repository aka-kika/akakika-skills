import type { ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";
import { SITE } from "@/lib/site";

export function Install() {
  return (
    <section id="install" className="scroll-mt-16 border-b border-divider">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-subtle uppercase">
          Install
        </p>
        <h2 className="mt-3 max-w-lg text-xl font-medium tracking-tight text-fg">
          One command. Forty skills. Every agent it knows about.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          The installer clones the repo and symlinks each skill into Claude
          Code, Cursor, Codex, Grok, Goose, and ~/.agents/skills. Later updates
          are a git pull.
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-divider px-3 py-1.5">
            <span className="text-xs text-subtle">Terminal</span>
            <CopyButton value={SITE.installCommand} />
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-sm text-fg">
            <code>{SITE.installCommand}</code>
          </pre>
        </div>

        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          <Step n="01" title="Run the installer">
            Paste the command in Terminal. Use --dry-run first if you want to
            see the plan.
          </Step>
          <Step n="02" title="Agents pick them up">
            Each skill folder lands where the agent already looks. Invoke by
            name, or let the “Use when…” line decide.
          </Step>
          <Step n="03" title="Update in place">
            Symlinks track the clone. git pull brings edits; re-run install.sh
            only when new skill names appear.
          </Step>
        </ol>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="list-none">
      <p className="font-mono text-xs text-subtle">{n}</p>
      <h3 className="mt-2 text-sm font-medium text-fg">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
    </li>
  );
}
