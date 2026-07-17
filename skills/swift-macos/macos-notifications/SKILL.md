---
name: macos-notifications
description: Use when adding or reviewing macOS user notifications — UNUserNotificationCenter permission flow, categories and action buttons, click routing through the delegate, foreground presentation, and rules that keep notifications from becoming spam.
---

# macOS Notifications

Notify only when the user benefits from being pulled back — task finished, task failed, something needs their decision — and make every notification click land on the exact screen that resolves it.

## When to use

Use this skill when the user says:

- notify when done / notification when the task finishes
- desktop notification / system notification
- `UNUserNotificationCenter` / `UserNotifications`
- notification permission
- notification actions / buttons
- clicking the notification should open …
- background job finished, tell the user
- reminder from a macOS app

Do not use this skill for push/APNs server setup, iOS-specific notification UI, or in-window status banners (those are in-app feedback — see `apple-hig-feedback-status`).

## Core rule

```
Notify only when being pulled back saves the user something.
Every notification answers: what happened, and what happens
when I click it.
```

## When to notify — and when not

Worth a notification (the app is likely in the background):

```
Completed     long task finished        → click opens the result
Failed        long task failed          → click opens the error + retry
Blocked       waiting on input/approval → click opens the decision
Needs review  output ready to check     → click opens the review view
Reminder      user-scheduled            → click opens the item
```

Not worth one:

- Progress ticks, intermediate states, "still working…"
- Anything the user is currently looking at (foreground, same screen)
- Marketing, tips, "did you know" — never
- Errors the app can recover from by itself

If the app fires more than a handful of notifications an hour, the model is wrong — batch them (one summary notification) or drop the low-value ones.

## Permission

Request at the moment of need, with context, never at first launch:

```swift
import UserNotifications

enum Notifier {
    // Call right after the user does the thing that will later notify —
    // e.g. starts their first long-running task.
    static func requestPermission() async -> Bool {
        let center = UNUserNotificationCenter.current()
        do {
            return try await center.requestAuthorization(options: [.alert, .sound, .badge])
        } catch {
            return false
        }
    }

    // Never assume — settings can change behind the app's back.
    static func isAuthorized() async -> Bool {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        return settings.authorizationStatus == .authorized
                || settings.authorizationStatus == .provisional
    }
}
```

Rules:

- **Pre-explain.** Before the system prompt, the UI has already made the value obvious ("Runs can take a while — want a notification when one finishes?"). The system dialog should never be a surprise.
- **The system prompt fires once.** If the user denies, `requestAuthorization` won't re-prompt — your only path is Settings, so keep a "notifications are off" state in your own Settings pane with a deep link:

```swift
// Opens System Settings > Notifications
NSWorkspace.shared.open(
    URL(string: "x-apple.systempreferences:com.apple.Notifications-Settings.extension")!)
```

- **Consider `.provisional`** for low-stakes apps: notifications deliver quietly to Notification Center without any prompt, and the user promotes or demotes them from there.

## Sending, with categories and actions

Define categories once at launch; they give notifications buttons and give clicks a routable identity:

```swift
enum TaskNotification {
    static let category = "task.finished"
    static let retryAction = "task.retry"

    static func registerCategories() {
        let retry = UNNotificationAction(identifier: retryAction,
                                         title: "Retry",
                                         options: [])
        let category = UNNotificationCategory(identifier: category,
                                              actions: [retry],
                                              intentIdentifiers: [])
        UNUserNotificationCenter.current().setNotificationCategories([category])
    }

    static func post(taskID: String, title: String, body: String) async {
        guard await Notifier.isAuthorized() else { return }

        let content = UNMutableNotificationContent()
        content.title = title                       // "Export failed"
        content.body = body                         // "3 of 120 items didn't convert."
        content.sound = .default
        content.categoryIdentifier = category
        content.userInfo = ["taskID": taskID]       // routing payload
        content.threadIdentifier = "tasks"          // groups related ones

        let request = UNNotificationRequest(identifier: taskID,   // same ID = replaces
                                            content: content,
                                            trigger: nil)         // deliver now
        try? await UNUserNotificationCenter.current().add(request)
    }
}
```

Details that matter:

- **Title = what happened; body = the one detail that matters.** No app name in the title (the system shows it), no exclamation marks.
- **Reusing the request identifier replaces** the previous notification — the right behavior for a task that goes `blocked → completed`.
- **`threadIdentifier`** keeps a burst of task notifications stacked instead of carpeting the screen.
- **Failure notifications include the recovery path** — a Retry action button, and a click target that shows the error.

## Click routing — the delegate

Without a delegate, clicks just activate the app and notifications hide while the app is frontmost. Set it early (before any notification can arrive):

```swift
import AppKit
import UserNotifications

final class AppDelegate: NSObject, NSApplicationDelegate,
                         UNUserNotificationCenterDelegate {

    func applicationDidFinishLaunching(_ notification: Notification) {
        UNUserNotificationCenter.current().delegate = self
        TaskNotification.registerCategories()
    }

    // Route the click to the exact screen that resolves it.
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse) async {
        let info = response.notification.request.content.userInfo
        guard let taskID = info["taskID"] as? String else { return }

        switch response.actionIdentifier {
        case TaskNotification.retryAction:
            await TaskStore.shared.retry(taskID)
        default:                                    // plain click
            NSApp.activate(ignoringOtherApps: true)
            Router.shared.open(.taskDetail(taskID))
        }
    }

    // Decide what happens if the app is frontmost when one arrives.
    // Default: show nothing. Menu bar / background-style apps usually
    // still want the banner; window apps showing that screen don't.
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification) async
                                -> UNNotificationPresentationOptions {
        [.banner, .sound]
    }
}

// SwiftUI wiring:
@main
struct MyApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    var body: some Scene { /* … */ }
}
```

Also clean up after yourself — when the user opens the screen a notification points at, remove it from Notification Center:

```swift
UNUserNotificationCenter.current()
    .removeDeliveredNotifications(withIdentifiers: [taskID])
```

## Settings pane

Give users per-type control inside the app, on top of the system switch:

```
Notifications
  Notify me when:
    [x] A run completes
    [x] A run fails or is blocked
    [ ] A daily summary is ready
  Notifications are disabled in System Settings.  Open Settings…   (only when denied)
```

Check the per-type toggles in your own `post()` path — `isAuthorized()` handles the system layer, these handle taste.

## Checklist

```
[ ] Permission requested at the moment of need, with a pre-explanation
[ ] Denied state visible in app Settings with a System Settings deep link
[ ] Delegate set in applicationDidFinishLaunching, categories registered
[ ] Every notification click opens the exact relevant screen
[ ] Failure notifications carry a recovery action (Retry / Show error)
[ ] Identifiers reused so state changes replace, not stack
[ ] threadIdentifier groups bursts; no notification-per-tick spam
[ ] Delivered notifications removed once the user has seen the thing
[ ] Per-type toggles in app Settings
```

## Manual test

1. Fresh install → trigger the notifying action → pre-explanation, then system prompt.
2. Background the app, finish a task → notification arrives; click → app opens on that task.
3. Fail a task → notification has Retry; Retry works without opening the app.
4. Deny permission in System Settings → app Settings shows the off state + working deep link.
5. Fire 5 task notifications → they stack as one group, latest state per task wins.
