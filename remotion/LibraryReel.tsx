import React from "react";
import { Series } from "remotion";
import { ClickTrail, clickTrailDefaults } from "./ClickTrail";

// "The reel": the library cut together. For now that's the one piece built in code here, in
// all three looks. Add pieces to the Series as they're built.
export const LibraryReel: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={150}><ClickTrail {...clickTrailDefaults} look="switchback" /></Series.Sequence>
    <Series.Sequence durationInFrames={150}><ClickTrail {...clickTrailDefaults} look="ledger" /></Series.Sequence>
    <Series.Sequence durationInFrames={150}><ClickTrail {...clickTrailDefaults} look="summit" /></Series.Sequence>
  </Series>
);

export const LIBRARY_REEL = { width: 1080, height: 1920, fps: 30, durationInFrames: 450 } as const;
