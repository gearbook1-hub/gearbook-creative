# Motion pieces: building them

How a piece in `public/pieces/<Mxx-name>/` is built, beyond the steps in `.claude/skills/motion-build`. Facts are dated; the code wins over this file, so fix it in the same commit when it drifts.

## Two kinds of piece
- **Grounded pieces** (M18) fill the 9:16 frame: cream and topo, bark or sage ground, a Roca headline, the lockup, in the house style of the signup reel (R01). They stand alone as a beat inside a reel. A whole reel built in code is not a piece: it goes on the Reels tab (`data/reels.json`), like R01.
- **Overlays** (M26 Ping, M27 Site Screen look C, M28 Pro Dashboard) are laid over footage. Since 2026-10-18 `Motion.init({ overlay: true })` makes the stage transparent when recording (`body[data-overlay="render"]`) and bark in the browser (`"preview"`). `npm run render` then writes a ProRes 4444 `.mov` with alpha (`yuva444p12le`, about 190 to 310 MB for 6 to 10 s at 60 fps) instead of an MP4, and `npm run composite` lays it over a cut.
- An overlay has **no ground, no topo, no headline and no caption label**: the footage and the person in it carry the words. Luke asked for M28 to "look like M27 option C" for exactly this, so it could go over a video of him doing the presenter bit in the suit (2026-10-18).
- An overlay's object **pops forward** the way M27's browser grows out of the laptop: from about 35% scale, lower down, tilted back about 14° (`perspective(1600px) rotateX`), easing up into place over 0.7 s, with a soft dark shadow (`0 40px 90px rgba(0,0,0,.45)`). Give it `x`, `y` and `size` props so it can sit beside the person in the shot without new code.
- `render:check` still applies to overlays: the "background" it compares against is the transparent t = 0 frame.

## Screen mockups have to be accurate
Luke's rule from M28 (2026-10-18): a mockup of GearBook must show what GearBook actually is.
- **Draw the dashboard from the real one.** Run the gearbook repo on staging (`npm run dev:staging`, port 3100) and open `/dev-preview/dashboard` at phone width (375 px); it needs no login and has fixture data. M28 lays its screen out on that same 372 px grid and scales it 1.5x, so every proportion matches.
- **Real facts to keep:** four tabs (My Catalog, Earnings, Marketing, My Profile) in a bark bar at the bottom with an amber marker on the active tab; up to **5 catalogs** per member and **8 products** per catalog (`MAX_PRODUCTS_PER_CATALOG`, gearbook `lib/catalogs.ts`); a product card shows its photo, name, "Retailer: …", an optional quoted blurb and a Top Pick star. The member's role label says "Pro", never "Guide" (unless it is a mountain guide credential such as AMGA).
- **The Marketing tab is a "coming soon" placeholder** for pros on the live site (gearbook `components/dashboard/dashboard-nav.ts`, `NEXT_PUBLIC_MARKETING_TAB`). M28's Tour look shows the full kit; don't post that look until the tab ships, or say it is coming.
- **No dollar figures by default.** Earnings tiles would read as a promise of earnings; M28 shows clicks, sales counts and conversion only.
- **Logos** come from `public/brand/`, one colour only (black on light, white on dark), as a CSS mask of `gearbook-full-length-bw.svg` (M27, M28). Never redraw the wordmark.
- **Mark sample people and numbers** as sample in the defaults (M28's "Sam Rivera", "(sample)" in the specialty line).

## Example catalogs and products
- **Every product is real and belongs in its catalog.** Luke turned down a first pass where an "Alpine Rack" cover showed a rope bag and crag gear (2026-10-18). Pick products a working pro would actually carry for that catalog's purpose, from partner retailers.
- **Luke can name the catalogs himself.** M28's are his (2026-10-18): Trad Climbing (Petzl GRIGRI+, Black Diamond Solution harness, Camalot Z4, Camalot C4), Skiing (Atomic Bent Chetler 100, Giro Ledge, Osprey Soelden 32, Julbo Lightyear), Layers (Smartwool merino base layer top and bottom, Patagonia R1, Darn Tough ski socks). Where he named a type rather than a model (goggles, base layers, fleece, socks), Claude picked a well-known model and he accepted the picks.
- **Every product needs its photo.** Luke asked for pictures on all of them (2026-10-18); icons alone read as fake. How to get them is in `product-photos.md`.

## A click-through needs a normal cursor
- Use **the arrow pointer from M27** (black, white outline, tip at its top-left, small drop shadow), not a touch dot. Luke asked for "an obvious, normal cursor rather than a dot" on M28 (2026-10-18).
- The cursor glides in, reaches each target just before its click (ease in and out, about 0.7 s per move), dips about 18% on the click, and an amber ring opens from the tip. It stays on screen between clicks.
- M28 Build's script, for reuse: open the main catalog, star a product as Top Pick, tap "+ Add Product", type a search ("camalot c4") into the sheet, pick the result, and it lands at the top of the list with an amber outline (3 of 8 becomes 4 of 8). 9.5 s; the other looks stay 6 s (`duration` can depend on `Motion.look`).

## Technical traps (each one broke a render)
- **Easing in the `animate()` options bends the whole timeline.** With multi-keyframe animations (a tab marker that moves at 2 s and again at 4 s), put `easing` on each keyframe instead; otherwise every offset lands at the wrong time. M28's tab marker sat on the wrong tab until this was fixed.
- **SVG elements have no `offsetLeft` or `offsetTop`.** To aim a cursor at an icon, measure its parent (or the row) and offset from that. M28's cursor clicked empty space until this was fixed.
- **Measure positions through the `offsetParent` chain**, not `getBoundingClientRect()`: layout ignores transforms, so the numbers stay right while the phone pops in and scales. Measure inside `Motion.tick`, after fonts have loaded.
- **Everything follows the runtime clock.** Typing text, a blinking caret and a moving cursor are all computed from `t` in a tick; never `setTimeout` or CSS loops.
- **Check the whole look, not one frame.** `npm run stills -- <piece> --t=<s>` freezes any moment; composite a few onto grey (`ffmpeg … overlay`) and `hstack` them into one strip to review an overlay. Luke found these strips the best way to judge M28 before the full render.
