// Small wrapper around the Remotion CLI so the scripts below stay readable.
import { execFileSync } from "node:child_process";
import path from "node:path";

const bin = path.join("node_modules", ".bin", process.platform === "win32" ? "remotion.cmd" : "remotion");

export function remotion(args) {
  execFileSync(bin, args, { stdio: ["ignore", "ignore", "inherit"], shell: process.platform === "win32" });
}

export const ENTRY = "remotion/index.ts";
export const LOOKS = ["ClickTrail-A-Switchback", "ClickTrail-B-Ledger", "ClickTrail-C-Summit"];
