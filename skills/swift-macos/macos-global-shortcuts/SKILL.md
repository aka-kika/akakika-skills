---
name: macos-global-shortcuts
description: Use when adding or reviewing keyboard shortcuts in a macOS app — in-app vs global, RegisterEventHotKey vs the KeyboardShortcuts package vs NSEvent monitors, user-configurable recording, conflict handling, and which defaults won't collide with the system.
---

# macOS Global Shortcuts

Add keyboard shortcuts that work — in-app ones through SwiftUI, global ones through a real hotkey registration — and keep them configurable, disableable, and out of the system's way.

## When to use

Use this skill when the user says:

- global shortcut / global hotkey
- keyboard shortcut that works everywhere
- summon the app / toggle the popover from anywhere
- quick capture hotkey
- ⌥Space / hyper key
- `RegisterEventHotKey`
- KeyboardShortcuts (the package)
- shortcut recorder / customize shortcuts
- shortcut conflicts

Do not use this skill for menu-item shortcuts inside a single window (that's plain `.keyboardShortcut`), or for intercepting/remapping *other apps'* keys (that's an event tap + Accessibility permission — a different, heavier topic).

## Core rule

```
In-app shortcuts by default; global only for actions that must work
while the app is in the background. Every global shortcut is
user-changeable, disableable, and never a common system chord.
```

## Decision tree

```
Does the action only matter while the app is frontmost?
  yes → SwiftUI .keyboardShortcut / menu commands. Stop here.

Must it fire while another app is focused?
  yes → global hotkey:
        indie/product app → KeyboardShortcuts package (recorder UI included)
        zero-dependency   → Carbon RegisterEventHotKey (old API, still correct)

Do you only need to OBSERVE keys, not own a chord?
  → NSEvent.addGlobalMonitorForEvents — but it can't consume events
    and needs Accessibility/Input Monitoring approval. Almost never
    what a "global shortcut" task actually wants.
```

## In-app shortcuts (the 90% case)

```swift
// On a control
Button("New Entry", action: newEntry)
    .keyboardShortcut("n", modifiers: [.command])

// As a menu command — visible, discoverable, remappable by the
// user in System Settings > Keyboard > App Shortcuts
.commands {
    CommandMenu("Capture") {
        Button("Quick Capture", action: quickCapture)
            .keyboardShortcut("k", modifiers: [.command])
    }
}
```

Prefer the menu-command form: it shows up in the menu bar with the chord rendered next to it, which is how users learn shortcuts on macOS.

## Global shortcuts, option A: the KeyboardShortcuts package

For indie SwiftUI apps, `sindresorhus/KeyboardShortcuts` is the pragmatic choice — it wraps `RegisterEventHotKey`, persists user choices in `UserDefaults`, and ships the recorder control you'd otherwise hand-build. No special permissions needed.

```swift
import KeyboardShortcuts

// 1. Declare names — one per action. Default is optional; nil means
//    "off until the user records one", which is the politest default.
extension KeyboardShortcuts.Name {
    static let toggleQuickCapture = Self("toggleQuickCapture",
                                         default: .init(.space, modifiers: [.option]))
    static let togglePanel = Self("togglePanel")   // no default: opt-in
}

// 2. Listen — set up once, e.g. in the App init or app delegate
KeyboardShortcuts.onKeyUp(for: .toggleQuickCapture) {
    CaptureController.shared.toggle()
}

// 3. Let the user change it in Settings
import SwiftUI

struct ShortcutsSettingsView: View {
    var body: some View {
        Form {
            KeyboardShortcuts.Recorder("Quick capture:", name: .toggleQuickCapture)
            KeyboardShortcuts.Recorder("Show panel:", name: .togglePanel)
        }
    }
}
```

The recorder handles clearing (user deletes the chord → shortcut disabled) and refuses reserved system chords. That's the "changeable + disableable" requirement done.

## Global shortcuts, option B: raw RegisterEventHotKey

When a dependency is unacceptable. The Carbon API is deprecated-looking but supported, sandbox-safe, and requires **no permissions** — unlike event taps.

```swift
import Carbon.HIToolbox

final class HotKey {
    private var ref: EventHotKeyRef?
    private static var handlerInstalled = false
    private static var actions: [UInt32: () -> Void] = [:]
    private let id: UInt32

    init(id: UInt32, keyCode: UInt32, modifiers: UInt32, action: @escaping () -> Void) {
        self.id = id
        Self.actions[id] = action
        Self.installHandlerIfNeeded()

        let hotKeyID = EventHotKeyID(signature: OSType(0x48_4B_45_59), id: id) // "HKEY"
        RegisterEventHotKey(keyCode, modifiers, hotKeyID,
                            GetApplicationEventTarget(), 0, &ref)
    }

    deinit {
        if let ref { UnregisterEventHotKey(ref) }
        Self.actions[id] = nil
    }

    private static func installHandlerIfNeeded() {
        guard !handlerInstalled else { return }
        handlerInstalled = true
        var eventType = EventTypeSpec(eventClass: OSType(kEventClassKeyboard),
                                      eventKind: UInt32(kEventHotKeyPressed))
        InstallEventHandler(GetApplicationEventTarget(), { _, event, _ in
            var hkID = EventHotKeyID()
            GetEventParameter(event, EventParamName(kEventParamDirectObject),
                              EventParamType(typeEventHotKeyID), nil,
                              MemoryLayout<EventHotKeyID>.size, nil, &hkID)
            HotKey.actions[hkID.id]?()
            return noErr
        }, 1, &eventType, nil, nil)
    }
}

// ⌥Space → toggle panel. Key codes are Carbon virtual key codes
// (kVK_Space = 49); modifiers are Carbon masks, not NSEvent masks.
let toggle = HotKey(id: 1,
                    keyCode: UInt32(kVK_Space),
                    modifiers: UInt32(optionKey)) {
    PanelController.shared.toggle()
}
```

Going this route you also own persistence and a recorder UI — budget for that before choosing it over option A.

## What NOT to use for hotkeys

- `NSEvent.addGlobalMonitorForEvents(matching:)` — observe-only. It cannot consume the keystroke (the frontmost app still receives it) and silently delivers nothing until the user grants Accessibility/Input Monitoring. Fine for "dismiss my panel when the user clicks/types elsewhere"; wrong for owning a chord.
- `CGEvent` taps — can consume keys, but require Accessibility approval and take your process into keylogger-adjacent territory. Reserve for genuine event-remapping tools.

## Choosing defaults

```
In-app:
  ⌘K         command palette (see apple-hig-command-palette)
  ⌘N ⌘F ⌘,   leave with their system meanings

Global (all optional, all user-changeable):
  ⌥Space         summon / quick capture — the de-facto indie default
  ⌃⌥<letter>     secondary actions — the least-collision modifier pair
  ⌘⇧<letter>     avoid globally: heavily used by apps and the system
```

Rules:

- **Ship at most one global default; make the rest opt-in** (declared with no default chord). An app that grabs three chords on first launch is hostile.
- Never take a bare system chord globally: ⌘Space (Spotlight), ⌘Tab, ⌘Q, ⌘W, screenshot chords (⌘⇧3/4/5), media keys.
- If registration fails (another app owns the chord), say so in Settings next to the recorder — not with silence.
- Global shortcuts trigger *safe, reversible* actions: summon, capture, toggle. Never delete, send, or publish from a chord the user might hit blind.

## Conflict handling

Two layers:

1. **Recording time** — the recorder should reject system-reserved chords (the KeyboardShortcuts recorder does).
2. **Registration time** — `RegisterEventHotKey` returns an error if the chord is taken by another app's hotkey. Surface it: "⌥Space is in use by another app — choose a different shortcut."

## Settings checklist

```
[ ] Every global shortcut has a recorder in Settings
[ ] Every global shortcut can be cleared (= disabled)
[ ] At most one global chord is on by default; the rest are opt-in
[ ] Registration failure shows a visible message, not silence
[ ] Shortcut works while the app is in the background (that's the point)
[ ] Shortcut fires exactly once per press (test key-repeat)
[ ] Action behind the chord is non-destructive
[ ] In-app shortcuts appear in menus so they're discoverable
```

## Manual test

1. Record a chord → quit and relaunch → chord still works (persistence).
2. Focus another app → press the chord → action fires (globality).
3. Clear the chord in Settings → press it → nothing happens (disable).
4. Try to record ⌘Q → recorder refuses (reserved).
5. Register a chord owned by another running app → visible error (conflict).
