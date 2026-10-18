import type { Metadata } from "next";
import { Footer } from "@/components/ModsNav";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "Find Your Mods - GearBook Creative" };

// 13 Find Your Mods: the same loop pointed at other things GearBook rebuilds over and over.
// Each library needs the same four parts: sources to read, a catalog to check, two human
// gates, and a way to build and check it.
const LIBRARIES = [
  { name: "Motion graphics", status: "Mine · running", sources: "Reels Luke records, saved inspo reels, requests", catalog: "data/pieces.json (this repo)", build: "Animated HTML pieces, npm run render, npm run render:check" },
  { name: "Sales decks", status: "Next", sources: "Partner calls, Impact applications, partner emails", catalog: "Past partner decks", build: "One deck engine, a version per partner" },
  { name: "Email templates", status: "Idea", sources: "lib/resend.ts in the gearbook repo, replies to hello@gearbook.shop", catalog: "Existing emailDocument templates", build: "New template in lib/resend.ts, checked at /dev-preview/emails" },
  { name: "Ad creative", status: "Idea", sources: "Top posts in Metricool, content-idea-bank.md", catalog: "Posted creative and the three house formats", build: "Stills and cut-downs from the motion library" },
  { name: "Proposals", status: "Idea", sources: "Retailer and brand conversations", catalog: "Past proposals", build: "One proposal engine, rates only from /commission-rates" },
];

export default function FindYourMods() {
  return (
    <>
      <PageHeader
        href="/find-your-mods"
        title="Find your"
        accent="mods"
        intro="Anything rebuilt over and over can run this loop: Claude watches the work you already do, pitches what's missing, and you say yes or no."
      />
      <main className="wrap">
        <Section num="01" title="Any library">
          <div className="cards2">
            {LIBRARIES.map((l) => (
              <div key={l.name} className="card glow">
                <div className="card-title">{l.name}</div>
                <div className="card-meta">{l.status}</div>
                <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.6, color: "var(--ink-muted)" }}>
                  <div><span style={{ color: "var(--ink-dim)" }}>reads</span> {l.sources}</div>
                  <div><span style={{ color: "var(--ink-dim)" }}>checks</span> {l.catalog}</div>
                  <div><span style={{ color: "var(--ink-dim)" }}>builds</span> {l.build}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section num="02" title="Start a new one">
          <div className="panel">
            <p><span className="k">1</span>&nbsp;&nbsp;Copy .claude/skills/motion-scout to a new skill and swap &quot;motion graphic&quot; for the thing (deck slide, email, ad).</p>
            <p><span className="k">2</span>&nbsp;&nbsp;Give it a catalog: one JSON entry per thing you already have, with what it covers.</p>
            <p><span className="k">3</span>&nbsp;&nbsp;Point it at its sources and log pitches to Pulse, in the same shape as data/ideas.json.</p>
            <p><span className="k">4</span>&nbsp;&nbsp;Keep both gates: approve or pass, then pick one of three before anything is built.</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
