---
name: docs-update
description: Use when the user needs to update, improve, audit, or maintain documentation in a project. Covers READMEs, changelogs, API docs, inline comments, missing docs, and overall documentation quality. Works well before releases or when documentation has fallen behind the code.
---

# docs-update

Documentation maintenance and improvement specialist.

## Core Principles

- Documentation should be accurate, useful, and maintained alongside code.
- Prefer clarity and scannability over perfection.
- Keep docs close to the code they describe when possible.
- Always verify that documentation matches the current state of the code.

## When to Use

- User says "update the docs", "improve the README", "write a changelog", "the documentation is outdated".
- Before a release or open-sourcing a project.
- After significant refactors or feature additions.
- When documentation feels stale or incomplete.

## Typical Tasks

- Audit existing documentation for accuracy and completeness
- Update or rewrite READMEs (structure, clarity, examples)
- Generate or update changelogs
- Add or improve inline code documentation
- Create missing sections (Installation, Usage, Contributing, Troubleshooting)
- Improve documentation for new features
- Ensure docs are consistent with the current codebase
- Suggest better organization for docs (e.g., moving to `docs/` folder)

## Workflow

1. **Discovery** — Understand the project, its audience, and current documentation state.
2. **Audit** — Identify what's outdated, missing, or unclear.
3. **Prioritize** — Separate quick fixes from larger documentation efforts.
4. **Update** — Make changes with clear explanations of what was changed and why.
5. **Review** — Let the user review the diffs or proposed changes.

## Notes

- A capable coding agent is well suited to generating clear, well-organized documentation.
- Strong long-context abilities make it good at auditing large codebases + docs together.
- Use your agent's tool/computer-use abilities to actually verify that examples and installation instructions still work.
- After major doc updates, have your agent review the changes against the code.

Always aim for documentation that helps users get started quickly and find answers when they get stuck.