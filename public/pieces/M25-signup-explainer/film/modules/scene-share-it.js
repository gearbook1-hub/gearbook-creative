const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
// One way a catalog gets sent: to a friend who asks (Luke, 2026-10-21: one friend example only;
// the client thread after a trip was cut).
const TAPS = [1.0];
const SEND = [302, 638];
const IN_B = [0.4, 1.05, 1.25, 2.1];
kit.scene('share-it', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"><div class="share-it-map" style="position:absolute;inset:0">' + GB.topo('share') + '</div>' +
      '<div class="words cap"><p class="eyebrow share-it-eye">Share your catalog</p>' +
      '<h2 class="line share-it-lb">When a friend asks</h2></div>' +
      GB.phone(GB.chat('share-it-b', 'Jordan', 'Friend', GB.THREAD_B) +
        '<div class="ring share-it-ring"></div><div class="finger share-it-fin"></div>') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.mapEl = q('.share-it-map');
    this.map = this.mapEl.style; this.map.transformOrigin = '540px 962px';
    this.glowG = q('.topo-glow').style;
    this.phone = q('.phone').style;
    this.eye = q('.share-it-eye').style;
    this.lb = q('.share-it-lb');
    for (const k of ['b', 'ring', 'fin']) this[k] = q('.share-it-' + k).style;
    this.mb = IN_B.map((_, i) => q('.share-it-b-m' + i).style);
  },
  render(t) {
    this.map.transform = 'scale(' + lerp(1.05, 1.07, seg(t, 0, 3.5)) + ')';
    this.phone.transform = 'scale(' + GB.PH.s * kit.breathe(t, 0.004, 3.4) + ')';
    const e = eo(seg(t, 0, 0.35)), x = ei(seg(t, 3.2, 3.45));
    this.eye.opacity = String(e * (1 - x));
    this.eye.transform = 'translateX(' + (lerp(26, 0, e) - 26 * x) + 'px)';
    if (t < 3.2) TextFx.fadeFromRight(this.lb, t, 0.05); else TextFx.fadeOutLeft(this.lb, t, 3.2);
    // The friend's thread pushes in from the dashboard.
    const bin = eo(seg(t, 0, 0.3));
    this.b.transform = 'translateX(' + lerp(200, 0, bin) + 'px)';
    this.b.opacity = String(bin);
    const pop = (st, a) => {
      const p = seg(t, a, a + 0.28);
      st.opacity = String(eo(seg(t, a, a + 0.1)));
      st.transform = 'translateY(' + lerp(12, 0, eo(p)) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.5)) + ')';
    };
    this.mb.forEach((st, i) => pop(st, IN_B[i]));
    const tap = GB.lastTap(t, TAPS);
    const dip = Math.sin(Math.PI * seg(t, tap, tap + 0.18));
    GB.finger(this.fin, t, [[0, 250, 720], [0.7, SEND[0], SEND[1]], [1.2, SEND[0], SEND[1]], [1.65, 240, 720]]);
    this.fin.opacity = String(eo(seg(t, 0.05, 0.25)) * (1 - eo(seg(t, 1.6, 1.9))));
    this.fin.transform = 'scale(' + (1 - 0.18 * dip) + ')';
    this.ring.left = SEND[0] + 'px'; this.ring.top = SEND[1] + 'px';
    GB.ripple(this.ring, t, tap);
    const gp = seg(t, tap, tap + 0.9);
    this.glowG.opacity = String(tap > 0 ? 0.9 * (1 - gp) : 0);
    GB.glow(this.mapEl, 540, 962, lerp(420, 820, eo(gp)));
  },
});
