---
name: video-inbox
description: Mod 12. Use when Luke drops a new reel, saves an inspiration reel, or asks for a graphic. Transcribes videos with Whisper and logs every source in data/sources.json so the scout can read it.
---

# Video inbox

## Videos Luke records
1. The video goes in `inbox/videos/` (never committed).
2. Run `npm run transcribe`. Whisper (model `small`) writes `inbox/transcripts/<name>.json` as `[{ "t": "0:22", "text": "..." }]`.
3. Add a source to `data/sources.json`: next `S` id, `kind: "video"`, a title, a `shortName` used in the idea log ("Member spotlight video"), the date, the transcript lines, and `usedPieces` (library pieces the edit already uses, if known).
4. Hand off to `motion-scout` for that source id.

## Inspo reels Luke saves
Save the link or file to `inbox/inspo/`. Add a source with `kind: "inspo"`, `shortName: "a reel I saved"`, and one line in `transcript` describing the move worth stealing (no transcript needed). Scout it like a video.

## Things Luke asks for
Add a source with `kind: "request"`, `shortName: "I asked for it"`, and his words as the one transcript line.

## Rules
Raw video, frames and transcripts never go in git. Only the lines that matter go into `data/sources.json`.
