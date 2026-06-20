---
name: apple-hig-inspectors
description: Use when designing, reviewing, or implementing an Inspector panel for an Apple-platform app — contextual selected-item details and safe editable properties, grouped sections, ⌘I toggle, and a compact-width fallback.
---

# Apple HIG Inspectors

Design and review an inspector that shows contextual details and safe properties for the selected item — secondary to the main content, never primary navigation. Reach for this on macOS, iPadOS, SwiftUI `.inspector`, side detail panels, selected-item metadata, properties panels, AI run details, task details, file details, skill configuration, and project settings.

## Core rule

```
Sidebar = where you go
Toolbar = what you do now
Inspector = details about what is selected
Command palette = fast global control
```

An inspector is not another sidebar. It should not contain primary navigation.

An inspector answers:

```
What is selected?
What details matter?
What can I adjust safely?
What metadata helps me understand this item?
```

## When to use an inspector

Use an inspector when the user selects an item and needs supporting information or editable properties without leaving the main screen.

Good inspector use cases:

- Task details
- Project metadata
- Agent run status
- Agent configuration
- Skill settings
- Prompt metadata
- File info
- Note properties
- Decision context
- Report export settings

Avoid inspectors for:

- App-wide navigation
- Main content
- Full dashboards
- Long forms
- Onboarding
- Primary destructive actions
- Complex workflows that deserve their own screen

## Apple-style principles

### 1. Inspectors are contextual

The inspector should change based on the selected item.

Examples:

```
Selected project → project info, status, owner, files, linked skills
Selected run → model, status, logs summary, duration, outputs
Selected skill → path, category, enabled state, validation status
Selected note → tags, created date, related project, source
```

If nothing is selected, show a calm empty state.

```
No Item Selected
Select a task, project, run, or skill to inspect its details.
```

### 2. Inspectors are secondary

The inspector should never overpower the main content.

Rules:

- Keep it narrower than main content.
- Use grouped sections.
- Keep labels short.
- Show only relevant fields.
- Avoid big hero cards.
- Avoid repeating the main screen.
- Avoid dashboard-style metrics unless directly related to the selected item.

### 3. Use progressive disclosure

Not every property needs to be visible at once.

Use sections like:

```
Summary
Status
Configuration
Metadata
Related
Advanced
```

Put advanced or dangerous options lower down.

### 4. Make fields editable only when safe

Some inspector fields can be editable. Others should be read-only.

Editable examples:

- Name
- Status
- Tags
- Priority
- Notes
- Model selection
- Enabled toggle
- Shortcut assignment

Read-only examples:

- Created date
- Last run date
- File path
- Internal ID
- Token usage
- Duration
- Source URL

Destructive actions should be behind menus or confirmation dialogs.

## Recommended inspector layout

```
┌────────────────────────────┐
│ Inspector                  │
├────────────────────────────┤
│ Summary                    │
│ Name                       │
│ Type                       │
│ Status                     │
├────────────────────────────┤
│ Details                    │
│ Owner                      │
│ Tags                       │
│ Related project            │
├────────────────────────────┤
│ Activity                   │
│ Created                    │
│ Updated                    │
│ Last run                   │
├────────────────────────────┤
│ Advanced                   │
│ Path                       │
│ ID                         │
└────────────────────────────┘
```

## Recommended width

```
macOS: 280–360 px
iPad: 300–380 px
Compact iPhone: push to detail screen or sheet, not permanent side panel
```

## Agent task hub inspector map

```
Home selected summary:
- Today focus
- Open tasks count
- Current active run
- Suggested next action

Active Run selected:
- Status
- Model
- Started time
- Duration
- Current step
- Last message
- Output path
- Stop / retry actions in toolbar or menu, not as big inspector buttons

Project selected:
- Status
- Folder path
- Related skills
- Active tasks
- Last opened
- Git branch
- Notes

Skill selected:
- Skill name
- Category
- Path
- Enabled state
- Last validated
- Related prompts
- Manual test checklist

Prompt selected:
- Purpose
- Model target
- Variables
- Last used
- Version
- Related skill

File selected:
- File type
- Path
- Modified date
- Size
- Related project
- Open in Finder

Note selected:
- Tags
- Related project
- Created date
- Source
- Linked decisions

Report selected:
- Date
- Source apps
- Export status
- Related tasks
- AI summary status
```

## SwiftUI implementation pattern

```swift
import SwiftUI

enum InspectableItem: Identifiable, Hashable {
    case project(Project)
    case run(AgentRun)
    case skill(Skill)
    case prompt(PromptItem)
    case file(ProjectFile)
    case note(NoteItem)
    case report(ReportItem)

    var id: String {
        switch self {
        case .project(let item): "project-\(item.id)"
        case .run(let item): "run-\(item.id)"
        case .skill(let item): "skill-\(item.id)"
        case .prompt(let item): "prompt-\(item.id)"
        case .file(let item): "file-\(item.id)"
        case .note(let item): "note-\(item.id)"
        case .report(let item): "report-\(item.id)"
        }
    }
}

struct MainScreen: View {
    @State private var selectedItem: InspectableItem?
    @State private var showsInspector = true

    var body: some View {
        content
            .inspector(isPresented: $showsInspector) {
                InspectorPanel(item: selectedItem)
                    .inspectorColumnWidth(min: 280, ideal: 320, max: 380)
            }
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showsInspector.toggle()
                    } label: {
                        Label("Inspector", systemImage: "sidebar.right")
                    }
                    .keyboardShortcut("i", modifiers: [.command])
                }
            }
    }

    private var content: some View {
        Text("Main Content")
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct InspectorPanel: View {
    let item: InspectableItem?

    var body: some View {
        Group {
            switch item {
            case .project(let project):
                ProjectInspector(project: project)
            case .run(let run):
                RunInspector(run: run)
            case .skill(let skill):
                SkillInspector(skill: skill)
            case .prompt(let prompt):
                PromptInspector(prompt: prompt)
            case .file(let file):
                FileInspector(file: file)
            case .note(let note):
                NoteInspector(note: note)
            case .report(let report):
                ReportInspector(report: report)
            case nil:
                EmptyInspectorView()
            }
        }
        .navigationTitle("Inspector")
    }
}

struct EmptyInspectorView: View {
    var body: some View {
        ContentUnavailableView(
            "No Item Selected",
            systemImage: "sidebar.right",
            description: Text("Select an item to inspect its details.")
        )
        .padding()
    }
}
```

## Inspector section component

Use reusable sections to keep the inspector consistent.

```swift
struct InspectorSection<Content: View>: View {
    let title: String
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
                .textCase(.uppercase)

            VStack(alignment: .leading, spacing: 8) {
                content
            }
        }
        .padding(.vertical, 8)
    }
}

struct InspectorRow: View {
    let title: String
    let value: String
    let symbol: String?

    init(_ title: String, value: String, symbol: String? = nil) {
        self.title = title
        self.value = value
        self.symbol = symbol
    }

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 8) {
            if let symbol {
                Image(systemName: symbol)
                    .foregroundStyle(.secondary)
                    .frame(width: 16)
            }

            Text(title)
                .foregroundStyle(.secondary)

            Spacer(minLength: 12)

            Text(value)
                .multilineTextAlignment(.trailing)
        }
        .font(.callout)
    }
}
```

## Project inspector example

```swift
struct ProjectInspector: View {
    let project: Project

    var body: some View {
        Form {
            InspectorSection(title: "Summary") {
                InspectorRow("Status", value: project.status, symbol: "circle.fill")
                InspectorRow("Tasks", value: "\(project.taskCount)", symbol: "checkmark.circle")
                InspectorRow("Updated", value: project.updatedDisplay, symbol: "clock")
            }

            InspectorSection(title: "Location") {
                InspectorRow("Path", value: project.path, symbol: "folder")
                InspectorRow("Branch", value: project.gitBranch, symbol: "point.3.connected.trianglepath.dotted")
            }

            InspectorSection(title: "Related") {
                InspectorRow("Skills", value: "\(project.skillCount)", symbol: "sparkles")
                InspectorRow("Prompts", value: "\(project.promptCount)", symbol: "text.badge.star")
            }
        }
        .formStyle(.grouped)
    }
}
```

## Run inspector example

```swift
struct RunInspector: View {
    let run: AgentRun

    var body: some View {
        Form {
            InspectorSection(title: "Status") {
                InspectorRow("State", value: run.state, symbol: "bolt.circle")
                InspectorRow("Model", value: run.model, symbol: "brain")
                InspectorRow("Duration", value: run.duration, symbol: "timer")
            }

            InspectorSection(title: "Current Step") {
                Text(run.currentStep)
                    .font(.callout)
                    .foregroundStyle(.primary)
            }

            InspectorSection(title: "Output") {
                InspectorRow("Path", value: run.outputPath, symbol: "doc")
                InspectorRow("Tokens", value: run.tokenDisplay, symbol: "number")
            }
        }
        .formStyle(.grouped)
    }
}
```

## Skill inspector example

```swift
struct SkillInspector: View {
    let skill: Skill

    var body: some View {
        Form {
            InspectorSection(title: "Skill") {
                InspectorRow("Name", value: skill.name, symbol: "sparkles")
                InspectorRow("Category", value: skill.category, symbol: "folder")
                InspectorRow("Enabled", value: skill.isEnabled ? "Yes" : "No", symbol: "checkmark.circle")
            }

            InspectorSection(title: "Validation") {
                InspectorRow("Status", value: skill.validationStatus, symbol: "checkmark.seal")
                InspectorRow("Last Checked", value: skill.lastValidatedDisplay, symbol: "clock")
            }

            InspectorSection(title: "Path") {
                Text(skill.path)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .textSelection(.enabled)
            }
        }
        .formStyle(.grouped)
    }
}
```

## Inspector behavior rules

### Selection

Use one source of truth for selected item.

Good:

```swift
@State private var selectedItem: InspectableItem?
```

Bad:

```swift
@State private var selectedProject: Project?
@State private var selectedRun: Run?
@State private var selectedSkill: Skill?
```

### Toggle

The inspector should be toggleable from the toolbar.

Recommended shortcut:

```
⌘I = Toggle inspector
```

### Empty state

Always handle no selection.

```
No Item Selected
Select an item to inspect its details.
```

### Compact layout

On compact iPhone widths, do not force a permanent right-side inspector.

Use one of these:

```
Option A: Push inspector as a detail screen
Option B: Present inspector as a sheet
Option C: Show item details inline below main content
```

## What belongs in an inspector

Good:

```
Status
Metadata
Tags
Owner
Path
Created / updated dates
Related items
Configuration
Validation state
Small read-only summaries
Safe editable fields
```

Bad:

```
Main navigation
Primary create buttons
Huge charts
Full logs
Full editor content
Global app settings
Marketing copy
Large dashboards
Unconfirmed destructive actions
```

## Inspector vs settings

Use inspector for selected item properties.

Use settings for app-wide preferences.

```
Selected skill enabled state → Inspector
Default model for all skills → Settings
Selected project folder path → Inspector
Default project folder location → Settings
Selected run output path → Inspector
Global logs retention → Settings
```

## Inspector vs detail screen

Use detail screen when the item itself is the main work area.

Use inspector when details support the work area.

```
Writing the note → Detail screen
Note tags/source/date → Inspector

Editing a prompt → Detail screen
Prompt variables/version/related skill → Inspector

Viewing full logs → Detail screen or separate log view
Log summary/status/output path → Inspector
```

## Visual design rules

- Use grouped sections.
- Keep typography calm.
- Prefer `Form` or grouped VStack layouts.
- Avoid bright backgrounds.
- Avoid large cards.
- Use SF Symbols sparingly.
- Use secondary text for labels.
- Align values consistently.
- Make long paths selectable.
- Use disclosure groups for advanced fields.

## Accessibility rules

Inspector must support:

- VoiceOver labels
- Keyboard navigation
- Clear focus states
- Sufficient contrast
- Readable text sizes
- No color-only status
- Clear labels for editable controls
- Logical section order

Status should use text plus symbol:

```
Failed + exclamationmark.triangle
Running + bolt.circle
Completed + checkmark.circle
```

Never rely on color alone.

## Review checklist

```
[ ] Inspector shows details for the selected item only
[ ] Inspector is not used for navigation
[ ] Inspector is narrower than main content
[ ] Empty state exists for no selection
[ ] Sections are grouped clearly
[ ] Fields are relevant and not noisy
[ ] Editable fields are safe
[ ] Destructive actions are hidden behind confirmation
[ ] Advanced details are lower or collapsed
[ ] Full logs/editors are not crammed into the inspector
[ ] Inspector toggles from toolbar
[ ] ⌘I works where appropriate
[ ] Compact layout has sheet/push fallback
[ ] Status uses text plus symbol, not color alone
[ ] VoiceOver labels are clear
```

## Common mistakes

```
Inspector becomes a second sidebar
Inspector contains navigation
Inspector shows every database field
Inspector is wider than main content
Inspector duplicates the detail screen
Inspector contains full logs or full editors
Inspector has huge dashboard cards
Destructive actions are too visible
No empty state for nil selection
No compact fallback
```

## Implementation instructions

When a coding agent is asked to create or improve an inspector:

1. Inspect the app's selection model.
2. Identify item types that can be inspected.
3. Create a single `InspectableItem` enum or equivalent.
4. Add inspector visibility state.
5. Add a toolbar inspector toggle.
6. Add `⌘I` shortcut where appropriate.
7. Create an empty inspector state.
8. Create item-specific inspector views.
9. Group fields into calm sections.
10. Keep destructive actions behind confirmation.
11. Add accessibility labels.
12. Add compact layout fallback.

## Output requirements

After implementation, the agent should report:

```
1. Files changed
2. Inspector item types added
3. Inspector sections per item type
4. Toolbar toggle behavior
5. Keyboard shortcuts added
6. Compact layout behavior
7. Accessibility improvements
8. Manual test checklist
```

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

## Quality bar

```
The inspector makes the selected item easier to understand.
It gives useful context without stealing focus.
It feels like a native Apple productivity app.
```
