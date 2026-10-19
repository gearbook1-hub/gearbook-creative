---
name: motion-stills
description: Use after Luke or Matt approves an idea on Pulse. Designs three different looks for it as stills (A, B, C) so they can pick a direction before anything is animated.
---

# Stills before motion

Nothing gets animated until Luke or Matt has picked a look (whoever approved the idea; either one's pick is enough). Stills are cheap; animation isn't.

1. Write three looks into the idea's `stills` in `data/ideas.json`: letter, a short name, one line saying what the look does, and its ground (`bark`, `cream`, `sage`, `amber`, `ink`, `slate`). Make them actually different (a chart, a ledger, a single big number), not three colourways.
2. The fastest stills come from the piece itself: build a first pass of `public/pieces/<Mxx-name>/index.html` with all three looks (see `motion-build`) and run `npm run stills -- <Mxx-name>` (writes `stills/out/`). The dashboard's section 06 shows Click Trail's stills this way, frozen with `?t=`.
3. Set `status: "stills"` and tell whoever approved the idea that they're ready to pick on the dashboard.
4. When they pick, record `pickedLetters` (all three is allowed: "one engine, three looks"), store any note, set `status: "picked"`, and hand off to `motion-build`.

Every look follows the brand rules (`/identity`, `public/pieces/pieces.css`): GearBook colours, Roca, the safe area (y 230 to 1520, x under 900).
