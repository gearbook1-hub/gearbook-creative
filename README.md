# GearBook Creative

GearBook's creative hub: a dashboard plus a set of Claude Code mods. Claude reads every reel Luke records, compares each moment against the library of motion graphics GearBook already has, pitches only what's missing, and builds nothing until Luke has approved it and picked a look.

Built for Luke and Matt. Everything marked `sample` is example data until real reels go through it.

**Live:** https://gearbook1-hub.github.io/gearbook-creative/

## What's on the hub

| Page | What it shows | From |
|---|---|---|
| `/` Overview | Who the posts are for, the three formats, what's next in the idea bank, the top posts, and M25 playing live | `data/social.json`, `data/content-ideas.json`, `data/posts.json` |
| `/ideas` Idea bank | The 15 post ideas by format (presenter bit, vibe reel, poster), with beats and notes, a "this week" shortlist kept in the browser, the "maybe later" list and the copy rules | `data/content-ideas.json`, `data/social.json` |
| `/feed` Feed | Everything posted on @gear.book with likes and comments, and the average per format | `data/posts.json` |
| `/library` Motion library | M25 live, M18 (demo, sample data) in its three looks, the build loop, and motion pitches to approve or pass | `data/pieces.json`, `data/ideas.json` |
| `/identity` Identity | The presenter bit, formats, who's on camera, voice, brand colour and type, and the gaps Luke still has to fill in | `data/social.json`, `lib/brand.ts` |

The social data comes from the main repo's `docs/marketing/social-identity.md` and `content-idea-bank.md` (gearbook1-hub/gearbook, drafts of 2026-10-16). Those docs are the source of truth: when they change, update the JSON here to match. The hub was first rebuilt from the reel "How the motion mod thinks" (spec in [docs/VIDEO_SPEC.md](docs/VIDEO_SPEC.md)); the scout, Pulse and build loop come from there.

**How pieces are made.** No video editor or animation framework. Each motion piece is a fully animated HTML page. `public/pieces/runtime.js` gives every piece one clock, so the same page loops on the hub, freezes on any frame for stills (`?t=2.5`), takes new words and numbers from the URL (`?props=`), and is recorded frame by frame to a 60 fps MP4 by `npm run render` in headless Edge or Chrome.

**M25, the signup reel,** was made as a Motion artifact on Matt's Claude account ("GearBook Signup Reel"). Its scenes, styles and images are copied unchanged into `public/pieces/M25-signup-explainer/film/`, and `film-kit.js` there is a small stand-in for the artifact's player with the same clock contract as `runtime.js`. It plays silent on the hub; the MP4 master with sound is in Drive. To refresh it after the artifact changes, copy its `modules` and `assets` again from the artifact's store. Its cream and topo ground, serif titles that arrive word by word and small tracked labels are the house style (`public/pieces/pieces.css`).

The hub wears the same house style: cream ground, bark ink, Roca headings from Matt's Adobe kit (Newsreader where the kit doesn't serve), Outfit text, Afacad Flux labels, amber for the one thing that matters and sage for done. Tokens are in `app/globals.css` and `lib/brand.ts`. Logos are the official files from the GearBook Drive (`Branding/Adobe/Full Length.svg` as `public/brand/gearbook-logo.svg`; the favicon is `Branding/Logo Variations/Social Media Cropped.png`); never redraw them.

**Making a new video:** see [docs/NEW_VIDEO.md](docs/NEW_VIDEO.md).

## The loop

```
Video, inspo or a request -> Check the catalog -> Log the idea -> [Approve or pass] -> 3 stills -> [Pick one]
  -> Build in code -> Check the render -> Into the library
```

| Step | Mod (skill in `.claude/skills/`) | Command |
|---|---|---|
| A reel comes in | `video-inbox` (12) | `npm run transcribe` |
| Read it, check the catalog, log and pitch | `motion-scout` (11) | `npm run scout -- S01` |
| Approve or pass | `pulse` (04) | "Approve or pass" on `/library`, then `node scripts/apply-decisions.mjs decisions.json` |
| 3 stills, pick one | `motion-stills` | `npm run stills -- M18-click-trail` |
| Build in code | `motion-build` | `public/pieces/<Mxx-name>/index.html` |
| Check the render | `render-check` | `npm run render:check` |
| Into the library | `motion-library` (07) | add to `data/pieces.json`, `npm run render` |
| Per-video table | `video-breakdown` (10) | in chat (from `data/`) |
| Brand values | `tokens` (01) | `lib/brand.ts`, `app/globals.css` |
| New libraries | `find-your-mods` (13) | a new skill plus a catalog in `data/` |

In Claude Code, the skills load automatically in this folder. Say "scout S01", "apply these Pulse decisions" or "make stills for I09".

## Structure

```
app/                     the hub (Next.js 16, static export)
  page.tsx               Overview
  ideas/  feed/  library/  identity/
components/              Site (top bar, sections, chips), IdeaBank (filter + shortlist), PieceFrame,
                         IdeaCards and PulseBoard (approve or pass motion pitches)
data/
  social.json            the social identity: audiences, formats, voice, rules, gaps
  content-ideas.json     the post idea bank
  posts.json             what's been posted, with likes and comments
  pieces.json            the motion library (M18 and M25 are real; the rest are sample catalog entries)
  sources.json           videos, inspo and requests, with transcripts
  ideas.json             every flagged motion moment: quote, catalog check, pitch, stills, build, render check
lib/                     types, data helpers (data.ts, social.ts), brand tokens, Pulse decisions (localStorage)
public/pieces/           the motion pieces: runtime.js, pieces.css (house style), topo.svg,
                         M18-click-trail/ (built here, three looks), M25-signup-explainer/ (the real reel, live, plus its MP4 preview)
scripts/                 setup-check, transcribe, scout, motion.mjs (recorder), render-stills / render-piece /
                         render-check, apply-decisions
.claude/skills/          one skill per mod, with its full prompt
inbox/                   videos/ and transcripts/ (git-ignored), inspo/
docs/VIDEO_SPEC.md       what the source video shows, panel by panel
screenshots/             the hub, for reference
```

## Set up on a new machine

Works on Windows, macOS and Linux. Needs Node 20+, git, and Edge or Chrome (for stills, renders and the render check). ffmpeg is needed for MP4 renders; Python 3 with `openai-whisper` only for transcribing reels.

```bash
git clone https://github.com/gearbook1-hub/gearbook-creative.git
```

```bash
cd gearbook-creative && npm install
```

```bash
npm run setup:check
```

`setup:check` lists what this machine has and gives the install command for anything missing (winget on Windows, Homebrew on a Mac). It never installs anything itself.

To push, sign in to GitHub as `gearbook1-hub` (or an account with write access) once:

```bash
gh auth login
```

```bash
gh auth setup-git
```

Optional: copy `.env.example` to `.env.local` and add `ANTHROPIC_API_KEY` so `npm run scout` pitches for real.

What isn't in the repo, on purpose:
- **The source reel's research** (video, frames, full transcript). It stays private. To redo it: `yt-dlp --write-info-json --write-description https://www.instagram.com/reel/DeaJeKGKBHi/`, then Whisper and ffmpeg as in docs/VIDEO_SPEC.md. The spec itself is in the repo.
- **M25's full-quality master** is in the GearBook Google Drive (Marketing/Reels/Signup Reel). The repo has a small preview.
- **Raw reels and renders** (`inbox/videos/`, `renders/`) are git-ignored. Keep masters in Drive.

## Run it

```bash
npm run dev
```

Open http://localhost:3000. Then:

```bash
npm run build
```

This writes the static site to `out/`.

```bash
npm run render:check
```

This records frames from every look and checks them. `npm run render` records the MP4s (needs ffmpeg). To work on a piece, open `http://localhost:3000/pieces/M18-click-trail/index.html?look=ledger` while `npm run dev` runs.

## Connecting real data

Nothing needs keys to run; the hub shows the sample data in `data/`. Copy `.env.example` to `.env.local` for:

- **Claude API** (`ANTHROPIC_API_KEY`): `npm run scout` pitches for real. Without it, the scout prints the exact prompt it would send.
- **Real reels:** drop them in `inbox/videos/`, run `npm run transcribe`, and add each as a source (see `.claude/skills/video-inbox`). Replace the `sample: true` sources and ideas as real ones come in.
- **Real numbers in pieces:** pass them as props (`npm run render -- M18-click-trail --look=switchback --props={"values":[...]}`). Wiring GearBook's Supabase (read-only anon key, `click_events` / `sale_events`) or Metricool for the reel list is planned; the variables are already in `.env.example`.

## Hosting

The repo is public, and every push to `main` deploys the static site to GitHub Pages (`.github/workflows/pages.yml`) at https://gearbook1-hub.github.io/gearbook-creative/. Everything on it is sample data or GearBook's own published marketing.

Roca loads from Matt's Adobe Fonts web project `aac5uoe`; checked on the live site 2026-10-18, no Adobe changes needed. If headings ever show in a plain serif (Newsreader), add the site's domain to the project (steps in docs/ADOBE_FONTS.md).

## Notes

- GearBook copy rules apply everywhere: no em or en dashes, never promise earnings or quote a rate, "outdoor professional" not "guide", links use https://www.gearbook.shop.
- Never commit the source video, frames, transcripts or `.env.local`.
