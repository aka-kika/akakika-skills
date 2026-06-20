import SwiftUI

// MARK: - Tokens

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

enum KikaSpacing {
    // xs is reserved for internal component padding (e.g. button vertical).
    // For layout gaps between elements, use sm/md/lg only.
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 20
}

enum KikaFont {
    static let title   = Font.system(size: 18, weight: .semibold)
    static let body    = Font.system(size: 13, weight: .regular)
    static let caption = Font.system(size: 11, weight: .regular)
    // 14pt SF Symbol inside KikaRow — same family, same body weight for visual rhythm.
    static let icon    = Font.system(size: 14, weight: .regular)
}

// MARK: - Environment-driven token resolution

struct KikaTheme {
    let background: Color
    let surface: Color
    let elevated: Color
    let border: Color
    let divider: Color
    let textPrimary: Color
    let textSecondary: Color
    let textTertiary: Color
    let accent: Color

    static func resolve(scheme: ColorScheme) -> KikaTheme {
        switch scheme {
        case .dark:
            return KikaTheme(
                background:    KikaColors.backgroundDark,
                surface:       KikaColors.surfaceDark,
                elevated:      KikaColors.elevatedDark,
                border:        KikaColors.borderDark,
                divider:       KikaColors.dividerDark,
                textPrimary:   KikaColors.textPrimaryDark,
                textSecondary: KikaColors.textSecondDark,
                textTertiary:  KikaColors.textTertDark,
                accent:        KikaColors.accentDark
            )
        default:
            return KikaTheme(
                background:    KikaColors.backgroundLight,
                surface:       KikaColors.surfaceLight,
                elevated:      KikaColors.elevatedLight,
                border:        KikaColors.borderLight,
                divider:       KikaColors.dividerLight,
                textPrimary:   KikaColors.textPrimaryLight,
                textSecondary: KikaColors.textSecondLight,
                textTertiary:  KikaColors.textTertLight,
                accent:        KikaColors.accentLight
            )
        }
    }
}

private struct KikaThemeKey: EnvironmentKey {
    static let defaultValue: KikaTheme = .resolve(scheme: .light)
}

extension EnvironmentValues {
    var kikaTheme: KikaTheme {
        get { self[KikaThemeKey.self] }
        set { self[KikaThemeKey.self] = newValue }
    }
}

// MARK: - Reusable building blocks

struct KikaSectionHeader: View {
    let title: String
    @Environment(\.kikaTheme) private var theme

    var body: some View {
        Text(title)
            .font(KikaFont.title)
            .foregroundStyle(theme.textPrimary)
    }
}

struct KikaDivider: View {
    @Environment(\.kikaTheme) private var theme

    var body: some View {
        Rectangle()
            .fill(theme.divider)
            .frame(height: 1)
    }
}

struct KikaRow<Control: View>: View {
    let icon: String
    let label: String
    @ViewBuilder var control: () -> Control

    @Environment(\.kikaTheme) private var theme

    var body: some View {
        HStack(spacing: KikaSpacing.md) {
            Image(systemName: icon)
                .font(KikaFont.icon)
                .foregroundStyle(theme.textSecondary)
                .frame(width: 18)
            Text(label)
                .font(KikaFont.body)
                .foregroundStyle(theme.textPrimary)
            Spacer()
            control()
        }
        .frame(minHeight: 32)
    }
}

struct KikaPrimaryButtonStyle: ButtonStyle {
    @Environment(\.kikaTheme) private var theme

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(KikaFont.body)
            .foregroundStyle(.white)
            .padding(.horizontal, KikaSpacing.md)
            .padding(.vertical, KikaSpacing.xs)
            .background(
                RoundedRectangle(cornerRadius: 6)
                    .fill(theme.accent)
                    .opacity(configuration.isPressed ? 0.85 : 1.0)
            )
    }
}

struct KikaSecondaryButtonStyle: ButtonStyle {
    @Environment(\.kikaTheme) private var theme

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(KikaFont.body)
            .foregroundStyle(theme.textPrimary)
            .padding(.horizontal, KikaSpacing.md)
            .padding(.vertical, KikaSpacing.xs)
            .background(
                RoundedRectangle(cornerRadius: 6)
                    .fill(configuration.isHovered ? theme.elevated : .clear)
                    .overlay(
                        RoundedRectangle(cornerRadius: 6)
                            .stroke(theme.border, lineWidth: 1)
                    )
            )
    }
}

// MARK: - Tabs

struct KikaGeneralTab: View {
    @State private var launchAtLogin = true
    @State private var storagePath = "~/Library/Application Support/KIKA"
    @Environment(\.kikaTheme) private var theme

    var body: some View {
        VStack(alignment: .leading, spacing: KikaSpacing.md) {
            KikaSectionHeader(title: "General")
            KikaDivider()
            KikaRow(icon: "arrow.up.forward.app", label: "Launch at login") {
                Toggle("", isOn: $launchAtLogin).toggleStyle(.switch)
            }
            KikaRow(icon: "folder", label: "Storage") {
                Button("Choose…") {}
                    .buttonStyle(KikaSecondaryButtonStyle())
            }
            KikaRow(icon: "keyboard", label: "Capture hotkey") {
                Text("⌘ ⇧ Space")
                    .font(KikaFont.body)
                    .foregroundStyle(theme.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

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

// MARK: - Settings Window

struct SettingsView: View {
    @Environment(\.colorScheme) private var colorScheme
    @State private var tab: Tab = .general

    enum Tab: String, CaseIterable, Identifiable {
        case general = "General"
        case about   = "About"
        var id: String { rawValue }
    }

    var body: some View {
        let theme = KikaTheme.resolve(scheme: colorScheme)

        VStack(spacing: 0) {
            Picker("", selection: $tab) {
                ForEach(Tab.allCases) { Text($0.rawValue).tag($0) }
            }
            .pickerStyle(.segmented)
            .padding(KikaSpacing.lg)

            KikaDivider()

            Group {
                switch tab {
                case .general: KikaGeneralTab()
                case .about:   KikaAboutTab()
                }
            }
            .padding(KikaSpacing.lg)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
        .frame(width: 480, height: 360)
        .background(theme.background)
        .environment(\.kikaTheme, theme)
    }
}

// MARK: - Color hex helper

extension Color {
    init(hex: UInt32, opacity: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8)  & 0xFF) / 255.0
        let b = Double(hex         & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: opacity)
    }
}

// MARK: - Preview

#Preview {
    SettingsView()
        .preferredColorScheme(.dark)
}
