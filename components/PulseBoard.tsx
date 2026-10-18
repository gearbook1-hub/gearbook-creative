"use client";

import { useState } from "react";
import { useDecisions } from "@/lib/decisions";

// Pulse's "apply" step: decisions live in this browser until they're written back to
// data/ideas.json (scripts/apply-decisions.mjs), which is what the build mod reads.
export function DecisionsExport({ ids }: { ids: string[] }) {
  const { decisions, clear } = useDecisions();
  const [copied, setCopied] = useState(false);
  const mine = Object.fromEntries(Object.entries(decisions).filter(([id]) => ids.includes(id)));
  const count = Object.keys(mine).length;
  const json = JSON.stringify(mine, null, 2);

  return (
    <div className="panel" style={{ marginTop: 18 }}>
      <p><span className="k">decisions in this browser</span><br />{count ? `${count} idea(s) decided` : "none yet"}</p>
      {count > 0 && (
        <>
          <pre style={{ margin: "0 0 14px", whiteSpace: "pre-wrap", color: "var(--ink-muted)" }}>{json}</pre>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="step gate" style={{ cursor: "pointer" }} onClick={async () => {
              try { await navigator.clipboard.writeText(json); setCopied(true); } catch { setCopied(false); }
            }}>{copied ? "Copied" : "Copy decisions"}</button>
            <button className="step" style={{ cursor: "pointer" }} onClick={clear}>Clear</button>
          </div>
          <p style={{ marginTop: 14 }}><span className="k">then</span> save as decisions.json and run <span className="hl">node scripts/apply-decisions.mjs decisions.json</span>, or paste it to Claude and say &quot;apply these Pulse decisions&quot;.</p>
        </>
      )}
    </div>
  );
}
