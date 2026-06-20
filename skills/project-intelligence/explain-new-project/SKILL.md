---
name: explain-new-project
description: Use when the user adds a project to the workspace, opens an unfamiliar repo, asks "what is this project", "explain this codebase", or invokes explain-new-project. Explores a newly opened workspace project and writes a plain-language report for a self-taught, non-technical user—quick start (what it is + how to run) first, then optional depth—and always saves PROJECT_GUIDE.md in the project root.
disable-model-invocation: true
---

# Explain New Project

## Audience

The reader is **self-taught** (about two years of hands-on work), **not tech-savvy**, and learns best from **everyday language**. They are capable and curious—not beginners who need hand-holding, but people who want clarity without jargon walls.

## Language rule

Write the report in **the same language the user uses in chat** (default: English). If they mix languages, follow their latest message.

**"My own language" means:**
- Short sentences, active voice
- No assumed CS degree
- Technical terms only when needed—and always explained (see Jargon rule)
- Analogies welcome when they clarify (one line max)

## When invoked

1. Confirm which folder is the **project root** (workspace root, or a path the user names).
2. **Explore before writing**—do not guess. Read enough to be accurate.
3. Write the full report using the template below.
4. **Always save** `PROJECT_GUIDE.md` at the **project root** (same folder as README or main manifest). Overwrite if it already exists.
5. In chat: show the **Quick start** sections in full, then one line pointing to the file for the rest—e.g. *Full guide saved to `PROJECT_GUIDE.md`—scroll down there for the map, tech stack, gotchas, and next steps.*

## Exploration checklist

Work through these until you have a confident picture (skip what does not exist):

```
- [ ] README, README.*, docs/, AGENTS.md, CONTRIBUTING
- [ ] Top-level folders (what lives where)
- [ ] Manifest: package.json, pyproject.toml, Cargo.toml, go.mod, Podfile, etc.
- [ ] Entry points: main app file, index, App.tsx, src/main.*
- [ ] How to run: scripts in package.json, Makefile, docker-compose, .env.example
- [ ] Tests folder (if any)—only to say *whether* tests exist, not to teach testing
- [ ] .gitignore / deploy hints (Vercel, Docker, etc.)—plain words only
```

Use search/read tools; prefer evidence from files over assumptions.

## Jargon rule

Whenever you use a term the reader might not know (API, dependency, build, deploy, framework, repo, branch, env var, etc.):

**Inline teach:** add a **Learn:** line immediately after, max two sentences.

Do not dump a glossary at the end unless there are many terms; teach inline as you go.

## Report template

**Order matters.** Quick start first so the reader can stop after section 2 and still be unblocked.

```markdown
# [Project name] — plain guide

> **Quick start** — read through "How you run it", then stop if that is enough.
> **The rest** — optional depth when you want the full picture.

---

## In one minute
[2–4 sentences: what this project is for, who it is for, and what "done" looks like]

## How you run it
[Only steps that exist in the repo. Numbered steps. If setup is unclear, say what is missing.]

**Learn:** [only if "run", "install", or "dev server" needs explaining]

---

## The rest (optional)

### What you would use this for
[Concrete scenarios in plain language]

### How it is organized (the map)
[Folder-by-folder in plain English—what each important folder *is for*, not every file]

### Main pieces (the cast)
| Piece | Plain role |
|-------|------------|
| ... | ... |

### What technologies it uses (no buzzwords)
[List stack in friendly terms, e.g. "website UI in React", "small server in Node"]

### Things that might confuse you
[2–5 honest gotchas: env files, monorepo, generated folders, old README, etc.]

### Safe next steps for you
[3–5 ordered suggestions: e.g. open X file, run Y command—matched to their level]

### If you want to go deeper later
[1–3 file paths worth opening when curious—not a reading list homework]
```

## Tone

- Respectful, direct, warm—not childish
- Say "you" to the reader
- Prefer "this folder holds…" over "the architecture implements…"
- If something is incomplete or broken, say so plainly
- Do not lecture about best practices unless it affects *their* next step

## What not to do

- Do not output raw directory trees without explanation
- Do not recommend large refactors or "you should learn X framework"
- Do not assume they know git beyond basics unless the project requires it
- Do not skip saving `PROJECT_GUIDE.md`
- Do not ask whether to save the file

## Multi-root workspaces

If several projects are open:
- If the user named one, explain only that root and save `PROJECT_GUIDE.md` **there**.
- If unclear, list each root in one line, ask which to explain, **or** give a one-minute summary per root and save one guide per root they care about.

## Example (tone only)

**In one minute:** *Shop Helper* is a small web app that lets you track products and prices. When you open it in the browser, you see a list you can add to and edit.

**How you run it:**
1. Open a terminal in this folder.
2. Run `npm install` once (downloads dependencies).
3. Run `npm run dev` and open the link it prints.

**Learn:** *npm* is a tool that installs and runs JavaScript project pieces; you use the same two commands in most web projects like this.

## Follow-up skills

| Order | Skill | When | Saves |
|-------|--------|------|--------|
| Optional | [project-worth-my-time](../project-worth-my-time/SKILL.md) | Is this worth continuing? | `PROJECT_VERDICT.md` |
| On return | [project-catch-up](../project-catch-up/SKILL.md) | Coming back after a break—updates, tools, skills | `PROJECT_CATCH_UP.md` |

Invoke the project-worth-my-time or project-catch-up skill when you reach those points.

---

For more output samples, see [examples.md](examples.md).
