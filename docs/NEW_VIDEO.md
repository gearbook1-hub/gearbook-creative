# Making a new video

From clips you've already filmed to a post on @gear.book. The hub doesn't cut footage: you still edit in CapCut or Premiere. What the hub does is tell you what to make, find the motion graphics the video needs, build and render them, and log the post.

Steps 4, 5, 7, 8 and 12 happen in Claude Code in this folder: just say the line in quotes. No API key needed.

## 1. Pick what it is
Open the [Idea bank](https://gearbook1-hub.github.io/gearbook-creative/ideas/) and tap **Make this week** on the idea your clips are for. Read the Identity page's voice and rules before writing the script or caption.

## 2. Put the clips in the inbox
Copy them into `inbox/videos/` (MP4, MOV or M4A). Git never uploads that folder.
- **Presenter bit (A):** put in the take with Luke's voice.
- **Vibe reel (B) or poster (C):** nothing to transcribe, skip to step 4.

## 3. Transcribe
Open a new terminal, then:

```bash
npm run transcribe
```

Whisper writes `inbox/transcripts/<clip>.json`, one timestamped line per sentence. The first run downloads the model (about 460 MB). Needs ffmpeg and openai-whisper (`npm run setup:check` says what's missing).

## 4. Log it
Say **"add `<clip>` as a new video source"**. Claude adds it to `data/sources.json` as the next `S` id, marked real (`sample: false`). For a vibe reel, give the one line of on-screen text instead.

## 5. Scout it
Say **"scout S08"** (the new id). Claude reads every line and checks each moment against the motion library:
- a piece that already fits (like the M25 end card) is noted for the edit;
- where nothing fits, it pitches at most 3 new pieces.

## 6. Approve or pass (your first yes)
Run `npm run dev`, open http://localhost:3000/library#pitches, then approve, pass or add a note on each pitch. Click **Copy decisions**, paste them to Claude and say **"apply these decisions"**.

## 7. Pick a look (your second yes)
For each approved piece Claude builds three looks and runs `npm run stills`. Pick one, or all three.

## 8. Build and check
Claude builds the piece as an animated page with your words and numbers, then runs `npm run render:check`: no blank frames, fonts loaded, nothing under Instagram's caption or button rail.

## 9. Render the graphics
Each piece becomes a 1080x1920, 60 fps MP4 in `renders/`:

```bash
npm run render -- M18-click-trail --look=ledger
```

New words or numbers go in with `--props={...}`, never new code.

## 10. Edit
In your editor, lay the rendered graphics over or between the clips:
- burn in the captions;
- keep text clear of the top 230 px and the bottom 400 px (and the right 180 px);
- end on the logo or the brand colour bars;
- for a vibe reel, add the trending sound in the Instagram app.

## 11. Post
One or two caption lines, then "Click the link in our bio". Credit people ("Featuring:", "Captured by:", "Edited by:"). `#gearbook #outdoorindustry`. No dashes, no amounts or rates, no fake deals.

## 12. Log it
Say **"posted `<idea>` today"**. Claude adds it to the Feed (`data/posts.json`), moves it to Posted in the gearbook repo's `docs/marketing/content-idea-bank.md`, and pushes (which updates the live hub). Send the likes and comments a few days later to fill them in.
