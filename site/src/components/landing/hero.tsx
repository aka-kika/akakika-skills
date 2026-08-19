import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section className="border-b border-divider">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_18rem] lg:items-end">
        <div>
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">
            Agent skills
          </p>
          <h1 className="font-display mt-4 max-w-xl text-3xl leading-[1.12] tracking-tight text-fg">
            Teach your coding agent one thing well.
          </h1>
          <p
            id="definition"
            className="speakable mt-6 max-w-xl text-base leading-relaxed text-muted"
          >
            {SITE.definition}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#install"
              className="inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 active:scale-[0.96]"
            >
              Install on a Mac
            </a>
            <a
              href={SITE.repo}
              className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-elevated"
            >
              View the collection
            </a>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-2">
          <Stat value="40" label="Skills" />
          <Stat value="9" label="Categories" />
          <Stat value="SKILL.md" label="Format" />
          <Stat value="MIT" label="License" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-subtle uppercase">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-fg">{value}</dd>
    </div>
  );
}
