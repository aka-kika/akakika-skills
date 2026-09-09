# SwiftUI implementation

Moved out of SKILL.md on 2026-09-09 to keep the body under 500 lines. Read this whole file when the pointer in SKILL.md sends you here.

## Contents

- SwiftUI command model
- SwiftUI palette shell
- Command row
- Filtering logic
- Example command registry for an agent/task app

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
