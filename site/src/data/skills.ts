export type CategoryId =
  | "project-intelligence"
  | "design"
  | "apple-hig"
  | "swift-macos"
  | "ai-agents"
  | "session-rituals"
  | "maintenance"
  | "launch-review"
  | "content";

export type Skill = {
  slug: string;
  name: string;
  category: CategoryId;
  summary: string;
  useWhen: string;
  featured?: boolean;
};

export type Category = {
  id: CategoryId;
  index: string;
  name: string;
  line: string;
  tone: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "project-intelligence",
    index: "01",
    name: "Project intelligence",
    line: "Decide what deserves to exist, understand what already does, keep agents from drifting.",
    tone: "intel",
  },
  {
    id: "design",
    index: "02",
    name: "Design",
    line: "Tokens, color, and taste — the system the apps are built on.",
    tone: "design",
  },
  {
    id: "apple-hig",
    index: "03",
    name: "Apple HIG",
    line: "Native Apple design, to spec — the patterns that make an app feel like it belongs.",
    tone: "hig",
  },
  {
    id: "swift-macos",
    index: "04",
    name: "Swift & macOS",
    line: "Implementation from MenuBarExtra to notarization — the plumbing that has to be exact.",
    tone: "swift",
  },
  {
    id: "ai-agents",
    index: "05",
    name: "AI agent workflows",
    line: "Run coding agents well — state, local models, and projects agents can actually drive.",
    tone: "agents",
  },
  {
    id: "session-rituals",
    index: "06",
    name: "Session rituals",
    line: "How a working session starts, forks, and ends — options before work, causality after.",
    tone: "ritual",
  },
  {
    id: "maintenance",
    index: "07",
    name: "Maintenance",
    line: "Keep a project healthy after the excitement wears off.",
    tone: "maint",
  },
  {
    id: "launch-review",
    index: "08",
    name: "Launch & review",
    line: "The last mile — polish, review, and ship with a clear head.",
    tone: "launch",
  },
  {
    id: "content",
    index: "09",
    name: "Content & publishing",
    line: "Tell people, calmly — posts and pages without the hype.",
    tone: "content",
  },
];

export const SKILLS: Skill[] = [
  {
    slug: "new-project-gate",
    name: "new-project-gate",
    category: "project-intelligence",
    featured: true,
    summary:
      "A pre-build gate that kills bad ideas cheaply — six checkpoints, an agent lens and a human lens, and a GO / CUT / KILL verdict before the editor opens.",
    useWhen:
      "Use when starting a new project, entertaining a shiny idea, or asking an agent to scaffold anything that does not exist yet.",
  },
  {
    slug: "project-worth-my-time",
    name: "project-worth-my-time",
    category: "project-intelligence",
    summary:
      "Build-versus-buy verdict engine — should you build this, or does it already exist? Weighs effort, alternatives, and your time.",
    useWhen:
      "Use when deciding whether to build a tool, feature, or product versus buying or adopting something that already exists.",
  },
  {
    slug: "explain-new-project",
    name: "explain-new-project",
    category: "project-intelligence",
    summary:
      "Explains an unfamiliar codebase in plain language, written for non-technical and self-taught builders.",
    useWhen:
      "Use when opening a codebase you did not write, inheriting a project, or asking an agent to give you a readable map of what lives where.",
  },
  {
    slug: "project-catch-up",
    name: "project-catch-up",
    category: "project-intelligence",
    summary:
      "A what-changed-in-my-stack research brief — dependency drift, breaking changes, and news, with severity labels.",
    useWhen:
      "Use after time away from a project, before upgrading dependencies, or when something in the stack started feeling stale.",
  },
  {
    slug: "project-workflow",
    name: "project-workflow",
    category: "project-intelligence",
    summary:
      "Router that orchestrates explain, catch-up, and worth-my-time with smart skip rules.",
    useWhen:
      "Use when you want one entry point that decides which project-intelligence skill to run, instead of guessing the order.",
  },
  {
    slug: "between-runs-audit",
    name: "between-runs-audit",
    category: "project-intelligence",
    summary:
      "A read-only checkpoint between coding-agent runs — classifies everything KEEP / DELAY / REMOVE and ends with one next action.",
    useWhen:
      "Use between agent sessions to see what changed, what to keep, and what the single next action should be.",
  },
  {
    slug: "old-project-audit",
    name: "old-project-audit",
    category: "project-intelligence",
    summary:
      "KEEP / MERGE / ARCHIVE for tools that already exist — never limbo. Includes a footgun check for stale pipelines pointing at live data.",
    useWhen:
      "Use when deciding the fate of a legacy tool, an abandoned side project, or a pipeline that still touches real data.",
  },
  {
    slug: "kika-design-system",
    name: "kika-design-system",
    category: "design",
    summary:
      "A production design system — color, type, and spacing tokens, components, and a SwiftUI reference. Adopt it or adapt it.",
    useWhen:
      "Use when building or reviewing UI that should feel calm, premium, and consistent — especially SwiftUI, settings windows, and menu-bar apps.",
  },
  {
    slug: "color-principles",
    name: "color-principles",
    category: "design",
    summary:
      "Seven principles for premium, calm, accessible color — a review lens for any UI, website, or app.",
    useWhen:
      "Use when choosing a palette, reviewing color, or pushing back on saturated, shouty interface color.",
  },
  {
    slug: "apple-hig-command-palette",
    name: "apple-hig-command-palette",
    category: "apple-hig",
    featured: true,
    summary:
      "A full ⌘K command palette: scoring and ranking, an action registry, and accessibility.",
    useWhen:
      "Use when designing, reviewing, or implementing a command palette for an Apple-platform app.",
  },
  {
    slug: "apple-hig-sidebars",
    name: "apple-hig-sidebars",
    category: "apple-hig",
    summary:
      "NavigationSplitView sidebars — two- versus three-column, grouping, and keeping navigation calm.",
    useWhen:
      "Use when designing, reviewing, or implementing a sidebar for an Apple-platform app.",
  },
  {
    slug: "apple-hig-toolbars",
    name: "apple-hig-toolbars",
    category: "apple-hig",
    summary:
      "Toolbars — per-screen action maps, one clear primary action, and placement discipline.",
    useWhen:
      "Use when placing toolbar actions, deciding what belongs in a toolbar, or reviewing toolbar density.",
  },
  {
    slug: "apple-hig-inspectors",
    name: "apple-hig-inspectors",
    category: "apple-hig",
    summary:
      "Inspector panels done right — when to use one, the item model, and per-type detail views.",
    useWhen:
      "Use when adding an inspector, inspector sidebar, or detail pane to a document-style Apple app.",
  },
  {
    slug: "apple-hig-macos-window-layout",
    name: "apple-hig-macos-window-layout",
    category: "apple-hig",
    summary:
      "The macOS window shell — sizing, and when to use a sheet versus a window versus a popover.",
    useWhen:
      "Use when deciding how a surface should appear on macOS: window, sheet, popover, or menu.",
  },
  {
    slug: "apple-hig-typography",
    name: "apple-hig-typography",
    category: "apple-hig",
    summary:
      "The text-style scale — sizes, weights, monospaced digits, and line-length caps for legible Apple typography.",
    useWhen:
      "Use when setting type in a SwiftUI or AppKit interface, or reviewing text that feels off-scale.",
  },
  {
    slug: "apple-hig-sf-symbols",
    name: "apple-hig-sf-symbols",
    category: "apple-hig",
    summary:
      "Choosing and using SF Symbols — a nav, action, and status vocabulary, variants, and rendering modes.",
    useWhen:
      "Use when picking icons for navigation, actions, or status in an Apple-platform app.",
  },
  {
    slug: "apple-hig-search-filtering",
    name: "apple-hig-search-filtering",
    category: "apple-hig",
    summary:
      "Search, filter, and sort — a clean separation of the three, with a working filter function.",
    useWhen:
      "Use when adding search, filters, or sort controls and you need them not to collapse into one confused field.",
  },
  {
    slug: "apple-hig-empty-states",
    name: "apple-hig-empty-states",
    category: "apple-hig",
    summary:
      "Empty, first-run, and no-result states — six typed cases built on ContentUnavailableView.",
    useWhen:
      "Use when a list, search, or first launch has nothing to show and the empty state needs to be honest.",
  },
  {
    slug: "apple-hig-feedback-status",
    name: "apple-hig-feedback-status",
    category: "apple-hig",
    summary:
      "Feedback, status, progress, and alerts — a real state vocabulary and no fake percentages.",
    useWhen:
      "Use when showing progress, status, or errors and you need language that matches what is actually happening.",
  },
  {
    slug: "apple-hig-settings",
    name: "apple-hig-settings",
    category: "apple-hig",
    summary:
      "Settings and Preferences — scenes, AppStorage versus Keychain, and SMAppService.",
    useWhen:
      "Use when building a Settings window, Preferences scene, or deciding what belongs in AppStorage versus the Keychain.",
  },
  {
    slug: "macos-menubar-swiftui",
    name: "macos-menubar-swiftui",
    category: "swift-macos",
    summary:
      "Menu-bar apps with MenuBarExtra plus an AppKit bridge — the accurate, compilable reference.",
    useWhen:
      "Use when building a macOS menu-bar app, MenuBarExtra extra, or a status-item popover.",
  },
  {
    slug: "apple-app-intents",
    name: "apple-app-intents",
    category: "swift-macos",
    summary:
      "App Intents, Shortcuts, Siri, and Spotlight, with full Swift — intents, entities, enums — and tests.",
    useWhen:
      "Use when adding Shortcuts, Siri, Spotlight, or App Intents to an Apple app.",
  },
  {
    slug: "macos-launch-at-login",
    name: "macos-launch-at-login",
    category: "swift-macos",
    summary:
      "Launch at Login with SMAppService — all four statuses handled, an honest Settings toggle, and migration off deprecated APIs.",
    useWhen:
      "Use when adding Launch at Login, migrating off SMLoginItemSetEnabled, or wiring an honest Settings toggle.",
  },
  {
    slug: "macos-global-shortcuts",
    name: "macos-global-shortcuts",
    category: "swift-macos",
    summary:
      "In-app versus global shortcuts — KeyboardShortcuts or raw RegisterEventHotKey, recorder UI, conflicts, and safe defaults.",
    useWhen:
      "Use when adding global hotkeys, a shortcut recorder, or deciding what should be in-app versus system-wide.",
  },
  {
    slug: "macos-notifications",
    name: "macos-notifications",
    category: "swift-macos",
    summary:
      "UNUserNotificationCenter done right — permission at the moment of need, action buttons, click routing, and anti-spam rules.",
    useWhen:
      "Use when sending local notifications on macOS, asking for permission, or wiring notification actions.",
  },
  {
    slug: "macos-permissions-privacy",
    name: "macos-permissions-privacy",
    category: "swift-macos",
    featured: true,
    summary:
      "The TCC permission map — which API, plist key, and entitlement each permission needs, plus denied-state recovery and honest privacy copy.",
    useWhen:
      "Use when macOS says no, when adding a TCC permission, or when writing privacy copy and denied-state recovery.",
  },
  {
    slug: "macos-clipboard-pasteboard",
    name: "macos-clipboard-pasteboard",
    category: "swift-macos",
    summary:
      "NSPasteboard — rich writes with fallbacks, changeCount polling, concealed and transient conventions, and Sequoia paste privacy.",
    useWhen:
      "Use when reading or writing the macOS pasteboard, handling secrets, or dealing with Sequoia paste privacy.",
  },
  {
    slug: "macos-app-distribution-dmg",
    name: "macos-app-distribution-dmg",
    category: "swift-macos",
    summary:
      "Ship outside the App Store — Developer ID, hardened runtime, notarytool, stapling, a clean DMG, and the quarantine test your Mac cannot run on itself.",
    useWhen:
      "Use when notarizing, packaging a DMG, or distributing a Mac app outside the Mac App Store.",
  },
  {
    slug: "agent-state-machine",
    name: "agent-state-machine",
    category: "ai-agents",
    summary:
      "One shared state machine for agent, task, and run states — legal transitions and a recovery path out of every failure.",
    useWhen:
      "Use when an agent workflow can get stuck, retry blindly, or lose track of what state a run is actually in.",
  },
  {
    slug: "local-ai-ollama",
    name: "local-ai-ollama",
    category: "ai-agents",
    summary:
      "Wire local models (Ollama) into an app or agent — client protocol, status, and fallback rules.",
    useWhen:
      "Use when integrating Ollama or another local model, showing model status, or defining offline fallbacks.",
  },
  {
    slug: "agent-starter-pack",
    name: "agent-starter-pack",
    category: "ai-agents",
    summary:
      "Scaffold an agent-ready project — an AGENTS.md and an idempotent bootstrap script.",
    useWhen:
      "Use when starting a repo that coding agents should be able to drive without a human narrating the layout.",
  },
  {
    slug: "spread",
    name: "spread",
    category: "session-rituals",
    summary:
      "Before improving anything, a menu of 3–5 concrete interventions on the exact input, lightest to heaviest — then wait for the pick.",
    useWhen:
      "Use when someone says “fix this” and the agent is about to guess which intervention they meant.",
  },
  {
    slug: "butterfly-effect",
    name: "butterfly-effect",
    category: "session-rituals",
    summary:
      "A counterfactual session trace — walk backward from the outcome and keep only the 2–4 load-bearing moments. Causality, not summary.",
    useWhen:
      "Use at the end of a session when you need to know which decisions actually caused the result.",
  },
  {
    slug: "til",
    name: "til",
    category: "session-rituals",
    summary:
      "Teach exactly one thing from the session, in plain English, two paragraphs max. Closes the vocabulary gap for builders who ship without a CS background.",
    useWhen:
      "Use at the close of a session to extract one durable lesson instead of a recap nobody will reread.",
  },
  {
    slug: "project-folder-cleanup",
    name: "project-folder-cleanup",
    category: "maintenance",
    summary:
      "Safely clear regenerable clutter (node_modules, build caches) — backs up and zips everything before deleting. Ships its own scripts.",
    useWhen:
      "Use when a project folder is bloated with caches and generated files you can safely rebuild.",
  },
  {
    slug: "docs-update",
    name: "docs-update",
    category: "maintenance",
    summary:
      "Audit and update project documentation — READMEs, changelogs, inline docs — and keep them in sync with the code.",
    useWhen:
      "Use when docs have drifted from the code, or before a release when the README would lie.",
  },
  {
    slug: "product-hunt-polish-review",
    name: "product-hunt-polish-review",
    category: "launch-review",
    summary:
      "A launch-readiness playbook — first impression, copy do/don'ts, scoring, and a full review prompt.",
    useWhen:
      "Use before a Product Hunt, launch week, or public first impression when the product needs an honest polish pass.",
  },
  {
    slug: "emergency-switch-app",
    name: "emergency-switch-app",
    category: "launch-review",
    summary:
      "A privacy-first save-my-context-and-stop design — local-first capture, with consent.",
    useWhen:
      "Use when designing a panic, privacy, or context-save switch that must not leak what it captures.",
  },
  {
    slug: "blog-post-publishing",
    name: "blog-post-publishing",
    category: "content",
    summary:
      "Turn a draft into a complete, SEO- and GEO-optimized blog post wired into your site — template, index, sitemap, deploy. Framework-agnostic.",
    useWhen:
      "Use when publishing a blog post from a draft and you need the page, index, sitemap, and SEO work done together.",
  },
  {
    slug: "social-post-kit",
    name: "social-post-kit",
    category: "content",
    summary:
      "A ready-to-paste, multi-platform launch post kit (X, Reddit, Instagram, LinkedIn, Threads) with honest, low-hype copy.",
    useWhen:
      "Use when announcing a launch and you need platform-native posts that do not sound like marketing.",
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const SKILL_BY_SLUG = Object.fromEntries(
  SKILLS.map((s) => [s.slug, s]),
) as Record<string, Skill>;

export function skillsInCategory(id: CategoryId): Skill[] {
  return SKILLS.filter((s) => s.category === id);
}

export function relatedSkills(skill: Skill, limit = 3): Skill[] {
  return SKILLS.filter(
    (s) => s.category === skill.category && s.slug !== skill.slug,
  ).slice(0, limit);
}

export function githubSkillUrl(skill: Skill): string {
  return `https://github.com/aka-kika/akakika-skills/tree/main/skills/${skill.category}/${skill.slug}`;
}

export function githubSkillFile(skill: Skill): string {
  return `https://github.com/aka-kika/akakika-skills/blob/main/skills/${skill.category}/${skill.slug}/SKILL.md`;
}
