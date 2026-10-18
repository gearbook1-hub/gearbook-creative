// Contact sheets for choosing takes: one image per clip at 6 fps, 10 frames a row,
// so frame k of a sheet is at k / 6 seconds. Written to inbox/sheets/ (never committed).
//   npm run sheets -- "H:/.../GearBook/Marketing/Reels/Huss valley"
// Frames are portrait if the phone was: ffmpeg applies the rotation tag itself.
// No drawtext: it crashes the Windows ffmpeg build (no fontconfig).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error("usage: npm run sheets -- <folder of clips>");
  process.exit(1);
}
const out = "inbox/sheets";
fs.mkdirSync(out, { recursive: true });
const clips = fs.readdirSync(dir).filter((f) => /\.(mov|mp4|m4v)$/i.test(f)).sort();
for (const f of clips) {
  const file = path.join(dir, f);
  const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());
  const rows = Math.ceil((dur * 6) / 10);
  const name = path.parse(f).name;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", file, "-vf", `fps=6,scale=-2:240,tile=10x${rows}:padding=4:color=white`, "-frames:v", "1", path.join(out, `${name}.jpg`)]);
  console.log(`${name}  ${dur.toFixed(2)} s  -> ${out}/${name}.jpg`);
}
