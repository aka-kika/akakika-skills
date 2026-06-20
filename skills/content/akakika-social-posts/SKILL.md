---
name: akakika-social-posts
description: >-
  Use when she says "make social posts", "social kit", "launch posts", "post kit",
  "posts for my app", "prep socials", "promote this", or "like the GrokBar/Seedling
  social posts". Generates a ready-to-paste social post kit (a Markdown file on the
  Desktop) for an app, tool, or project launch or update — in Kika's calm akakika voice.
  Covers X, Reddit, Instagram, LinkedIn, Threads, short-form video, and a pre-post
  checklist. Pull real facts from the project (repo, release, what it does, OS, links).
metadata:
  short-description: Create a Desktop social-post kit for an app/project launch
---

# Social Posts

> Written for akakika.com — adapt the domain, paths, and voice to your own site.

Create one Markdown file that holds ready-to-paste launch/update posts for an app, tool, or
project Kika built. It is a practical kit she can copy from, not a campaign plan.

The output should let her open one file and post in minutes: each platform has finished text
in a code block, plus light notes on where to post and what image/video to attach.

## When To Use

Use this skill when Kika says something like:

- make social posts for this app
- create a social kit / post kit
- prep the socials for [app]
- launch posts for [project]
- posts like the GrokBar / Seedling ones
- help me promote this

Do not use this for the long-form blog note itself, for actually posting to
networks, or for paid-ad copy.

## Voice

Write like Kika / `akakika.com`: personal, calm, understated, build-in-public, a little warm.
She makes "tiny, calm" tools and talks about them plainly. The energy is "here's a small thing
I made," not "introducing the future of X."

Per platform:

- **X / Threads / Instagram:** casual, often lowercase, one light emoji is fine.
- **LinkedIn:** still personal and calm, just cleaner sentences.
- **Reddit:** honest and low-ego — "a small thing I made, feedback welcome." Reddit punishes ads.

## Tone Rules

Use: short lines, direct verbs, concrete details, plain English, calm confidence, the real story
(the friction that made the tool worth building), one emoji where it fits.

Avoid: startup/SaaS language, fake hype, exaggerated claims, words like "revolutionary",
"game-changing", "seamless", "powerful" (unless truly earned), hashtag spam, exclamation-mark
piles, and pretending the app is more finished than it is.

Prefer wording like: "some nights you just want to start something", "a tiny, calm macOS app
for…", "it never overwrites anything", "small on purpose", "free + open source", "feedback
genuinely welcome", "made on a late night, for late nights".

## Inspect First

Before writing, gather real facts. Prefer project files and Kika's input over inference:

- repo URL and current GitHub handle (she is **aka-kika** — confirm with `gh repo view <owner>/<app> --json url,visibility`)
- latest release tag + direct download/DMG link (`releases/latest/download/<asset>` or the release page)
- what the app does, who it is for, the friction it solves (check `README.md`, `docs/blog-info.md`, `AGENTS.md`)
- platform + minimum OS (state it honestly — a high requirement narrows the audience)
- free / open source + license; signed / notarized status
- the best visual: a screenshot, and especially any demo GIF or screen-recording (motion > static)
- whether this is her first app or one of several (don't reuse a "my first app" angle if it isn't)

If a fact is unknown, write `TODO: Confirm …` instead of inventing it. Never invent repo URLs,
versions, or claims.

## Output File

Create one Markdown file on the Desktop, named from the app:

```text
~/Desktop/<App>-social-posts.md
```

If Kika gives a different path or name, use that. If a file with that name already exists, ask
before overwriting (or write `<App>-social-posts-v2.md`).

## Required Structure

Match this shape (this is the proven format from the GrokBar + Seedling kits):

````md
# <App> — Social Post Kit

Repo: **<repo url>**
Release: **<release url>**
Download: **<direct download/DMG url, or TODO>**

> Visual tip: name the single best asset to attach (screenshot, and especially a demo GIF /
> short screen-recording). If the app is animated or visual, push video hard — motion out-reaches
> static every time.

> Honest caveats (only if true): high OS requirement, "first app / rough in places", beta, etc.

> Optional build-story angle: if it was built with an AI coding agent, note it here as an option,
> kept light — the app should lead, not the AI.

---

## 🐦 X / Twitter
### Option A — the story (recommended)
```
<3–5 lines: the friction → what it is → free/OSS → repo link>
```
### Option B — short & punchy
```
<2–3 lines + repo link>
```
### Option C — thread (optional)
```
<numbered 1/ 2/ 3/ 4/ telling the build story, ending with the link>
```
**Hashtags (pick 2–3):** `#macOS` `#SwiftUI` `#indiedev` `#buildinpublic` `#opensource`

---

## 👾 Reddit
> Where to post (best fits) + etiquette (honest, free/OSS, ask for feedback, reply to comments).
### Title options
```
<two honest, non-ad title options>
```
### Body (recommended)
```
<a calm, honest post: what it is, the friction, free/OSS + license, OS requirement, ask for feedback, repo link>
```
> Follow-up: drop the direct download link as a top comment.

---

## 📸 Instagram (caption for a Reel or the demo GIF)
> Best as a short screen-recording; link goes in bio (IG blocks caption links).
```
<warm, personal caption + a few tasteful hashtags>
```

---

## 💼 LinkedIn
```
<calm, personal, slightly cleaner sentences; the idea, why it's small, free/OSS, repo link>
```
> Tip: post the media, reply to early comments (first hour matters).

---

## 🧵 Threads
```
<casual, lowercase, 2–3 lines + link — basically free reach from IG>
```

---

## 🎯 Other platforms — what's actually worth it
**1. Short-form video (Reels / TikTok / Shorts).** Beats for a 15–30s clip (hook → show it → close + link).
**2. Bluesky.** Reuse the Threads/X text. Free.
**3. Product Hunt — later, not today.** Save for a polished release with a video + a couple of users.
> Suggested order: Instagram → Threads → LinkedIn → X. Reddit when there's an hour to reply. Don't blast everywhere at once.

---

## ✅ Pre-post checklist
- [ ] Repo is public
- [ ] Attach the best visual (demo GIF / screen-recording / screenshot)
- [ ] Say it's free + open source (+ license) and state the OS requirement
- [ ] Be ready to reply to early comments (first hour matters most)
- [ ] Optional: pin the X post / record a cleaner video take
````

## Tailoring Rules

- **Lead with the app's strongest hook.** If it is visual/animated, make every section push video.
  If it is a quiet utility, lean on the friction it removes.
- **First app vs not.** Use the "my first app, rough in places, help welcome" angle only if true.
  For a later app, use "another small thing I made" and skip the beginner framing.
- **OS / requirements honesty.** Always state the real minimum OS and any rough edges up front —
  it saves disappointed comments and fits her low-ego voice.
- **Links.** Use the current `aka-kika` handle. Include the direct download link where it helps
  (X bio/Reddit comment/checklist), not buried.
- **Two to three hashtags max.** No walls of tags.

## Quality Check

Before saving, confirm:

- Does each post sound like Kika — calm, personal, not an ad?
- Is every post copy-paste ready inside a code block?
- Are the repo/release/download links real and current (aka-kika)?
- Is the OS requirement and free/OSS status stated honestly?
- Did it avoid hype words, hashtag spam, and overclaiming?
- Is the best visual named, and is video pushed if the app is visual?

## Final Response

After creating the file, tell Kika:

- where it was saved
- what app/links were used
- anything tuned for this app (the hook, OS caveat, first-app-or-not)
- any `TODO: Confirm …` left in the file

Offer to copy the demo GIF / screenshot next to the file, and to record a cleaner video take if relevant.
