---
name: emergency-switch-app
description: Use when designing a user-initiated macOS emergency switch that helps the user save context before stopping, switching tasks, or leaving the computer — capture must be transparent, local-first, and easy to delete.
---

# Emergency Switch App

Design a user-initiated macOS emergency switch that helps the user save context before stopping, switching tasks, or leaving the computer. Capture must be user-initiated, transparent, local-first, and easy to delete — never silent monitoring.

## When to use

Use this skill when designing a user-initiated macOS emergency switch that helps the user save context before stopping, switching tasks, or leaving the computer.

## Core rule

```
Emergency capture must be user-initiated, transparent, local-first, and easy to delete.
```

## Use for

- Quick context note
- Stop-and-save workflow
- “What was I doing?” recovery
- Interruption recovery
- Local daily work summary

## Trigger options

```
Menu bar button
Global shortcut chosen by user
Command palette command
Manual quick capture button
```

## Capture fields

```
Manual note
Timestamp
Selected project
Current task if app knows it
User-selected files if provided
Optional active app/window title only with clear permission
```

## Privacy rules

- Never silently collect screen, keyboard, messages, or private app content.
- Ask before using any system permission.
- Show exactly what will be saved.
- Store locally by default.
- Let user edit/delete captured notes.

## Output

```
What I was doing
Why I stopped
Next step when I return
Related project/task
```

## Checklist

```
[ ] Capture is user-initiated
[ ] User sees what is captured
[ ] Permissions are explained
[ ] Data stays local unless user exports
[ ] Delete/edit exists
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the emergency-switch-app skill to design a privacy-first emergency context capture flow. It must be user-initiated, transparent, editable, deletable, and local-first. Do not add silent monitoring.
```
