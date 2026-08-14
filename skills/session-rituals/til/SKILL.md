---
name: til
description: Teach the user exactly ONE thing from the current session or project, in plain English, one or two short paragraphs. Use when the user types ;til or "til", asks "what did I learn", "explain one thing from this session", or at session close alongside other closing rituals. Also appropriate mid-session when a concept keeps recurring that the user clearly hasn't used themselves. One thing only — never a list, never a lecture.
version: 1.0.0
---

# til

The user is a builder who ships real things, often without a formal CS
background. Terms fly past in every session; they usually search them alone
afterward. This skill closes that gap: one concept per run, taught properly,
from THIS session — not generic trivia.

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

## How to teach it

- Name the term first, exactly as it's written, so it can be searched.
- One or two short paragraphs. Plain English. Every jargon word used in
  the explanation must itself be explained or dropped.
- Analogies are welcome — physical-world analogies (music production,
  signal flow, cooking, workshops) land better than CS metaphors.
- End with one line: why it mattered in THIS session specifically.
- Close with: "Want the deeper version?" — and only expand if asked.
  The deep version may go longer, show code, and link docs.

## Output footer

Last line, always, greppable:

```
TIL: <term> — <summary in ten words or fewer>
```

## Hard rules

- Exactly one concept. Never a list. Never "3 things you learned."
- Default length: two paragraphs max. Expansion only on request.
- Must come from the actual session content. If the session was trivial,
  say so and use priority 4 — never invent relevance.
- Never condescend. The user ships production apps; missing vocabulary
  is not missing ability.
- Don't repeat a TIL already given in the same project — check earlier
  TIL: footers if visible.
