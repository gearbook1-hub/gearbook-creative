"use client";

import { Player, Thumbnail } from "@remotion/player";
import { ClickTrail, CLICK_TRAIL, clickTrailDefaults, type TrailLook } from "@/remotion/ClickTrail";
import { LibraryReel, LIBRARY_REEL } from "@/remotion/LibraryReel";

// The real M18 engine, running in the browser. The same component the CLI renders to MP4, so
// what the dashboard shows is exactly what gets delivered.

const style = { width: "100%", height: "100%", display: "block" } as const;

export function TrailPlayer({ look }: { look: TrailLook }) {
  return (
    <Player
      component={ClickTrail}
      inputProps={{ ...clickTrailDefaults, look }}
      {...CLICK_TRAIL}
      compositionWidth={CLICK_TRAIL.width}
      compositionHeight={CLICK_TRAIL.height}
      autoPlay
      loop
      controls={false}
      clickToPlay={false}
      acknowledgeRemotionLicense
      style={style}
    />
  );
}

export function TrailStill({ look, frame = 140 }: { look: TrailLook; frame?: number }) {
  return (
    <Thumbnail
      component={ClickTrail}
      inputProps={{ ...clickTrailDefaults, look }}
      {...CLICK_TRAIL}
      compositionWidth={CLICK_TRAIL.width}
      compositionHeight={CLICK_TRAIL.height}
      frameToDisplay={frame}
      style={style}
    />
  );
}

export function ReelPlayer() {
  return (
    <Player
      component={LibraryReel}
      {...LIBRARY_REEL}
      compositionWidth={LIBRARY_REEL.width}
      compositionHeight={LIBRARY_REEL.height}
      autoPlay
      loop
      controls
      acknowledgeRemotionLicense
      style={style}
    />
  );
}
