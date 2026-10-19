// Step "3 stills": one still per look so Luke can pick a direction before anything is
// animated further. Writes stills/out/<piece>-<look>.png.
//   npm run stills                                  M18, every look, at the settled end
//   npm run stills -- M18-click-trail --t=2.5
// Overlay pieces can be shown in place over a frame of the cut (never committed):
//   npm run stills -- M26-ping --t=1.5 --over=renders/huss-valley/cut.mp4@2.0
import fs from "node:fs";
import { args, ffmpeg, looksOf, openPiece } from "./motion.mjs";

const { piece, t, props, over } = args();
fs.mkdirSync("stills/out", { recursive: true });
let backdrop;
if (over) {
  const [file, at] = over.split("@");
  backdrop = `stills/out/${piece}-backdrop.png`;
  ffmpeg(["-ss", at || "0", "-i", file, "-frames:v", "1", "-vf", "scale=1080:1920", backdrop]);
}
for (const look of looksOf(piece)) {
  const p = await openPiece(piece, { look, props });
  const out = `stills/out/${piece}-${look ?? "main"}.png`;
  await p.frame(t ? Number(t) : p.duration, out);
  await p.close();
  if (backdrop && p.overlay) {
    ffmpeg(["-i", backdrop, "-i", out, "-filter_complex", "overlay=0:0", `${out}.tmp.png`]);
    fs.renameSync(`${out}.tmp.png`, out);
  }
  console.log(`still ${piece} ${look ?? ""} -> ${out}`);
}
