# GearBook Creative

The creative hub for GearBook. Read README.md first; the loop and which skill runs each step are there.

- Data lives in `data/` (pieces, sources, ideas). The dashboard is generated from it; edit the JSON, not the pages.
- Nothing is built without two approvals from Luke: approve on Pulse, then pick a still. Never skip either.
- Run `npm run render:check` before delivering any render, and `npm run build` before pushing.
- Brand values come from `lib/brand.ts` and `app/globals.css`. Don't hard-code colours in pieces.
- GearBook copy rules: no em or en dashes, never promise earnings or quote a commission rate, "outdoor professional" or "pro" rather than "guide" (unless a mountain guide), links use https://www.gearbook.shop.
- Keep sample data marked `sample: true`. Never commit videos, frames, transcripts or secrets.
