import type { Metadata } from "next";
import { FormatChip, Footer, PageHead, Section, TopBar } from "@/components/Site";
import { byFormat, fmtDate, formatName, posts, social } from "@/lib/social";

export const metadata: Metadata = { title: "Feed · GearBook Creative" };

export default function Feed() {
  const max = Math.max(...posts.map((p) => p.likes));
  const formats = byFormat();
  return (
    <>
      <TopBar current="/feed" />
      <main className="wrap">
        <PageHead label="Feed" title="What's posted," accent="and how it did">
          Everything on @gear.book so far, oldest first. Don&apos;t repeat these as they are. Likes only, so treat the numbers as a
          hint: the launch had launch-day reach.
        </PageHead>

        <Section title="Posted">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Date</th><th>Post</th><th>Format</th><th>Likes</th><th className="hide-sm" style={{ width: "28%" }} aria-hidden /><th className="hide-sm">Comments</th></tr></thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.date}>
                    <td className="num muted">{fmtDate(p.date)}</td>
                    <td>
                      <b style={{ fontWeight: 500 }}>{p.title}</b>
                      <div className="small muted">{p.line}</div>
                      {p.note && <div className="small" style={{ color: "var(--amber-ink)", marginTop: 4 }}>{p.note}</div>}
                    </td>
                    <td><span className="hide-sm"><FormatChip k={p.format} name={formatName(p.format)} /></span><span className="show-sm"><FormatChip k={p.format} /></span></td>
                    <td className="num">{p.likes}</td>
                    <td className="hide-sm"><div className={`bar f${p.format}`} style={{ marginTop: 8 }}><i style={{ width: `${(p.likes / max) * 100}%` }} /></div></td>
                    <td className="num muted hide-sm">{p.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section label="By format" title="Average likes per post">
          <div className="grid g3">
            {formats.map((f) => (
              <div className="card" key={f.key}>
                <FormatChip k={f.key} name={f.name} />
                <div className="stat" style={{ marginTop: 14 }}>{f.avg}</div>
                <p className="stat-label">likes on average, {f.count} posts</p>
              </div>
            ))}
          </div>
          <div className="grid g2" style={{ marginTop: 16 }}>
            <p className="note">The presenter bit and posts with a real person do better than generic pitches. {social.worst}</p>
            <p className="note todo"><b style={{ fontWeight: 500 }}>To fill in (Luke):</b> {social.toFill[2]}</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
