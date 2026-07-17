---
name: old-project-audit
description: Run on an existing project to decide KEEP / MERGE / ARCHIVE — never limbo. Forces a call on tools that already exist and may have stopped earning their keep. Trigger on "is this still worth keeping", "audit this repo", "tech-debt cleanup", "sweep the folder", "what's dead here", or any signal that something hasn't been touched in months. Judged from both the agent lens (still legible, still drivable, still safe) and the human lens (do I still reach for it, does it nag). Includes a non-negotiable footgun check for stale pipelines that can overwrite live data. Outputs a backed AUDIT.md and a one-line verdict note in the project root docs. Do NOT load for greenfield projects (use new-project-gate), one-off bug fixes, or when the answer is already obvious.
version: 1.1.0
---

# Old Project Audit

An audit for things that already exist. Stale tools rot in a way fresh ones can't — the data model drifts, old scripts keep pointing at live data, and the thing sits in limbo because nobody made the call. **This forces the call.**

If the thing you're auditing is brand new and not yet built, run it through [new-project-gate](../new-project-gate/SKILL.md) first. This skill is for things already on disk that may have stopped earning their keep.

## Verdict at a glance

| Checkpoint 4 failed + unguarded → not KEEP | Checkpoint 3 failed → MERGE      | Checkpoint 1 or 2 failed → ARCHIVE      | Otherwise → KEEP         |
| ----------------------------------------- | -------------------------------- | --------------------------------------- | ------------------------ |
| Resolve the footgun or archive            | Two tools, one job — collapse it  | Stopped earning the slot it occupies    | Keep as-is, re-audit later |

`[x]` = healthy · `[ ]` = failed · `[~]` = unsure / needs the human

## How to run it

Walk the six checkpoints in order. For each one:

1. **Concise why** — one line on what this checkpoint protects against.
2. **1-2 line answer** — verdict for this project, holding both lenses. If they disagree, **say so**.
3. **Mark the check** — `[x]` `[ ]` or `[~]`.

**Checkpoint 4 (footgun) is non-negotiable.** If it fails and is unguarded, the verdict cannot be KEEP — a tool that can silently clobber live data is a liability regardless of how useful it is.

## The checkpoints

**1. Still solving a real problem**
Does the original problem still exist, or did the workflow move past it?
- *Agent lens:* is anything still calling this, or was the need absorbed elsewhere?
- *Human lens:* have I reached for it in the last week or month, or am I keeping it out of sentiment?

**2. Earning its keep**
Use vs maintenance ratio. Cost of the tail it drags.
- *Agent lens:* what does it cost to keep legible and running — deps, schema drift, breakage surface?
- *Human lens:* is upkeep bigger than value; does it nag when I see it in the folder?

**3. Overlap and duplication**
Does it duplicate another tool? Could it be merged?
- *Agent lens:* two tools an agent could reach for the same job is ambiguity — collapse it.
- *Human lens:* do I mentally reach for two things for one task?

**4. Footgun / stale-pipeline risk** *(non-negotiable)*
Old scripts pointing at live data. Anything that can overwrite production silently. Destructive paths with no guard.
- *Agent lens:* could an agent run an old path and clobber live state — where's the live source, what writes to it?
- *Human lens:* if I ran this cold having forgotten how it works, what's the worst it does, and is that guarded?

**5. Agent-legible or GUI-trapped**
Clean data model intact? State reachable without the UI?
- *Agent lens:* can an agent drive it today, or is the value locked behind a GUI?
- *Human lens:* how much rework to wire an agent in now — and is that rework worth it or a retire signal?

**6. Verdict**
One decision. No limbo.
- *Agent lens:* keep / merge / archive — pick one and make the state legible (move files, update the index).
- *Human lens:* same call, made honestly.

## Output

Produce two things. No preamble, no apology — state the verdict and the action.

### 1. `AUDIT.md` (or `<project-slug>-audit.md`)

```
# <Project> — Old Project Audit
Date: <today>
Verdict: KEEP / MERGE / ARCHIVE

- [x] 1. Still solving a real problem — <1-2 line answer>
      why: <concise why>
- [ ] 2. Earning its keep — <1-2 line answer>
      why: <concise why>
- [x] 3. Overlap / duplication — <1-2 line answer>
      why: <concise why>
- [ ] 4. Footgun / stale pipeline — <1-2 line answer>
      why: <concise why>
- [~] 5. Agent-legible — <1-2 line answer>
      why: <concise why>
- [x] 6. Verdict — <1-2 line answer>
      why: <concise why>

Action: <one line — what to actually do: keep as-is, merge into X, archive to where>
Footgun guard: <one line — only if checkpoint 4 failed; what must be fixed first>
```

**Verdict rule:**
- Checkpoint 4 failed and unguarded → **cannot be KEEP**; resolve the footgun or **ARCHIVE**
- Checkpoint 3 failed (duplicates another tool) → **MERGE**
- Checkpoint 1 or 2 failed → **ARCHIVE**
- Otherwise → **KEEP**

### 2. One-line note to project root docs

Append one line to the project's root doc — `CLAUDE.md` if present, else `AGENTS.md`, else `README.md`, else create `NOTES.md`:

```
> Audit <date>: <VERDICT> — <action>. <footgun note if any>
```

## Example

```
# linkshelf v1 — Old Project Audit
Date: 2026-06-28
Verdict: MERGE

- [x] 1. Still solving a real problem — Yes. Need to turn reading-list
      links into shelved items. Did it twice this month.
      why: Catch tools kept out of sentiment.
- [~] 2. Earning its keep — Used it. Maintenance tail is small but the
      linkshelf-catalog fork already does this and more.
      why: Use-vs-upkeep check.
- [x] 3. Overlap / duplication — linkshelf-catalog is the successor. Two
      surfaces, one job.
      why: This is the merge trigger.
- [ ] 4. Footgun / stale pipeline — The old "publish" script in
      linkshelf/ still points at the live API. No guard, no dry-run.
      why: This is why limbo is dangerous.
- [x] 5. Agent-legible — Flat markdown files. Any agent can read/write.
      why: If locked behind GUI, that's a tax.
- [x] 6. Verdict — Merge into linkshelf-catalog, archive linkshelf after
      footgun is removed.
      why: No limbo — pick one.

Action: Move docs + scripts into linkshelf-catalog; delete /linkshelf once footgun is removed.
Footgun guard: Delete or hard-rename the old publish script before any merge — keep it unreachable so an agent can't run it cold.
```

Lens note: checkpoints 2 and 3 together are the merge signal — a fork exists that's strictly better. Checkpoint 4 failing is what would normally block KEEP; here it's resolved by **archive-with-footgun-removed**, which is the cleanest path to the merge.

## Pipeline

Audit outcomes should update the project index (whatever you use — `AGENTS.md`, a skills catalog, etc.) so the next cold-start doesn't re-discover the same dead thing. Tools that survive the audit get re-audited next season; tools that don't get moved, not left in limbo.