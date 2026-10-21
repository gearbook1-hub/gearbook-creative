import type { Metadata } from "next";
import Link from "next/link";
import { PieceFrame } from "@/components/PieceFrame";
import { FormatChip, Footer, PageHead, Section, TopBar } from "@/components/Site";
import { cutSeconds, editList, piece, reels } from "@/lib/data";
import film from "@/public/pieces/M25-signup-explainer/film/modules/scenes.json";

export const metadata: Metadata = { title: "Reels · GearBook Creative" };

// Reels: whole reels Claude made, ready to post. Animated ones play live from their code; cut
// ones show the edit list (the video itself stays in Drive). Pack pieces live on /library.

const KIND = { animated: "built in code", cut: "cut from clips" } as const;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Reels() {
  let at = 0;
  const chapters = film.scenes.map((s) => { const c = { t: at, name: s.name }; at += s.dur; return c; });
  // Approved and posted reels come first, each in full. Animated drafts sit side by side in one
  // grid so they're quick to compare and review; other drafts (cuts) follow in full.
  type R = (typeof reels)[number];
  const isDraftGrid = (r: R) => r.kind === "animated" && r.status === "draft" && !!r.html;
  const drafts = reels.filter(isDraftGrid);
  const ready = reels.filter((r) => r.status !== "draft");
  const otherDrafts = reels.filter((r) => r.status === "draft" && !isDraftGrid(r));

  const full = (r: R) => {
    const edit = editList(r.edit);
    const seconds = r.seconds ?? (edit ? cutSeconds(edit) : 0);
    const label = `${r.id} · ${r.status} · ${KIND[r.kind]} · 9:16 · ${seconds.toFixed(0)} s · ${r.madeOn}`;
    let t = 0;
    return (
      <Section key={r.id} label={label} title={r.name} id={r.id}>
        <div className="piece">
          <div>
            {r.html ? (
              <div className="frame"><PieceFrame piece={r.html} title={`${r.name}, playing live`} /></div>
            ) : (
              <div className="frame" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
                <p className="small muted">The cut is a video, so it isn&apos;t in the repo. Watch it in Drive.</p>
              </div>
            )}
            {r.html && <p className="small" style={{ marginTop: 10 }}><a href={`${BASE}/pieces/${r.html}/index.html`} target="_blank" rel="noopener">Full screen →</a></p>}
          </div>
          <div>
            {r.format && <FormatChip k={r.format} />}
            <p className="muted" style={{ marginTop: 12 }}>{r.description}</p>
            {r.html === "M25-signup-explainer" && <div className="chapters">{chapters.map((c) => <span key={c.name}><b>{c.t.toFixed(1)}s</b>{c.name}</span>)}</div>}
            <ul className="bullets small muted" style={{ marginTop: 18 }}>
              <li>{r.made}</li>
              <li>Master: {r.master}.</li>
              {r.pieces.length > 0 && (
                <li>Pieces used: {r.pieces.map((id, n) => (
                  <span key={id}>{n > 0 && ", "}<Link href={`/library#${id}`}>{id} {piece(id)?.name}</Link></span>
                ))}.</li>
              )}
              {r.was && <li>First logged as {r.was} in the motion library; moved here on 2026-10-19. Its files keep the old name.</li>}
            </ul>
            {edit && (
              <details style={{ marginTop: 18 }}>
                <summary className="label" style={{ cursor: "pointer" }}>Shot list · {edit.shots.length} shots, {edit.dropped.length} clips dropped</summary>
                <table className="shots" style={{ marginTop: 12 }}>
                  <thead><tr><th>At</th><th>Shot</th><th>Why this take</th></tr></thead>
                  <tbody>
                    {edit.shots.map((s) => {
                      const start = t; t += s.out - s.in;
                      return <tr key={`${s.clip}-${s.in}`}><td>{start.toFixed(1)}s</td><td>{s.beat}</td><td className="muted">{s.why}</td></tr>;
                    })}
                  </tbody>
                </table>
                <p className="small muted" style={{ marginTop: 10 }}>From <span className="mono">edits/{r.edit}.json</span>.</p>
              </details>
            )}
          </div>
        </div>
      </Section>
    );
  };

  return (
    <>
      <TopBar current="/reels" />
      <main className="wrap">
        <PageHead label="Reels" title="Whole reels" accent="Claude made">
          Finished reels, not parts. Some are built entirely in code, like the signup reel; others are Claude&apos;s cut of clips
          Luke or Matt filmed, with pieces from the <Link href="/library">motion library</Link> laid over them. Masters live in
          Drive, never in the repo.
        </PageHead>

        <p className="label" style={{ marginTop: 8 }}>{ready.length} approved · {drafts.length + otherDrafts.length} in draft</p>
        {ready.map(full)}

        {drafts.length > 0 && (
          <Section label={`Drafts · ${drafts.length} to review`} title="Made by Claude, waiting on you" id="drafts" intro="Each one plays live; open it full screen to watch it bigger. Say what works and what doesn't; the comments go into docs/context/reel-feedback.md so the next ones start closer. Sound is on hold until the new kit is picked: listen and choose on the sound audition page (pieces/sounds/).">
            <div className="grid g3">
              {drafts.map((r) => (
                <div key={r.id} id={r.id}>
                  <div className="frame"><PieceFrame piece={r.html!} title={`${r.name}, playing live`} /></div>
                  <p className="label" style={{ marginTop: 12 }}>{r.id} · {r.seconds} s{r.format && <> · <FormatChip k={r.format} /></>}</p>
                  <h3 className="h3" style={{ fontSize: 22, marginTop: 6 }}>{r.name}</h3>
                  <p className="small muted">{r.description}</p>
                  <p className="small" style={{ marginTop: 8 }}><a href={`${BASE}/pieces/${r.html}/index.html`} target="_blank" rel="noopener">Full screen →</a></p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {otherDrafts.map(full)}

        <Section label="Making one" title="Two ways a reel gets made">
          <div className="grid g2">
            <div className="card">
              <h3 className="h3" style={{ marginTop: 0 }}>Cut from clips</h3>
              <p className="small muted">Drop the clips and the story in a line. Claude picks the takes, cuts, adds graphics from the pack and explains every pick (the <span className="mono">video-cut</span> skill). New graphics still go through the two approvals.</p>
            </div>
            <div className="card">
              <h3 className="h3" style={{ marginTop: 0 }}>Built in code</h3>
              <p className="small muted">The whole reel is one animated page, the way the signup reel was made. It plays here live and <span className="mono">npm run render</span> records the master.</p>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
