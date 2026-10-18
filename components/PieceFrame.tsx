// An HTML motion piece from public/pieces, shown at 9:16. The piece scales itself to the
// frame, loops by default, or freezes on a frame with `t` (used for stills and render
// checks). What the dashboard shows is exactly what `npm run render` records.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function PieceFrame({ piece, look, t, title }: { piece: string; look?: string; t?: number; title: string }) {
  const q = new URLSearchParams();
  if (look) q.set("look", look);
  if (t !== undefined) q.set("t", String(t));
  return (
    <iframe
      src={`${BASE}/pieces/${piece}/index.html?${q}`}
      title={title}
      loading="lazy"
      tabIndex={-1}
      style={{ width: "100%", height: "100%", border: 0, display: "block", pointerEvents: "none", background: "transparent" }}
    />
  );
}

export function PieceVideo({ src, title }: { src: string; title: string }) {
  return (
    <video
      src={`${BASE}/${src}`}
      poster={`${BASE}/${src.replace(/preview\.mp4$/, "poster.jpg")}`}
      autoPlay muted loop playsInline preload="metadata" aria-label={title}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}
