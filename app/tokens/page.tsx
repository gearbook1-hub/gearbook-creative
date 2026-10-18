import type { Metadata } from "next";
import { Footer } from "@/components/ModsNav";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Tokens - GearBook Creative" };

// 01 Tokens: the brand values every mod builds with, mirrored from the web app's
// app/globals.css and the iOS app's asset catalog. Pieces read them from lib/brand.ts.
const COLORS: [string, string, string][] = [
  ["bark", brand.bark, "primary ink, dark grounds"],
  ["sage", brand.sage, "brand green, built"],
  ["cream", brand.cream, "light grounds, text on dark"],
  ["amber", brand.amber, "the signal: the one thing lit"],
  ["slate", brand.slate, "links and buttons only"],
  ["sage-light", brand.sageLight, "small sage text on dark"],
  ["night", brand.night, "dark page (iOS dark)"],
  ["night-surface", brand.nightSurface, "dark cards (iOS dark)"],
  ["ink-muted (dark)", brand.nightInkMuted, "muted text on dark"],
];

export default function Tokens() {
  return (
    <>
      <PageHeader
        href="/tokens"
        title="Brand"
        accent="tokens"
        intro="What every mod builds with. Change a value in lib/brand.ts (pieces) and app/globals.css (this hub). The main site's source of truth stays gearbook/app/globals.css."
      />
      <main className="wrap">
        <Section num="01" title="Colour">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {COLORS.map(([name, hex, use]) => (
              <div key={name} className="card" style={{ padding: 0 }}>
                <div style={{ background: hex, height: 70 }} />
                <div style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  <div>{name} <span style={{ color: "var(--ink-dim)" }}>{hex}</span></div>
                  <div style={{ color: "var(--ink-muted)", marginTop: 4 }}>{use}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section num="02" title="Type">
          <div className="panel">
            <p><span style={{ fontFamily: "var(--font-display)", fontSize: 34 }}>Roca</span><br /><span className="k">display and titles · Adobe Fonts kit aac5uoe (Matt&apos;s) · Newsreader where the kit doesn&apos;t load</span></p>
            <p><span style={{ fontFamily: "var(--font-body)", fontSize: 22 }}>Outfit</span><br /><span className="k">body</span></p>
            <p><span style={{ fontFamily: "var(--font-label)", fontSize: 22 }}>Afacad Flux</span><br /><span className="k">labels, tracked caps in pieces</span></p>
            <p><span style={{ fontSize: 18 }}>IBM Plex Mono</span><br /><span className="k">hub panels only (transcripts, logs, builds)</span></p>
          </div>
        </Section>
        <Section num="03" title="Rules every piece follows">
          <div className="panel">
            <p><span className="k">safe area</span>&nbsp;&nbsp;9:16 at 1080x1920: everything between y 230 and 1520, nothing right of x 900 (Instagram&apos;s caption and button rail). Checked by npm run render:check.</p>
            <p><span className="k">copy</span>&nbsp;&nbsp;no em or en dashes · never promise earnings or quote a rate · &quot;outdoor professional&quot; or &quot;pro&quot;, not &quot;guide&quot; · links use https://www.gearbook.shop</p>
            <p><span className="k">motion</span>&nbsp;&nbsp;arrive fast and settle, nothing bounces · data moves only when the voice reaches it · amber marks the one thing that matters</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
