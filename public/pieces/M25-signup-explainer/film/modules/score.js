kit.score(function (S, T) {
  // Foley only, no music: every sound sits on the frame of the motion it belongs to.
  const qs = T.questions, su = T.signup, ap = T['add-product'], pk = T['pack-it'];
  // The questions: one pop per bubble (QS in scene-questions.js; the first is already up at frame 0).
  [0, 0.2, 0.5, 0.8, 1.1].forEach((x, i) => S.fx('pop', qs + x, { vel: 58 + i * 2, pitch: [0, 4, 2, 7, 5][i] }));
  // Sign up: the phone settles, then one click per tap (TAPS in scene-signup.js).
  S.fx('thud', su + 0.8, { vel: 40 });
  [1.5, 3.3, 4.8, 6.3, 7.1].forEach((x) => S.fx('click', su + x, { vel: 66 }));
  S.fx('click', su + 7.9, { vel: 80 });
  S.fx('pop', su + 8.42, { vel: 64, pitch: 7 });
  S.fx('pop', su + 8.78, { vel: 40, pitch: 4 });
  // Add a product: tap the search, keystrokes, results, tap the row, the testimonial, tap Add, the card lands.
  S.fx('click', ap + 0.45, { vel: 64 });
  for (let i = 0; i < 8; i++) S.fx('tick', ap + 0.6 + i * 0.05, { vel: 38 });
  S.fx('pop', ap + 1.15, { vel: 44 });
  S.fx('click', ap + 1.8, { vel: 64 });
  for (let i = 0; i < 20; i++) S.fx('tick', ap + 2.5 + i * 0.0575, { vel: 30 });
  S.fx('click', ap + 4.0, { vel: 76 });
  S.fx('boing', ap + 4.8, { vel: 62 });
  // Share it: tap send, the bubble and the link card pop in, the reply bloops back (TAPS, IN_B in scene-share-it.js).
  const sh = T['share-it'];
  S.fx('click', sh + 1.0, { vel: 66 });
  [1.05, 1.25].forEach((x, i) => S.fx('pop', sh + x, { vel: 52, pitch: 5 + i * 3 }));
  [0.4, 2.1].forEach((x) => S.fx('pop', sh + x, { vel: 46, pitch: -3 }));
  // Pack it up: six pieces drop in (0.3 + i * 0.2 + 0.45), the lid shuts, two buckles snap, the patch grows into the logo, the underline draws.
  for (let i = 0; i < 6; i++) S.fx('pop', pk + 0.75 + i * 0.2, { vel: 62 + i * 3, pitch: i * 2 });
  S.fx('thud', pk + 2.08, { vel: 72 });
  [2.25, 2.35].forEach((x) => S.fx('click', pk + x, { vel: 74, pitch: 5 }));
  S.fx('boing', pk + 2.5, { vel: 70 });
  S.fx('pop', pk + 3.68, { vel: 42, pitch: 9 });
  // Members' faces pop in (FACES + i * 0.08 in scene-pack-it.js), rising.
  for (let i = 0; i < 10; i++) S.fx('pop', pk + 3.4 + i * 0.08, { vel: 40 + i * 2, pitch: 2 + i });
  S.master({ gain: -3, fadeOut: 0.6 });
});
