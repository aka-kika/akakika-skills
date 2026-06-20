---
name: project-catch-up
description: Use when returning to a repo after a break, asking what changed, what's new for this stack, or invoking project-catch-up after explain-new-project. Scans the stack for important updates, deprecations, new helper tools, agent skills, and MCP servers online—plain-language brief saved as PROJECT_CATCH_UP.md.
disable-model-invocation: true
---

# Project Catch-Up

## Where this fits

Part of the same workflow as:

1. [explain-new-project](../explain-new-project/SKILL.md) → `PROJECT_GUIDE.md`
2. [project-worth-my-time](../project-worth-my-time/SKILL.md) → `PROJECT_VERDICT.md` (optional)
3. **This skill** → `PROJECT_CATCH_UP.md` — run when you **come back** to a project so you do not rebuild what already exists or miss breaking updates

Same **audience** as explain-new-project: self-taught, plain language, **Learn:** for jargon, language matches the user's chat.

## When invoked

1. Confirm **project root**.
2. Read **`PROJECT_GUIDE.md`** if present; else README + lockfile/manifest to list the **stack** (frameworks, major packages, hosting, AI tools).
3. **Pieces MCP (try once)** — when did the user last touch this project? (see below). Skip judgment if unavailable.
4. **Web research (required)** — search for news since a sensible window (see Research window).
5. Write the report from the template; cite sources with links where possible.
6. **Always save** `PROJECT_CATCH_UP.md` at the project root (overwrite if present).
7. In chat: show **Before you code** + **Headline** in full; one line points to the file for the full list.

## Research window

| Situation | Search focus |
|-----------|----------------|
| User says how long they were away | Changes since that period |
| Pieces shows last activity date | Roughly from that date to today |
| Unknown | Last **6 months** for major stack items; **12 months** for agent skills / MCP ecosystem |

Prefer **official** sources: release notes, migration guides, docs, GitHub releases. Avoid rumor blogs.

## Stack inventory (from the repo)

Extract a short list before searching—example fields:

- Runtime: Node 22, Python 3.12, Swift 6
- Framework: Next.js 15, Vite, Expo, SwiftUI
- Data/auth: Supabase, Prisma, Firebase
- Deploy: Vercel, Cloudflare
- AI/agent: coding agent in use, specific MCP servers in the agent's config (e.g. `.cursor/`, `.codex/`, `.mcp.json`) or docs

Also note **pinned versions** in lockfiles when visible (helps spot "you're on old X").

## Web research checklist

Run **targeted searches** (not one vague query). For each major stack item, check:

```
- [ ] Latest stable release vs project's version — breaking changes?
- [ ] Deprecated APIs or "migrate before date" warnings
- [ ] Official replacement or recommended upgrade path
- [ ] New first-party features that replace custom code in this repo
```

Then search the **workflow layer**:

```
- [ ] Agent skills: new or popular skills for [framework] / [task]
- [ ] MCP servers that match this project (official + well-maintained community)
- [ ] CLI or SaaS tools that fit the same job (only if clearly better than reinventing)
```

Use the **WebSearch** tool (or equivalent). Run multiple searches; merge duplicates.

## Pieces MCP (optional but valuable)

Via **user-pieces**:

1. `get_user_persona()` — optional context for how they learn.
2. `ask_pieces_ltm` — *When did I last work on [project name or folder path]? What was I doing?*
   - Topics: project name, repo path, last session
   - Use the answer to set the research window and tone ("you left off mid-auth refactor").

If Pieces fails, use `git log -1 --format=%ci` when the repo is git—mention the date in the report.

## Severity labels

Tag each finding so the user can skim:

| Label | Meaning |
|-------|---------|
| **Must know** | Breaking change, security fix, or will waste your time if ignored |
| **Worth a look** | New capability that could replace work you planned |
| **Nice to have** | Optional polish, new skill, minor version bump |
| **Ignore for now** | Irrelevant to this repo or too bleeding-edge |

## Report template

```markdown
# [Project name] — catch-up before you code

> **Before you code** — read the headline and action list, then stop if you're ready.
> **The rest** — updates, tools, skills, and links.

---

## Before you code

**Headline:** [One sentence: safe to continue / pause for upgrade / big opportunity you almost missed]

**Do these first (if any):**
1. [Ordered, concrete—e.g. run npm update, read migration link, install MCP X]
2. ...

**You can ignore for now:** [Short list or "nothing critical"]

---

## The rest (optional)

### Your stack snapshot

| Piece | In this project | Note |
|-------|-----------------|------|
| ... | version or "unknown" | ... |

### Must know

| What | Why it matters to you | Source |
|------|----------------------|--------|
| ... | plain language | link |

### Worth a look — updates & features

[Framework/library releases, new APIs, hosting changes]

### Worth a look — tools & integrations

[CLIs, services, templates—not full app replacements unless relevant]

### Worth a look — agent skills & MCP

| Name | What it helps with | How to try |
|------|-------------------|------------|
| ... | ... | install path or search term |

**Learn:** [only if "MCP" or "skill" needs explaining]

### Nice to have

[Bullet list]

### Ignore for now

[Bullet list]

### When you last worked on this

[From Pieces or git date + one line of context]

### Sources checked

- [dated list of main URLs searched]
```

## Tone

- Goal: **save time**, not FOMO
- Do not list 20 tools—curate to what matches **this** repo
- If nothing important changed, say so clearly: *You're not missing much—safe to continue.*
- Distinguish **upgrade the project** vs **use a new external tool** vs **add an agent skill**

## What not to do

- Do not recommend upgrading everything "just because"
- Do not invent version numbers—read the repo or say unknown
- Do not skip web research
- Do not ask whether to save the file
- Do not replace `PROJECT_GUIDE.md` or `PROJECT_VERDICT.md`

## Multi-root workspaces

One `PROJECT_CATCH_UP.md` per named project root.

---

Examples: [examples.md](examples.md)
