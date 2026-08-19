import { FAQ } from "@/data/faq";
import { CATEGORIES, SKILLS, type Skill } from "@/data/skills";
import { SITE, absoluteUrl } from "@/lib/site";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    inLanguage: "en",
    publisher: personJsonLd(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd() {
  return {
    "@type": "Person",
    name: SITE.author.name,
    url: SITE.author.url,
    sameAs: [...SITE.author.sameAs],
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: SITE.name,
    description: SITE.definition,
    url: absoluteUrl("/"),
    codeRepository: SITE.repo,
    license: "https://opensource.org/licenses/MIT",
    programmingLanguage: ["Markdown", "Swift", "TypeScript"],
    runtimePlatform: ["Claude Code", "Codex", "Cursor", "macOS"],
    author: personJsonLd(),
    datePublished: "2026-01-01",
    dateModified: "2026-08-14",
    keywords: [
      "agent skills",
      "SKILL.md",
      "Claude Code",
      "Cursor",
      "Codex",
      "Apple HIG",
      "SwiftUI",
      "macOS",
    ],
    isAccessibleForFree: true,
  };
}

export function collectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: absoluteUrl("/"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: SKILLS.length,
      itemListElement: SKILLS.map((skill, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: skill.name,
        url: absoluteUrl(`/skills/${skill.slug}`),
        description: skill.summary,
      })),
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function howToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to install akakika-skills",
    description:
      "Install all 40 akakika-skills into Claude Code, Cursor, Codex, and other SKILL.md-aware agents on a Mac.",
    totalTime: "PT1M",
    tool: [
      { "@type": "HowToTool", name: "Terminal" },
      { "@type": "HowToTool", name: "curl" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Open Terminal",
        text: "Open the Terminal app on your Mac.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the installer",
        text: SITE.installCommand,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Confirm the links",
        text: "The script clones the repo and symlinks all 40 skills into each agent skill directory it knows about.",
      },
    ],
  };
}

export function skillJsonLd(skill: Skill) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${skill.name} — akakika-skills`,
    description: skill.summary,
    url: absoluteUrl(`/skills/${skill.slug}`),
    author: personJsonLd(),
    datePublished: "2026-01-01",
    dateModified: "2026-08-14",
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Thing",
      name: skill.name,
      description: skill.useWhen,
    },
    keywords: [
      skill.name,
      "agent skill",
      "SKILL.md",
      CATEGORIES.find((c) => c.id === skill.category)?.name ?? skill.category,
    ],
  };
}

export function breadcrumbJsonLd(
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
