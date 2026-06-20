# Settings Window Layout

The settings window is the most visible expression of the design system. Keep it calm, form-like, and free of decoration.

## Window Specs

- Width: `480pt` (compact), `560pt` for panes with longer copy
- Min height: content-driven, no fixed min
- Use `Settings { ... }` scene in SwiftUI
- Tab style: `.toolbar` (segmented top tabs), not sidebar

## General Tab

- Clean form layout
- Subtle section headers (`KikaFont.title`, `theme.textPrimary`)
- One-line divider between sections
- Settings rows aligned to a left "rail" — labels left, controls right
- Path pickers end in a secondary "Choose..." button (no full-width button bars)
- No card chrome around the form. The window surface is the card.

### Sketch

```swift
struct KikaGeneralTab: View {
    @Environment(\.kikaTheme) private var theme

    var body: some View {
        VStack(alignment: .leading, spacing: KikaSpacing.md) {
            KikaSectionHeader(title: "General")
            KikaDivider()
            KikaRow(icon: "arrow.up.forward.app", label: "Launch at login") {
                Toggle("", isOn: $launchAtLogin).toggleStyle(.switch)
            }
            KikaDivider()
            KikaRow(icon: "folder", label: "Storage") {
                Button("Choose…") {}
                    .buttonStyle(KikaSecondaryButtonStyle())
            }
            KikaDivider()
            KikaRow(icon: "keyboard", label: "Capture hotkey") {
                Text("⌘ ⇧ Space")
                    .font(KikaFont.body)
                    .foregroundStyle(theme.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
```

## About Tab

- Centered icon + app name
- App name uses `KikaFont.title` (semibold) — version and tagline stay separate lines, never stacked as a subtitle
- One-line divider after the header block

### Sketch

```swift
struct KikaAboutTab: View {
    @Environment(\.kikaTheme) private var theme

    var body: some View {
        VStack(spacing: KikaSpacing.md) {
            Image(systemName: "circle.hexagongrid.fill")
                .resizable()
                .symbolRenderingMode(.hierarchical)
                .frame(width: 80, height: 80)
                .foregroundStyle(theme.accent)
            Text("KIKA").font(KikaFont.title)
            Text("Version 1.0 (build 100)")
                .font(KikaFont.caption)
                .foregroundStyle(theme.textTertiary)
            KikaDivider()
                .padding(.horizontal, 40)
            Text("A calm menu-bar companion for quick capture and recall.")
                .font(KikaFont.body)
                .foregroundStyle(theme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Spacer()
            Text("© 2026 kika")
                .font(KikaFont.caption)
                .foregroundStyle(theme.textTertiary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
```

> The icon, app name, version, tagline, and footer are **five separate elements** in a vertical stack. They are never fused into "label + subtitle" pairs. The icon is an SF Symbol, not a bitmap — keeps the design system consistent.

## Rules

- **No nested cards.** The window surface is the container.
- **One divider between sections.** Not before the first section, not after the last.
- **Centered hero blocks only in About.** Everything else is left-aligned form.
- **Don't auto-resize based on tab.** Fixed widths keep the design calm.
- **System title bar.** Don't hide it unless the design demands it.
