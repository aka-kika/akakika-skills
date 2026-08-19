import { createFileRoute } from "@tanstack/react-router";
import { SKILLS } from "@/data/skills";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = "2026-08-14";
        const urls = [
          { loc: `${origin}/`, changefreq: "weekly", priority: "1.0" },
          ...SKILLS.map((s) => ({
            loc: `${origin}/skills/${s.slug}`,
            changefreq: "monthly",
            priority: "0.8",
          })),
          { loc: `${origin}/llms.txt`, changefreq: "weekly", priority: "0.4" },
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
