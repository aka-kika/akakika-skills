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

```swift
import SwiftUI

struct CommandItem: Identifiable, Hashable {
    let id: String
    let title: String
    let subtitle: String?
    let symbol: String
    let category: CommandCategory
    let keywords: [String]
    let shortcut: String?
    let isEnabled: Bool
    let action: CommandAction
}

enum CommandCategory: String, CaseIterable, Hashable {
    case suggestions = "Suggestions"
    case navigation = "Navigation"
    case creation = "Create"
    case agent = "Agent"
    case projects = "Projects"
    case skills = "Skills"
    case prompts = "Prompts"
    case files = "Files"
    case memory = "Memory"
    case reports = "Reports"
    case settings = "Settings"
}

enum CommandAction: Hashable {
    case openSection(SidebarDestination)
    case openProject(String)
    case openSkill(String)
    case openPrompt(String)
    case openFile(String)
    case createTask
    case createProject
    case createSkill
    case generateReport
    case toggleInspector
    case openSettings
    case custom(String)
}
```

## SwiftUI palette shell

```swift
import SwiftUI

struct CommandPalette: View {
    @Binding var isPresented: Bool
    let commands: [CommandItem]
    let perform: (CommandItem) -> Void

    @State private var query = ""
    @State private var selectedIndex = 0
    @FocusState private var isSearchFocused: Bool

    private var filteredCommands: [CommandItem] {
        CommandFilter.filter(commands, query: query)
    }

    var body: some View {
        VStack(spacing: 0) {
            searchHeader
            Divider()
            resultsList
        }
        .frame(width: 640, height: 520)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .stroke(.quaternary)
        }
        .shadow(radius: 24)
        .onAppear {
            isSearchFocused = true
        }
        .onExitCommand {
            handleEscape()
        }
    }

    private var searchHeader: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.secondary)

            TextField("Search commands, projects, skills…", text: $query)
                .textFieldStyle(.plain)
                .focused($isSearchFocused)
                .font(.title3)
                .onChange(of: query) { _, _ in
                    selectedIndex = 0
                }
        }
        .padding(16)
    }

    private var resultsList: some View {
        ScrollViewReader { proxy in
            List(Array(filteredCommands.enumerated()), id: \.element.id) { index, command in
                CommandRow(
                    command: command,
                    isSelected: index == selectedIndex
                )
                .contentShape(Rectangle())
                .onTapGesture {
                    performAndClose(command)
                }
            }
            .listStyle(.plain)
        }
    }

    private func performAndClose(_ command: CommandItem) {
        guard command.isEnabled else { return }
        perform(command)
        isPresented = false
    }

    private func handleEscape() {
        if query.isEmpty {
            isPresented = false
        } else {
            query = ""
        }
    }
}
```

## Command row

```swift
struct CommandRow: View {
    let command: CommandItem
    let isSelected: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: command.symbol)
                .frame(width: 22)
                .foregroundStyle(command.isEnabled ? .secondary : .tertiary)

            VStack(alignment: .leading, spacing: 2) {
                Text(command.title)
                    .font(.callout)
                    .foregroundStyle(command.isEnabled ? .primary : .secondary)

                if let subtitle = command.subtitle {
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }

            Spacer()

            if let shortcut = command.shortcut {
                Text(shortcut)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(.quaternary, in: RoundedRectangle(cornerRadius: 5))
            } else {
                Text(command.category.rawValue)
                    .font(.caption)
                    .foregroundStyle(.tertiary)
            }
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 8)
        .background(isSelected ? .quaternary : .clear, in: RoundedRectangle(cornerRadius: 8))
        .opacity(command.isEnabled ? 1 : 0.55)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(accessibilityText)
    }

    private var accessibilityText: String {
        if let subtitle = command.subtitle {
            return "\(command.title), \(subtitle), \(command.category.rawValue)"
        }
        return "\(command.title), \(command.category.rawValue)"
    }
}
```

## Filtering logic

```swift
enum CommandFilter {
    static func filter(_ commands: [CommandItem], query: String) -> [CommandItem] {
        let normalizedQuery = normalize(query)

        guard !normalizedQuery.isEmpty else {
            return commands.sorted { lhs, rhs in
                score(lhs, query: "") > score(rhs, query: "")
            }
        }

        return commands
            .map { command in
                (command, score(command, query: normalizedQuery))
            }
            .filter { $0.1 > 0 }
            .sorted { $0.1 > $1.1 }
            .map { $0.0 }
    }

    private static func score(_ command: CommandItem, query: String) -> Int {
        guard !query.isEmpty else {
            return command.category == .suggestions ? 100 : 10
        }

        let title = normalize(command.title)
        let subtitle = normalize(command.subtitle ?? "")
        let keywords = command.keywords.map(normalize)

        var result = 0

        if title == query { result += 100 }
        if title.hasPrefix(query) { result += 80 }
        if title.contains(query) { result += 60 }
        if subtitle.contains(query) { result += 30 }
        if keywords.contains(query) { result += 50 }
        if keywords.contains(where: { $0.contains(query) }) { result += 25 }
        if command.category == .suggestions { result += 10 }
        if !command.isEnabled { result -= 30 }

        return result
    }

    private static func normalize(_ value: String) -> String {
        value
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .lowercased()
    }
}
```

## Example command registry for an agent/task app

```swift
struct CommandRegistry {
    static func commands(context: AppContext) -> [CommandItem] {
        [
            CommandItem(
                id: "new-task",
                title: "New Task",
                subtitle: "Create a new agent task",
                symbol: "plus",
                category: .creation,
                keywords: ["task", "todo", "create"],
                shortcut: "⌘N",
                isEnabled: true,
                action: .createTask
            ),
            CommandItem(
                id: "open-active-runs",
                title: "Open Active Runs",
                subtitle: "View current agent activity",
                symbol: "bolt.circle",
                category: .navigation,
                keywords: ["runs", "codex", "active", "working"],
                shortcut: "⌘2",
                isEnabled: true,
                action: .openSection(.activeRuns)
            ),
            CommandItem(
                id: "new-skill",
                title: "New Skill",
                subtitle: "Create a reusable agent skill",
                symbol: "sparkles",
                category: .skills,
                keywords: ["skill", "agent"],
                shortcut: nil,
                isEnabled: true,
                action: .createSkill
            ),
            CommandItem(
                id: "toggle-inspector",
                title: "Toggle Inspector",
                subtitle: "Show or hide selected item details",
                symbol: "sidebar.right",
                category: .navigation,
                keywords: ["details", "panel", "inspector"],
                shortcut: "⌘I",
                isEnabled: true,
                action: .toggleInspector
            ),
            CommandItem(
                id: "settings",
                title: "Settings",
                subtitle: "Open app preferences",
                symbol: "gearshape",
                category: .settings,
                keywords: ["preferences", "config", "options"],
                shortcut: "⌘,",
                isEnabled: true,
                action: .openSettings
            )
        ]
    }
}
```

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

Use sidebar for stable places:

```
Home
Projects
Skills
Files
Notes
Reports
Settings
```

Use command palette for fast jumps and actions:

```
Open Project: Acme
Run Skill: apple-hig-sidebars
Create New Prompt
Generate Daily Report
Toggle Inspector
```

## Command palette vs toolbar

Use toolbar for visible current-screen actions:

```
New Project
Search
Sort
Filter
Export
Inspector
```

Use command palette for actions across the app:

```
Jump to any section
Run any skill
Open any file
Search all memory
Execute saved automation
```

## Command palette vs Spotlight

A command palette should feel Spotlight-like:

```
Fast
Centered
Keyboard-first
Search-focused
Predictable
Minimal
```

But it should be app-specific, not system-wide.

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
❌ Command palette becomes the only navigation
❌ Too many low-value commands
❌ No keyboard navigation
❌ Search field not focused on open
❌ No ranking logic
❌ No empty state suggestions
❌ Destructive actions execute instantly
❌ Icons are random decoration
❌ Result rows are too large
❌ Palette looks like a web modal, not a native panel
❌ No accessibility labels
❌ Shortcuts shown but not implemented
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

## Quality bar

```
The user presses ⌘K and immediately feels faster.
They can jump, create, run, and search without thinking about where things are.
The palette feels native, calm, and powerful without replacing the app structure.
```
