import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/ModsNav";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SOURCE_KINDS, ideas, sources } from "@/lib/data";

export const metadata: Metadata = { title: "Video Inbox - GearBook Creative" };

// 12 Video Inbox: everything the motion mod reads. Videos Luke records (transcribed with
// Whisper), inspo reels he saves, and things he asks for.
export default function VideoInbox() {
  return (
    <>
      <PageHeader
        href="/video-inbox"
        title="Video"
        accent="Inbox"
        intro="Every source the scout reads. Drop a reel in inbox/videos and run npm run transcribe; save inspo to inbox/inspo; ask for anything as a request. Then npm run scout -- <id>."
      />
      <main className="wrap">
        {SOURCE_KINDS.map(({ kind, title }, n) => (
          <Section key={kind} num={`0${n + 1}`} title={title} id={kind}>
            <div className="log">
              {sources.filter((s) => s.kind === kind).map((s) => {
                const flagged = ideas.filter((i) => i.sourceId === s.id);
                return (
                  <div className="log-row" key={s.id}>
                    <span className="name">{s.id}</span>
                    <span>{s.title}</span> <span className="src">· {s.date}{s.sample ? " · sample" : ""}</span>
                    {s.transcript.length > 0 && (
                      <span className="status">{s.transcript.map((l) => `${l.t ? `[${l.t}] ` : ""}${l.text}`).join("  ")}</span>
                    )}
                    <span className="status built">
                      {flagged.length ? `flagged: ${flagged.map((i) => i.name).join(", ")}` : "nothing flagged"}
                      {s.usedPieces.length > 0 && <> · used {s.usedPieces.join(", ")}</>}
                      {kind === "video" && <> · <Link href={`/video-breakdown#${s.id}`}>breakdown</Link></>}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>
        ))}
      </main>
      <Footer />
    </>
  );
}
