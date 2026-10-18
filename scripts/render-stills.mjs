// Step 6 of the loop, "3 stills": renders one still per look so Luke can pick a direction
// before anything is animated. Writes stills/out/<composition>.png.
//   npm run stills                 (frame 140, the settled end state)
//   npm run stills -- 90           (any frame)
import fs from "node:fs";
import { remotion, ENTRY, LOOKS } from "./remotion-cli.mjs";

const frame = process.argv[2] ?? "140";
fs.mkdirSync("stills/out", { recursive: true });
for (const id of LOOKS) {
  const out = `stills/out/${id}.png`;
  remotion(["still", ENTRY, id, out, `--frame=${frame}`]);
  console.log(`still ${id} @${frame} -> ${out}`);
}
