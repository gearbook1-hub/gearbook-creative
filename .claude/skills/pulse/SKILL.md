---
name: pulse
description: Mod 04. Use when Luke pastes Pulse decisions, says "apply these Pulse decisions", or asks what's waiting on him. Applies approve, pass and notes to data/ideas.json and moves approved ideas on to stills.
---

# Pulse

Pulse is the first human gate. Every pitch waits there until Luke approves or passes it.

## Applying decisions
The hub is a static site, so Approve, Pass and notes are saved in Luke's browser. He copies them from "Approve or pass" on `/library` ("Copy decisions") as JSON:
```json
{ "I09": { "decision": "approved", "note": "keep it under 3 seconds" } }
```
Save that to a file and run `node scripts/apply-decisions.mjs <file>`, or apply it by hand:
- approved: `status` goes from `pitched` to `approved`, then hand the idea to `motion-stills`.
- passed: `status` becomes `passed`. Keep it in the log so the scout never pitches it again.
- note: store it on the idea as `note`. Every later step must follow it.

## "What's waiting on me?"
List ideas with status `pitched` (approve or pass), `stills` (pick one), and `waiting` (with `waitingOn`).
