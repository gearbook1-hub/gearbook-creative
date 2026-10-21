// Sound for pieces and reels: the kit's manifest, measuring, and the one mixer every render uses.
// The kit is real CC0 recordings (public/pieces/sounds/, made by `npm run sound:prep`), not
// synthesis: rules and reasons in docs/context/motion-pieces.md "Sound".
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const KIT = path.resolve("public", "pieces", "sounds");
export const RATE = 48000;

export function manifest() {
  return JSON.parse(fs.readFileSync(path.join(KIT, "manifest.json"), "utf8"));
}

// ffmpeg writes its measurements to stderr; never let it wait on stdin.
export function ff(args, { check = true } = {}) {
  const r = spawnSync("ffmpeg", ["-nostdin", "-hide_banner", "-nostats", "-y", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 << 20 });
  if (check && r.status !== 0) throw new Error(`ffmpeg failed:\n${r.stderr.split("\n").slice(-8).join("\n")}`);
  return r.stderr;
}

const num = (s) => (s === undefined ? NaN : s === "-inf" ? -Infinity : Number(s));

/**
 * Loudness of a file. A short sound is measured with a second of silence after it, so the
 * EBU R128 gate has whole blocks to work with: "lufs" of a single hit means that, everywhere.
 * "phone" is the same measure with everything under 180 Hz cut (what a phone speaker plays).
 * "momentary" is the loudest 400 ms: for a track of a few short cues, the loudest cue.
 */
export function loudness(file, { pad = true } = {}) {
  const tail = pad ? ",apad=pad_dur=1" : "";
  const a = ff(["-i", file, "-af", `aresample=${RATE}${tail},ebur128=peak=true:framelog=info`, "-f", "null", "-"]);
  const b = ff(["-i", file, "-af", `aresample=${RATE},highpass=f=180,highpass=f=180${tail},ebur128`, "-f", "null", "-"]);
  const pick = (t, re) => num(t.match(re)?.[1]);
  return {
    lufs: pick(a, /Summary:[\s\S]*?I:\s+(-?[\d.]+|-inf)/),
    phone: pick(b, /Summary:[\s\S]*?I:\s+(-?[\d.]+|-inf)/),
    truePeak: pick(a, /True peak:[\s\S]*?Peak:\s+(-?[\d.]+|-inf)/),
    momentary: Math.max(...[...a.matchAll(/ M:\s*(-?[\d.]+)/g)].map((x) => Number(x[1]))),
  };
}

export function duration(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  return Number(r.stdout.trim());
}

const db = (g) => 20 * Math.log10(g);

/**
 * Which file each cue plays and at what gain (dB). A slot's level is the loudest 400 ms one hit
 * should have, the measure mix() targets; a cue's `gain` (linear, as pieces write it) trims
 * around that. Integrated loudness put a ding with a long tail 4 dB over its slot (2026-10-21). Repeats of a
 * slot rotate through its variations in cue order, so renders are repeatable.
 */
export function resolve(cues, kit = manifest()) {
  const seen = {};
  return [...cues].sort((a, b) => a.t - b.t).map((c) => {
    const slot = kit.slots[c.name];
    if (!slot) throw new Error(`unknown sound "${c.name}" (kit: ${Object.keys(kit.slots).join(", ")})`);
    // A slot with no approved sound yet plays nothing (the kit was emptied 2026-10-21).
    const files = slot.candidates[c.pick ?? slot.pick]?.files ?? [];
    if (!files.length) return null;
    const n = (seen[c.name] = (seen[c.name] ?? -1) + 1);
    const f = files[n % files.length];
    // Files are peaked at -1 dBTP; lifting a spiky one more than 6 dB would make a click.
    return { ...c, file: path.join(KIT, f.file), gainDb: Math.min(6, slot.level - (f.momentary ?? f.lufs)) + db(c.gain ?? 1) };
  }).filter(Boolean);
}

/**
 * Mixes resolved cues into one track of `seconds`: each cue placed on the clock, summed with no
 * automatic gain, low rumble cut, then one static gain for the whole track (so the balance
 * between cues holds) that puts its loudest moment at the kit's target, unless the true peak
 * would pass its ceiling first. A limiter only catches what's left.
 * Integrated loudness is the wrong target for a few short cues with silence between: lifting
 * it to -14 crushes every transient (tried 2026-10-21; the mixes came out at -21 anyway).
 * Writes a stereo WAV (the same mono mix in both channels, as Meta asks for stereo).
 */
export function mix(cues, seconds, out, kit = manifest()) {
  if (!cues.length) return false;
  const tmp = out.replace(/\.wav$/, "") + ".raw.wav";
  const inputs = [], parts = [];
  cues.forEach((c, i) => {
    inputs.push("-i", c.file);
    const ms = Math.max(0, Math.round(c.t * 1000));
    parts.push(`[${i}:a]aresample=${RATE}:resampler=soxr,aformat=channel_layouts=mono,volume=${c.gainDb.toFixed(2)}dB,adelay=${ms}:all=1[c${i}]`);
  });
  const graph = `${parts.join(";")};${cues.map((_, i) => `[c${i}]`).join("")}amix=inputs=${cues.length}:normalize=0:dropout_transition=0,highpass=f=90,apad=whole_dur=${seconds},atrim=0:${seconds},pan=stereo|c0=c0|c1=c0[m]`;
  ff([...inputs, "-filter_complex", graph, "-map", "[m]", "-c:a", "pcm_f32le", tmp]);
  const m = loudness(tmp, { pad: false });
  // Peaks are tamed in sound:prep (each slot's crest over its loudest 400 ms, sound-prep.mjs
  // CREST), so the loudest cue lands near the ceiling and the limiter only takes up to 3 dB off
  // where cues stack; past that the whole track comes down instead.
  // Leaning on it harder squashed whole hits (a 6 dB peak cut lost 4 LU, 2026-10-21). It runs
  // at 4x the rate so it catches the peaks between samples.
  const gain = Math.min(kit.target.momentary - m.momentary, kit.target.truePeak + 3 - m.truePeak);
  const limit = Math.pow(10, kit.target.truePeak / 20).toFixed(3);
  // Mono to stereo is done with pan, not -ac 2: ffmpeg's upmix puts a mono centre 3 dB down.
  ff(["-i", tmp, "-af", `volume=${gain.toFixed(2)}dB,aresample=${RATE * 4}:resampler=soxr,alimiter=limit=${limit}:attack=1:release=10:level=false:latency=true,aresample=${RATE}:resampler=soxr`, "-c:a", "pcm_s16le", out]);
  fs.rmSync(tmp, { force: true });
  return true;
}
