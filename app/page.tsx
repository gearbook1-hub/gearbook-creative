import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { IdeaCards, type IdeaCardData } from "@/components/IdeaCards";
import { Footer, ModsNav } from "@/components/ModsNav";
import { PieceTile } from "@/components/PieceTile";
import { Section } from "@/components/Section";
import { StillCard } from "@/components/StillCard";
import { TrailPlayer, TrailStill } from "@/components/Trail";
import { SOURCE_KINDS, ideas, ideasFrom, livePieces, piece, plural, source, sourceLabel, stats } from "@/lib/data";
import type { Idea } from "@/lib/types";
import type { TrailLook } from "@/remotion/ClickTrail";

// 11 Motion Breakdown: "How the motion mod thinks". One scrolling page that walks the loop
// top to bottom, section for section as in the reel (docs/VIDEO_SPEC.md §4).

const LOOK_BY_LETTER: Record<string, TrailLook> = { A: "switchback", B: "ledger", C: "summit" };
const RENDER_FRAMES = [30, 90, 140];

function statusLine(i: Idea) {
  switch (i.status) {
    case "built": return { text: `built (${i.builtAs})`, built: true };
    case "waiting": return { text: `waiting on ${i.waitingOn}`, built: false };
    case "pitched": return { text: "pitched, on Pulse", built: false };
    case "passed": return { text: "passed", built: false };
    default: return { text: i.status, built: false };
  }
}

export default function MotionBreakdown() {
  const s = stats();
  // The walkthrough idea: the reel follows one idea from transcript to library. Ours is the
  // first built idea that went through stills and has a render check.
  const hero = ideas.find((i) => i.status === "built" && i.renderCheck && i.stills)!;
  const heroSource = source(hero.sourceId)!;
  const heroPiece = piece(hero.builtAs!)!;
  const withStills = ideas.filter((i) => i.stills?.length);
  const pitched: IdeaCardData[] = ideas
    .filter((i) => i.status === "pitched")
    .map((i) => ({
      id: i.id,
      name: i.name,
      date: i.pitchedOn,
      pitch: i.pitch,
      evidence: `${source(i.sourceId)?.title}${i.at ? ` ${i.at}` : ""} · "${i.quote}"`,
      why: [...i.catalogCheck.map((c) => `${c.piece} ${piece(c.piece)?.name}: ${c.verdict}`), `So: ${i.whyNew}`],
    }));

  return (
    <>
      <header className="band">
        <div className="wrap">
          <ModsNav current="/" />
          <h1 className="title">How the motion mod <em>thinks</em></h1>
          <div className="stats">
            <div><CountUp className="stat-value signal" value={s.pieces} /><div className="stat-label">Pieces in the library</div></div>
            <div><CountUp className="stat-value" value={s.finishedFiles} /><div className="stat-label">Finished files, every format</div></div>
            <div><CountUp className="stat-value" value={s.ideasPitched} /><div className="stat-label">Ideas pitched</div></div>
            <div><CountUp className="stat-value" value={s.builtWithoutPick} /><div className="stat-label">Built without my pick</div></div>
          </div>
        </div>
      </header>

      <main className="wrap">
        <Section num="01" title="Where ideas come from">
          <div className="cards2">
            {SOURCE_KINDS.map(({ kind, title }) => (
              <Link key={kind} href={`/video-inbox#${kind}`} className="card glow">
                <div className="card-title">{title}</div>
                <div className="card-meta">{plural(ideasFrom(kind).length, "idea")}</div>
              </Link>
            ))}
          </div>
        </Section>

        <Section num="02" title="What it already has">
          <div className="tiles">
            {livePieces.map((p) => (
              <Link key={p.id} href={`/library#${p.id}`} className="tile">
                <div className="tile-frame"><PieceTile kind={p.preview} ground={p.ground} label={`${p.id} ${p.name}`} /></div>
                <div className="tile-label">{p.id} {p.name}</div>
              </Link>
            ))}
          </div>
        </Section>

        <Section num="03" title="It reads every transcript">
          <div className="split">
            <div>
              <div className="tile-frame" style={{ background: "linear-gradient(160deg,#4c5a3f,#2c3324 55%,#5d6b52)", position: "relative" }}>
                <div style={{ position: "absolute", inset: "auto 0 0 0", padding: "14px", background: "linear-gradient(transparent, rgba(14,12,8,.85))" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{heroSource.title}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-muted)", marginTop: 4 }}>▶ {hero.at} · {heroSource.date}</div>
                </div>
              </div>
              <p className="caption">The {heroSource.shortName}</p>
            </div>
            <div>
              <div className="panel">
                <p><span className="k">transcript</span><br />&quot;{hero.quote}&quot;</p>
                <p>
                  <span className="k">checked against the catalog</span><br />
                  {hero.catalogCheck.map((c) => (
                    <span key={c.piece}><span className="k">{c.piece} {piece(c.piece)?.name}</span>&nbsp;&nbsp;{c.verdict}<br /></span>
                  ))}
                  <mark>{hero.whyNew}</mark>
                </p>
              </div>
              <span className="flag">FLAGGED</span>
            </div>
          </div>
        </Section>

        <Section num="04" title="The idea log">
          <div className="log">
            {ideas.map((i) => {
              const st = statusLine(i);
              return (
                <div className="log-row" key={i.id}>
                  <span className="name">{i.name}</span>
                  <span className="src">{sourceLabel(i)}</span>
                  <span className={`status${st.built ? " built" : ""}`}>{st.text}</span>
                </div>
              );
            })}
          </div>
        </Section>

        <Section num="05" title="Approve or pass">
          <IdeaCards cards={pitched} />
          <p className="caption">New ideas on my <Link href="/pulse">Pulse</Link></p>
        </Section>

        <Section num="06" title="Stills before motion">
          <div className="stack">
            {withStills.map((i) => (
              <div key={i.id}>
                <div className="paper-frame">
                  <div className="triptych">
                    {i.stills!.map((st) => (
                      <div key={st.letter}>
                        {i.id === hero.id ? (
                          <div className="still"><TrailStill look={LOOK_BY_LETTER[st.letter]} /></div>
                        ) : (
                          <StillCard still={st} idea={i.name} />
                        )}
                        <div className="still-label"><b>{st.letter}</b>{st.name}{i.pickedLetters?.includes(st.letter) ? " · picked" : ""}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="caption">{i.name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section num="07" title="Built in code">
          <div className="panel">
            <p><span className="k">the build</span><br />{heroPiece.id} {heroPiece.name}. One member&apos;s number across N months.</p>
            <p className="hl">
              Luke picked {hero.pickedLetters!.length === 3 ? "A" : hero.pickedLetters![0]} ({hero.stills![0].name}) and asked for all three,<br />
              so one engine renders three looks.
            </p>
            <p><span className="k">Luke&apos;s note:</span> <mark>{hero.note}</mark></p>
            <p><span className="k">variables</span>&nbsp;&nbsp;{heroPiece.variables.join(" · ")}</p>
          </div>
        </Section>

        <Section num="08" title="It checks its own render">
          <div className="triptych" style={{ background: "var(--panel)", border: "1px solid var(--panel-line)", gap: 0 }}>
            {RENDER_FRAMES.map((f, n) => {
              const check = hero.renderCheck![n];
              return (
                <div key={f} className="still" style={{ borderRight: n < 2 ? "1px solid var(--panel-line)" : 0 }}>
                  <TrailStill look="switchback" frame={f} />
                  <span className="ts">{check.t}</span>
                  <span className={`check-badge${check.pass ? "" : " fail"}`} style={{ animationDelay: `${0.4 + n * 0.5}s` }} title={check.note}>
                    {check.pass ? "✓" : "!"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="caption">Frames pulled from the render before it&apos;s delivered (npm run render:check)</p>
        </Section>

        <Section num="09" title="Three looks, one engine">
          <div className="triptych">
            {(["switchback", "ledger", "summit"] as const).map((look) => (
              <div key={look}>
                <div className="still"><TrailPlayer look={look} /></div>
                <div className="dark-label">{look[0].toUpperCase() + look.slice(1)}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section num="10" title="Into the library">
          <Link href="/library" className="gallery-btn">Open the gallery</Link>
        </Section>

        <Section num="11" title="The loop">
          <div className="loop">
            {["Video, inspo or a request", "Check the catalog", "Log the idea", "Approve or pass", "3 stills", "Pick one", "Build in code", "Check the render", "Into the library"].map((step, n, all) => (
              <span key={step} style={{ display: "contents" }}>
                <span className={`step${step === "Approve or pass" || step === "Pick one" ? " gate" : ""}`}>{step}</span>
                {n < all.length - 1 && <span className="arrow" aria-hidden>→</span>}
              </span>
            ))}
          </div>
        </Section>

        <Section num="12" title="Any library">
          <div className="cards2">
            {[
              { t: "Motion graphics", m: "Mine" },
              { t: "Sales decks", m: "" },
              { t: "Email templates", m: "" },
              { t: "Ad creative", m: "" },
              { t: "Proposals", m: "" },
            ].map((c) => (
              <Link key={c.t} href="/find-your-mods" className="card glow" style={{ padding: "22px 26px" }}>
                <div className="card-title">{c.t}</div>
                {c.m && <div className="card-meta" style={{ fontSize: 11 }}>{c.m}</div>}
              </Link>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
