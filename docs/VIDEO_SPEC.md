# Video spec: "How the motion mod thinks"

Source: Instagram reel https://www.instagram.com/reel/DeaJeKGKBHi/ by Josh Blatchford (@joshuablatch), posted 2026-10-12, 1080x1920, about 93 s.
Creator's company: **Attuned** (a wellness company that runs body "scans" and scores; the creator calls it "a wellness company").
Research: 93 frames at 1 fps plus 10 scene-change frames, all viewed; whisper `small` transcript; caption and info JSON.

Legend: **[seen]** read directly off a frame. **[said]** from the voiceover or caption. **[inferred]** my reading of what is not shown.

---

## 1. What the video is

A screen recording of one long, dark, scrolling web page titled **"How the motion mod thinks"**, one tab of a site called **"Claude Code Mods · Full Breakdown"** [seen]. The camera scrolls top to bottom while the creator narrates, and word-by-word white serif captions are burned in (key words get bracket captions like `[ three places ]`, `[ 97 to 60 ]`, `[ seven ]`, `[ approve or pass ]`, `[ stills first ]`, `[ all three ]`, `[ library ]`, `[ yes or no ]`, and a final `MOTION` pill) [seen]. Each section is "lit" with a glowing lemon outline as the narration reaches it [seen]. Near the end the cursor clicks **Open the gallery**, which opens a second page, the **Motion Library** gallery [seen]. The reel ends by scrolling back up to "What it already has" [seen].

Caption [said, summarized]: Claude is the creator's whole production team; the motion mod reads every video it edits, pitches what's missing, and he approves or passes. Viewers comment a keyword to get the full breakdown with prompts.

## 2. Narration, summarized by time

The full transcript stays in the private research folder; this repo is public, so only a summary is kept here.

| Time | What he says |
|---|---|
| 0:00 | Claude runs his production; this is how the motion mod finds ideas. |
| 0:07 | Ideas come from three places: videos he records, reels he saves, and requests. 8 pitched so far. |
| 0:14 | It knows the library (24 pieces) and adds to it every day. |
| 0:20 | After each edit it reads the transcript and looks for moments a new graphic would explain better. Example: one runner's score falling from 97 to 60 over five scans, which nothing in the library could show, so it was flagged. |
| 0:32 | Each idea is logged with the exact line and why nothing existing works. 7 are built. |
| 0:38 | He approves or passes each pitch. |
| 0:41 | Approval doesn't trigger a build: it shows three looks as stills first. |
| 0:48 | He picks one, it's built with his notes, and it checks its own renders. Pieces are reusable with new words or numbers. For this one he wanted all three looks. |
| 1:02 | Built pieces go into a library it pulls from in later edits. |
| 1:12 | The same loop works for sales decks, email templates, ad creative and proposals. |

## 3. Visual system [seen, colours sampled from frames]

| Token | Value | Use |
|---|---|---|
| Header ground | `#050407` | hero band with title and stats |
| Page ground | `#0F0F0F` | everything below the stats |
| Card | `#171717`, 1px border `#242424` | source cards, library cards |
| Panel (mono) | `#050505`-ish, 1px border `#1e1e1e` | transcript, idea log rows, build notes |
| Divider | `#212023` hairline | between sections |
| Lemon | `#F2E700` (brand "LEMON #F3EC01") | active tab, "thinks", stat 24, idea names, highlights, glow outline, Approve/Pick pills |
| Green | `#22C55E` / `#20C057` | "built (M18)" status, check badges, "Approved", brand ground |
| Blue | `#1712EC` | "Open the gallery" button, a video ground |
| Paper | `#F8F9EC` / frame `#F4F4EF` | idea-card frames, stills frames |
| Muted text | `#706F72` / `#939393` | tab labels, captions, sources |

Type [seen, faces inferred]:
- Display: a light, high-contrast book serif (Tiempos / Newsreader class) for the title, section titles, card titles, big numbers. "thinks" is the italic in lemon.
- Labels and data: a monospace (IBM Plex Mono class), uppercase and widely tracked for eyebrows and stat labels, normal case for panels.
- Gallery body and buttons: a neo-grotesque sans (Inter / Söhne class).

Interaction and motion [seen]:
- Stat numbers count up from blank (labels show first, numbers fill in).
- The section being narrated gets a lemon glow outline (cards light one by one).
- Library tiles are live looping 9:16 animations, not stills.
- Transcript panel: the key sentence gets a lemon highlight, then a lemon **FLAGGED** tag drops onto the card.
- Idea log: each row gains a green `built (Mxx)` line in turn.
- Approve card: cursor clicks Approve, which turns into a green **Approved** pill.
- Render check: three frames, green check badges pop on one by one.
- "Three looks, one engine": the three looks animate in sync (counter 97, 81, 66, 61, 60).
- "Open the gallery" navigates to the gallery page.

## 4. The dashboard, panel by panel

### Top bar [seen]
- Eyebrow: `CLAUDE CODE MODS · FULL BREAKDOWN` (mono, tracked, muted).
- Tab pills (outlined, mono uppercase): `01 TOKENS`, `04 PULSE`, `07 MOTION LIBRARY`, `10 VIDEO BREAKDOWN`, **`11 MOTION BREAKDOWN`** (active: solid lemon, black text), `12 VIDEO INBOX`, `13 FIND YOUR MODS`. Numbers skip, implying a 13-mod series where only some have breakdowns [inferred].
- Title: "How the motion mod" / "*thinks*" (lemon italic).

### Stats (2x2, under a hairline) [seen]
| Value | Label |
|---|---|
| **24** (lemon) | PIECES IN THE LIBRARY |
| 374 | FINISHED FILES, EVERY FORMAT |
| 8 | IDEAS PITCHED |
| 0 | BUILT WITHOUT MY PICK |

Numbered sections follow, each `NN` (mono, muted) + serif title, separated by hairlines.

### 01 Where ideas come from [seen]
Three cards in a 2-col grid: **Videos I record** `5 IDEAS` · **Inspo I save** `2 IDEAS` · **Things I ask for** `1 IDEA` (5+2+1 = 8 pitched).

### 02 What it already has [seen]
4-col grid of 9:16 looping tiles with mono captions. Labels: M01 Signal, M02 Transitions, M03 Score, M05 Your Attunement, M06 Systems, M07 Statement Cards, M08 Name Cards, M09 One Number, M10 How it works, M11 Then & Now, M12 Series Openers, M13 Pop-outs, M14 Loops, M15 End Cards, M17 Quiet, M18 Scan Trail, M19 Spread Map, M20 Load Shift, M21 Then vs Now Tally, M22 Relay Line, M23 Highlight Sweep, M24 Path Trace. (22 shown; M04 and M16 absent, likely retired [inferred]; the stat still says 24.)

### 03 It reads every transcript [seen]
Two columns. Left: the source video (a blue-ground explainer with the creator's face cam and a 97 -> 81 -> 85 -> 75 -> 60% line chart), caption "The Achilles video". Right, mono panel:
```
transcript
(the quoted line: one runner's five scan scores, read out from 97 down to 60)

checked against the catalog
M11 Then & Now   only morphs two scans
M09 One Number   an aggregate stat, not one person's marker
nothing shows one marker sliding over five scans      <- lemon highlight
```
A lemon `FLAGGED` tag appears on the card.

### 04 The idea log [seen]
Stacked mono rows: idea name (lemon) + source (muted), then a status line.
| Idea | Source | Status |
|---|---|---|
| Scan Trail | Achilles video 0:22 | built (M18) |
| Spread Map | Achilles video 1:59 | built (M19) |
| Load Shift | Achilles video 1:36 | built (M20) |
| Path Trace | a reel I saved | built (M24) |
| Highlight Sweep | a reel I saved | built (M23) |
| Relay Line | my mods video 0:19 | built (M22) |
| Then vs Now Tally | my mods video 1:12 | built (M21) |
| Swab Unwrap | I asked for it | waiting on my photos |

7 built, 1 waiting [said: "seven of these are already built"].

### 05 Approve or pass [seen]
A paper-framed, horizontally scrolling row of white cards with a dark top rule:
- `MOTION IDEA` ........ `2026-10-08`
- Title (serif): "Relay Line"
- Pitch (sans): two or three sentences describing the graphic and what makes it reusable.
- Evidence (mono, muted): the source video, timestamp and the exact quoted line.
- `▸ WHY IT'S NEW` (disclosure)
- Buttons: **Approve** (pale lemon pill), **Pass** (outline pill), "Add a note" (underlined link). Approve becomes a green **Approved** pill.
- A second card for another idea sits to the right.
- Caption: "New ideas on my Pulse" (so these cards also appear in the **04 Pulse** mod [inferred]).

### 06 Stills before motion [seen]
Paper-framed triptychs, three looks per idea, lettered:
- **Scan Trail**: A Dotted Descent (ink ground, dotted line 97 -> 60 with lemon end dot, "The data moved first.", "first flagged / felt it" band, "The gap"), B Ledger (paper ground, five bar rows 97/81/75/66/60, last bar green, "Before it hurt, it showed."), C Horizon (green ground, huge "60", "down from 97 in November", dotted line).
- **Path Trace**: A Strobe trail (ghost frames and a dotted path), B Hairline arc (one traced line with frame ticks), C Comet (a tapered stroke and a ring on landing).
- **Highlight Sweep**: A Marker (a block behind the spoken words), B Underline run (a line under the phrase), C Lift out (the phrase rises off a blurred card).

### 07 Built in code [seen]
Mono panel:
```
the build
M18 Scan Trail. One marker across N scans.

Josh picked A (Dotted Descent) and asked for all three,      <- lemon
so one engine renders three looks.                          <- lemon

Josh's note: the lockup can't sit at the bottom (social UI covers it),
so everything lives between y 230 and 1520,
clear of the right-hand button rail.                         (highlighted when narrated)

variables  headline · values · dates · flagged · felt
```

### 08 It checks its own render [seen]
Three dark frames sampled from the render at increasing times (line drawing in, gap band, final dot), small timestamps top-left; green check badges pop on. Caption: "Frames pulled from the render before it's delivered".

### 09 Three looks, one engine [seen]
Descent / Ledger / Horizon playing in sync; the big number counts 97 -> 81 -> 66 -> 61 -> 60.

### 10 Into the library [seen]
Blue pill button **Open the gallery**, which opens the gallery page (below).

### 11 The loop [seen]
Pills with arrows, wrapping over three rows:
`Video, inspo or a request` -> `Check the catalog` -> `Log the idea` -> **`Approve or pass`** -> `3 stills` -> **`Pick one`** -> `Build in code` -> `Check the render` -> `Into the library`. The two human gates are lemon.

### 12 Any library [seen]
Cards: **Motion graphics** `MINE` · Sales decks · Email templates · Ad creative · Proposals. They light one by one as named.

## 5. The gallery page (Motion Library) [seen]
- Header: `ATTUNED` / "Motion\Library" (lemon backslash) / `VOL. 01 · V4` / `2 OCTOBER 2026` / `20 PIECES · 1 REEL`. Pure black ground, sans body, serif titles.
- **The reel**: `THE REEL · 47S · 9:16` "Noise to signal": one paragraph naming the pieces cut together into the reel. Video player below (seismograph-line field).
- **Palette in motion**: "Four grounds, one loud colour": swatches INK `#070908`, LEMON `#F3EC01`, GREEN `#22C55E`, PAPER `#F8F9EC`. one short paragraph on when the accent and band colours may be used
- **Motion voice**: "Precise, kinetic, earned", with easing demos ARRIVE and TRAVEL (a dot sliding along a line).
- One entry per piece: `Mxx · vN` (lemon mono) + serif title + paragraph + 3 variant videos with tracked labels. Seen: M01 Signal (a field of seismograph lines resolving to one signal; INK / GREEN, 16:9 too), M02 Transitions (PORTAL / TUNE / WHIP), M03 Score (FOCUS / BOARD · ENDURANCE DATA / ORBIT), M05 Your Attunement (INK · WELLNESS / STONE · WELLNESS / GREEN · ENDURANCE), M06 The Systems (openers per system).

## 6. Folder / file structure
The video never shows a file tree. Everything here is **[inferred]** from the labels:
- A set of numbered **Claude Code mods** (01 Tokens, 04 Pulse, 07 Motion Library, 10 Video Breakdown, 11 Motion Breakdown, 12 Video Inbox, 13 Find Your Mods), each a skill or agent plus a breakdown page.
- Library pieces are numbered `Mxx` with versions (`v2`), each one parametric code ("variables headline · values · dates · flagged · felt") that renders several looks and formats (374 finished files across 9:16 and 16:9).
- An idea log with idea, source (video + timestamp, saved reel, or a request), status and built-as id.
- Pitches dated, carrying the transcript evidence and a "why it's new" check against the catalog.

## 7. Tech stack, tools, agents, automations
- **Claude Code** runs everything ("my entire production team") [said]. Mods = Claude Code skills/agents [inferred].
- **Riverside** for recording, with editing automated and handed to a video-editor agent [said, in a pitch card's evidence].
- A separate agent that looks for motion graphics opportunities = the motion mod [said].
- Transcription of every edited video [said]; the tool is not named (Whisper or Riverside's own transcript [inferred]).
- Motion graphics "built in code", parameterised, rendered and frame-checked before delivery: very likely **Remotion** (React video; props = variables; `renderStill` for stills and frame checks) [inferred].
- Saved Instagram reels as an inspiration source [said].
- "Pulse" is where new pitches land for approve/pass [seen caption].

## 8. The creator's workflow, in order
1. Record a video (or save an inspiration reel, or ask for something).
2. The video mod edits it and transcribes it.
3. The motion mod reads the transcript and finds moments a graphic would explain better.
4. It checks each moment against the library catalog (what already exists, and why it doesn't fit).
5. It logs the idea with the exact line, timestamp and why nothing existing works.
6. It pitches the idea on Pulse. Human gate 1: **approve or pass** (with an optional note).
7. Approved ideas get **3 looks as stills** first, before any animation spend.
8. Human gate 2: **pick one** (or ask for all three); notes are applied.
9. It builds the piece in code as a reusable, parameterised engine.
10. It renders and checks its own frames before delivery.
11. The piece goes into the library (gallery), where future edits can pull it.
12. The same loop works for any library: sales decks, email templates, ad creative, proposals.

## 9. Mapping to GearBook (for the build)
- Attuned -> **GearBook** (affiliate gear catalogs for outdoor professionals, Instagram @gear.book). Josh -> **Luke** (founder, presenter bit).
- Videos I record -> GearBook reels (presenter bit, partner showcases, vibe reels). Inspo -> saved reels. Asks -> requests from Luke/Matt.
- Body scans -> GearBook data that reels talk about: catalog clicks, sales, partners, products, commission splits, members.
- Library pieces -> GearBook motion pieces (logo signal, partner wall, gear cutout fly-in, catalog card, commission split, then/now tally, presenter lower third, colour-bar end card, QR card, etc.).
- Palette -> GearBook brand: bark `#3D3522`, sage `#6A8D73`, cream `#F0F7EE`, amber `#F6AE2D` (plus slate `#33658A`). Fonts: Roca (Adobe kit, not redistributable), Outfit, Afacad Flux.
- GearBook copy rules apply: no em or en dashes, never promise earnings or quote rates, "outdoor professional" not "guide", links use https://www.gearbook.shop.

## 10. Where this rebuild differs
- Motion pieces are animated HTML pages (`public/pieces/`), the way Claude built GearBook's signup explainer, recorded frame by frame with `npm run render`. The creator's own engine isn't shown; Remotion was only a guess and isn't used.
- GearBook's first real library piece is M25, that signup explainer; its look is the house style.
