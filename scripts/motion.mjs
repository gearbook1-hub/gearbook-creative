// Records GearBook's HTML motion pieces (public/pieces/<id>/index.html). Serves public/ on a
// local port, opens the piece in headless Edge or Chrome at 1080x1920, and steps the
// piece's clock with window.Motion.seek(t): one screenshot per frame, then ffmpeg joins
// them. Same idea as recording a motion artifact, but frame-exact.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve("public");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".mp4": "video/mp4", ".json": "application/json" };

export const BROWSERS = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(ROOT, url);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

export async function openPiece(piece, { look, props } = {}) {
  const executablePath = BROWSERS.find((p) => fs.existsSync(p));
  if (!executablePath) throw new Error("No Edge or Chrome found. Set BROWSER_PATH.");
  const server = await serve();
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--hide-scrollbars"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  const q = new URLSearchParams({ render: "1" });
  if (look) q.set("look", look);
  if (props) q.set("props", props);
  await page.goto(`http://127.0.0.1:${server.address().port}/pieces/${piece}/?${q}`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.body.dataset.ready === "true");
  const duration = await page.evaluate(() => window.Motion.duration);
  const roca = await page.evaluate(() => document.fonts.check("700 40px roca"));
  const { overlay, checkAt } = await page.evaluate(() => ({ overlay: window.Motion.overlay, checkAt: window.Motion.checkAt }));
  return {
    duration,
    roca,
    overlay,
    checkAt,
    async frame(t, out) {
      await page.evaluate((s) => window.Motion.seek(s), t);
      await page.screenshot({ path: out, type: "png", omitBackground: overlay });
    },
    async close() {
      await browser.close();
      server.close();
    },
  };
}

/** The looks a piece declares in its Motion.init({ looks: [...] }). */
export function looksOf(piece) {
  const html = fs.readFileSync(path.join(ROOT, "pieces", piece, "index.html"), "utf8");
  const m = html.match(/looks:\s*\[([^\]]*)\]/);
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [undefined];
}

export function ffmpeg(list) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...list], { stdio: "inherit" });
}

export function args() {
  const a = process.argv.slice(2);
  const flag = (name) => {
    const f = a.find((x) => x.startsWith(`--${name}=`));
    return f && f.slice(name.length + 3);
  };
  return {
    piece: a.find((x) => !x.startsWith("--")) || "M18-click-trail",
    look: flag("look"),
    props: flag("props"),
    fps: Number(flag("fps") || 60),
    t: flag("t"),
    over: flag("over"),
  };
}
