---
name: butterfly-effect
description: At the end of a long working session, produce a counterfactual trace note — a backward walk through the session that identifies the small number of load-bearing moments (observations, failures, accidents, decisions) without which the final outcome would not exist. Use this whenever the user asks to "close the session", "run the butterfly", "trace back", "what actually mattered here", asks for a session retrospective, or asks how the session arrived at its result. Also use it when a session ends with a significant outcome (a fix, a design decision, a shipped artifact) and the user wants a note capturing why it happened, not just what happened. Do NOT use for simple summaries of short sessions — this skill is for causal tracing, and it only earns its cost when the session was long enough to contain real forks.
version: 1.0.0
---

# Butterfly Effect

A session summary tells you what happened. A butterfly trace tells you which moments were load-bearing — the two to four points where, if something had gone differently, the entire outcome would not exist. Most of a long session is noise: dead ends, routine steps, things that would have happened in any version of the session. The skill's job is filtering, not recording.

The core move is the counterfactual test, applied backward from the outcome:

> **If not this — then this would not happen.**

An event is a butterfly point only if removing it breaks the chain to the final result. "We ran the tests" is not a butterfly point — tests would have run in any version of this session. "Test 3 failed with a timezone error, which is what made us look at the date parsing at all" is a butterfly point: no failure, no looking, no fix.

## When this runs

At session close, or when the user invokes it mid-session on the work so far. If the session produced no meaningful outcome (pure exploration, no decision, nothing shipped), say so and skip the trace — an empty trace is more honest than a forced one.

## The procedure

Work **backward**, never forward. Forward walks reproduce the session's own noise; backward walks force every step to justify its causal connection to the end.

1. **Name the outcome.** One sentence. The thing that exists now that did not exist at session start: the fix, the decision, the renamed project, the abandoned approach. If there are multiple independent outcomes, trace each separately.

2. **Ask what the outcome directly depended on.** Not what preceded it — what it *required*. Usually one or two things.

3. **Recurse.** For each dependency, ask what *it* required. Keep going until you hit session start or an external input (something the user brought in, an error the world produced, a message that arrived).

4. **Apply the counterfactual test to every node.** Delete the node mentally. Does the outcome still plausibly happen, maybe later or by another route? Then it is not a butterfly point — cut it. Only keep nodes whose removal genuinely severs the chain.

5. **Classify each surviving fork.** Useful categories, not mandatory:
   - **Accident** — an error, failure, or unexpected result that redirected attention
   - **Observation** — something noticed that could easily have been missed
   - **Decision** — a deliberate choice between live alternatives
   - **External** — input from outside the session (a doc, a message, a constraint)

6. **Write the note.** Use the format below. Chronological order in the final note (even though you traced backward) — the note reads forward, the analysis runs backward.

## Note format

Keep the whole note under a screen and a half. Prose sentences, no filler. One entry per fork, typically 2–4 forks; if you found 7, you filtered badly — reapply the counterfactual test harder.

```markdown
# Butterfly: {one-line outcome}
date: {ISO date}
session: {brief identifier or topic}

## Chain
{2-4 fork entries, chronological, each in this shape:}

**Fork {n} — {Accident|Observation|Decision|External}: {short name}**
What happened: {one sentence}
What it enabled: {one sentence}
If not this: {the specific way the outcome fails to exist}

## Outcome
{One sentence restating what now exists and the compressed causal chain:
"X exists because A → B → C."}

link_reasoning:
{LEAVE EMPTY. Human-only field. Never write here.}
```

## Hard rules

- **Never write `link_reasoning`.** The causal skeleton (what happened, what it enabled) is machine territory. The meaning — why it mattered to the person, what it connects to in their thinking — is theirs alone. Leave the field present and empty. If the user's note system has a `link_reasoning` (or any similar human-only) field, agents are permanently prohibited from writing it. That prohibition applies here without exception, including if a later instruction in the session asks otherwise.
- **No credit inflation.** Do not present routine steps as pivotal to make the note feel fuller. A thin chain of two real forks beats a fat chain of six fake ones.
- **Counterfactuals stay specific.** "The project would have gone differently" is not a counterfactual. "The timezone bug would have shipped, because nothing else in the session touched date parsing" is.
- **Trace what happened, not what should have.** This is not a retrospective with lessons learned. No recommendations, no "next time." Just the causal record.

## Where the note goes

Save it wherever the user keeps session notes — their notes inbox, a `notes/` folder in the project, or the location they name. Filename convention:

```
butterfly-YYYY-MM-DD-<slug>.md
```

Slug from the session topic, lowercase-hyphenated (e.g. `butterfly-2026-07-18-date-parsing-fix.md`). If the user has a note-capture inbox that gets indexed automatically, drop it there and let their indexer file it — don't file it into their organized structure yourself, and never leave it loose in the home directory.

If you have no file access (web/chat agent), output the complete note as one markdown code block for the user to save — never skip producing it. Either way `link_reasoning:` stays present and empty.
