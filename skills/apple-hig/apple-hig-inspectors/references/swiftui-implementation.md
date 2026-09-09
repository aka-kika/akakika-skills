# SwiftUI implementation

Moved out of SKILL.md on 2026-09-09 to keep the body under 500 lines. Read this whole file when the pointer in SKILL.md sends you here.

## Contents

- SwiftUI implementation pattern
- Inspector section component
- Project inspector example
- Run inspector example
- Skill inspector example

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
