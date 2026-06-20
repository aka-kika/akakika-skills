---
name: apple-hig-sidebars
description: Use when designing, reviewing, or implementing a sidebar for an Apple-platform app — top-level navigation only, grouped sections, NavigationSplitView, consistent SF Symbols, and safe compact-width behavior.
---

# Apple HIG Sidebars

Design and review the sidebar as the map of the app: top-level navigation only, grouped into calm sections, paired with split navigation, and safe when it collapses on compact widths. Reach for this on macOS, iPadOS, SwiftUI `NavigationSplitView`, AppKit source lists, UIKit split views, and productivity apps with projects, files, agents, notes, skills, tasks, or dashboards.

## Core rule

```
Sidebar = top-level navigation
Toolbar = current-screen actions
Command palette = fast global commands
Inspector = selected-item details
```

A sidebar is the map of the app. It is not a dashboard and not a control panel.

## Apple-style principles

### 1. Use sidebars for top-level navigation

Good sidebar items:

- Home
- Inbox
- Projects
- Tasks
- Files
- Agents
- Skills
- Notes
- Reports
- Settings

Avoid putting these in the sidebar:

- One-off buttons
- Deep detail content
- Destructive actions
- Dashboard widgets
- Status timelines
- Large progress cards
- Long descriptions

### 2. Pair the sidebar with split navigation

Preferred SwiftUI structure:

```swift
NavigationSplitView {
    SidebarView(selection: $selection)
} content: {
    ContentListView(selection: $selection)
} detail: {
    DetailView(selection: selection)
}
```

Use two columns for:

```
Sidebar → Detail
```

Use three columns for:

```
Sidebar → List → Detail
```

Examples:

```
Projects → Tasks → Task Detail
Folders → Notes → Note Editor
Agents → Runs → Run Detail
```

### 3. Keep the sidebar calm

Rules:

- Short labels
- Familiar SF Symbols
- Clear selected state
- Grouped sections
- Generous spacing
- Minimal badges
- No neon
- No large cards
- No heavy gradients

## Recommended structure for an agent/task app

```
Command
  Home
  Active Runs
  Queue

Build
  Projects
  Skills
  Prompts
  Files

Memory
  Notes
  Decisions
  Reports

System
  Settings
```

## Width guidance

```
macOS: 220–280 px
iPad: 240–320 px
Compact iPhone: collapse into NavigationStack or tab-based root
```

## SwiftUI template

```swift
import SwiftUI

enum SidebarDestination: String, CaseIterable, Identifiable, Hashable {
    case home
    case activeRuns
    case queue
    case projects
    case skills
    case prompts
    case files
    case notes
    case decisions
    case reports
    case settings

    var id: String { rawValue }

    var title: String {
        switch self {
        case .home: "Home"
        case .activeRuns: "Active Runs"
        case .queue: "Queue"
        case .projects: "Projects"
        case .skills: "Skills"
        case .prompts: "Prompts"
        case .files: "Files"
        case .notes: "Notes"
        case .decisions: "Decisions"
        case .reports: "Reports"
        case .settings: "Settings"
        }
    }

    var symbol: String {
        switch self {
        case .home: "house"
        case .activeRuns: "bolt.circle"
        case .queue: "list.bullet.rectangle"
        case .projects: "folder"
        case .skills: "sparkles"
        case .prompts: "text.badge.star"
        case .files: "doc"
        case .notes: "note.text"
        case .decisions: "checkmark.seal"
        case .reports: "chart.bar.doc.horizontal"
        case .settings: "gearshape"
        }
    }
}

struct AppRootView: View {
    @State private var selection: SidebarDestination? = .home

    var body: some View {
        NavigationSplitView {
            SidebarView(selection: $selection)
                .navigationTitle("App")
        } detail: {
            DetailRouter(selection: selection)
        }
    }
}

struct SidebarView: View {
    @Binding var selection: SidebarDestination?

    var body: some View {
        List(selection: $selection) {
            Section("Command") {
                SidebarLink(.home)
                SidebarLink(.activeRuns, badge: "2")
                SidebarLink(.queue)
            }

            Section("Build") {
                SidebarLink(.projects)
                SidebarLink(.skills)
                SidebarLink(.prompts)
                SidebarLink(.files)
            }

            Section("Memory") {
                SidebarLink(.notes)
                SidebarLink(.decisions)
                SidebarLink(.reports)
            }

            Section("System") {
                SidebarLink(.settings)
            }
        }
        .listStyle(.sidebar)
        .frame(minWidth: 220, idealWidth: 240, maxWidth: 300)
    }

    @ViewBuilder
    private func SidebarLink(_ destination: SidebarDestination, badge: String? = nil) -> some View {
        NavigationLink(value: destination) {
            Label {
                HStack {
                    Text(destination.title)
                    Spacer()
                    if let badge {
                        Text(badge)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(.tertiary, in: Capsule())
                    }
                }
            } icon: {
                Image(systemName: destination.symbol)
            }
        }
        .accessibilityLabel(destination.title)
    }
}
```

## Review checklist

```
[ ] Sidebar shows top-level destinations only
[ ] Items are grouped clearly
[ ] Labels are short
[ ] SF Symbols are consistent
[ ] One selected item is clear
[ ] Sidebar is quieter than main content
[ ] App works when sidebar collapses
[ ] Compact layout works on iPhone/small windows
[ ] Keyboard navigation works
[ ] Badges are used sparingly
[ ] Actions live in toolbar/menus, not sidebar
[ ] Accessibility labels are clear
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-sidebars skill to redesign this app navigation.

Rules:
- Sidebar is for top-level navigation only.
- Use SwiftUI NavigationSplitView.
- Use List(selection:) and .listStyle(.sidebar).
- Use an enum for sidebar destinations.
- Use Label(title, systemImage:).
- Group items into clear sections.
- Keep labels short.
- Use one clear selected state.
- Move actions into toolbar or command palette.
- Make compact-width behavior safe.
- Add accessibility labels.

After coding:
- List files changed.
- Explain the new sidebar structure.
- Explain compact behavior.
- Give manual test steps.
```

## Quality bar

```
I always know where I am.
I can move quickly.
The app feels organized.
The content has room to breathe.
Nothing fights for attention.
```
