---
name: til
description: "Teach ONE concept from THIS session — a term that flew past, the idea behind a fixed mistake, or a tool that did silent work — and save it to the Obsidian vault's TIL/ folder in the same turn. Use when the user says 'til', '/til', ';til', 'what did I learn', or asks for the one thing worth learning from the session — also appropriate at session close alongside other closing rituals."
---

# til

The user is a builder who ships real things without formal CS background.
Terms fly past in every session; they usually search them alone afterward.
This skill closes that gap: one concept per run, taught properly, from
THIS session — not generic trivia. Every lesson is also written to the
Obsidian vault so the vocabulary accumulates instead of scrolling away.

## The contract: chat AND vault, same turn

The lesson always lands in two places in the same turn:

1. The full lesson text in chat, where the user reads it now.
2. The identical text as a note in the vault, where it accumulates.

Never chat-only. Never save-only. Never ask permission before saving, never
defer the save to "after you confirm" — teach and write in one pass, then
show the footer with the note path.

## Picking the one thing

Priority order — take the first that applies:

1. A term or concept that appeared 2+ times in the session that the user
   never used in their own words (they worked around it).
2. The concept behind a mistake that was made and fixed — teach the why,
   not the blame.
3. A tool, pattern, or piece of syntax that was used silently and did
   real work (e.g. a flag, an atomic write, a data structure choice).
4. Fallback only: a genuinely good fun fact connected to the session's
   language, tool, or history.

One thing. If two are tempting, save the second for the next run —
say "there's another one banked for next time" and nothing more.

Before teaching, list the TIL folder (see below) and skip any term that
already has a note. If the top pick is already there, drop to the next
priority.

## How to teach it

- Name the term first, exactly as it's written, so it can be searched.
- One or two short paragraphs. Plain English. Every jargon word used in
  the explanation must itself be explained or dropped.
- Analogies are welcome — audio production, DJing, signal flow, and
  physical-world analogies land better than CS metaphors.
- End with one line: why it mattered in THIS session specifically.
- Close with: "Want the deeper version?" — and only expand if asked.
  The deep version may go longer, show code, and link docs.

## Writing the note

**Where.** The vault is at:

```
/Users/kika_hub/_KIKA_MAIN/Kika's_Obsidian
```

Write directly to `TIL/` at the vault root with the filesystem (Write
tool). Create `TIL/` if it doesn't exist. Only if the path above is gone,
fall back to the `kika-obsidian-mcp` tools, and only then ask for the
vault path (once, then reuse it).

**Filename.** `YYYY-MM-DD-<term-slug>.md` — lowercase, spaces and dots to
hyphens, no other punctuation. Two notes on the same day for the same
term shouldn't happen (the dedupe check runs first); if it somehow does,
append `-2`.

**Contents.** Frontmatter first so Obsidian Bases can filter on it:

```markdown
---
term: <the term, exactly as written in the wild>
date: <YYYY-MM-DD>
project: <repo or project name, or "none">
source: session
tags: [til]
---

# <term>

<the same one-or-two paragraphs taught in chat, verbatim>

**Why it mattered here:** <the one line from the chat answer>
```

Do not expand, re-word, or add sections the chat answer didn't have. The
note is a record of what was taught, not a second draft of it. If the
user asks for the deeper version afterward, append it to the same note
under a `## Deeper` heading — don't create a second file.

Nothing else goes in the vault. No index file, no MOC, no daily-note
edits, no backlinks the user didn't ask for.

## Output footer

Last line in chat, always, greppable:

```
TIL: <term> — <summary in ten words or fewer>
```

Then one short line with the note path, e.g. `→ TIL/2026-08-18-idempotent.md`.
No commentary on the save itself.

## Hard rules

- Exactly one concept. Never a list. Never "3 things you learned."
- Chat and vault get the same lesson in the same turn — see the contract.
- Default length: two paragraphs max. Expansion only on request.
- Must come from the actual session content. If the session was trivial,
  say so and use priority 4 — never invent relevance.
- Never condescend. The user ships production apps; missing vocabulary
  is not missing ability.
- Never overwrite an existing TIL note. Check the folder, pick a fresh
  term, or append under `## Deeper` — those are the only two options.
- If the vault write fails, still teach the lesson in chat and say the
  save failed in one line. Never swallow the error, never retry loops.
