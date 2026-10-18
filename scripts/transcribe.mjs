// Runs scripts/transcribe.py with whichever Python this machine has (python3 on macOS and
// Linux, python on Windows), so `npm run transcribe` works everywhere.
import { spawnSync } from "node:child_process";

const args = ["scripts/transcribe.py", ...process.argv.slice(2)];
// On Windows, "python3" is often the Microsoft Store stub, which exits with 9009: skip it.
const order = process.platform === "win32" ? ["python", "py", "python3"] : ["python3", "python", "py"];
for (const py of order) {
  const r = spawnSync(py, args, { stdio: "inherit" });
  if (r.error?.code === "ENOENT" || r.status === 9009) continue;
  process.exit(r.status ?? 1);
}
console.error("No Python found. Install Python 3, then: pip install openai-whisper");
process.exit(1);
