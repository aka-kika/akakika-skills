---
name: apple-hig-typography
description: Use when designing, reviewing, or implementing typography in Apple-platform apps — SwiftUI text styles, hierarchy, readable sizes, monospaced data, custom fonts, labels, captions, and accessibility.
---

# Apple HIG Typography

Apply system text styles, a small hierarchy, and accessible sizing to typography in Apple-platform apps. Reach for it when cleaning up fonts, building readable dashboards or popovers, or reviewing custom-font and accessibility decisions.

## Purpose

Use this skill when designing, reviewing, or implementing typography in Apple-platform apps.

Use for SwiftUI text styles, macOS typography, iOS typography, hierarchy, readable sizes, monospaced data, custom font decisions, labels, captions, metadata, and accessibility.

## Core rule

```
Use system text styles first. Customize only when the product needs it.
```

Typography should make the interface easier to scan, not more decorative.

## When to use this skill

Use this skill for:

- Typography cleanup
- Font hierarchy
- Dashboard readability
- Menu bar popover text
- Settings text
- Inspector labels
- Metadata text
- Code/terminal-style UI
- Custom font review
- Accessibility text review

## When not to use this skill

Do not use this skill for:

- Icon choice; use `apple-hig-sf-symbols`
- Spacing/layout only; use `apple-hig-layout`
- Sidebar structure; use `apple-hig-sidebars`
- Marketing landing pages unless they are inside an Apple app

## Apple typography principles

### 1. Prefer system text styles

Use SwiftUI styles instead of hardcoded sizes where possible.

```swift
Text("Title")
    .font(.title2)

Text("Body text")
    .font(.body)

Text("Metadata")
    .font(.caption)
    .foregroundStyle(.secondary)
```

### 2. Use a small hierarchy

Most screens need only three levels:

```
Primary:   title / headline
Secondary: body / callout
Tertiary:  caption / metadata
```

Avoid using too many sizes on one screen.

### 3. Use weight carefully

Good UI weights:

```
Regular
Medium
Semibold
Bold
```

Avoid very thin weights for functional UI.

### 4. Use color less than hierarchy

Prefer hierarchy from size, weight, spacing, and grouping before color.

Good:

```swift
Text("Last updated 2 min ago")
    .font(.caption)
    .foregroundStyle(.secondary)
```

Bad:

```swift
Text("Last updated 2 min ago")
    .font(.caption)
    .foregroundStyle(.blue)
```

unless blue communicates an action or link.

## Recommended SwiftUI text styles

```
.largeTitle  = rare hero/screen title
.title       = main title
.title2      = major section title
.title3      = compact title
.headline    = row/card heading
.body        = default readable text
.callout     = secondary body or compact explanation
.subheadline = supporting label
.footnote    = fine print
.caption     = metadata, badges, timestamps
.caption2    = avoid unless space is very tight
```

Rule:

```
Do not use the smallest text style just to fit too much content. Reduce content instead.
```

## macOS practical guidance

For macOS productivity UI:

```
Window title / screen title: .title2 or .title3
Card title: .headline
Row title: .body or .headline
Row subtitle: .callout or .subheadline
Metadata: .caption
Tiny helper text: .footnote or .caption
```

Avoid body text below comfortable legibility. For dense macOS UI, `.caption` is acceptable for metadata, but not for primary content.

## Menu bar popover typography

Recommended:

```
Header title: .headline or .title3
Status: .caption or .callout
Primary action: .body or .headline
List row title: .body
List row subtitle: .caption
Footer: .caption
```

Rules:

```
- Keep labels short
- Avoid paragraphs in popovers
- Prefer 1-line row titles
- Use captions only for metadata
- Do not use huge hero type in small popovers
```

## Inspector typography

Recommended:

```
Inspector section label: .caption, secondary, uppercase optional
Field label: .callout, secondary
Field value: .callout or .body
Path/ID: .caption, monospaced if helpful
```

Example:

```swift
HStack {
    Text("Status")
        .font(.callout)
        .foregroundStyle(.secondary)

    Spacer()

    Text("Running")
        .font(.callout)
}
```

## Dashboard typography

Dashboards should be calm and scannable.

Rules:

```
- Do not use huge numbers unless the number is the main decision point.
- Avoid too many equal-size metrics.
- Use captions for labels and body/headline for values.
- Use monospaced digits for changing numbers.
- Use one main visual emphasis per card.
```

## Monospaced text

Use monospaced digits for changing numeric values.

```swift
Text("00:42")
    .font(.body.monospacedDigit())

Text("128 tasks")
    .font(.body.monospacedDigit())
```

Use monospaced fonts for:

```
Code
Logs
Terminal output
Paths
IDs
Timers
Counters
Token counts
```

Example:

```swift
Text(filePath)
    .font(.system(.caption, design: .monospaced))
    .textSelection(.enabled)
```

## Custom font rules

Use custom fonts only when they serve the product.

Good uses:

```
Brand-heavy marketing screen
Terminal/code UI
Distinctive hero title
Numerical dashboard style
```

Bad uses:

```
Every small label
Settings forms
Inspector fields
Dense data tables
Accessibility-critical UI
```

When using custom fonts:

```swift
Text("Terminal")
    .font(.custom("JetBrainsMono-Regular", size: 13, relativeTo: .body))
```

Prefer `relativeTo:` when cross-platform accessibility scaling matters.

## Brand font conventions

Use only when building brand-specific apps, not generic Apple HIG work.

```
SF Pro / system font = default app UI
SF Mono or JetBrains Mono = terminal/log/code surfaces
Brand display font = marketing/brand headlines only
Avoid custom fonts in dense settings and inspector screens
```

## Line length

Readable text should not be too wide.

```
Short UI labels: no issue
Long body text: target roughly 50–75 characters per line
Popover text: keep very short; do not use long paragraphs
```

SwiftUI cap:

```swift
Text(longText)
    .frame(maxWidth: 420, alignment: .leading)
    .fixedSize(horizontal: false, vertical: true)
```

## SF Symbols with text

Symbols should match surrounding text size and weight.

Good:

```swift
Label("Settings", systemImage: "gearshape")
    .font(.body)
```

Avoid overpowering labels:

```swift
HStack {
    Image(systemName: "gearshape")
        .font(.system(size: 28, weight: .bold))
    Text("Settings")
        .font(.caption)
}
```

## Accessibility rules

```
- Do not use tiny text for important content
- Do not rely on color alone
- Keep contrast strong enough
- Let system text styles handle scaling where possible
- Avoid thin weights
- Keep labels clear and literal
- Make paths/IDs selectable if users need to copy them
```

## Review checklist

```
[ ] System text styles are used by default
[ ] Screen has no more than 3 major type levels
[ ] Primary content is readable
[ ] Metadata is visually secondary
[ ] Captions are not used for essential content
[ ] Weights are not too thin
[ ] Changing numbers use monospaced digits
[ ] Long text has a readable line length
[ ] Custom fonts are justified
[ ] Symbols match text size and weight
[ ] Accessibility and contrast are preserved
```

## Common mistakes

```
Hardcoding every font size
Too many type sizes on one screen
Huge headings in small popovers
Captions used for important text
Thin weights in low contrast UI
Random custom fonts everywhere
Monospaced font used for normal paragraphs
Changing numbers jitter because digits are proportional
Icons overpower text
Color used instead of hierarchy
```

## Prompt template

```
Use the apple-hig-typography skill to clean up typography in this Apple-platform app.

Goal:
Make text easier to scan, more native, and more accessible.

Rules:
- Use SwiftUI system text styles first.
- Limit each screen to a small typography hierarchy.
- Use Regular, Medium, Semibold, or Bold for UI.
- Avoid thin weights for functional text.
- Use captions only for metadata or minor helper text.
- Use monospaced digits for changing numbers.
- Use monospaced design only for code, logs, paths, IDs, timers, and counters.
- Keep long text at readable line length.
- Use custom fonts only when justified.
- Keep SF Symbols aligned with text size and weight.
- Preserve accessibility and contrast.

Before coding:
1. Audit all font modifiers.
2. Identify hardcoded sizes.
3. Identify too-small important text.
4. Propose a simplified type scale.
5. Then implement.

After coding:
1. List files changed.
2. Explain the typography hierarchy.
3. List hardcoded fonts removed.
4. Explain custom font decisions.
5. Give manual test steps.
```
