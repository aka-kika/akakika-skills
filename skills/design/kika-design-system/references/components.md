# Components

KIKA components share one principle: **calm, elevated, restrained.** Subtle background changes carry hierarchy; color and chrome do not.

## Surfaces / Cards

- Background: `surface` (`#161616` / `#FFFFFF`)
- On hover: `elevated` (`#1F1F1F` / `#F0F0F0`)
- No drop shadow. No thick border. No `cornerRadius` larger than `10`.
- Prefer a one-line divider between groups over wrapping each group in a card.

## Buttons

### Primary
- Background: `accent` (`#6D80A6` / `#5A6E94`)
- Foreground: white / `#FFFFFF` for text, `textPrimary` for icons
- Padding: `16pt` horizontal × `8pt` vertical (`KikaSpacing.md` × `KikaSpacing.xs`)
- Corner radius: `6pt`
- Use for: one primary action per view max

### Secondary (Default)
- Background: transparent
- Foreground: `textPrimary`
- Border: 1pt `border` (`#2A2A2A` / `#E0E0E0`) — use sparingly
- Padding: same as primary
- Use for: "Choose...", "Cancel", "Browse..."

### Hover State
- Subtle background elevation only — change `surface` → `elevated`. Don't change border or text color.

> `KikaSpacing.xs` (8pt) is reserved for **internal component padding** (button vertical, dense row internals). For layout gaps between elements, use `sm` / `md` / `lg` only. See [Spacing & Layout](spacing-layout.md).

## Dividers

- **One thin line.** `white.opacity(0.08)` in dark, `#E5E5E5` in light.
- Full-width, `1pt` tall, no inset.
- Use between every row in dense forms (settings, lists) and between sections in long layouts. Pick one rule per surface and stay consistent.

## Section Headers

- Font: `KikaFont.title` (semibold 18pt — see [Typography](typography.md) for the deviation range)
- Color: `textPrimary`
- Sentence case. No all-caps.
- Optional: a one-line `divider` directly below.

## Settings Rows (Icon + Label + Control)

```swift
HStack(spacing: KikaSpacing.md) {
    Image(systemName: icon)
        .font(KikaFont.icon)
        .foregroundStyle(theme.textSecondary)
        .frame(width: 18)
    Text(label)
        .font(KikaFont.body)
        .foregroundStyle(theme.textPrimary)
    Spacer()
    control()  // Toggle, Picker, Button...
}
.frame(minHeight: 32)
```

- Icon: SF Symbol, 14pt (`KikaFont.icon`), `textSecondary` color
- Label: `KikaFont.body`, `textPrimary`
- Control: right-aligned, vertically centered
- Min height: `32pt`. Don't shrink.

## Toggles

- Use system `Toggle` with `.switchStyle(.switch)` (macOS).
- Accent color follows `theme.accent` automatically (system `Toggle` reads the resolved accent).

## Choice / "Choose..." Buttons

- Secondary button style.
- Trailing chevron icon (`>`) optional, only if it opens a sub-view.

## Anti-Patterns

- Filled accent-colored buttons for every action
- Rounded card containers around single rows
- Drop shadows on surfaces
- Colored icons in body content (icons stay `textSecondary`)
- Multiple primary buttons in the same view
