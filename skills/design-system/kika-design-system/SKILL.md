---
name: kika-design-system
description: Use when building or modifying SwiftUI views, settings windows, menu-bar UIs, or any surface for the KIKA app — or any calm, premium app you want to feel the same way. Encodes the KIKA Design System v2 (June 2026) — a calm, premium, modern dark UI with first-class light mode, inspired by Cursor, Linear, and high-quality dev tools — that you can adopt or adapt for your own app. Apply it to keep color, typography, spacing, and component styling consistent.
version: 1.0.0
---

# KIKA Design System v2 (June 2026)

Calm, minimal, premium, modern dark UI with excellent light mode support. Inspired by Cursor, Linear, and high-quality dev tools.

## When to Use

Use this skill for any work touching KIKA's UI:

- Building or refactoring a SwiftUI view
- Designing a settings window, menu bar, or popover
- Adding a new component (button, row, card, divider)
- Designing a right-click context menu or the macOS main menu bar (File / Edit / View)
- Reviewing UI for consistency with the design system
- Generating new screens that should match the existing app

Do **not** use it for non-UI logic, backend, or app architecture decisions.

Built for the KIKA app, but the tokens and approach are reusable: adopt or adapt the same palette, type scale, spacing, and components for your own calm, premium Apple-platform app.

## Philosophy

- **Calm over loud.** Accent color is restrained. Borders are thin or absent.
- **Elevation over borders.** Subtle background changes carry hierarchy.
- **Generous spacing.** Three gap values (`12pt`, `16pt`, `20pt`) carry the whole layout. (`8pt` exists for **internal** component padding only — never as a gap.)
- **One font family.** SF Pro. No custom imports.
- **Dark first, light equally.** Every token has a dark and light value.
- **Icons over text.** Always reach for SF Symbols first. Labels stay on actions; chrome stays symbol-only.
- **No subtitles.** If a label and a description feel needed, the description is the label — rewritten, not stacked.
- **No visual clutter.** No drop shadows, no decorative gradients, no colored icon fills, no multi-color palettes. Restraint is a feature.

## Workflow

1. **Read the relevant reference.** Pick the slice of the design system that applies:
   - Color tokens → [Colors](references/colors.md)
   - Type scale → [Typography](references/typography.md)
   - Gaps, padding, rhythm → [Spacing & Layout](references/spacing-layout.md)
   - Cards, buttons, rows, dividers → [Components](references/components.md)
   - Settings or About window → [Settings Window](references/settings-window.md)
2. **Resolve tokens once.** Use `KikaTheme.resolve(scheme:)` (see the asset) — never hard-code hex per call site.
3. **Compose from building blocks.** `KikaSectionHeader`, `KikaDivider`, `KikaRow`, `KikaPrimaryButtonStyle`, `KikaSecondaryButtonStyle` are provided in [SettingsView.swift](assets/SettingsView.swift).
4. **Honor system color scheme.** Don't force light or dark. Let macOS / iOS decide and resolve tokens accordingly.
5. **Self-review against anti-patterns.** Each reference ends with a "Anti-Patterns" list. Run through it before declaring the view done.

## Quick Reference

### Color tokens (one-line summary)

| Token            | Dark       | Light     |
|------------------|------------|-----------|
| `background`     | `#0D0D0D`  | `#F8F8F8` |
| `surface`        | `#161616`  | `#FFFFFF` |
| `elevated`       | `#1F1F1F`  | `#F0F0F0` |
| `divider`        | `white.opacity(0.08)` | `#E5E5E5` |
| `textPrimary`    | `#D9D9D9`  | `#1A1A1A` |
| `textSecondary`  | `#BFBFBF`  | `#4A4A4A` |
| `textTertiary`   | `#8C8C8C`  | `#6B6B6B` |
| `accent`         | `#6D80A6`  | `#5A6E94` |
| `border`         | `#2A2A2A`  | `#E0E0E0` |

> `divider` and `border` are intentionally distinct. Use `divider` for one-line separators and `border` for control outlines (e.g. secondary button stroke). Don't substitute one for the other.

### Type scale

| Role    | Size | Weight    |
|---------|------|-----------|
| Title   | 18pt | semibold  |
| Body    | 13pt | regular   |
| Caption | 11pt | regular   |
| Icon    | 14pt | regular   |

> The 18/13/11/14 numbers above are the canonical values. The wider 17–20 / 13–14 / 11–12 ranges in [Typography](references/typography.md) describe where it is acceptable to deviate, e.g. for a hero display or a one-off dense caption — not defaults to use casually.

### Spacing

| Token | Value | Use for                          |
|-------|-------|----------------------------------|
| `xs`  | 8pt   | Internal component padding only (e.g. button vertical) |
| `sm`  | 12pt  | Tight stacks, between related items |
| `md`  | 16pt  | Default vertical/horizontal rhythm |
| `lg`  | 20pt  | Between sections, page-level padding |

> For layout **gaps** between elements, pick from `sm` / `md` / `lg`. `xs` is reserved for **internal** component padding (button vertical, dense row internals) — using it for gap rhythm would fragment the 3-value system.

## Assets

- [SettingsView.swift](assets/SettingsView.swift) — Complete SwiftUI reference implementation: token resolution, theme environment, `KikaSectionHeader`, `KikaDivider`, `KikaRow`, primary/secondary button styles, General tab, About tab, and a working `SettingsView` scene. Copy and adapt.

## References

- [Colors](references/colors.md) — Full dark/light color palette with rules and token mapping
- [Typography](references/typography.md) — SF Pro scale, weights, line height, anti-patterns
- [Spacing & Layout](references/spacing-layout.md) — Gap scale, padding, rhythm, anti-patterns
- [Components](references/components.md) — Surfaces, buttons, dividers, section headers, settings rows
- [Settings Window](references/settings-window.md) — General and About tab layout specs
- [Menus](references/menus.md) — Right-click context menus, the macOS main menu bar, icon catalog

## Parse-Safe Notes

When generating code from this design system:

- SwiftUI's `Color(hex:)` initializer shown in the asset uses `UInt32` — keep the `0x` prefix on literals
- `Color.white.opacity(0.08)` is the canonical divider in dark mode; do not substitute `#1A1A1A` or similar
- `Font.system(size:weight:)` is the only font constructor — do not introduce `.font(.body)` shortcuts that may resolve to a non-SF-Pro system font in some contexts
- The accent color is intentionally desaturated (`#6D80A6` / `#5A6E94`). Do not "brighten" it.

## Out of Scope

- App architecture, networking, persistence
- Non-UI Swift / Swift API design
- Cross-platform (web, Android) styling — KIKA-born, but Apple-platform (SwiftUI) only; the tokens themselves can inform other platforms
