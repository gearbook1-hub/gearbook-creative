import type { Metadata } from "next";
import { IdeaCards, type IdeaCardData } from "@/components/IdeaCards";
import { DecisionsExport } from "@/components/PulseBoard";
import { PieceFrame } from "@/components/PieceFrame";
import { Footer, PageHead, Section, TopBar } from "@/components/Site";
import { ideas, piece, pieces, source } from "@/lib/data";
import film from "@/public/pieces/M25-signup-explainer/film/modules/scenes.json";

export const metadata: Metadata = { title: "Motion library · GearBook Creative" };

// The motion library: pieces every edit can reuse, built as animated HTML pages. Only real
// pieces are shown; the sample catalog entries in data/pieces.json stay there for the scout.

const LOOP = ["A reel comes in", "Check the library", "Pitch what's missing", "Approve or pass", "3 stills", "Pick one", "Build in code", "Check the render", "Into the library"];
const GATES = new Set(["Approve or pass", "Pick one"]);

export default function Library() {
  const reel = piece("M25")!;
  const trail = piece("M18")!;
  let at = 0;
  const chapters = film.scenes.map((s) => { const c = { t: at, name: s.name }; at += s.dur; return c; });
  const sampleCount = pieces.filter((p) => p.sample && p.status === "live").length;
  const pitched: IdeaCardData[] = ideas.filter((i) => i.status === "pitched").map((i) => ({
    id: i.id,
    name: i.name,
    date: i.pitchedOn,
    pitch: i.pitch,
    evidence: `${source(i.sourceId)?.title}${i.at ? ` ${i.at}` : ""} · "${i.quote}"`,
    why: [...i.catalogCheck.map((c) => `${c.piece} ${piece(c.piece)?.name}: ${c.verdict}`), `So: ${i.whyNew}`],
  }));

  return (
    <>
      <TopBar current="/library" />
      <main className="wrap">
        <PageHead label="Motion library" title="Pieces every edit" accent="can reuse">
          Each piece is a fully animated HTML page with one clock: it loops here, freezes on any frame for stills, takes new words
          from the URL, and <span className="mono">npm run render</span> records it to a 60 fps MP4. No video editor, no animation framework.
        </PageHead>

        <Section label={`${reel.id} · live · 9:16 · ${at.toFixed(1)} s`} title={reel.name} id={reel.id}>
          <div className="piece">
            <div><div className="frame"><PieceFrame piece={reel.html!} title="M25 Signup Explainer" /></div></div>
            <div>
              <p className="muted">{reel.description}</p>
              <div className="chapters">{chapters.map((c) => <span key={c.name}><b>{c.t.toFixed(1)}s</b>{c.name}</span>)}</div>
              <ul className="bullets small muted" style={{ marginTop: 18 }}>
                <li>Source: the &quot;GearBook Signup Reel&quot; Motion artifact on Matt&apos;s Claude account. Its scenes, styles and images are copied unchanged into <span className="mono">public/pieces/{reel.html}/film/</span>.</li>
                <li>Plays silent here. The MP4 master with sound: {reel.master}.</li>
                <li>Reuse it as the end card for partner showcases and &quot;GearBook in 20 seconds&quot;.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section label={`${trail.id} · demo · sample data`} title={trail.name} id={trail.id} intro="Built from a sample idea to prove the loop: one engine, three looks. The numbers are made up.">
          <div className="looks" style={{ maxWidth: 720 }}>
            {trail.variants.map((v) => (
              <div key={v.label}>
                <div className="frame"><PieceFrame piece={trail.html!} look={v.look} title={`${trail.name} ${v.label}`} /></div>
                <p className="frame-cap">{v.label.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="How a piece gets made" title="Nothing is built without two yeses" intro="Luke approves the idea, then picks a still. Claude does the rest.">
          <div className="loop">
            {LOOP.map((s, i) => (
              <span key={s} style={{ display: "contents" }}>
                <span className={GATES.has(s) ? "gate" : undefined}>{s}</span>
                {i < LOOP.length - 1 && <i aria-hidden>→</i>}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Pitched pieces · sample" title="Approve or pass" id="pitches" intro="Examples until the first real reel goes through the scout. Decisions stay in this browser until applied.">
          <IdeaCards cards={pitched} />
          <DecisionsExport ids={pitched.map((c) => c.id)} />
          <p className="small muted" style={{ marginTop: 16 }}>
            data/pieces.json also holds {sampleCount} sample catalog entries from the first build. They aren&apos;t shown, and they get
            replaced as real pieces land.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
