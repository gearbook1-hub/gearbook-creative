// npm run setup:check: what this machine has and what it still needs. Read-only: it never
// installs anything, it only tells you the command to run.
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { BROWSERS } from "./motion.mjs";

const mac = process.platform === "darwin";
const win = process.platform === "win32";
const has = (cmd, args = ["--version"]) => {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return r.status === 0 ? (r.stdout || r.stderr).trim().split("\n")[0] : null;
};
const install = (winCmd, macCmd) => (win ? winCmd : mac ? macCmd : macCmd.replace("brew install", "sudo apt install"));

const rows = [];
const check = (name, ok, need, fix) => rows.push({ name, ok: Boolean(ok), detail: ok || "", need, fix });

const major = Number(process.versions.node.split(".")[0]);
check("Node 20+", major >= 20 ? `v${process.versions.node}` : null, "everything", install("winget install OpenJS.NodeJS.LTS", "brew install node"));
check("node_modules", fs.existsSync("node_modules/next") ? "installed" : null, "everything", "npm install");
const browser = BROWSERS.find((p) => fs.existsSync(p));
check("Edge or Chrome", browser, "stills, renders, render check", install("winget install Microsoft.Edge", "brew install --cask google-chrome"));
check("ffmpeg", has("ffmpeg", ["-version"]), "MP4 renders, transcription", install("winget install Gyan.FFmpeg", "brew install ffmpeg"));
const py = ["python3", "python", "py"].find((p) => has(p));
check("Python 3", py && has(py), "transcription", install("winget install Python.Python.3.12", "brew install python"));
const whisper = py && spawnSync(py, ["-c", "import whisper"]).status === 0;
check("openai-whisper", whisper ? "importable" : null, "transcription", `${py || "python3"} -m pip install -U openai-whisper`);
check("yt-dlp", has("yt-dlp"), "downloading reference reels", install("winget install yt-dlp.yt-dlp", "brew install yt-dlp"));
const gh = has("gh");
const ghAuth = gh && spawnSync("gh", ["auth", "status"]).status === 0;
check("GitHub CLI, signed in", ghAuth ? "signed in" : null, "pushing to gearbook1-hub/gearbook-creative", gh ? "gh auth login, then gh auth setup-git" : install("winget install GitHub.cli", "brew install gh") + ", then gh auth login");
check(".env.local", fs.existsSync(".env.local") ? "present" : null, "optional: real Claude API scouting", "copy .env.example to .env.local and add ANTHROPIC_API_KEY");

const w = Math.max(...rows.map((r) => r.name.length));
for (const r of rows) {
  console.log(`${r.ok ? "ok " : "-- "} ${r.name.padEnd(w)}  ${r.ok ? r.detail : `needed for ${r.need}: ${r.fix}`}`);
}
const missing = rows.filter((r) => !r.ok && r.name !== ".env.local");
console.log(missing.length ? `\n${missing.length} thing(s) to set up.` : "\nReady. Try npm run dev, then npm run render:check.");
