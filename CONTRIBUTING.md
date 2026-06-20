# Contributing

Thanks for looking. This is a curated collection, so the bar matters more than the volume. A skill earns its place by being genuinely useful to a stranger — not by existing.

## What belongs here

Every skill should clear all five:

1. **Specific, not generic.** It encodes real, hard-won expertise — concrete APIs, dimensions, decision tables, working code. If a competent person could get the same answer by just asking the model, it doesn't belong.
2. **Complete.** It's useful on the first run, not a sketch. If it names something hard (security-scoped bookmarks, notarization, a state machine), it *shows* the hard part.
3. **One clear job.** A skill does one thing. If it's doing three, it's three skills.
4. **A sharp trigger.** The `description` starts with *"Use when…"* and says exactly when to reach for it — that's how the agent knows to load it.
5. **Tool-agnostic.** Skills here work with any agent. No hardcoded paths, no "this only works in X," no auto-generated filler.

## Skill anatomy

A skill is a self-contained folder:

```
skills/<category>/<skill-name>/
├── SKILL.md          # required — frontmatter + the guidance
├── examples.md       # optional — worked examples
├── references/       # optional — deeper reference docs the SKILL.md links to
└── assets/           # optional — reference code, templates
```

The folder name **is** the skill name. Keep it lowercase-kebab-case.

### Frontmatter

```yaml
---
name: apple-hig-sidebars          # unquoted; must equal the folder name
description: Use when designing, reviewing, or implementing a sidebar for an Apple-platform app.
---
```

- `name` — unquoted, exactly matches the folder.
- `description` — starts with **"Use when…"**, concrete, ≤ ~240 chars. This is the single most important line: it decides whether the skill ever fires.

After the frontmatter: an `# H1` title, a 1–2 sentence intro that says what the skill does, then the craft (rules, code, checklists). No "Activation / Working Pattern / Quality Bar" boilerplate — get to the point.

## The quality checklist

Before you open a PR, run the skill through this — it's the same pass every skill here went through:

- [ ] `name` is unquoted and matches the folder name
- [ ] `description` starts with "Use when…" and is specific
- [ ] H1 + a tight intro; no auto-generated scaffold or leaked source notes
- [ ] No tool lock-in (Codex/Cursor/Claude-only) and no hardcoded `/Users/...` paths
- [ ] Every code block is correct and modern (and runs, if it claims to)
- [ ] Real content over filler — checklists and tables earn their space
- [ ] Relative links (`examples.md`, `references/*`) all resolve

## Adding or improving a skill

1. **Improving an existing one?** Open a PR. Sharpen the trigger, fix example code, fill a real gap, tighten prose.
2. **Proposing a new one?** Open an issue first with the `description` line and a sentence on why it clears the bar. Easiest way to know if it fits.
3. Put it in the right category folder (or suggest a new category if none fit).
4. Run the checklist above.

Small, sharp, and correct beats big and vague every time.
