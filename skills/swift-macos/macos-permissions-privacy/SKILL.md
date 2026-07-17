---
name: macos-permissions-privacy
description: Use when a macOS app needs a TCC permission or touches private data — the map of which API, Info.plist key, and entitlement each permission needs, pre-prompt explanation patterns, denied-state recovery with System Settings deep links, and honest privacy copy.
---

# macOS Permissions & Privacy

Request only what the app needs *now*, explain why *before* the system asks, and give every denied state a recovery path. On macOS the permission landscape (TCC) is a patchwork — each permission has its own API, its own Info.plist key, and its own failure mode; the map below is most of the work.

## When to use

Use this skill when the user says:

- permission / permission prompt / TCC
- Accessibility access, Screen Recording, Full Disk Access, Input Monitoring
- Automation / Apple Events / "wants to control"
- access files, contacts, calendar, camera, microphone
- app can't see the folder / operation not permitted
- privacy settings / privacy copy
- sandbox entitlements for user data

Do not use this skill for notification permission specifically (see `macos-notifications`) or for iOS-only flows like App Tracking Transparency.

## Core rule

```
Explain before the system prompts. Request at the moment of need.
Request the narrowest thing that works. Every denied state has a
visible recovery path.
```

## The permission map

The column you'll consult most. "Prompt?" = can the app trigger a system dialog, or must the user flip a switch in System Settings themselves?

| Need | API to check/request | Info.plist usage string | Prompt? |
|---|---|---|---|
| Files the user picks | `NSOpenPanel` / drag-in + security-scoped bookmarks | — | Picker *is* consent |
| Desktop / Documents / Downloads (programmatic) | just access it; system prompts once | — | Yes, automatic |
| Network volumes / removable | same | — | Yes, automatic |
| **Full Disk Access** | none — attempt access, detect failure | — | **No — Settings only** |
| **Accessibility** (control UI, event taps) | `AXIsProcessTrustedWithOptions` | — | Prompt opens Settings |
| **Screen Recording** | `CGPreflightScreenCaptureAccess()` / `CGRequestScreenCaptureAccess()` | — | Once; then Settings |
| **Input Monitoring** | `IOHIDCheckAccess(.listenEvent)` / `IOHIDRequestAccess` | — | Yes |
| Automation (Apple Events) | `AEDeterminePermissionToAutomateTarget` | `NSAppleEventsUsageDescription` | Yes, per target app |
| Camera / Microphone | `AVCaptureDevice.requestAccess(for:)` | `NSCameraUsageDescription` / `NSMicrophoneUsageDescription` | Yes |
| Contacts | `CNContactStore.requestAccess` | `NSContactsUsageDescription` | Yes |
| Calendar / Reminders | `EKEventStore.requestFullAccessToEvents()` | `NSCalendarsFullAccessUsageDescription` | Yes |
| Location | `CLLocationManager.requestWhenInUseAuthorization` | `NSLocationUsageDescription` | Yes |

Sandboxed apps additionally need the matching entitlement (`com.apple.security.files.user-selected.read-write`, `.device.camera`, `.personal-information.*`, …) — without it the API fails without even prompting. A missing Info.plist usage string doesn't ask either: **it crashes the app** at request time.

## The four-step flow (every permission)

**1. Check silently.** Never re-prompt on launch; read status first.

**2. Pre-explain at the moment of need.** The system dialog must never be the first the user hears of it:

```
The user clicks "Watch this folder"
  → sheet: "To notice new files, the app needs access to the
     folder you choose. Nothing leaves your Mac."   [Choose Folder…]
  → NSOpenPanel (which itself grants the access)
```

**3. Request narrowly.** A folder picker instead of Full Disk Access. One target app for Automation instead of "everything". `whenInUse` instead of `always`.

**4. Handle denial with recovery.** Show the off state where the feature lives *and* in Settings, with a deep link.

## System Settings deep links

```swift
func openPrivacyPane(_ pane: String) {
    let url = URL(string:
        "x-apple.systempreferences:com.apple.preference.security?\(pane)")!
    NSWorkspace.shared.open(url)
}

// The panes you'll actually need:
// Privacy_Accessibility      Privacy_ScreenCapture      Privacy_AllFiles
// Privacy_Automation         Privacy_Microphone         Privacy_Camera
// Privacy_ListenEvent (input monitoring)                Privacy_LocationServices
```

A denied state without a button to the right pane is a dead end; with it, it's a two-click fix.

## Worked patterns

### Files: the picker is the permission

In the sandbox, whatever the user picks (or drags in) is granted. Persist access with a security-scoped bookmark, or the grant dies with the process:

```swift
// After NSOpenPanel:
let bookmark = try url.bookmarkData(options: .withSecurityScope,
                                    includingResourceValuesForKeys: nil,
                                    relativeTo: nil)
// store `bookmark` (Data) in your app support dir

// On next launch:
var stale = false
let url = try URL(resolvingBookmarkData: bookmark,
                  options: .withSecurityScope,
                  relativeTo: nil,
                  bookmarkDataIsStale: &stale)
guard url.startAccessingSecurityScopedResource() else { /* re-pick */ return }
defer { url.stopAccessingSecurityScopedResource() }
// … read/write …
```

If `stale` is true, re-create the bookmark from the resolved URL. If resolving fails (folder moved/deleted), ask the user to pick again — don't silently do nothing.

### Accessibility

```swift
// Check without prompting:
let trusted = AXIsProcessTrusted()

// Check AND show the system's "grant in Settings" dialog once:
let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true]
let trusted = AXIsProcessTrustedWithOptions(options as CFDictionary)
```

The grant does not take effect until your process is relaunched in some flows — after the user enables it, re-check on `didBecomeActiveNotification` and offer "Relaunch" if features still fail.

### Screen recording

```swift
if !CGPreflightScreenCaptureAccess() {        // silent check
    let granted = CGRequestScreenCaptureAccess() // prompts once, ever
    if !granted { /* show recovery UI → Privacy_ScreenCapture */ }
}
```

`CGRequestScreenCaptureAccess` only produces a dialog the first time; afterwards it just returns false. Treat "false" as "send them to Settings", and expect macOS 15+ to periodically re-confirm this permission with the user on your behalf.

### Full Disk Access — avoid, then detect

There is no API to request FDA. First redesign: can a folder picker cover it? If genuinely not (backup tools, indexers), detect by probing a protected path and guide:

```swift
// TCC-protected on every Mac; unreadable without FDA
let probe = FileManager.default
    .homeDirectoryForCurrentUser
    .appendingPathComponent("Library/Mail")
let hasFDA = (try? FileManager.default
    .contentsOfDirectory(atPath: probe.path)) != nil
```

Pair the guide screen with `Privacy_AllFiles` and exact instructions ("drag the app into the list, then relaunch").

### Automation (controlling another app)

```swift
var target = NSAppleEventDescriptor(bundleIdentifier: "com.apple.finder")
let status = AEDeterminePermissionToAutomateTarget(
    target.aeDesc, typeWildCard, typeWildCard, true)   // true = may prompt
// noErr = allowed · errAEEventNotPermitted = denied
// procNotFound = target not running (launch it first, then ask)
```

Requires `NSAppleEventsUsageDescription` in Info.plist and (sandboxed) a scripting-targets entitlement. The prompt names the target app — one prompt per target.

## Privacy copy pattern

Wherever a permission is explained — pre-prompt sheet, Settings, onboarding:

```
Why we need this      one sentence, the feature not the API
What we access        concrete: "the folder you choose", not "your files"
What stays local      say it plainly if everything does
How to change it      "System Settings > Privacy & Security > X, anytime"
```

If the app is local-first, *say so in the permission moment* — "processed on your Mac, never uploaded" is the sentence that converts a hesitant deny into a grant, and it must be true.

## Settings: the permission dashboard

Apps that need 2+ permissions should show their state honestly in one place:

```
Permissions
  Folder access      ~/Notes granted        Change…
  Accessibility      Not granted            Open System Settings…
  Screen recording   Granted
```

Re-read all statuses when the app becomes active — every one of these can be revoked behind your back, and stale "Granted" labels destroy trust.

## Checklist

```
[ ] Every permission has a pre-prompt explanation in product language
[ ] Requests fire at the moment of need, never stacked at first launch
[ ] Narrowest scope chosen (picker over FDA, one target over many)
[ ] Info.plist usage strings present for every prompting API (missing = crash)
[ ] Sandbox entitlements match the APIs used
[ ] Denied state visible where the feature lives, with the right deep link
[ ] Statuses re-checked on app activation, never cached across launches
[ ] Security-scoped bookmarks persisted and stale-handled for file access
[ ] Privacy copy states what stays local — and it's true
```

## Manual test

1. Fresh profile (or `tccutil reset <service> <bundle-id>`) → feature first-use shows your explanation, then the system prompt.
2. Deny → feature shows its off state + deep link lands on the right pane.
3. Grant in Settings → return to app → status updates without relaunch (or app offers relaunch where required).
4. Revoke while the app is running → app degrades with the recovery UI, no crash.
5. Move a bookmarked folder → app asks to re-pick, doesn't silently break.
