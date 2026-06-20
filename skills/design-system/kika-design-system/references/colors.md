# Colors

KIKA uses a calm, premium palette with first-class dark mode support. Always read the active mode from the system and map tokens via a single `ColorScheme` resolver — never hard-code hex per call site.

## Dark Mode (Primary)

| Token            | Hex / Value            | Used For                          |
|------------------|------------------------|-----------------------------------|
| `background`     | `#0D0D0D`              | Main windows, menu bar            |
| `surface`        | `#161616`              | Cards, panels, popovers           |
| `elevated`       | `#1F1F1F`              | Hover / active surfaces           |
| `divider`        | `white.opacity(0.08)`  | One-line separators               |
| `textPrimary`    | `#D9D9D9`              | Main text                         |
| `textSecondary`  | `#BFBFBF`              | SF Symbol icons, secondary labels, About hero copy |
| `textTertiary`   | `#8C8C8C`              | Captions, keyboard shortcuts in menus, disabled |
| `accent`         | `#6D80A6`              | Primary actions, highlights       |
| `border`         | `#2A2A2A`              | Thin borders (use sparingly)      |

## Light Mode

| Token            | Hex / Value | Used For                  |
|------------------|-------------|---------------------------|
| `background`     | `#F8F8F8`   | Main windows              |
| `surface`        | `#FFFFFF`   | Cards, panels             |
| `elevated`       | `#F0F0F0`   | Hover states              |
| `divider`        | `#E5E5E5`   | Subtle separators         |
| `textPrimary`    | `#1A1A1A`   | Main text                 |
| `textSecondary`  | `#4A4A4A`   | SF Symbol icons, secondary labels, About hero copy |
| `textTertiary`   | `#6B6B6B`   | Captions, keyboard shortcuts in menus, disabled |
| `accent`         | `#5A6E94`   | Primary actions           |
| `border`         | `#E0E0E0`   | Thin borders              |

## Usage Rules

- **One source of truth.** Define a `KikaColors` enum/struct with `static` per-token accessors. Branch on `ColorScheme` once.
- **Accent is restrained.** Use `#6D80A6` for primary actions only. Never as decorative fills. Never tint menu icons.
- **Dividers > borders.** Reach for `white.opacity(0.08)` in dark, `#E5E5E5` in light, before adding box outlines.
- **No pure black text in dark mode.** Use `#D9D9D9` for primary text to avoid the "OLED burn" feel.
- **No pure white surfaces in light mode.** Use `#F8F8F8` for backgrounds and `#FFFFFF` only for elevated cards.
- **No subtitles.** If a label needs a description, rewrite the label. Don't stack.
- **SF Symbols over text.** Every action affordance should reach for an SF Symbol first. See [Menus](menus.md) for the canonical icon catalog.

## Token Mapping (SwiftUI Sketch)

The single source of truth is `KikaColors` (raw hex per mode) → `KikaTheme.resolve(scheme:)` (mode-aware bundle) → `@Environment(\.kikaTheme)` at the call site. **Never** introduce `Color.kikaAccent`-style statics — they bypass scheme resolution and break light/dark switching.

```swift
// 1. Raw values (one per mode).
enum KikaColors {
    // Dark
    static let backgroundDark  = Color(hex: 0x0D0D0D)
    static let surfaceDark     = Color(hex: 0x161616)
    static let elevatedDark    = Color(hex: 0x1F1F1F)
    static let borderDark      = Color(hex: 0x2A2A2A)
    static let dividerDark     = Color.white.opacity(0.08)
    static let textPrimaryDark = Color(hex: 0xD9D9D9)
    static let textSecondDark  = Color(hex: 0xBFBFBF)
    static let textTertDark    = Color(hex: 0x8C8C8C)
    static let accentDark      = Color(hex: 0x6D80A6)

    // Light
    static let backgroundLight  = Color(hex: 0xF8F8F8)
    static let surfaceLight     = Color.white
    static let elevatedLight    = Color(hex: 0xF0F0F0)
    static let borderLight      = Color(hex: 0xE0E0E0)
    static let dividerLight     = Color(hex: 0xE5E5E5)
    static let textPrimaryLight = Color(hex: 0x1A1A1A)
    static let textSecondLight  = Color(hex: 0x4A4A4A)
    static let textTertLight    = Color(hex: 0x6B6B6B)
    static let accentLight      = Color(hex: 0x5A6E94)
}

// 2. Resolve once, at the window root.
let theme = KikaTheme.resolve(scheme: colorScheme)
windowRoot.environment(\.kikaTheme, theme)

// 3. Use the resolved theme everywhere downstream.
@Environment(\.kikaTheme) private var theme
// theme.background, theme.surface, theme.textPrimary, theme.accent, …
```

> `KikaColors.dividerLight` (`#E5E5E5`) and `KikaColors.borderLight` (`#E0E0E0`) are intentionally distinct — dividers are softer than borders so a one-line separator doesn't compete with a control outline.
