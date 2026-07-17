---
name: macos-launch-at-login
description: Use when adding, reviewing, or debugging Launch at Login in a macOS app — SMAppService registration, the requiresApproval state, a Settings toggle that reflects reality, and migration off deprecated login-item APIs.
---

# macOS Launch at Login

Add Launch at Login with `SMAppService` (macOS 13+), expose it as an honest Settings toggle, and handle every status the system can return — including the one where the user said no.

## When to use

Use this skill when the user says:

- launch at login
- start at login / start on boot
- open at startup
- login item
- `SMAppService`
- `SMLoginItemSetEnabled` (migration)
- background helper that should always run
- menu bar app that should come back after restart

Do not use this skill for launch *daemons* or privileged helpers (`SMAppService.daemon` + `launchd` plists are a different, root-level topic), or for iOS.

## Core rule

```
Launch at Login is opt-in, visible in Settings, honest about its
current state, and trivial to turn off. The app never registers
itself without the user asking.
```

## The API

One import, one service, three calls:

```swift
import ServiceManagement

// Register (adds the app to System Settings > General > Login Items)
try SMAppService.mainApp.register()

// Unregister
try SMAppService.mainApp.unregister()

// Current truth — always read this, never cache your own flag
SMAppService.mainApp.status
```

`register()` takes effect immediately and persists across reboots. No helper bundle, no `Library/LaunchAgents` plist, no deprecated API.

## The four statuses

`SMAppService.Status` is the part most implementations get wrong. Handle all four:

| Status | Meaning | What your UI shows |
|---|---|---|
| `.enabled` | Registered and allowed | Toggle on |
| `.notRegistered` | Not a login item | Toggle off |
| `.requiresApproval` | Registered, but the user disabled it in System Settings | Toggle off + a "Needs approval in System Settings" hint with a button |
| `.notFound` | System can't find the registration (rare; moved/renamed app) | Toggle off; re-register on next enable |

The killer detail: the user can flip your login item in **System Settings > General > Login Items** at any time, behind your back. A cached boolean in `UserDefaults` will lie. Read `status` every time the Settings view appears and every time the app becomes active.

For `.requiresApproval`, send the user to the right pane:

```swift
SMAppService.openSystemSettingsLoginItems()
```

## A complete, honest toggle

```swift
import SwiftUI
import ServiceManagement

@MainActor
@Observable
final class LaunchAtLogin {
    private(set) var status: SMAppService.Status = .notRegistered

    var isEnabled: Bool { status == .enabled }
    var needsApproval: Bool { status == .requiresApproval }

    init() { refresh() }

    func refresh() {
        status = SMAppService.mainApp.status
    }

    func setEnabled(_ enabled: Bool) {
        do {
            if enabled {
                try SMAppService.mainApp.register()
            } else {
                try SMAppService.mainApp.unregister()
            }
        } catch {
            // Registration can fail (e.g. translocated app run from a DMG).
            // Fall through to refresh() so the toggle snaps back to the truth.
        }
        refresh()
    }
}

struct LaunchAtLoginToggle: View {
    @State private var model = LaunchAtLogin()

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Toggle("Launch at Login", isOn: Binding(
                get: { model.isEnabled },
                set: { model.setEnabled($0) }
            ))

            if model.needsApproval {
                HStack(spacing: 6) {
                    Text("Waiting for approval in System Settings.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Button("Open Login Items…") {
                        SMAppService.openSystemSettingsLoginItems()
                    }
                    .buttonStyle(.link)
                    .font(.caption)
                }
            }
        }
        // The user can change this in System Settings while we're not looking.
        .onReceive(NotificationCenter.default.publisher(
            for: NSApplication.didBecomeActiveNotification)) { _ in
            model.refresh()
        }
    }
}
```

Notes that keep this correct:

- **The setter never stores the requested value.** It attempts the change, then re-reads `status`. If registration failed or needs approval, the toggle reflects that instead of lying.
- **Refresh on `didBecomeActiveNotification`** so a trip to System Settings and back updates the UI.
- **Errors are non-fatal.** A failed `register()` on a translocated build (running straight from a DMG) is expected; the fix is "move the app to /Applications", not a crash.

## Start hidden

If the app launches at login, it should not shove a window in the user's face at boot.

- **Menu bar apps:** set `LSUIElement = YES` and don't open a window on launch — nothing else needed. This is the common case (see `macos-menubar-swiftui`).
- **Regular windowed apps:** offer a separate "Start hidden" toggle and skip restoring the main window when it's on. Keep it a *separate* toggle — bundling it into Launch at Login removes the user's choice.

## Migrating off the deprecated APIs

If the codebase still uses any of these, replace them with `SMAppService.mainApp`:

- `SMLoginItemSetEnabled` + a separate login-item helper bundle in `Contents/Library/LoginItems` — delete the helper target entirely.
- `LSSharedFileList` (ancient, removed).
- A hand-written `~/Library/LaunchAgents/*.plist` for a GUI app — user-visible, fragile, and now shown with a scary "background item added" notification. Login items belong to `SMAppService`.

There is no data to migrate: on first run of the new version, read `SMAppService.mainApp.status` and treat it as the truth. Don't try to auto-re-register based on the old preference — that's registering without the user asking.

## Settings UX

```
General
  [ ] Launch at Login
      Waiting for approval in System Settings.  Open Login Items…   (only when required)
  [ ] Start hidden                                                  (windowed apps only)
```

- The toggle lives in Settings (or the menu bar app's preferences), not in a first-run modal.
- Never pre-check it, never register during onboarding "for convenience".
- The approval hint appears only in the `.requiresApproval` state.

## Checklist

```
[ ] Uses SMAppService.mainApp — no helper bundle, no SMLoginItemSetEnabled
[ ] Toggle reads status from the system, not from a cached UserDefaults flag
[ ] All four statuses handled, including .requiresApproval with a
    "Open Login Items…" path
[ ] Status refreshes when the app becomes active
[ ] register()/unregister() errors leave the toggle showing the real state
[ ] App never registers itself without an explicit user action
[ ] Launch-at-login start is quiet (no window thrown at the user at boot)
[ ] Turning it off works and survives a relaunch
```

## Manual test

1. Toggle on → app appears in System Settings > General > Login Items.
2. Reboot (or log out/in) → app starts, quietly.
3. Disable it *in System Settings* → return to the app → toggle shows off (or "needs approval").
4. Toggle off in-app → entry disappears from Login Items.
5. Run the app from a mounted DMG → toggle fails gracefully, no crash.
