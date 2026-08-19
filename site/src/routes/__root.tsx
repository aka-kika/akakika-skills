import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SITE, absoluteUrl } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import appCss from "../styles.css?url";

const host = import.meta.env.VITE_PUBLIC_HOSTNAME as string | undefined;
const ogImage = host ? `https://${host}/og.jpg` : undefined;

const title = `${SITE.name} — ${SITE.tagline}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: SITE.description },
      { name: "author", content: SITE.author.name },
      {
        name: "keywords",
        content:
          "agent skills, SKILL.md, Claude Code, Cursor, Codex, Apple HIG, SwiftUI, macOS, AI coding agents, akakika",
      },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "apple-mobile-web-app-title", content: SITE.name },
      { name: "theme-color", content: "#0D0D0D" },
      { name: "color-scheme", content: "dark light" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE.name },
      { property: "og:title", content: title },
      { property: "og:description", content: SITE.description },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: SITE.description },
      { name: "twitter:site", content: "@akakikaaa" },
      { name: "twitter:creator", content: "@akakikaaa" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1792" },
            { property: "og:image:height", content: "1008" },
            { property: "og:image:alt", content: title },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/") },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "alternate",
        type: "text/plain",
        href: "/llms.txt",
        title: "llms.txt",
      },
    ],
  }),
  component: RootDocument,
  notFoundComponent: RootNotFound,
});

function RootDocument() {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

function RootNotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-medium text-fg">Page not found</h1>
        <p className="mt-3 text-sm text-muted">
          That URL is not part of the collection.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-md border border-border px-4 text-sm text-fg hover:bg-elevated"
        >
          Back home
        </Link>
      </div>
    </SiteShell>
  );
}
