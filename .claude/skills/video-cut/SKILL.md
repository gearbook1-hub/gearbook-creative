---
name: video-cut
description: Use when Matt or Luke sends a folder of clips for a reel ("the clips are in Drive", "cut this", "make this video"). Claude does all of the cutting and choosing: watches every clip, picks the best takes and the exact in and out points, writes the edit list and renders the cut. Holds the editing rules learned from past reels; add to them after every cut.
---

# Cutting a reel

Matt and Luke film; Claude cuts. They give the clips and the story in a line ("I'm belaying, look at my phone, run 1, run 2, through the door, land at the computer"). Don't hand back choices: pick the takes, set the timings, render, and explain the picks after. They change things by telling you what to change.

Read the Rules in `docs/context/reel-feedback.md` before you start, and log their comments there after they review the cut.

## Steps
1. **Find the clips.** Usually the GearBook Drive, `Marketing/Reels/<name>`. On Matt's PC that is `H:/.shortcut-targets-by-id/1qRhWO3ydiMbSjbModfox9XznVyRIJp2I/GearBook/Marketing/Reels/<name>`. Read them in place; never copy raw clips into the repo.
2. **Probe.** `ffprobe` each clip. iPhone clips are stored 1920x1080 with a -90 rotation tag: they are portrait, and ffmpeg rotates them itself.
3. **Watch everything.** `npm run sheets -- "<folder>"` writes one contact sheet per clip to `inbox/sheets/` at 6 fps (frame k is at k/6 s). Read every sheet. For the moments that matter (entries, exits, the landing), pull a tighter sheet with `-ss/-to` around them. Don't use ffmpeg `drawtext` for timestamps: it crashes the Windows build.
4. **Map the clips to the story.** Note for each clip what happens, when the subject enters and leaves, which way they move, and anything wrong (a car, a passer-by, a clip the subject isn't in).
5. **Choose.** Apply the rules below. Write `edits/<source id>-<slug>.json`: every shot with `clip`, `in`, `out`, `beat` and `why`, and every unused clip in `dropped` with `why`.
6. **Render.** `npm run cut -- edits/<file>.json --clips="<folder>"` writes `renders/<slug>/cut.mp4` (full quality, for Drive) and `cut-preview.mp4` (720p, under 30 MB so it can be sent to the phone).
7. **Check the cut.** A 5 fps contact sheet of `cut.mp4`. Look at every cut point: the subject is in each shot, no dead frames at the head or tail, no flicker on a screen. Fix the list and re-render until it's clean.
8. **Graphics.** Once the pieces are approved and a look picked, add them to the edit list's `graphics` (`piece`, `look`, `shot`, `offset`, `glass`, `sound`) and run `npm run composite -- edits/<file>.json`. It records each piece at the cut's frame rate, lays it over `cut.mp4`, adds the sounds and writes `final.mp4` and `final-preview.mp4`. Check frames of the final the same way as the cut.
9. **Send and explain.** Send the preview, then a short table: time, shot, why. List what was dropped and why. Log the source and scout it for motion graphics (`video-inbox`, `motion-scout`); graphics still need two approvals, from Luke or Matt.

## Editing rules (learned, keep adding)
- **One best take per place.** Several takes of the same spot read as a repeat, not as more distance. Keep the one with the biggest action, the closest framing and the best light. (Huss valley: 3 river takes and 3 park takes became 1 each.)
- **Cut on entry and exit.** A run shot starts a few frames before the subject enters and ends the frame they leave. Any empty frame after an exit is dead air.
- **Keep screen direction.** If they run right to left in one shot, keep every shot right to left so the journey reads as one run. Check this when picking takes.
- **Runs are short.** A crossing shot is 0.6 to 1.6 s. Speed is the joke; don't let a shot breathe after the action.
- **Open on a face or the action in the first second.** Not on setup.
- **Jump cut inside a locked-off shot** to skip dull middles (rope handling, walking to a door). Same frame, time skip, reads as intentional.
- **The landing gets room.** The payoff (arriving at the desk, the site on screen, the lean back) is the longest shot after the setup: 2.5 to 3 s.
- **Cut before a screen flicker** or a page still loading; start when GearBook is clearly on screen.
- **A clip without the subject can still be a place beat.** Say so if you can't find them in it; if Matt wants it, keep it as a short establishing shot (about 1.5 s) and pick a window where nothing blocks the frame. (Huss valley: the town clip, 9657, went back in between the canyon and the street.)
- **Vibe reel length: about 15 to 20 s** before graphics, so it loops. Leave room for the end card.
- **No music in the cut.** The trending sound goes on in the Instagram app. Sound effects that belong to a graphic (the notification ding) go in with the composite.
- **A phone notification has to look real.** Match a phone's own banner: full width with small margins, big rounded corners, the app icon, bold title with "now", two lines of body, a system-like font (Inter), frosted glass over a blur of the footage (`glass: true`), a soft spring down from the top, and the ding as it lands. Hold it about 3 s so it can be read, and get it gone before the action it causes.
- **Time graphics to the footage.** The ding lands while the subject is still doing the thing (belaying), the banner leaves just before the reaction (dropping the rope). A screen graphic needs a still shot to grow from: start the laptop shot with the subject already seated.
- **Use the real site.** Screen mockups use screenshots of gearbook.shop (`scripts/capture-site.mjs`), and land on a product that ties back to the footage (Huss valley: the Petzl GriGri he dropped).
- **Flag safety.** Climbing, avalanche and diving moments are played straight (see `/identity`). If the joke looks unsafe (dropping a belay), say so and suggest how to show it was safe.

## Rules
- Raw clips, sheets and renders never go in git (`inbox/videos/`, `inbox/sheets/`, `renders/` are ignored). Edit lists in `edits/` are committed.
- Full-quality cuts go to Drive next to the clips, only when Matt or Luke says to.
- A finished cut is a reel: add it to `data/reels.json` (next `R` id, `kind: "cut"`, `edit`, `source`, the `pieces` it uses, where the master lives) so it shows on `/reels`, and add its edit list to `EDITS` in `lib/data.ts`.
- GearBook copy rules apply to any on-screen text.
