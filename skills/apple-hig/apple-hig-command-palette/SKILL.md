---
name: apple-hig-command-palette
description: Use when designing, reviewing, or implementing a command-palette / ⌘K layer for an Apple-platform app — keyboard-first global search, ranked and grouped results, native floating panel, and protected destructive commands.
---

# Apple HIG Command Palette

Design and review a native-feeling ⌘K command palette: a fast, keyboard-first layer on top of the app for global search, quick actions, and jump-to navigation — not a replacement for the sidebar. Reach for this for keyboard-first workflows, global search, quick actions, jump-to navigation, task launching, skill running, project switching, prompt execution, and power-user workflows.

Apple does not treat “command palette” as a single standard control like `NavigationSplitView` or `.toolbar`, so this skill adapts Apple-native patterns: menu commands, keyboard shortcuts, Spotlight-style search, SF Symbols, accessibility, and calm macOS interaction design.

## Core rule

```
Sidebar = visible navigation
Toolbar = current-screen actions
Inspector = selected-item details
Command Palette = fast global control
```

The command palette is not a replacement for the sidebar. It is a fast layer on top of the app.

A good command palette answers:

```
What do you want to do?
Where do you want to go?
What do you want to find?
```

## When to use a command palette

Use a command palette when the app has many commands, views, files, projects, prompts, skills, or workflows that power users need to access quickly.

Good use cases:

- Jump to project
- Open file
- Run skill
- Create task
- Start an agent run
- Search prompts
- Switch workspace
- Open settings
- Generate report
- Open recent note
- Run saved automation
- Toggle inspector
- Change theme
- Copy current path

Avoid using the command palette for:

- Replacing all visible navigation
- Hiding essential beginner flows
- Complex forms
- Long onboarding
- Dangerous destructive commands without confirmation
- Everything in the app with no ranking or grouping

## Apple-style principles

### 1. Make it keyboard-first

Default shortcut:

```
⌘K = Open command palette
```

Optional alternatives:

```
⌘P = Quick open file/project
⇧⌘P = Full command list
```

A safe default:

```
⌘K = Command Palette
```

### 2. Focus search immediately

When the palette opens, the search field should already be focused.

Good behavior:

```
User presses ⌘K → palette opens → user types immediately → results filter live
```

Bad behavior:

```
User presses ⌘K → palette opens → user must click search field
```

### 3. Rank results by usefulness

Result ranking should prefer:

```
1. Exact title matches
2. Recently used items
3. Frequently used commands
4. Current context commands
5. Matching keywords
6. Secondary/advanced commands
```

Context matters:

```
On Projects screen: New Project should rank higher
On Active Runs screen: Stop Run / Clear Finished should rank higher
Inside a selected skill: Validate Skill should rank higher
```

### 4. Group results clearly

Use simple sections.

Recommended groups:

```
Suggestions
Commands
Projects
Skills
Prompts
Files
Notes
Reports
Settings
```

For small result sets, avoid too many groups. Grouping should help scanning, not add noise.

### 5. Show keyboard hints

Show shortcuts where useful.

Examples:

```
New Task              ⌘N
Search                ⌘F
Toggle Inspector      ⌘I
Settings              ⌘,
```

Do not show shortcut hints for every row if it becomes noisy.

## Recommended Command Palette behavior

```
Open: ⌘K
Close: Esc
Confirm: Return
Move selection: ↑ / ↓
Open selected result: Return
Open in background / alternate action: Option + Return, only if useful
Clear query: ⌘A then delete, or Esc behavior if search is non-empty
```

Esc behavior:

```
If query has text → clear query
If query is empty → close palette
```

## Visual design rules

The palette should feel like a native macOS floating panel.

Recommended:

```
Width: 560–720 px on macOS
Max height: 60–70% of window
Centered near top third of screen
Soft material background
Rounded corners
Subtle border
No heavy glow
No neon
No large cards
No marketing copy
```

Result row:

```
[SF Symbol] Title                         Shortcut / Type
            Optional short subtitle
```

Example:

```
sparkles   Run Skill: Apple HIG Sidebars       Skill
folder     Open Project: Acme                  Project
plus       New Task                            ⌘N
gearshape  Settings                            ⌘,
```

## Information architecture

Command palette items should come from a command registry.

Each command should define:

```
id
name
description
symbol
category
keywords
shortcut
scope
isEnabled
action
```

Example categories:

```
Navigation
Creation
Agent
Skills
Projects
Files
Memory
Reports
Settings
System
```

## SwiftUI command model

The reference SwiftUI code lives in `references/swiftui-implementation.md`: the command model, the palette shell, the command row, the filtering logic, and an example command registry for an agent/task app. Read it before writing any palette code.

---

## Actions that belong in the command palette

Good:

```
Jump to project
Open recent file
Run skill
Create task
Create prompt
Start an agent run
Search all memory
Generate daily report
Toggle inspector
Open settings
Switch theme
Copy current file path
Reveal project in Finder
Validate current skill
```

Bad:

```
Delete everything
Hidden critical onboarding
Multi-step settings forms
Full text editing
Long generated reports
Navigation that should be visible in sidebar
Every tiny context-menu action with no ranking
```

## Command palette vs sidebar

When deciding whether a command belongs in the palette, the sidebar, the toolbar, or should be left to Spotlight, read `references/comparisons.md`.

---

## Empty and no-result states

Empty query state should show useful suggestions:

```
Suggestions
- New Task
- Open Active Runs
- Run Skill
- Generate Report
- Settings
```

No results state:

```
No results
Try a project, skill, prompt, file, or command name.
```

Avoid dead ends. Suggest useful alternatives.

## Disabled commands

Disabled commands should explain why.

Example:

```
Stop Run
No active run selected
```

Do not silently hide disabled commands if their presence teaches the user what is possible.

But hide disabled commands if they add noise and are irrelevant to the current context.

## Destructive commands

Destructive commands may appear, but only with protection.

Rules:

```
- Do not rank destructive commands at the top.
- Use clear destructive wording.
- Require confirmation.
- Prefer undo support.
- Never execute destructive commands from Return alone if the command is broad.
```

Example:

```
Delete Project… → confirmation dialog
Clear Finished Runs… → confirmation dialog or undo
Remove Skill… → confirmation dialog
```

Use ellipsis for commands that require confirmation or more input:

```
Delete Project…
Export Report…
Generate Blog Draft…
```

## Accessibility rules

Command palette must support:

- VoiceOver result labels
- Keyboard-only navigation
- Escape to close
- Return to activate
- Clear selected state
- Sufficient contrast
- No color-only status
- Logical result order
- Disabled command explanation

Result rows should combine text semantically:

```swift
.accessibilityElement(children: .combine)
.accessibilityLabel("New Task, Create a new agent task, Command N")
```

## Keyboard behavior checklist

```
[ ] ⌘K opens palette
[ ] Search field is focused immediately
[ ] Esc closes palette or clears query
[ ] Return activates selected result
[ ] Up/down arrows move selection
[ ] Mouse hover updates selection if implemented
[ ] Disabled commands cannot execute
[ ] Focus returns to previous view after close
[ ] Shortcuts shown match real app shortcuts
```

## Visual review checklist

```
[ ] Palette is centered and calm
[ ] Search field is obvious
[ ] Results are scannable
[ ] Icons are meaningful and consistent
[ ] Selection state is visible
[ ] Keyboard hints are readable
[ ] No neon or heavy glow
[ ] No oversized cards
[ ] Empty state is useful
[ ] No-result state is helpful
[ ] Main app remains visually behind the palette
```

## Product review checklist

```
[ ] Palette does not replace sidebar navigation
[ ] Palette includes the most common global commands
[ ] Palette includes jump-to navigation
[ ] Palette includes recent/frequent items
[ ] Commands are ranked well
[ ] Commands are grouped without clutter
[ ] Destructive commands require confirmation
[ ] Command names use verbs clearly
[ ] Search handles synonyms and keywords
[ ] Context-specific commands rank higher
```

## Common mistakes

```
Command palette becomes the only navigation
Too many low-value commands
No keyboard navigation
Search field not focused on open
No ranking logic
No empty state suggestions
Destructive actions execute instantly
Icons are random decoration
Result rows are too large
Palette looks like a web modal, not a native panel
No accessibility labels
Shortcuts shown but not implemented
```

## Implementation instructions

When a coding agent is asked to add or improve a command palette:

1. Inspect the app's navigation model.
2. Inspect toolbar actions and menu commands.
3. Create a centralized command registry.
4. Add global palette visibility state.
5. Add `⌘K` shortcut.
6. Focus search field on open.
7. Add keyboard navigation.
8. Add result ranking and filtering.
9. Add groups only if useful.
10. Add empty and no-result states.
11. Add command execution routing.
12. Protect destructive commands with confirmation.
13. Add accessibility labels.
14. Add manual test steps.

## Output requirements

After implementation, the agent should report:

```
1. Files changed
2. Command registry structure
3. Commands added
4. Keyboard shortcuts added
5. Search/ranking behavior
6. Empty/no-result behavior
7. Destructive command protections
8. Accessibility improvements
9. Manual test checklist
```

## Prompt template

Two ready prompts live in `references/prompts.md`: the general command palette prompt template and the specialized prompt for an agent task hub. Read it when asked to produce a prompt or brief rather than code.

---

## Quality bar

```
The user presses ⌘K and immediately feels faster.
They can jump, create, run, and search without thinking about where things are.
The palette feels native, calm, and powerful without replacing the app structure.
```
