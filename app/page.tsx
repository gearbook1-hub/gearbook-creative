import Link from "next/link";
import { PieceFrame } from "@/components/PieceFrame";
import { FormatChip, Footer, Section, TopBar } from "@/components/Site";
import { byFormat, contentIdeas, fmtDate, posts, social } from "@/lib/social";

// Overview: what GearBook posts, who it's for, what's next in the bank and what's working,
// with the signup reel (M25) playing live from its Motion artifact code.

const NEXT_UP = ["C01", "C02", "C03", "C11"];

export default function Overview() {
  const formats = byFormat();
  const top = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const next = NEXT_UP.map((id) => contentIdeas.find((i) => i.id === id)!);

  return (
    <>
      <TopBar current="/" />
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <p className="label">GearBook on social · {social.channels.join(" + ")}</p>
            <h1 className="title" style={{ marginTop: 16 }}>Real gear, real pros, <em>a man in a suit.</em></h1>
            <p className="lede" style={{ marginTop: 20 }}>
              The creative hub for Luke and Matt: who the posts are for, the three formats, the idea bank, how the feed is doing,
              and the motion pieces every edit can reuse.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
              <Link className="btn" href="/ideas">Open the idea bank</Link>
              <Link className="btn ghost" href="/library">Motion library</Link>
            </div>
          </div>
          <div className="hero-film">
            <div className="frame"><PieceFrame piece="M25-signup-explainer" title="M25 Signup Explainer, playing live" /></div>
            <p className="frame-cap" style={{ color: "var(--on-dark-2)" }}>M25 · the signup reel, playing live from its Motion artifact</p>
          </div>
        </div>
      </section>

      <main className="wrap">
        <Section label="Who it's for" title="Pros first, their clients second">
          <div className="grid g2">
            {social.audiences.map((a) => (
              <div className="card" key={a.name}>
                <span className={`chip ${a.weight === "main" ? "fA" : ""}`}>{a.weight === "main" ? "Main audience" : "Second audience"}</span>
                <h3 className="h3">{a.name}</h3>
                <p className="muted">{a.who}</p>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 16 }}>Every sport, rotated: {social.sports.join(" · ")}.</p>
        </Section>

        <Section label="Three house formats" title="Lead with the bit or the footage" intro="Put the pitch last. The generic shopper pitch and the seasonal tip did worst so far.">
          <div className="grid g3">
            {social.formats.map((f) => {
              const s = formats.find((x) => x.key === f.key)!;
              return (
                <div className="card" key={f.key}>
                  <FormatChip k={f.key as "A" | "B" | "C"} />
                  <h3 className="h3">{f.name}</h3>
                  <p className="muted small">{f.what}</p>
                  <div className="card-foot small muted">{s.count} posted · {s.avg} likes on average</div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section label="Next up" title="From the idea bank" intro="Ideas keep loose windows, not dates. Pick one, make it that week.">
          <div className="grid g4">
            {next.map((i) => (
              <Link className="card" href={`/ideas#${i.id}`} key={i.id}>
                <FormatChip k={i.format} />
                <h3 className="h3" style={{ fontSize: 21 }}>{i.name}</h3>
                <p className="small muted">{i.window}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 18 }}><Link href="/ideas">All {contentIdeas.length} ideas →</Link></p>
        </Section>

        <Section label="What works so far" title="The presenter bit leads" intro={`Likes only, ${posts.length} posts from ${fmtDate(posts[0].date)} to ${fmtDate(posts[posts.length - 1].date)}. A hint, not a finding.`}>
          <div className="grid g3">
            {top.map((p, n) => (
              <div className="card" key={p.date}>
                <p className="label" style={{ color: "var(--ink-2)" }}>#{n + 1} · {fmtDate(p.date)}</p>
                <div className="stat" style={{ marginTop: 10 }}>{p.likes}</div>
                <p className="stat-label">likes · {p.comments} comments</p>
                <h3 className="h3" style={{ fontSize: 20, marginTop: 14 }}>{p.title}</h3>
                <div className="card-foot"><FormatChip k={p.format} /></div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 18 }}><Link href="/feed">The whole feed →</Link></p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
