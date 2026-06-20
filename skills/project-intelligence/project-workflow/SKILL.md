---
name: project-workflow
description: Use when the user wants the full package on a repo, says run my project workflow, project check-in, or is overwhelmed opening an old or new folder. Runs the project onboarding checklist—explain-new-project, project-worth-my-time, and project-catch-up—in order or on demand.
disable-model-invocation: true
---

# Project Workflow

## One sentence

**One ask → the right steps in order → three files on disk + a short chat summary.**

## Pick a path first (routing)

| User means… | Run |
|-------------|-----|
| New folder / “what is this?” / guide only | Step 1 only → [explain-new-project](../explain-new-project/SKILL.md) |
| “Worth my time?” / build vs buy | Step 2 → [project-worth-my-time](../project-worth-my-time/SKILL.md) (read `PROJECT_GUIDE.md` first if it exists) |
| “I’m back after a while” / what’s new | Step 3 → [project-catch-up](../project-catch-up/SKILL.md) |
| “Full workflow” / “check-in” / “do everything” | Steps 1 → 2 → 3 in order (unless skip rules below) |
| Unclear | Default: **full** (1 → 2 → 3) |

Same audience as the other skills: self-taught, plain language, **Learn:** for jargon.

## What each step saves

| Step | Skill | File |
|------|--------|------|
| 1 | explain-new-project | `PROJECT_GUIDE.md` |
| 2 | project-worth-my-time | `PROJECT_VERDICT.md` |
| 3 | project-catch-up | `PROJECT_CATCH_UP.md` |

## Before you start

1. Confirm **project root** (workspace folder or path user names).
2. Glance at which `PROJECT_*.md` files **already exist**—report in chat, then follow skip rules or user request.

## Execute

For each step you run: **read that skill’s SKILL.md and follow it completely** (do not shorten sub-skills).

- Step 2 uses **Pieces MCP** (`user-pieces`: `get_user_persona`, `ask_pieces_ltm`) when available.
- Step 3 uses **web search** when available.

Do **not** ask permission to save files—sub-skills always save.

## Skip rules

| User says | Skip |
|-----------|------|
| guide only / step 1 only | 2 and 3 |
| no verdict / no worth | 2 |
| no catch-up | 3 |
| verdict only | 1 if `PROJECT_GUIDE.md` exists and is usable; else run 1 first |
| catch-up only | 1 if guide missing; else skip 1 and 2 |

| File already exists | Default |
|---------------------|---------|
| All three fresh enough | Ask once: *Re-run all three or only what’s missing?* If user said full workflow, re-run all (overwrite). |
| User said full workflow | Overwrite all three |

## After you finish — chat reply (keep short)

Use this checklist in the reply:

```
Done:
- [ ] PROJECT_GUIDE.md — paste "In one minute" + "How you run it"
- [ ] PROJECT_VERDICT.md — paste Quick verdict + What I'd do (if ran step 2)
- [ ] PROJECT_CATCH_UP.md — paste Headline + Do these first (if ran step 3)

Files saved at: [project root path]
```

If a step was skipped, say which and why.

## Prerequisites

| Need | For |
|------|-----|
| Write access to project root | All steps |
| PiecesOS + the `pieces` MCP server configured in your agent | Step 2 (ok to skip Pieces if down—say so) |
| Web search | Step 3 |

## What not to do

- Do not inline the full text of the three skills—delegate to them.
- Do not run step 2 or 3 without project context (guide or quick explore per sub-skill).
- Do not add a fourth combined markdown file.

## Related

- The Pieces MCP server name can differ between agents (often `pieces` or `user-pieces`). Use whichever name your coding agent exposes; the flow is identical.
