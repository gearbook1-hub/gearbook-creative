// Pulse runs as a static page, so approve / pass / notes live in the browser until applied.
// "Copy decisions" on /pulse puts JSON on the clipboard; save it to a file and run:
//   node scripts/apply-decisions.mjs decisions.json
// Approved ideas move to "approved" (next: 3 stills), passed ideas to "passed", notes are kept.
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/apply-decisions.mjs <decisions.json>");
  process.exit(1);
}
const decisions = JSON.parse(fs.readFileSync(file, "utf8"));
const ideas = JSON.parse(fs.readFileSync("data/ideas.json", "utf8"));
for (const [id, d] of Object.entries(decisions)) {
  const idea = ideas.find((i) => i.id === id);
  if (!idea) { console.warn(`skip ${id}: not in data/ideas.json`); continue; }
  if (d.decision === "approved" && idea.status === "pitched") idea.status = "approved";
  if (d.decision === "passed" && idea.status === "pitched") idea.status = "passed";
  if (d.note) idea.note = d.note;
  console.log(`${id} ${idea.name}: ${idea.status}${d.note ? " + note" : ""}`);
}
fs.writeFileSync("data/ideas.json", JSON.stringify(ideas, null, 2) + "\n");
