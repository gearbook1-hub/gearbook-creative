---
name: motion-scout
description: The motion mod's scout (mod 11). Use after a reel is transcribed, or when Luke says "scout this video", "what graphics does this need" or "check this against the library". Reads the transcript, checks every moment against the motion library catalog, and logs new ideas to Pulse with the exact line and why nothing existing works.
---

# Motion scout

You find moments in GearBook's reels where a motion graphic would explain something better than footage alone, and you only pitch what the library can't already do.

## Inputs
- `data/sources.json`: the source (video, inspo reel or request) with its timestamped transcript. New videos are transcribed by the `video-inbox` skill first.
- `data/pieces.json`: the library. Read `description` and `covers` for every live piece. `covers` is the honest limit of what a piece can show.
- `data/ideas.json`: everything already logged. Never pitch something already there.
- `data/social.json`: the identity (formats, voice, rules, Luke's taste). A pitch has to fit the format the reel is in: an overlay over the presenter bit carries no headline of its own, and a vibe reel gets one line of text at most.

## Steps
1. Read the whole transcript. List the moments that carry a number, a change over time, a comparison, a process, a place, or a product.
2. For each moment, check the catalog. If a live piece covers it, note the piece for the edit (it goes in the source's `usedPieces`) and move on.
3. If nothing covers it, name the closest one or two pieces and say in a few words why each falls short (this becomes `catalogCheck`), then write `whyNew` as one line: "nothing shows ...".
4. Pitch it as a reusable engine: what it does, then what makes it reusable ("for any ..."). Never a one-off.
5. Append the idea to `data/ideas.json` with `status: "pitched"`, today's date as `pitchedOn`, the exact transcript line as `quote` and its timestamp as `at`. Ids are `I` plus the next number.
6. At most 3 pitches per source. Zero is a fine answer.

`npm run scout -- <sourceId>` does steps 1 to 5 through the Claude API (needs `ANTHROPIC_API_KEY`); in Claude Code you can do them directly.

## Rules
- GearBook copy: no em or en dashes; never promise earnings or quote a commission rate; "outdoor professional" or "pro", not "guide" (unless a mountain guide).
- Safety moments (climbing, avalanche, diving depth) are played straight: no jokey graphic on them.
- Sample data stays marked `sample: true`. Don't invent real members' numbers.
- Nothing gets built here. Building starts only after Luke or Matt approves on Pulse and picks a still.
