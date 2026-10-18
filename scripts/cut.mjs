// Cuts a reel from an edit list in edits/: every shot is trimmed, scaled to 1080x1920 and joined.
//   npm run cut -- edits/S08-huss-valley.json --clips="H:/.../GearBook/Marketing/Reels/Huss valley"
// Writes renders/<slug>/cut.mp4 (full quality, for Drive) and cut-preview.mp4 (720p, small
// enough to send). Without --clips it looks in inbox/videos/.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [edlPath, ...rest] = process.argv.slice(2);
const flag = (k) => rest.find((a) => a.startsWith(`--${k}=`))?.split("=").slice(1).join("=");
if (!edlPath) {
  console.error("usage: npm run cut -- edits/<id>-<slug>.json --clips=<folder>");
  process.exit(1);
}
const edl = JSON.parse(fs.readFileSync(edlPath, "utf8"));
const dir = flag("clips") ?? "inbox/videos";
const files = fs.readdirSync(dir);
const find = (clip) => {
  const f = files.find((x) => path.parse(x).name === clip);
  if (!f) throw new Error(`${clip} not found in ${dir}`);
  return path.join(dir, f);
};

const fps = edl.fps ?? 30;
const inputs = [];
let graph = "";
edl.shots.forEach((s, i) => {
  inputs.push("-ss", String(s.in), "-to", String(s.out), "-i", find(s.clip));
  graph += `[${i}:v]scale=1080:1920,fps=${fps},setsar=1,format=yuv420p[v${i}];`;
});
graph += edl.shots.map((_, i) => `[v${i}]`).join("") + `concat=n=${edl.shots.length}:v=1:a=0[out]`;

const outDir = path.join("renders", edl.slug);
fs.mkdirSync(outDir, { recursive: true });
const full = path.join(outDir, "cut.mp4");
const preview = path.join(outDir, "cut-preview.mp4");
const run = (a) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...a], { stdio: "inherit" });
run([...inputs, "-filter_complex", graph, "-map", "[out]", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-movflags", "+faststart", full]);
run(["-i", full, "-vf", "scale=720:1280", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", preview]);

let t = 0;
for (const s of edl.shots) {
  const len = s.out - s.in;
  console.log(`${String(t.toFixed(2)).padStart(6)}  ${s.clip}  ${len.toFixed(2)} s  ${s.beat}`);
  t += len;
}
console.log(`cut ${edl.slug}: ${edl.shots.length} shots, ${t.toFixed(2)} s -> ${full}, ${preview}`);
