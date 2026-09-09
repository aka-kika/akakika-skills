# Prompt templates

Moved out of SKILL.md on 2026-09-09 to keep the body under 500 lines. Read this whole file when the pointer in SKILL.md sends you here.

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-inspectors skill to add or improve the inspector system in this Apple-platform app.

Goal:
Create a native, calm, contextual inspector that shows useful details for the selected item without becoming navigation or main content.

Rules:
- Sidebar is for navigation.
- Toolbar is for current-screen actions.
- Inspector is for selected-item details and safe properties.
- Do not put navigation in the inspector.
- Do not put full dashboards in the inspector.
- Do not put full logs or full editors in the inspector.
- Use SwiftUI .inspector where supported.
- Use a single selected item model, preferably an InspectableItem enum.
- Add a toolbar toggle for the inspector.
- Add ⌘I as the inspector shortcut where appropriate.
- Add a calm empty state when nothing is selected.
- Group fields into Summary, Details, Activity, Related, and Advanced.
- Make long paths selectable.
- Use status text plus SF Symbol, not color alone.
- Move destructive actions into More menus with confirmation.
- Add compact-width fallback using a detail screen or sheet.
- Preserve accessibility.

Before coding:
1. Inspect current selection state.
2. Identify all inspectable item types.
3. Propose inspector sections for each item type.
4. Then implement.

After coding:
1. List files changed.
2. Explain inspector behavior.
3. Explain sections per item type.
4. Explain compact fallback.
5. Include manual test steps.
```

## Specialized prompt for an agent task hub

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-inspectors skill to create the inspector system for this macOS/iPadOS agent task hub.

Inspectable item types:
- Project
- Active Run
- Queue Task
- Skill
- Prompt
- File
- Note
- Decision
- Report

Behavior:
- Inspector opens on the right side.
- Toolbar has an Inspector toggle using sidebar.right.
- ⌘I toggles inspector visibility.
- Inspector content changes based on selected item.
- If nothing is selected, show a calm empty state.
- On compact width, present inspector as a sheet or push detail screen.

Design:
- Native Apple feel
- Quiet grouped sections
- No neon
- No dashboard cards
- No full logs
- No full editors
- No primary navigation
- Main content remains dominant

Section model:
- Summary
- Status
- Details
- Activity
- Related
- Advanced

After implementation:
- List files changed.
- Show inspectable item model.
- Explain inspector sections.
- Explain toolbar toggle and keyboard shortcut.
- Give manual testing steps.
```
