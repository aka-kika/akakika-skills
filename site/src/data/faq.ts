export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ: FaqItem[] = [
  {
    question: "What is akakika-skills?",
    answer:
      "akakika-skills is a curated collection of 40 agent skills — self-contained SKILL.md files that teach AI coding agents how to perform one task well. The collection covers Apple Human Interface Guidelines, SwiftUI and macOS implementation, project intelligence, design systems, session rituals, maintenance, launch review, and calm publishing. It is maintained by Kika and released under the MIT license.",
  },
  {
    question: "What is an agent skill?",
    answer:
      "An agent skill is a folder with a SKILL.md file. The file starts with YAML frontmatter — a name and a description that begins with “Use when…” — followed by the actual guidance: rules, code, and checklists. Skill-aware agents read the frontmatter to decide relevance, then load the body on demand. There is no build step and no dependency. It is Markdown you can read, copy, and remix.",
  },
  {
    question: "Which AI coding agents work with akakika-skills?",
    answer:
      "The skills work with Claude Code, Codex, Cursor, Grok, Goose, and any other agent that reads the SKILL.md format. Install them into the agent’s skill directory, or open a SKILL.md and paste the part you need.",
  },
  {
    question: "How do I install akakika-skills?",
    answer:
      "On a Mac, run: curl -fsSL https://raw.githubusercontent.com/aka-kika/akakika-skills/main/install.sh | bash. The installer clones the repo and symlinks all 40 skills into the skill directories it knows about. You can also copy a single skill folder by hand into ~/.claude/skills/, .cursor/skills/, or your project’s AGENTS.md.",
  },
  {
    question: "How many skills are in the collection?",
    answer:
      "There are 40 skills in 9 categories: project intelligence, design, Apple HIG, Swift and macOS, AI agent workflows, session rituals, maintenance, launch and review, and content publishing.",
  },
  {
    question: "Which three skills should I install first?",
    answer:
      "If you only grab three: new-project-gate before you build, apple-hig-command-palette while you design, and macos-permissions-privacy when macOS says no.",
  },
  {
    question: "Do I need a Mac to use these skills?",
    answer:
      "The one-liner installer targets a Mac because many skills teach native macOS and SwiftUI craft. The SKILL.md files themselves are just Markdown — you can read and use them on any system, and the project-intelligence, session, maintenance, and publishing skills are not Mac-specific.",
  },
  {
    question: "Are akakika-skills free to use?",
    answer:
      "Yes. The collection is MIT licensed, copyright 2026 Kika. You may use the skills, ship with them, and remix them. Attribution is appreciated, not required.",
  },
];
