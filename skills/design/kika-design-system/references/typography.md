# Typography

KIKA uses **SF Pro** (system font) exclusively. Size scale is deliberately narrow to keep the UI calm and avoid visual noise.

## Scale

| Role     | Size  | Weight     | Line Height   | Used For                          |
|----------|-------|------------|---------------|-----------------------------------|
| Title    | 18pt (range 17–20) | semibold   | generous      | Section headers, card titles      |
| Body     | 13pt (range 13–14) | regular    | ~1.4          | Descriptions, primary content     |
| Caption  | 11pt (range 11–12) | regular    | ~1.3          | Captions, disabled, hints         |
| Icon     | 14pt  | regular    | n/a           | SF Symbols inside `KikaRow`       |

> The 18 / 13 / 11 / 14 numbers are the **canonical defaults**. The ranges in parentheses describe where it is acceptable to deviate — for a hero display, a dense one-off caption, etc. — not defaults to reach for casually.

## Rules

- **One font family.** No custom imports. SF Pro is the system font on macOS / iOS.
- **Semibold for titles only.** Avoid bold for body — use weight sparingly.
- **Tertiary color for captions.** Pair small text with `textTertiary` (`#8C8C8C` / `#6B6B6B`) to reduce contrast strain.
- **Generous line height.** Aim for `1.35–1.45` on body text. Cramped lines break the calm feel.
- **No all-caps.** Section headers stay sentence case. Caps introduce noise.
- **Use `Font.system(size:weight:)` directly.** Do not use `.font(.body)` shortcuts — they may resolve to a non-SF-Pro system font in some contexts (see [Parse-Safe Notes](../SKILL.md#parse-safe-notes) in the skill root).

## SwiftUI Sketch

```swift
enum KikaFont {
    static let title   = Font.system(size: 18, weight: .semibold)
    static let body    = Font.system(size: 13, weight: .regular)
    static let caption = Font.system(size: 11, weight: .regular)
    static let icon    = Font.system(size: 14, weight: .regular)
}
```

## Anti-Patterns

- Multiple weights in one paragraph (regular + semibold + bold)
- Font sizes outside the 11–20pt range
- Mixing SF Pro with Inter / Roboto / mono in the same view
- Tight line height (`1.0`–`1.2`) on body copy
