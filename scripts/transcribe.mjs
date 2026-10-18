// Runs scripts/transcribe.py with whichever Python this machine has (python3 on macOS and
// Linux, python on Windows), so `npm run transcribe` works everywhere.
import { spawnSync } from "node:child_process";

const args = ["scripts/transcribe.py", ...process.argv.slice(2)];
for (const py of ["python3", "python", "py"]) {
  const r = spawnSync(py, args, { stdio: "inherit" });
  if (r.error?.code === "ENOENT") continue;
  process.exit(r.status ?? 1);
}
console.error("No Python found. Install Python 3, then: pip install openai-whisper");
process.exit(1);
