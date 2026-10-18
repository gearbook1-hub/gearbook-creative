import type { Metadata } from "next";
import { IdeaBank } from "@/components/IdeaBank";
import { Footer, PageHead, Section, TopBar } from "@/components/Site";
import { contentIdeas, social } from "@/lib/social";
import type { FormatKey } from "@/lib/types";

export const metadata: Metadata = { title: "Idea bank · GearBook Creative" };

export default function Ideas() {
  const formats = social.formats.map((f) => ({ key: f.key as FormatKey, name: f.name }));
  return (
    <>
      <TopBar current="/ideas" />
      <main className="wrap">
        <PageHead label="Idea bank" title="Ready to post," accent="loosely timed">
          Ideas stay here until the week you post. Pick one, make it that week, then move it to Posted. Talent is Luke in the
          presenter bit by default; friends show up in vibe reels; a member version is an upgrade, never a requirement.
        </PageHead>

        <Section title="Ideas by format">
          <IdeaBank ideas={contentIdeas} formats={formats} />
        </Section>

        <Section label="Maybe later" title="Kept, not marked to use" intro="Pull one in if it fits a week.">
          <div className="grid g3">
            {social.maybeLater.map((m) => (
              <div className="card" key={m.name}>
                <p className="label" style={{ color: "var(--ink-2)" }}>{m.when}</p>
                <h3 className="h3" style={{ fontSize: 21 }}>{m.name}</h3>
                <p className="small muted">{m.what}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Before you write one" title="The rules that always apply">
          <div className="grid g2">
            <div className="card">
              <h3 className="h3" style={{ marginTop: 0 }}>Copy</h3>
              <ul className="bullets">{social.rules.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <div className="card">
              <h3 className="h3" style={{ marginTop: 0 }}>Luke&apos;s taste</h3>
              <ul className="bullets">{social.taste.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
