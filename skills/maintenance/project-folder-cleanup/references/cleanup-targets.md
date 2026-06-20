# Default Cleanup Targets

Use these as the starting scan list. Always show the user the full list and get confirmation before deleting anything.

## Always safe to remove (regenerable)

| Pattern | Category | Restore with |
|---------|----------|--------------|
| `node_modules/` | JavaScript deps | `npm install`, `pnpm install`, `yarn`, `bun install` |
| `.next/` | Next.js build | `npm run dev` / `npm run build` |
| `dist/`, `build/`, `out/` | Build output | Project build command |
| `.turbo/` | Turborepo cache | Next turbo run |
| `.parcel-cache/` | Parcel cache | Rebuild |
| `coverage/` | Test coverage | `npm test -- --coverage` |
| `.pytest_cache/` | Python test cache | Re-run tests |
| `__pycache__/` | Python bytecode | Re-run Python |
| `.mypy_cache/`, `.ruff_cache/` | Python tool cache | Re-run linter |
| `.cache/` | Generic cache | Tool-specific |
| `*.tsbuildinfo` | TypeScript incremental | Rebuild |
| `.DS_Store` | macOS metadata | Harmless; recreated by Finder |
| `Thumbs.db` | Windows metadata | Harmless |
| `*.log` (root only) | Log files | Re-run app |
| `.vite/` | Vite cache | Rebuild |
| `target/` (Rust) | Cargo build output | `cargo build` |
| `.gradle/`, `build/` (Android) | Gradle output | Gradle rebuild |
| `DerivedData/` (if copied in) | Xcode derived | Xcode rebuild |
| `.swiftpm/xcode/package.xcworkspace/xcuserdata/` | Xcode user state | Reopen project |

## Ask before removing

| Pattern | Why |
|---------|-----|
| `.venv/`, `venv/` | Large but recreatable; user may prefer keeping |
| `vendor/` | May be committed in some PHP projects |
| `.env.local`, `.env.*.local` | May contain secrets — never delete by default |
| `Pods/` | Regenerable via `pod install` but slow to restore |
| `Carthage/Build/` | Regenerable but large download |

## Never remove by default

- `.git/`
- Source code (`src/`, `app/`, `lib/`, etc.)
- Config that is not regenerable (`package.json`, `tsconfig.json`, `Cargo.toml`, etc.)
- `.env` (unless user explicitly requests and confirms)
- User data, uploads, databases (`.sqlite`, `.db`)
- `README.md`, docs, licenses

## Custom targets

When the user names specific paths, add them to the plan with an explicit reason column in `BACKUP.md`.
