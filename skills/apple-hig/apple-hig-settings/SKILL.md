---
name: apple-hig-settings
description: Use when designing, reviewing, or implementing Settings/Preferences for Apple-platform apps — what belongs in Settings vs Inspector/Toolbar, grouped forms, native controls, secure storage, launch at login, and destructive actions.
---

# Apple HIG Settings

Use this skill when designing, reviewing, or implementing Settings/Preferences for Apple-platform apps. It covers macOS `Settings`, iOS Settings screens, app preferences, model configuration, shortcuts, launch at login, folders, privacy, accounts, appearance, and advanced options.

## Core rule

```
Settings are for persistent preferences, not one-time actions or navigation.
```

## When to use this skill

Use for:

- Default model
- API keys
- Ollama URL
- Project folder
- Launch at Login
- Theme / appearance
- Keyboard shortcuts
- Notification preferences
- Privacy and local-only controls
- Data retention
- Export/import settings
- Advanced debug settings

## When not to use this skill

Do not put these in Settings:

- Current selected item metadata; use Inspector
- Main app navigation; use Sidebar
- Current-screen actions; use Toolbar
- One-time commands; use Command Palette or menu
- Full dashboards

## Recommended settings sections

```
General
Models
Projects
Keyboard
Notifications
Privacy
Appearance
Advanced
About
```

For an agent-driven app:

```
General
- Launch at Login
- Show Dock icon
- Start hidden

Models
- Provider: Ollama / OpenAI / Other
- Ollama Base URL
- Default model
- Test connection

Projects
- Default projects folder
- Open folder after create
- Include skills by default

Keyboard
- Command Palette shortcut
- Quick Capture shortcut
- Toggle Inspector shortcut

Notifications
- Notify when the agent finishes
- Notify on failure
- Quiet hours

Privacy
- Local-only mode
- Allowed folders
- Clear local history

Appearance
- System / Light / Dark
- Compact mode
- Show advanced metadata

Advanced
- Debug logs
- Reset app state
- Export diagnostics
```

## SwiftUI macOS Settings scene

```swift
@main
struct MyApp: App {
    var body: some Scene {
        MenuBarExtra("My App", systemImage: "sparkles") {
            AppMenuView()
        }

        Settings {
            SettingsView()
        }
    }
}
```

## Settings view template

```swift
import SwiftUI

struct SettingsView: View {
    @AppStorage("launchAtLogin") private var launchAtLogin = false
    @AppStorage("defaultModel") private var defaultModel = "llama3.1:8b"
    @AppStorage("ollamaBaseURL") private var ollamaBaseURL = "http://127.0.0.1:11434"
    @AppStorage("appearance") private var appearance = "system"

    var body: some View {
        TabView {
            GeneralSettingsView(launchAtLogin: $launchAtLogin)
                .tabItem { Label("General", systemImage: "gearshape") }

            ModelSettingsView(defaultModel: $defaultModel, ollamaBaseURL: $ollamaBaseURL)
                .tabItem { Label("Models", systemImage: "brain") }

            AppearanceSettingsView(appearance: $appearance)
                .tabItem { Label("Appearance", systemImage: "paintbrush") }
        }
        .frame(width: 560, height: 420)
    }
}
```

## Form section pattern

```swift
struct ModelSettingsView: View {
    @Binding var defaultModel: String
    @Binding var ollamaBaseURL: String

    var body: some View {
        Form {
            Section("Provider") {
                TextField("Ollama URL", text: $ollamaBaseURL)
                TextField("Default Model", text: $defaultModel)
                Button("Test Connection") {
                    testConnection()
                }
            }

            Section("Behavior") {
                Toggle("Prefer local models", isOn: .constant(true))
                Toggle("Fallback to cloud model", isOn: .constant(false))
            }
        }
        .formStyle(.grouped)
        .padding()
    }

    private func testConnection() {}
}
```

## Storage rules

Use `@AppStorage` for simple preferences:

```
Booleans
Strings
Small enum-like values
Numbers
```

Use a settings service or model for:

```
API keys
Folder bookmarks
Secure tokens
Complex JSON
Per-project preferences
```

Use Keychain for secrets.

Do not store API keys in plain `UserDefaults`.

## Launch at Login

Use `SMAppService` where appropriate.

```swift
import ServiceManagement

func setLaunchAtLogin(_ enabled: Bool) {
    do {
        if enabled {
            try SMAppService.mainApp.register()
        } else {
            try SMAppService.mainApp.unregister()
        }
    } catch {
        print("Failed to update launch at login: \(error)")
    }
}
```

## Folder permissions

For folder settings:

- Use a picker.
- Store security-scoped bookmarks if needed.
- Show current path.
- Add Reveal in Finder.
- Add Reset to Default.

## Destructive settings

Dangerous settings must be separated and confirmed:

```
Clear Local History…
Reset All Settings…
Delete All Cached Runs…
```

Use ellipsis for actions needing confirmation.

## Design rules

- Use grouped forms.
- Keep each section focused.
- Put advanced/debug settings last.
- Avoid long paragraphs.
- Use footer/help text sparingly.
- Do not use huge cards.
- Do not make settings look like a dashboard.
- Use native controls: Toggle, Picker, TextField, Button.

## Review checklist

```
[ ] Settings are persistent preferences
[ ] Settings are grouped clearly
[ ] App-wide settings are not in Inspector
[ ] Current-screen actions are not in Settings
[ ] Secrets are stored securely
[ ] Folder permissions are handled safely
[ ] Destructive options require confirmation
[ ] Launch at Login handles errors
[ ] Settings window has appropriate size
[ ] Labels are clear and literal
```

## Common mistakes

```
Using Settings for navigation
Putting selected item details in Settings
Storing API keys in UserDefaults
No confirmation for reset/delete actions
Too many advanced options visible by default
Long explanations everywhere
Custom controls where native controls work
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-settings skill to create or improve app settings.

Rules:
- Settings are for persistent app preferences.
- Use Settings scene on macOS.
- Use grouped Form sections.
- Use native controls.
- Store simple preferences in AppStorage.
- Store secrets in Keychain, not UserDefaults.
- Keep selected-item details in Inspector, not Settings.
- Keep current-screen actions in Toolbar, not Settings.
- Put advanced and destructive actions last.
- Require confirmation for destructive actions.

After coding:
1. List settings added.
2. Explain storage choices.
3. Explain security for secrets.
4. Explain destructive safeguards.
5. Give manual test steps.
```
