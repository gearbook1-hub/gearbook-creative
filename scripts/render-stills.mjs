// Step "3 stills": one still per look so Luke can pick a direction before anything is
// animated further. Writes stills/out/<piece>-<look>.png.
//   npm run stills                                  M18, every look, at the settled end
//   npm run stills -- M18-click-trail --t=2.5
import fs from "node:fs";
import { args, looksOf, openPiece } from "./motion.mjs";

const { piece, t, props } = args();
fs.mkdirSync("stills/out", { recursive: true });
for (const look of looksOf(piece)) {
  const p = await openPiece(piece, { look, props });
  const out = `stills/out/${piece}-${look ?? "main"}.png`;
  await p.frame(t ? Number(t) : p.duration, out);
  await p.close();
  console.log(`still ${piece} ${look ?? ""} -> ${out}`);
}
