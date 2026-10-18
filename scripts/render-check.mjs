// Step 8, "Check the render": pulls frames from each look before anything is delivered and
// checks them against the rules the piece was built to. Fails (exit 1) if any check fails.
//   - the frame isn't blank (something actually rendered)
//   - nothing but background above y 230 or below y 1520 (Instagram's caption and buttons
//     cover those bands; Luke's note on I01)
//   - nothing but background in the right-hand button rail (x > 900)
import fs from "node:fs";
import { PNG } from "pngjs";
import { remotion, ENTRY, LOOKS } from "./remotion-cli.mjs";

const FRAMES = [30, 90, 140];
const SAFE_TOP = 230, SAFE_BOTTOM = 1520, RAIL_X = 900;

function inspect(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = png;
  const px = (x, y) => { const i = (y * width + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
  const bg = px(4, 4);
  const differs = (c) => Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > 24;
  let inside = 0, outsideBand = 0, inRail = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (!differs(px(x, y))) continue;
      if (y < SAFE_TOP || y > SAFE_BOTTOM) outsideBand++;
      else if (x > RAIL_X) inRail++;
      else inside++;
    }
  }
  return { blank: inside < 200, outsideBand, inRail };
}

fs.mkdirSync("stills/out/check", { recursive: true });
let failed = 0;
for (const id of LOOKS) {
  for (const frame of FRAMES) {
    const file = `stills/out/check/${id}-${frame}.png`;
    remotion(["still", ENTRY, id, file, `--frame=${frame}`]);
    const r = inspect(file);
    const problems = [r.blank && "blank frame", r.outsideBand > 0 && `${r.outsideBand} px outside y ${SAFE_TOP}-${SAFE_BOTTOM}`, r.inRail > 0 && `${r.inRail} px in the button rail`].filter(Boolean);
    console.log(`${problems.length ? "FAIL" : "pass"}  ${id} frame ${frame}${problems.length ? ": " + problems.join(", ") : ""}`);
    if (problems.length) failed++;
  }
}
if (failed) {
  console.error(`\n${failed} frame(s) failed. Fix before delivering.`);
  process.exit(1);
}
console.log("\nAll frames pass. Safe to deliver.");
