---
name: apple-hig-empty-states
description: Use when designing or implementing empty, first-run, no-result, offline, error, or waiting states in Apple-platform apps — every empty state explains what is missing, why it matters, and what to do next.
---

# Apple HIG Empty States

Turn blank screens into useful empty, first-run, no-result, offline, and error states that explain what is missing and what to do next. Reach for it whenever a view has no data, no selection, no results, no connection, or a failed load.

## Purpose

Use this skill when designing or implementing empty, first-run, no-result, offline, error, or waiting states in Apple-platform apps.

Use for:

- No projects
- No tasks
- No active runs
- No skills
- No notes
- No reports
- No selected item
- No search results
- First launch
- Offline/local model not running
- Permission missing
- Failed load

## Core rule

```
An empty state must explain what is missing, why it matters, and what to do next.
```

A blank screen is not an empty state.

## Empty state formula

```
Icon
Title
Short explanation
Primary action
Optional secondary action
```

Example:

```
No Active Runs
The agent is not working on anything right now.
Start a task or open the queue.
[New Task] [Open Queue]
```

## When to use this skill

Use this skill when a view has no data, no selection, no permissions, no connection, no results, or the user is seeing the app for the first time.

## When not to use this skill

Do not use this skill to hide real errors. If something failed, show an error state with recovery.

## Types of empty states

### 1. First-run empty state

For new users.

```
Welcome to your app
Create your first project, connect an agent, or add a skill to begin.
[Create Project] [Add Skill]
```

### 2. No-content state

For normal empty data.

```
No Projects
Create a project to organize tasks, prompts, and skills.
[New Project]
```

### 3. No-selection state

For inspector/detail areas.

```
No Item Selected
Select a task, project, run, or skill to inspect its details.
```

### 4. No-search-results state

For failed search.

```
No Results
Try a project, skill, prompt, file, or command name.
[Clear Search]
```

### 5. Offline / unavailable state

For local models or services.

```
Ollama Not Running
Start Ollama to use local models in this app.
[Retry] [Open Settings]
```

### 6. Error state

For real failure.

```
Could Not Load Reports
The reports folder could not be read.
[Retry] [Choose Folder]
```

## SwiftUI default

Use `ContentUnavailableView` when possible.

```swift
ContentUnavailableView(
    "No Projects",
    systemImage: "folder",
    description: Text("Create a project to organize your work.")
)
```

With actions:

```swift
ContentUnavailableView {
    Label("No Active Runs", systemImage: "bolt.circle")
} description: {
    Text("The agent is not working on anything right now.")
} actions: {
    Button("New Task") {
        createTask()
    }
    Button("Open Queue") {
        openQueue()
    }
}
```

## Example empty states

```
No Active Runs
The agent is not working on anything right now.
Start a task, open the queue, or run a saved skill.
[New Task] [Open Queue]

No Skills
Skills are reusable instructions the agent can apply while coding.
Create your first skill or import a skill folder.
[New Skill] [Import]

No Reports
Daily reports will appear here after your first generated summary.
Generate one from today’s activity.
[Generate Report]

No Search Results
Nothing matched your search.
Try a project, skill, prompt, file, or command name.
[Clear Search]

Ollama Not Running
Local models are unavailable until Ollama starts.
Start Ollama, then retry.
[Retry] [Open Settings]
```

## Design rules

- Keep the message short.
- Use one calm SF Symbol.
- Use one primary action.
- Add one secondary action only if useful.
- Avoid cute/clever copy.
- Avoid blaming the user.
- Do not show a huge empty illustration in small popovers.
- Use secondary text for explanation.
- Use clear recovery actions for errors.

## Good SF Symbols

```
No projects: folder
No tasks: checkmark.circle
No active runs: bolt.circle
No skills: sparkles
No prompts: text.badge.star
No files: doc
No notes: note.text
No reports: chart.bar.doc.horizontal
No selection: sidebar.right
No search results: magnifyingglass
Offline: wifi.slash
Error: exclamationmark.triangle
```

## Review checklist

```
[ ] Empty state explains what is missing
[ ] Empty state explains what to do next
[ ] Primary action is clear
[ ] Copy is short and calm
[ ] Symbol matches the state
[ ] No-result state supports clearing search
[ ] Error state has retry or recovery
[ ] Offline state explains service dependency
[ ] Empty state is not too large for popover
[ ] VoiceOver labels are clear
```

## Common mistakes

```
Blank screen
“Nothing here” with no next action
Too many buttons
Cute but unclear copy
Error hidden as empty state
Huge illustration in a tiny menu bar panel
No retry for failed load
No clear search reset
```

## Prompt template

```
Use the apple-hig-empty-states skill to add polished empty states.

Rules:
- Every no-data, no-selection, no-search-result, offline, and error state needs clear UI.
- Use ContentUnavailableView where possible.
- Include a short title, explanation, and primary action.
- Use one meaningful SF Symbol.
- Keep copy calm and direct.
- Add retry or recovery for error states.
- Add Clear Search for no-result states.
- Do not hide real errors as generic emptiness.

After coding:
1. List empty states added.
2. List actions added.
3. Explain error/offline recovery.
4. Give manual test steps.
```
