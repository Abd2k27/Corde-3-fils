# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"La corde à trois fils" — a French-language PWA for a couple (two fixed players, `a` and `b`, configured in `js/config.js`) to work through weekly Bible-study "parcours" together: read a passage, find a keyword, fill in a memory verse, answer questions about themselves *and guess the partner's answers*, then reveal and score. Also has a prayer journal, question of the day, promises, time-locked letters, a photo "histoire", bilans, and user-created weeks. All UI text and code comments are in French — keep it that way.

## Running

No build step, no dependencies, no tests, no linter. Plain HTML/CSS/vanilla JS served statically (`.nojekyll` → deployed via GitHub Pages). To run locally, serve the directory over HTTP (ES module + Firebase imports won't work from `file://`):

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Useful `js/config.js` switches for testing:
- `mode: "local"` — uses `localStorage` instead of Firebase; open two tabs to play both players (tabs sync via the `storage` event).
- `unlockAll: true` — unlock every week instead of requiring both players to finish the previous one.
- `fetchBibleOnline` — fetch exact Louis Segond 1910 text from `api.getbible.net` (cached in localStorage), falling back to the text embedded in content files.

## Architecture

**Script loading order matters** (`index.html`): classic scripts populate globals in sequence — `APP_CONFIG` → `PARCOURS` (content files push into `window.PARCOURS`) → `SOIR_QUESTIONS` → local `Store` → `Bible` → `app.js` (IIFE). `firebase-store.js` is a `type="module"` loaded last; in firebase mode it replaces `window.Store` and fires `store-ready`, which `app.js` waits for before booting.

**Store abstraction** (`js/store.js`, `js/firebase-store.js`): both implement the same interface — `init`, `get(path)`, `list(prefix)`, `set`, `remove`, `subscribe`, plus `getBlob/setBlob/removeBlob` for photos (kept separate because they're heavy). All app state is a flat key/value map keyed by slash paths. In Firebase, each key is a doc in the `kv` collection (`{path, v, at}`, doc id = path with `/` → `__`), loaded in full via a single `onSnapshot`; photos live in the `blobs` collection. `firestore.rules` restricts access to the couple's two Google emails (the repo copy has placeholder emails; the real ones are set in the Firebase console). Firestore writes are raced against an 8 s timeout (offline writes never settle) and report via `store-pending` / `store-synced` / `store-error` window events; `guardStore()` in `app.js` wraps all Store writes to toast on failure. Firebase SDK is imported from gstatic CDN (v10.12.2).

Key prefixes: `members/{uid}` (uid → player a/b), `progress/{weekId}/{a|b}`, `joker/{weekId}/{player}`, `prayers/`, `soir/`, `promises/`, `letters/`, `story/`, `custom/` (user-created weeks), `soirq/` (couple-proposed questions of the day — each `soir/{day}/{player}` answer stores its question `q` so history stays stable), `idees/` + `idees-tirage` (date-idea jar and current draw), `dates/` (anniversaries/countdowns). Reading plan: `lecture-plan` (active plan id) and `lecture/{planId}/{day}/{player}` = `{at, note}`; plans are generated in `js/plans.js` (plan id + day split are storage keys — add new plans, don't edit existing ones). Day N+1 unlocks only when both read day N; chapter text comes from the getBible API via `Bible.chapter()`. Per-device data (drafts of answers `bc-draft-*`, guide seen, selected parcours, bible cache) stays in `localStorage` and is never synced — answers are only shared on submit so the partner can't peek.

**Content** (`js/content.js`, `js/parcours/*.js`): each file pushes a parcours `{id, emoji, title, short, desc, weeks[]}`. A week has `passages` (with `book` number for the getBible API, `chapter`, and embedded `text` by verse), `keyword`, `memo` (blanks marked with `[brackets]` + `distractors`), `questions` (types: `echelle` 1–10, `tupref` A/B, `choix`, `ouverte` — `ouverte` has no guessing), `defi`, `priere`. Each week has an explicit, fixed `id` in its file (`"1"`…`"7"` for the legacy `couple` parcours, `"<parcoursId>-<n>"` elsewhere) — it's the storage key for progress, so never change an existing id; new weeks get a new unique id, and weeks can be reordered freely (`n` is positional). `app.js` warns in the console on missing/duplicate ids. A synthetic `perso` parcours is built at runtime from `custom/` entries.

**Layout**: below 1000px a floating bottom nav (`nav()`, 5 tabs — other sections live in « Plus »); at ≥1000px `render()` adds `body.with-nav` and `drawSide()` fills the glass sidebar `#side` (in `index.html`) with every section, and `#app[data-page]` (set by the router) drives per-page content width. Pages with two columns on desktop wrap content in `.home-grid`, `.split`, or `.reading-layout`.

**App** (`js/app.js`): a single IIFE with a hash router (`#/semaine/<id>`, `#/journal`, `#/soir`, `#/promesses`, `#/lettres`, `#/histoire`, `#/bilan/<pid>`, `#/plus`, `#/creer`, `#/guide`, `#/joueur`). Each `renderX()` rewrites `#app` innerHTML from template strings and binds handlers; always escape user content with `esc()`. Styling (`css/style.css`) is a "liquid glass" look: translucent blurred surfaces over an animated gradient on `body::before`; colours/glass values are tokens on `:root`. Dark mode = `html[data-theme="dark"]` overrides at the end of the CSS; the attribute is set by an inline script in `index.html` (no flash) and `applyTheme()` in `app.js` (modes auto / soir 20h–7h / light / dark, stored in `localStorage` `bc-theme`). Transient UI state lives in the `ui` object. A week is a 6-step flow (`STEPS`); `onStoreChange` re-renders on remote updates only on certain screens and skips if an input/textarea is focused, to avoid clobbering typing.
