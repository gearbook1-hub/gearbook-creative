// Screenshots of the live GearBook site for screen mockups in pieces (a desktop browser at
// 1440 wide, full page, cookie banner hidden, nothing accepted).
//   node scripts/capture-site.mjs public/pieces/M27-site-screen/site home= join=join
// Writes <out>/<name>.png for each name=path (path without the leading slash, so Git Bash
// leaves it alone).
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { BROWSERS } from "./motion.mjs";

const [out, ...pages] = process.argv.slice(2);
if (!out || !pages.length) {
  console.error("usage: node scripts/capture-site.mjs <out dir> name=path ...");
  process.exit(1);
}
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: BROWSERS.find((p) => fs.existsSync(p)), headless: true, args: ["--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
for (const spec of pages) {
  const [name, p] = spec.split("=");
  await page.goto(new URL("/" + p.replace(/^\/+/, ""), "https://www.gearbook.shop").href, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(async () => {
    for (const el of document.querySelectorAll("body *")) {
      const s = getComputedStyle(el);
      if ((s.position === "fixed" || s.position === "sticky") && /cookie/i.test(el.textContent) && el.textContent.length < 600) el.style.display = "none";
    }
    // Lazy images: scroll the page once so they load.
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));
  const file = path.join(out, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${name} ${p} -> ${file} (1440x${h})`);
}
await browser.close();
