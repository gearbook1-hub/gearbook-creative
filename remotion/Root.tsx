import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { ClickTrail, CLICK_TRAIL, clickTrailDefaults, type TrailLook } from "./ClickTrail";
import { ROCA_KIT } from "../lib/brand";
import { LibraryReel, LIBRARY_REEL } from "./LibraryReel";

// Fonts for CLI renders: Roca from Matt's Adobe kit, Outfit / Afacad Flux / IBM Plex Mono from
// Google Fonts. The kit only serves domains listed in its Adobe settings; if it doesn't load,
// renders fall back to Georgia and the render check flags it.
const FONT_SHEETS = [
  ROCA_KIT,
  "https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@400;600&family=Outfit:wght@300;400;500&family=IBM+Plex+Mono:wght@400&display=block",
];

if (typeof document !== "undefined" && !document.getElementById("gb-fonts")) {
  const handle = delayRender("Loading brand fonts");
  let pending = FONT_SHEETS.length;
  const done = () => {
    if (--pending === 0) document.fonts.ready.then(() => continueRender(handle));
  };
  FONT_SHEETS.forEach((href, i) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    if (i === 0) link.id = "gb-fonts";
    link.onload = done;
    link.onerror = done;
    document.head.appendChild(link);
  });
}

const LOOKS: { id: string; look: TrailLook }[] = [
  { id: "ClickTrail-A-Switchback", look: "switchback" },
  { id: "ClickTrail-B-Ledger", look: "ledger" },
  { id: "ClickTrail-C-Summit", look: "summit" },
];

export const RemotionRoot: React.FC = () => (
  <>
    {LOOKS.map(({ id, look }) => (
      <Composition key={id} id={id} component={ClickTrail} {...CLICK_TRAIL} defaultProps={{ ...clickTrailDefaults, look }} />
    ))}
    <Composition id="LibraryReel" component={LibraryReel} {...LIBRARY_REEL} />
  </>
);
