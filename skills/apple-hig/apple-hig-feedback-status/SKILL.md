---
name: apple-hig-feedback-status
description: Use when designing or implementing feedback, status, progress, alerts, errors, success states, and live activity indicators in Apple-platform apps — inline status, banners, alerts, notifications, and loading states.
---

# Apple HIG Feedback Status

Use this skill when designing or implementing feedback, status, progress, alerts, errors, success states, and live activity indicators in Apple-platform apps. It covers running states, task progress, model status, local server status, notifications, toasts, banners, inline errors, loading states, and completion feedback.

## Core rule

```
Always tell the user what is happening, what changed, and whether they need to act.
```

## Status vocabulary

Use consistent states:

```
Idle
Thinking
Running
Waiting
Blocked
Needs Review
Completed
Failed
Offline
Paused
Cancelled
```

## When to use this skill

Use for:

- Agent is working
- Task finished
- Task failed
- Ollama not running
- API key missing
- Permission denied
- File operation succeeded
- File operation failed
- Syncing
- Saving
- Loading
- Waiting for user input

## Feedback levels

### 1. Inline status

Use for local state near content.

```
Running
Saved
Waiting for model
```

### 2. Banner

Use for screen-level issues.

```
Ollama is offline. Local models are unavailable.
[Retry] [Settings]
```

### 3. Alert/dialog

Use for destructive actions, permission issues, or blocking errors.

### 4. Notification

Use when work completes while user is elsewhere.

### 5. Progress indicator

Use when time or steps matter.

## Agent status map

```
Idle        moon                  No current work
Thinking    brain                 Planning or reasoning
Running     bolt.circle           Executing a task
Waiting     clock                 Waiting for input/service
Blocked     xmark.octagon         Cannot continue without action
Needs Review checkmark.seal       User should inspect result
Completed   checkmark.circle      Finished successfully
Failed      exclamationmark.triangle Failed with error
Offline     wifi.slash            Required service unavailable
Paused      pause.circle          Temporarily stopped
Cancelled   xmark.circle          Stopped by user
```

Pair symbols with text. Do not rely on color alone.

## Loading state rules

Use loading indicators only when something is actually happening.

Good:

```
Checking Ollama connection…
Generating report…
Indexing project files…
Waiting for agent response…
```

Bad:

```
Loading…
Please wait…
Working magic…
```

## Progress rules

Use determinate progress only when you know the total.

```swift
ProgressView(value: completed, total: total)
```

Use indeterminate progress when the duration is unknown.

```swift
ProgressView("Generating report…")
```

Avoid fake percentages.

```
Do not show 73% if the app does not actually know progress.
```

For agent work, prefer step labels over fake percent:

```
Planning task
Editing files
Running checks
Waiting for result
Ready for review
```

## Running indicator

For your app, use a subtle pulse when the agent is active.

Rules:

- Pulse should be calm.
- Do not blink aggressively.
- Do not animate everything.
- Pair pulse with text like “Running” or “Thinking”.
- Respect reduced motion.

SwiftUI reduced motion:

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion
```

## Success feedback

Use short confirmation.

```
Task created
Report exported
Skill validated
Project opened
Settings saved
```

Avoid dramatic success messages.

## Error feedback

Good error message structure:

```
What failed
Why it may have failed
What to do next
```

Example:

```
Ollama Not Running
The app could not connect to http://127.0.0.1:11434.
Start Ollama, then retry.
[Retry] [Open Settings]
```

## SwiftUI status chip

```swift
struct StatusChip: View {
    let title: String
    let symbol: String

    var body: some View {
        Label(title, systemImage: symbol)
            .font(.caption)
            .foregroundStyle(.secondary)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(.quaternary, in: Capsule())
            .accessibilityLabel(title)
    }
}
```

## Banner pattern

```swift
struct StatusBanner: View {
    let title: String
    let message: String
    let symbol: String
    let actionTitle: String?
    let action: (() -> Void)?

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: symbol)
                .foregroundStyle(.secondary)

            VStack(alignment: .leading, spacing: 4) {
                Text(title).font(.headline)
                Text(message).font(.callout).foregroundStyle(.secondary)
            }

            Spacer()

            if let actionTitle, let action {
                Button(actionTitle, action: action)
            }
        }
        .padding(12)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
    }
}
```

## Alert pattern

Use alerts for blocking or dangerous operations.

```swift
.alert("Delete Project?", isPresented: $showDeleteAlert) {
    Button("Delete", role: .destructive) {
        deleteProject()
    }
    Button("Cancel", role: .cancel) {}
} message: {
    Text("This removes the project from the app. Files on disk will not be deleted.")
}
```

## Notifications

Use notifications for background completion:

```
Agent finished the task
Report is ready
Run failed and needs attention
```

Do not notify for every minor state change.

## Review checklist

```
[ ] Every async operation has visible feedback
[ ] No fake progress percentages
[ ] Agent states use consistent vocabulary
[ ] Running/thinking states are clear
[ ] Success messages are short
[ ] Errors explain recovery
[ ] Destructive actions require confirmation
[ ] Offline/service errors offer retry/settings
[ ] Reduced motion is respected
[ ] Status does not rely on color alone
```

## Common mistakes

```
❌ Fake progress
❌ Blinking aggressive indicators
❌ Silent failure
❌ Vague “Something went wrong”
❌ Success messages that stay forever
❌ Too many notifications
❌ Color-only status
❌ No retry action
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-feedback-status skill to add clear status and feedback.

Rules:
- Use consistent state vocabulary.
- Show inline status for local state.
- Use banners for screen-level issues.
- Use alerts for destructive/blocking actions.
- Use notifications only for background completion or failure.
- Do not use fake percentages.
- Prefer step labels for agent work.
- Pair symbols with text.
- Respect reduced motion.
- Add retry/settings actions for offline/service errors.

After coding:
1. List statuses added.
2. Explain loading/progress behavior.
3. Explain error recovery.
4. Explain notification behavior.
5. Give manual test steps.
```
