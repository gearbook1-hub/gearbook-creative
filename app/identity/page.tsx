import type { Metadata } from "next";
import { FormatChip, Footer, PageHead, Section, TopBar } from "@/components/Site";
import { brand } from "@/lib/brand";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
import { social } from "@/lib/social";

export const metadata: Metadata = { title: "Identity · GearBook Creative" };

// The official logo pack (GearBook Drive: Branding/02 Logo Pack), and where each one is used.
const LOGOS = [
  { file: "full-length", name: "Full length", use: "The payoff: the end card, the backpack patch in M25, anywhere the logo is the point.", bg: "var(--paper)" },
  { file: "full-length-bw", name: "Full length BW", use: "One colour in bark or cream: the hub's top bar, M18's corner, the phone app bar and share card in M25.", bg: "var(--paper)" },
  { file: "lockup", name: "Lockup", use: "Square spaces. Never smaller than 64 px.", bg: "var(--paper)" },
  { file: "bookmark", name: "Bookmark", use: "Icon sizes: the footer, the \"Make this week\" button. It's also the clear space: one bookmark on every side.", bg: "var(--paper)" },
  { file: "favicon-dark", name: "Favicon", use: "Browser tabs (dark version; a light one is in the pack).", bg: "var(--paper)" },
  { file: "profile-picture", name: "Profile picture", use: "Instagram and Facebook avatars.", bg: "var(--bark)" },
];

const SWATCHES = [
  { name: "Bark", hex: brand.bark, fg: brand.cream, use: "Ink, grounds, the suit" },
  { name: "Cream", hex: brand.cream, fg: brand.bark, use: "The ground of every piece" },
  { name: "Sage", hex: brand.sage, fg: brand.bark, use: "Done, topo lines, the pack" },
  { name: "Amber", hex: brand.amber, fg: brand.bark, use: "The one thing that matters" },
  { name: "Slate", hex: brand.slate, fg: brand.cream, use: "Links and buttons only" },
];

export default function Identity() {
  return (
    <>
      <TopBar current="/identity" />
      <main className="wrap">
        <PageHead label="Social identity" title="How GearBook" accent="shows up">
          Who&apos;s on camera, the bit, the voice and the brand. Read this before writing any post idea, script or caption. Where
          social differs from the site, social wins; where it doesn&apos;t say, the site&apos;s rules stand.
        </PageHead>

        <Section label="The signature" title="The presenter bit">
          <div className="grid g2">
            <div className="card">
              <p className="hook" style={{ fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 1.3 }}>&ldquo;{social.bit.script}&rdquo;</p>
              <p className="muted" style={{ marginTop: 14 }}>{social.formats[0].what}</p>
            </div>
            <div className="card">
              <h3 className="h3" style={{ marginTop: 0 }}>Why it works</h3>
              <p className="muted">{social.bit.joke}</p>
              <h3 className="h3" style={{ marginTop: 18 }}>The edit</h3>
              <p className="muted">{social.formats[0].edit}</p>
            </div>
          </div>
        </Section>

        <Section label="Formats" title="Three, and only three">
          <div className="grid g3">
            {social.formats.map((f) => (
              <div className="card" key={f.key}>
                <FormatChip k={f.key as "A" | "B" | "C"} />
                <h3 className="h3">{f.name}</h3>
                <p className="small muted">{f.what}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Who's on camera" title="Luke by default">
          <div className="grid g3">
            {social.onCamera.map((c) => (
              <div className="card" key={c.who}><h3 className="h3" style={{ marginTop: 0, fontSize: 21 }}>{c.who}</h3><p className="small muted">{c.role}</p></div>
            ))}
          </div>
          <p className="note" style={{ marginTop: 16 }}>{social.onCameraRule}</p>
        </Section>

        <Section label="Voice" title="Looser than the website, on purpose">
          <div className="grid g2">
            <div className="card"><h3 className="h3" style={{ marginTop: 0 }}>On social</h3><ul className="bullets">{social.voice.map((v) => <li key={v}>{v}</li>)}</ul></div>
            <div className="card"><h3 className="h3" style={{ marginTop: 0 }}>Still applies</h3><ul className="bullets">{social.rules.map((v) => <li key={v}>{v}</li>)}</ul></div>
          </div>
          <p className="muted" style={{ marginTop: 16 }}>Sports: {social.sportsNote}</p>
        </Section>

        <Section label="Logo" title="Use the official files" intro="From the GearBook logo pack. Never redraw, recolour (beyond BW in bark or cream) or stretch them.">
          <div className="grid g3">
            {LOGOS.map((l) => (
              <div key={l.file}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="logo-tile" style={{ background: l.bg }}><img src={`${BASE}/brand/gearbook-${l.file}.svg`} alt={`GearBook ${l.name}`} /></div>
                <h3 className="h3" style={{ fontSize: 20, marginTop: 12 }}>{l.name}</h3>
                <p className="small muted">{l.use}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Brand" title="Colour and type" intro="Pieces read these from public/pieces/pieces.css, the hub from app/globals.css and lib/brand.ts.">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {SWATCHES.map((s) => (
              <div key={s.name} style={{ background: s.hex, color: s.fg, borderRadius: "var(--radius)", border: "1px solid var(--line)", padding: 16, minHeight: 140, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <b style={{ fontWeight: 600 }}>{s.name}</b>
                <span className="mono">{s.hex}</span>
                <span className="small" style={{ marginTop: 6, opacity: 0.85 }}>{s.use}</span>
              </div>
            ))}
          </div>
          <div className="grid g3" style={{ marginTop: 16 }}>
            <div className="card"><p className="label">Headings</p><p style={{ fontFamily: "var(--font-display)", fontSize: 34, marginTop: 8 }}>Roca</p><p className="small muted">Matt&apos;s Adobe kit. The signup reel uses Fraunces.</p></div>
            <div className="card"><p className="label">Text</p><p style={{ fontSize: 30, marginTop: 8 }}>Outfit</p><p className="small muted">Everything people read.</p></div>
            <div className="card"><p className="label">Labels</p><p style={{ fontFamily: "var(--font-label)", fontSize: 26, fontWeight: 600, letterSpacing: "0.2em", marginTop: 8 }}>AFACAD FLUX</p><p className="small muted">Small, tracked, above a heading.</p></div>
          </div>
        </Section>

        <Section label="Gaps" title="To fill in (Luke)" intro="What Claude can't see from the feed.">
          <ul className="list">{social.toFill.map((t) => <li key={t}>{t}</li>)}</ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}
