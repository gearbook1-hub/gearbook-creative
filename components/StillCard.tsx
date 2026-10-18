import { grounds } from "@/lib/brand";
import type { Still } from "@/lib/types";

// A look pitched as a still, for ideas that aren't built in code in this repo. Shows the look's
// one-line idea on its ground, the way the reel's stills carry their option line up top.
export function StillCard({ still, idea }: { still: Still; idea: string }) {
  const g = grounds[still.ground];
  return (
    <div className="still" style={{ background: g.bg, color: g.fg, padding: "12% 10%" }}>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 9, letterSpacing: "0.2em", color: g.muted, textTransform: "uppercase" }}>
        Option {still.letter}: {still.name}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(11px, 1.6vw, 15px)", lineHeight: 1.25, marginTop: 8 }}>{still.line}</div>
      <svg viewBox="0 0 100 100" style={{ position: "absolute", left: "10%", right: "10%", bottom: "16%", width: "80%" }} aria-hidden>
        <path d="M5 90 Q 30 30 95 12" fill="none" stroke={g.line} strokeWidth="1.4" strokeDasharray={still.letter === "B" ? "0" : "2 5"} />
        <circle cx="95" cy="12" r="4" fill={g.accent} />
      </svg>
      <div style={{ position: "absolute", bottom: "6%", left: "10%", fontFamily: "var(--font-display)", fontSize: 10 }}>{idea}</div>
    </div>
  );
}
