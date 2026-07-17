<div align="center">

# akakika-skills

**A small, carefully curated set of agent skills for building calm, native-feeling software — and for running AI coding agents well.**

Apple/macOS design craft · SwiftUI · AI-agent workflows · project intelligence · upkeep · launch polish.

![skills](https://img.shields.io/badge/skills-37-5A6E94)
![categories](https://img.shields.io/badge/categories-8-5A6E94)
![format](https://img.shields.io/badge/format-SKILL.md-2A2A2A)
![license](https://img.shields.io/badge/license-MIT-1A1A1A)

</div>

---

These are [agent skills](#how-skills-work) — plain `SKILL.md` files that teach an AI coding agent how to do one thing *well*. They work with **Claude Code, Codex, Cursor**, and anything else that reads the `SKILL.md` format. No build step, no dependencies — open one and read it.

This isn't a dump of everything I've made. It's only what I'd hand to someone — each skill stripped down, de-branded, and polished to the same bar. The through-line is taste: calm UI, native patterns, privacy by default, project upkeep that won't bite you, and agent workflows that don't fall apart on the second run.

The collection follows the life of a project — decide, design, build, run, maintain, launch, tell people:

[Project intelligence](#project-intelligence) · [Design](#design) · [Apple HIG](#apple-hig) · [Swift & macOS](#swift--macos) · [AI agent workflows](#ai-agent-workflows) · [Maintenance](#maintenance) · [Launch & review](#launch--review) · [Content & publishing](#content--publishing)

If you only grab three: [new-project-gate](skills/project-intelligence/new-project-gate) before you build, [apple-hig-command-palette](skills/apple-hig/apple-hig-command-palette) while you design, [macos-permissions-privacy](skills/swift-macos/macos-permissions-privacy) when macOS says no.

## Quickstart

Every skill is a self-contained folder with a `SKILL.md` (Markdown + a little YAML). Drop the folder wherever your agent loads skills:

| Agent | Where it goes |
|---|---|
| **Claude Code** | Copy into `~/.claude/skills/` (global) or `.claude/skills/` (per-project), then invoke it by name. |
| **Codex** | Copy into your project and reference it from `AGENTS.md`, or paste the `SKILL.md` body into context. |
| **Cursor** | Copy into `.cursor/skills/` (or your rules folder) and reference it. |
| **Anything else** | Open the `SKILL.md` and paste the part you need. It's just Markdown. |

```bash
# grab one skill
git clone https://github.com/aka-kika/akakika-skills
cp -R akakika-skills/skills/apple-hig/apple-hig-command-palette ~/.claude/skills/
```

## The skills

### Project intelligence

*Decide what deserves to exist, understand what already does, and keep agents from drifting.*

| Skill | What it does |
|---|---|
| [new-project-gate](skills/project-intelligence/new-project-gate) | A pre-build gate that kills bad ideas cheaply — six checkpoints, an agent lens and a human lens, and a GO / CUT / KILL verdict before the editor opens. |
| [project-worth-my-time](skills/project-intelligence/project-worth-my-time) | Build-vs-buy verdict engine — should you build this, or does it already exist? Weighs effort, alternatives, and your time. |
| [explain-new-project](skills/project-intelligence/explain-new-project) | Explains an unfamiliar codebase in plain language, written for non-technical and self-taught builders. |
| [project-catch-up](skills/project-intelligence/project-catch-up) | A "what changed in my stack" research brief — dependency drift, breaking changes, and news, with severity labels. |
| [project-workflow](skills/project-intelligence/project-workflow) | Router that orchestrates explain / catch-up / worth-my-time with smart skip rules. |
| [between-runs-audit](skills/project-intelligence/between-runs-audit) | A read-only checkpoint between coding-agent runs — classifies everything KEEP / DELAY / REMOVE and ends with one unambiguous next action. |
| [old-project-audit](skills/project-intelligence/old-project-audit) | KEEP / MERGE / ARCHIVE for tools that already exist — never limbo. Includes a non-negotiable footgun check for stale pipelines pointing at live data. |

### Design

*Tokens, color, and taste — the system the apps are built on.*

| Skill | What it does |
|---|---|
| [kika-design-system](skills/design/kika-design-system) | A real, production design system — color/type/spacing tokens, components, and a SwiftUI reference implementation. Adopt it or adapt it. |
| [color-principles](skills/design/color-principles) | Seven principles for premium, calm, accessible color — a review lens for any UI, website, or app. |

### Apple HIG

*Native Apple design, to spec — the patterns that make an app feel like it belongs.*

| Skill | What it does |
|---|---|
| [apple-hig-command-palette](skills/apple-hig/apple-hig-command-palette) | A full ⌘K command palette: scoring/ranking, action registry, and accessibility. |
| [apple-hig-sidebars](skills/apple-hig/apple-hig-sidebars) | `NavigationSplitView` sidebars — two- vs three-column, grouping, and keeping navigation calm. |
| [apple-hig-toolbars](skills/apple-hig/apple-hig-toolbars) | Toolbars — per-screen action maps, one clear primary action, and placement discipline. |
| [apple-hig-inspectors](skills/apple-hig/apple-hig-inspectors) | Inspector panels done right — when to use one, the item model, and per-type detail views. |
| [apple-hig-macos-window-layout](skills/apple-hig/apple-hig-macos-window-layout) | The macOS window shell — sizing, and when to use a sheet vs a window vs a popover. |
| [apple-hig-typography](skills/apple-hig/apple-hig-typography) | The text-style scale — sizes, weights, monospaced digits, and line-length caps for legible Apple typography. |
| [apple-hig-sf-symbols](skills/apple-hig/apple-hig-sf-symbols) | Choosing and using SF Symbols — a nav/action/status vocabulary, variants, and rendering modes. |
| [apple-hig-search-filtering](skills/apple-hig/apple-hig-search-filtering) | Search, filter, and sort — a clean separation of the three, with a working filter function. |
| [apple-hig-empty-states](skills/apple-hig/apple-hig-empty-states) | Empty, first-run, and no-result states — six typed cases built on `ContentUnavailableView`. |
| [apple-hig-feedback-status](skills/apple-hig/apple-hig-feedback-status) | Feedback, status, progress, and alerts — a real state vocabulary and no fake percentages. |
| [apple-hig-settings](skills/apple-hig/apple-hig-settings) | Settings/Preferences — scenes, `AppStorage` vs Keychain, and `SMAppService`. |

### Swift & macOS

*Implementation — from `MenuBarExtra` to notarization, the plumbing that has to be exactly right.*

| Skill | What it does |
|---|---|
| [macos-menubar-swiftui](skills/swift-macos/macos-menubar-swiftui) | Menu-bar apps with `MenuBarExtra` + an AppKit bridge — the accurate, compilable reference. |
| [apple-app-intents](skills/swift-macos/apple-app-intents) | App Intents / Shortcuts / Siri / Spotlight, with full Swift (intents, entities, enums) and tests. |
| [macos-launch-at-login](skills/swift-macos/macos-launch-at-login) | Launch at Login with `SMAppService` — all four statuses handled, an honest Settings toggle, and migration off the deprecated APIs. |
| [macos-global-shortcuts](skills/swift-macos/macos-global-shortcuts) | In-app vs global shortcuts — the KeyboardShortcuts package or raw `RegisterEventHotKey`, recorder UI, conflicts, and safe defaults. |
| [macos-notifications](skills/swift-macos/macos-notifications) | `UNUserNotificationCenter` done right — permission at the moment of need, action buttons, click routing, and anti-spam rules. |
| [macos-permissions-privacy](skills/swift-macos/macos-permissions-privacy) | The TCC permission map — which API, plist key, and entitlement each permission needs, plus denied-state recovery and honest privacy copy. |
| [macos-clipboard-pasteboard](skills/swift-macos/macos-clipboard-pasteboard) | `NSPasteboard` — rich writes with fallbacks, `changeCount` polling, the concealed/transient conventions, and Sequoia paste privacy. |
| [macos-app-distribution-dmg](skills/swift-macos/macos-app-distribution-dmg) | Ship outside the App Store — Developer ID + hardened runtime, notarytool, stapling, a clean DMG, and the quarantine test that catches what your Mac can't. |

### AI agent workflows

*Run coding agents well — state, local models, and projects agents can actually drive.*

| Skill | What it does |
|---|---|
| [agent-state-machine](skills/ai-agents/agent-state-machine) | One shared state machine for agent/task/run states — legal transitions and a recovery path out of every failure. |
| [local-ai-ollama](skills/ai-agents/local-ai-ollama) | Wire local models (Ollama) into an app or agent — client protocol, status, and fallback rules. |
| [agent-starter-pack](skills/ai-agents/agent-starter-pack) | Scaffold an agent-ready project — an `AGENTS.md` and an idempotent bootstrap script. |

### Maintenance

*Keep a project healthy after the excitement wears off.*

| Skill | What it does |
|---|---|
| [project-folder-cleanup](skills/maintenance/project-folder-cleanup) | Safely clear regenerable clutter (`node_modules`, build caches) — backs up and zips everything before deleting. Ships its own scripts. |
| [docs-update](skills/maintenance/docs-update) | Audit and update project documentation — READMEs, changelogs, inline docs — and keep them in sync with the code. |

### Launch & review

*The last mile — polish, review, and ship with a clear head.*

| Skill | What it does |
|---|---|
| [product-hunt-polish-review](skills/launch-review/product-hunt-polish-review) | A launch-readiness playbook — first impression, copy do/don'ts, scoring, and a full review prompt. |
| [emergency-switch-app](skills/launch-review/emergency-switch-app) | A privacy-first "save my context and stop" design — local-first capture, with consent. |

### Content & publishing

*Tell people, calmly — posts and pages without the hype.*

| Skill | What it does |
|---|---|
| [blog-post-publishing](skills/content/blog-post-publishing) | Turn a draft into a complete, SEO/GEO-optimized blog post wired into your site (template, index, sitemap, deploy). Framework-agnostic. |
| [social-post-kit](skills/content/social-post-kit) | A ready-to-paste, multi-platform launch post kit (X, Reddit, Instagram, LinkedIn, Threads) with honest, low-hype copy. |

## How skills work

Each skill is a folder with a `SKILL.md`: a little YAML frontmatter (a `name` and a `description` that starts with *"Use when…"* so the agent knows **when** to reach for it), followed by the actual guidance — rules, code, checklists. Skill-aware agents read the frontmatter to decide relevance, then pull in the body on demand. Everything else is just Markdown you can read, copy, and remix.

```markdown
---
name: apple-hig-sidebars
description: Use when designing, reviewing, or implementing a sidebar for an Apple-platform app.
---

# Apple HIG Sidebars
...the craft...
```

## Contributing

These are personal, but PRs that sharpen a skill, fix a bug in example code, or fill a real gap are welcome. There's a quality bar — see [CONTRIBUTING.md](CONTRIBUTING.md). Short version: specific over generic, real expertise over promptable advice, complete over sketch, and a sharp *"Use when…"* trigger.

## License

[MIT](LICENSE) © 2026 Kika ([akakika](https://akakika.com)). Use them, ship with them, remix them. Attribution appreciated, not required.
