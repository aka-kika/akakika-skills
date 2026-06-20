---
name: blog-post-publishing
description: Use when the user asks to create, add, convert, publish, or deploy a blog post from a draft, notes, Markdown, outline, or topic. Turns a draft into a complete, SEO/GEO-optimized post wired into the site (template, blog index, sitemap, routing) with QA and deploy. Framework-agnostic — discover the project's own conventions first.
---

# Blog Post Publishing

Turn a draft or topic into a complete, well-structured blog post and ship it on the user's own site. This skill is framework-agnostic: it describes the *pattern* every blog shares — a post template, a blog index, a sitemap, routing, and a deploy step — and tells you to learn the project's actual conventions before editing anything.

## Discover the site first

Before writing, read the project's `AGENTS.md` / `README` and inspect how existing posts are built. Find the project's equivalents of:

- **Post template** — the HTML/MDX/Markdown shell new posts copy (hero, body, share/nav, CTA)
- **Published posts** — where rendered posts live (e.g. `public/blog/`, `content/posts/`, `src/pages/blog/`)
- **Blog index** — the list or route that shows all posts (a `BLOG_POSTS` array, a content collection, a CMS)
- **Sitemap** — `sitemap.xml` or its generator
- **Routing / rewrites** — how a slug maps to a page (`vercel.json`, framework routing, `astro.config`, etc.)
- **Icons / assets** — where post images and tool/logo icons live
- **Deploy** — the build + deploy commands (Vercel, Netlify, CI, `npm run build`, …)

Mirror the existing patterns exactly. Do not invent a new structure.

## Workflow

1. **Plan the post.**
   - Pick a lowercase-hyphen slug.
   - Set: title, description, category, publish date, read time, deck/subtitle, canonical URL, CTA, and (for project/app posts) the landing-page URL and source/repo URL.
   - If the draft is incomplete, use the site's content checklist/template as the outline.
   - For project/app posts, find the real landing page and repo from project files (`package.json`, README links, config). Mark unknowns explicitly and resolve them before publish.

2. **Create the post from the template.**
   - Copy the site's post template to the right location as `<slug>`.
   - Replace every placeholder. Preserve the template's contract: nav, scroll/share affordances, reveal/section markers, CTA box, footer.
   - Keep the canonical URL consistent with the site's pattern.
   - Save a durable source copy (e.g. `<slug>.md`) alongside the rendered post, so the source isn't only in the deploy-facing folder.

3. **Build the article structure.**
   - Hero: category, date, title, deck, read time.
   - Body: a strong opening, clear `h2` sections with section markers, lists/steps/quotes where the content calls for them, and a closing section.
   - For project/app posts: include a links block (landing page + source/repo), styled consistently with the rest of the post.
   - CTA: one clear call to action that matches the post topic.

4. **Use the site's assets.**
   - Choose icons/images from the project's existing asset folders; copy any new asset into the correct location.
   - Keep asset paths in the form the site already uses (relative vs absolute) — don't introduce remote URLs or arbitrary folders.

5. **Wire it into the index + routing.**
   - Add the post to the blog index (array / collection / CMS entry) with metadata casing that matches nearby posts.
   - Add any routing/rewrite entry the site needs to serve the slug.

6. **SEO / GEO optimization** (after the post HTML exists):
   - **Query map** — define one primary search intent, 3–5 supporting queries, and the named entities/tools/products the post should be associated with.
   - **SERP metadata** — `<title>`, meta description, canonical, OG/Twitter tags, publish date, and deck all aligned, with no keyword stuffing.
   - **Answerability** — add concise definitions, scannable steps, comparison bullets, and a short "what this is best for" passage so AI answer engines can quote and summarize the page accurately.
   - **Entity signals** — link internally to relevant pages and externally to the repo, official docs, or source material when cited.
   - **Structured data** — add or verify `Article`/`BlogPosting` JSON-LD (headline, description, author, datePublished, dateModified, canonical, image, mainEntityOfPage, and `sameAs` for the repo). Add FAQ/HowTo schema only when the visible article genuinely contains that structure.
   - **Snippet pass** — improve headings, first paragraph, alt text, CTA copy, and link labels for search previews and AI summaries.
   - **Freshness pass** — sitemap `lastmod`, visible publish date, JSON-LD dates, and index date all match.

7. **Update the sitemap** — add the post URL with the publish date as `lastmod`.

8. **Verify before deploy.**
   - No unresolved placeholders (`rg "\{\{" <post-file>`, or your template's marker).
   - The source/archive copy exists.
   - Referenced icons/images exist.
   - Run the project's `lint` + `build`.
   - If doing browser QA, save screenshots in a dated QA folder — never the project root.

9. **Deploy.**
   - Run the project's production deploy only after verification (unless the user asked for a draft-only change).
   - Confirm the deployment is live and the domain/aliases are attached.

## Quality bar

- The post is useful as a standalone artifact, not just a formatted draft.
- A specific CTA that matches the topic.
- Concrete examples, tools, screenshots, or steps over vague commentary.
- Answerable by both readers and AI search systems: clear entity names, direct source links, compact explanations, no invented claims.
- Consistent with the site's existing visual contract.
- Never delete user files during cleanup; never save QA captures in the project root.

## Final response

Report: post file path, source/archive path, index + routing + sitemap update status, assets used, landing/repo URLs, CTA label + URL, SEO/GEO checks completed, lint/build results, and the deployment URL/status if deployed.
