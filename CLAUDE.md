# GearBook Creative

The creative hub for GearBook. Read README.md first; the loop and which skill runs each step are there. On a new machine, start with `npm install` and `npm run setup:check`.

## What this is (decided with Luke, 2026-10-18)
- A rebuild of the *hub and workflow* from the reel "How the motion mod thinks" (@joshuablatch, spec in docs/VIDEO_SPEC.md): per-video analysis compared against a library of GearBook's existing motion graphics, approve or pass, 3 stills, pick one, build, render check, into the library. It is not a copy of that creator's graphics.
- GearBook colours and content throughout. Luke and Matt are the users.
- Motion pieces are fully animated HTML pages in `public/pieces/<Mxx-name>/`, the way Claude built Matt's signup explainer. No Remotion or other animation framework. `public/pieces/runtime.js` gives each piece one clock; `npm run render` records it to MP4.
- M25, the signup explainer, is GearBook's first real piece and the house style (cream and topo ground, Roca titles that arrive word by word). Its full-quality master is in the GearBook Google Drive: Marketing/Reels/Signup Reel.
- Everything else in `data/` is sample data until real reels go through the loop.

## Rules
- Data lives in `data/` (pieces, sources, ideas). The dashboard is generated from it; edit the JSON, not the pages.
- Nothing is built without two approvals from Luke: approve on Pulse, then pick a still. Never skip either.
- Run `npm run render:check` before delivering any render, and `npm run build` before pushing. Every push to `main` deploys https://gearbook1-hub.github.io/gearbook-creative/.
- Brand values come from `public/pieces/pieces.css` (pieces), `lib/brand.ts` and `app/globals.css` (hub). Don't hard-code new colours.
- GearBook copy rules: no em or en dashes, never promise earnings or quote a commission rate, "outdoor professional" or "pro" rather than "guide" (unless a mountain guide), links use https://www.gearbook.shop.
- The repo is public. Keep sample data marked `sample: true`. Never commit videos (other than small previews of GearBook's own published work), frames, full transcripts of other people's videos, or secrets.
