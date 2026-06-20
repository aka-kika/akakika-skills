---
name: apple-hig-sf-symbols
description: Use when choosing, reviewing, or implementing SF Symbols in an Apple-platform app — picking meaningful symbols, keeping the same concept on the same symbol everywhere, and handling variants, rendering modes, and accessibility.
---

# Apple HIG SF Symbols

Pick and review SF Symbols so every icon carries meaning, the same concept always uses the same symbol, and icon-only controls stay accessible. Reach for this when working on sidebar icons, toolbar icons, tab bars, buttons, menus, empty states, status indicators, inspectors, settings screens, command palettes, custom symbol review, and accessibility cleanup.

## Core rule

```
SF Symbols are meaning tools, not decoration.
```

Every symbol must help the user understand:

```
What is this?
What does it do?
What state is it in?
Where will this take me?
```

If a symbol does not make the interface clearer, remove it.

## Relationship to other skills

```
Sidebar = navigation symbols
Toolbar = action symbols
Inspector = property/detail symbols
Command palette = command/category symbols
Status areas = state symbols
```

## Principles

### 1. Prefer system symbols before custom icons

Use Apple-provided SF Symbols first.

```swift
Image(systemName: "folder")
Image(systemName: "sparkles")
Image(systemName: "gearshape")
Image(systemName: "sidebar.left")
Image(systemName: "magnifyingglass")
```

Only use custom icons when the concept does not exist in SF Symbols or the app has a strong brand-specific object.

### 2. Pair symbols with text when meaning is not obvious

Preferred:

```swift
Label("Projects", systemImage: "folder")
Label("New Skill", systemImage: "sparkles")
Label("Settings", systemImage: "gearshape")
```

Risky:

```swift
Image(systemName: "sparkles")
```

Icon-only buttons are acceptable only when the action is familiar, the context is clear, and the button has an accessibility label.

### 3. Use symbols consistently

The same concept should use the same symbol everywhere.

Good:

```
Projects = folder
Skills = sparkles
Prompts = text.badge.star
Memory = brain
Reports = chart.bar.doc.horizontal
Settings = gearshape
```

Bad:

```
Projects = folder in sidebar
Projects = square.grid.2x2 in toolbar
Projects = tray in command palette
```

### 4. Choose by meaning, not aesthetics

Clear beats cool.

Good:

```
New Project → folder.badge.plus
Search → magnifyingglass
Settings → gearshape
Delete → trash
Archive → archivebox
Export → square.and.arrow.up
Import → square.and.arrow.down
```

Avoid ambiguous choices:

```
Search → eye
Settings → slider.horizontal.3
Delete → xmark.circle
Export → paperplane
```

## Navigation symbol vocabulary

```
Home              house
Active Runs       bolt.circle
Queue             list.bullet.rectangle
Projects          folder
Tasks             checkmark.circle
Skills            sparkles
Prompts           text.badge.star
Files             doc
Memory            brain
Notes             note.text
Decisions         checkmark.seal
Reports           chart.bar.doc.horizontal
Settings          gearshape
```

Navigation symbols should not look like temporary actions.

Avoid for navigation:

```
plus
trash
pencil
arrow.up
arrow.down
checkmark
xmark
```

## Toolbar action symbol vocabulary

```
New               plus
New Project       folder.badge.plus
New Note          note.text.badge.plus
Search            magnifyingglass
Filter            line.3.horizontal.decrease.circle
Sort              arrow.up.arrow.down
Share             square.and.arrow.up
Import            square.and.arrow.down
Export            square.and.arrow.up
Refresh           arrow.clockwise
Retry             arrow.counterclockwise
Stop              stop.circle
Pause             pause.circle
Resume            play.circle
Inspector         sidebar.right
More              ellipsis.circle
Command Palette   command
Delete            trash
Archive           archivebox
Copy              doc.on.doc
Edit              pencil
Duplicate         plus.square.on.square
Reveal in Finder  folder
```

## Status symbol vocabulary

```
Idle              moon
Running           bolt.circle
Thinking          brain
Waiting           clock
Completed         checkmark.circle
Failed            exclamationmark.triangle
Warning           exclamationmark.triangle
Blocked           xmark.octagon
Online            circle.fill
Offline           wifi.slash
Synced            checkmark.icloud
Syncing           arrow.triangle.2.circlepath
Private           lock.shield
Local             internaldrive
Cloud             cloud
```

Status symbols should be paired with text. Never rely on color alone.

## Variant rules

```
.fill    = selected or active state
.slash   = unavailable/off state
.badge   = compound action or meaning
.circle  = contained toolbar/status control
.square  = contained grid/control variant
```

Examples:

```
Unselected home: house
Selected home:   house.fill
Offline:         wifi.slash
New project:     folder.badge.plus
More:            ellipsis.circle
```

Do not use fill everywhere just because it looks stronger.

## Rendering modes

```
Monochrome   = default for sidebar, toolbar, menus, lists
Hierarchical = empty states, larger calm illustrations, inspector headers
Palette      = status/warning symbols only when parts need separate colors
Multicolor   = only when built-in colors add meaning
Gradients    = avoid in productivity UI except maybe hero/empty states
```

For calm productivity apps:

```
Default: monochrome
Exception: hierarchical for large empty states
Avoid: random multicolor/gradient symbols
```

## SwiftUI patterns

```swift
// Preferred navigation row
Label("Projects", systemImage: "folder")

// Preferred toolbar action
Button {
    createProject()
} label: {
    Label("New Project", systemImage: "folder.badge.plus")
}

// Icon-only button with accessibility
Button {
    openCommandPalette()
} label: {
    Image(systemName: "command")
}
.accessibilityLabel("Open Command Palette")

// Decorative symbol
Image(systemName: "sparkles")
    .accessibilityHidden(true)

// Selected/unselected variant
Label(
    "Home",
    systemImage: isSelected ? "house.fill" : "house"
)

// Empty state
ContentUnavailableView(
    "No Projects",
    systemImage: "folder",
    description: Text("Create a project to get started.")
)
```

## Accessibility rules

Every symbol-only control needs an accessibility label.

Good:

```swift
Button {
    createProject()
} label: {
    Image(systemName: "plus")
}
.accessibilityLabel("New Project")
```

Better:

```swift
Button {
    createProject()
} label: {
    Label("New Project", systemImage: "folder.badge.plus")
}
```

Decorative symbols should be hidden from accessibility:

```swift
Image(systemName: "sparkles")
    .accessibilityHidden(true)
```

## RTL and localization notes

Rules:

```
- Avoid English-letter symbols unless necessary.
- Be careful with arrows in right-to-left layouts.
- Test Hebrew/Arabic UI if the app supports RTL.
- Prefer semantic symbols over text-like symbols.
```

RTL-sensitive symbols:

```
chevron.left
chevron.right
arrow.left
arrow.right
sidebar.left
sidebar.right
```

## Review checklist

```
[ ] Every symbol communicates clear meaning
[ ] Same concept uses same symbol everywhere
[ ] Navigation symbols are different from action symbols
[ ] Symbols are paired with text where needed
[ ] Icon-only controls have accessibility labels
[ ] Decorative icons are accessibility hidden
[ ] Status symbols are paired with text
[ ] Color is not the only state indicator
[ ] Rendering mode is consistent
[ ] Fill/slash/badge variants clarify meaning
[ ] Symbols are readable at actual size
[ ] Symbols do not overpower text
[ ] RTL/localization issues are considered
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the apple-hig-sf-symbols skill to clean up all iconography.

Rules:
- Prefer SF Symbols over custom icons.
- Symbols must communicate meaning.
- Use the same symbol for the same concept everywhere.
- Use Label(title, systemImage:) when possible.
- Add accessibility labels to icon-only controls.
- Hide decorative symbols from accessibility.
- Navigation symbols belong in sidebars/tabs.
- Action symbols belong in toolbars/menus/buttons.
- Status symbols must be paired with text.
- Use monochrome by default.
- Avoid multicolor/gradients unless they add meaning.
- Check compact sizes and RTL/localization concerns.

Before coding:
1. Search for all Image(systemName:) usage.
2. Search for all Label(... systemImage:) usage.
3. Create a current symbol map.
4. Identify confusing or inconsistent symbols.
5. Propose a clean symbol vocabulary.

After coding:
1. List files changed.
2. List symbols replaced.
3. Explain why each replacement was made.
4. Show final symbol vocabulary.
5. Include manual test steps.
```

## Quality bar

```
Symbols make the app faster to scan.
They clarify meaning without adding visual noise.
They feel native, consistent, and accessible.
```
