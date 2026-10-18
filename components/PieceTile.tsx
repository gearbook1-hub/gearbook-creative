import { brand, grounds } from "@/lib/brand";
import type { Ground, PreviewKind } from "@/lib/types";

// A live, looping preview for a library piece. These are lightweight SVG stand-ins so the grid
// moves like the reel's does; the real piece is whatever is in the library (a Remotion
// composition for M18, renders for the rest once they exist).

const DUR = "4s";

function Anim({ attr, values, dur = DUR, begin = "0s", keyTimes }: { attr: string; values: string; dur?: string; begin?: string; keyTimes?: string }) {
  return <animate attributeName={attr} values={values} dur={dur} begin={begin} repeatCount="indefinite" keyTimes={keyTimes} />;
}

export function PieceTile({ kind, ground, label }: { kind: PreviewKind; ground: Ground; label?: string }) {
  const g = grounds[ground];
  const fg = g.fg;
  const acc = g.accent;
  const body = (() => {
    switch (kind) {
      case "signal":
        return (
          <g>
            <line x1="10" x2="80" y1="92" y2="92" stroke={fg} strokeOpacity=".35" strokeWidth=".6" />
            <polygon points="30,92 45,66 45,92" fill={brand.sage}><Anim attr="opacity" values="0;1;1;0" keyTimes="0;.25;.85;1" /></polygon>
            <polygon points="45,92 45,66 60,92" fill={brand.amber}><Anim attr="opacity" values="0;0;1;1;0" keyTimes="0;.15;.35;.85;1" /></polygon>
            <text x="45" y="108" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fill={fg}>gearbook<Anim attr="opacity" values="0;0;1;1;0" keyTimes="0;.4;.55;.85;1" /></text>
          </g>
        );
      case "transition":
        return (
          <g>
            <rect x="-90" y="0" width="90" height="160" fill={brand.amber}><Anim attr="x" values="-90;90" dur="2.4s" /></rect>
            <polyline points="0,110 20,84 34,98 52,70 70,92 90,78" fill="none" stroke={fg} strokeWidth="1.2" />
          </g>
        );
      case "ring":
        return (
          <g fill="none" stroke={fg} strokeWidth="1.2">
            {[34, 28, 22, 16].map((r, i) => (
              <circle key={r} cx="45" cy="70" r={r} strokeDasharray={`${2 * Math.PI * r}`} strokeDashoffset={`${2 * Math.PI * r}`} transform="rotate(-90 45 70)">
                <Anim attr="stroke-dashoffset" values={`${2 * Math.PI * r};${2 * Math.PI * r * (0.08 + i * 0.07)};${2 * Math.PI * r * (0.08 + i * 0.07)}`} keyTimes="0;.6;1" />
              </circle>
            ))}
            <text x="45" y="74" textAnchor="middle" stroke="none" fill={fg} fontFamily="var(--font-display)" fontSize="11">86</text>
          </g>
        );
      case "dots":
        return (
          <g fill={fg}>
            {Array.from({ length: 48 }, (_, i) => {
              const x = 18 + (i % 6) * 11, y = 40 + Math.floor(i / 6) * 11;
              return <circle key={i} cx={x} cy={y} r={1.4 + ((i * 7) % 5) / 4}><Anim attr="opacity" values="0;1;1;0" keyTimes={`0;${(0.1 + (i % 9) / 20).toFixed(2)};.85;1`} /></circle>;
            })}
          </g>
        );
      case "wave":
        return (
          <g fill="none" stroke={fg} strokeWidth=".7">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path key={i} d={`M0 ${50 + i * 8} Q 22 ${40 + i * 8 + (i % 2) * 14} 45 ${50 + i * 8} T 90 ${50 + i * 8}`} strokeOpacity={i === 3 ? 1 : 0.35} stroke={i === 3 ? acc : fg}>
                <animateTransform attributeName="transform" type="translate" values="0 0;-6 0;0 0" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
              </path>
            ))}
          </g>
        );
      case "statement":
        return (
          <g fontFamily="var(--font-display)" fill={fg} fontSize="13">
            <text x="10" y="70">Get</text>
            <text x="10" y="88">[<tspan fill={acc === fg ? brand.bark : acc}>stoked</tspan>]<Anim attr="opacity" values="0;0;1;1" keyTimes="0;.3;.4;1" /></text>
          </g>
        );
      case "name":
        return (
          <g>
            <rect x="0" y="0" width="90" height="160" fill="url(#footage)" />
            <rect x="10" y="112" width="0" height=".8" fill={brand.amber}><Anim attr="width" values="0;56;56" keyTimes="0;.35;1" /></rect>
            <text x="10" y="106" fontFamily="var(--font-display)" fontSize="8" fill={brand.cream}>Luke Wong</text>
            <text x="10" y="121" fontFamily="var(--font-label)" fontSize="5" letterSpacing=".6" fill={brand.cream} opacity=".8">FOUNDER, GEARBOOK</text>
          </g>
        );
      case "number":
        return (
          <g>
            <text x="12" y="80" fontFamily="var(--font-display)" fontSize="30" fill={fg}>148<Anim attr="opacity" values="0;1;1;0" keyTimes="0;.2;.85;1" /></text>
            <rect x="12" y="92" width="58" height="5" fill={acc} opacity=".85"><Anim attr="width" values="0;58;58" keyTimes="0;.4;1" /></rect>
          </g>
        );
      case "flow":
      case "relay":
        return (
          <g>
            <line x1="12" x2="78" y1="80" y2="80" stroke={fg} strokeOpacity=".5" strokeWidth=".6" />
            {[12, 34, 56, 78].map((x, i) => (
              <circle key={x} cx={x} cy="80" r="3" fill={g.bg} stroke={fg} strokeWidth=".8">
                <Anim attr="fill" values={`${g.bg};${g.bg};${acc};${acc}`} keyTimes={`0;${(0.15 + i * 0.2).toFixed(2)};${(0.18 + i * 0.2).toFixed(2)};1`} />
              </circle>
            ))}
            {kind === "relay" && <circle cx="12" cy="80" r="1.8" fill={brand.amber}><Anim attr="cx" values="12;78;78" keyTimes="0;.8;1" /></circle>}
            {["Pick", "Link", "Share", "Paid"].map((t, i) => (
              <text key={t} x={12 + i * 22} y="94" textAnchor="middle" fontFamily="var(--font-label)" fontSize="4.6" fill={fg} opacity=".8">{kind === "relay" ? ["Rec", "Edit", "Motion", "OK"][i] : t}</text>
            ))}
          </g>
        );
      case "compare":
        return (
          <g fontFamily="var(--font-display)" fill={fg}>
            <text x="45" y="80" textAnchor="middle" fontSize="26">12<Anim attr="opacity" values="1;1;0;0;1" keyTimes="0;.4;.5;.9;1" /></text>
            <text x="45" y="80" textAnchor="middle" fontSize="26" fill={acc}>148<Anim attr="opacity" values="0;0;1;1;0" keyTimes="0;.4;.5;.9;1" /></text>
          </g>
        );
      case "opener":
        return (
          <g>
            <rect x="25" y="52" width="40" height="22" rx="2" fill="none" stroke={fg} strokeWidth=".8" />
            <text x="45" y="66" textAnchor="middle" fontFamily="var(--font-label)" fontSize="5" fill={fg}>PARTNER</text>
            <text x="45" y="92" textAnchor="middle" fontFamily="var(--font-display)" fontSize="7" fill={fg}>Partner Showcase<Anim attr="opacity" values="0;0;1;1" keyTimes="0;.3;.45;1" /></text>
          </g>
        );
      case "pop":
        return (
          <g>
            {[[16, 50, brand.sage], [48, 62, brand.amber], [26, 92, brand.slate]].map(([x, y, c], i) => (
              <rect key={i} x={x as number} y={y as number} width="26" height="26" rx="4" fill={c as string}>
                <animateTransform attributeName="transform" type="scale" additive="sum" values="0.6;1;1" keyTimes={`0;${0.2 + i * 0.15};1`} dur={DUR} repeatCount="indefinite" />
                <Anim attr="opacity" values="0;1;1;0" keyTimes={`0;${(0.15 + i * 0.15).toFixed(2)};.9;1`} />
              </rect>
            ))}
          </g>
        );
      case "topo":
        return (
          <g fill="none" stroke={fg} strokeOpacity=".5" strokeWidth=".6">
            {[10, 18, 26, 34, 42, 50].map((r) => <ellipse key={r} cx="45" cy="80" rx={r} ry={r * 0.72} />)}
            <animateTransform attributeName="transform" type="rotate" values="0 45 80;360 45 80" dur="30s" repeatCount="indefinite" />
          </g>
        );
      case "bars":
        return (
          <g>
            {[brand.bark, brand.sage, brand.amber, brand.cream, brand.slate].map((c, i) => (
              <rect key={c} x="0" y={50 + i * 12} width="90" height="12" fill={c}>
                <Anim attr="x" values={`-90;0;0;90`} keyTimes={`0;${(0.1 + i * 0.06).toFixed(2)};.8;1`} />
              </rect>
            ))}
          </g>
        );
      case "quiet":
        return (
          <g>
            <rect width="90" height="160" fill="url(#footage)" opacity=".7" />
            <text x="45" y="84" textAnchor="middle" fontFamily="var(--font-display)" fontSize="6" fill={brand.cream}>Then it got quiet.<Anim attr="opacity" values="0;1;1;0" keyTimes="0;.4;.85;1" /></text>
          </g>
        );
      case "trail":
        return (
          <g>
            <polyline points="14,112 30,96 46,88 62,72 76,46" fill="none" stroke={fg} strokeWidth="1" strokeDasharray="0.6 3" strokeLinecap="round" />
            {[[14, 112], [30, 96], [46, 88], [62, 72]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.8" fill={fg} />)}
            <circle cx="76" cy="46" r="3" fill={brand.amber}><Anim attr="r" values="2;3.6;2" dur="1.6s" /></circle>
          </g>
        );
      case "map":
        return (
          <g>
            <path d="M12 70 L30 58 L60 60 L78 70 L76 92 L58 100 L34 98 L16 88 Z" fill="none" stroke={fg} strokeOpacity=".5" strokeWidth=".7" />
            {[[24, 72], [40, 66], [56, 70], [66, 82], [36, 86], [50, 92], [28, 82]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" fill={brand.sage}><Anim attr="opacity" values="0;1;1;0" keyTimes={`0;${(0.1 + i * 0.09).toFixed(2)};.85;1`} /></circle>
            ))}
          </g>
        );
      case "load":
      case "tally":
        return (
          <g>
            {(kind === "load" ? [44, 30, 22, 16] : [60, 22]).map((w, i) => (
              <rect key={i} x="12" y={64 + i * 12} height="6" rx="2" fill={i === 0 ? fg : acc} width={w}>
                <Anim attr="width" values={kind === "load" ? `${w};${w * (i === 0 ? 0.7 : 1)};${w}` : `0;${w};${w}`} keyTimes="0;.6;1" />
              </rect>
            ))}
          </g>
        );
      case "sweep":
        return (
          <g fontFamily="var(--font-display)" fontSize="8" fill={fg}>
            <rect x="10" y="70" height="10" fill={brand.sage} opacity=".55"><Anim attr="width" values="0;70;70" keyTimes="0;.5;1" /></rect>
            <text x="12" y="78">the gear I actually</text>
            <text x="12" y="90">use, every trip</text>
          </g>
        );
      case "path":
        return (
          <g>
            <path d="M16 118 Q 30 60 74 44" fill="none" stroke={fg} strokeWidth=".9" strokeDasharray="1 3" />
            <circle r="2.6" fill={brand.amber}>
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M16 118 Q 30 60 74 44" />
            </circle>
          </g>
        );
      case "retired":
        return <text x="45" y="84" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill={fg} opacity=".7">RETIRED</text>;
    }
  })();

  return (
    <svg viewBox="0 0 90 160" width="100%" height="100%" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice" style={{ display: "block", background: g.bg }}>
      <defs>
        <linearGradient id="footage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4c5a3f" />
          <stop offset=".5" stopColor="#2c3324" />
          <stop offset="1" stopColor="#5d6b52" />
        </linearGradient>
      </defs>
      {body}
    </svg>
  );
}
