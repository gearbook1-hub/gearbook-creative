import type { Metadata } from "next";
import { IdeaCards, type IdeaCardData } from "@/components/IdeaCards";
import { DecisionsExport } from "@/components/PulseBoard";
import { PieceFrame } from "@/components/PieceFrame";
import { Footer, PageHead, Section, TopBar } from "@/components/Site";
import Link from "next/link";
import { ideas, piece, pieces, source } from "@/lib/data";

export const metadata: Metadata = { title: "Motion library · GearBook Creative" };

// The motion library: a pack of graphics any GearBook reel can use, built as animated HTML
// pages. Whole reels live on /reels. Only real pieces are shown; the sample catalog entries in
// data/pieces.json stay there for the scout.

const LOOP = ["A reel comes in", "Check the library", "Pitch what's missing", "Approve or pass", "3 stills", "Pick one", "Build in code", "Check the render", "Into the library"];
const GATES = new Set(["Approve or pass", "Pick one"]);

export default function Library() {
  const trail = piece("M18")!;
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
        <PageHead label="Motion library" title="A pack any reel" accent="can use">
          Graphics, not reels: each piece drops into any GearBook reel, over footage or on its own ground, with new words and
          numbers from the URL. Each is a fully animated HTML page with one clock: it loops here, freezes on any frame for stills,
          and <span className="mono">npm run render</span> records it. Whole reels are on <Link href="/reels">Reels</Link>.
        </PageHead>

        {[piece("M26")!, piece("M27")!, piece("M28")!].map((p) => {
          const idea = ideas.find((i) => i.id === p.builtFrom);
          const picked = new Set(idea?.pickedLetters ?? []);
          // A piece Luke asked for directly has no idea or source behind it.
          const made = idea ? `built for ${source(idea.sourceId)?.title ?? ""}` : "overlay, asked for by Luke";
          return (
            <Section key={p.id} label={`${p.id} · live · 9:16 · ${made}`} title={p.name} id={p.id} intro={p.description}>
              <div className="looks" style={{ maxWidth: 720 }}>
                {p.variants.map((v) => (
                  <div key={v.label}>
                    <div className="frame"><PieceFrame piece={p.html!} look={v.look} title={`${p.name} ${v.label}`} /></div>
                    <p className="frame-cap">{v.label.toLowerCase()}{picked.has(v.label[0]) ? " · picked" : ""}</p>
                  </div>
                ))}
              </div>
            </Section>
          );
        })}

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

        <Section label="How a piece gets made" title="Nothing is built without two yeses" intro="Luke or Matt approves the idea, then picks a still. Claude does the rest.">
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
