// GearBook motion runtime. Every library piece is a plain HTML page whose animations are
// written with CSS or the Web Animations API, the same way Claude builds a motion artifact
// (see M25, the signup explainer). This file gives every piece one clock so it can:
//   - loop in the dashboard and gallery (default)
//   - freeze on a frame:          ?t=4.2
//   - be recorded frame by frame: ?render=1, then window.Motion.seek(seconds) per frame
// and take its words and numbers from the URL:  ?look=ledger&props={"values":[3,9,20]}
//
// A piece calls Motion.init({ duration, hold, looks, defaults, build(stage, props, look) }).
// Pieces laid over footage add overlay: true: they record with a transparent background, and
// checkAt: [seconds] when the render check shouldn't sample 25/60/100% (a banner that has left),
// and checkRail: false only for something pinned to the top, clear of Instagram's button rail.
// build() creates the DOM and returns nothing; animations made with el.animate() or CSS are
// all driven by the clock, and Motion.tick(fn) runs fn(t) every frame for things CSS can't
// animate (counting numbers).
(function () {
  const q = new URLSearchParams(location.search);
  const ticks = [];
  let duration = 5;
  let hold = 1;

  function readProps(defaults) {
    let given = {};
    try { given = q.get("props") ? JSON.parse(q.get("props")) : {}; } catch (e) { console.warn("bad props", e); }
    return Object.assign({}, defaults, given);
  }

  // Scale the 1080x1920 stage to the window and centre it, so a piece opened on its own (or full
  // screen) sits in the middle. At 1080x1920 (renders, stills) this is scale 1 at 0,0.
  function fit(stage) {
    const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    const x = (window.innerWidth - 1080 * s) / 2, y = (window.innerHeight - 1920 * s) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  }

  // The live loop's start time, and who wants to know when it wraps (sound.js restarts its track).
  let loopStart = 0;
  let onLoop = null;

  const Motion = {
    look: q.get("look"),
    rendering: q.get("render") === "1",
    overlay: false,
    checkAt: null,
    checkRail: true,
    ready: null,
    get duration() { return duration; },
    get hold() { return hold; },
    onLoop(fn) { onLoop = fn; },
    restart() { loopStart = performance.now(); },
    tick(fn) { ticks.push(fn); },
    seek(t) {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = t * 1000;
      }
      for (const fn of ticks) fn(t);
    },
    // Helpers for pieces.
    ease: { arrive: "cubic-bezier(.2,.7,.1,1)", travel: "cubic-bezier(.45,0,.2,1)" },
    clamp: (x) => Math.max(0, Math.min(1, x)),
    progress(t, start, len) { return Motion.clamp((t - start) / len); },
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    el(tag, attrs = {}, parent) {
      const svg = ["svg", "path", "line", "circle", "polyline", "rect", "g", "text"].includes(tag);
      const node = svg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "text") node.textContent = v;
        else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
        else node.setAttribute(k, v);
      }
      if (parent) parent.appendChild(node);
      return node;
    },
    // Fade and rise in at `at` seconds: the house "arrive".
    arrive(node, at, { y = 24, dur = 0.6 } = {}) {
      node.animate(
        [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: "none" }],
        { duration: dur * 1000, delay: at * 1000, easing: Motion.ease.arrive, fill: "both" },
      );
    },
    // Reveal a title word by word, like the signup explainer's headings.
    words(node, text, at, gap = 0.12) {
      node.textContent = "";
      text.split(" ").forEach((w, i) => {
        const span = Motion.el("span", { text: w + " ", style: { display: "inline-block", whiteSpace: "pre" } }, node);
        Motion.arrive(span, at + i * gap, { y: 14, dur: 0.5 });
      });
    },
    init(spec) {
      duration = spec.duration;
      hold = spec.hold ?? 1;
      const look = spec.looks.includes(Motion.look) ? Motion.look : spec.looks[0];
      Motion.look = look;
      document.body.dataset.look = look;
      Motion.overlay = !!spec.overlay;
      Motion.checkAt = spec.checkAt ?? null;
      Motion.checkRail = spec.checkRail ?? true;
      if (Motion.overlay) document.body.dataset.overlay = Motion.rendering ? "render" : "preview";
      const stage = document.getElementById("stage");
      fit(stage);
      window.addEventListener("resize", () => fit(stage));
      spec.build(stage, readProps(spec.defaults), look);

      Motion.ready = document.fonts.ready.then(() => {
        const t = q.get("t");
        if (Motion.rendering) Motion.seek(0);
        else if (t !== null) Motion.seek(Number(t));
        else {
          const loop = duration + hold;
          loopStart = performance.now();
          let count = 0;
          const frame = (now) => {
            const elapsed = (now - loopStart) / 1000;
            const n = Math.floor(elapsed / loop);
            if (n > count && onLoop) onLoop();
            count = n;
            Motion.seek(Math.min(elapsed % loop, duration));
            requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }
        document.body.dataset.ready = "true";
      });
    },
  };
  window.Motion = Motion;
})();
