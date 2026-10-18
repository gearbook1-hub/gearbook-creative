import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const PAGES = [
  { name: "Overview", href: "/" },
  { name: "Idea bank", href: "/ideas" },
  { name: "Feed", href: "/feed" },
  { name: "Motion library", href: "/library" },
  { name: "Identity", href: "/identity" },
] as const;

export type PageHref = (typeof PAGES)[number]["href"];

export function TopBar({ current }: { current: PageHref }) {
  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE}/brand/gearbook-logo.svg`} alt="GearBook" />
          <span>Creative</span>
        </Link>
        <nav aria-label="Pages">
          <ul className="nav">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} aria-current={p.href === current ? "page" : undefined}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function PageHead({ label, title, accent, children }: { label: string; title: string; accent?: string; children?: React.ReactNode }) {
  return (
    <div className="page-head">
      <p className="label">{label}</p>
      <h1 className="title">{title} {accent && <em>{accent}</em>}</h1>
      {children && <div className="lede">{children}</div>}
    </div>
  );
}

export function Section({ label, title, intro, id, children }: { label?: string; title: string; intro?: React.ReactNode; id?: string; children: React.ReactNode }) {
  return (
    <section className="section" id={id}>
      <div className="section-head">
        <div>
          {label && <p className="label">{label}</p>}
          <h2 className="h2">{title}</h2>
        </div>
        {intro && <p className="muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

export function FormatChip({ k, name }: { k: "A" | "B" | "C"; name?: string }) {
  return <span className={`chip f${k}`}>{k}{name ? ` · ${name}` : ""}</span>;
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <span>GearBook Creative · for Luke and Matt</span>
        <span>Social ideas from the gearbook repo&apos;s docs/marketing · anything marked sample is example data</span>
      </div>
    </footer>
  );
}
