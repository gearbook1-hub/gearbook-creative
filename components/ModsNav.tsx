import Link from "next/link";

// The mods, numbered like the reel's tabs. Gaps in the numbering are mods that don't have a
// breakdown page (yet); see docs/VIDEO_SPEC.md.
export const MODS = [
  { num: "01", name: "Tokens", href: "/tokens" },
  { num: "04", name: "Pulse", href: "/pulse" },
  { num: "07", name: "Motion Library", href: "/library" },
  { num: "10", name: "Video Breakdown", href: "/video-breakdown" },
  { num: "11", name: "Motion Breakdown", href: "/" },
  { num: "12", name: "Video Inbox", href: "/video-inbox" },
  { num: "13", name: "Find Your Mods", href: "/find-your-mods" },
] as const;

export function ModsNav({ current }: { current: (typeof MODS)[number]["href"] }) {
  return (
    <nav aria-label="Mods">
      <p className="eyebrow">GearBook Creative · Claude Code Mods</p>
      <ul className="tabs">
        {MODS.map((m) => (
          <li key={m.href}>
            <Link className="tab" href={m.href} aria-current={m.href === current ? "page" : undefined}>
              {m.num} {m.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        GearBook Creative · built for Luke and Matt · sample data is marked as sample · rebuilt from the
        &quot;How the motion mod thinks&quot; reel, see docs/VIDEO_SPEC.md
      </div>
    </footer>
  );
}
