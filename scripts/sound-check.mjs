// Step "Check the sound": objective gates for a builder who can't listen. Run before delivering
// anything with sound, and say in the handover that a person still has to listen.
//   npm run sound:check -- R04-one-click            a piece: mixes its cues, checks cues and track
//   npm run sound:check -- R04-one-click --pick=tap:B
//   npm run sound:check -- renders/huss-valley/final.mp4   a finished file: the track only
// Exit 1 if any gate fails. The numbers live in GATES below; the reasons for each are in
// docs/context/motion-pieces.md "Sound".
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { args, openPiece } from "./motion.mjs";
import { duration, loudness, manifest, mix, resolve } from "./sound.mjs";

const GATES = {
  momentary: [-18, -13], // the loudest 400 ms (the loudest cue): the trending sound goes on top
  truePeak: -1,          // dBTP ceiling, headroom for AAC and the trending sound on top
  phoneLoss: 3,          // LU lost when everything under 180 Hz is cut (a phone speaker)
  minGap: 0.15,          // seconds between cue onsets, or they smear into one
  maxCues: 10,           // per reel; quiet between them is part of the sound
  perName: { chime: 1, ding: 3 },
};

const { piece, pick } = args();
const fails = [], notes = [];
const fail = (m) => fails.push(m);
let file = piece, cues = null;

if (!fs.existsSync(piece)) {
  const kit = manifest();
  const p = await openPiece(piece);
  const raw = (await p.cues()).map((c) => ({ ...c, pick: pick[c.name] ?? c.pick }));
  const seconds = p.duration + 0.5;
  await p.close();
  if (!raw.length) { console.log(`${piece} cues no sounds.`); process.exit(0); }
  cues = resolve(raw, kit);
  file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "sound-check-")), `${piece}.wav`);
  mix(cues, seconds, file, kit);
  if (!kit.enabled) notes.push("the kit is on hold (manifest enabled: false); this checks the mix a render would make with --sound");

  console.log(`\n${piece}: ${cues.length} cues`);
  console.log("  time    sound    file              dB");
  for (const c of cues) console.log(`  ${c.t.toFixed(2).padStart(6)}  ${c.name.padEnd(7)}  ${path.relative(path.resolve("public/pieces/sounds"), c.file).replace(/\\/g, "/").padEnd(16)}  ${c.gainDb >= 0 ? "+" : ""}${c.gainDb.toFixed(1)}`);
  if (cues.length > GATES.maxCues) fail(`${cues.length} cues (at most ${GATES.maxCues})`);
  for (const [name, max] of Object.entries(GATES.perName)) {
    const k = cues.filter((c) => c.name === name).length;
    if (k > max) fail(`${k} × ${name} (at most ${max})`);
  }
  for (let i = 1; i < cues.length; i++) {
    const gap = cues[i].t - cues[i - 1].t;
    if (gap < GATES.minGap) fail(`${cues[i - 1].name} at ${cues[i - 1].t}s and ${cues[i].name} at ${cues[i].t}s are ${Math.round(gap * 1000)} ms apart (at least ${GATES.minGap * 1000})`);
  }
  for (let i = 2; i < cues.length; i++) {
    if (cues[i].name === cues[i - 1].name && cues[i].name === cues[i - 2].name) notes.push(`three ${cues[i].name}s in a row ending at ${cues[i].t}s: a run like that reads as a toy`);
  }
}

const m = loudness(file, { pad: false });
console.log(`\ntrack ${path.basename(file)} (${duration(file).toFixed(2)} s): loudest moment ${m.momentary} LUFS, integrated ${m.lufs} LUFS, true peak ${m.truePeak} dBTP, phone ${m.phone} LUFS`);
if (!(m.momentary >= GATES.momentary[0] && m.momentary <= GATES.momentary[1])) fail(`loudest moment ${m.momentary} LUFS (want ${GATES.momentary[0]} to ${GATES.momentary[1]})`);
if (!(m.truePeak <= GATES.truePeak)) fail(`true peak ${m.truePeak} dBTP (at most ${GATES.truePeak})`);
if (!(m.lufs - m.phone <= GATES.phoneLoss)) fail(`loses ${(m.lufs - m.phone).toFixed(1)} LU on a phone speaker (at most ${GATES.phoneLoss}): too much of it is under 180 Hz`);

for (const n of notes) console.log(`note  ${n}`);
for (const f of fails) console.log(`FAIL  ${f}`);
if (fails.length) {
  console.error(`\n${fails.length} sound check(s) failed. Fix before delivering.`);
  process.exit(1);
}
console.log("\nSound gates pass. A person still has to listen before it ships.");
