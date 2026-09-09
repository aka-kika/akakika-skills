# Prompt templates

Moved out of SKILL.md on 2026-09-09 to keep the body under 500 lines. Read this whole file when the pointer in SKILL.md sends you here.

## Contents

- Prompt template
- Specialized prompt for an agent task hub

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-command-palette skill to add or improve the command palette in this Apple-platform app.

Goal:
Create a native-feeling, keyboard-first Command K palette for fast global actions, jump-to navigation, project/file/skill search, and agent workflows.

Rules:
- Sidebar remains visible navigation.
- Toolbar remains current-screen actions.
- Inspector remains selected-item details.
- Command palette is a fast global control layer.
- Use ⌘K to open the palette.
- Focus search immediately when opened.
- Esc clears query first, then closes when query is empty.
- Return activates selected result.
- Up/down arrows move selection.
- Use SF Symbols consistently.
- Use semantic result labels for accessibility.
- Rank exact, recent, frequent, and context-relevant results higher.
- Add useful empty-state suggestions.
- Add helpful no-result state.
- Protect destructive commands with confirmation.
- Do not use the command palette as the only navigation.
- Do not add every tiny action if it creates noise.

Before coding:
1. Inspect navigation, toolbar actions, menus, and existing keyboard shortcuts.
2. Propose command categories.
3. Propose initial command registry.
4. Then implement.

After coding:
1. List files changed.
2. Show the command registry structure.
3. List commands added.
4. Explain ranking/filtering behavior.
5. Explain keyboard behavior.
6. Explain destructive-command protections.
7. Include manual test steps.
```

## Specialized prompt for an agent task hub

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-command-palette skill to build a Command K system for this macOS/iPadOS agent task hub.

Command categories:
- Suggestions
- Navigation
- Create
- Agent
- Projects
- Skills
- Prompts
- Files
- Memory
- Reports
- Settings

Required commands:
- New Task
- New Project
- New Skill
- New Prompt
- Open Active Runs
- Open Queue
- Open Projects
- Open Skills
- Open Prompts
- Open Files
- Open Notes
- Open Reports
- Run Selected Skill
- Validate Selected Skill
- Generate Daily Report
- Search Memory
- Toggle Inspector
- Open Settings
- Reveal Current Project in Finder
- Copy Current Project Path

Behavior:
- ⌘K opens palette
- Search is focused immediately
- Esc clears query or closes
- Return runs selected command
- Up/down arrows move selected result
- Empty state shows suggestions
- No-result state suggests searching projects, skills, prompts, files, or commands
- Destructive commands require confirmation

Design:
- Native macOS floating panel
- Centered near top third
- 640px wide by default
- Regular material background
- Rounded corners
- Subtle border
- No neon
- No heavy glow
- No oversized cards
- SF Symbols only
- Calm selected state

After implementation:
- List files changed
- Show command registry
- Explain shortcut behavior
- Explain search ranking
- Give manual test steps
```
