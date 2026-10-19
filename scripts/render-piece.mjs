// Delivery: records a piece to MP4 (1080x1920, H.264, 60 fps by default).
//   npm run render                                  M18, every look
//   npm run render -- M18-click-trail --look=ledger --props={"values":[3,9,20,41,77]}
// New words or numbers never need new code: pass props.
import fs from "node:fs";
import path from "node:path";
import { args, ffmpeg, looksOf, openPiece } from "./motion.mjs";

const { piece, look: only, props, fps } = args();
fs.mkdirSync("renders", { recursive: true });
for (const look of only ? [only] : looksOf(piece)) {
  const p = await openPiece(piece, { look, props });
  const dir = fs.mkdtempSync(path.join("renders", ".frames-"));
  const frames = Math.round(p.duration * fps);
  for (let i = 0; i <= frames; i++) await p.frame(i / fps, path.join(dir, `${String(i).padStart(5, "0")}.png`));
  // Pieces that cue sounds (sound.js) get them mixed in, on the same clock as the frames.
  const wav = path.join(dir, "sound.wav");
  const hasSound = await p.audio((frames + 1) / fps, wav);
  await p.close();
  // Overlays keep their transparency (ProRes 4444) so they can be laid over footage.
  const out = `renders/${piece}-${look ?? "main"}.${p.overlay ? "mov" : "mp4"}`;
  const codec = p.overlay ? ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le"] : ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18"];
  const audio = hasSound ? ["-i", wav, "-map", "0:v", "-map", "1:a", "-c:a", p.overlay ? "pcm_s16le" : "aac", "-b:a", "192k", "-shortest"] : [];
  ffmpeg(["-framerate", String(fps), "-i", path.join(dir, "%05d.png"), ...audio, ...codec, out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`render ${piece} ${look ?? ""} -> ${out} (${frames + 1} frames)`);
}
