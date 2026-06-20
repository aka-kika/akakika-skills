# Project Cleanup Backup

**Project:** {{PROJECT_NAME}}  
**Project path:** `{{PROJECT_PATH}}`  
**Backup created:** {{TIMESTAMP}}  
**Created by:** project-folder-cleanup skill  
**Archive:** `{{ARCHIVE_PATH}}`

## What happened

This backup was created **before** removing regenerable or disposable files from the project folder. Nothing here was deleted from disk until it was copied into this backup (and compressed into the zip archive).

## Why these items were removed

| Path | Category | Reason |
|------|----------|--------|
{{ITEM_ROWS}}

## Totals

- **Items removed:** {{ITEM_COUNT}}
- **Bytes backed up:** {{BYTES_BACKED_UP}}
- **Compressed archive size:** {{ARCHIVE_SIZE}}

## How to restore

### Restore everything

```bash
cd "{{PROJECT_PATH}}"
unzip -o "{{ARCHIVE_PATH}}" -d "{{BACKUP_PARENT}}"
# Then copy files back from the extracted backup/files/ tree, or:
# rsync -a "{{BACKUP_DIR}}/files/" .
```

### Restore a single path

```bash
unzip -p "{{ARCHIVE_PATH}}" "files/PATH/WITHIN/PROJECT" > restored-file
# For directories, extract selectively:
unzip -o "{{ARCHIVE_PATH}}" "files/node_modules/*" -d /tmp/restore
```

## Safety notes

- Source files, git history, and `.env` secrets were **not** targeted unless explicitly included in the cleanup plan.
- If something looks wrong, restore from this archive before running cleanup again.
- Keep this zip until the project builds and runs correctly after cleanup.

## Cleanup command reference

```bash
{{COMMAND_LINE}}
```
