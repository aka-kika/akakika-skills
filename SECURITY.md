<!--
The page GitHub links from the "Report a vulnerability" button and the security
tab. Tell a finder exactly how to reach you privately and what to expect.
-->

# Security Policy

**Project:** akakika-skills · **Updated:** 2026-08-19

## Supported versions

<!-- SF Symbol: checkmark.shield -->
This is a rolling collection — only the current `main` branch is supported.
There are no versioned releases to backport to.

| Version | Supported |
|---|---|
| `main` | yes |

## Reporting a vulnerability

<!-- SF Symbol: lock.shield -->
Use GitHub's private **[Report a vulnerability](https://github.com/aka-kika/akakika-skills/security/advisories/new)** flow.

Please **do not** open a public issue for a security problem.

## What to include

<!-- SF Symbol: list.bullet.clipboard -->
- {{What the issue is and the impact — what an attacker could do.}}
- {{Steps to reproduce, or a proof of concept.}}
- {{Affected skill or script — e.g. install.sh, a skill's bundled script.}}

## What to expect

<!-- SF Symbol: clock -->
- **Acknowledgement:** within {{e.g. 48 hours}}.
- **Assessment + plan:** within {{e.g. 7 days}}.
- **Fix + disclosure:** {{how you coordinate a release and credit the reporter.}}

## Scope

<!-- SF Symbol: scope -->
- In scope: `install.sh`, scripts bundled inside skills (`skills/**/scripts/`),
  and the site under `site/`.
- Out of scope: the AI agents that consume these skills, third-party services,
  and issues requiring an already-compromised machine.

## Recognition

<!-- SF Symbol: star -->
{{Whether you credit reporters in release notes / a thanks file, and how.}}
