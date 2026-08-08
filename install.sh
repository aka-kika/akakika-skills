#!/usr/bin/env bash
# install.sh — install every akakika skill into the agent skill dirs on this Mac.
#
# One-liner (after this file is on main):
#   curl -fsSL https://raw.githubusercontent.com/aka-kika/akakika-skills/main/install.sh | bash
#
# From a clone:
#   ./install.sh
#   ./install.sh --copy          # copy instead of symlink
#   ./install.sh --dry-run
#   ./install.sh --targets claude,grok,agents
#
# Env:
#   AKAKIKA_SKILLS_DIR   clone location (default: ~/Projects/akakika-skills)
#   AKAKIKA_REPO_URL     git remote (default: https://github.com/aka-kika/akakika-skills.git)

set -euo pipefail

REPO_URL="${AKAKIKA_REPO_URL:-https://github.com/aka-kika/akakika-skills.git}"
REPO_DIR="${AKAKIKA_SKILLS_DIR:-$HOME/Projects/akakika-skills}"

MODE="symlink"   # symlink | copy
DRY_RUN=0
TARGET_FILTER="" # empty = all

usage() {
  cat <<'EOF'
Usage: install.sh [options]

  --symlink     Link skills into agent dirs (default; updates follow git pull)
  --copy        Copy skill folders instead of symlinking
  --dry-run     Print actions without changing anything
  --targets L   Comma list: claude,agents,grok,goose,cursor,codex,desktop-commander
  --dir PATH    Clone / repo directory (default: ~/Projects/akakika-skills)
  -h, --help    Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --symlink) MODE="symlink"; shift ;;
    --copy) MODE="copy"; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --targets) TARGET_FILTER="${2:-}"; shift 2 ;;
    --dir) REPO_DIR="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

# Resolve script location if we were invoked from a local clone (not curl | bash)
SCRIPT_SOURCE=""
if [[ -n "${BASH_SOURCE[0]:-}" && "${BASH_SOURCE[0]}" != "bash" && "${BASH_SOURCE[0]}" != "-" ]]; then
  # When piped to bash, BASH_SOURCE is often "bash" or empty-ish; ignore that.
  if [[ -f "${BASH_SOURCE[0]}" ]]; then
    SCRIPT_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  fi
fi

# Prefer the directory that contains this script if it looks like the repo
if [[ -n "$SCRIPT_SOURCE" && -d "$SCRIPT_SOURCE/skills" && -f "$SCRIPT_SOURCE/README.md" ]]; then
  REPO_DIR="$SCRIPT_SOURCE"
fi

run() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "  [dry-run] $*"
  else
    "$@"
  fi
}

ensure_repo() {
  if [[ -d "$REPO_DIR/.git" && -d "$REPO_DIR/skills" ]]; then
    echo "→ Updating $REPO_DIR"
    if [[ "$DRY_RUN" -eq 1 ]]; then
      echo "  [dry-run] git -C \"$REPO_DIR\" pull --ff-only"
    else
      # ff-only so a dirty/divergent clone fails loudly instead of rewriting history
      if ! git -C "$REPO_DIR" pull --ff-only; then
        echo "  ⚠ git pull failed (local changes or divergence). Using existing tree." >&2
      fi
    fi
    return
  fi

  if [[ -d "$REPO_DIR/skills" && ! -d "$REPO_DIR/.git" ]]; then
    echo "→ Using existing tree at $REPO_DIR (not a git clone)"
    return
  fi

  echo "→ Cloning $REPO_URL → $REPO_DIR"
  run mkdir -p "$(dirname "$REPO_DIR")"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "  [dry-run] git clone \"$REPO_URL\" \"$REPO_DIR\""
  else
    git clone "$REPO_URL" "$REPO_DIR"
  fi
}

# name → path under $HOME
declare -a TARGET_NAMES
declare -a TARGET_PATHS

add_target() {
  TARGET_NAMES+=("$1")
  TARGET_PATHS+=("$2")
}

add_target "claude"            "$HOME/.claude/skills"
add_target "agents"            "$HOME/.agents/skills"
add_target "grok"              "$HOME/.grok/skills"
add_target "goose"             "$HOME/.config/goose/skills"
add_target "cursor"            "$HOME/.cursor/skills"
add_target "codex"             "$HOME/.codex/skills"
add_target "desktop-commander" "$HOME/.desktop-commander/skills"

target_enabled() {
  local name="$1"
  if [[ -z "$TARGET_FILTER" ]]; then
    return 0
  fi
  # shellcheck disable=SC2076
  [[ ",${TARGET_FILTER}," == *",${name},"* ]]
}

install_skills() {
  local src="$REPO_DIR/skills"
  if [[ ! -d "$src" ]]; then
    echo "No skills/ directory at $REPO_DIR" >&2
    exit 1
  fi

  local backup_root=""
  if [[ "$DRY_RUN" -eq 0 ]]; then
    backup_root="$HOME/.skills-backup/akakika-install-$(date +%Y%m%d-%H%M%S)"
  else
    backup_root="$HOME/.skills-backup/akakika-install-DRYRUN"
  fi

  local skill_count=0
  local installed=0
  local backed_up=0
  local already=0
  local i name dest_root dest skill_md skill_dir skill_name

  # skills/<category>/<skill-name>/SKILL.md
  while IFS= read -r skill_md; do
    skill_dir="$(dirname "$skill_md")"
    skill_name="$(basename "$skill_dir")"
    [[ -z "$skill_name" || "$skill_name" == "." || "$skill_name" == ".." ]] && continue
    skill_count=$((skill_count + 1))

    for i in "${!TARGET_NAMES[@]}"; do
      name="${TARGET_NAMES[$i]}"
      dest_root="${TARGET_PATHS[$i]}"
      target_enabled "$name" || continue

      dest="$dest_root/$skill_name"
      run mkdir -p "$dest_root"

      if [[ -L "$dest" ]]; then
        current="$(readlink "$dest" || true)"
        if [[ "$MODE" == "symlink" && "$current" == "$skill_dir" ]]; then
          already=$((already + 1))
          continue
        fi
        run rm "$dest"
      elif [[ -e "$dest" ]]; then
        bak_dest="$backup_root/$name/$skill_name"
        run mkdir -p "$(dirname "$bak_dest")"
        run mv "$dest" "$bak_dest"
        backed_up=$((backed_up + 1))
      fi

      if [[ "$MODE" == "symlink" ]]; then
        run ln -s "$skill_dir" "$dest"
      else
        run cp -R "$skill_dir" "$dest"
      fi
      installed=$((installed + 1))
    done
  done < <(find "$src" -type f -name 'SKILL.md' | LC_ALL=C sort)

  echo ""
  echo "akakika-skills install complete"
  echo "  repo:       $REPO_DIR"
  echo "  skills:     $skill_count"
  echo "  mode:       $MODE"
  echo "  installed:  $installed"
  echo "  already ok: $already"
  echo "  backed up:  $backed_up"
  if [[ "$backed_up" -gt 0 ]]; then
    echo "  backup:     $backup_root"
  fi
  echo ""
  echo "Per-target links/copies from this repo:"
  for i in "${!TARGET_NAMES[@]}"; do
    name="${TARGET_NAMES[$i]}"
    dest_root="${TARGET_PATHS[$i]}"
    target_enabled "$name" || continue
    if [[ ! -d "$dest_root" ]]; then
      printf '  %2s  %s  (missing)\n' "—" "$name → $dest_root"
      continue
    fi
    count=0
    while IFS= read -r entry; do
      [[ -z "$entry" ]] && continue
      if [[ -L "$entry" ]]; then
        link="$(readlink "$entry" || true)"
        case "$link" in
          "$src"/*) count=$((count + 1)) ;;
        esac
      elif [[ -f "$entry/SKILL.md" ]]; then
        base="$(basename "$entry")"
        if find "$src" -type d -name "$base" 2>/dev/null | head -1 | grep -q .; then
          count=$((count + 1))
        fi
      fi
    done < <(find "$dest_root" -mindepth 1 -maxdepth 1 2>/dev/null)
    printf '  %2d  %s\n' "$count" "$name → $dest_root"
  done

  echo ""
  echo "Update later:  git -C \"$REPO_DIR\" pull"
  if [[ "$MODE" == "symlink" ]]; then
    echo "Symlinks track the clone — pull is enough; re-run install only for new skill names."
  else
    echo "Copy mode: re-run this script after pull to refresh agent dirs."
  fi
}

echo "akakika-skills installer"
echo "  mode: $MODE$([[ "$DRY_RUN" -eq 1 ]] && echo ' (dry-run)')"
ensure_repo
install_skills
