// GearBook sound for motion pieces and reels. A piece cues a few sounds on its own clock:
//   Sound.cue(4.45, "tap");  Sound.cue(8.4, "chime", { gain: 0.8 });
// The browser plays them in sync with the loop once someone presses "Sound" (browsers block
// audio until a click), and `npm run render` mixes the same cues into the MP4 master.
//
// The kit is small on purpose (rules in docs/context/motion-pieces.md, "Sound"): soft, natural,
// one sound per moment that matters. No cartoon sounds (boings, rising pitched pops), nothing on
// every keystroke or every item in a fast run. Matt was critical of the signup reel's busy
// effects; this kit answers that. Everything is synthesised here except the notification ding,
// which is M26's real ding.wav.
(function () {
  // On hold (Luke, 2026-10-19: "the sounds aren't great and will need to be redone"). While false,
  // pieces keep their cues but nothing plays: no Sound button, and renders come out silent.
  // Add ?sound=1 to a piece's URL to audition the current kit anyway.
  const ENABLED = new URLSearchParams(location.search).get("sound") === "1";
  const RATE = 48000;
  const cues = [];

  // Deterministic noise, so every render of a piece sounds the same.
  function noise(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return ((s >>> 0) / 4294967296) * 2 - 1;
    };
  }
  // A two-pole band-pass (state variable filter), retuned per sample.
  function svf() {
    let low = 0, band = 0;
    return (x, f, q) => {
      const k = 2 * Math.sin(Math.PI * Math.min(f, RATE / 6) / RATE);
      low += k * band;
      const high = x - low - q * band;
      band += k * high;
      return band;
    };
  }
  const buf = (sec, fn) => {
    const n = Math.round(sec * RATE);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) out[i] = fn(i / RATE, i);
    return out;
  };

  const KIT = {
    // A finger on glass: a short, soft click with a little body. For taps and button presses.
    tap: () => {
      const r = noise(7), bp = svf();
      return buf(0.05, (t) => 0.35 * bp(r(), 2600, 0.9) * Math.exp(-t / 0.006) + 0.12 * Math.sin(2 * Math.PI * 1500 * t) * Math.exp(-t / 0.008));
    },
    // Quieter still: one tick for a counter stepping up. Never one per keystroke.
    tick: () => {
      const r = noise(11), bp = svf();
      return buf(0.03, (t) => 0.18 * bp(r(), 4200, 1.1) * Math.exp(-t / 0.003));
    },
    // Air moving past: a band of noise sweeping up, for a ground wiping in or a big move.
    whoosh: () => {
      const r = noise(23), bp = svf(), len = 0.5;
      return buf(len, (t) => {
        const p = t / len;
        return 0.5 * bp(r(), 350 + 2200 * p * p, 1.2) * Math.pow(Math.sin(Math.PI * p), 1.6);
      });
    },
    // The same, falling: something settling or leaving.
    swoosh: () => {
      const r = noise(29), bp = svf(), len = 0.45;
      return buf(len, (t) => {
        const p = t / len;
        return 0.45 * bp(r(), 2400 - 1900 * p, 1.2) * Math.pow(Math.sin(Math.PI * p), 1.6);
      });
    },
    // A soft landing: a word slamming in, a card or bar settling. The low body is felt on
    // headphones; the 160 Hz knock is what a phone speaker (nothing below about 150 Hz) plays.
    thump: () => {
      const r = noise(31), bp = svf();
      let ph = 0, ph2 = 0;
      return buf(0.32, (t) => {
        ph += (2 * Math.PI * (55 + 40 * Math.exp(-t / 0.03))) / RATE;
        ph2 += (2 * Math.PI * (165 + 60 * Math.exp(-t / 0.02))) / RATE;
        return 0.3 * Math.sin(ph) * Math.exp(-t / 0.075) + 0.2 * Math.sin(ph2) * Math.exp(-t / 0.04) + 0.06 * bp(r(), 900, 1.4) * Math.exp(-t / 0.01);
      });
    },
    // One clean, warm two-note bell for the payoff (the sale lands, the bar loads). Once per reel.
    chime: () => buf(1.6, (t) => {
      const a = Math.min(1, t / 0.004);
      const n1 = Math.sin(2 * Math.PI * 784 * t) * Math.exp(-t / 0.55);
      const n2 = t > 0.11 ? Math.sin(2 * Math.PI * 1175 * (t - 0.11)) * Math.exp(-(t - 0.11) / 0.6) : 0;
      const shimmer = 0.15 * Math.sin(2 * Math.PI * 2350 * t) * Math.exp(-t / 0.18);
      return 0.11 * a * (n1 + 0.8 * n2 + shimmer);
    }),
    // A pen or a print press: a dry, short paper slide. For the poster.
    paper: () => {
      const r = noise(41), bp = svf(), len = 0.35;
      return buf(len, (t) => {
        const p = t / len;
        return 0.4 * bp(r(), 1600 + 600 * Math.sin(p * 9), 2.2) * Math.sin(Math.PI * p);
      });
    },
  };
  // Real recordings, fetched relative to the piece's folder.
  const FILES = { ding: "../M26-ping/ding.wav" };

  async function load(ctx, names) {
    const out = {};
    for (const name of names) {
      if (KIT[name]) out[name] = KIT[name]();
      else if (FILES[name]) {
        const data = await (await fetch(FILES[name])).arrayBuffer();
        const audio = await ctx.decodeAudioData(data);
        // Resample to RATE by linear interpolation and fold to mono.
        const src = audio.getChannelData(0), ratio = audio.sampleRate / RATE;
        const n = Math.floor(src.length / ratio), mono = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          const x = i * ratio, j = Math.floor(x), f = x - j;
          mono[i] = (src[j] * (1 - f) + (src[j + 1] ?? 0) * f) * 0.5;
        }
        out[name] = mono;
      } else console.warn("unknown sound", name);
    }
    return out;
  }

  // Mix every cue into one mono track of `seconds`, with a gentle limiter so nothing clips.
  async function mixdown(ctx, seconds) {
    const sounds = await load(ctx, [...new Set(cues.map((c) => c.name))]);
    const out = new Float32Array(Math.ceil(seconds * RATE));
    for (const c of cues) {
      const s = sounds[c.name];
      if (!s) continue;
      const at = Math.round(c.t * RATE);
      for (let i = 0; i < s.length && at + i < out.length; i++) if (at + i >= 0) out[at + i] += s[i] * c.gain;
    }
    for (let i = 0; i < out.length; i++) out[i] = Math.tanh(out[i] * 1.2) / 1.2;
    return out;
  }

  function wav(samples) {
    const bytes = new ArrayBuffer(44 + samples.length * 2), v = new DataView(bytes);
    const str = (o, s) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
    str(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVEfmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, "data"); v.setUint32(40, samples.length * 2, true);
    samples.forEach((x, i) => v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, x)) * 0x7fff, true));
    let bin = "";
    const u8 = new Uint8Array(bytes);
    for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  const Sound = {
    cue(t, name, { gain = 1 } = {}) { cues.push({ t, name, gain }); },
    get cues() { return cues.slice(); },
    /** For `npm run render`: the whole track as a base64 WAV. */
    async wav(seconds) {
      if (!ENABLED || !cues.length) return null;
      const ctx = new OfflineAudioContext(1, RATE, RATE);
      return wav(await mixdown(ctx, seconds));
    },
  };

  // Live playback: a small "Sound" button outside the recording. Pressing it restarts the loop
  // from 0 with the track, and every loop after that starts the track again.
  let live = null;
  async function startLive() {
    const M = window.Motion;
    const ctx = new AudioContext({ sampleRate: RATE });
    const loopLen = M.duration + (M.hold ?? 1);
    const samples = await mixdown(ctx, loopLen);
    const buffer = ctx.createBuffer(1, samples.length, RATE);
    buffer.copyToChannel(samples, 0);
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

  function controls() {
    const q = new URLSearchParams(location.search);
    if (q.get("render") === "1" || q.get("t") !== null) return;
    const top = window.top === window;
    // In the hub's frames there's nothing to show while sound is on hold.
    if (!top && !(ENABLED && cues.length)) return;
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
    const sound = !(ENABLED && cues.length) ? null : btn("Sound", async () => {
      if (live) { live.stop(); live = null; sound.textContent = "Sound"; sound.removeAttribute("aria-pressed"); return; }
      sound.textContent = "Sound on";
      sound.setAttribute("aria-pressed", "true");
      await startLive();
    });
    if (top) btn("Full screen", () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()));
    document.body.appendChild(bar);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", controls);
  else controls();

  window.Sound = Sound;
})();
