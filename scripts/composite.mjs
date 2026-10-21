// Finishes a reel: lays the edit list's graphics over renders/<slug>/cut.mp4 and adds their sounds.
//   npm run composite -- edits/S08-huss-valley.json
// Each graphic in the edit list: { piece, look, props, shot, offset, glass, sound }.
//   shot/offset  starts the graphic `offset` seconds into shot number `shot` (0 is the first shot)
//   glass        blurs the footage behind the graphic's shape (a phone notification's frosted
//                glass); the piece draws that shape when given props { mask: true }
//   sound        a kit sound ("ding"), played when the graphic starts (+ soundOffset seconds)
// A piece's own Sound.cue()s come along too, on the reel's clock, unless the kit is on hold
// (pass --sound to hear them anyway). Everything is mixed by scripts/sound.mjs.
// Writes renders/<slug>/final.mp4 and final-preview.mp4 (720p, small enough to send).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { openPiece } from "./motion.mjs";
import { manifest, mix, resolve } from "./sound.mjs";

const edlPath = process.argv[2];
if (!edlPath) {
  console.error("usage: npm run composite -- edits/<id>-<slug>.json");
  process.exit(1);
}
const edl = JSON.parse(fs.readFileSync(edlPath, "utf8"));
const kit = manifest();
const withPieceSounds = kit.enabled || process.argv.includes("--sound");
const fps = edl.fps ?? 30;
const dir = path.join("renders", edl.slug);
const cut = path.join(dir, "cut.mp4");
if (!fs.existsSync(cut)) throw new Error(`${cut} missing: run npm run cut first`);

const starts = [];
let total = 0;
for (const s of edl.shots) { starts.push(total); total += s.out - s.in; }

async function record(g, props, out) {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const p = await openPiece(g.piece, { look: g.look, props: JSON.stringify(props) });
  const frames = Math.round(p.duration * fps);
  for (let i = 0; i <= frames; i++) await p.frame(i / fps, path.join(out, `${String(i).padStart(5, "0")}.png`));
  const cues = await p.cues();
  await p.close();
  return cues;
}

const inputs = ["-i", cut];
let graph = "", v = "0:v", n = 1;
const cues = [];
for (const [i, g] of (edl.graphics ?? []).entries()) {
  const at = +(starts[g.shot] + (g.offset ?? 0)).toFixed(3);
  const frames = path.join(dir, `.g${i}`);
  const own = await record(g, g.props ?? {}, frames);
  if (withPieceSounds) cues.push(...own.map((c) => ({ ...c, t: at + c.t })));
  inputs.push("-framerate", String(fps), "-i", path.join(frames, "%05d.png"));
  const gi = n++;
  graph += `[${gi}:v]format=rgba,tpad=start_duration=${at}:color=black@0[g${i}];`;
  if (g.glass) {
    const masks = path.join(dir, `.m${i}`);
    await record(g, { ...(g.props ?? {}), mask: true }, masks);
    inputs.push("-framerate", String(fps), "-i", path.join(masks, "%05d.png"));
    const mi = n++;
    graph += `[${mi}:v]format=rgba,tpad=start_duration=${at}:color=black@0,alphaextract[m${i}];`;
    graph += `[${v}]split[b${i}][s${i}];[s${i}]boxblur=30:3,eq=brightness=0.06:saturation=1.35[bl${i}];[bl${i}][m${i}]alphamerge[gl${i}];`;
    graph += `[b${i}][gl${i}]overlay=eof_action=pass[w${i}];`;
    v = `w${i}`;
  }
  graph += `[${v}][g${i}]overlay=eof_action=pass[o${i}];`;
  v = `o${i}`;
  if (g.sound) cues.push({ t: at + (g.soundOffset ?? 0), name: g.sound, gain: g.soundGain ?? 1 });
  console.log(`graphic ${g.piece} ${g.look ?? ""} at ${at}s${g.glass ? " (glass)" : ""}`);
}
const wav = path.join(dir, "sound.wav");
const audio = mix(resolve(cues, kit), total, wav, kit);
if (audio) inputs.push("-i", wav);
graph = graph.replace(/;$/, "");

const final = path.join(dir, "final.mp4"), preview = path.join(dir, "final-preview.mp4");
const run = (a) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...a], { stdio: "inherit" });
run([...inputs, "-filter_complex", graph, "-map", `[${v}]`, ...(audio ? ["-map", `${n}:a`, "-c:a", "aac", "-b:a", "192k", "-ar", "48000"] : []),
  "-t", total.toFixed(3), "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", final]);
run(["-i", final, "-vf", "scale=720:1280", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-c:a", "copy", "-movflags", "+faststart", preview]);
for (const f of fs.readdirSync(dir)) if (/^\.[gm]\d+$/.test(f)) fs.rmSync(path.join(dir, f), { recursive: true, force: true });
fs.rmSync(wav, { force: true });
fs.rmSync(wav, { force: true });
console.log(`composite ${edl.slug}: ${total.toFixed(2)} s -> ${final}, ${preview}`);
