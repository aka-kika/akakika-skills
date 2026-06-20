---
name: project-folder-cleanup
description: Safely clean regenerable clutter from a project folder by scanning for build artifacts and caches, backing up every removed path into a timestamped archive with a BACKUP.md manifest, zipping the backup to save space, and only deleting originals after explicit confirmation. Use when the user asks to clean a project directory, remove node_modules, clear build output, reclaim disk space, or tidy a repo before archiving.
version: 1.0.0
---

# Project Folder Cleanup

Remove regenerable clutter from a project folder without losing data. Every targeted path is copied into a backup first, documented in `BACKUP.md`, compressed into a zip archive, and only then removed from the project when explicitly confirmed.

## When to Use

- Clean `node_modules`, build folders, caches, or logs from a project
- Reclaim disk space before archiving or zipping a repo
- Reset a project to a fresh-build state
- Tidy a workspace after switching branches or experiments

Do **not** use it for general file organization across the whole computer — that's out of scope for this skill.

## Core Rules

1. **Backup before delete** — no exceptions
2. **Scan and confirm** — show paths and sizes; get approval before destructive steps
3. **Dry-run first** — always run with `--dry-run` until the plan is approved
4. **Zip the backup** — keep disk use small; retain the `.zip`, drop uncompressed folder by default
5. **Document everything** — `BACKUP.md` inside the backup explains what, why, and how to restore

Read [Safety Rules](references/safety-rules.md) before every run.

## Workflow

### Step 1: Choose the project

Confirm the project root path. Do not run from `$HOME` unless the user explicitly wants home-level cleanup.

### Step 2: Scan candidates

```bash
node scripts/scan-cleanup-candidates.mjs /path/to/project --json
```

Or human-readable:

```bash
node scripts/scan-cleanup-candidates.mjs /path/to/project
```

Review output with the user. Compare against [Default Cleanup Targets](references/cleanup-targets.md). Add or remove paths based on user preference.

### Step 3: Check git status

```bash
git -C /path/to/project status --short
```

Warn if targeted paths overlap with uncommitted work the user may care about.

### Step 4: Dry-run backup + cleanup plan

```bash
node scripts/cleanup-with-backup.mjs --project /path/to/project --dry-run
```

Optional custom manifest:

```bash
node scripts/cleanup-with-backup.mjs \
  --project /path/to/project \
  --targets /tmp/cleanup-targets.json \
  --dry-run
```

`cleanup-targets.json` example:

```json
{
  "items": [
    { "path": "node_modules", "category": "JavaScript deps", "reason": "npm install" },
    { "path": ".next", "category": "Next.js build", "reason": "npm run build" }
  ]
}
```

Present the dry-run summary and wait for explicit approval.

### Step 5: Execute backup + zip

Run **without** `--dry-run`. Omit `--confirm` on the first execution pass so originals stay in place until backup is verified:

```bash
node scripts/cleanup-with-backup.mjs --project /path/to/project
```

This creates:

```
/path/to/project/.project-cleanup-backups/
  2026-05-25T12-30-00-000Z-my-app.zip   # contains BACKUP.md + files/
  2026-05-25T12-30-00-000Z-my-app-SUMMARY.md
```

Open the zip and confirm `BACKUP.md` lists every path correctly.

### Step 6: Delete originals (confirmed)

Only after the user verifies the archive:

```bash
node scripts/cleanup-with-backup.mjs --project /path/to/project --confirm
```

If backup already exists from step 5, pass the same `--targets` file if used.

### Step 7: Post-cleanup

- Suggest adding `.project-cleanup-backups/` to `.gitignore` if not already ignored
- Tell the user where the zip lives and how to restore (see `BACKUP.md` in the archive)
- Optionally run the project build/install to confirm everything regenerates

## Scripts

- [scan-cleanup-candidates.mjs](scripts/scan-cleanup-candidates.mjs) — Find common cleanup targets and report sizes
- [cleanup-with-backup.mjs](scripts/cleanup-with-backup.mjs) — Backup, render manifest, zip, optionally delete
- [render-backup-readme.mjs](scripts/render-backup-readme.mjs) — Build `BACKUP.md` from template (do not paste template into chat)

## References

- [Default Cleanup Targets](references/cleanup-targets.md) — What to remove, ask about, or never touch
- [Safety Rules](references/safety-rules.md) — Backup ordering, failure handling, git awareness

## Assets

- [backup-readme.template.md](assets/backup-readme.template.md) — Manifest template rendered by script

## Backup layout

Inside the zip:

```
2026-05-25T...-project-name/
├── BACKUP.md          # What was removed, why, restore commands
└── files/             # Mirror of removed paths relative to project root
    ├── node_modules/
    └── .next/
```

## Options reference

| Flag | Purpose |
|------|---------|
| `--dry-run` | Show plan only |
| `--confirm` | Delete originals after successful backup + zip |
| `--targets <json>` | Custom manifest instead of default scan |
| `--backup-root <path>` | Store backups outside the project |
| `--keep-uncompressed` | Keep folder after zipping |

## Edge cases

- **Path already missing** — skipped silently; noted in scan output
- **Backup copy fails** — stop immediately; do not delete anything
- **Zip fails** — keep uncompressed backup; do not delete originals
- **User wants `.venv` removed** — add to manifest explicitly; warn about reinstall time
- **Monorepo** — scan from repo root; paths are relative to that root

## After fixing skill output

If a cleanup run produces wrong targets, bad manifest text, or restore instructions that fail, update this skill (not just the one-off output) when the fix is general and durable.
