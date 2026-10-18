const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
const QUERY = 'sony a7r';
const NOTE = 'My go to body for every backcountry shoot.';
const TAPS = [0.45, 1.8, 4.0];
const SEARCH_Y = 206, ROW_Y = 275, BTN_Y = 531;
kit.scene('add-product', {
  init(kit) {
    const row = (img, name, cls) => '<div class="gb-card gb-row ' + cls + '"><div class="gb-thumb">' + GB.gear(img) + '</div>' +
      '<div><p class="gb-label" style="margin:0 0 3px;font-size:11px">Adorama</p><p class="gb-name" style="margin:0">' + name + '</p></div></div>';
    const slot = (img, name, x) => '<div class="gb-card" style="position:absolute;left:' + x + 'px;top:0;width:93px;height:118px;border-radius:16px;padding:8px;display:flex;flex-direction:column;gap:6px">' +
      '<div style="height:62px;display:flex;align-items:center;justify-content:center">' + (img ? GB.gear(img) : '') + '</div><p style="margin:0;font-size:12px;font-weight:600;line-height:1.15">' + name + '</p></div>';
    const v = '<div class="view add-product-view">' +
      '<p class="gb-label" style="top:22px">Dashboard</p>' +
      '<h3 class="gb-h" style="top:44px">Add a Product</h3>' +
      '<div class="gb-input add-product-search" style="top:94px"><span class="add-product-q"></span><i class="caret add-product-c1"></i><span class="add-product-ph" style="color:#6B6450;font-size:15px">Search our retailers</span></div>' +
      '<div class="add-product-res" style="top:154px;display:flex;flex-direction:column;gap:8px">' + row('gear-camera.webp', 'Sony Alpha a7R VI', 'add-product-r1') + row('gear-camera.webp', 'Sony Alpha a7R V', '') + '</div>' +
      '<div class="add-product-form" style="top:0;left:0;right:0;height:592px">' +
      '<p class="gb-p" style="position:absolute;left:20px;right:20px;top:154px;margin:0;font-size:14px;text-wrap:balance">Filled in from Adorama&#39;s catalog. Edit anything below.</p>' +
      '<div class="add-product-pick" style="position:absolute;left:20px;right:20px;top:204px">' + row('gear-camera.webp', 'Sony Alpha a7R VI', '') + '</div>' +
      '<p class="gb-label" style="position:absolute;left:20px;right:20px;top:286px;margin:0">Why you recommend it</p>' +
      '<div class="gb-input add-product-ta" style="position:absolute;left:20px;right:20px;top:308px;height:92px;align-items:flex-start;padding-top:12px;white-space:normal;line-height:1.4"><span><span class="add-product-t"></span><i class="caret add-product-c2"></i></span></div>' +
      '<div class="gb-btn add-product-btn" style="position:absolute;left:20px;right:20px;top:418px">Add to My Catalog</div></div>' +
      '<div class="add-product-cat" style="top:150px;height:240px">' +
      '<p class="gb-label" style="position:absolute;left:0;top:0;margin:0">My catalog</p>' +
      '<div style="position:absolute;left:0;right:0;top:28px;height:118px">' +
      '<div style="position:absolute;left:0;top:0;width:93px;height:118px;border:2px dashed color-mix(in srgb, var(--second) 22%, var(--ground));border-radius:16px;box-sizing:border-box"></div>' +
      slot('gear-shoes.webp', 'Climbing shoes', 103) + slot('gear-rope.webp', 'Climbing rope', 206) + '</div>' +
      '<p class="gb-p add-product-live" style="position:absolute;left:0;right:0;top:162px;margin:0;font-size:14px">It usually appears right away.</p></div>' +
      '<div class="add-product-new" style="top:178px;left:20px;right:auto;width:93px;height:118px">' + slot('gear-camera.webp', 'Sony a7R VI', 0) + '</div></div>';
    kit.stage.append(kit.h('<div class="ground"><div class="add-product-map" style="position:absolute;inset:0">' + GB.topo('addp') + '</div>' +
      '<div class="words cap"><p class="eyebrow add-product-eye">Once you&#39;re approved</p><h2 class="line">Add gear with one search</h2></div>' +
      GB.phone(v + '<div class="ring add-product-ring"></div><div class="finger add-product-fin"></div>') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.mapEl = q('.add-product-map');
    this.map = this.mapEl.style; this.map.transformOrigin = '540px 962px';
    this.glowG = q('.topo-glow').style;
    this.phone = q('.phone').style;
    this.line = q('.line'); this.eye = q('.add-product-eye').style;
    for (const k of ['q', 't']) this[k] = q('.add-product-' + k);
    for (const k of ['view', 'c1', 'c2', 'ph', 'res', 'r1', 'form', 'pick', 'btn', 'cat', 'new', 'ring', 'fin', 'search', 'ta', 'live']) this[k] = q('.add-product-' + k).style;
  },
  render(t) {
    this.map.transform = 'scale(' + lerp(1.025, 1.05, seg(t, 0, 6)) + ')';
    this.phone.transform = 'scale(' + GB.PH.s * kit.breathe(t, 0.004, 3.4) + ')';
    const vin = eo(seg(t, 0, 0.3)), vout = ei(seg(t, 5.7, 6.0));
    this.view.transform = 'translateX(' + (lerp(200, 0, vin) - 200 * vout) + 'px)';
    this.view.opacity = String(vin * (1 - vout));
    const e = eo(seg(t, 0, 0.35)), x = ei(seg(t, 5.7, 5.95));
    this.eye.opacity = String(e * (1 - x));
    this.eye.transform = 'translateX(' + (lerp(26, 0, e) - 26 * x) + 'px)';
    if (t < 5.7) TextFx.fadeFromRight(this.line, t, 0.05);
    else TextFx.fadeOutLeft(this.line, t, 5.7);
    const blink = Math.floor(t / 0.53) % 2 ? '0' : '1';
    this.q.textContent = QUERY.slice(0, Math.round(QUERY.length * seg(t, 0.6, 1.0)));
    this.ph.display = t < 0.55 ? 'inline' : 'none';
    this.c1.opacity = t > 0.5 && t < 1.8 ? (t < 1.05 ? '1' : blink) : '0';
    this.search.borderColor = t > 0.45 && t < 1.9 ? 'var(--second)' : '';
    const rIn = eo(seg(t, 1.1, 1.35)), rOut = eo(seg(t, 1.95, 2.15));
    this.res.opacity = String(rIn * (1 - rOut));
    this.res.transform = 'translateY(' + lerp(-8, 0, rIn) + 'px)';
    this.r1.background = t > 1.65 ? 'color-mix(in srgb, var(--main) 12%, #fff)' : '';
    const fIn = eo(seg(t, 2.05, 2.4)), fOut = eo(seg(t, 4.2, 4.45));
    this.form.opacity = String(fIn * (1 - fOut));
    this.pick.transform = 'translateY(' + lerp(10, 0, fIn) + 'px)';
    this.t.textContent = NOTE.slice(0, Math.round(NOTE.length * seg(t, 2.5, 3.65)));
    this.c2.opacity = t > 2.45 && t < 4.0 ? (t < 3.65 ? '1' : blink) : '0';
    this.ta.borderColor = t > 2.45 && t < 4.0 ? 'var(--second)' : '';
    const tap = GB.lastTap(t, TAPS);
    const dip = Math.sin(Math.PI * seg(t, tap, tap + 0.18));
    this.btn.transform = tap === 4.0 ? 'scale(' + (1 - 0.04 * dip) + ')' : 'none';
    GB.finger(this.fin, t, [[0, 290, 640], [0.35, 170, SEARCH_Y], [0.6, 170, SEARCH_Y], [1.5, 170, ROW_Y], [1.85, 170, ROW_Y], [3.65, 170, BTN_Y], [4.1, 170, BTN_Y], [4.6, 290, 640]]);
    this.fin.opacity = String(eo(seg(t, 0.05, 0.25)) * (1 - eo(seg(t, 4.2, 4.5))));
    this.fin.transform = 'scale(' + (1 - 0.14 * dip) + ')';
    this.ring.left = '170px'; this.ring.top = (tap === 0.45 ? SEARCH_Y : tap === 1.8 ? ROW_Y : BTN_Y) + 'px';
    GB.ripple(this.ring, t, tap);
    const gp = seg(t, tap, tap + 0.9);
    this.glowG.opacity = String(tap > 0 ? 0.9 * (1 - gp) : 0);
    GB.glow(this.mapEl, 540, 962, lerp(420, 820, eo(gp)));
    const cIn = eo(seg(t, 4.3, 4.6));
    this.cat.opacity = String(cIn);
    this.cat.transform = 'translateY(' + lerp(12, 0, cIn) + 'px)';
    const fly = seg(t, 4.45, 5.0);
    this.new.opacity = String(eo(seg(t, 4.45, 4.55)));
    this.new.transform = 'translate(' + lerp(103, 0, eio(fly)) + 'px,' + lerp(240, 0, eio(fly)) + 'px) scale(' + lerp(1.3, 1, eob(fly, 1.7)) + ') rotate(' + lerp(-6, 0, eob(fly, 1.5)) + 'deg)';
    this.live.opacity = String(eo(seg(t, 5.1, 5.4)));
  },
});
