---
name: macos-clipboard-pasteboard
description: Use when reading, writing, or watching the macOS clipboard — NSPasteboard types and multiple representations, the changeCount polling pattern, the transient/concealed pasteboard conventions clipboard tools must respect, and the Sequoia paste-privacy alerts.
---

# macOS Clipboard & Pasteboard

Work with `NSPasteboard` correctly: write rich content with plain-text fallbacks, watch for changes the only way macOS allows (polling `changeCount`), and — if you're building anything clipboard-manager-shaped — respect the concealed/transient conventions that keep passwords out of your history.

## When to use

Use this skill when the user says:

- clipboard / pasteboard / `NSPasteboard`
- copy / paste programmatically
- clipboard history / clipboard manager
- watch the clipboard / detect copy
- paste as plain text
- custom pasteboard type / drag-and-drop data type
- clipboard privacy / "app pasted from" alert

Do not use this skill for iOS (`UIPasteboard` differs in important ways), or for drag-and-drop *UI* mechanics (`onDrag`/`Transferable` view wiring) beyond the data-type layer.

## Core rule

```
Write every flavor the receiver might want, richest first.
Read by asking for the best type you can handle.
Never clobber, log, or upload the user's clipboard —
and never store what a password manager marked concealed.
```

## Writing

Always `clearContents()` first — it claims ownership and bumps `changeCount`. Then declare the richest set of representations you have:

```swift
import AppKit

// Simple string
let pb = NSPasteboard.general
pb.clearContents()
pb.setString("hello", forType: .string)

// Rich content with fallbacks: receivers pick the best they support.
// One NSPasteboardItem = one logical thing with multiple flavors.
let item = NSPasteboardItem()
item.setString(htmlString, forType: .html)
item.setString(plainString, forType: .string)     // the fallback that
pb.clearContents()                                //  makes TextEdit,
pb.writeObjects([item])                           //  terminals etc. work

// Files
pb.clearContents()
pb.writeObjects([fileURL as NSURL])

// Multiple files = multiple items, not one item with many flavors
pb.writeObjects(urls as [NSURL])
```

The classic bug is writing *only* HTML or *only* a custom type: paste then silently does nothing in half the apps on the system. Plain `.string` rides along with almost everything.

### Custom types

Namespace them like a UTI and add them *alongside* standard flavors:

```swift
extension NSPasteboard.PasteboardType {
    static let taskItem = NSPasteboard.PasteboardType("com.example.myapp.task")
}

let item = NSPasteboardItem()
item.setData(try JSONEncoder().encode(task), forType: .taskItem)  // full fidelity
item.setString(task.title, forType: .string)                      // world-readable
```

Your own app pastes with full fidelity; everyone else gets sensible text.

## Reading

```swift
let pb = NSPasteboard.general

// Best-type reading: order = your preference
if let types = pb.types {
    if types.contains(.fileURL),
       let urls = pb.readObjects(forClasses: [NSURL.self]) as? [URL] {
        handle(files: urls)
    } else if let s = pb.string(forType: .string) {
        handle(text: s)
    }
}

// Cheap capability check before enabling a Paste button:
let canPaste = pb.canReadObject(forClasses: [NSURL.self, NSString.self],
                                options: nil)
```

Read the pasteboard **only on user intent** — a paste command, a button, a drop. Reading on timers or at launch is what triggers the privacy alerts below, and it's the behavior they were designed to shame.

## Watching for changes — changeCount polling

There is no notification for pasteboard changes on macOS. The sanctioned pattern is polling `changeCount` — an integer that increments on every ownership change:

```swift
@MainActor
final class PasteboardWatcher {
    private var timer: Timer?
    private var lastCount = NSPasteboard.general.changeCount
    private let onChange: (NSPasteboard) -> Void

    init(onChange: @escaping (NSPasteboard) -> Void) {
        self.onChange = onChange
    }

    func start(interval: TimeInterval = 0.5) {
        stop()
        timer = Timer.scheduledTimer(withTimeInterval: interval,
                                     repeats: true) { [weak self] _ in
            guard let self else { return }
            let pb = NSPasteboard.general
            guard pb.changeCount != self.lastCount else { return }
            self.lastCount = pb.changeCount
            self.onChange(pb)
        }
        timer?.tolerance = interval / 2   // let the system coalesce wakeups
    }

    func stop() {
        timer?.invalidate()
        timer = nil
    }
}
```

- 0.5s is plenty; nobody notices half a second of clipboard-history lag, and `tolerance` keeps it off the battery's back.
- Compare `changeCount` only — don't read contents to detect change.
- Stop the watcher when the feature is off. An always-on reader is exactly what the OS now warns users about.

## The clipboard-manager conventions

Any tool that *stores* clipboard contents must honor the de-facto `org.nspasteboard` marker types (password managers write them; well-behaved history tools read them):

```swift
extension NSPasteboard.PasteboardType {
    /// Passwords, secrets — never store, never display
    static let concealed = NSPasteboard.PasteboardType("org.nspasteboard.ConcealedType")
    /// Ephemeral by intent (e.g. a "paste once" item) — don't keep
    static let transient = NSPasteboard.PasteboardType("org.nspasteboard.TransientType")
    /// Machine-generated (linters, formatters) — usually skip in history
    static let autoGenerated = NSPasteboard.PasteboardType("org.nspasteboard.AutoGeneratedType")
}

func shouldStore(_ pb: NSPasteboard) -> Bool {
    guard let types = pb.types else { return false }
    return !types.contains(.concealed) && !types.contains(.transient)
}
```

And the mirror image: if *your* app copies something secret (a generated token, a recovery code), mark it concealed so other tools skip it:

```swift
let item = NSPasteboardItem()
item.setString(secret, forType: .string)
item.setString("", forType: .concealed)   // presence is the signal
pb.clearContents()
pb.writeObjects([item])
```

## Sequoia paste privacy

Since macOS 15.x, reading `NSPasteboard.general` **without user intent** can surface a system alert — "*AppName* pasted from *OtherApp*" — and a per-app clipboard setting exists under Privacy & Security. Consequences:

- Read only inside user-intent code paths (paste command, drop handler, explicit button). Never probe contents at launch "to see what's there".
- Use `canReadObject(forClasses:)` / inspect `types` for UI enablement — checking *types* is not reading *contents*.
- A clipboard-history feature is by definition intent-less reading: make it opt-in, explain it at enable time ("reads everything you copy, stores it only on this Mac"), and expect the system to tell the user you're doing it.

## Don't clobber the user's clipboard

"Copy to clipboard" features are fine. But automation that pastes *through* the clipboard (type-for-the-user tools) must save and restore:

```swift
// Snapshot → do your programmatic paste → restore
let saved = pb.pasteboardItems?.map { old -> NSPasteboardItem in
    let copy = NSPasteboardItem()
    for type in old.types {
        if let data = old.data(forType: type) {
            copy.setData(data, forType: type)
        }
    }
    return copy
} ?? []
// … write payload, send ⌘V …
pb.clearContents()
pb.writeObjects(saved)
```

Restore after a short delay (the receiving app must read the payload first). Losing what the user had copied is one of the fastest ways to make them delete your app.

## Checklist

```
[ ] Writes include a plain .string fallback next to rich/custom flavors
[ ] clearContents() before every write
[ ] Reads happen on user intent only (paste/drop/button), never on timers
[ ] Watching uses changeCount polling with tolerance, and stops when off
[ ] History/storage honors ConcealedType and TransientType
[ ] Own secrets are written with the concealed marker
[ ] Programmatic paste-through saves and restores the user's clipboard
[ ] Nothing from the clipboard is logged, synced, or uploaded
```

## Manual test

1. Copy from your app → paste into TextEdit, a terminal, and Mail — all three produce something sensible.
2. Copy a password from a password manager → your history feature does not record it.
3. Enable watching → copy elsewhere → change picked up within ~1s; disable → polling stops (check with a breakpoint).
4. On macOS 15+: confirm normal use never triggers the "pasted from" alert outside genuine paste actions.
5. Paste-through automation: copy something first, run the feature, press ⌘V afterwards → your original copy is back.
