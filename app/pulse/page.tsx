import type { Metadata } from "next";
import { IdeaCards, type IdeaCardData } from "@/components/IdeaCards";
import { Footer } from "@/components/ModsNav";
import { PageHeader } from "@/components/PageHeader";
import { DecisionsExport } from "@/components/PulseBoard";
import { Section } from "@/components/Section";
import { ideas, piece, source, sourceLabel } from "@/lib/data";

export const metadata: Metadata = { title: "Pulse - GearBook Creative" };

// 04 Pulse: where every mod's pitches land. Approve or pass is the first human gate;
// "Pick one" (after the 3 stills) is the second.
export default function Pulse() {
  const pitched = ideas.filter((i) => i.status === "pitched");
  const cards: IdeaCardData[] = pitched.map((i) => ({
    id: i.id, name: i.name, date: i.pitchedOn, pitch: i.pitch,
    evidence: `${source(i.sourceId)?.title}${i.at ? ` ${i.at}` : ""} · "${i.quote}"`,
    why: [...i.catalogCheck.map((c) => `${c.piece} ${piece(c.piece)?.name}: ${c.verdict}`), `So: ${i.whyNew}`],
  }));
  const later = ideas.filter((i) => i.status !== "pitched");

  return (
    <>
      <PageHeader href="/pulse" title="Pulse" intro="New pitches from every mod. Approve or pass; add a note if it needs one. Nothing is built until you've picked a still." />
      <main className="wrap">
        <Section num="01" title="New ideas">
          <IdeaCards cards={cards} />
          <DecisionsExport ids={pitched.map((i) => i.id)} />
        </Section>
        <Section num="02" title="Everything decided">
          <table className="table">
            <thead><tr><th>Idea</th><th>From</th><th>Status</th><th>Pitched</th></tr></thead>
            <tbody>
              {later.map((i) => (
                <tr key={i.id}>
                  <td className="hl">{i.name}</td>
                  <td>{sourceLabel(i)}</td>
                  <td><span className={`chip${i.status === "built" ? " built" : ""}`}>{i.status === "built" ? `built ${i.builtAs}` : i.status === "waiting" ? `waiting on ${i.waitingOn}` : i.status}</span></td>
                  <td>{i.pitchedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </main>
      <Footer />
    </>
  );
}
