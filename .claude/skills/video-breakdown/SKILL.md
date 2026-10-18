---
name: video-breakdown
description: Mod 10. Use when Luke asks "break down this video" or after an edit is done. Lists each line of a reel with the library piece the edit used for it, or the idea the scout flagged, and updates the source's usedPieces.
---

# Video breakdown

For a source in `data/sources.json`:
1. Go line by line through `transcript`.
2. For each line, say which library piece (from `data/pieces.json`) the edit uses there, or that none is needed, or which idea in `data/ideas.json` was flagged at that timestamp.
3. Update the source's `usedPieces` with every piece the edit used.
4. The `/video-breakdown` page renders this table from the data. No other output is needed.

If a line clearly needs a graphic and nothing was flagged, hand that source to `motion-scout`.
