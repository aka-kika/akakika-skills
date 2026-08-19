<!--
The doc that answers a user before they email. Lead with the questions people
actually ask; add to it as real ones come in.
-->

# akakika-skills — Support

**For:** the rolling collection on `main` · **Updated:** 2026-08-19

## Getting help

<!-- SF Symbol: lifepreserver -->
- Found a bug? [Open an issue](https://github.com/aka-kika/akakika-skills/issues/new/choose) — the bug-report template walks you through it.
- Question not answered here? Browse the collection at [akakika-skills.vercel.app](https://akakika-skills.vercel.app) or its [FAQ](https://akakika-skills.vercel.app/#faq).

## Frequently asked

<!-- SF Symbol: questionmark.circle -->
### What is an agent skill?

A folder with a `SKILL.md` file: YAML frontmatter (a name and a description that
begins with "Use when…") followed by the actual guidance — rules, code,
checklists. Skill-aware agents read the frontmatter to decide relevance, then
load the body on demand. No build step, no dependency.

### Which agents work with these skills?

Claude Code, Codex, Cursor, Grok, Goose, and anything else that reads the
`SKILL.md` format. You can also just open a skill and paste the part you need.

### How do I install everything?

On a Mac:

```bash
curl -fsSL https://raw.githubusercontent.com/aka-kika/akakika-skills/main/install.sh | bash
```

The installer clones the repo and symlinks all 40 skills into the skill
directories it knows about. Or copy a single skill folder by hand into
`~/.claude/skills/`, `.cursor/skills/`, or your project.

### Do I need a Mac?

Only for the one-liner installer and the macOS-specific skills. The
`SKILL.md` files are plain Markdown — the project-intelligence, session,
maintenance, and publishing skills work anywhere.

## Troubleshooting

<!-- SF Symbol: wrench.and.screwdriver -->
### The installer replaced a skill folder I already had

It didn't delete it — same-name folders are moved aside to `~/.skills-backup/`
before linking. Restore from there if you want the old one back.

### My agent doesn't pick up a skill

Check the skill folder actually sits in the directory your agent loads skills
from, and that the folder contains a `SKILL.md` (not a renamed file). Symlink
installs need the clone to still exist at its original path.

## Updating

<!-- SF Symbol: arrow.counterclockwise -->
Symlink installs track the clone: `git -C ~/Projects/akakika-skills pull`.
Re-run `./install.sh` only when new skill names appear.

## Uninstalling

<!-- SF Symbol: trash -->
Delete the symlinks from your agents' skill directories, then delete the clone.
Anything the installer backed up lives in `~/.skills-backup/`.
