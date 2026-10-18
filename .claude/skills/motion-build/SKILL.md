---
name: motion-build
description: Use after Luke picks a still. Builds the piece as an animated HTML page (the way Claude made the signup explainer, M25), with variables so new words or numbers never need new code.
---

# Built in code

Pieces are plain HTML pages, the same kind of fully animated page Claude built for the signup explainer: no video editor, no animation framework. One page per piece in `public/pieces/<Mxx-name>/index.html`. Start from `public/pieces/M18-click-trail/index.html`.

1. Load `../pieces.css` (house style: cream ground, topo lines, Roca, Afacad Flux labels, Outfit) and `../runtime.js`.
2. Call `Motion.init({ duration, hold, looks, defaults, build(stage, props, look) })`:
   - `looks`: one id per picked still (all three is allowed: "one engine, three looks").
   - `defaults`: every variable (headline, values, labels, dates). Anyone can override them with `?props={...}`, so a new version is a new URL, not new code.
   - `build`: create the DOM on the 1080x1920 `stage` and animate with `el.animate()` (Web Animations) or the helpers `Motion.arrive` (fade and rise) and `Motion.words` (title word by word, like M25). Use `Motion.tick(t => ...)` for anything CSS can't animate, such as a counting number.
3. Never use `setTimeout`, `Date.now()` or free-running CSS loops: everything must follow the runtime's clock, or the recorder can't step it frame by frame.
4. Apply Luke's note from the idea. For 9:16 that always includes the safe area: everything between y 230 and 1520 and left of x 900 (Instagram's caption and button rail).
5. Open the page in a browser to watch it loop, `?look=ledger` to switch looks, `?t=2.5` to freeze a frame.
6. Hand off to `render-check`, then `motion-library`. `npm run render -- <piece>` records the MP4 at 60 fps.

Colours come from `pieces.css` variables (GearBook's bark, sage, cream, amber, slate), never new hex values.
