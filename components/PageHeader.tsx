import { ModsNav, MODS } from "./ModsNav";

export function PageHeader({ href, title, accent, intro }: { href: (typeof MODS)[number]["href"]; title: string; accent?: string; intro: string }) {
  return (
    <header className="band">
      <div className="wrap">
        <ModsNav current={href} />
        <h1 className="title" style={{ fontSize: "clamp(40px, 7vw, 76px)" }}>
          {title} {accent && <em style={{ display: "inline" }}>{accent}</em>}
        </h1>
        <p className="page-intro">{intro}</p>
      </div>
    </header>
  );
}
