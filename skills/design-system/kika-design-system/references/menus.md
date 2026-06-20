# Menus

KIKA's menus — both right-click context menus and the macOS main menu bar — are where the design system's "calm, no clutter" rule matters most. A menu is read at speed, so every element must earn its place.

## Core Rules

### 1. No subtitles

Never stack a primary label above a secondary description (`label` + `subtitle`). If more clarity is needed, rewrite the action so the label itself is unambiguous. Examples:

| Instead of                           | Use                                  |
|--------------------------------------|--------------------------------------|
| `Capture`  /  "Start a quick note"   | `Capture`  /  "Start a quick note" → `Quick Capture` |
| `Open`  /  "Open the capture window"| `Open`  /  "Open the capture window" → `Open Capture` |
| `Settings`  /  "Configure KIKA"      | `Settings`  /  "Configure KIKA" → just `Settings`     |

In SwiftUI this means avoiding `Button` rows that take both a title and a secondary string in the same row. The macOS `Menu` API in particular has **no subtitle slot by design** — keep it that way.

### 2. SF Symbols first, text second

For every menu, list the action and pick a symbol. If no fitting SF Symbol exists, use text. Never invent a Unicode glyph, never use an emoji, never use a custom asset when an SF Symbol will do.

- Symbol size: SF Symbol `.body` weight, `textSecondary` color (KIKA never colors menu icons with `accent`).
- Symbol width: reserve 18pt so labels line up across the menu.
- Symbol style: `.hierarchical` or `.monochrome`. Never `.multicolor`, never tinted with `accent`.

### 3. No visual clutter

- No dividers inside a single right-click menu unless it has 6+ items and natural grouping exists.
- No colored highlights beyond macOS's default selection color.
- No icons for items that take the user to another app (e.g. "Open in Finder", "Show in Mail"). Use text only for cross-app items.
- No badges, no dots, no new-item pings.
- No "About KIKA" inside a context menu. About lives in the main menu bar (see below).

## Right-Click Context Menus

Right-click menus should be **short** (3–7 items) and **action-only**. Grouping happens with whitespace, not dividers, when ≤ 4 items.

### Layout pattern

```
┌──────────────────────────────────┐
│ [icon] Quick Capture       ⌘⇧Space│
│ [icon] Open Capture…           ⌘O │
│ [icon] Search                  ⌘F │
├──────────────────────────────────┤   ← divider only at 5+ items
│ [icon] Copy                    ⌘C │
│ [icon] Paste                   ⌘V │
├──────────────────────────────────┤
│ [icon] Quit KIKA               ⌘Q │
└──────────────────────────────────┘
```

> `[icon]` is a placeholder for an SF Symbol rendered via `Image(systemName:)`. The canonical icon for each action is listed in the [Icon Catalog](#icon-catalog-common-menu-actions) below. The 18pt fixed-width icon gutter keeps labels vertically aligned.

### Per-row spec

- Height: system default (no `frame(height:)`)
- Icon: 14pt SF Symbol (`KikaFont.icon`), `theme.textSecondary`
- Label: 13pt regular SF Pro (`KikaFont.body`), `theme.textPrimary`
- Shortcut: right-aligned, 13pt regular, `theme.textTertiary`
- No subtitle line. No description. No badges.

### SwiftUI sketch

```swift
Menu {
    Button { captureNow() } label: {
        Label("Quick Capture", systemImage: "square.and.pencil")
    }
    .keyboardShortcut(" ", modifiers: [.command, .shift])

    Button { openCapture() } label: {
        Label("Open Capture…", systemImage: "macwindow")
    }
    .keyboardShortcut("o", modifiers: .command)

    Divider()  // only at 5+ items

    Button { search() } label: {
        Label("Search", systemImage: "magnifyingglass")
    }
    .keyboardShortcut("f", modifiers: .command)
} label: {
    Text("KIKA")
}
.menuStyle(.borderlessButton)
.fixedSize()
```

## Main Menu Bar (File / Edit / View)

The macOS main menu bar is part of the app's identity. KIKA keeps it minimal — only the menus that earn their slot, and only the items that earn their row. No "Help" if Help is empty. No "Window" if the app is single-window.

### Required menus

Only include these when the app actually has the corresponding feature:

| Menu      | Include only when                  | Typical items                                                |
|-----------|------------------------------------|--------------------------------------------------------------|
| `KIKA`    | Always (first menu, app name)      | About KIKA, Settings… (⌘,), Hide (⌘H), Quit (⌘Q)            |
| `File`    | App can open, save, or close docs  | New (⌘N), Open… (⌘O), Close (⌘W) — skip Save if no persistence |
| `Edit`    | App has selectable / editable text | Undo / Redo, Cut / Copy / Paste, Select All, Find…           |
| `View`    | App has multiple views or zoom     | Toggle Sidebar (⌘⌃S), Zoom In/Out, Enter Full Screen        |
| `Window`  | App has 2+ windows                 | Minimize, Zoom, Bring All to Front                           |
| `Help`    | App has docs, support, or shortcuts| Search, Release Notes, Contact Support                       |

If the app has none of a menu's typical items, **omit the menu entirely.** Empty menus are visual clutter.

### Item rules

- **No icons** in the main menu bar (macOS convention — system provides no slot, do not fake one).
- **Shortcuts right-aligned** in every row that has one. Unshortcutted items are still allowed; don't invent shortcuts for symmetry.
- **No "About KIKA" subtitle.** Use just `About KIKA`. The version number belongs in the About window, not the menu.
- **No "Preferences" alongside "Settings".** Pick one (`Settings…` for modern KIKA, with `⌘,`).
- **No "Services" submenu** unless the app actually provides services.

### KIKA menu — canonical order

```swift
CommandGroup(replacing: .appInfo) {  // "KIKA" / app menu
    Button("About KIKA") { showAbout() }
    Button("Settings…", action: openSettings)
        .keyboardShortcut(",", modifiers: .command)
}

CommandGroup(replacing: .appTermination) {
    Button("Hide KIKA", action: NSApp.hide)
        .keyboardShortcut("h", modifiers: .command)
    Button("Quit KIKA", action: NSApp.terminate)
        .keyboardShortcut("q", modifiers: .command)
}
```

## Status Item (Menu Bar Icon) in the macOS Menu Bar

KIKA's status item lives in the system menu bar. Apply the same calm rules:

- **One icon.** No text label next to it (let the user discover via click).
- Use the app's mark — a single SF Symbol, `template` rendering mode so it tints with system menu bar.
- Right-click = same `Menu { ... }` content as left-click. macOS handles it natively.
- **No badge counts.** No red dots. No "you have updates" pings.

```swift
let item = NSStatusBar.system.statusItem(withLength: .variableLength)
item.button?.image = NSImage(systemSymbolName: "circle.hexagongrid", accessibilityDescription: "KIKA")
item.button?.imagePosition = .imageOnly
item.menu = appMenu  // single Menu() instance shared by left and right click
```

## Icon Catalog (Common Menu Actions)

Use these SF Symbols consistently across all of KIKA. Don't invent alternatives.

| Action                | Symbol                       |
|-----------------------|------------------------------|
| Quick Capture / New   | `square.and.pencil`          |
| Open                  | `macwindow`                  |
| Open in Finder        | `folder`                     |
| Search                | `magnifyingglass`            |
| Copy                  | `doc.on.doc`                 |
| Paste                 | `doc.on.clipboard`           |
| Cut                   | `scissors`                   |
| Undo                  | `arrow.uturn.backward`       |
| Redo                  | `arrow.uturn.forward`        |
| Settings              | `gearshape`                  |
| Quit                  | `power`                      |
| Hide                  | `eye.slash`                  |
| Refresh / Sync        | `arrow.clockwise`            |
| Delete                | `trash`                      |
| Pin / Unpin           | `pin` / `pin.slash`          |
| Lock                  | `lock`                       |
| Export                | `square.and.arrow.up`        |
| Import                | `square.and.arrow.down`      |
| Help                  | `questionmark.circle`        |
| About                 | `info.circle`                |

## Anti-Patterns

- ❌ Two-line menu items with `Label` stacked on a description
- ❌ Colored menu icons (no `accent` tint, no multicolor symbols)
- ❌ "About KIKA  ⏤  Version 1.0" in the menu
- ❌ Empty menus (no items under a header)
- ❌ A divider between every item
- ❌ Emoji in a menu — never
- ❌ Trailing ellipsis on items that don't actually open a sheet (`Copy…` is wrong, `Copy` is right)
- ❌ "Preferences" and "Settings" both in the same app — pick one
- ❌ "Help" menu with only "About" inside it — move About to the KIKA menu
