"""Transcribe every new reel in the inbox with Whisper (model small).

  npm run transcribe            # all videos in inbox/videos without a transcript
  npm run transcribe -- reel.mp4

Writes inbox/transcripts/<name>.json as [{"t": "0:22", "text": "..."}], the shape
data/sources.json uses, so the lines can be pasted into a source as-is.
Raw videos and transcripts stay out of git (.gitignore).
"""
import json
import os
import sys

import whisper

VIDEO_DIR = os.environ.get("INBOX_VIDEO_DIR") or "inbox/videos"
OUT_DIR = "inbox/transcripts"


def stamp(seconds: float) -> str:
    m, s = divmod(int(seconds), 60)
    return f"{m}:{s:02d}"


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    names = sys.argv[1:] or sorted(f for f in os.listdir(VIDEO_DIR) if f.lower().endswith((".mp4", ".mov", ".m4a")))
    todo = [n for n in names if not os.path.exists(os.path.join(OUT_DIR, os.path.splitext(n)[0] + ".json"))]
    if not todo:
        print("Nothing new in", VIDEO_DIR)
        return
    model = whisper.load_model("small")
    for name in todo:
        result = model.transcribe(os.path.join(VIDEO_DIR, name), language="en")
        lines = [{"t": stamp(seg["start"]), "text": seg["text"].strip()} for seg in result["segments"]]
        out = os.path.join(OUT_DIR, os.path.splitext(name)[0] + ".json")
        with open(out, "w", encoding="utf8") as f:
            json.dump(lines, f, indent=2, ensure_ascii=False)
        print(f"{name}: {len(lines)} lines -> {out}")


if __name__ == "__main__":
    main()
