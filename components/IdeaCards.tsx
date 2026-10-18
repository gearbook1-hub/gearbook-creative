"use client";

import { useState } from "react";
import { useDecisions } from "@/lib/decisions";

export interface IdeaCardData {
  id: string;
  name: string;
  date: string;
  pitch: string;
  evidence: string;
  why: string[];
}

// 05 Approve or pass. White idea cards in a cream frame, as in the reel. Approve turns into a
// sage "Approved" pill; nothing gets built until Luke picks a still afterwards.
export function IdeaCards({ cards }: { cards: IdeaCardData[] }) {
  const { decisions, update } = useDecisions();
  const [noteOpen, setNoteOpen] = useState<string | null>(null);

  if (cards.length === 0) {
    return <p className="caption">No new pitches. The scout logs them here as it reads new videos.</p>;
  }

  return (
    <div className="paper-frame">
      <div className="idea-cards">
        {cards.map((c) => {
          const d = decisions[c.id] ?? {};
          return (
            <article className="idea-card" key={c.id}>
              <div className="idea-head"><span>MOTION IDEA</span><span>{c.date}</span></div>
              <h3 className="idea-title">{c.name}</h3>
              <p className="idea-pitch">{c.pitch}</p>
              <p className="idea-evidence">{c.evidence}</p>
              <details className="idea-why">
                <summary>WHY IT&apos;S NEW</summary>
                <ul>{c.why.map((w) => <li key={w}>{w}</li>)}</ul>
              </details>
              <div className="idea-actions">
                <button
                  className={`pill ${d.decision === "approved" ? "approved" : "approve"}`}
                  aria-pressed={d.decision === "approved"}
                  onClick={() => update(c.id, { decision: d.decision === "approved" ? undefined : "approved" })}
                >
                  {d.decision === "approved" ? "Approved" : "Approve"}
                </button>
                <button
                  className={`pill ${d.decision === "passed" ? "passed" : ""}`}
                  aria-pressed={d.decision === "passed"}
                  onClick={() => update(c.id, { decision: d.decision === "passed" ? undefined : "passed" })}
                >
                  {d.decision === "passed" ? "Passed" : "Pass"}
                </button>
                <button className="link-btn" onClick={() => setNoteOpen(noteOpen === c.id ? null : c.id)}>
                  {d.note ? "Edit note" : "Add a note"}
                </button>
              </div>
              {noteOpen === c.id && (
                <textarea
                  className="note-box"
                  rows={3}
                  maxLength={600}
                  defaultValue={d.note}
                  placeholder="e.g. keep the lockup clear of the caption"
                  aria-label={`Note for ${c.name}`}
                  onBlur={(e) => update(c.id, { note: e.target.value.trim() || undefined })}
                />
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
