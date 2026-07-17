---
name: between-runs-audit
description: Use between coding-agent runs (Codex, Claude Code, Cursor, Aider, etc.) to stop the project from drifting, overbuilding, or accumulating dead weight. Forces a read-only audit that classifies every active item as KEEP / DELAY / REMOVE and ends with a single, unambiguous next action. Trigger on "audit before continuing", "what should I do next", "this project got too big", "between runs", "trim scope", "stop adding stuff", or any signal that the project feels noisy and the next step is unclear. Do NOT load for trivial one-line fixes, when the next action is already obvious, or when you're mid-run and just need to keep going.
version: 1.0.0
---

# Between-Runs Audit

## Purpose

A short, read-only checkpoint you run **between** coding-agent sessions.

Its job is to stop the project from drifting. Every coding agent has a bias toward producing — more code, more docs, more "while I'm in here" abstractions. This skill flips the bias for one turn: **audit only, no writing**.

It produces a clean verdict at the end:

- What is required **right now**
- What can wait
- What is dead weight
- The **single** next action

If you can't name the single next action, the audit didn't work.

## When to use

Load it when any of these are true:

- A coding-agent run just finished and the next step isn't obvious
- The project feels too big, too noisy, or has too many half-finished threads
- Files, folders, abstractions, or docs keep appearing without an immediate consumer
- You're about to start a new run and want to avoid scope creep
- Before committing a batch of changes
- Before asking the agent to "continue" or "keep going"

Don't load it when:

- You already know the exact next small fix
- You're mid-refactor on a focused change
- It's a one-file edit or a one-line tweak

## Core rule

**Audit only. No writing.**

The agent in this run must not:

- Create, edit, or delete files
- Run build / test / install commands
- Push branches, open PRs, or commit
- "Quickly fix" something it spots
- Add abstractions, helpers, or scaffolding "while it's looking"

It reads, it thinks, it reports. That's it.

## The audit prompt

Copy the block below verbatim. Replace `{{PROJECT_ROOT}}` with the absolute path of the project you're auditing. Everything else stays.

```md
STOP. Read-only audit. Do not modify any files.

Project root: {{PROJECT_ROOT}}

You are auditing, not building. Your only job is to classify the
current state of the project so the next run is small and clear.

Read in this order:
1. AGENTS.md, README.md, ROADMAP.md (whichever exist)
2. The top-level folder structure
3. Recent git log (`git log --oneline -30`)
4. Git status (`git status` — staged, unstaged, untracked)
5. Any TODO / FIXME / XXX comments in source
6. Any folder or file added in the last N commits that looks unused

Then classify every active item — features, files, docs, abstractions,
folders, configs — into one of three buckets using strict YAGNI:

  KEEP   — required for the next milestone. Removing it breaks progress.
  DELAY  — has value, but not before the next milestone ships.
          Move to /futurefeatures/ with a one-line reason.
  REMOVE — adds complexity without value. Delete it. No archive.

Apply these tests before classifying:

- No future-proofing. No "we'll need this later."
- No premature abstractions. If only one caller exists, inline it.
- No placeholder systems. Skeletons that don't run are lies.
- No docs without a reader. If nobody is going to read it this
  milestone, it doesn't exist yet.
- No features without an immediate user.
- No config without an immediate consumer.

Output exactly this structure, nothing else:

## KEEP NOW
- <item> — <why it's required for the next milestone>

## DELAY → /futurefeatures/
- <item> — <one-line reason for delay>
- ...

## REMOVE
- <item> — <one-line reason>
- ...

## NEXT SINGLE ACTION
One sentence. The highest-leverage thing to do next. Small enough to
finish in one focused run.

## PRIORITY ORDER
1. <action>
2. <action>
3. <action>
4. <action>
5. <action>

End of output. Do not write code. Do not modify files. Do not run
commands that change state. Audit only.
```

## How to use the output

1. **Read the verdict.** If `NEXT SINGLE ACTION` isn't a single sentence, the audit was lazy — run it again with a sharper prompt.
2. **Move DELAY items.** Create `futurefeatures/` at the project root if it doesn't exist. Move delayed files/folders there. One commit, message: `chore: move delayed ideas to futurefeatures/`.
3. **Delete REMOVE items.** Don't archive. Don't "save just in case." Delete.
4. **Update KEEP list.** If `AGENTS.md` / `ROADMAP.md` exists, refresh the active scope to match. Keep them honest.
5. **Hand off.** The `NEXT SINGLE ACTION` becomes the next coding-agent run. Wrap it in this follow-up prompt:

```md
Perform only this one action:

  {{NEXT_SINGLE_ACTION}}

Constraints:
- Do not touch anything classified as DELAY.
- Do not add new abstractions, helpers, or scaffolding.
- Do not create future/ placeholder files.
- Keep the change small, testable, and reversible in one commit.
- If you discover the action is wrong, stop and report — do not pivot silently.
```

## Optional: hard-cap mode

For projects that have spiraled badly, add this clause at the top of the audit prompt:

```md
Hard cap on this audit:
- KEEP NOW: max 5 items
- DELAY: everything else
- If unsure, classify as DELAY, not KEEP
```

This forces the agent to be ruthless instead of diplomatic.

## Optional: diff-only mode

If the drift happened in the last run only, replace the "read in this order" section with:

```md
Read in this order:
1. `git diff main..HEAD --stat` (what changed since main)
2. `git log main..HEAD --oneline` (which commits)
3. The full diff for any commit larger than 100 lines
4. AGENTS.md

Classify only the items introduced since main. Leave the existing
project structure alone.
```

This is much faster and focuses the audit on the recent damage.

## Success criteria

This skill is working when:

- The next coding run is smaller and clearer than the last
- `futurefeatures/` exists and has more items than `src/`
- You can name the next action in one sentence without re-reading the codebase
- The agent stopped producing on its own instead of being told
- You commit fewer files per run, not more
- Dead files actually get deleted, not archived

It is failing when:

- The audit output is a wishlist disguised as priorities
- `NEXT SINGLE ACTION` is a paragraph, not a sentence
- DELAY items stay in the active tree "just for now"
- The follow-up run ignores the constraints and keeps expanding scope