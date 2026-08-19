# akakika-skills — site

The landing page for the collection: catalog, per-skill pages, install
instructions, FAQ, plus `llms.txt`, `sitemap.xml`, and `robots.txt`.

TanStack Start + React 19 + Tailwind v4. All content is static data in
[`src/data/skills.ts`](src/data/skills.ts) and [`src/data/faq.ts`](src/data/faq.ts)
— when a skill is added or renamed in `skills/`, update those two files (counts
live in [`src/lib/site.ts`](src/lib/site.ts)).

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # Vercel-ready output (nitro preset "vercel")
```

Deploying on Vercel: set the project root to `site/` and set
`VITE_PUBLIC_HOSTNAME` to the public hostname (enables canonical URLs and the
`og.jpg` social card).
