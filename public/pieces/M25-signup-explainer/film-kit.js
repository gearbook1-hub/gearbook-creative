// Plays M25, the signup reel, live. The reel was made as a Motion artifact on Matt's Claude
// account ("GearBook Signup Reel"); film/ holds its own scenes, shared code, styles and images,
// copied unchanged from that artifact. This file is a small stand-in for the artifact's player:
// it gives the scenes the few kit helpers they use and drives them from one clock, with the
// same contract as public/pieces/runtime.js, so the hub, stills and `npm run render` treat it
// like every other piece:
//   loop (default) · freeze on a frame: ?t=4.2 · record: ?render=1, then Motion.seek(t)
// Sound (film/modules/score.js) isn't played here; the MP4 master has it.
(function () {
  const q = new URLSearchParams(location.search);
  const ROOT = "film/";
  const SCENE_FILES = ["questions", "signup", "add-product", "share-it", "pack-it"];

  // Time and easing, as the artifact's kit defines them (all pure functions of t).
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const clamp01 = (x) => clamp(x, 0, 1);
  const seg = (t, a, b) => (b === a ? (t >= b ? 1 : 0) : clamp01((t - a) / (b - a)));
  const lerp = (a, b, p) => a + (b - a) * p;
  const eo = (x) => 1 - Math.pow(1 - clamp01(x), 3);
  const ei = (x) => Math.pow(clamp01(x), 3);
  const eio = (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const eob = (x, s = 1.4) => { x = clamp01(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
  const breathe = (t, amt = 0.012, period = 3.2) => 1 + amt * Math.sin((2 * Math.PI * t) / period);

  // Word-by-word type: split once into word spans, then set each word from t.
  function words(el) {
    if (!el._words) {
      const text = el.textContent;
      el.textContent = "";
      el._words = text.split(/(\s+)/).filter(Boolean).map((w) => {
        if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(w)); return null; }
        const s = document.createElement("span");
        s.textContent = w;
        s.style.display = "inline-block";
        el.appendChild(s);
        return s;
      }).filter(Boolean);
    }
    return el._words;
  }
  const TextFx = {
    fadeFromRight(el, t, t0, { stagger = 0.11, dur = 0.5, dx = 26 } = {}) {
      const ws = words(el);
      ws.forEach((w, i) => {
        const p = eo(seg(t, t0 + i * stagger, t0 + i * stagger + dur));
        w.style.opacity = String(p);
        w.style.transform = "translateX(" + dx * (1 - p) + "px)";
      });
      return t0 + (ws.length - 1) * stagger + dur;
    },
    fadeOutLeft(el, t, t0, { stagger = 0.06, dur = 0.35, dx = 26 } = {}) {
      const ws = words(el);
      ws.forEach((w, i) => {
        const p = ei(seg(t, t0 + i * stagger, t0 + i * stagger + dur));
        w.style.opacity = String(1 - p);
        w.style.transform = "translateX(" + -dx * p + "px)";
      });
      return t0 + (ws.length - 1) * stagger + dur;
    },
  };

  const registry = {};
  let assetNames = new Set();

  function makeKit(stage) {
    return {
      seg, lerp, eo, ei, eio, eob, clamp, clamp01, breathe, TextFx,
      W: 1080, H: 1920, stage,
      h(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; },
      css(text) { const s = document.createElement("style"); s.textContent = text; stage.appendChild(s); },
      assets: { url: (n) => ROOT + "assets/" + n, has: (n) => assetNames.has(n) },
      scene(id, def) { registry[id] = def; },
      score() { /* foley lives in the MP4 master */ },
    };
  }

  const fetchText = (p) => fetch(ROOT + p).then((r) => { if (!r.ok) throw new Error(p + " " + r.status); return r.text(); });
  const run = (code, kit, name) => new Function("kit", code + "\n//# sourceURL=" + name)(kit);

  let scenes = [];
  let duration = 0;

  function seek(t) {
    let i = scenes.findIndex((s) => t < s.start + s.dur);
    if (i < 0) i = scenes.length - 1;
    scenes.forEach((s, j) => { s.box.style.display = j === i ? "" : "none"; });
    const s = scenes[i];
    s.def.render.call(s.def, t - s.start, s.kit);
  }

  function fit(stage) {
    const k = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    stage.style.transform = "scale(" + k + ")";
  }

  const Motion = { rendering: q.get("render") === "1", get duration() { return duration; }, seek: (t) => seek(t), ready: null };
  window.Motion = Motion;

  Motion.ready = (async () => {
    const stage = document.getElementById("stage");
    fit(stage);
    window.addEventListener("resize", () => fit(stage));

    const spec = JSON.parse(await fetchText("modules/scenes.json"));
    assetNames = new Set(["gear-belay.webp", "gear-binos.webp", "gear-camera.webp", "gear-duffel.webp", "gear-goggles.webp",
      "gear-jacket.webp", "gear-rope.webp", "gear-shoes.webp", "logo-full.png", "share-logo-cutout.png", "share-photo.webp",
      ...Array.from({ length: 10 }, (_, i) => "pro-" + String(i + 1).padStart(2, "0") + ".webp")]);
    stage.style.background = spec.background;

    const base = document.createElement("style");
    base.textContent = await fetchText("modules/base.css");
    document.head.appendChild(base);

    run(await fetchText("modules/shared.js"), makeKit(stage), "shared.js");
    const codes = await Promise.all(SCENE_FILES.map((id) => fetchText("modules/scene-" + id + ".js")));

    let start = 0;
    for (const s of spec.scenes) {
      const box = document.createElement("div");
      box.className = "scene";
      box.style.cssText = "position:absolute;inset:0;overflow:hidden";
      stage.appendChild(box);
      const kit = makeKit(box);
      kit.dur = s.dur;
      kit.start = start;
      const idx = SCENE_FILES.indexOf(s.id);
      if (idx >= 0) run(codes[idx], kit, "scene-" + s.id + ".js");
      scenes.push({ id: s.id, start, dur: s.dur, box, kit, def: registry[s.id] });
      start += s.dur;
    }
    duration = start;

    await document.fonts.ready;
    for (const s of scenes) if (s.def && s.def.init) await s.def.init.call(s.def, s.kit);
    await Promise.all([...stage.querySelectorAll("img")].map((im) => (im.complete ? null : im.decode().catch(() => null))));

    const t = q.get("t");
    if (Motion.rendering) seek(0);
    else if (t !== null) seek(Number(t));
    else {
      const hold = 1.2, loop = duration + hold, t0 = performance.now();
      const frame = (now) => { seek(Math.min(((now - t0) / 1000) % loop, duration - 0.001)); requestAnimationFrame(frame); };
      requestAnimationFrame(frame);
    }
    document.body.dataset.ready = "true";
  })().catch((e) => { console.error("M25 film failed to load", e); });
})();
