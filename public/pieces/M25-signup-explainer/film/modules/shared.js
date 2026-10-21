// The GearBook site's topographic backdrop (components/join/topo.ts with TOPO_DEFAULTS),
// computed once in phone CSS px (390 wide) and drawn on the 1080 stage. The summit is the phone.
window.GB = (function () {
  const K = 1080 / 390, CW = 390, CH = 1920 / K;
  const PH = { cx: 540, cy: 962, w: 546, h: 1056, s: 1.6 };
  function noise3(seed) {
    const G = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    const p = new Uint8Array(256); for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed >>> 0 || 1;
    for (let i = 255; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); const x = p[i]; p[i] = p[j]; p[j] = x; }
    const perm = new Uint8Array(512), m12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; m12[i] = perm[i] % 12; }
    const c = (gi, x, y, z) => { let t = 0.6 - x * x - y * y - z * z; if (t < 0) return 0; t *= t; const g = G[gi]; return t * t * (g[0] * x + g[1] * y + g[2] * z); };
    const G3 = 1 / 6;
    return (xin, yin, zin) => {
      const sk = (xin + yin + zin) / 3, i = Math.floor(xin + sk), j = Math.floor(yin + sk), k = Math.floor(zin + sk), t = (i + j + k) * G3;
      const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
      let a;
      if (x0 >= y0) a = y0 >= z0 ? [1,0,0,1,1,0] : x0 >= z0 ? [1,0,0,1,0,1] : [0,0,1,1,0,1];
      else a = y0 < z0 ? [0,0,1,0,1,1] : x0 < z0 ? [0,1,0,0,1,1] : [0,1,0,1,1,0];
      const i1 = a[0], j1 = a[1], k1 = a[2], i2 = a[3], j2 = a[4], k2 = a[5];
      const ii = i & 255, jj = j & 255, kk = k & 255;
      return 32 * (c(m12[ii + perm[jj + perm[kk]]], x0, y0, z0) +
        c(m12[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3) +
        c(m12[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3) +
        c(m12[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x0 - 0.5, y0 - 0.5, z0 - 0.5));
    };
  }
  function build() {
    const n = noise3(52987013), sc = 0.0019, cell = 9;
    const sw = PH.w / K, sh = PH.h / K, scx = PH.cx / K, scy = PH.cy / K;
    const elev = (x, y) => {
      const e = 1.5 * n(x * sc, y * sc, 0) + 0.06 * n(x * sc * 3 + 13.7, y * sc * 3 - 7.3, 0) + 0.28 * n(x * sc * 4.7 - 5.1, y * sc * 4.7 + 9.2, 0);
      const dx = (x - scx) / (sw * 0.92 + 140), dy = (y - scy) / (sh * 0.92 + 140);
      return e + 3.1 * Math.exp(-(dx * dx + dy * dy));
    };
    const cols = Math.ceil(CW / cell) + 2, rows = Math.ceil(CH / cell) + 2, w = cols + 1, ox = -cell, oy = -cell;
    const g = new Float32Array(w * (rows + 1));
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) g[j * w + i] = elev(ox + i * cell, oy + j * cell);
    const CASES = { 1: [[3,2]], 2: [[2,1]], 3: [[3,1]], 4: [[0,1]], 5: [[3,0],[2,1]], 6: [[0,2]], 7: [[3,0]], 8: [[3,0]], 9: [[0,2]], 10: [[0,1],[3,2]], 11: [[0,1]], 12: [[3,1]], 13: [[2,1]], 14: [[3,2]] };
    const key = (x, y) => Math.round(x * 100) * 1e7 + Math.round(y * 100);
    const lines = [];
    let li = 0;
    for (let lv = -0.35; lv <= 4.5; lv += 0.12, li++) {
      const segs = [];
      const f = (a, b) => (a === b ? 0.5 : (lv - a) / (b - a));
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const tl = g[j * w + i], tr = g[j * w + i + 1], br = g[(j + 1) * w + i + 1], bl = g[(j + 1) * w + i];
        const cs = CASES[(tl >= lv ? 8 : 0) | (tr >= lv ? 4 : 0) | (br >= lv ? 2 : 0) | (bl >= lv ? 1 : 0)];
        if (!cs) continue;
        const x0 = ox + i * cell, y0 = oy + j * cell;
        const pt = (e) => e === 0 ? [x0 + cell * f(tl, tr), y0] : e === 1 ? [x0 + cell, y0 + cell * f(tr, br)] : e === 2 ? [x0 + cell * f(bl, br), y0 + cell] : [x0, y0 + cell * f(tl, bl)];
        for (const [ea, eb] of cs) { const a = pt(ea), b = pt(eb); segs.push(a[0], a[1], b[0], b[1]); }
      }
      const N = segs.length / 4, ends = new Map(), used = new Uint8Array(N);
      const add = (k, s) => { const l = ends.get(k); if (l) l.push(s); else ends.set(k, [s]); };
      for (let s = 0; s < N; s++) { add(key(segs[s * 4], segs[s * 4 + 1]), s); add(key(segs[s * 4 + 2], segs[s * 4 + 3]), s); }
      const next = (x, y) => { const k = key(x, y); for (const s of ends.get(k) || []) { if (used[s]) continue; used[s] = 1; const o = s * 4; return key(segs[o], segs[o + 1]) === k ? [segs[o + 2], segs[o + 3]] : [segs[o], segs[o + 1]]; } return null; };
      for (let s = 0; s < N; s++) {
        if (used[s]) continue;
        used[s] = 1;
        const o = s * 4, fwd = [segs[o + 2], segs[o + 3]], back = [];
        for (let q = next(fwd[0], fwd[1]); q; q = next(q[0], q[1])) fwd.push(q[0], q[1]);
        for (let q = next(segs[o], segs[o + 1]); q; q = next(q[0], q[1])) back.unshift(q[0], q[1]);
        let pts = back.concat([segs[o], segs[o + 1]], fwd);
        const closed = pts.length > 6 && key(pts[0], pts[1]) === key(pts[pts.length - 2], pts[pts.length - 1]);
        if (closed) pts.length -= 2;
        if (pts.length < 8) continue;
        for (let pass = 0; pass < 2; pass++) {
          const m = pts.length / 2, out = [];
          if (!closed) out.push(pts[0], pts[1]);
          for (let i = 0; i < (closed ? m : m - 1); i++) { const q = (i + 1) % m, ax = pts[i * 2], ay = pts[i * 2 + 1], bx = pts[q * 2], by = pts[q * 2 + 1]; out.push(ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25, ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75); }
          if (!closed) out.push(pts[pts.length - 2], pts[pts.length - 1]);
          pts = out;
        }
        let d = '';
        for (let i = 0; i < pts.length; i += 2) d += (i ? 'L' : 'M') + (pts[i] * K).toFixed(1) + ' ' + (pts[i + 1] * K).toFixed(1);
        lines.push({ d: d + (closed ? 'Z' : ''), idx: li % 5 === 0, li });
      }
    }
    return lines;
  }
  let LINES = null;
  return {
    PH,
    topo(id) {
      LINES = LINES || build();
      let top = 1;
      for (const l of LINES) top = Math.max(top, l.li);
      const ps = (cls) => LINES.map((l) => '<path class="' + cls + (l.idx ? ' topo-idx' : '') + '" data-lv="' + (l.li / top).toFixed(3) + '" pathLength="1" d="' + l.d + '"/>').join('');
      return '<svg class="topo" viewBox="0 0 1080 1920"><defs><radialGradient id="' + id + '-g"><stop offset="0" stop-color="#fff"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
        '<mask id="' + id + '-m" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><circle class="topo-glowc" cx="540" cy="962" r="0" fill="url(#' + id + '-g)"/></mask></defs>' +
        '<g class="topo-base">' + ps('topo-line') + '</g><g class="topo-glow" mask="url(#' + id + '-m)">' + ps('topo-line topo-hot') + '</g></svg>';
    },
    // Lines draw on from the summit outward, the highest level first.
    drawLines(root, t, t0, span) {
      root.querySelectorAll('.topo-line').forEach((p) => {
        const a = t0 + (1 - Number(p.dataset.lv)) * span;
        p.style.strokeDasharray = '1 1';
        p.style.strokeDashoffset = String(1 - kit.eo(kit.seg(t, a, a + 0.9)));
      });
    },
    glow(root, x, y, r) {
      const c = root.querySelector('.topo-glowc');
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', Math.max(0, r).toFixed(1));
    },
    gear(name) {
      return '<img class="gear-img" alt="" src="' + kit.assets.url(name) + '">';
    },
    phone(inner) {
      return '<div class="phone"><div class="screen"><div class="notch"></div><div class="appbar"><span class="appbar-time">9:41</span>' +
        '<img class="appbar-logo" alt="GearBook" src="' + kit.assets.url('logo-black.svg') + '"><i class="appbar-menu"></i></div>' + inner + '</div></div>';
    },
    ripple(st, t, t0) {
      const p = kit.seg(t, t0, t0 + 0.5);
      st.opacity = p > 0 && p < 1 ? String(1 - p) : '0';
      st.transform = 'scale(' + kit.lerp(0.35, 1.5, kit.eo(p)) + ')';
    },
    finger(st, t, keys) {
      let a = keys[0], b = keys[0];
      for (let i = 0; i < keys.length; i++) if (keys[i][0] <= t) { a = keys[i]; b = keys[i + 1] || keys[i]; }
      const p = b === a ? 1 : kit.eio(kit.seg(t, a[0], b[0]));
      st.left = kit.lerp(a[1], b[1], p) + 'px';
      st.top = kit.lerp(a[2], b[2], p) + 'px';
    },
    lastTap(t, taps) { let x = -9; for (const v of taps) if (t >= v) x = v; return x; },
    // The link preview a catalog URL unfurls into: the member share card (photo fallback, logo, name, #1 pick),
    // then the page's social title and host.
    link(cls, top) {
      return '<div class="gb-link me ' + cls + '" style="top:' + top + 'px"><div class="gb-link-img">' +
        '<img alt="" src="' + kit.assets.url('share-photo.webp') + '" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover">' +
        '<i class="gb-link-shade"></i><i class="gb-link-bar"><b style="flex:1;background:#34668a"></b><b style="width:52px;background:var(--main)"></b><b style="width:28px;background:var(--accent)"></b></i>' +
        '<img alt="GearBook" src="' + kit.assets.url('logo-white.svg') + '" style="position:absolute;left:86px;top:10px;width:64px">' +
        '<div class="gb-link-who"><b>Your Name</b><span>My #1 pick</span><em>Sony Alpha a7R VI</em></div></div>' +
        '<div class="gb-link-meta"><p>Your Name&#39;s Gear Picks: Real Recommendations | GearBook</p><span>gearbook.shop</span></div></div>';
    },
    // A message thread. items: [who, text | null for the link, top]; each item gets the class <cls>-m<i>.
    chat(cls, name, role, items) {
      let h = '<div class="view gb-chat ' + cls + '"><div class="gb-chat-head"><i class="gb-ava">' + name[0] + '</i><div><p class="gb-chat-name">' + name + '</p><p class="gb-label" style="margin:2px 0 0;font-size:11px">' + role + '</p></div></div><i class="gb-chat-rule"></i>';
      items.forEach(([who, text, top], i) => {
        h += text === null ? GB.link(cls + '-m' + i, top) : '<p class="gb-msg ' + who + ' ' + cls + '-m' + i + '" style="top:' + top + 'px">' + text + '</p>';
      });
      return h + '<div class="gb-compose"><span class="gb-compose-in">Message</span><i class="gb-send"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" style="fill:none;stroke:var(--ground);stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/></svg></i></div></div>';
    },
    // The two threads of the share-it scene; pack-it opens on the second, finished.
    THREAD_A: [['me', 'Great day out there. Here&#39;s all the gear I used:', 84], ['me', null, 155], ['them', 'Ordering the jacket tonight!', 341]],
    THREAD_B: [['them', 'What rain jacket should I get?', 84], ['me', 'Everything I&#39;d buy is in here:', 155], ['me', null, 226], ['them', 'Perfect, thanks!', 412]],
  };
})();
