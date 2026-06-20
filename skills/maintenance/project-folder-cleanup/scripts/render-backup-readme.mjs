#!/usr/bin/env node
/**
 * Render BACKUP.md from template + manifest JSON on stdin.
 *
 * Usage:
 *   echo '{"projectName":"my-app",...}' | node render-backup-readme.mjs > BACKUP.md
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, "../assets/backup-readme.template.md");

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

function renderRow(item) {
  const safePath = item.path.replace(/\|/g, "\\|");
  const safeCategory = item.category.replace(/\|/g, "\\|");
  const safeReason = item.reason.replace(/\|/g, "\\|");
  return `| \`${safePath}\` | ${safeCategory} | ${safeReason} |`;
}

async function main() {
  const raw = await readStdin();
  const data = JSON.parse(raw);
  const template = readFileSync(templatePath, "utf-8");

  const itemRows = (data.items || []).map(renderRow).join("\n") || "| _(none)_ | | |";

  const output = template
    .replaceAll("{{PROJECT_NAME}}", data.projectName || "unknown")
    .replaceAll("{{PROJECT_PATH}}", data.projectPath || "")
    .replaceAll("{{TIMESTAMP}}", data.timestamp || new Date().toISOString())
    .replaceAll("{{ARCHIVE_PATH}}", data.archivePath || "")
    .replaceAll("{{BACKUP_DIR}}", data.backupDir || "")
    .replaceAll("{{BACKUP_PARENT}}", data.backupParent || "")
    .replaceAll("{{ITEM_ROWS}}", itemRows)
    .replaceAll("{{ITEM_COUNT}}", String(data.itemCount ?? data.items?.length ?? 0))
    .replaceAll("{{BYTES_BACKED_UP}}", formatBytes(data.bytesBackedUp || 0))
    .replaceAll("{{ARCHIVE_SIZE}}", data.archiveSize ? formatBytes(data.archiveSize) : "n/a")
    .replaceAll("{{COMMAND_LINE}}", data.commandLine || "n/a");

  process.stdout.write(output);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
