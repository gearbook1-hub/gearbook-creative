const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
// The opener: the questions every pro gets about their gear, then the answer line that signup opens on.
// [who, question, left or right edge, top, entrance time]
const QS = [['Client', 'What boots are you wearing?', 'left:64px', 470, -0.35], ['Student', 'Which rope should I get?', 'right:64px', 680, 0.2],
  ['Friend', 'Link to that jacket?', 'left:100px', 890, 0.5], ['Client', 'Which cams do you climb on?', 'right:64px', 1100, 0.8],
  ['Friend', 'Send me your packing list!', 'left:64px', 1310, 1.1]];
const OUT = 1.55, LINE_B = 1.85;
kit.scene('questions', {
  init(kit) {
    kit.css('.questions-b { position:absolute; padding:22px 34px 26px; box-sizing:border-box; border-radius:40px; background:#fff; border:2px solid color-mix(in srgb, var(--second) 14%, #fff); box-shadow:0 18px 40px rgba(0,0,0,.08) }' +
      '.questions-b.l { border-bottom-left-radius:12px; transform-origin:0 100% } .questions-b.r { border-bottom-right-radius:12px; transform-origin:100% 100% }' +
      '.questions-b .gb-label { display:block; margin:0 0 8px; font-size:22px } .questions-b p { margin:0; font-size:46px; line-height:1.25; white-space:nowrap }');
    let bubbles = '';
    QS.forEach(([who, text, side, top]) => {
      bubbles += '<div class="questions-b ' + (side[0] === 'l' ? 'l' : 'r') + '" style="' + side + ';top:' + top + 'px"><span class="gb-label">' + who + '</span><p>' + text + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground"><div class="questions-map" style="position:absolute;inset:0">' + GB.topo('questions') + '</div>' + bubbles +
      '<div class="words cap"><p class="eyebrow questions-eye">For pros and enthusiasts</p><h2 class="line questions-b2">Your gear catalog, made easy</h2>' +
      '<h2 class="line questions-b1" style="position:absolute;left:0;right:0;bottom:0">Sound familiar?</h2></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.map = q('.questions-map');
    this.mapSt = this.map.style; this.mapSt.transformOrigin = '540px 962px';
    this.eye = q('.questions-eye').style;
    this.l1 = q('.questions-b1'); this.l2 = q('.questions-b2');
    this.bs = [...kit.stage.querySelectorAll('.questions-b')].map((e) => e.style);
  },
  render(t) {
    GB.drawLines(this.map, t, -1.0, 1.5);
    this.mapSt.transform = 'scale(' + lerp(1.04, 1.0, eio(seg(t, -0.5, 2.7))) + ')';
    const e = eo(seg(t, -0.8, -0.4));
    this.eye.opacity = String(e);
    this.eye.transform = 'translateX(' + lerp(26, 0, e) + 'px)';
    if (t < 1.4) TextFx.fadeFromRight(this.l1, t, -0.75); else TextFx.fadeOutLeft(this.l1, t, 1.4);
    TextFx.fadeFromRight(this.l2, t, LINE_B);
    // Each question pops in from its tail corner, drifts, then drops out the bottom ahead of the phone.
    this.bs.forEach((st, i) => {
      const a = QS[i][4], p = seg(t, a, a + 0.32), o = seg(t, OUT + i * 0.07, OUT + i * 0.07 + 0.45);
      const side = QS[i][2][0] === 'l' ? -1 : 1;
      st.opacity = String(eo(seg(t, a, a + 0.1)) * (1 - eo(seg(o, 0.5, 1))));
      st.transform = 'translate(' + side * 6 * Math.sin(t * 1.7 + i) + 'px,' + (lerp(24, 0, eo(p)) + lerp(0, 900, ei(o))) + 'px) rotate(' + (side * 1.5 + lerp(0, -side * 8, ei(o))) + 'deg) scale(' + lerp(0.85, 1, eob(p, 1.6)) * lerp(1, 0.8, o) + ')';
    });
  },
});
