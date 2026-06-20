---
name: agent-state-machine
description: Use when designing or implementing states for AI agent tasks, background jobs, local model runs, queues, and notifications — one shared set of states, only legal transitions, and a recovery path out of every failure.
---

# Agent State Machine

Model every agent / task / run with **one shared state machine**: a fixed set of states, only the transitions that are legal between them, and a recovery path out of every failure or wait. This kills the most common agent-UX bug — random status strings invented per screen.

## When to use

- Active runs, task queues, AI generation, local model jobs
- Agent progress, notifications, error recovery
- Retry / stop / cancel behavior and "needs review" states

## Core rule

Agent UX needs clear **states**, legal **transitions**, and **recovery** paths. Do not invent random labels per screen.

## State vocabulary

```
Draft
Queued
Starting
Thinking
Running
Waiting
Blocked
Paused
Cancelling
Cancelled
Failed
Completed
Needs Review
Archived
```

## State meanings

```
Draft        Created but not ready to run
Queued       Ready and waiting
Starting     Preparing environment/model/files
Thinking     Planning/reasoning before action
Running      Executing work
Waiting      Waiting for external service/user/system
Blocked      Cannot continue without user action
Paused       Temporarily stopped, can resume
Cancelling   Stop requested, cleanup in progress
Cancelled    Stopped by user/system
Failed       Ended with error
Completed    Finished successfully
Needs Review User should inspect result
Archived     Hidden from active workflow
```

## Legal transitions

```
Draft → Queued
Queued → Starting
Starting → Thinking
Thinking → Running
Running → Waiting
Waiting → Running
Running → Needs Review
Running → Completed
Running → Failed
Running → Blocked
Running → Cancelling
Cancelling → Cancelled
Failed → Queued
Blocked → Queued
Needs Review → Archived
Completed → Archived
Paused → Running
```

Avoid impossible transitions unless explicitly handled.

## Reference implementation

Swift shown below, but the pattern is language-agnostic — one enum, one validator.

```swift
enum AgentRunState: String, Codable, CaseIterable, Hashable {
    case draft
    case queued
    case starting
    case thinking
    case running
    case waiting
    case blocked
    case paused
    case cancelling
    case cancelled
    case failed
    case completed
    case needsReview
    case archived

    var title: String {
        switch self {
        case .draft: "Draft"
        case .queued: "Queued"
        case .starting: "Starting"
        case .thinking: "Thinking"
        case .running: "Running"
        case .waiting: "Waiting"
        case .blocked: "Blocked"
        case .paused: "Paused"
        case .cancelling: "Cancelling"
        case .cancelled: "Cancelled"
        case .failed: "Failed"
        case .completed: "Completed"
        case .needsReview: "Needs Review"
        case .archived: "Archived"
        }
    }

    var symbol: String {
        switch self {
        case .draft: "doc"
        case .queued: "list.bullet.rectangle"
        case .starting: "play.circle"
        case .thinking: "brain"
        case .running: "bolt.circle"
        case .waiting: "clock"
        case .blocked: "xmark.octagon"
        case .paused: "pause.circle"
        case .cancelling: "xmark.circle"
        case .cancelled: "xmark.circle"
        case .failed: "exclamationmark.triangle"
        case .completed: "checkmark.circle"
        case .needsReview: "checkmark.seal"
        case .archived: "archivebox"
        }
    }
}
```

State transition validator:

```swift
extension AgentRunState {
    func canTransition(to next: AgentRunState) -> Bool {
        switch (self, next) {
        case (.draft, .queued),
             (.queued, .starting),
             (.starting, .thinking),
             (.thinking, .running),
             (.running, .waiting),
             (.waiting, .running),
             (.running, .needsReview),
             (.running, .completed),
             (.running, .failed),
             (.running, .blocked),
             (.running, .cancelling),
             (.cancelling, .cancelled),
             (.failed, .queued),
             (.blocked, .queued),
             (.needsReview, .archived),
             (.completed, .archived),
             (.paused, .running):
            return true
        default:
            return false
        }
    }
}
```

## User-facing actions per state

```
Draft: Edit, Queue, Delete
Queued: Run Now, Remove from Queue, Edit
Starting: Cancel
Thinking: Cancel
Running: Stop, Open Logs
Waiting: Retry, Cancel, Open Settings if service issue
Blocked: Resolve, Retry, Cancel
Paused: Resume, Cancel
Failed: Retry, View Error, Archive
Completed: Review, Archive, Run Again
Needs Review: Review, Approve, Archive
Archived: Restore
```

## Notifications per state

Notify only for:

```
Completed
Failed
Blocked
Needs Review
```

Do not notify for every transition.

## Progress rules

Use real progress only when measurable. For agent tasks, prefer step labels over a fake bar:

```
Planning
Editing files
Running checks
Summarizing changes
Waiting for review
```

Avoid fake percentages.

## Persistence fields

Each run should store:

```
id
title
projectId
state
createdAt
startedAt
updatedAt
completedAt
model
provider
currentStep
errorMessage
outputSummary
outputPath
retryCount
```

## Recovery rules

Every failed / blocked / waiting state needs a way out.

```
Failed → show error + Retry
Blocked → show what the user must fix
Waiting → show what service/input is missing
Offline → open settings / retry
```

## Review checklist

```
[ ] Uses one shared state enum
[ ] States have clear user-facing titles
[ ] States have consistent icons
[ ] Illegal transitions are prevented or handled
[ ] Failed/blocked/waiting states have recovery
[ ] Notifications fire only for important states
[ ] No fake progress percentages
[ ] Needs Review exists before archive/done
[ ] Retry behavior is defined
[ ] Cancel/stop behavior is defined
```

## Common mistakes

```
Random status strings across files
Done/failed only, no waiting/blocked/review
No transition rules
No recovery actions
Notification spam
Fake progress
Cancelling instantly becomes cancelled without cleanup
Completed work disappears before review
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the agent-state-machine skill to implement or clean up agent/task/run states.

Rules:
- Use a single shared state enum.
- Use clear user-facing titles and consistent icons.
- Define legal transitions and prevent or handle illegal ones.
- Add user-facing actions per state.
- Add recovery for failed, blocked, waiting, and offline states.
- Notify only for completed, failed, blocked, and needs-review.
- Avoid fake progress percentages.
- Store enough run metadata for review and retry.

After coding:
1. List states added/changed.
2. Explain transition rules.
3. Explain actions per state.
4. Explain notification behavior.
5. Give manual test steps.
```
