---
name: macos-menubar-swiftui
description: Use when building, refactoring, or debugging a macOS menu bar app with SwiftUI, or when a MenuBarExtra misbehaves — the icon renders wrong or vanishes, the Settings window opens behind other apps, the popover cannot be closed, controls inside a .menu style do not render, the Dock icon comes back, or the app quits when the item is dragged off the menu bar. Triggers include menu bar app, status bar app, tray app, MenuBarExtra, NSStatusItem, LSUIElement, hide Dock icon.
---

# macOS Menubar SwiftUI

Prefer `MenuBarExtra` (macOS 13+). Drop to an `NSStatusItem` bridge only for a requirement the SwiftUI scene cannot express. The scene is simple; the traps are around it, in activation, item mapping, the icon, and lifecycle.

Sibling skills own their topics. Do not restate them here:

- **REQUIRED SUB-SKILL for a Launch at Login toggle:** `macos-launch-at-login` (the four `SMAppService` statuses, `requiresApproval`).
- Global hotkeys: `macos-global-shortcuts`.
- A status item that opens a floating `NSPanel` instead of a popover: `swiftui-floating-panel-menubar`.
- Signing, notarization, DMG: `macos-app-distribution-dmg`.
- Shortcuts and Siri: `apple-app-intents`.

## Decide the shape

| Need | Use |
| --- | --- |
| Native dropdown of commands | `MenuBarExtra` + `.menuBarExtraStyle(.menu)` |
| Custom SwiftUI layout, forms, lists, status cards | `MenuBarExtra` + `.menuBarExtraStyle(.window)` |
| Right-click menu on the item, custom item drawing, drag-and-drop onto the item, variable item width, macOS 12 | `NSStatusItem` bridge (bottom of this file) |
| Popover must be closed by code, or must survive click-outside | `NSStatusItem` + `NSPopover`, or the floating-panel skill |

## Skeleton (window style)

```swift
import SwiftUI

@main
struct PulseApp: App {
    @State private var state = AppState()
    @AppStorage("showExtra") private var showExtra = true

    var body: some Scene {
        MenuBarExtra("Pulse", systemImage: "waveform", isInserted: $showExtra) {
            PopoverView()
                .environment(state)
                .frame(width: 280)          // .window style needs an explicit width
        }
        .menuBarExtraStyle(.window)
        // Custom asset instead of an SF Symbol: use the label closure.
        // MenuBarExtra(isInserted: $showExtra) { PopoverView() } label: { Image("MenuBarIcon") }

        Settings {
            SettingsView()
                .environment(state)         // scenes share no view tree; inject in both
        }
    }
}

struct PopoverView: View {
    @Environment(AppState.self) private var state

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(state.statusText)
            Divider()
            SettingsLink { Text("Settings…") }     // macOS 14+; opens or fronts the Settings scene
                .keyboardShortcut(",", modifiers: .command)
            Button("Quit Pulse") { NSApplication.shared.terminate(nil) }
                .keyboardShortcut("q", modifiers: .command)
        }
        .padding(16)
        .onAppear { NSApp.activate() }             // see "Windows open behind" below
    }
}

@Observable final class AppState {
    var statusText = "Ready"
}
```

`LSUIElement = YES` hides the Dock icon and the app switcher entry. Set it in exactly one place: the Info.plist, or the `INFOPLIST_KEY_LSUIElement` build setting when Xcode generates the plist. Having both lets a build-settings merge drop it and the Dock icon quietly returns. `LSBackgroundOnly` is the wrong key; a background-only app can never become active, so its windows never take keyboard focus.

## What breaks, and why

**Windows open behind other apps.** An `LSUIElement` app is never automatically frontmost, so Settings and any `openWindow` window appear behind the current app with no key focus. Call `NSApp.activate()` before opening. `activate(ignoringOtherApps:)` is deprecated since macOS 14 and `NSApp.setActivationPolicy(.regular)` as a fix leaves a Dock icon behind unless you revert it on window close.

**`showSettingsWindow:` does nothing.** The private selector stopped working on macOS 14. Use `SettingsLink` or the `openSettings` environment action, both macOS 14+.

**Controls inside `.menu` style vanish.** In `.menu` style the content is converted to `NSMenu` items: `Button` becomes an item, `Toggle` a checkmark item, `Text` a disabled item, `Divider` a separator, `Menu` a submenu. `Picker`, `TextField`, `Slider`, images and any custom view are dropped without a warning. Anything richer than a command list needs `.window`.

**The popover cannot be dismissed from code.** `.window` style has no public close API and `dismiss` does not close it. A button that opens Settings leaves the popover up. Workarounds: `NSApp.keyWindow?.close()` right after the action, or the `NSStatusItem` bridge where `popover.performClose` is yours.

**The app quits when the user drags the item off the menu bar.** Apple terminates a menu-bar-only app when its extra is removed. Persist state on every change, never on quit, and use the `isInserted` binding so hiding the item is a preference rather than a removal. macOS also hides extras when the bar is crowded, so nothing critical may live only behind the icon.

**The icon is grey, does not invert, or is blurry.** The label image must be a template: an asset with Render As set to Template Image, black with alpha, one single-scale PDF, or an SF Symbol via `systemImage:`. `.renderingMode(.original)` on the label breaks the highlight and dark-mode tinting. Dock-sized raster PNGs blur at the 16 to 18 point menu bar height. On macOS 26 the bar is translucent, so check the glyph idle and clicked in both appearances on a real 26 build.

**Keyboard shortcuts on popover buttons do nothing.** They only fire while the popover window is key. A hotkey that must work from anywhere is a global shortcut; see the sibling skill.

**Launch at Login toggle lies.** `SMAppService.mainApp.status` has four values and the user can flip the item in System Settings behind your back. Read the status live on appear, handle `.requiresApproval`, and test only a signed build launched from `/Applications`. The sibling skill has the complete toggle.

## NSStatusItem bridge

Only when the table above sends you here. Keep it in one controller owned by the app delegate.

```swift
import AppKit
import SwiftUI

final class StatusItemController: NSObject {
    private var item: NSStatusItem?
    private let popover = NSPopover()

    func start() {
        item = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        item?.button?.image = NSImage(systemSymbolName: "waveform", accessibilityDescription: "Pulse")
        item?.button?.target = self
        item?.button?.action = #selector(toggle)
        item?.button?.sendAction(on: [.leftMouseUp, .rightMouseUp])   // right-click reaches you
        popover.contentViewController = NSHostingController(rootView: PopoverView())
        popover.behavior = .transient                                  // click-outside closes it
    }

    @objc private func toggle() {
        guard let button = item?.button else { return }
        if NSApp.currentEvent?.type == .rightMouseUp { item?.menu = contextMenu(); button.performClick(nil); item?.menu = nil; return }
        popover.isShown ? popover.performClose(nil)
                        : popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
    }

    private func contextMenu() -> NSMenu { NSMenu() }
}
```

Set `item?.menu` only for the duration of the right-click; a permanently assigned menu swallows left clicks.

## Checklist

```
[ ] .menu or .window chosen from the table, not by habit
[ ] LSUIElement set in one place; Quit present in the menu or popover
[ ] NSApp.activate() before any window opens from the extra
[ ] Label is an SF Symbol or a template asset; no .renderingMode(.original)
[ ] State persisted on change; isInserted bound to a preference
[ ] Settings via SettingsLink or openSettings, macOS 14+
[ ] Launch at Login handled by macos-launch-at-login
```

Manual test: launch from `/Applications`, open Settings from the popover and confirm it is frontmost with focus, switch appearance and click the item to check the icon, Cmd-drag the item off the bar and relaunch to confirm state survived.
