// The motion mod's scout. Reads a source's transcript, checks every moment against the library
// catalog (data/pieces.json) and logs new ideas to data/ideas.json as "pitched", with the exact
// line, the catalog check and why nothing existing works. Pitches then show up on Pulse.
//
//   npm run scout -- S01            scout one source
//   npm run scout -- S01 --dry-run  print the prompt, call nothing
//
// Needs ANTHROPIC_API_KEY (or an `ant auth login` profile). Without one it runs as --dry-run.
import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const pieces = read("data/pieces.json");
const sources = read("data/sources.json");
const ideas = read("data/ideas.json");

const [sourceId, flag] = process.argv.slice(2);
const source = sources.find((s) => s.id === sourceId);
if (!source) {
  console.error(`Usage: npm run scout -- <sourceId> [--dry-run]. Sources: ${sources.map((s) => s.id).join(", ")}`);
  process.exit(1);
}

const SYSTEM = `You are GearBook's motion mod scout. GearBook gives outdoor professionals affiliate gear catalogs; its reels run on Instagram @gear.book.
You read what Luke said in a reel and find moments where a motion graphic would explain it better than footage alone.
For each moment, check the library catalog first. Only pitch an idea when no live piece can show it; say which pieces came closest and why each falls short.
Every idea must be reusable: describe it as an engine with variables, not a one-off.
Copy rules: no em or en dashes, never promise earnings or quote a commission rate, say "outdoor professional" or "pro" rather than "guide" (unless a mountain guide).
Return at most 3 ideas. Return none if the library already covers everything.`;

const catalog = pieces
  .filter((p) => p.status === "live")
  .map((p) => `${p.id} ${p.name}: ${p.description} COVERS: ${p.covers} VARIABLES: ${p.variables.join(", ")}`)
  .join("\n");
const already = ideas.map((i) => `${i.name} (${i.status})`).join(", ");
const transcript = source.transcript.map((l) => `[${l.t}] ${l.text}`).join("\n");

const prompt = `<catalog>\n${catalog}\n</catalog>\n\n<already_logged>${already}</already_logged>\n\n<source id="${source.id}" kind="${source.kind}" title="${source.title}">\n${transcript}\n</source>\n\nFind the moments in this source that need a graphic the library doesn't have.`;

const IdeaSchema = z.object({
  ideas: z.array(
    z.object({
      name: z.string().describe("Two or three words, title case"),
      at: z.string().describe("Timestamp of the line, e.g. 0:22, or empty"),
      quote: z.string().describe("The exact line from the transcript"),
      pitch: z.string().describe("What the graphic does, and what makes it reusable"),
      catalogCheck: z.array(z.object({ piece: z.string(), verdict: z.string() })),
      whyNew: z.string().describe("One line: what nothing in the library can show"),
    }),
  ),
});

if (flag === "--dry-run" || !process.env.ANTHROPIC_API_KEY) {
  if (!process.env.ANTHROPIC_API_KEY && flag !== "--dry-run") console.log("No ANTHROPIC_API_KEY: dry run.\n");
  console.log(`SYSTEM:\n${SYSTEM}\n\nUSER:\n${prompt}`);
  process.exit(0);
}

const client = new Anthropic();
const response = await client.messages.parse({
  model: process.env.SCOUT_MODEL || "claude-opus-5-5",
  max_tokens: 16000,
  output_config: { effort: "high", format: zodOutputFormat(IdeaSchema) },
  system: SYSTEM,
  messages: [{ role: "user", content: prompt }],
});

if (response.stop_reason === "refusal") {
  console.error("The model declined:", response.stop_details?.explanation ?? "no explanation");
  process.exit(1);
}
const found = response.parsed_output?.ideas ?? [];
const today = new Date().toISOString().slice(0, 10);
let next = Math.max(0, ...ideas.map((i) => Number(i.id.slice(1)))) + 1;
for (const idea of found) {
  ideas.push({ id: `I${String(next++).padStart(2, "0")}`, sourceId: source.id, ...idea, at: idea.at || undefined, status: "pitched", pitchedOn: today });
  console.log(`Pitched: ${idea.name}  (${idea.whyNew})`);
}
fs.writeFileSync("data/ideas.json", JSON.stringify(ideas, null, 2) + "\n");
console.log(found.length ? `\n${found.length} new pitch(es) on Pulse.` : "Nothing new: the library covers this source.");
