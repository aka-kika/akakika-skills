---
name: apple-app-intents
description: Use when exposing app features to App Intents, Shortcuts, Siri, Spotlight, widgets, controls, or system actions — small safe AppIntents, AppShortcutsProvider, AppEnum/AppEntity, parameters, and open-vs-background behavior.
---

# Apple App Intents

Expose your app's most useful actions to Shortcuts, Siri, Spotlight, widgets, and Control Center. Keep each intent a small, safe action, add an `AppShortcutsProvider` for discoverability, and push real work into services.

## When to use

Use this skill when exposing app features to App Intents, Shortcuts, Siri, Spotlight, widgets, controls, or system actions.

Use when the user asks for:

- App Intents
- Siri actions
- Shortcuts support
- Spotlight actions
- App Shortcuts
- Widget buttons
- Control Center controls
- Action Button support
- Apple Intelligence-compatible app actions

## Core rule

```
App Intent = a small, safe app action the system can run.
App Shortcut = a discoverable phrase and shortcut that exposes that action.
App Entity = app data the system can reference.
```

## When to use this skill

Use this skill for:

- Adding a command to Shortcuts
- Making a menu bar action available from Spotlight
- Creating app actions that run without opening the app
- Opening the app to a specific screen
- Running a task, prompt, skill, or automation from system surfaces
- Adding widget or Control Center interactions
- Defining typed parameters for user actions

## When not to use this skill

Do not use this skill for:

- Normal in-app buttons only
- Complex multi-screen workflows
- Unsafe destructive actions without confirmation
- UI design of sidebars/toolbars/inspectors
- Background daemons with no user-facing actions

## Minimal AppIntent

```swift
import AppIntents

struct StartFocusIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Focus"
    static var description = IntentDescription("Starts a focus session.")
    static var openAppWhenRun = false

    func perform() async throws -> some IntentResult {
        FocusService.shared.start()
        return .result(dialog: "Focus started")
    }
}
```

Requirements:

```
title
perform()
```

## App Shortcut provider

```swift
import AppIntents

struct AppShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: StartFocusIntent(),
            phrases: [
                "Start focus in \(.applicationName)",
                "Begin focus with \(.applicationName)"
            ],
            shortTitle: "Start Focus",
            systemImageName: "timer"
        )
    }
}
```

Rules:

- Every phrase should include `\(.applicationName)`.
- Keep phrases natural.
- Keep shortcuts few and high-value.
- Use clear SF Symbols.

## Return patterns

```swift
// Silent success
return .result()

// Success with dialog
return .result(dialog: "Done")

// Opens app when static openAppWhenRun = true
return .result()
```

Use dialogs for user reassurance:

```
Task created
Report generated
Skill started
Focus mode enabled
```

Avoid long generated responses inside intents.

## Parameters

```swift
struct CreateTaskIntent: AppIntent {
    static var title: LocalizedStringResource = "Create Task"

    @Parameter(title: "Title")
    var title: String

    @Parameter(title: "Priority")
    var priority: TaskPriority

    static var parameterSummary: some ParameterSummary {
        Summary("Create \(\.$title) with \(\.$priority) priority")
    }

    func perform() async throws -> some IntentResult {
        TaskStore.shared.create(title: title, priority: priority)
        return .result(dialog: "Task created")
    }
}
```

## AppEnum pattern

```swift
import AppIntents

enum TaskPriority: String, AppEnum {
    case low
    case normal
    case high

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Priority")

    static var caseDisplayRepresentations: [TaskPriority: DisplayRepresentation] = [
        .low: "Low",
        .normal: "Normal",
        .high: "High"
    ]
}
```

Use `AppEnum` for small controlled choices:

```
Priority
Mode
Report type
Model choice
Export format
Task status
```

## AppEntity pattern

Use `AppEntity` when the intent needs to reference app data.

```swift
import AppIntents

struct ProjectEntity: AppEntity {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Project")
    static var defaultQuery = ProjectQuery()

    let id: String
    let name: String

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)")
    }
}

struct ProjectQuery: EntityQuery {
    func entities(for identifiers: [String]) async throws -> [ProjectEntity] {
        ProjectStore.shared.projects
            .filter { identifiers.contains($0.id) }
            .map { ProjectEntity(id: $0.id, name: $0.name) }
    }

    func suggestedEntities() async throws -> [ProjectEntity] {
        ProjectStore.shared.recentProjects
            .map { ProjectEntity(id: $0.id, name: $0.name) }
    }
}
```

Use `AppEntity` for:

```
Projects
Tasks
Skills
Prompts
Reports
Files
Notes
Clients
Workspaces
```

## Open app or stay background

Stay background for quick actions:

```swift
static var openAppWhenRun = false
```

Open app for visual workflows:

```swift
static var openAppWhenRun = true
```

Use background for:

```
Create task
Start run
Toggle mode
Generate short report
Save note
```

Use open app for:

```
Open project
Review report
Edit prompt
Show run details
Configure skill
```

## Default intents for an agent app

Recommended starting intents:

```
Create Task
Start Agent Run
Open Active Runs
Run Skill
Validate Skill
Create Prompt
Generate Daily Report
Search Memory
Open Project
Toggle Focus Mode
```

## Menu bar app minimum

Every useful menu bar app should expose at least:

```
1. Open app / show main panel
2. Run primary action
3. Open settings or create common item if relevant
```

Example:

```swift
struct OpenCommandPaletteIntent: AppIntent {
    static var title: LocalizedStringResource = "Open Command Palette"
    static var openAppWhenRun = true

    func perform() async throws -> some IntentResult {
        AppRouter.shared.openCommandPalette()
        return .result()
    }
}
```

## Safety rules

Do not expose dangerous actions without friction.

Avoid direct intents like:

```
Delete All Projects
Clear All Memory
Remove All Files
Reset Workspace
```

If destructive action is needed:

```
- Use clear title
- Require confirmation in app where possible
- Prefer opening the app
- Return a dialog explaining what happened
- Support undo if possible
```

## File placement rules

```
App Intents should live in the app target or a target visible to the app.
Keep intent code small.
Call services for real work.
Do not put heavy business logic directly inside perform().
```

Recommended structure:

```
AppName/
  Intents/
    AppShortcuts.swift
    CreateTaskIntent.swift
    RunSkillIntent.swift
    Entities/
      ProjectEntity.swift
      SkillEntity.swift
      TaskEntity.swift
  Services/
    TaskService.swift
    SkillService.swift
    ReportService.swift
```

## Testing checklist

```
[ ] App builds with AppIntents imported
[ ] Shortcuts appear in Shortcuts app
[ ] Shortcuts appear in Spotlight where supported
[ ] Phrases include application name
[ ] Parameters display clearly
[ ] Entity suggestions work
[ ] Intent succeeds when app is closed where expected
[ ] Intent opens app where expected
[ ] Errors return useful dialog
[ ] Destructive actions are protected
[ ] Works after clean install
```

## Common mistakes

```
Too many shortcuts
Phrases without app name
Heavy logic inside perform()
Unsafe destructive actions
AppEntity without useful suggested entities
Intent opens app when it should be quick background action
Background intent tries to show UI
No error handling
No testing in Shortcuts app
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-app-intents skill to add App Intents support.

Goal:
Expose the app's most useful actions to Shortcuts, Siri, Spotlight, widgets, or controls.

Rules:
- Create small, safe AppIntent types.
- Add AppShortcutsProvider for discoverability.
- Every phrase should include \(.applicationName).
- Use AppEnum for small controlled choices.
- Use AppEntity for app data like projects, skills, tasks, prompts, notes, and reports.
- Keep perform() small and call services for real work.
- Use openAppWhenRun intentionally.
- Avoid unsafe destructive actions or require confirmation by opening the app.
- Add useful dialogs for success and failure.
- Compile and test in Shortcuts.

After coding:
1. List files changed.
2. List intents added.
3. List shortcuts added.
4. Explain parameters/entities.
5. Explain safety behavior.
6. Give manual testing steps.
```
