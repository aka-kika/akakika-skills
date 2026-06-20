#!/usr/bin/env node
/**
 * Backup targeted paths, write BACKUP.md, zip the backup, then delete originals.
 *
 * Usage:
 *   node cleanup-with-backup.mjs --project /path/to/project [--targets targets.json] [--dry-run] [--confirm]
 *
 * targets.json shape:
 *   { "items": [ { "path": "node_modules", "category": "...", "reason": "..." } ] }
 *
 * If --targets is omitted, runs scan-cleanup-candidates internally.
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { execSync } from "child_process";
import { basename, dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = {
    project: null,
    targets: null,
    dryRun: false,
    confirm: false,
    backupRoot: null,
    keepUncompressed: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--project") opts.project = resolve(argv[++i]);
    else if (arg === "--targets") opts.targets = resolve(argv[++i]);
    else if (arg === "--backup-root") opts.backupRoot = resolve(argv[++i]);
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--confirm") opts.confirm = true;
    else if (arg === "--keep-uncompressed") opts.keepUncompressed = true;
    else if (arg === "--help" || arg === "-h") opts.help = true;
  }
  return opts;
}

function usage() {
  console.log(`Usage: node cleanup-with-backup.mjs --project <path> [options]

Options:
  --targets <file.json>   Cleanup manifest (default: scan project)
  --backup-root <path>    Override backup parent directory
  --dry-run               Plan only; no copy/delete/zip
  --confirm               Required to delete originals after backup
  --keep-uncompressed     Keep folder after creating zip
`);
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function pathSize(targetPath) {
  let total = 0;
  const stack = [targetPath];
  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = join(current, entry.name);
      try {
        if (entry.isDirectory()) stack.push(full);
        else total += statSync(full).size;
      } catch {
        // skip
      }
    }
  }
  return total;
}

function loadTargets(projectPath, targetsFile) {
  if (targetsFile) {
    const parsed = JSON.parse(readFileSync(targetsFile, "utf-8"));
    return parsed.items || parsed.candidates || [];
  }

  const scanScript = join(__dirname, "scan-cleanup-candidates.mjs");
  const out = execSync(`node "${scanScript}" "${projectPath}" --json`, { encoding: "utf-8" });
  const scanned = JSON.parse(out);
  return scanned.candidates || [];
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function copyIntoBackup(projectPath, backupFilesDir, item) {
  const src = join(projectPath, item.path);
  const dest = join(backupFilesDir, item.path);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true, force: true, dereference: false });
  return pathSize(dest);
}

function createZip(sourceDir, zipPath) {
  const parent = dirname(sourceDir);
  const folderName = basename(sourceDir);
  execSync(`cd "${parent}" && zip -rq "${zipPath}" "${folderName}"`, { stdio: "pipe" });
  return statSync(zipPath).size;
}

function verifyZipContains(zipPath, relativePaths) {
  const listing = execSync(`unzip -l "${zipPath}"`, { encoding: "utf-8" });
  const missing = relativePaths.filter((p) => !listing.includes(`files/${p}`) && !listing.includes(`${p}/`));
  return missing;
}

async function renderBackupReadme(payload) {
  const renderScript = join(__dirname, "render-backup-readme.mjs");
  return execSync(`node "${renderScript}"`, {
    input: JSON.stringify(payload),
    encoding: "utf-8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.project) {
    usage();
    process.exit(opts.help ? 0 : 1);
  }

  if (!existsSync(opts.project) || !statSync(opts.project).isDirectory()) {
    console.error(`Project directory not found: ${opts.project}`);
    process.exit(1);
  }

  const projectPath = resolve(opts.project);
  const projectName = basename(projectPath);
  const items = loadTargets(projectPath, opts.targets).filter((item) => item.path);

  if (items.length === 0) {
    console.log("No cleanup targets found. Nothing to do.");
    return;
  }

  const existing = items.filter((item) => existsSync(join(projectPath, item.path)));
  const missing = items.filter((item) => !existsSync(join(projectPath, item.path)));

  const backupParent = opts.backupRoot || join(projectPath, ".project-cleanup-backups");
  const backupDirName = `${timestampSlug()}-${projectName}`;
  const backupDir = join(backupParent, backupDirName);
  const backupFilesDir = join(backupDir, "files");
  const archivePath = `${backupDir}.zip`;
  const commandLine = process.argv.join(" ");

  console.log(`Project: ${projectName}`);
  console.log(`Targets: ${existing.length} existing, ${missing.length} already absent`);
  if (opts.dryRun) console.log("Mode: DRY RUN (no changes)\n");

  for (const item of existing) {
    const size = pathSize(join(projectPath, item.path));
    console.log(`  - ${item.path} (${formatBytes(size)})`);
  }

  if (opts.dryRun) {
    console.log(`\nBackup would be written to: ${backupDir}`);
    console.log(`Archive would be created at: ${archivePath}`);
    console.log("\nRe-run with --confirm (without --dry-run) to execute.");
    return;
  }

  mkdirSync(backupFilesDir, { recursive: true });

  let bytesBackedUp = 0;
  const backedUp = [];

  for (const item of existing) {
    const src = join(projectPath, item.path);
    try {
      const bytes = copyIntoBackup(projectPath, backupFilesDir, item);
      bytesBackedUp += bytes;
      backedUp.push({ ...item, bytes });
      console.log(`Backed up: ${item.path}`);
    } catch (err) {
      console.error(`Backup failed for ${item.path}: ${err.message}`);
      console.error("Stopping before any deletion. Partial backup at:", backupDir);
      process.exit(1);
    }
  }

  const readmePayload = {
    projectName,
    projectPath,
    timestamp: new Date().toISOString(),
    archivePath,
    backupDir,
    backupParent,
    items: backedUp.map(({ path, category, reason }) => ({ path, category, reason })),
    itemCount: backedUp.length,
    bytesBackedUp,
    commandLine,
  };

  let readme;
  try {
    readme = await renderBackupReadme(readmePayload);
  } catch (err) {
    console.error("Failed to render BACKUP.md:", err.message);
    process.exit(1);
  }

  writeFileSync(join(backupDir, "BACKUP.md"), readme, "utf-8");
  console.log(`Wrote ${join(backupDir, "BACKUP.md")}`);

  let archiveSize = 0;
  try {
    archiveSize = createZip(backupDir, archivePath);
    console.log(`Created archive: ${archivePath} (${formatBytes(archiveSize)})`);
  } catch (err) {
    console.error("Zip failed:", err.message);
    console.error("Uncompressed backup kept at:", backupDir);
    console.error("Originals were NOT deleted.");
    process.exit(1);
  }

  const missingInZip = verifyZipContains(archivePath, backedUp.map((i) => i.path));
  if (missingInZip.length > 0) {
    console.error("Zip verification failed. Missing entries:", missingInZip.join(", "));
    console.error("Originals were NOT deleted.");
    process.exit(1);
  }

  if (!opts.keepUncompressed) {
    rmSync(backupDir, { recursive: true, force: true });
    console.log("Removed uncompressed backup folder (zip retained).");
  }

  if (!opts.confirm) {
    console.log("\nBackup complete. Originals kept because --confirm was not passed.");
    console.log(`Archive: ${archivePath}`);
    console.log("Re-run with --confirm to delete backed-up paths from the project.");
    return;
  }

  for (const item of backedUp) {
    const target = join(projectPath, item.path);
    try {
      rmSync(target, { recursive: true, force: true });
      console.log(`Removed: ${item.path}`);
    } catch (err) {
      console.error(`Failed to remove ${item.path}: ${err.message}`);
    }
  }

  writeFileSync(
    join(dirname(archivePath), `${backupDirName}-SUMMARY.md`),
    `# Cleanup summary\n\nArchive: \`${archivePath}\`\n\nOpen the zip and read \`BACKUP.md\` inside for full restore instructions.\n\nRemoved ${backedUp.length} paths (${formatBytes(bytesBackedUp)} backed up, ${formatBytes(archiveSize)} compressed).\n`,
    "utf-8",
  );

  console.log("\nCleanup complete.");
  console.log(`Archive: ${archivePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
