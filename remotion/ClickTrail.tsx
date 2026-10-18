import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, fonts, grounds } from "../lib/brand";

// M18 Click Trail. One member's number across N months, one engine, three looks.
// Luke's note (I01): the lockup can't sit at the bottom, Instagram's caption and buttons
// cover it, so everything lives between y 230 and 1520 and clear of the right-hand rail.
export const SAFE = { top: 230, bottom: 1520, left: 90, right: 870 } as const;

export type TrailLook = "switchback" | "ledger" | "summit";

export interface ClickTrailProps {
  look: TrailLook;
  headline: string;
  values: number[];
  months: string[];
  member: string;
  /** Short tag on the last point, e.g. "catalog shared". Empty for none. */
  flagged: string;
  [key: string]: unknown;
}

export const clickTrailDefaults: ClickTrailProps = {
  look: "switchback",
  headline: "The clicks climbed first.",
  values: [12, 40, 68, 95, 148],
  months: ["May", "Jun", "Jul", "Aug", "Sep"],
  member: "Sam, climbing guide (sample)",
  flagged: "catalog shared",
};

const GROUND = { switchback: grounds.bark, ledger: grounds.cream, summit: grounds.sage } as const;
const KICKER = { switchback: "ONE MEMBER, FIVE MONTHS", ledger: "ONE MEMBER, MONTH BY MONTH", summit: "CLICKS THIS MONTH" };

const ease = Easing.bezier(0.2, 0.7, 0.1, 1);

function useBeats(n: number) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const start = 18;
  const span = Math.max(1, durationInFrames - start - 40);
  const step = span / n;
  // progress of point i, 0..1
  return Array.from({ length: n }, (_, i) =>
    interpolate(frame, [start + i * step, start + i * step + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    }),
  );
}

function Lockup({ color }: { color: string }) {
  return (
    <div style={{ position: "absolute", top: SAFE.bottom - 70, left: SAFE.left, display: "flex", alignItems: "center", gap: 14 }}>
      <svg width="46" height="32" viewBox="0 0 46 32" aria-hidden>
        <polygon points="0,32 23,2 23,32" fill={brand.sage} />
        <polygon points="23,32 23,2 46,32" fill={brand.amber} />
      </svg>
      <span style={{ fontFamily: fonts.display, fontSize: 40, color, letterSpacing: -0.5 }}>gearbook</span>
    </div>
  );
}

function Header({ look, headline, fg, muted }: { look: TrailLook; headline: string; fg: string; muted: string }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 14], [24, 0], { extrapolateRight: "clamp", easing: ease });
  return (
    <div style={{ position: "absolute", top: SAFE.top, left: SAFE.left, width: SAFE.right - SAFE.left, opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: fonts.label, fontSize: 26, letterSpacing: 6, color: muted }}>{KICKER[look]}</div>
      {look !== "summit" && (
        <div style={{ fontFamily: fonts.display, fontSize: 84, lineHeight: 1.02, color: fg, marginTop: 22 }}>{headline}</div>
      )}
    </div>
  );
}

function Switchback(p: ClickTrailProps) {
  const g = grounds.bark;
  const beats = useBeats(p.values.length);
  const max = Math.max(...p.values);
  const x0 = SAFE.left + 40, x1 = SAFE.right - 40, y0 = 1240, y1 = 640;
  const pts = p.values.map((v, i) => ({
    x: x0 + ((x1 - x0) * i) / Math.max(1, p.values.length - 1),
    y: y0 - ((y0 - y1) * v) / max,
  }));
  const last = pts.length - 1;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0} x2={x1} y1={y0 + 60} y2={y0 + 60} stroke={g.muted} strokeOpacity={0.4} strokeWidth={2} />
        {pts.slice(1).map((pt, i) => {
          const a = pts[i];
          const t = beats[i + 1];
          return (
            <line key={i} x1={a.x} y1={a.y} x2={a.x + (pt.x - a.x) * t} y2={a.y + (pt.y - a.y) * t}
              stroke={g.line} strokeWidth={5} strokeDasharray="2 16" strokeLinecap="round" />
          );
        })}
        {pts.map((pt, i) => (
          <g key={i} opacity={beats[i]}>
            {i === last && <circle cx={pt.x} cy={pt.y} r={34 * beats[i]} fill={brand.amber} opacity={0.25} />}
            <circle cx={pt.x} cy={pt.y} r={i === last ? 16 : 11} fill={i === last ? brand.amber : g.bg} stroke={i === last ? brand.amber : g.line} strokeWidth={4} />
            <text x={pt.x} y={pt.y - 34} textAnchor="middle" fontFamily={fonts.display} fontSize={42} fill={i === last ? brand.amber : g.fg}>{p.values[i]}</text>
            <text x={pt.x} y={y0 + 92} textAnchor="middle" fontFamily={fonts.label} fontSize={26} letterSpacing={3} fill={g.muted}>{p.months[i]?.toUpperCase()}</text>
          </g>
        ))}
        {p.flagged && (
          <text x={pts[last].x - 30} y={pts[last].y + 66} textAnchor="end" fontFamily={fonts.label} fontSize={28} letterSpacing={2} fill={brand.amber} opacity={beats[last]}>
            [ {p.flagged} ]
          </text>
        )}
      </svg>
      <div style={{ position: "absolute", top: 1392, left: SAFE.left, fontFamily: fonts.body, fontSize: 30, color: g.muted }}>{p.member}</div>
    </>
  );
}

function Ledger(p: ClickTrailProps) {
  const g = grounds.cream;
  const beats = useBeats(p.values.length);
  const max = Math.max(...p.values);
  const last = p.values.length - 1;
  return (
    <div style={{ position: "absolute", top: 640, left: SAFE.left, width: SAFE.right - SAFE.left }}>
      {p.values.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, height: 118, borderTop: `2px solid ${g.line}22`, opacity: 0.25 + 0.75 * beats[i] }}>
          <div style={{ width: 120, fontFamily: fonts.label, fontSize: 28, letterSpacing: 3, color: g.muted }}>{p.months[i]?.toUpperCase()}</div>
          <div style={{ flex: 1, height: 14, background: `${g.line}14`, borderRadius: 8 }}>
            <div style={{ width: `${(100 * v * beats[i]) / max}%`, height: "100%", borderRadius: 8, background: i === last ? brand.sage : brand.bark }} />
          </div>
          <div style={{ width: 120, textAlign: "right", fontFamily: fonts.display, fontSize: 52, color: i === last ? brand.sageDark : g.fg }}>
            {Math.round(v * beats[i])}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 40, fontFamily: fonts.body, fontSize: 30, color: g.muted }}>{p.member}</div>
    </div>
  );
}

function Summit(p: ClickTrailProps) {
  const g = grounds.sage;
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const beats = useBeats(p.values.length);
  const last = p.values.length - 1;
  const n = interpolate(frame, [10, durationInFrames - 40], [p.values[0], p.values[last]], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const max = Math.max(...p.values);
  const x0 = SAFE.left + 20, x1 = SAFE.right - 20, y0 = 1330, y1 = 1130;
  const pts = p.values.map((v, i) => ({ x: x0 + ((x1 - x0) * i) / Math.max(1, last), y: y0 - ((y0 - y1) * v) / max }));
  return (
    <>
      <div style={{ position: "absolute", top: 330, left: SAFE.left, fontFamily: fonts.display, fontSize: 380, lineHeight: 1, color: g.fg, letterSpacing: -12 }}>
        {Math.round(n)}
      </div>
      <div style={{ position: "absolute", top: 760, left: SAFE.left, width: 700, fontFamily: fonts.body, fontSize: 36, color: g.fg }}>
        {p.months[last]} clicks, up from {p.values[0]} in {p.months[0]}.
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {pts.map((pt, i) => (
          <g key={i} opacity={beats[i]}>
            {i > 0 && <line x1={pts[i - 1].x} y1={pts[i - 1].y} x2={pt.x} y2={pt.y} stroke={g.line} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />}
            <circle cx={pt.x} cy={pt.y} r={i === last ? 15 : 9} fill={i === last ? brand.cream : g.line} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", top: 1380, left: SAFE.left, fontFamily: fonts.body, fontSize: 28, color: g.muted }}>{p.member}</div>
    </>
  );
}

export const ClickTrail: React.FC<ClickTrailProps> = (props) => {
  const p = { ...clickTrailDefaults, ...props };
  const g = GROUND[p.look];
  return (
    <AbsoluteFill style={{ background: g.bg, overflow: "hidden" }}>
      <Header look={p.look} headline={p.headline} fg={g.fg} muted={g.muted} />
      {p.look === "switchback" && <Switchback {...p} />}
      {p.look === "ledger" && <Ledger {...p} />}
      {p.look === "summit" && <Summit {...p} />}
      <Lockup color={g.fg} />
    </AbsoluteFill>
  );
};

export const CLICK_TRAIL = { width: 1080, height: 1920, fps: 30, durationInFrames: 150 } as const;
