// Step "Check the render": pulls frames from every look before anything is delivered and
// checks them against the rules the piece was built to. Exit 1 if any check fails.
//   - the frame isn't blank, and Roca actually loaded (no Georgia fallback)
//   - nothing but background above y 230 or below y 1520 (Instagram's caption and buttons
//     cover those bands; Luke's note on I01)
//   - nothing but background in the right-hand button rail (x > 900)
// "Background" is the piece at t = 0, before anything has arrived, so the topo ground counts.
import fs from "node:fs";
import { PNG } from "pngjs";
import { args, looksOf, openPiece } from "./motion.mjs";

const SAFE_TOP = 230, SAFE_BOTTOM = 1520, RAIL_X = 900;
const { piece, props } = args();

const read = (f) => PNG.sync.read(fs.readFileSync(f));
function compare(bgFile, file) {
  const bg = read(bgFile), fr = read(file);
  let inside = 0, outsideBand = 0, inRail = 0;
  for (let y = 0; y < fr.height; y += 2) {
    for (let x = 0; x < fr.width; x += 2) {
      const i = (y * fr.width + x) * 4;
      const d = Math.abs(fr.data[i] - bg.data[i]) + Math.abs(fr.data[i + 1] - bg.data[i + 1]) + Math.abs(fr.data[i + 2] - bg.data[i + 2]);
      if (d < 40) continue;
      if (y < SAFE_TOP || y > SAFE_BOTTOM) outsideBand++;
      else if (x > RAIL_X) inRail++;
      else inside++;
    }
  }
  return { blank: inside < 200, outsideBand, inRail };
}

fs.mkdirSync("stills/out/check", { recursive: true });
let failed = 0;
for (const look of looksOf(piece)) {
  const p = await openPiece(piece, { look, props });
  const name = `${piece}-${look ?? "main"}`;
  const bg = `stills/out/check/${name}-bg.png`;
  await p.frame(0, bg);
  for (const t of p.checkAt ?? [0.25, 0.6, 1].map((k) => +(p.duration * k).toFixed(2))) {
    const file = `stills/out/check/${name}-${t}s.png`;
    await p.frame(t, file);
    const r = compare(bg, file);
    const problems = [
      r.blank && "blank frame",
      !p.roca && "Roca did not load",
      r.outsideBand > 0 && `${r.outsideBand} px outside y ${SAFE_TOP}-${SAFE_BOTTOM}`,
      p.checkRail && r.inRail > 0 && `${r.inRail} px in the button rail`,
    ].filter(Boolean);
    console.log(`${problems.length ? "FAIL" : "pass"}  ${name} @ ${t}s${problems.length ? ": " + problems.join(", ") : ""}`);
    if (problems.length) failed++;
  }
  await p.close();
}
if (failed) {
  console.error(`\n${failed} frame(s) failed. Fix before delivering.`);
  process.exit(1);
}
console.log("\nAll frames pass. Safe to deliver.");
