---
name: agent-starter-pack
description: Use when creating a new project folder, starter pack, app scaffold, or agent-ready workspace — AGENTS.md, README, TASKS, DECISIONS, PROMPTS, an idempotent bootstrap script, and starter-pack modes.
---

# Agent Starter Pack

Scaffold a new project so any coding agent can pick it up immediately: structure, memory, tasks, prompts, and clear instructions. Never overwrite user files or copy secrets by default.

## When to use

Use this skill when creating a new project folder, starter pack, app scaffold, or agent-ready workspace.

Use for project starter apps, bootstrap scripts, universal project templates, and new agent project setup.

## Core rule

```
Every new project should start with structure, memory, tasks, prompts, and clear instructions for the coding agent.
```

## When to use this skill

Use when the user says:

- new project starter
- create project folder
- starter pack
- bootstrap project
- [AGENTS.md](http://AGENTS.md)
- universal project template
- create app folder structure
- project scaffold
- agent-ready project

## When not to use this skill

Do not use this skill for:

- Existing project refactors unless user asks to add starter files
- UI design only
- GitHub workflow only
- Full app generation without asking for target platform/framework when unknown

## Default folder structure

```
ProjectName/
  AGENTS.md
  README.md
  TASKS.md
  DECISIONS.md
  PROMPTS.md
  CHANGELOG.md
  .env.example
  .gitignore
  docs/
    product-brief.md
    architecture.md
    ui-notes.md
  prompts/
    build.md
    review.md
    polish.md
  skills/
  src/
  assets/
  tests/
```

## Minimal project files

### [AGENTS.md](http://AGENTS.md)

```markdown
# AGENTS.md

## Project Goal
Describe what this project is building.

## Rules for the agent
- Read README.md first.
- Check TASKS.md before coding.
- Record major decisions in DECISIONS.md.
- Keep changes small and explain them.
- Run available tests or explain why not.

## Current Stack
- Platform:
- Language:
- Framework:
- Package manager:

## Output Requirements
After each task, report:
1. Files changed
2. What changed
3. How to test
4. Known risks
```

### [README.md](http://README.md)

```markdown
# Project Name

## Purpose

## Features

## Setup

## Run

## Test

## Notes
```

### [TASKS.md](http://TASKS.md)

```markdown
# TASKS.md

## Now
- [ ] Define first task

## Next
- [ ] Add next task

## Later
- [ ] Add future idea

## Done
- [ ] Completed work
```

### [DECISIONS.md](http://DECISIONS.md)

```markdown
# DECISIONS.md

## Decision Log

### YYYY-MM-DD — Decision title
Context:
Decision:
Reason:
Tradeoffs:
```

### [PROMPTS.md](http://PROMPTS.md)

```markdown
# PROMPTS.md

## Build Prompt

## Review Prompt

## Polish Prompt
```

## Starter pack modes

```
minimal = AGENTS, README, TASKS, DECISIONS, PROMPTS
app = minimal + src, assets, tests, docs
swiftui = app + Xcode notes, app architecture docs
web = app + package scripts and frontend docs
ai = app + prompts, skills, memory, evals
```

## Bootstrap script behavior

If creating a script:

```
Input: target folder path
Optional: include .env.local or not
Creates missing folders
Copies template files
Does not overwrite without confirmation
Prints next steps
```

## Safe bootstrap rules

- Never overwrite user files silently.
- Ask before copying secrets.
- Default to `.env.example`, not `.env.local`.
- Print created files.
- Print skipped files.
- Make the script idempotent.

## Shell script pattern

```bash
#!/usr/bin/env bash
set -euo pipefail

target="${1:-}"

if [[ -z "$target" ]]; then
  echo "Usage: ./bootstrap.sh /path/to/new-project"
  exit 1
fi

mkdir -p "$target"/{docs,prompts,skills,src,assets,tests}

touch "$target/README.md"
touch "$target/TASKS.md"
touch "$target/DECISIONS.md"
touch "$target/PROMPTS.md"
touch "$target/.env.example"

echo "Created project starter at: $target"
```

## Menu bar project starter app behavior

For a menu bar starter app:

```
Settings:
- Default projects folder
- Starter files to include
- Skill folders to include
- Default AGENTS.md template
- Git init toggle
- Open in Finder toggle
- Open in editor toggle

Create flow:
- Project name
- Location
- Starter pack mode
- Selected skills
- Create
```

## Quality checklist

```
[ ] Project has AGENTS.md
[ ] Project has README.md
[ ] Project has TASKS.md
[ ] Project has DECISIONS.md
[ ] Project has PROMPTS.md
[ ] Secrets are not copied by default
[ ] Existing files are not overwritten silently
[ ] Folder structure matches project type
[ ] Next steps are printed
[ ] The agent can understand what to do next
```

## Common mistakes

```
❌ Starting projects with only source files
❌ No AGENTS.md
❌ No task list
❌ No decision log
❌ Copying .env.local by default
❌ Overwriting files silently
❌ Too many folders with no purpose
❌ No README setup instructions
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the agent-starter-pack skill to create an agent-ready project starter.

Rules:
- Create a clear project folder structure.
- Include AGENTS.md, README.md, TASKS.md, DECISIONS.md, PROMPTS.md, and .env.example.
- Add docs/, prompts/, skills/, src/, assets/, and tests/ as appropriate.
- Do not overwrite existing files silently.
- Do not copy secrets by default.
- Make bootstrap scripts idempotent.
- Print created and skipped files.
- Add clear next steps for the user.

After coding:
1. List created files/folders.
2. Explain starter pack mode.
3. Explain overwrite/secrets behavior.
4. Give manual test steps.
```
