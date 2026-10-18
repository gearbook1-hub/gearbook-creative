---
name: render-check
description: Use after a piece is built and before anything is delivered. Pulls frames from the render and checks them against the rules; fixes and re-checks until they pass.
---

# Check the render

1. Run `npm run render:check -- <Mxx-name>`. It records frames at 25%, 60% and 100% of every look in headless Edge or Chrome and checks each frame:
   - the frame isn't blank and Roca loaded
   - nothing but background above y 230 or below y 1520
   - nothing but background in the right-hand button rail (x > 900)
2. Look at the frames yourself (`stills/out/check/`): text cut off, overlapping labels, fonts falling back to Georgia (Roca didn't load), numbers that don't match the props.
3. Fix the piece and run it again until every frame passes.
4. Record the result on the idea as `renderCheck` (time, pass, note), which the dashboard shows in section 08.
5. Then `npm run render` writes the MP4s to `renders/` (not committed).
