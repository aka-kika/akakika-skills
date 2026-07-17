---
name: new-project-gate
description: Run before building anything new — a pre-build gate that decides whether an idea deserves its own tool, judged from both the agent lens (legible, drivable, automatable) and the human lens (will I touch it, do I want to maintain it). Trigger on "should I build X", "starting a new project / app / tool / repo", "is this worth making", "want to spin up", or any new-build intent — even if the word "checklist" never appears. Outputs a backed GATE.md with checkmarks and a one-line verdict note in the project root docs. Do NOT load for small config tweaks, one-off scripts, bug fixes on existing things, or anything that is clearly a feature of something you already run.
version: 1.1.0
---

# New Project Gate

A gate, not a form. Run it before the editor opens.

The job is to **kill bad ideas cheaply** and let good ones through with their smallest proving cut already named. The failure mode this guards against is sprawl — fast at building the wrong thing is just faster sprawl.

After a project is built and shipped, run it through [old-project-audit](../old-project-audit/SKILL.md) on the next pass to decide if it earned its keep.

## Verdict at a glance

| Checkpoint 0 or 1 → `KILL`   | Any other `[ ]` → `CUT`         | All green or `[~]` → `GO`        |
| ---------------------------- | ------------------------------- | -------------------------------- |
| Tool shouldn't exist at all  | Build smaller, fix the gap first | Build the dumbest proving cut    |

`[x]` = passed · `[ ]` = failed · `[~]` = unsure / needs the human

## How to run it

Walk the six checkpoints in order. For each one:

1. **Concise why** — one line on what this checkpoint protects against.
2. **1-2 line answer** — verdict for this idea, holding both lenses. If the lenses disagree, **say so**; that disagreement is the signal.
3. **Mark the check** — `[x]` `[ ]` or `[~]`.

**Stop early if checkpoint 0 or 1 fails hard.** No point pricing the build of a tool that shouldn't exist.

## The checkpoints

**0. Deserves to exist as its own tool**
Standalone thing, or a feature of something already running? Overlap with the catalogue? Is a new surface justified?
- *Agent lens:* can an agent already reach this through an existing tool or MCP?
- *Human lens:* do I want a separate thing to open and maintain?

**1. Real problem**
Whose problem, how often, what's done today instead?
- *Agent lens:* is there a task an agent repeatedly fails at without this, and how often does it come up?
- *Human lens:* do I hit this daily and suffer; would I reach for it unprompted next week?

**2. Dumbest version that proves it**
Smallest cut that validates. File-first, no agent layer yet. Ugly is fine.
- *Agent lens:* minimum structured surface (files + schema) to drive it.
- *Human lens:* minimum UI I'd actually touch within a week.

**3. Agent-legible by construction**
Clean data model, file-based state, scriptable now, MCP-able later.
- *Agent lens:* can an agent read/write state without scraping a GUI?
- *Human lens:* is the direct-touch loop still tight — legible, not agent-fronted?

**4. Fastest path to the dumb version**
Reuse the template. No foundations for a tool that might not survive your own usage.
- *Agent lens:* what can be scaffolded straight from the template?
- *Human lens:* what can only I decide — design, naming, taste, the "feels right" call?

**5. Kill criterion set up front**
Usage threshold and ARCHIVE path defined **before** building. No guilt, no maintenance tail.
- *Agent lens:* what measurable signal (last-touched, invocation count) flags it dead?
- *Human lens:* gut — would opening it feel like a chore rather than a reach?

## Output

Produce two things. No preamble, no apology — state the verdict and the cut.

### 1. `GATE.md` (or `<idea-slug>-gate.md`)

```
# <Idea> — New Project Gate
Date: <today>
Verdict: GO / CUT / KILL

- [x] 0. Deserves to exist — <1-2 line answer>
      why: <concise why>
- [x] 1. Real problem — <1-2 line answer>
      why: <concise why>
- [ ] 2. Dumbest proving version — <1-2 line answer>
      why: <concise why>
- [~] 3. Agent-legible — <1-2 line answer>
      why: <concise why>
- [x] 4. Fastest path — <1-2 line answer>
      why: <concise why>
- [x] 5. Kill criterion — <1-2 line answer>
      why: <concise why>

Smallest proving cut: <one line — what to actually build first>
Kill criterion: <one line — when this gets archived>
```

**Verdict rule:** any `[ ]` on checkpoint 0 or 1 → **KILL**. Any other `[ ]` → **CUT**. All green or `[~]` → **GO**.

### 2. One-line note to project root docs

Append one line to the project's root doc — `CLAUDE.md` if present, else `AGENTS.md`, else `README.md`, else create `NOTES.md`:

```
> Gate <date>: <VERDICT> — <smallest proving cut>. Kill if <criterion>.
```

## Example

```
# Daily Writing Habit Tracker — New Project Gate
Date: 2026-06-28
Verdict: CUT

- [x] 0. Deserves to exist — Not in my toolbox. No existing tool
      covers daily-writing-with-streak-stats.
      why: Stop adding tools that duplicate existing surfaces.
- [~] 1. Real problem — I think I want this. Not sure I hit it daily.
      Maybe 2x/month when I'm in a streak mood.
      why: Catch vibe-driven "ideas" before they become apps.
- [ ] 2. Dumbest proving version — Was going to build a SwiftUI app.
      Way too much for an unproven itch.
      why: First cut must be tiny enough to abandon cheaply.
- [x] 3. Agent-legible — A flat JSON file + a small CLI would work.
      why: If an agent can't read it, the data rots.
- [x] 4. Fastest path — Could scaffold from my starter template in
      an evening. Two scripts: append + report.
      why: Reuse before reinventing.
- [x] 5. Kill criterion — Archive if not used for 30 days or under
      10 entries by end of month 2.
      why: Set the kill bar before you fall in love with the build.

Smallest proving cut: Plain JSON log + daily cron-style CLI for 30 days, no UI.
Kill criterion: Under 10 entries in 60 days → archive, no rebuild.
```

Lens note: checkpoint 1 is `[~]` because the human side is honest about the vibe-driven itch. That's exactly the case the gate is built for — **CUT**, not KILL, because checkpoint 0 is green. Build the dumb version first; the kill criterion decides if it earns the upgrade.

## Pipeline

Built something and shipped it? Run [old-project-audit](../old-project-audit/SKILL.md) on it within a season. Tools that aren't re-audited go to limbo, which is the most expensive state a tool can sit in.