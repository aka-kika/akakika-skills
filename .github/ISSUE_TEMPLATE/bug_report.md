---
name: Bug report
about: A skill is wrong, broken, or misfires
---

<!--
A good report = someone else can reproduce it from this text alone.
Fill in every {{placeholder}}; delete any section you don't need.
-->

# {{one-line summary of the bug}}

## What happens

<!-- SF Symbol: exclamationmark.bubble -->
{{Describe the problem in one or two sentences.}}

## Steps to reproduce

<!-- SF Symbol: list.number -->
1. {{First step.}}
2. {{Then this.}}
3. {{And this is where it breaks.}}

## Expected

<!-- SF Symbol: checkmark.circle -->
{{What you expected to happen.}}

## Actual

<!-- SF Symbol: xmark.circle -->
{{What actually happened. Include exact error text if any.}}

## Environment

<!-- SF Symbol: gearshape -->
| Field | Value |
|---|---|
| Skill | {{skill name, e.g. macos-permissions-privacy}} |
| Agent | {{e.g. Claude Code 2.x / Cursor / Codex}} |
| OS | {{e.g. macOS 14.5}} |
| Install source | {{install.sh symlink / copied folder / pasted}} |

## Logs / screenshots

<!-- SF Symbol: doc.text.magnifyingglass -->
```
{{paste relevant agent output or error text}}
```

{{attach screenshots or a screen recording if it's visual}}

## Frequency & impact

<!-- SF Symbol: chart.bar -->
- Happens: {{every time / sometimes / once}}
- Workaround: {{none / describe it}}
- Severity: {{blocks me / annoying / minor}}
