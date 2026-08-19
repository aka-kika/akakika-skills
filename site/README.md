# akakika-skills — site

The landing page for the collection, live at
[akakika-skills.vercel.app](https://akakika-skills.vercel.app): catalog,
per-skill pages, install instructions, FAQ, plus `llms.txt`, `sitemap.xml`,
and `robots.txt`.

TanStack Start + React 19 + Tailwind v4. All content is static data in
[`src/data/skills.ts`](src/data/skills.ts) and [`src/data/faq.ts`](src/data/faq.ts)
— when a skill is added or renamed in `skills/`, update those two files (counts
live in [`src/lib/site.ts`](src/lib/site.ts)).

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # Vercel-ready output (nitro preset "vercel")
```

Deployed on Vercel with the project root set to `site/`. Canonical URLs and
the `og.jpg` social card default to the vercel.app hostname baked into
[`src/lib/site.ts`](src/lib/site.ts) (`urlFallback`); set `VITE_PUBLIC_HOSTNAME`
at build time to override it, e.g. when moving to a custom domain.
