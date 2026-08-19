export const SITE = {
  name: "akakika-skills",
  shortName: "akakika",
  tagline: "Agent skills for calm, native software",
  definition:
    "akakika-skills is a curated collection of 40 agent skills — plain SKILL.md files that teach AI coding agents how to do one thing well. They cover Apple Human Interface Guidelines, SwiftUI and macOS implementation, project intelligence, session rituals, maintenance, launch polish, and calm publishing.",
  description:
    "A carefully curated set of 40 agent skills for Claude Code, Codex, and Cursor. Build calm, native-feeling macOS apps with Apple HIG craft, privacy by default, and agent workflows that hold up on the second run.",
  urlFallback: "https://akakika.com",
  repo: "https://github.com/aka-kika/akakika-skills",
  repoSlug: "aka-kika/akakika-skills",
  installUrl:
    "https://raw.githubusercontent.com/aka-kika/akakika-skills/main/install.sh",
  installCommand:
    "curl -fsSL https://raw.githubusercontent.com/aka-kika/akakika-skills/main/install.sh | bash",
  author: {
    name: "Kika",
    url: "https://akakika.com",
    sameAs: [
      "https://akakika.com",
      "https://github.com/aka-kika",
      "https://x.com/akakikaaa",
    ],
  },
  license: "MIT",
  year: 2026,
  skillCount: 40,
  categoryCount: 9,
  agents: ["Claude Code", "Codex", "Cursor", "Grok", "Goose"] as const,
} as const;

export function siteOrigin(): string {
  const host = import.meta.env.VITE_PUBLIC_HOSTNAME as string | undefined;
  if (host) return `https://${host}`;
  return SITE.urlFallback;
}

export function absoluteUrl(path = "/"): string {
  const origin = siteOrigin().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}

export const INSTALL_COMMAND = SITE.installCommand;
