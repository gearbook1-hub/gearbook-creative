// GearBook sound for motion pieces and reels. A piece cues a few sounds on its own clock:
//   Sound.cue(4.45, "tap");  Sound.cue(8.4, "chime", { gain: 0.8 });
// The names are the kit's slots (tap, tick, whoosh, swoosh, thump, chime, paper, ding): real CC0
// recordings in ./sounds/, listed with their sources in sounds/sources.json. `npm run render`
// mixes the cues in Node (scripts/sound.mjs), which is the master; this file only previews them
// in the browser once someone presses "Sound" (browsers block audio until a click).
//
// Rules (docs/context/motion-pieces.md, "Sound"): few, soft, natural, one sound per moment that
// matters. Nothing on every keystroke or every item in a fast run, no cartoon sounds.
(function () {
  const q = new URLSearchParams(location.search);
  const cues = [];
  // ?pick=tap:B,whoosh:C auditions other candidates for a slot (renders take --pick= too).
  const picks = Object.fromEntries((q.get("pick") || "").split(",").filter(Boolean).map((p) => p.split(":")));
  const base = new URL("sounds/", document.currentScript.src).href;
  let kit = null;
  const kitReady = fetch(base + "manifest.json").then((r) => r.json()).then((m) => (kit = m)).catch(() => null);

  const Sound = {
    cue(t, name, { gain = 1 } = {}) { cues.push({ t, name, gain, pick: picks[name] }); },
    /** For renders and sound:check: the cues, in the order they were written. */
    get cues() { return cues.slice(); },
    get picks() { return picks; },
  };

  // Same choices as scripts/sound.mjs resolve(): the slot's level, a cue's gain around it, and
  // repeats rotating through the variations in time order.
  function resolve() {
    const seen = {};
    return cues.slice().sort((a, b) => a.t - b.t).map((c) => {
      const slot = kit.slots[c.name];
      if (!slot) { console.warn("unknown sound", c.name); return null; }
      const files = (slot.candidates[c.pick] || slot.candidates[slot.pick]).files;
      const n = (seen[c.name] = (seen[c.name] ?? -1) + 1);
      const f = files[n % files.length];
      return { t: c.t, file: f.file, gainDb: Math.min(6, slot.level - (f.momentary ?? f.lufs)) + 20 * Math.log10(c.gain) };
    }).filter(Boolean);
  }

  // A rough loudest 400 ms of the mix (block RMS, no K-weighting) so the preview plays near the
  // render's level. The render measures properly.
  function roughMomentary(data, rate) {
    const block = Math.round(0.4 * rate), step = Math.round(0.1 * rate);
    let max = -70;
    for (let i = 0; i + block <= data.length; i += step) {
      let s = 0;
      for (let j = i; j < i + block; j++) s += data[j] * data[j];
      max = Math.max(max, -0.691 + 10 * Math.log10(s / block + 1e-12));
    }
    return max;
  }

  async function track(seconds) {
    const rate = 48000;
    const ctx = new OfflineAudioContext(1, Math.ceil(seconds * rate), rate);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 90;
    hp.connect(ctx.destination);
    const buffers = {};
    for (const c of resolve()) {
      buffers[c.file] ??= await ctx.decodeAudioData(await (await fetch(base + c.file)).arrayBuffer());
      const src = ctx.createBufferSource(), g = ctx.createGain();
      src.buffer = buffers[c.file];
      g.gain.value = Math.pow(10, c.gainDb / 20);
      src.connect(g).connect(hp);
      src.start(c.t);
    }
    const out = await ctx.startRendering();
    const data = out.getChannelData(0);
    // As the render: the loudest moment to the target, unless the peak would pass the ceiling by
    // more than 3 dB (the clamp below stands in for the render's limiter).
    let peak = 1e-9;
    for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
    const db = Math.min(kit.target.momentary - roughMomentary(data, rate), kit.target.truePeak + 3 - 20 * Math.log10(peak));
    const gain = Math.pow(10, db / 20);
    const limit = Math.pow(10, kit.target.truePeak / 20);
    for (let i = 0; i < data.length; i++) data[i] = Math.max(-limit, Math.min(limit, data[i] * gain));
    return out;
  }

  // Live playback: a small "Sound" button outside the recording. Pressing it restarts the loop
  // from 0 with the track, and every loop after that starts the track again.
  let live = null;
  async function startLive() {
    const M = window.Motion;
    const ctx = new AudioContext();
    const buffer = await track(M.duration + (M.hold ?? 1)).catch((e) => { ctx.close(); throw e; });
    let node = null;
    const play = () => {
      if (node) try { node.stop(); } catch (e) { /* already stopped */ }
      node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(ctx.destination);
      node.start();
    };
    M.onLoop(play);
    M.restart();
    play();
    live = { ctx, stop: () => { node && node.stop(); ctx.close(); M.onLoop(null); } };
  }

  async function controls() {
    if (q.get("render") === "1" || q.get("t") !== null) return;
    await kitReady;
    // While the kit is on hold (manifest "enabled": false) only ?sound=1 shows the button.
    const on = !!kit && cues.length > 0 && (kit.enabled || q.get("sound") === "1");
    const top = window.top === window;
    if (!top && !on) return;
    // Opened on its own: a dark surround around the centred stage.
    if (top) document.body.style.background = "#1d1a12";
    const style = document.createElement("style");
    style.textContent = `.motion-controls{position:fixed;top:10px;right:10px;z-index:10;display:flex;gap:6px}
.motion-controls button{font:600 13px/1 system-ui,sans-serif;padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.4);background:rgba(29,26,18,.75);color:#fff;cursor:pointer}
.motion-controls button[aria-pressed="true"]{background:#f6ae2d;color:#3d3522;border-color:#f6ae2d}`;
    document.head.appendChild(style);
    const bar = document.createElement("div");
    bar.className = "motion-controls";
    const btn = (label, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", fn);
      bar.appendChild(b);
      return b;
    };
    let busy = false;
    const off = () => { sound.textContent = "Sound"; sound.removeAttribute("aria-pressed"); };
    const sound = !on ? null : btn("Sound", async () => {
      if (busy) return; // still building the track
      if (live) { live.stop(); live = null; off(); return; }
      sound.textContent = "Sound on";
      sound.setAttribute("aria-pressed", "true");
      busy = true;
      try { await startLive(); } catch (e) { console.error("sound preview failed", e); off(); } finally { busy = false; }
    });
    if (top) btn("Full screen", () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()));
    document.body.appendChild(bar);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", controls);
  else controls();

  window.Sound = Sound;
})();
