const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
const STEPS = [
  [1.95, '1/5: Basics', 'Name', 'Your Name', 'Country of residence', 'United States', 'Next: Profile'],
  [2.55, '2/5: Profile', 'Your title', 'Avalanche educator', 'Specialties', 'Ski touring, ice climbing', 'Next: Links'],
  [3.0, '3/5: Links', 'Social links', '@alex.outside', 'Company / Organization', 'Rivera Mountain School', 'Next: Outreach'],
  [3.4, '4/5: Outreach', 'How do you recommend gear?', 'Clients and courses', 'How often?', 'Every week', 'Next: Payment'],
  [3.8, '5/5: Payment', 'Venmo handle', '@yourname', 'Weekly newsletter', 'Yes, email me', 'Submit Application'],
];
const TAPS = [1.5, 2.45, 2.9, 3.3, 3.7, 4.2];
const GATE_Y = 403, NEXT_Y = 565;
kit.scene('signup', {
  init(kit) {
    let bar = '';
    for (let i = 0; i < 5; i++) bar += '<i class="signup-seg" style="flex:1;height:6px;border-radius:3px"></i>';
    const v1 = '<div class="view signup-a">' +
      '<p class="gb-label" style="top:112px">Join GearBook</p>' +
      '<h3 class="gb-h" style="top:138px">Get your free catalog.</h3>' +
      '<p class="gb-p" style="top:214px">Takes about 5 minutes. No credit card.</p>' +
      '<div class="gb-btn signup-g" style="top:290px">Continue with Google</div>' +
      '<p class="gb-p" style="top:358px;text-align:center;text-decoration:underline;color:var(--second)">Continue with email instead</p>' +
      '<p class="gb-p" style="top:520px;text-align:center;font-size:13px">Already joined GearBook? Login here</p></div>';
    const v2 = '<div class="view signup-b"><p class="gb-label signup-step" style="top:22px">1/5: Basics</p>' +
      '<div style="top:48px;display:flex;gap:6px">' + bar + '</div>' +
      '<div class="signup-f" style="top:84px;height:260px">' +
      '<p class="gb-label signup-l1" style="position:absolute;left:0;right:0;top:0;margin:0">Name</p><div class="gb-input signup-i1" style="position:absolute;left:0;right:0;top:24px"><span class="signup-t1"></span><i class="caret signup-c1"></i></div>' +
      '<p class="gb-label signup-l2" style="position:absolute;left:0;right:0;top:96px;margin:0">Country</p><div class="gb-input signup-i2" style="position:absolute;left:0;right:0;top:120px"><span class="signup-t2"></span><i class="caret signup-c2"></i></div></div>' +
      '<div class="gb-btn signup-next" style="top:452px">Next: Profile</div></div>';
    const v3 = '<div class="view signup-c">' +
      '<div style="top:40px;width:52px;height:52px;background:var(--main);display:flex;align-items:center;justify-content:center"><svg width="30" height="30" viewBox="0 0 30 30"><path class="signup-k" d="M7 15.5 L13 21.5 L24 9" pathLength="1" style="fill:none;stroke:var(--ground);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round"/></svg></div>' +
      '<p class="gb-label" style="top:118px">Application Submitted</p>' +
      '<h3 class="gb-h" style="top:142px">That&#39;s everything we need.</h3>' +
      '<div class="gb-card signup-slug" style="top:226px;border-radius:16px;padding:14px 16px;font-family:var(--mono, ui-monospace, monospace);font-size:15px">gearbook.shop/catalog/alex-rivera</div>' +
      '<div class="signup-next-up" style="top:300px;border:2px solid color-mix(in srgb, var(--main) 40%, transparent);background:color-mix(in srgb, var(--main) 6%, var(--ground));border-radius:20px;padding:18px">' +
      '<p class="gb-h" style="font-size:20px;margin:0 0 8px">Next up: your gear</p><p class="gb-p" style="margin:0">Approval unlocks your dashboard, and that&#39;s where you&#39;ll add your products.</p></div></div>';
    kit.stage.append(kit.h('<div class="ground"><div class="signup-map" style="position:absolute;inset:0">' + GB.topo('signup') + '</div>' +
      '<div class="words cap"><p class="eyebrow signup-eye">For pros and enthusiasts</p><h2 class="line signup-hook">Your gear catalog, made easy</h2><h2 class="line signup-apply" style="position:absolute;left:0;right:0;bottom:0">Apply in about 5 minutes</h2></div>' +
      GB.phone(v1 + v2 + v3 + '<div class="ring signup-ring"></div><div class="finger signup-fin"></div>') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.mapEl = q('.signup-map');
    this.map = this.mapEl.style; this.map.transformOrigin = '540px 962px';
    this.glowG = q('.topo-glow').style;
    this.phone = q('.phone').style;
    this.hook = q('.signup-hook'); this.line = q('.signup-apply'); this.eye = q('.signup-eye').style;
    for (const k of ['a', 'b', 'c', 'g', 'next', 'ring', 'fin', 'f', 'slug', 'next-up', 'c1', 'c2', 'i1', 'i2']) this[k] = q('.signup-' + k).style;
    for (const k of ['step', 'l1', 'l2', 't1', 't2', 'next']) this['e' + k] = q('.signup-' + k);
    this.segs = [...kit.stage.querySelectorAll('.signup-seg')].map((e) => e.style);
    this.k = q('.signup-k').style; this.k.strokeDasharray = '1 1';
  },
  render(t) {
    this.map.transform = 'scale(' + lerp(1.0, 1.025, seg(t, 0, 6)) + ')';
    const e = eo(seg(t, -0.7, -0.3)), x = ei(seg(t, 6.15, 6.4));
    this.eye.opacity = String(e * (1 - x));
    this.eye.transform = 'translateX(' + (lerp(26, 0, e) - 26 * x) + 'px)';
    if (t < 1.3) TextFx.fadeFromRight(this.hook, t, -0.85); else TextFx.fadeOutLeft(this.hook, t, 1.3);
    if (t < 6.15) TextFx.fadeFromRight(this.line, t, 2.3);
    else TextFx.fadeOutLeft(this.line, t, 6.15);
    const rise = seg(t, 0, 0.95);
    this.phone.transform = 'translateY(' + lerp(1150, 0, eo(rise)) + 'px) rotate(' + lerp(-4, 0, eo(rise)) + 'deg) scale(' + GB.PH.s + ')';
    const ab = eio(seg(t, 1.75, 2.05)), bc = eio(seg(t, 4.35, 4.65));
    this.a.transform = 'translateX(' + lerp(0, -340, ab) + 'px)';
    this.b.transform = 'translateX(' + (lerp(340, 0, ab) + lerp(0, -340, bc)) + 'px)';
    const out = ei(seg(t, 6.2, 6.5));
    this.c.transform = 'translateX(' + (lerp(340, 0, bc) - 200 * out) + 'px)';
    this.c.opacity = String(1 - out);
    let si = 0;
    for (let i = 0; i < STEPS.length; i++) if (t >= STEPS[i][0]) si = i;
    const S = STEPS[si], u = t - S[0];
    this.estep.textContent = S[1]; this.el1.textContent = S[2]; this.el2.textContent = S[4];
    this.enext.textContent = S[6];
    this.enext.classList.toggle('amber', si === 4);
    const p1 = seg(u, 0.05, 0.28), p2 = seg(u, 0.2, 0.4);
    this.et1.textContent = S[3].slice(0, Math.round(S[3].length * p1));
    this.et2.textContent = S[5].slice(0, Math.round(S[5].length * p2));
    this.c1.opacity = p1 > 0 && p1 < 1 ? '1' : '0';
    this.c2.opacity = p2 > 0 && p2 < 1 ? '1' : '0';
    this.i1.borderColor = p1 > 0 && p1 < 1 ? 'var(--second)' : '';
    this.i2.borderColor = p2 > 0 && p2 < 1 ? 'var(--second)' : '';
    const sl = eo(seg(u, 0, 0.16));
    this.f.opacity = String(si === 0 ? 1 : lerp(0.15, 1, sl));
    this.f.transform = 'translateX(' + (si === 0 ? 0 : lerp(24, 0, sl)) + 'px)';
    this.segs.forEach((s, i) => { s.background = i <= si && t >= 1.95 ? 'var(--main)' : 'color-mix(in srgb, var(--second) 14%, var(--ground))'; });
    const tap = GB.lastTap(t, TAPS);
    const dip = Math.sin(Math.PI * seg(t, tap, tap + 0.18));
    this.g.transform = tap === 1.5 ? 'scale(' + (1 - 0.04 * dip) + ')' : 'none';
    this.next.transform = tap > 1.5 ? 'scale(' + (1 - 0.04 * dip) + ')' : 'none';
    GB.finger(this.fin, t, [[0.8, 270, 640], [1.3, 170, GATE_Y], [1.75, 170, GATE_Y], [2.25, 170, NEXT_Y]]);
    this.fin.opacity = String(eo(seg(t, 0.85, 1.1)) * (1 - eo(seg(t, 4.3, 4.5))));
    this.fin.transform = 'scale(' + (1 - 0.18 * dip) + ')';
    this.ring.left = '170px'; this.ring.top = (tap === 1.5 ? GATE_Y : NEXT_Y) + 'px';
    GB.ripple(this.ring, t, tap);
    const gp = seg(t, tap, tap + 0.9);
    this.glowG.opacity = String(tap > 0 ? 0.9 * (1 - gp) : 0);
    GB.glow(this.mapEl, 540, 962, lerp(420, 820, eo(gp)));
    this.k.strokeDashoffset = String(1 - eo(seg(t, 4.65, 5.0)));
    const s1 = eo(seg(t, 4.85, 5.2)), s2 = eo(seg(t, 5.05, 5.4));
    this.slug.opacity = String(s1); this.slug.transform = 'translateY(' + lerp(14, 0, s1) + 'px)';
    this['next-up'].opacity = String(s2); this['next-up'].transform = 'translateY(' + lerp(14, 0, s2) + 'px)';
  },
});
