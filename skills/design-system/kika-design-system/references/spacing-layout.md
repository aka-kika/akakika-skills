# Spacing & Layout

KIKA favors **generous but intentional** spacing. The gap scale is small on purpose — three values (`sm` / `md` / `lg`) carry the whole layout. A fourth value (`xs`) is reserved exclusively for internal component padding.

## Gap Scale (between elements)

| Token | Value | When to Use                              |
|-------|-------|------------------------------------------|
| `sm`  | 12pt  | Tight stacks, between related items      |
| `md`  | 16pt  | Default vertical/horizontal rhythm       |
| `lg`  | 20pt  | Between sections, page-level padding     |

## Internal Component Padding

| Token | Value | When to Use                              |
|-------|-------|------------------------------------------|
| `xs`  | 8pt   | Button vertical padding, dense row internals — components only, never for gap rhythm |

> `xs` exists so that buttons and dense rows have a defined vertical rhythm (8pt) without inventing a fourth layout-gap value. Layout gaps still pick from `sm` / `md` / `lg`.

## Padding

- Page-level padding: `20pt` on all sides
- Card inner padding: `16pt`
- Tight grouping (label + value): `12pt`
- Button internal: `16pt` horizontal × `8pt` vertical

## Rules

- **Pick from the three gap values for layout.** Don't introduce arbitrary gap values like 8pt or 24pt between elements — they fragment the rhythm.
- **Vertical rhythm over visual borders.** Use `16pt` gaps plus a one-line divider, not card boxes around every group.
- **Right-align values.** In settings rows, label goes left, value/control goes right. Center-align only for hero blocks (e.g. About page).
- **No fixed-pixel heights.** Let content size the row. If a row feels short, add `12pt` padding, not a hard height.

## SwiftUI Sketch

```swift
enum KikaSpacing {
    static let xs: CGFloat = 8   // component internals only
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 20
}

VStack(alignment: .leading, spacing: KikaSpacing.md) {
    sectionHeader
    Divider()
    settingsRow
}
.padding(KikaSpacing.lg)
```

## Anti-Patterns

- ❌ `8pt` / `24pt` / `32pt` gaps bleeding into the layout between elements
- ❌ Using `KikaSpacing.xs` for layout gaps (it is for component internals only)
- ❌ Mixing `padding` and `spacing` arbitrarily
- ❌ Heavy card chrome (rounded rect + thick border) used as a substitute for spacing
- ❌ Fixed `frame(height:)` on rows
