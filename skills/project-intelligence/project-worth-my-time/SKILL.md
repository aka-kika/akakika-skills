---
name: project-worth-my-time
description: Use after PROJECT_GUIDE.md exists, when the user asks if a project is worth their time, should they build vs buy, or invokes project-worth-my-time. Follow-up to explain-new-project—uses Pieces MCP (persona + long-term memory) plus project context to recommend whether to invest in a repo, cherry-pick a feature, park the idea, pass, or use an existing polished product instead.
disable-model-invocation: true
---

# Project Worth My Time

## Relationship to other project skills

This skill is a **follow-up** to [explain-new-project](../explain-new-project/SKILL.md). When resuming work after time away, also see [project-catch-up](../project-catch-up/SKILL.md) for stack updates and new tools/skills.

It assumes you already understand *what* the project is.

1. If `PROJECT_GUIDE.md` exists at the project root, **read it first** (do not re-explore from scratch unless it is stale or missing quick-start sections).
2. If it does not exist, either run the same exploration as [explain-new-project](../explain-new-project/SKILL.md) or tell the user: *Run the explain-new-project skill first for a faster, clearer verdict.*

Same **audience** and **language rules** as explain-new-project: self-taught, plain language, **Learn:** lines for jargon, language matches the user's chat.

## When invoked

1. Confirm **project root**.
2. **Pieces MCP (required before judging)** — see below. Do not skip if the server is available.
3. Read **project evidence**: `PROJECT_GUIDE.md`, README, manifest, rough maturity signals (last commit, TODOs, half-built features).
4. **Alternatives scan** — if the project is a common product type (habit app, landing page, automation, CRM, etc.), search the web for mature tools the user could use instead of building from scratch.
5. Write the verdict using the template below.
6. **Always save** `PROJECT_VERDICT.md` at the project root (overwrite if present).
7. In chat: show **Quick verdict** + **What I'd do** in full; one line points to the file for reasoning, alternatives, and Pieces context.

## Pieces MCP workflow (required)

Call these via the **user-pieces** MCP server. If a call fails (PiecesOS off, no data), say so plainly and base the verdict on project files + chat only—do not invent memory.

### Step 1 — Persona

```
get_user_persona()
```

Use for tone, role, and stated preferences.

### Step 2 — LTM queries (run 2–4, adapt wording to this project)

Use `ask_pieces_ltm` with `question`, `topics`, `open_files` (current workspace paths), and `related_questions` when helpful.

**Query A — current focus**
- Question: *What projects and apps have I been working on most in the last 2–4 weeks? What am I trying to ship or learn?*
- Topics: active projects, goals, current sprint, main repo names if known from path

**Query B — tools and workflow**
- Question: *What tools, stacks, and workflows do I prefer and use repeatedly (editors, frameworks, hosting, AI tools)?*
- Topics: stack preferences, editor/agent, Vercel, React, Swift, automation habits

**Query C — fit with this project**
- Question: *Have I worked on something similar to [one-line project summary]? What happened—did I finish, abandon, or pivot?*
- Topics: [project name], [domain keywords from PROJECT_GUIDE]

**Query D — energy and patterns (optional)**
- Question: *Do I tend to start many projects and not finish? What kinds of projects did I actually complete recently?*
- Topics: unfinished projects, shipped work, motivation

Synthesize Pieces results into a short **About you (from your recent work)** block in the saved file—no raw dumps.

## Alternatives scan (existing products)

When the idea is exciting but **building everything** is unlikely to beat polished software:

1. Name the **job to be done** in plain language (not the tech stack).
2. Use **web search** for 2–3 established options (open-source or commercial) that solve it well.
3. In the verdict, be honest: *Your idea can still be worth it for learning or a niche twist—but if you only need [outcome], [Product] may be enough.*

Do not dismiss the user's idea; separate **learning/building** from **getting the outcome today**.

## Verdict types (pick exactly one primary)

| Verdict | Meaning |
|---------|---------|
| **Go deep** | Fits your goals, stack, and energy; worth continuing or finishing |
| **Cherry-pick** | Take one feature, pattern, or file; do not carry the whole repo |
| **Park it** | Good idea, wrong time—save for a future project |
| **Pass** | Low payoff vs effort given your context; unlikely to finish or use |
| **Use existing instead** | The outcome already exists, polished; building duplicate is optional |

You may add a **secondary** note (e.g. primary **Park it**, secondary *consider Notion template for X*).

## Report template

**Quick verdict first**—reader can stop after section 2.

```markdown
# [Project name] — worth your time?

> **Quick verdict** — read the box and "What I'd do", then stop if you have your answer.
> **The rest** — why, your context, alternatives, and honesty checks.

---

## Quick verdict

**Primary:** [Go deep | Cherry-pick | Park it | Pass | Use existing instead]

**In one sentence:** [Plain-language recommendation]

## What I'd do

[3–5 bullets: concrete next actions—open X, archive repo, try tool Y, steal feature Z, etc.]

---

## The rest (optional)

### Why (matched to you)

[Plain reasoning tied to PROJECT_GUIDE + Pieces context—not generic advice]

### About you (from your recent work)

[Short synthesis from Pieces persona + LTM; if Pieces unavailable, say so]

### Build vs use something that already exists

| Option | Best for | Tradeoff |
|--------|----------|----------|
| Keep building this | ... | ... |
| [Existing tool 1] | ... | ... |
| [Existing tool 2] | ... | ... |

[Only include rows that apply. **Learn:** lines for unfamiliar product names if needed.]

### Honesty check

- **Excitement:** [Does the idea still spark joy?]
- **Reality:** [Half-built? duplicate? misaligned with what you actually use?]
- **Opportunity cost:** [What you might not do if you stay here]

### If you cherry-pick or park

- **Save this idea as:** [one-line note they can paste elsewhere]
- **Worth stealing:** [specific file, pattern, or feature—or "none"]

### If you go deep

- **First milestone (small):** [one achievable win]
- **Stop if:** [signal to pivot or pass]
```

## Tone

- Direct friend, not a productivity guru
- Celebrate excitement; challenge **duplicate work** gently
- Never shame abandoned projects
- If Pieces shows they already have 3 similar WIPs, say so kindly

## What not to do

- Do not give a verdict without attempting Pieces MCP (when available)
- Do not recommend "learn X framework" unless it unblocks *their* stated goal
- Do not skip the alternatives scan for app-like or SaaS-like projects
- Do not ask whether to save `PROJECT_VERDICT.md`
- Do not replace `PROJECT_GUIDE.md`—this is a separate file

## Multi-root workspaces

Same rules as explain-new-project: one verdict per named root; save `PROJECT_VERDICT.md` in that root only.

---

Examples: [examples.md](examples.md)
