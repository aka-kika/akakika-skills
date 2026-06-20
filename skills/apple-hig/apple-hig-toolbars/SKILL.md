---
name: apple-hig-toolbars
description: Use when designing, reviewing, or implementing Apple-platform toolbars — current-screen actions vs sidebar navigation, one primary action per screen, overflow menus, protected destructive actions, and keyboard shortcuts.
---

# Apple HIG Toolbars

Use this skill when designing, reviewing, or implementing Apple-platform toolbars. It covers macOS window toolbars, SwiftUI `.toolbar`, iPadOS toolbars, iOS navigation bar actions, current-screen actions, search, filters, sort controls, export/share actions, inspector toggles, and command palette buttons.

## Core rule

```
Sidebar = navigation
Toolbar = actions for the current screen
Command palette = fast access to many commands
Context menu = secondary item-specific actions
```

A good toolbar answers:

```
What can I do on this screen right now?
```

## Apple-style principles

### 1. Toolbars serve the current view

Toolbar actions should change based on the selected screen.

Examples:

```
Projects screen:
- New Project
- Search
- Sort
- Filter

Active Runs screen:
- Stop
- Retry
- Clear Finished
- Search

Skills screen:
- New Skill
- Import
- Validate
- Search
```

Bad pattern:

```
Every screen always shows every action.
```

### 2. Use familiar placement

```
Leading:
- Sidebar toggle
- Back navigation

Center:
- Title
- Search
- Segmented controls
- View switchers

Trailing:
- Primary action
- Add button
- Share/export
- Inspector toggle
- More menu
```

### 3. One primary action per screen

Every screen should have one obvious main action.

Examples:

```
Projects → New Project
Skills → New Skill
Prompts → New Prompt
Reports → Export
Active Runs → Clear Finished or Stop All
```

If there are three primary buttons, none are primary.

### 4. Use menus for overflow

Put less frequent actions into a More menu.

```swift
Menu {
    Button("Sort") {}
    Button("Filter") {}
    Divider()
    Button("Export") {}
} label: {
    Label("More", systemImage: "ellipsis.circle")
}
```

### 5. Protect destructive actions

Do not place destructive actions as prominent toolbar buttons unless they are core to the screen and safely reversible.

Better:

```
More menu → Delete Finished Runs… → confirmation dialog → undo support
```

## Recommended toolbar map for an agent-driven app

```
Home:
- Primary: New Task
- Secondary: Search, Command Palette

Active Runs:
- Primary: Clear Finished or Stop All
- Secondary: Search, Filter, Inspector

Queue:
- Primary: Add Task
- Secondary: Reorder, Clear, Filter

Projects:
- Primary: New Project
- Secondary: Import, Sort, Search

Skills:
- Primary: New Skill
- Secondary: Import Skill, Validate, Search

Prompts:
- Primary: New Prompt
- Secondary: Duplicate, Export, Search

Files:
- Primary: Add Folder or Import
- Secondary: Reveal in Finder, Search, Sort

Notes:
- Primary: New Note
- Secondary: Search, Filter

Decisions:
- Primary: New Decision
- Secondary: Export, Search

Reports:
- Primary: Export
- Secondary: Date Picker, Search, Generate Report

Settings:
- Minimal or no toolbar actions
```

## SwiftUI pattern

```swift
import SwiftUI

struct DetailScreen: View {
    let section: AppSection
    @State private var searchText = ""
    @State private var showsInspector = false

    var body: some View {
        content
            .navigationTitle(section.title)
            .searchable(text: $searchText, placement: .toolbar)
            .toolbar {
                ToolbarItem(placement: .navigation) {
                    Button {
                        toggleSidebar()
                    } label: {
                        Label("Toggle Sidebar", systemImage: "sidebar.left")
                    }
                }

                ToolbarItem(placement: .principal) {
                    Text(section.title)
                        .font(.headline)
                }

                ToolbarItemGroup(placement: .primaryAction) {
                    primaryActionButton

                    Button {
                        showsInspector.toggle()
                    } label: {
                        Label("Inspector", systemImage: "sidebar.right")
                    }
                    .keyboardShortcut("i", modifiers: [.command])

                    moreMenu
                }
            }
    }

    @ViewBuilder
    private var content: some View {
        Text(section.title)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    @ViewBuilder
    private var primaryActionButton: some View {
        switch section {
        case .home:
            Button { createTask() } label: { Label("New Task", systemImage: "plus") }
        case .projects:
            Button { createProject() } label: { Label("New Project", systemImage: "folder.badge.plus") }
        case .skills:
            Button { createSkill() } label: { Label("New Skill", systemImage: "sparkles") }
        case .prompts:
            Button { createPrompt() } label: { Label("New Prompt", systemImage: "text.badge.plus") }
        case .reports:
            Button { exportReport() } label: { Label("Export", systemImage: "square.and.arrow.up") }
        default:
            EmptyView()
        }
    }

    private var moreMenu: some View {
        Menu {
            Button("Sort") {}
            Button("Filter") {}
            Divider()
            Button("Open Command Palette") {}
        } label: {
            Label("More", systemImage: "ellipsis.circle")
        }
    }

    private func toggleSidebar() {}
    private func createTask() {}
    private func createProject() {}
    private func createSkill() {}
    private func createPrompt() {}
    private func exportReport() {}
}
```

## Keyboard shortcuts

```
⌘N       New item for current screen
⌘F       Search
⌘K       Command palette
⌘,       Settings
⌘R       Refresh / rerun where appropriate
⌘I       Toggle inspector
⌘1-⌘9    Jump to main sections
```

## Review checklist

```
[ ] Every toolbar item applies to the current screen
[ ] Sidebar navigation is not duplicated
[ ] There is one obvious primary action
[ ] Secondary actions are in a More menu
[ ] Item-specific actions are in context menus
[ ] Destructive actions are protected
[ ] Search appears only where useful
[ ] SF Symbols are consistent
[ ] Labels are short
[ ] Keyboard shortcuts exist for common actions
[ ] VoiceOver labels are clear
[ ] Compact width is safe
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-toolbars skill to redesign this app toolbar system.

Rules:
- Toolbar is for current-screen actions.
- Sidebar is for navigation.
- Do not duplicate sidebar items in the toolbar.
- Use SwiftUI .toolbar.
- Use ToolbarItem and ToolbarItemGroup.
- Use SF Symbols with semantic Label text.
- Keep one obvious primary action per screen.
- Move secondary actions into a More menu.
- Move item-specific actions into context menus.
- Protect destructive actions with confirmation.
- Add .searchable only where useful.
- Add keyboard shortcuts for common actions.
- Keep compact-width behavior safe.

After coding:
- List files changed.
- Explain toolbar structure per screen.
- List primary actions.
- List actions moved into More/context menus.
- Give manual test steps.
```

## Quality bar

```
The toolbar feels native, calm, contextual, and useful.
It helps the current screen without becoming navigation or a dashboard.
```
