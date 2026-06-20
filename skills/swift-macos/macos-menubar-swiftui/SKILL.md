---
name: macos-menubar-swiftui
description: Use when building, refactoring, or debugging a macOS menu bar app with SwiftUI — MenuBarExtra vs NSStatusItem, .menu vs .window style, LSUIElement, launch at login, global shortcuts, and popover architecture.
---

# macOS Menubar SwiftUI

Build, refactor, or debug a macOS menu bar app with SwiftUI. Prefer `MenuBarExtra` for modern apps and drop to `NSStatusItem` + `NSPopover` only when the SwiftUI API cannot meet a requirement.

## When to use

Use this skill when building, refactoring, or debugging a macOS menu bar app with SwiftUI.

Use when the user says:

- menu bar app
- status bar app
- tray app
- background macOS utility
- app that lives in the menu bar
- `MenuBarExtra`
- `NSStatusItem`
- `NSPopover`
- `LSUIElement`
- launch at login
- hide Dock icon
- global shortcut

## Core rule

```
Use MenuBarExtra for modern SwiftUI menu bar apps.
Use NSStatusItem + NSPopover only when MenuBarExtra is not enough.
```

## When to use this skill

Use this skill for:

- Creating a new macOS menu bar app
- Modernizing an existing status bar utility
- Choosing between `.menu` and `.window` style
- Hiding the Dock icon
- Adding Settings
- Adding Quit
- Adding Launch at Login
- Adding a global keyboard shortcut
- Building a popover-style menu bar app
- Debugging menu bar app architecture

## When not to use this skill

Do not use this skill for:

- Normal iOS apps
- Full macOS document apps with no menu bar utility behavior
- Sidebars, toolbars, inspectors, or typography as isolated UI topics
- App Intents as the main topic; use `apple-app-intents`

## Decision tree

```
Need macOS 13+ only?
  yes → use MenuBarExtra
  no  → use NSStatusItem + NSPopover bridge

Need simple menu actions only?
  yes → .menuBarExtraStyle(.menu)
  no  → .menuBarExtraStyle(.window)

Need right-click status item behavior or custom status item drawing?
  yes → NSStatusItem bridge
  no  → MenuBarExtra
```

## Default project setup

1. Create macOS App in Xcode.
2. Use SwiftUI app lifecycle.
3. Replace or supplement `WindowGroup` with `MenuBarExtra`.
4. Add `Settings { SettingsView() }` if the app has preferences.
5. Add `LSUIElement = YES` only if the app should not appear in the Dock.
6. Add a template menu bar icon asset.
7. Add a clear Quit command.
8. Add Launch at Login only if it is useful.

## Minimal MenuBarExtra app

```swift
import SwiftUI

@main
struct MiniUtilityApp: App {
    var body: some Scene {
        MenuBarExtra("Mini Utility", systemImage: "bolt.circle") {
            Button("Run Action") {
                runPrimaryAction()
            }

            Divider()

            Button("Settings…") {
                NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
            }
            .keyboardShortcut(",", modifiers: .command)

            Divider()

            Button("Quit Mini Utility") {
                NSApplication.shared.terminate(nil)
            }
            .keyboardShortcut("q", modifiers: .command)
        }
        .menuBarExtraStyle(.menu)

        Settings {
            SettingsView()
        }
    }

    private func runPrimaryAction() {}
}
```

## Rich popover menu bar app

Use `.window` style when you need custom SwiftUI views.

```swift
import SwiftUI

@main
struct PopoverUtilityApp: App {
    @State private var appState = AppState()

    var body: some Scene {
        MenuBarExtra {
            RootPopoverView()
                .environment(appState)
                .frame(width: 360, height: 480)
        } label: {
            Image(systemName: "sparkles")
        }
        .menuBarExtraStyle(.window)

        Settings {
            SettingsView()
                .environment(appState)
        }
    }
}
```

## Menu style vs window style

| Need | Use |
| --- | --- |
| Native dropdown with buttons | `.menu` |
| Custom SwiftUI layout | `.window` |
| Forms, lists, search, cards | `.window` |
| Standard menu commands only | `.menu` |
| Precise AppKit status item behavior | `NSStatusItem` |

## Standard menu structure

```
Status line, disabled if useful
────────────────────
Primary Action
Secondary Action
────────────────────
Settings…       ⌘,
────────────────────
Quit App Name   ⌘Q
```

Rules:

- Always include Quit.
- Use Settings if the app has preferences.
- Keep menu items short.
- Do not build a dashboard inside `.menu` style.
- Use `.window` style for custom UI.

## Hide Dock icon

Use `LSUIElement` when the app is a background/menu bar utility.

```xml
<key>LSUIElement</key>
<true/>
```

Rules:

- Use only when the app should not appear in the Dock.
- Provide a Quit command because users cannot quit from Dock.
- Provide Settings from menu or popover.
- Avoid hiding the Dock icon for apps with major document/window workflows.

## Settings window

```swift
Settings {
    SettingsView()
}
```

Open Settings:

```swift
Button("Settings…") {
    NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
}
.keyboardShortcut(",", modifiers: .command)
```

## Launch at login

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
        print("Launch at login failed: \(error)")
    }
}
```

SwiftUI setting:

```swift
import SwiftUI
import ServiceManagement

struct LaunchAtLoginToggle: View {
    @State private var isEnabled = SMAppService.mainApp.status == .enabled

    var body: some View {
        Toggle("Launch at Login", isOn: $isEnabled)
            .onChange(of: isEnabled) { _, newValue in
                setLaunchAtLogin(newValue)
            }
    }
}
```

## App state pattern

Use a single app state object for shared state.

```swift
import Observation

@Observable
final class AppState {
    var isRunning = false
    var statusText = "Ready"
    var lastUpdated: Date?
}
```

Fallback for older projects/toolchains:

```swift
final class AppState: ObservableObject {
    @Published var isRunning = false
    @Published var statusText = "Ready"
    @Published var lastUpdated: Date?
}
```

## Recommended folder structure

```
AppName/
  App/
    AppNameApp.swift
    AppState.swift
  Views/
    RootPopoverView.swift
    SettingsView.swift
    Components/
  Services/
    LaunchAtLoginService.swift
    HotkeyService.swift
    TimerService.swift
  Models/
  Resources/
    Assets.xcassets
```

## Menu bar icon rules

- Use a template image where possible.
- Prefer SF Symbols for simple symbols.
- Keep the icon visually simple.
- Avoid color unless it communicates state and is supported by the design.
- Avoid animated/flashing icons.
- Do not rely on the icon always being visible; macOS can hide menu extras when space is constrained.

## Global shortcuts

For production apps, prefer a well-tested shortcut package or a focused AppKit service.

Possible approaches:

```
NSEvent monitors = simple listening, limited control
Carbon hotkeys / packages = better for global shortcuts
KeyboardShortcuts package = practical default for indie SwiftUI apps
```

Rules:

- Let users customize shortcuts.
- Avoid stealing common system shortcuts.
- Show shortcuts in UI where relevant.
- Make shortcuts optional.

## AppKit bridge only when needed

Use AppKit bridge for:

- macOS 12 support
- Right-click status item menu
- Custom status item behavior
- Direct popover control
- Custom `NSStatusItem` length or drawing

Pattern:

```swift
import AppKit
import SwiftUI

final class StatusItemController: NSObject {
    private var statusItem: NSStatusItem?
    private let popover = NSPopover()

    func start() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem?.button?.image = NSImage(systemSymbolName: "bolt.circle", accessibilityDescription: "App")
        statusItem?.button?.target = self
        statusItem?.button?.action = #selector(togglePopover)

        popover.contentViewController = NSHostingController(rootView: RootPopoverView())
        popover.behavior = .transient
    }

    @objc private func togglePopover() {
        guard let button = statusItem?.button else { return }
        if popover.isShown {
            popover.performClose(nil)
        } else {
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
        }
    }
}
```

## Design checklist

```
[ ] Uses MenuBarExtra unless AppKit bridge is justified
[ ] Chooses .menu or .window intentionally
[ ] Includes Quit
[ ] Includes Settings if preferences exist
[ ] Uses LSUIElement only when appropriate
[ ] Menu bar icon is simple and template-friendly
[ ] Popover size is constrained
[ ] State is centralized
[ ] Services are separated from views
[ ] Launch at Login handles errors
[ ] Global shortcuts are user-configurable
[ ] App still works if menu bar item is hidden
```

## Common mistakes

```
❌ Trying to build rich UI inside .menu style
❌ Hiding Dock icon but forgetting Quit
❌ Putting business logic inside views
❌ Hardcoding global shortcuts with no settings
❌ Using AppKit bridge when MenuBarExtra is enough
❌ Making the popover too large
❌ No Settings scene
❌ No clear state model
❌ Colorful or complex menu bar icon
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the macos-menubar-swiftui skill to build or improve this macOS menu bar app.

Rules:
- Prefer SwiftUI MenuBarExtra for macOS 13+.
- Use .menu style for simple menu actions.
- Use .window style for custom SwiftUI popover UI.
- Use NSStatusItem + NSPopover only when MenuBarExtra cannot meet the requirement.
- Add LSUIElement only if the app should hide from Dock.
- Always include Quit when hiding the Dock icon.
- Add Settings scene if preferences exist.
- Keep popover size constrained.
- Keep business logic in Services.
- Use centralized app state.
- Use template-friendly menu bar icon.
- Add Launch at Login with SMAppService only where useful.
- Add keyboard shortcuts carefully and make global shortcuts configurable.
- Compile in Xcode and fix availability issues.

After coding:
1. List files changed.
2. Explain MenuBarExtra style choice.
3. Explain Dock/Settings/Quit behavior.
4. Explain state and services structure.
5. Give manual test steps.
```
