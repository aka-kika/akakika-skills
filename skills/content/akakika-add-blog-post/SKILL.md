---
name: akakika-add-blog-post
description: Use when the user asks to create, add, convert, publish, or deploy a new AKAKIKA/KIKA Journal blog post from a draft, notes, Markdown, outline, or topic. Adds and publishes a new blog post for the AKAKIKA site at akakika.com; includes the required blog HTML structure, icon shelf, landing-page and GitHub repo links, CTA, React blog index updates, sitemap/rewrite updates, SEO/GEO optimization, QA, and Vercel production deployment.
---

# AKAKIKA Add Blog Post

> Written for akakika.com — adapt the domain, paths, and voice to your own site.

Use this skill to turn a draft or topic into a complete AKAKIKA Journal post and ship it on `akakika.com`.

## Site Root

Default site root (point this at your own site repo):

```text
<your-site-repo>
```

Before editing, read applicable `AGENTS.md` files and inspect current blog patterns in:

- `templates/blog-post-template.html`
- `templates/blog-structure-template.md`
- `templates/icons/`
- `public/blog/`
- `src/App.tsx`
- `public/sitemap.xml`
- `vercel.json`

## Post Workflow

1. Create or normalize the post plan.
   - Choose a lowercase hyphen slug.
   - Set title, description, category, month/year, exact publish date, read time, deck, canonical URL, CTA, landing page URL, and GitHub repo URL.
   - Use `templates/blog-structure-template.md` as the content checklist when the draft is incomplete.
   - For project/app posts, find the real landing page and repo from project files, `package.json`, README links, `src/App.tsx`, Vercel config, or the user's draft. Mark unknowns explicitly during planning, then resolve them before publish whenever possible.
   - If no landing page is available, set the landing page URL to the AKAKIKA home page: `https://akakika.com`.
   - If no GitHub repository is available, set the GitHub repo/source URL to the profile: `https://github.com/dot-RealityTest`.

2. Use the canonical HTML shell.
   - Copy `templates/blog-post-template.html` to `public/blog/<slug>.html`.
   - Replace every `{{PLACEHOLDER}}`.
   - Preserve the nav, scroll progress bar, share buttons, reveal classes, copy-link script, section-marker pattern, CTA box, and minimal footer contract.
   - Keep the canonical URL as `https://akakika.com/blog/<slug>`.
   - Save durable repo copies under `blogs/<slug>.html` and `blogs/<slug>.md` after the post is created so the post source is not only in deploy-facing `public/blog/`.

3. Build the article structure.
   - Hero: category tag, month/year, title, deck, publish date, read time.
   - Tool shelf: exactly four icon items unless the template changes.
   - Body: opening paragraphs, clear `section-marker` blocks before main `h2` sections, useful lists/steps/quote where the content calls for them, and a final closing section.
   - Project links: include a polished two-link project block after the CTA with the landing page and GitHub repo/source link. Use `github_icon.png` for the repo link, keep the visual style consistent with the shelf/CTA, and never leave the block out of project/app posts. If specific project links are unavailable, use `https://akakika.com` and `https://github.com/dot-RealityTest`.
   - CTA: include one `cta-box` with `CTA_TITLE`, `CTA_COPY`, `CTA_LABEL`, and `CTA_URL`. Prefer internal AKAKIKA URLs such as `/apps`, `/blog`, or a relevant app page unless the post is explicitly about an external product.

4. Use the correct icons.
   - Choose icon filenames from `templates/icons/`.
   - Use only filenames in template placeholders, for example `codex_icon.png`.
   - Use the existing `home_icon_clean.png` for landing page links and `github_icon.png` for GitHub project links; the raw HTML template points to `icons/<filename>`, and renderer-generated pages default to `/blog/icons/<filename>`.
   - In final standalone HTML under `public/blog/`, icon paths must stay relative: `icons/<filename>`.
   - Copy any selected icon from `templates/icons/` to `public/blog/icons/` when it is not already present there.
   - Do not use remote icon URLs, project-root icon paths, or arbitrary asset folders.

5. Update the React blog index when the post should appear on `/blog`.
   - Add an entry to `BLOG_POSTS` in `src/App.tsx`.
   - Add matching four-item `BLOG_TOOL_STACK[slug]` entries using `/blog/icons/<filename>` paths.
   - Add the slug to `STANDALONE_BLOG_IDS` so archive clicks open the styled standalone page.
   - Keep category/status/read-time casing consistent with nearby posts.

6. Update routing and baseline SEO.
   - Add a `vercel.json` rewrite near the existing blog rewrites:

```json
{ "source": "/blog/<slug>", "destination": "/blog/<slug>.html" }
```

   - Add a `public/sitemap.xml` URL entry for `https://akakika.com/blog/<slug>` with the publish date as `lastmod`.
   - If the post has a custom social image, put the image under `public/` and update `og:image`; otherwise keep `https://akakika.com/og-image.png`.

7. Run the SEO/GEO optimization pipeline after the post HTML exists.
   - Query map: define one primary search intent, 3-5 supporting queries, and the named entities/tools/products the post should be associated with.
   - SERP-ready metadata: ensure `<title>`, meta description, canonical, OG/Twitter tags, publish date, and hero deck all align without keyword stuffing.
   - Answerability: add concise definitions, scannable steps, comparison bullets, and a short "what this is best for" passage when true to the draft, so AI answer engines can quote and summarize the page accurately.
   - Entity signals: link internally to relevant AKAKIKA pages (`/apps`, `/blog`, app landing pages) and externally to the GitHub repo, official docs, or source material when cited.
   - Structured data: add or verify `Article`/`BlogPosting` JSON-LD with headline, description, author, datePublished, dateModified, canonical URL, image, mainEntityOfPage, landing page URL, and sameAs GitHub repo. Add FAQ/HowTo schema only when the visible article genuinely contains that structure.
   - GEO polish: include clear product/app names, alternate names if useful, repository URL, landing page URL, creator name, and direct "source of truth" links in visible content.
   - Snippet pass: improve headings, first paragraph, alt text, CTA copy, and project-link labels for search previews and AI summaries.
   - Freshness pass: ensure sitemap `lastmod`, visible publish date, JSON-LD dates, and React index date match exactly.
   - Archive pass: ensure `blogs/<slug>.html` mirrors the final standalone post and `blogs/<slug>.md` contains the source draft or normalized Markdown.
   - Validation: check for unresolved placeholders, broken internal links, missing icon files, duplicate titles/descriptions, missing `blogs/` archive files, and empty `alt` text before build.

8. Verify before deploy.
   - Check for unresolved placeholders:

```bash
rg "\\{\\{" public/blog/<slug>.html
```

   - Confirm archive copies exist:

```bash
ls blogs/<slug>.html blogs/<slug>.md
```

   - Confirm selected icons exist:

```bash
ls public/blog/icons/<icon-file>
```

   - Run:

```bash
npm run lint
npm run build
```

   - If doing browser QA, save screenshots only under `screenshots/browser-qa/YYYY-MM-DD/`.

9. Deploy.
   - Deploy production after verification unless the user explicitly asked for a draft-only change:

```bash
vercel deploy --prod -y --no-wait
```

   - Inspect the deployment URL until ready:

```bash
vercel inspect <deployment-url>
```

   - Confirm the deployment aliases include `akakika.com` and `www.akakika.com`; use manual alias commands only if Vercel does not attach domains automatically.

## Quality Bar

- Make the post useful as a standalone artifact, not just a formatted draft.
- Write a specific CTA that matches the post topic.
- Prefer concrete examples, tools, screenshots, or steps over vague commentary.
- Make the post answerable by both readers and AI search systems: clear entity names, direct source links, compact explanations, and no invented claims.
- Keep the AKAKIKA visual contract: bold uppercase hero, system/tool shelf, compact metadata, gray KIKA palette, minimal footer.
- Always include a landing page link and GitHub repo/source link for project/app posts. If a specific app page or repository is unavailable, default to `https://akakika.com` for the landing page and `https://github.com/dot-RealityTest` for the GitHub link, then note that fallback in the final response.
- Do not save screenshots or QA captures in the project root.
- Do not delete user files during cleanup.

## Final Response Checklist

Report:

- blog file path
- `blogs/` archive file paths
- `src/App.tsx`, `vercel.json`, and `public/sitemap.xml` update status
- icon files used
- landing page URL and GitHub repo URL
- CTA label and URL
- SEO/GEO checks completed
- lint/build results
- deployment URL and inspect/alias status, if deployed
