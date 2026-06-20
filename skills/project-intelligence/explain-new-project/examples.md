# Examples — explain-new-project

## File header (always in PROJECT_GUIDE.md)

```markdown
# Shop Helper — plain guide

> **Quick start** — read through "How you run it", then stop if that is enough.
> **The rest** — optional depth when you want the full picture.

---

## In one minute
...
```

## Short "In one minute" samples

**Mobile habit app:** This is an iPhone app built with SwiftUI. It helps you log daily habits and see streaks. Most of the screens live in one folder; settings and data storage are handled by Apple’s built-in tools in the project.

**Marketing site:** This is a website project. Pages are built as React components and published with Vercel. You edit text and layout in the `src` folder; pushing to GitHub can update the live site if that pipeline is set up.

## Learn block samples

**API**
> **Learn:** An *API* is how one program asks another for data or actions—like a waiter taking your order to the kitchen. Your app uses an API when it fetches prices or saves a login.

**Environment variable (.env)**
> **Learn:** An *environment variable* is a secret or setting stored outside the code (often in a `.env` file) so passwords are not pasted into files you share. The app reads them when it starts.

**Monorepo**
> **Learn:** A *monorepo* means several related apps or packages live in one Git repository—like several notebooks in one binder. Check which subfolder is the one you care about before running commands.

## "How you run it" sample

```markdown
## How you run it

1. Open Terminal in this project folder.
2. Run `npm install` (first time only).
3. Run `npm run dev`.
4. Open `http://localhost:5173` in your browser (or the URL the terminal shows).

If you see errors about `.env`, copy `.env.example` to `.env` and fill in the values from the README.

**Learn:** A *dev server* is a temporary copy of the site on your computer so you can preview changes before publishing.
```

## "Safe next steps" samples

1. Open `README.md` and compare it to what you see in the folders—note anything outdated.
2. Run the dev command from the README (often `npm run dev` or similar) and see if a browser page opens.
3. Change one visible label on the home screen, save, and confirm the page updates.
4. If something fails, copy the exact error message into chat—do not guess fixes.
