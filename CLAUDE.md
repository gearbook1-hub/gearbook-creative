# GearBook Creative

The creative hub for GearBook. Read README.md first; the loop and which skill runs each step are there. On a new machine, start with `npm install` and `npm run setup:check`.

## What this is (decided with Luke, 2026-10-18)
- A rebuild of the *hub and workflow* from the reel "How the motion mod thinks" (@joshuablatch, spec in docs/VIDEO_SPEC.md): per-video analysis compared against a library of GearBook's existing motion graphics, approve or pass, 3 stills, pick one, build, render check, into the library. It is not a copy of that creator's graphics.
- GearBook colours and content throughout. Luke and Matt are the users.
- Claude cuts the reels: given a folder of clips and the story, pick the takes and timings yourself and render the cut (`video-cut` skill, edit lists in `edits/`). Add what each cut teaches to that skill's editing rules.
- Two kinds of output, kept apart (Luke, 2026-10-19):
  - **The motion library is a pack**: graphics any GearBook reel can use, over footage or on their own ground (`data/pieces.json`, `M` ids, `/library`). A piece never holds a whole reel.
  - **Reels are whole reels Claude made**, ready to post (`data/reels.json`, `R` ids, `/reels`): built entirely in code, or cut from clips with pack pieces laid over them. A cut's edit list in `edits/` is its record.
- Motion pieces are fully animated HTML pages in `public/pieces/<Mxx-name>/`, the way Claude built Matt's signup reel. No Remotion or other animation framework. `public/pieces/runtime.js` gives each piece one clock; `npm run render` records it to MP4.
- R01, the signup reel, is GearBook's first real reel and the house style (cream and topo ground, Roca titles that arrive word by word). It was made as a Motion artifact on Matt's Claude account ("GearBook Signup Reel"); its scene code and images are copied unchanged into `public/pieces/M25-signup-explainer/film/` and play live through `film-kit.js`. It was logged as M25 until 2026-10-19; the folder and render name keep that name. Its full-quality master with sound is in the GearBook Google Drive: Marketing/Reels/Signup Reel.
- The hub also covers GearBook's social: the identity, the content idea bank and the posted feed (`data/social.json`, `content-ideas.json`, `posts.json`), which are real. The motion catalog, sources and motion ideas are sample data until real reels go through the loop, except M18 (a demo on sample numbers) and the real pieces M26 to M28.
- The profile picture on every account is `public/brand/gearbook-social-avatar.png` (Luke, 2026-10-19). The pack's `gearbook-profile-picture.svg` is a monogram, not the avatar in use.

## Rules
- Data lives in `data/` (social, content ideas, posts, pieces, reels, sources, ideas). The hub is generated from it; edit the JSON, not the pages. social.json, content-ideas.json and posts.json mirror the gearbook repo's docs/marketing/social-identity.md and content-idea-bank.md; those docs are the source of truth.
- Read the identity before you pitch, script, caption, cut or make stills: `data/social.json` (who it's for, who's on camera, the presenter bit, formats, voice, rules, Luke's taste). The full doc with the reasons is gearbook `docs/marketing/social-identity.md` in the private gearbook1-hub/gearbook repo; read it when that repo is cloned next to this one.
- Identity learnings go back to the source. When work here settles something about the identity (house style, where footage or masters live, who's on camera, a taste call from Luke), propose the edit to gearbook `social-identity.md` first, then update `social.json` to match. Never change social.json alone, and keep how-to-build knowledge in `docs/context/` here.
- This repo and the hub are public but the identity doc is private: only mirror into `data/` what's fine for anyone to read. Unposted ideas in `content-ideas.json` are public too; ask Luke before adding one he'd want kept quiet.
- Nothing is built without two approvals: approve the pitch (Approve or pass on /library), then pick a still. Never skip either. Luke or Matt can give them, and one person's two yeses are enough: whoever is making the piece decides, without waiting on the other (Luke, 2026-10-19). Pulse decisions are saved per browser, so if both send decisions on the same idea and they disagree, ask before applying either.
- Run `npm run render:check` before delivering any render, and `npm run build` before pushing. Every push to `main` deploys https://gearbook1-hub.github.io/gearbook-creative/.
- Brand values come from `public/pieces/pieces.css` (pieces), `lib/brand.ts` and `app/globals.css` (hub). Don't hard-code new colours.
- GearBook copy rules: no em or en dashes, never promise earnings or quote a commission rate, "members" for people on GearBook in general, "pro" or "professional" only for the professional member type (Luke 2026-10-21, after enthusiasts joined as members; discipline titles like "Rock guide" or "Spearfishing guide" are fine), links use https://www.gearbook.shop.
- Before taking a new `M` or `R` id, `git pull`: Matt and his cloud sessions add pieces and reels too. M28 was first numbered M26 and collided with Matt's Ping, pushed the same day (2026-10-18).
- Screen mockups of GearBook show what GearBook really is: the real dashboard layout, real products that belong in their catalog, each with its photo, a normal arrow cursor. Detail in `docs/context/motion-pieces.md`.
- Luke or Matt sends changes while a piece is being built ("catalog 2: …", "use a normal cursor"). Fold each into the work in progress, stop any render that would bake in the old version, and re-render once at the end.
- The repo is public. Keep sample data marked `sample: true`. Never commit videos (other than small previews of GearBook's own published work), frames, full transcripts of other people's videos, or secrets.

## Context (read the one you need)
Feature knowledge, one file per area, with dated facts and the reason for each rule. The code wins over these files: fix the file in the same commit when it drifts.

| File | Covers |
|---|---|
| `data/social.json` (source: gearbook `docs/marketing/social-identity.md`) | GearBook's social identity: audiences, on camera, the presenter bit, formats, voice, copy rules, taste, open gaps |
| `docs/context/reel-feedback.md` | **Read before making any reel or piece.** Luke's and Matt's reactions, distilled into firm and leaning rules, plus the review log. Record every review there |
| `docs/context/making-reels.md` | How to make an animated reel in fewer rounds: what the first batch (R03 to R09) showed, a checklist for next time, working with parallel builders, what to do after a review |
| `docs/context/motion-pieces.md` | Grounded pieces vs overlays (transparent `.mov`), accurate screen mockups, example catalogs, the cursor, technical traps |
| `docs/context/product-photos.md` | Where product pictures come from (gearbook.shop, Backcountry via the browser), preparing them, names, the open rights question |
| `docs/context/hosting-and-access.md` | Who can see the public hub, the downloads question, confirming a Pages deploy, stale `.next` |
| `docs/VIDEO_SPEC.md` | The source reel, panel by panel |
| `docs/NEW_VIDEO.md`, `docs/ADOBE_FONTS.md` | Adding a reel; Roca on a new domain |

Skills in `.claude/skills/` hold each step of the loop; the editing rules for cuts live in `video-cut`.
