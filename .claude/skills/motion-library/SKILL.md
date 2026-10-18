---
name: motion-library
description: Mod 07. Use when a piece passes its render check, when Luke retires a piece, or when an edit needs to know which piece to use. Keeps data/pieces.json, the catalog every other mod checks against, accurate.
---

# Motion library

`data/pieces.json` is the source of truth for what GearBook already has. The scout trusts it, so keep it honest.

## Adding a built piece
Add an entry: next `M` id (never reuse one), name, `version: 1`, `status: "live"`, a description of what it does and when to use it, `covers` (what it can and can't show, in one line), a `preview` kind for the dashboard tile, its `variants` (one per look), the `formats` actually rendered, `variables`, `composition` if it's in `remotion/`, `builtFrom` (idea id) and `builtOn`. Then set the idea's `status: "built"` and `builtAs`.

## Using the library in an edit
When editing a reel, look up pieces by `covers`, render with new props (`npm run render -- <id> --props='{...}'`), and add the piece id to the source's `usedPieces`.

## Retiring
Set `status: "retired"` and say why in `description`. Retired pieces stay in the file so their ids are never reused and the scout knows they were tried.
