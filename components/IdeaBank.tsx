"use client";

import { useEffect, useState } from "react";
import type { ContentIdea, FormatKey } from "@/lib/types";

// The content idea bank, filterable by format. "Make this week" keeps a shortlist in this
// browser only; when one is made, move it to Posted in the gearbook repo's content-idea-bank.md.
const KEY = "gearbook-creative:shortlist";

function load(): string[] {
  try { return JSON.parse(window.localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function IdeaBank({ ideas, formats }: { ideas: ContentIdea[]; formats: { key: FormatKey; name: string }[] }) {
  const [filter, setFilter] = useState<FormatKey | "all" | "short">("all");
  const [short, setShort] = useState<string[]>([]);
  useEffect(() => setShort(load()), []);

  const toggle = (id: string) => {
    const next = short.includes(id) ? short.filter((x) => x !== id) : [...short, id];
    setShort(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked: keep in memory */ }
  };

  const shown = ideas.filter((i) => (filter === "all" ? true : filter === "short" ? short.includes(i.id) : i.format === filter));
  const nameOf = (k: FormatKey) => formats.find((f) => f.key === k)!.name;

  return (
    <>
      <div className="filters" role="group" aria-label="Filter ideas">
        <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All {ideas.length}</button>
        {formats.map((f) => (
          <button key={f.key} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.key} · {f.name} {ideas.filter((i) => i.format === f.key).length}
          </button>
        ))}
        <button aria-pressed={filter === "short"} onClick={() => setFilter("short")}>This week {short.length}</button>
      </div>
      {shown.length === 0 && <p className="muted">Nothing picked for this week yet. Tap &quot;Make this week&quot; on an idea.</p>}
      <div className="grid g3">
        {shown.map((i) => (
          <article className="card idea" key={i.id} id={i.id}>
            <div className="idea-top">
              <span className={`chip f${i.format}`}>{i.format} · {nameOf(i.format)}</span>
              {i.series && <span className="chip">Series</span>}
            </div>
            <h3 className="h3">{i.name}</h3>
            <p className="hook">{i.hook}</p>
            <p className="small muted grow">{i.window}</p>
            <details>
              <summary>Beats{i.notes || i.settings ? " and notes" : ""}</summary>
              <ol className="steps small">{i.beats.map((b) => <li key={b}>{b}</li>)}</ol>
              {i.settings && <ul className="bullets small">{i.settings.map((s) => <li key={s}>{s}</li>)}</ul>}
              {i.notes && <ul className="bullets small muted">{i.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
            </details>
            <div className="card-foot">
              <button className="star" aria-pressed={short.includes(i.id)} onClick={() => toggle(i.id)}>
                {short.includes(i.id) ? "On this week's list" : "Make this week"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
