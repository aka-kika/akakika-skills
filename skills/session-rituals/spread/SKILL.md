---
name: spread
description: Before improving anything, show the spread of what can concretely be done on this specific input — a short menu of 3-5 interventions from lightest to heaviest touch, then wait for the user to pick. Domain-agnostic; works on any material the user hands over. Trigger when the user says "spread", "show me my options", "what can you do with this", or asks to improve or fix something without specifying how. Do NOT trigger when the user has already named a specific fix — then just do the fix.
version: 1.0.0
---

# Spread

Show the capability spread on one concrete input before doing any work. Do not pick one interpretation of "fix this" and run with it. Enumerate the real options on this exact material, scope each honestly, and let the user choose the level.

## Hard rule: no input, no run

This skill operates on a specific thing the user provides. If triggered without one, ask what the thing is and wait. Never produce a generic capabilities list.

## Procedure

1. Read the input fully.
2. List 3-5 interventions you can concretely perform on it — actual operations against actual parts of the material, not categories or generic advice.
3. Order them lightest to heaviest touch.
4. Give one line per item on scope and risk.
5. Stop. Ask which level the user wants. Do zero work until they pick.

## Constraints

- Only list what you can actually complete with what's available. If an option needs something missing, mark it "needs: X" inline.
- If the honest spread is thin, say so. Fewer real options beat padded ones.
- Keep the whole output under one screen. No emojis, no headers inside the output.

## After the pick

Execute only the chosen option at its stated scope. If mid-work that scope can't achieve the goal, stop and say so — offer to move up one level, don't just do it.
