import type { Metadata } from "next";
import Link from "next/link";
import { Footer, ModsNav } from "@/components/ModsNav";
import { PieceTile } from "@/components/PieceTile";
import { PieceFrame, PieceVideo } from "@/components/PieceFrame";
import { brand } from "@/lib/brand";
import { ideas, livePieces, piece, pieces } from "@/lib/data";

export const metadata: Metadata = { title: "Motion Library - GearBook Creative" };

// 07 Motion Library: the gallery behind "Open the gallery". Every piece the scout checks
// against, with its looks, formats and variables (docs/VIDEO_SPEC.md §5).

const SWATCHES = [
  { name: "BARK", hex: brand.bark, fg: brand.cream },
  { name: "AMBER", hex: brand.amber, fg: brand.bark },
  { name: "SAGE", hex: brand.sage, fg: brand.bark },
  { name: "CREAM", hex: brand.cream, fg: brand.bark },
];

const label = { fontFamily: "var(--font-label)", fontSize: 13, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "var(--ink-muted)" };
const h2 = { fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(30px, 5vw, 44px)", margin: "8px 0 14px", lineHeight: 1.05 };
const body = { fontSize: 17, lineHeight: 1.6, color: "var(--ink-muted)", maxWidth: 660, margin: 0 };

export default function Library() {
  const reel = piece("M25")!;
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  return (
    <>
      <header className="band" style={{ paddingBottom: 56 }}>
        <div className="wrap">
          <ModsNav current="/library" />
          <div style={label}>GearBook</div>
          <h1 className="title" style={{ fontSize: "clamp(48px, 9vw, 96px)" }}>
            Motion<span style={{ color: "var(--signal)" }}>\</span>Library
          </h1>
          <div style={{ ...label, marginTop: 22, lineHeight: 2 }}>
            Vol. 01 · V1<br />{date}<br />{livePieces.length} pieces · 1 reel
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="section">
          <div style={label}>The reel · 28s · 9:16</div>
          <h2 style={h2}>Get your free catalog</h2>
          <p style={body}>The signup explainer Matt had Claude build as one animated page and record at 60 fps. No footage, no editing app. It set the house style the library follows: cream and topo ground, Roca titles that arrive word by word, small tracked labels.</p>
          <div style={{ width: "min(320px, 70%)", aspectRatio: "9 / 16", marginTop: 24, border: "1px solid var(--card-line)" }}><PieceVideo src={reel.video!} title="Signup explainer" /></div>
          <p className="caption">Master: {reel.master}</p>
        </section>

        <section className="section">
          <div style={label}>Palette in motion</div>
          <h2 style={h2}>Four grounds, one loud colour</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {SWATCHES.map((s) => (
              <div key={s.name} style={{ background: s.hex, aspectRatio: "1 / 1.1", border: "1px solid var(--card-line)", padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", color: s.fg, fontFamily: "var(--font-label)", fontWeight: 600, letterSpacing: "0.12em", fontSize: 13 }}>
                {s.name}<br />{s.hex}
              </div>
            ))}
          </div>
          <p style={{ ...body, marginTop: 16 }}>Amber is the signal: the one thing found, traced or lit. Slate only ever sits on links and buttons. On sage, data lines and pills go bark.</p>
        </section>

        <section className="section">
          <div style={label}>Motion voice</div>
          <h2 style={h2}>Grounded, practical, earned</h2>
          {[{ n: "Arrive", e: "cubic-bezier(.2,.7,.1,1)" }, { n: "Travel", e: "cubic-bezier(.45,0,.2,1)" }].map((m) => (
            <div key={m.n} style={{ display: "flex", alignItems: "center", gap: 18, margin: "14px 0" }}>
              <span style={{ ...label, width: 80, color: "var(--ink)" }}>{m.n}</span>
              <span className="ease-track"><span className="ease-dot" style={{ animationTimingFunction: m.e }} /></span>
            </div>
          ))}
          <p style={{ ...body, marginTop: 10 }}>Things arrive fast and settle; nothing bounces. Moves take the trail, not the straight line. Data only moves when the voice gets to it.</p>
        </section>

        {livePieces.map((p) => {
          const idea = ideas.find((i) => i.builtAs === p.id);
          return (
            <section className="section" id={p.id} key={p.id} style={{ scrollMarginTop: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--signal)" }}>{p.id} · v{p.version}</div>
              <h2 style={h2}>{p.name}</h2>
              <p style={body}>{p.description}</p>
              <div className="triptych" style={{ marginTop: 22, gridTemplateColumns: `repeat(${Math.max(3, p.variants.length)}, 1fr)` }}>
                {p.variants.map((v) => (
                  <div key={v.label}>
                    <div className="tile-frame">
                      {p.html ? <PieceFrame piece={p.html} look={v.look} title={`${p.name} ${v.label}`} />
                        : p.video ? <PieceVideo src={p.video} title={`${p.name} ${v.label}`} />
                        : <PieceTile kind={p.preview} ground={v.ground} label={`${p.name} ${v.label}`} />}
                    </div>
                    <div style={{ ...label, fontSize: 11, marginTop: 8 }}>{v.label}</div>
                  </div>
                ))}
              </div>
              <p className="caption">
                {p.formats.join(" · ")} · variables: {p.variables.length ? p.variables.join(", ") : "none"}
                {idea && <> · from <Link href="/">{idea.name}</Link> ({idea.id})</>}
                {p.html && <> · built in code: public/pieces/{p.html}/index.html</>}
                {p.master && <> · master in {p.master}</>}
                {p.sample && " · sample entry"}
              </p>
            </section>
          );
        })}

        <section className="section">
          <div style={label}>Retired</div>
          <p style={{ ...body, marginTop: 10 }}>
            {pieces.filter((p) => p.status === "retired").map((p) => `${p.id} ${p.name}: ${p.description}`).join(" ")}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
