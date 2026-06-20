---
name: apple-hig-macos-window-layout
description: Use when designing or implementing the overall macOS app window shell — titlebar, toolbar, sidebar, content, inspector, window sizing, panels, sheets, and menu bar companion windows.
---

# Apple HIG macOS Window Layout

Build a stable, resizable, native macOS window shell organized around the main task: titlebar, toolbar, sidebar, content, inspector, sizing, panels, sheets, and menu bar companions. Reach for it when shaping the overall window structure rather than one isolated component.

## Purpose

Use this skill when designing or implementing the overall macOS app window shell: titlebar, toolbar, sidebar, content area, inspector, window sizing, panels, sheets, and menu bar companion windows.

## Core rule

```
A macOS window should feel stable, resizable, native, and organized around the main task.
```

## When to use this skill

Use for:

- Main macOS app windows
- Utility windows
- Menu bar companion windows
- Split view layout
- Sidebar + detail + inspector
- Toolbar placement
- Window sizing
- Settings window sizing
- Floating panels
- Sheets

## When not to use this skill

Do not use for:

- iPhone layout only
- Typography only
- Sidebar content only
- Menu bar popover only

## Standard productivity window

```
┌─────────────────────────────────────────────┐
│ Toolbar / titlebar                          │
├──────────────┬───────────────────┬──────────┤
│ Sidebar      │ Main Content      │ Inspector│
│              │                   │          │
└──────────────┴───────────────────┴──────────┘
```

Recommended widths:

```
Sidebar: 220–280 px
Main: flexible, dominant
Inspector: 280–360 px
```

## Window size guidance

```
Small utility:       520 × 420
Medium productivity: 900 × 640
Large workspace:     1100 × 720+
Settings:            520–640 × 360–520
Menu bar popover:    320–420 wide
```

Use minimum sizes so layout does not break.

## SwiftUI window setup

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            RootWindowView()
                .frame(minWidth: 900, minHeight: 640)
        }

        Settings {
            SettingsView()
                .frame(width: 560, height: 420)
        }
    }
}
```

## Root window pattern

```swift
struct RootWindowView: View {
    @State private var selection: SidebarDestination? = .home
    @State private var showsInspector = true

    var body: some View {
        NavigationSplitView {
            SidebarView(selection: $selection)
        } detail: {
            DetailView(selection: selection)
                .inspector(isPresented: $showsInspector) {
                    InspectorPanel()
                        .inspectorColumnWidth(min: 280, ideal: 320, max: 380)
                }
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
}
```

## Titlebar and toolbar rules

- Use native toolbar when possible.
- Do not fake the macOS titlebar unless required.
- Keep toolbar actions contextual.
- Sidebar toggle belongs in toolbar/navigation area.
- Inspector toggle belongs in trailing toolbar.
- Search may belong in toolbar if central.

## Sheets vs windows vs popovers

Use sheets for short focused tasks:

```
New Project
Rename
Choose template
Confirm export
```

Use separate windows for:

```
Settings
Detailed logs
Large editor
Long report preview
```

Use popovers for:

```
Small contextual controls
Quick capture
Short menu bar interactions
```

Do not put complex multi-step workflows in tiny popovers.

## Resizing rules

- Define minimum width/height.
- Test narrow widths.
- Ensure sidebar can collapse.
- Ensure inspector can hide.
- Avoid fixed layouts that break when resized.
- Avoid full-screen-only assumptions.

## macOS menu bar companion rule

If the app has both a menu bar item and a full window:

```
Menu bar = quick status / quick capture / quick action
Window = full workspace
```

Do not duplicate the full app inside the menu bar popover.

## Visual rules

- Main content dominates.
- Sidebar is calm.
- Toolbar is quiet.
- Inspector is secondary.
- Window should have clear hierarchy.
- Avoid too many borders.
- Avoid heavy glass everywhere.
- Use material sparingly.

## Review checklist

```
[ ] Window has a clear main task
[ ] Sidebar/content/inspector roles are clear
[ ] Toolbar actions are contextual
[ ] Window has useful minimum size
[ ] Layout survives resizing
[ ] Sidebar can collapse
[ ] Inspector can hide
[ ] Settings window is appropriately sized
[ ] Complex workflows are not inside tiny popovers
[ ] Native macOS chrome is preserved where possible
```

## Common mistakes

```
Fake custom titlebar for no reason
Full dashboard inside menu bar popover
No minimum window size
Inspector always visible on tiny width
Toolbar used as navigation
Sidebar too wide
Content squeezed by too many panels
Settings window too large or dashboard-like
```

## Prompt template

```
Use the apple-hig-macos-window-layout skill to improve the macOS window shell.

Rules:
- Preserve native macOS window behavior.
- Use NavigationSplitView for sidebar/content layouts.
- Use inspector for selected-item details.
- Keep main content dominant.
- Add sensible minimum window size.
- Make sidebar collapsible.
- Make inspector toggleable.
- Use sheets for short focused tasks.
- Use windows for large workflows.
- Do not duplicate full app inside menu bar popover.
- Test resizing.

After coding:
1. List files changed.
2. Explain window layout.
3. Explain sizing decisions.
4. Explain sidebar/inspector behavior.
5. Give manual test steps.
```
