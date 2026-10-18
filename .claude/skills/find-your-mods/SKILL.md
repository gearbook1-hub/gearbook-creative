---
name: find-your-mods
description: Mod 13. Use when Luke or Matt wants to run the same loop for something other than motion graphics (sales decks, email templates, ad creative, proposals). Sets up a new library with sources, a catalog, the two gates and a build step.
---

# Find your mods

Any library GearBook rebuilds over and over can run this loop. It needs four parts:

1. **Sources to read.** What work already happens that shows the need (partner calls for decks, inbox replies for emails, top posts for ads).
2. **A catalog.** One entry per thing that already exists, with an honest `covers` line, in the same shape as `data/pieces.json`.
3. **Two gates.** Approve or pass on Pulse, then pick one of three looks before anything is built.
4. **A build and a check.** One reusable engine with variables, and a check that runs before anything is delivered.

To start one: copy `.claude/skills/motion-scout` and swap the nouns, add a catalog file to `data/`, and log pitches to `data/ideas.json` so they show under "Approve or pass" on /library. Add the library to the cards on `/find-your-mods`.

Keep GearBook's rules: no em or en dashes, money copy exact or silent (rates only from `/commission-rates`), links use https://www.gearbook.shop.
