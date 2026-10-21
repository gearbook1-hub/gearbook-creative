const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
// The two ways a catalog gets sent: to a client after a trip, and to a friend who asks.
const TAPS = [0.55, 3.75];
const SEND = [302, 638];
const IN_A = [0.62, 0.85, 1.7], IN_B = [3.15, 3.8, 4.0, 4.85];
kit.scene('share-it', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"><div class="share-it-map" style="position:absolute;inset:0">' + GB.topo('share') + '</div>' +
      '<div class="words cap"><p class="eyebrow share-it-eye">Share your catalog</p>' +
      '<h2 class="line share-it-la">After a trip</h2><h2 class="line share-it-lb" style="position:absolute;left:0;right:0;bottom:0">When a friend asks</h2></div>' +
      GB.phone(GB.chat('share-it-a', 'Sam', 'Client', GB.THREAD_A) + GB.chat('share-it-b', 'Jordan', 'Friend', GB.THREAD_B) +
        '<div class="ring share-it-ring"></div><div class="finger share-it-fin"></div>') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.mapEl = q('.share-it-map');
    this.map = this.mapEl.style; this.map.transformOrigin = '540px 962px';
    this.glowG = q('.topo-glow').style;
    this.phone = q('.phone').style;
    this.eye = q('.share-it-eye').style;
    this.la = q('.share-it-la'); this.lb = q('.share-it-lb');
    for (const k of ['a', 'b', 'ring', 'fin']) this[k] = q('.share-it-' + k).style;
    this.ma = IN_A.map((_, i) => q('.share-it-a-m' + i).style);
    this.mb = IN_B.map((_, i) => q('.share-it-b-m' + i).style);
  },
  render(t) {
    this.map.transform = 'scale(' + lerp(1.05, 1.07, seg(t, 0, 5.8)) + ')';
    this.phone.transform = 'scale(' + GB.PH.s * kit.breathe(t, 0.004, 3.4) + ')';
    const e = eo(seg(t, 0, 0.35)), x = ei(seg(t, 5.5, 5.75));
    this.eye.opacity = String(e * (1 - x));
    this.eye.transform = 'translateX(' + (lerp(26, 0, e) - 26 * x) + 'px)';
    if (t < 2.45) TextFx.fadeFromRight(this.la, t, 0.05); else TextFx.fadeOutLeft(this.la, t, 2.45);
    if (t < 5.5) TextFx.fadeFromRight(this.lb, t, 3.0); else TextFx.fadeOutLeft(this.lb, t, 5.5);
    // Thread A pushes in from the dashboard, then hands over to thread B.
    const ain = eo(seg(t, 0, 0.3)), aout = ei(seg(t, 2.6, 2.9)), bin = eo(seg(t, 2.75, 3.05));
    this.a.transform = 'translateX(' + (lerp(200, 0, ain) - 200 * aout) + 'px)';
    this.a.opacity = String(ain * (1 - aout));
    this.b.transform = 'translateX(' + lerp(200, 0, bin) + 'px)';
    this.b.opacity = String(bin);
    const pop = (st, a) => {
      const p = seg(t, a, a + 0.28);
      st.opacity = String(eo(seg(t, a, a + 0.1)));
      st.transform = 'translateY(' + lerp(12, 0, eo(p)) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.5)) + ')';
    };
    this.ma.forEach((st, i) => pop(st, IN_A[i]));
    this.mb.forEach((st, i) => pop(st, IN_B[i]));
    const tap = GB.lastTap(t, TAPS);
    const dip = Math.sin(Math.PI * seg(t, tap, tap + 0.18));
    GB.finger(this.fin, t, [[0, 250, 720], [0.4, SEND[0], SEND[1]], [0.75, SEND[0], SEND[1]], [1.2, 240, 720], [3.3, 240, 720], [3.6, SEND[0], SEND[1]], [3.95, SEND[0], SEND[1]], [4.4, 240, 720]]);
    this.fin.opacity = String(eo(seg(t, 0.05, 0.25)) * (1 - eo(seg(t, 4.3, 4.6))));
    this.fin.transform = 'scale(' + (1 - 0.18 * dip) + ')';
    this.ring.left = SEND[0] + 'px'; this.ring.top = SEND[1] + 'px';
    GB.ripple(this.ring, t, tap);
    const gp = seg(t, tap, tap + 0.9);
    this.glowG.opacity = String(tap > 0 ? 0.9 * (1 - gp) : 0);
    GB.glow(this.mapEl, 540, 962, lerp(420, 820, eo(gp)));
  },
});
