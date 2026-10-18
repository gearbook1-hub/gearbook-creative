// Step 7, "Build in code": renders the picked looks to MP4 (H.264, 1080x1920).
//   npm run render                       all three looks
//   npm run render -- ClickTrail-A-Switchback --props='{"values":[3,9,20,41,77]}'
// New words or numbers never need new code: pass props.
import fs from "node:fs";
import { remotion, ENTRY, LOOKS } from "./remotion-cli.mjs";

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith("--"));
const extra = args.filter((a) => a.startsWith("--"));
fs.mkdirSync("renders", { recursive: true });
for (const id of ids.length ? ids : LOOKS) {
  const out = `renders/${id}.mp4`;
  remotion(["render", ENTRY, id, out, "--codec=h264", ...extra]);
  console.log(`render ${id} -> ${out}`);
}
