# GearBook Creative

GearBook's creative hub: a dashboard plus a set of Claude Code mods. Claude reads every reel Luke records, compares each moment against the library of motion graphics GearBook already has, pitches only what's missing, and builds nothing until Luke has approved it and picked a look.

Built for Luke and Matt. Everything marked `sample` is example data until real reels go through it.

**Live:** https://gearbook1-hub.github.io/gearbook-creative/

## How it maps to the video

It's rebuilt from Josh Blatchford's reel "How the motion mod thinks" (Instagram, 2026-10-12). The full panel-by-panel spec is in [docs/VIDEO_SPEC.md](docs/VIDEO_SPEC.md). His wellness brand (Attuned) and its motion graphics are swapped for GearBook's content and brand.

| In the video | Here |
|---|---|
| "Claude Code Mods · Full Breakdown" tabs 01, 04, 07, 10, 11, 12, 13 | The same seven tabs, one page each: `/tokens`, `/pulse`, `/library`, `/video-breakdown`, `/` (11 Motion Breakdown), `/video-inbox`, `/find-your-mods` |
| "How the motion mod *thinks*" plus 4 stats | `/`, with stats computed from `data/` |
| 01 Where ideas come from (videos, inspo, asks) | `data/sources.json` (`kind`: video, inspo, request) |
| 02 What it already has (M01 to M24 tiles) | `data/pieces.json`, the catalog every pitch is checked against |
| 03 It reads every transcript, then FLAGGED | Whisper transcript, then the catalog check (`catalogCheck`, `whyNew`) |
| 04 The idea log | `data/ideas.json` |
| 05 Approve or pass | Pitch cards with Approve, Pass and Add a note (also on `/pulse`) |
| 06 Stills before motion | 3 looks per idea. For M18 they're real frames of the piece, frozen with `?t=` |
| 07 Built in code | `public/pieces/M18-click-trail/index.html`: one animated HTML page, three looks, variables in the URL |
| 08 It checks its own render | `npm run render:check` (blank frame, safe area, button rail) |
| 09 Three looks, one engine | The three looks looping live in the browser |
| 10 Open the gallery | `/library`: the reel (M25, the real signup explainer), palette, motion voice and every piece |
| 11 The loop | Same nine steps, with the same two human gates |
| 12 Any library | `/find-your-mods`: decks, emails, ads, proposals |

**How pieces are made.** No video editor or animation framework. Each motion piece is a fully animated HTML page, the way Claude built GearBook's signup explainer (M25, in Drive at Marketing/Reels/Signup Reel). `public/pieces/runtime.js` gives every piece one clock, so the same page loops on the dashboard, freezes on any frame for stills (`?t=2.5`), takes new words and numbers from the URL (`?props=`), and is recorded frame by frame to a 60 fps MP4 by `npm run render` in headless Edge or Chrome. M25's cream and topo ground, Roca titles that arrive word by word and small tracked labels are the house style (`public/pieces/pieces.css`).

Colours are GearBook's: the dark appearance from the iOS app (page `#17140D`, surface `#241F15`), with cream text and amber where the video uses lemon. Sage stands in for the video's green and slate for its blue. Headings are Roca from Matt's Adobe kit.

## The loop

```
Video, inspo or a request -> Check the catalog -> Log the idea -> [Approve or pass] -> 3 stills -> [Pick one]
  -> Build in code -> Check the render -> Into the library
```

| Step | Mod (skill in `.claude/skills/`) | Command |
|---|---|---|
| A reel comes in | `video-inbox` (12) | `npm run transcribe` |
| Read it, check the catalog, log and pitch | `motion-scout` (11) | `npm run scout -- S01` |
| Approve or pass | `pulse` (04) | `/pulse`, then `node scripts/apply-decisions.mjs decisions.json` |
| 3 stills, pick one | `motion-stills` | `npm run stills -- M18-click-trail` |
| Build in code | `motion-build` | `public/pieces/<Mxx-name>/index.html` |
| Check the render | `render-check` | `npm run render:check` |
| Into the library | `motion-library` (07) | add to `data/pieces.json`, `npm run render` |
| Per-video table | `video-breakdown` (10) | `/video-breakdown` |
| Brand values | `tokens` (01) | `lib/brand.ts`, `app/globals.css` |
| New libraries | `find-your-mods` (13) | `/find-your-mods` |

In Claude Code, the skills load automatically in this folder. Say "scout S01", "apply these Pulse decisions" or "make stills for I09".

## Structure

```
app/                     the hub (Next.js 16, static export)
  page.tsx               11 Motion Breakdown, sections 01 to 12
  library/  pulse/  video-inbox/  video-breakdown/  tokens/  find-your-mods/
components/              PieceFrame (shows an HTML piece or video), PieceTile (placeholder tiles),
                         IdeaCards (approve/pass), Section (scroll lighting), CountUp, ModsNav
data/
  pieces.json            the library: every motion graphic GearBook has (M01 to M25)
  sources.json           videos, inspo and requests, with transcripts
  ideas.json             every flagged moment: quote, catalog check, pitch, stills, build, render check
lib/                     types, data helpers, brand tokens, Pulse decisions (localStorage)
public/pieces/           the motion pieces: runtime.js, pieces.css (house style), topo.svg,
                         M18-click-trail/ (built here, three looks), M25-signup-explainer/ (preview of the real reel)
scripts/                 transcribe.py, scout.mjs, motion.mjs (recorder), render-stills / render-piece /
                         render-check, apply-decisions
.claude/skills/          one skill per mod, with its full prompt
inbox/                   videos/ and transcripts/ (git-ignored), inspo/
docs/VIDEO_SPEC.md       what the source video shows, panel by panel
screenshots/             the hub, for reference
```

## Run it

Needs Node 20 or newer, and Edge or Chrome for recording pieces. Python with `openai-whisper` and ffmpeg are only needed for transcription and MP4 renders.

```bash
npm install
```

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

This records frames from every look and checks them. `npm run render` records the MP4s (needs ffmpeg). To work on a piece, open `http://localhost:3000/pieces/M18-click-trail/?look=ledger` while `npm run dev` runs.

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
