---
name: product-hunt-polish-review
description: Use when reviewing an app for launch-readiness — Product Hunt polish, first impression, visual hierarchy, onboarding, empty states, screenshots, positioning, and the tiny details that make it feel premium.
---

# Product Hunt Polish Review

Review an app for launch-readiness so it feels useful, clear, trustworthy, and polished in the first 30 seconds. Be direct and critical, prioritize clarity over decoration, and end with a concrete pre-launch checklist.

## When to use

Use this skill when reviewing an app for launch-readiness, Product Hunt polish, first impression, visual quality, onboarding, screenshots, positioning, and tiny details that make the app feel premium.

## Core rule

```
A launch-ready app must feel useful, clear, trustworthy, and polished in the first 30 seconds.
```

## When to use this skill

Use when the user says:

- Product Hunt worthy
- launch polish
- make it premium
- make it viral
- first impression
- final polish
- pixel perfect
- app store ready
- landing page polish
- screenshot review

## When not to use this skill

Do not use this skill for:

- Deep architecture refactor
- Backend implementation
- Generic HIG review only
- Unfinished prototypes where core functionality does not work yet

## Review dimensions

```
1. First impression
2. Core value clarity
3. Visual hierarchy
4. Onboarding
5. Empty states
6. Feedback/status
7. Performance feel
8. Trust/privacy
9. Screenshots
10. Launch copy
```

## 30-second test

A new user should understand:

```
What is this?
Why do I need it?
What should I click first?
What happens after I click?
Can I trust it?
```

If not, simplify.

## First screen checklist

```
[ ] App name is clear
[ ] One-sentence value proposition exists
[ ] Primary action is obvious
[ ] No dense dashboard on first launch
[ ] Empty state helps user start
[ ] Visual style feels intentional
[ ] No broken or placeholder content
[ ] No confusing technical jargon for non-technical users
```

## Premium UI checklist

```
[ ] Consistent spacing
[ ] Consistent typography
[ ] Consistent SF Symbols
[ ] Calm color system
[ ] Main content has breathing room
[ ] Few competing elements
[ ] Clear selected states
[ ] Clear hover/focus states
[ ] Loading/error/success states exist
[ ] Dark and light mode are both checked
```

## Product Hunt positioning

Good format:

```
[Product] helps [user] do [job] without [pain].
```

Examples:

```
HubApp helps vibe coders run agent projects from one calm Mac workspace without losing track of tasks, skills, and active runs.

SkillPilot helps builders choose the right skills for each task without digging through folders.
```

## Screenshot checklist

For launch screenshots:

```
1. Hero screen showing main value
2. Command palette / fast workflow
3. Active run / status tracking
4. Skills/project organization
5. Settings/local AI/privacy
```

Rules:

- Use real-looking content.
- Avoid empty dashboards unless it is an intentional first-run screen.
- Show one clear story per screenshot.
- Add captions only if needed.
- Keep screenshots visually consistent.

## Empty state polish

Every empty state should sell the product gently.

Example:

```
No Active Runs
The agent is not working on anything right now.
Start a task, open the queue, or run a saved skill.
```

## Trust and privacy checklist

Especially for AI/local apps:

```
[ ] Explain what stays local
[ ] Explain when cloud is used
[ ] Do not silently send private prompts to cloud
[ ] Show model/provider status
[ ] Show folder permissions clearly
[ ] Store secrets securely
[ ] Add export/delete data options if relevant
```

## Microcopy rules

- Be direct.
- Avoid hype inside functional UI.
- Use verbs for actions.
- Avoid “magic” when explaining critical behavior.
- Make errors helpful.
- Make buttons specific.

Good buttons:

```
New Task
Run Skill
Open Queue
Generate Report
Connect Ollama
```

Bad buttons:

```
Go
Submit
Do Magic
Proceed
```

## Launch readiness score

Rate each 1–5:

```
Clarity
Visual polish
Speed feel
Onboarding
Empty states
Error states
Trust/privacy
Screenshot quality
Positioning
Retention hook
```

Launch only when the average is 4+ and no category is below 3.

## Common mistakes

```
❌ Beautiful UI but unclear value
❌ Too many features on first screen
❌ No onboarding
❌ No empty states
❌ Fake progress
❌ Placeholder content in screenshots
❌ No trust/privacy explanation
❌ Inconsistent icons/spacing
❌ Product Hunt copy too vague
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the product-hunt-polish-review skill to review this app for launch polish.

Goal:
Make the app feel premium, clear, useful, and launch-ready in the first 30 seconds.

Review:
- First impression
- Value proposition
- Primary action
- Visual hierarchy
- Empty states
- Feedback/status
- Onboarding
- Trust/privacy
- Screenshot readiness
- Microcopy

Rules:
- Be direct and critical.
- Identify what feels unfinished.
- Suggest concrete UI/content fixes.
- Do not add more features unless they improve first-time value.
- Prioritize clarity over decoration.

Output:
1. Launch readiness score / 10
2. Top 5 issues
3. Top 5 fixes
4. Screenshot plan
5. Product Hunt tagline options
6. Final pre-launch checklist
```
