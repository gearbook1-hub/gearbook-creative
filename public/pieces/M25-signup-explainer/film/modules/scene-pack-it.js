const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
// Gear is tossed into an open pack from alternating sides; the last two stick out of the top until the lid flips shut.
// [asset, width, height, landing x, landing y]: landing centres sit below the front rim (y ~690), rope and jacket peek out.
// A rock guide's pack (2026-10-21): the cam and harness replace the camera and binoculars.
const GEAR = [['gear-cam.webp', 104, 224, 470, 795], ['gear-harness.webp', 186, 216, 615, 790], ['gear-shoes.webp', 220, 155, 520, 775],
  ['gear-belay.webp', 127, 200, 420, 805], ['gear-rope.webp', 64, 250, 410, 700], ['gear-jacket.webp', 165, 240, 652, 690]];
const T0 = 0.3, GAP = 0.2, FALL = 0.45, D = 0.4;
const LID = [1.85, 2.17], BUCKLES = [2.25, 2.35], LOGO = [2.45, 3.0];
const PATCH_Y = 651, LOGO_Y = 625, PATCH_S = 180 / 760;
// Members' faces under the web address, 3-4-3. A slot shows pro-01.webp ... pro-10.webp when that asset exists,
// else a plain avatar. Faces pop in (FACES + i * 0.08) in POP_ORDER, then the line.
const FACE_XY = [[416, 1080], [540, 1080], [664, 1080], [354, 1180], [478, 1180], [602, 1180], [726, 1180], [416, 1280], [540, 1280], [664, 1280]];
const POP_ORDER = [4, 1, 8, 6, 0, 9, 3, 2, 7, 5], FACES = 3.4, JOIN = 4.35;
kit.scene('pack-it', {
  init(kit) {
    const dark = 'color-mix(in srgb, var(--main) 45%, var(--second))', mid = 'color-mix(in srgb, var(--main) 78%, var(--second))', strap = 'color-mix(in srgb, var(--second) 82%, var(--main))';
    const back = '<svg class="topo" viewBox="0 0 1080 1920" style="z-index:1">' +
      '<path d="M330 660 C 262 700 246 860 262 1180 M750 660 C 818 700 834 860 818 1180" style="fill:none;stroke:' + strap + ';stroke-width:40;stroke-linecap:round"/>' +
      '<path d="M492 600 Q540 528 588 600" style="fill:none;stroke:' + strap + ';stroke-width:16;stroke-linecap:round"/>' +
      '<ellipse cx="540" cy="640" rx="258" ry="52" style="fill:' + dark + '"/></svg>';
    const front = '<svg class="topo" viewBox="0 0 1080 1920" style="z-index:3">' +
      '<path d="M268 960 L236 978 Q214 996 216 1040 L224 1252 Q228 1300 270 1300 Z M812 960 L844 978 Q866 996 864 1040 L856 1252 Q852 1300 810 1300 Z" style="fill:' + mid + '"/>' +
      '<path d="M282 640 A258 52 0 0 0 798 640 L812 1220 Q812 1340 692 1340 L388 1340 Q268 1340 268 1220 Z" style="fill:var(--main)"/>' +
      '<path d="M269 1250 L811 1250 L812 1260 Q812 1340 692 1340 L388 1340 Q268 1340 268 1260 Z" style="fill:' + mid + '"/>' +
      '<path d="M304 700 L316 1214 Q318 1302 398 1306 L682 1306 Q762 1302 764 1214 L776 700" style="fill:none;stroke:color-mix(in srgb, var(--ground) 45%, transparent);stroke-width:3;stroke-dasharray:9 9"/>' +
      '<rect x="356" y="930" width="368" height="300" rx="64" style="fill:color-mix(in srgb, var(--main) 88%, var(--second))"/>' +
      '<path d="M392 972 Q540 928 688 972" style="fill:none;stroke:' + strap + ';stroke-width:8;stroke-dasharray:3 4"/>' +
      '<rect x="664" y="960" width="18" height="40" rx="6" style="fill:' + strap + '"/>' +
      '<path d="M268 880 H322 M758 880 H812 M268 1090 H322 M758 1090 H812" style="fill:none;stroke:' + strap + ';stroke-width:14;stroke-linecap:round"/>' +
      '<path d="M282 640 A258 52 0 0 0 798 640" style="fill:none;stroke:' + mid + ';stroke-width:16;stroke-linecap:round"/></svg>';
    const lid = '<div class="pack-it-lid" style="position:absolute;inset:0;z-index:4"><svg class="topo" viewBox="0 0 1080 1920">' +
      '<path class="pack-it-lidskin" d="M262 700 Q262 580 400 572 L680 572 Q818 580 818 700 L818 742 Q540 806 262 742 Z"/>' +
      '<g class="pack-it-straps"><rect x="426" y="730" width="28" height="160" rx="7" style="fill:' + strap + '"/><rect x="626" y="730" width="28" height="160" rx="7" style="fill:' + strap + '"/></g></svg>' +
      '<div class="pack-it-patch" style="position:absolute;left:430px;top:612px;width:220px;height:78px;box-sizing:border-box;border-radius:14px;background:var(--ground);border:3px solid ' + strap + ';display:flex;align-items:center;justify-content:center"><img class="pack-it-patchlogo" alt="" src="' + kit.assets.url('share-logo-cutout.png') + '" style="width:180px;display:block"></div></div>';
    let buckles = '';
    for (const x of [420, 620]) buckles += '<i class="pack-it-buckle" style="position:absolute;left:' + x + 'px;top:872px;width:40px;height:36px;border-radius:9px;background:' + mid + ';border:4px solid ' + strap + ';box-sizing:border-box;z-index:5"></i>';
    let items = '';
    GEAR.forEach(([img, w, h]) => {
      items += '<div class="pack-it-item" style="position:absolute;left:0;top:0;width:' + w + 'px;height:' + h + 'px;display:flex;align-items:center;justify-content:center">' + GB.gear(img) + '</div>';
    });
    const phone = GB.phone(GB.chat('pack-it-thread', 'Jordan', 'Friend', GB.THREAD_B));
    let faces = '';
    FACE_XY.forEach(([x, y], i) => {
      const name = 'pro-' + String(i + 1).padStart(2, '0') + '.webp';
      const inner = kit.assets.has(name) ? '<img alt="" src="' + kit.assets.url(name) + '" style="width:100%;height:100%;object-fit:cover;display:block">'
        : '<svg width="112" height="112" viewBox="0 0 112 112"><circle cx="56" cy="44" r="20" style="fill:' + mid + '"/><path d="M18 112 Q18 72 56 72 Q94 72 94 112 Z" style="fill:' + mid + '"/></svg>';
      faces += '<div class="pack-it-face" style="position:absolute;left:' + (x - 56) + 'px;top:' + (y - 56) + 'px;width:112px;height:112px;border-radius:50%;overflow:hidden;box-sizing:border-box;border:5px solid var(--ground);background:color-mix(in srgb, var(--main) 30%, var(--ground));box-shadow:0 10px 24px rgba(0,0,0,.16)">' + inner + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="pack-it-map" style="position:absolute;inset:0">' + GB.topo('pack') + '</div>' +
      '<div class="clearing pack-it-clear" style="left:-20px;top:430px;width:1120px;height:700px"></div>' +
      '<div class="pack-it-bag" style="position:absolute;inset:0">' + back + items + front + lid + buckles + '</div>' + phone +
      '<div class="pack-it-logo" style="position:absolute;left:160px;top:528px;width:760px"><img class="logo-img" alt="GearBook" src="' + kit.assets.url('share-logo-cutout.png') + '"></div>' +
      '<div class="words" style="left:96px;right:96px;top:770px;gap:22px;align-items:center;text-align:center"><h2 class="line pack-it-endline" style="font-size:76px;white-space:nowrap">Get your free catalog</h2>' +
      '<p class="sub pack-it-url" style="font-size:50px;font-weight:600;color:var(--second);position:relative">www.gearbook.shop<i class="pack-it-ul" style="position:absolute;left:0;right:0;bottom:-14px;height:10px;border-radius:5px;background:var(--accent);transform-origin:0 50%"></i></p></div>' +
      faces + '<p class="sub pack-it-join" style="position:absolute;left:0;right:0;top:1352px;margin:0;text-align:center;font-size:44px;font-weight:600;color:var(--second)">Become a member today</p>' +
      '<div class="words cap"><p class="eyebrow pack-it-eye">Shoppers buy through your links</p><h2 class="line pack-it-capline">You earn commission</h2></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.mapEl = q('.pack-it-map');
    this.map = this.mapEl.style; this.map.transformOrigin = '540px 962px';
    this.glowG = q('.topo-glow').style;
    this.items = [...kit.stage.querySelectorAll('.pack-it-item')].map((e) => e.style);
    this.buckles = [...kit.stage.querySelectorAll('.pack-it-buckle')].map((e) => e.style);
    this.faces = [...kit.stage.querySelectorAll('.pack-it-face')].map((e) => e.style);
    for (const k of ['bag', 'lid', 'lidskin', 'straps', 'patch', 'patchlogo', 'join', 'logo', 'url', 'ul', 'clear']) this[k] = q('.pack-it-' + k).style;
    this.phone = q('.phone').style;
    this.line = q('.pack-it-endline');
    this.capline = q('.pack-it-capline');
    this.eye = q('.pack-it-eye').style;
    this.bag.transformOrigin = '540px 962px';
    this.lid.transformOrigin = '540px 588px';
    this.logo.transformOrigin = '50% 50%';
  },
  render(t) {
    this.map.transform = 'scale(' + lerp(1.07, 1.1, seg(t, 0, 6.5)) + ')';
    this.map.opacity = String(lerp(1, 0.6, eio(seg(t, 1.9 + D, 2.6 + D))));
    const ph = seg(t, 0, 0.3);
    this.phone.transform = 'scale(' + lerp(GB.PH.s, 0.2, ei(ph)) + ')';
    this.phone.opacity = String(1 - eo(seg(t, 0.1, 0.3)));
    // Tossed in an arc from alternating sides, in front of the pack until it drops through the opening.
    let sq = 0;
    this.items.forEach((s, i) => {
      const [, w, h, x1, y1] = GEAR[i], a = T0 + i * GAP, p = seg(t, a, a + FALL), side = i % 2 ? 1 : -1;
      const x = lerp(540 + side * 720, x1, p), y = lerp(1000, y1, p) - 370 * 4 * p * (1 - p);
      s.opacity = String(eo(seg(t, a, a + 0.06)));
      s.zIndex = p < 0.8 ? '6' : '2';
      s.transform = 'translate(' + (x - w / 2) + 'px,' + (y - h / 2) + 'px) rotate(' + lerp(-side * 40, 0, eo(p)) + 'deg) scale(' + lerp(0.8, 1, eo(p)) + ')';
      sq += 0.035 * Math.sin(Math.PI * seg(t, a + FALL, a + FALL + 0.2));
    });
    // The lid swings over from behind (negative scale = flipped up), then the two buckles snap.
    const s = lerp(-0.05, 1, eob(seg(t, LID[0], LID[1]), 1.3));
    this.lid.zIndex = s < 0 ? '1' : '4';
    this.lid.opacity = s < 0 ? '0' : '1';
    this.lid.transform = 'scaleY(' + s + ')';
    this.lidskin.fill = s < 0 ? 'color-mix(in srgb, var(--main) 50%, var(--second))' : 'color-mix(in srgb, var(--main) 84%, var(--second))';
    const show = kit.clamp01((s - 0.4) / 0.4);
    this.straps.opacity = String(show);
    this.patch.opacity = String(show * (1 - eo(seg(t, LOGO[0], LOGO[0] + 0.15))));
    this.patchlogo.opacity = t >= LOGO[0] ? '0' : '1';
    this.buckles.forEach((b, i) => {
      b.opacity = t >= BUCKLES[i] ? '1' : '0';
      b.transform = 'scale(' + (1 + 0.3 * Math.sin(Math.PI * seg(t, BUCKLES[i], BUCKLES[i] + 0.15))) + ')';
    });
    const bIn = seg(t, 0.2, 0.6), go = eio(seg(t, 1.95 + D, 2.5 + D));
    const ty = lerp(140, 0, eo(bIn)) + lerp(0, 322, go), sc = lerp(0.94, 1, eob(bIn, 1.4)) * lerp(1, 0.38, go);
    this.bag.opacity = String(eo(bIn) * (1 - eo(seg(t, 2.6 + D, 2.9 + D))));
    this.bag.transform = 'translateY(' + ty + 'px) scale(' + sc * (1 + sq) + ',' + sc * (1 - sq) + ')';
    const gp = seg(t, 1.8 + D, 2.7 + D);
    this.glowG.opacity = String(gp > 0 ? 0.9 * (1 - gp) : 0);
    GB.glow(this.mapEl, 540, 962, lerp(380, 900, eo(gp)));
    // The lid's patch grows into the end-card logo, starting wherever the moving pack has taken it.
    const lg = seg(t, LOGO[0], LOGO[1]), le = eob(lg, 1.4);
    const py = 962 + (PATCH_Y - 962) * sc + ty;
    this.logo.opacity = t >= LOGO[0] ? '1' : '0';
    this.logo.transform = 'translateY(' + (lerp(py, LOGO_Y, eo(lg)) - LOGO_Y) + 'px) scale(' + lerp(PATCH_S * sc, 1, le) * kit.breathe(t, 0.004, 3) + ')';
    this.clear.opacity = String(eo(seg(t, 2.0 + D, 2.6 + D)));
    const ce = eo(seg(t, 0.05, 0.4)), cx = ei(seg(t, 2.05, 2.3));
    this.eye.opacity = String(ce * (1 - cx));
    this.eye.transform = 'translateX(' + (lerp(26, 0, ce) - 26 * cx) + 'px)';
    if (t < 2.05) TextFx.fadeFromRight(this.capline, t, 0.15);
    else TextFx.fadeOutLeft(this.capline, t, 2.05);
    TextFx.fadeFromRight(this.line, t, 2.45 + D);
    const u = eo(seg(t, 2.85 + D, 3.25 + D));
    this.url.opacity = String(u);
    this.url.transform = 'translateX(' + lerp(26, 0, u) + 'px)';
    this.ul.transform = 'scaleX(' + eo(seg(t, 3.2 + D, 3.6 + D)) + ')';
    POP_ORDER.forEach((slot, k) => {
      const a = FACES + k * 0.08, p = seg(t, a, a + 0.35);
      this.faces[slot].opacity = String(eo(seg(t, a, a + 0.08)));
      this.faces[slot].transform = 'scale(' + lerp(0.2, 1, eob(p, 1.8)) * kit.breathe(t + slot, 0.01, 3) + ')';
    });
    const j = eo(seg(t, JOIN, JOIN + 0.4));
    this.join.opacity = String(j);
    this.join.transform = 'translateX(' + lerp(26, 0, j) + 'px)';
  },
});
