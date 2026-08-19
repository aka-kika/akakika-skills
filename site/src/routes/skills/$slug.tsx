import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { JsonLd } from "@/components/json-ld";
import { SkillView } from "@/components/skill/skill-view";
import { SiteShell } from "@/components/site-shell";
import { SKILL_BY_SLUG, SKILLS } from "@/data/skills";
import { breadcrumbJsonLd, skillJsonLd } from "@/lib/json-ld";
import { SITE, absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/skills/$slug")({
  loader: ({ params }) => {
    const skill = SKILL_BY_SLUG[params.slug];
    if (!skill) throw notFound();
    return { skill };
  },
  head: ({ loaderData }) => {
    const skill = loaderData?.skill;
    if (!skill) return {};
    const title = `${skill.name} — ${SITE.name}`;
    const description = skill.summary;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: absoluteUrl(`/skills/${skill.slug}`) },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [
        { rel: "canonical", href: absoluteUrl(`/skills/${skill.slug}`) },
      ],
    };
  },
  component: SkillPage,
  notFoundComponent: SkillNotFound,
});

function SkillPage() {
  const { skill } = Route.useLoaderData();
  return (
    <SiteShell>
      <JsonLd data={skillJsonLd(skill)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/#catalog" },
          { name: skill.name, path: `/skills/${skill.slug}` },
        ])}
      />
      <SkillView skill={skill} />
    </SiteShell>
  );
}

function SkillNotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-medium text-fg">Skill not found</h1>
        <p className="mt-3 text-sm text-muted">
          That name is not in the {SKILLS.length}-skill collection.
        </p>
        <Link
          to="/"
          hash="catalog"
          className="mt-6 inline-flex h-11 items-center rounded-md border border-border px-4 text-sm text-fg hover:bg-elevated"
        >
          Browse skills
        </Link>
      </div>
    </SiteShell>
  );
}
