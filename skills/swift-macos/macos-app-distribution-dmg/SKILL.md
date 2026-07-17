---
name: macos-app-distribution-dmg
description: Use when shipping a macOS app outside the App Store — Developer ID signing with hardened runtime, notarization with notarytool, stapling, building a clean drag-to-Applications DMG, and verifying the result launches on a stranger's Mac.
---

# macOS App Distribution (DMG)

Ship a macOS app outside the App Store so it opens first-try on a stranger's Mac: Developer ID signature, hardened runtime, notarization, staple, DMG. Miss a step and the user gets "*App* is damaged and can't be opened" — which most users read as *your app is broken*.

## When to use

Use this skill when the user says:

- distribute outside the App Store
- DMG / disk image / drag to Applications
- codesign / Developer ID
- notarize / notarization / `notarytool`
- staple / Gatekeeper
- "app is damaged and can't be opened"
- "cannot be opened because the developer cannot be verified"
- hardened runtime

Do not use this skill for Mac App Store submission (different signing + review pipeline), iOS distribution, or pkg-installer authoring beyond the note below.

## Core rule

```
Sign inside-out with Developer ID + hardened runtime,
notarize the final artifact, staple both the app and the DMG,
and verify on a machine that has never seen your certificates.
```

## Prerequisites

- Apple Developer Program membership.
- **Developer ID Application** certificate in the login keychain (Xcode > Settings > Accounts > Manage Certificates, or developer.apple.com). This is a *different* certificate from "Apple Development" and "Apple Distribution".
- Once, store notarization credentials (App Store Connect API key, or Apple ID + app-specific password):

```bash
xcrun notarytool store-credentials "notary-profile" \
  --key ~/keys/AuthKey_ABC123.p8 --key-id ABC123 --issuer <issuer-uuid>
```

## The pipeline

```
archive → export (Developer ID signed, hardened runtime)
        → build DMG → sign DMG
        → notarize DMG → staple DMG (and the app inside)
        → verify → publish
```

### 1. Archive and export

```bash
xcodebuild -project MyApp.xcodeproj -scheme MyApp -configuration Release \
  archive -archivePath build/MyApp.xcarchive

xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/export
```

`ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>            <string>developer-id</string>
    <key>teamID</key>            <string>YOURTEAMID</string>
    <key>signingStyle</key>      <string>automatic</string>
</dict>
</plist>
```

The `developer-id` export re-signs everything correctly and enables hardened runtime per your target settings. In the target: **Signing & Capabilities > Hardened Runtime** must be on; add exception entitlements *only* for what the app truly does (e.g. `com.apple.security.cs.allow-jit` for JS engines — not "all of them to be safe"; every exception weakens notarization's meaning).

If you sign manually instead (SPM/Xcode-less builds), sign **inside-out** — frameworks and helpers first, app bundle last:

```bash
codesign --force --options runtime --timestamp \
  --sign "Developer ID Application: Your Name (TEAMID)" \
  MyApp.app/Contents/Frameworks/Sparkle.framework
# …every nested framework, XPC service, helper, CLI…
codesign --force --options runtime --timestamp \
  --sign "Developer ID Application: Your Name (TEAMID)" \
  --entitlements MyApp.entitlements \
  MyApp.app
```

Never use `--deep` for distribution signing: it applies the *app's* entitlements to nested code and mis-signs frameworks. It exists for quick local checks only.

### 2. Build the DMG

`create-dmg` (`brew install create-dmg`) gives the canonical drag-to-Applications layout:

```bash
create-dmg \
  --volname "MyApp" \
  --window-size 540 380 \
  --icon-size 128 \
  --icon "MyApp.app" 130 190 \
  --app-drop-link 410 190 \
  --background "dmg-background.png" \
  "build/MyApp-1.2.0.dmg" \
  "build/export/MyApp.app"
```

Or plain `hdiutil` with no styling:

```bash
mkdir -p build/dmg && cp -R build/export/MyApp.app build/dmg/
ln -s /Applications build/dmg/Applications
hdiutil create -volname "MyApp" -srcfolder build/dmg -ov \
  -format UDZO "build/MyApp-1.2.0.dmg"
```

DMG etiquette: version in the filename, app + Applications symlink and nothing else, a background that says "drag this there" at a glance, total size sane (check what you're bundling if it's suddenly 300 MB).

Sign the DMG too:

```bash
codesign --force --timestamp \
  --sign "Developer ID Application: Your Name (TEAMID)" \
  "build/MyApp-1.2.0.dmg"
```

### 3. Notarize and staple

Notarize the DMG — Apple scans it *and* the app inside:

```bash
xcrun notarytool submit "build/MyApp-1.2.0.dmg" \
  --keychain-profile "notary-profile" --wait
```

`--wait` blocks until the verdict (usually minutes). On `Invalid`, get the reasons:

```bash
xcrun notarytool log <submission-id> --keychain-profile "notary-profile"
```

Then staple, so Gatekeeper passes even offline:

```bash
xcrun stapler staple "build/MyApp-1.2.0.dmg"
```

If you also distribute a bare `.zip`/`.app` (e.g. for Sparkle updates), staple the app itself and re-zip *after* stapling.

### 4. Verify — before publishing, every release

```bash
# Signature deep-check
codesign --verify --deep --strict --verbose=2 build/export/MyApp.app

# What Gatekeeper will say
spctl --assess --type open --context context:primary-signature -v build/MyApp-1.2.0.dmg
spctl --assess --type execute -v build/export/MyApp.app
#   want: "accepted · source=Notarized Developer ID"

# Staple present
xcrun stapler validate "build/MyApp-1.2.0.dmg"

# The real test: simulate a download (quarantine bit), then open
xattr -w com.apple.quarantine "0081;$(printf %x $(date +%s));Safari;" \
  "build/MyApp-1.2.0.dmg"
open "build/MyApp-1.2.0.dmg"
```

The quarantine test on a clean machine (or at least a fresh user account / VM) is the one that catches what your dev Mac can't — your machine trusts your certificates and will happily open things a stranger's Mac will block.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| "damaged and can't be opened" | Not notarized, or broken signature | Full pipeline; check `notarytool log` |
| "developer cannot be verified" | Ad-hoc or Apple Development cert | Sign with **Developer ID Application** |
| Notarization `Invalid`: "not signed with a valid Developer ID" on a framework | Nested code unsigned/ad-hoc (SPM binaries, Sparkle, helpers) | Sign inside-out; no `--deep` |
| `Invalid`: "hardened runtime not enabled" | A nested binary missing `--options runtime` | Add it everywhere, re-sign |
| `Invalid`: "contains get-task-allow" | Debug build exported | Release config, proper export |
| Works on your Mac, blocked elsewhere | Never tested with quarantine | The `xattr` test above |
| App runs from DMG but breaks (bookmarks, login item) | Translocation — running in-place from the image | Users must drag to /Applications; that's what the layout is for |

## Updates and the release record

- **Sparkle** is the standard update framework for non-App-Store apps. Budget for it from v1 — retrofitting updates after users exist is painful. Its XPC services are exactly the kind of nested code that must be correctly signed (inside-out, hardened runtime).
- Bump `CFBundleShortVersionString` (marketing) and `CFBundleVersion` (build) every release; notarization treats each build as new.
- Keep the pipeline as a script in the repo (`scripts/release.sh`) — a release process that lives in someone's shell history isn't a process. Record per release: version, date, archive hash, notarization submission ID.

## Checklist

```
[ ] Developer ID Application certificate (not Apple Development)
[ ] Hardened runtime on, minimal exception entitlements
[ ] Nested code signed inside-out; no --deep in the pipeline
[ ] Release configuration; no get-task-allow in the exported app
[ ] DMG: app + /Applications symlink only, versioned filename, signed
[ ] Notarized via notarytool; log checked on any Invalid
[ ] Stapled: DMG (and bare .app if distributed separately)
[ ] spctl says "accepted · Notarized Developer ID"
[ ] Quarantine-bit open test passed on a machine without your certs
[ ] Pipeline scripted in the repo, not in shell history
```
