---
name: motion-build
description: Use after Luke picks a still. Builds the piece in code as a reusable Remotion composition with variables, so new words or numbers never need new code.
---

# Built in code

1. Build the piece in `remotion/<Name>.tsx` as one component with a `look` prop for every picked look (see `remotion/ClickTrail.tsx`).
2. Everything that changes per video is a prop: headline, values, labels, dates. List them as the piece's `variables`.
3. Apply Luke's note from the idea. For 9:16 that always includes the safe area: everything between y 230 and 1520 and clear of the right-hand rail (x > 900).
4. Register each look in `remotion/Root.tsx` as `<Name>-<Letter>-<Look>`, and add the ids to `LOOKS` in `scripts/remotion-cli.mjs` if the render scripts should cover them.
5. Preview in `npm run studio`, then hand off to `render-check`. Never deliver before it passes.
6. Then hand off to `motion-library`.

Use brand tokens from `lib/brand.ts`, never hard-coded hex values.
