import { createFileRoute } from "@tanstack/react-router";
import { Catalog } from "@/components/landing/catalog";
import { FaqSection } from "@/components/landing/faq-section";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Install } from "@/components/landing/install";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import {
  collectionJsonLd,
  faqJsonLd,
  howToJsonLd,
  softwareJsonLd,
  websiteJsonLd,
} from "@/lib/json-ld";
import { SITE, absoluteUrl } from "@/lib/site";

type HomeSearch = {
  q?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    if (typeof search.q === "string" && search.q.trim().length > 0) {
      return { q: search.q };
    }
    return {};
  },
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — ${SITE.tagline}` },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: Home,
});

function Home() {
  const { q } = Route.useSearch();
  return (
    <SiteShell>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareJsonLd()} />
      <JsonLd data={collectionJsonLd()} />
      <JsonLd data={faqJsonLd()} />
      <JsonLd data={howToJsonLd()} />
      <Hero />
      <Catalog initialQuery={q ?? ""} />
      <Install />
      <HowItWorks />
      <FaqSection />
    </SiteShell>
  );
}
