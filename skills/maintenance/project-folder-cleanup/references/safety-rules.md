# Safety Rules

Follow these on every cleanup run.

## Before any deletion

1. **Scan first** — run [scan-cleanup-candidates.mjs](../scripts/scan-cleanup-candidates.mjs) and show results.
2. **Get confirmation** — present paths, sizes, and categories; wait for explicit approval.
3. **Dry-run by default** — use `--dry-run` until the user approves the final list.

## Backup requirements

1. Copy every targeted path into `backup/files/` preserving relative paths from project root.
2. Write [BACKUP.md](../assets/backup-readme.template.md) via [render-backup-readme.mjs](../scripts/render-backup-readme.mjs) **before** deleting originals.
3. Create a zip archive of the entire backup directory.
4. Verify the zip lists all expected entries before deletion.
5. Only delete originals when `--confirm` is passed and backup + zip succeeded.

## Backup location

Default: `<project>/.project-cleanup-backups/<timestamp>-<project-name>/`

- Keeps backups colocated with the project
- Add `.project-cleanup-backups/` to `.gitignore` if missing (ask user first)

Alternative when user prefers external backups: `~/Backups/project-cleanup/<project-name>/<timestamp>/`

## Failure handling

- If copy fails mid-run: stop, do not delete anything, report partial backup path.
- If zip fails: keep uncompressed backup folder, do not delete originals.
- If delete fails after backup: report which paths were removed vs failed; backup remains restorable.

## Git awareness

- Run `git status` before cleanup; warn if targeted paths contain uncommitted changes the user may care about.
- Never use `git clean -fdx` as a substitute for this workflow.
