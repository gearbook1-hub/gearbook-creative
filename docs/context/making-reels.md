# Making reels: how to work, from the first batch

How to make an animated reel so it lands in fewer rounds. Learned making R03 to R09 (2026-10-19): seven reels built in parallel, then reviewed by Luke over several rounds. What he likes and doesn't is in `reel-feedback.md` (read its Rules first); this file is about the process. The code wins over this file.

## What the first batch showed
- **The content was right early; the craft took the rounds.** R03 and R04 were "I like this a lot as is" on the first draft and R06 needed one round. They were built from real facts: real products and photos, the dashboard's real limits, the real catalog URL, real partners. R05 took five versions and R07 six, almost all for how they looked, moved or read.
- **Sound failed twice for the same reason (2026-10-19, 2026-10-21): nobody heard it before Luke did.** Synthesised sounds, then free CC0 game-UI and Freesound sounds, both came back as unnatural (bumps and bonks instead of clicks, loud whooshes).
- **Stills check layout, not time or sound.** Strips of stills caught text outside the safe area, overlaps, clipping and a hidden "(sample)" label. They missed pacing (R04 "watches a bit slow"; R07's holds were short twice) and sound (Luke: "the sounds aren't great"). Nobody had listened before he did.
- **A fun format can teach the wrong habit.** The first speedrun made skipping product descriptions look like the fast way, the opposite of what GearBook needs.
- **Luke spots generic choices at once.** Condensed display caps on cards "look like AI made them", plain topo lines read as filler, a joke about something not on screen feels weird. Specific beats generic every time: fish for spearfishing, water that darkens as you dive, a real trad rack, partner logos.
- **One reference reel did more than written briefs.** The Instagram reel Luke sent moved R05 further in one round than its first two briefs did.
- **Patching points makes new problems.** Pinning each point of R07's ski track under the ridge made it choppy and sent it uphill; moving the whole smooth curve down was the fix.

## How to work next time
1. **Before building, ask what the reel teaches a member.** If it shows people doing something, it shows them doing it right (adding products, with descriptions). Say they get paid, never an amount.
2. **Use real facts, and check them.** Products that belong together in one catalog, from partner retailers, with photos (`product-photos.md`); partners from gearbook `lib/partners.ts`; URLs and limits from the gearbook code (`motion-pieces.md`).
3. **When the look is the open question, ask for a reference** (a reel Luke likes) before the first build, not after the second.
4. **Set holds by reading time, not by eye.** About 0.3 s per word on screen plus 0.5 s, and at least 2.5 s for a screen with a title, a list and logos. The last item of a run gets a longer hold. Then cut every other gap: Luke prefers brisk.
5. **Keep scenes in one reel at the same level of detail, and make each graphic its subject.** No generic textures; drawn things obey the scene (tracks stay on the snow and only go downhill).
6. **Type:** Roca and Outfit by default; a game-themed reel can use a pixel font for titles, HUD and labels, but cards and copy stay in Outfit. No Anton-style condensed caps.
7. **Colour:** pieces.css colours, plenty of slate blue, little bark, never amber as a full background. Different colours per scene are welcome.
8. **Sample people:** "Sam Appleseed", marked sample.
9. **Sound: get a yes on the sounds before any tooling.** Claude can't hear, so the sounds themselves are the risk, not the mix. First send Luke a short clip of candidates (or ask for a reel whose sound he likes, or which paid pack to use) and wait for a yes; only then wire them in, cue the piece by `motion-pieces.md` "Sound" and run `npm run sound:check -- <piece>`. The 2026-10-21 rebuild did it the other way round: an hour on the mixer and loudness checks, then "still awful" on first listen. The kit stays off (`"enabled": false`) until a person has said yes.
12. **Keep Luke posted and keep it short.** When a step will take more than a few minutes, say so first and offer a quicker cut. Long silent runs read as slow even when the work is right.
10. **Check with strips, then say what a strip can't show.** Every handover says what was seen only in stills (timing, motion smoothness, sound).
11. **Fix the shape, not the symptom.** When a drawn path misbehaves, change the model it's generated from rather than clamping points.

## Working in parallel
- One builder per reel, each in its own `public/pieces/<id>-<slug>/` folder, with a shared brief (where to work, house rules, facts, rules, how to check, what to report). No builder edits shared files; the lead updates `data/`, `app/`, `sound.js`, the sound kit, `runtime.js` and the docs after reviewing each strip.
- Builders are lost when the Claude session restarts. Keep the brief in a file and the state in the repo (reels.json, reel-feedback.md), so a new builder can pick up from the code.
- Review every strip yourself before calling a reel done; builders miss things the strip shows (a covered "(sample)", an avalanche-kit blurb, a brown-tinted "deep blue").

## After a review
Log it in `reel-feedback.md` the same day: quote Luke, record the verdict and what changed, and update the Rules (firm when two reels back it or he says always or never). Identity-level points also go to gearbook `docs/marketing/social-identity.md`, then `data/social.json`. Approved reels get `status: "approved"` in `data/reels.json`, which puts them at the top of `/reels`.
