import type { Metadata } from "next";
import { Footer } from "@/components/ModsNav";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { ideas, piece, sources } from "@/lib/data";

export const metadata: Metadata = { title: "Video Breakdown - GearBook Creative" };

// 10 Video Breakdown: one video at a time, line by line. What was said, which library piece
// covered it in the edit, and where the scout flagged a gap.
export default function VideoBreakdown() {
  const videos = sources.filter((s) => s.kind === "video");
  return (
    <>
      <PageHeader
        href="/video-breakdown"
        title="Video"
        accent="Breakdown"
        intro="Each reel, line by line: what was said, what the edit already used from the library, and where the motion mod flagged something missing."
      />
      <main className="wrap">
        {videos.map((v, n) => (
          <Section key={v.id} id={v.id} num={String(n + 1).padStart(2, "0")} title={v.title}>
            <table className="table">
              <thead><tr><th>At</th><th>Line</th><th>Motion</th></tr></thead>
              <tbody>
                {v.transcript.map((l) => {
                  const flagged = ideas.find((i) => i.sourceId === v.id && i.at === l.t);
                  return (
                    <tr key={l.t + l.text}>
                      <td>{l.t}</td>
                      <td style={{ color: "var(--ink)" }}>{l.text}</td>
                      <td className={flagged ? "hl" : undefined}>
                        {flagged ? `${flagged.name}: ${flagged.builtAs ?? flagged.status}` : "none needed"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="caption">
              Library pieces in the edit: {v.usedPieces.map((id) => `${id} ${piece(id)?.name}`).join(", ") || "none"}
              {v.sample ? " · sample transcript" : ""}
            </p>
          </Section>
        ))}
      </main>
      <Footer />
    </>
  );
}
