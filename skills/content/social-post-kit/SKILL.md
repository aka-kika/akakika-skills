---
name: social-post-kit
description: Use when the user wants a ready-to-paste social post kit for an app, tool, or project launch or update — "make social posts", "launch posts", "post kit", "prep socials", "promote this". Produces one Markdown file with finished posts for X, Reddit, Instagram, LinkedIn, Threads, and short-form video, plus a pre-post checklist. Pull real facts from the project (repo, release, what it does, OS, links).
---

# Social Post Kit

Create one Markdown file that holds ready-to-paste launch/update posts for an app, tool, or project. It's a practical kit to copy from, not a campaign plan: open one file and post in minutes — each platform has finished text in a code block, plus light notes on where to post and what to attach.

## When to use

- "make social posts for this app"
- "create a social kit / post kit"
- "prep the socials for [app]"
- "launch posts for [project]"
- "help me promote this"

Not for: the long-form blog post itself, actually posting to networks, or paid-ad copy.

## Voice

Write in the user's voice. If they haven't defined one, default to **calm, build-in-public, low-ego** — it consistently outperforms hype for indie launches:

- The energy is "here's a small thing I made," not "introducing the future of X."
- Personal, understated, a little warm. Plain English over startup-speak.

Per platform:

- **X / Threads / Instagram:** casual, often lowercase, one light emoji is fine.
- **LinkedIn:** still personal and calm, just cleaner sentences.
- **Reddit:** honest and low-ego — "a small thing I made, feedback welcome." Reddit punishes ads.

> Adapt this to the user's actual voice if they have one. The structure below works for any voice.

## Tone rules

Use: short lines, direct verbs, concrete details, plain English, calm confidence, the real story
(the friction that made the tool worth building), one emoji where it fits.

Avoid: startup/SaaS language, fake hype, exaggerated claims, words like "revolutionary",
"game-changing", "seamless", "powerful" (unless truly earned), hashtag spam, exclamation-mark
piles, and pretending the app is more finished than it is.

Wording that lands: "some nights you just want to start something", "a tiny, calm macOS app
for…", "it never overwrites anything", "small on purpose", "free + open source", "feedback
genuinely welcome", "made on a late night, for late nights".

## Inspect first

Before writing, gather real facts. Prefer project files and the user's input over inference:

- repo URL and current handle (confirm with `gh repo view <owner>/<app> --json url,visibility`)
- latest release tag + direct download/DMG link (`releases/latest/download/<asset>` or the release page)
- what the app does, who it is for, the friction it solves (check `README.md`, docs, `AGENTS.md`)
- platform + minimum OS (state it honestly — a high requirement narrows the audience)
- free / open source + license; signed / notarized status
- the best visual: a screenshot, and especially any demo GIF or screen-recording (motion > static)
- whether this is their first app or one of several (don't reuse a "my first app" angle if it isn't)

If a fact is unknown, write `TODO: Confirm …` instead of inventing it. Never invent repo URLs,
versions, or claims.

## Output file

Create one Markdown file named from the app (default to the user's Desktop, or wherever they ask):

```text
~/Desktop/<App>-social-posts.md
```

If a file with that name already exists, ask before overwriting (or write `<App>-social-posts-v2.md`).

## Required structure

Match this shape (a proven launch-kit format):

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
**1. Short-form video (Reels / TikTok / Shorts).** Best for a 15–30s clip (hook → show it → close + link).
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

## Tailoring rules

- **Lead with the app's strongest hook.** If it is visual/animated, make every section push video.
  If it is a quiet utility, lean on the friction it removes.
- **First app vs not.** Use the "my first app, rough in places, help welcome" angle only if true.
  For a later app, use "another small thing I made" and skip the beginner framing.
- **OS / requirements honesty.** Always state the real minimum OS and any rough edges up front —
  it saves disappointed comments and fits a low-ego voice.
- **Links.** Use the project's current handle. Include the direct download link where it helps
  (X bio / Reddit comment / checklist), not buried.
- **Two to three hashtags max.** No walls of tags.

## Quality check

Before saving, confirm:

- Does each post sound like the user (or the chosen voice) — calm, personal, not an ad?
- Is every post copy-paste ready inside a code block?
- Are the repo/release/download links real and current?
- Is the OS requirement and free/OSS status stated honestly?
- Did it avoid hype words, hashtag spam, and overclaiming?
- Is the best visual named, and is video pushed if the app is visual?

## Final response

After creating the file, tell the user:

- where it was saved
- what app/links were used
- anything tuned for this app (the hook, OS caveat, first-app-or-not)
- any `TODO: Confirm …` left in the file

Offer to copy the demo GIF / screenshot next to the file, and to record a cleaner video take if relevant.
