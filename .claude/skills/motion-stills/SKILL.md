---
name: motion-stills
description: Use after Luke approves an idea on Pulse. Designs three different looks for it as stills (A, B, C) so Luke can pick a direction before anything is animated.
---

# Stills before motion

Nothing gets animated until Luke has picked a look. Stills are cheap; animation isn't.

1. Write three looks into the idea's `stills` in `data/ideas.json`: letter, a short name, one line saying what the look does, and its ground (`bark`, `cream`, `sage`, `amber`, `ink`, `slate`). Make them actually different (a chart, a ledger, a single big number), not three colourways.
2. If the piece will be built in Remotion, make the stills from the engine itself: build the composition with a `look` prop and run `npm run stills` (writes `stills/out/`). The dashboard's section 06 shows Click Trail's stills this way.
3. Set `status: "stills"` and tell Luke they're ready to pick on the dashboard.
4. When he picks, record `pickedLetters` (all three is allowed: "one engine, three looks"), store any note, set `status: "picked"`, and hand off to `motion-build`.

Every look follows the rules in `/tokens`: GearBook colours, Roca, the safe area.
