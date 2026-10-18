// GearBook brand tokens, mirrored from the web app's app/globals.css :root and the iOS app's
// dark variants (GearBook-IOS-App scripts/make_assets.py). Used by the dashboard tiles,
// which can't read CSS variables at render time. The dashboard reads the same values from
// app/globals.css.

export const brand = {
  bark: "#3D3522",
  barkLight: "#5A4F33",
  sage: "#6A8D73",
  sageDark: "#527060",
  sageLight: "#8AAD93",
  cream: "#F0F7EE",
  amber: "#F6AE2D",
  slate: "#33658A",
  inkMuted: "#6B6450",
  // Dark appearance (iOS asset catalog): page, surface, muted surface, muted text.
  night: "#17140D",
  nightSurface: "#241F15",
  nightMuted: "#2E281C",
  nightInkMuted: "#C9C2AE",
  ink: "#0E0C08",
} as const;

export const grounds = {
  bark: { bg: brand.bark, fg: brand.cream, muted: "#B9B29C", accent: brand.amber, line: brand.cream },
  ink: { bg: brand.ink, fg: brand.cream, muted: "#9A927C", accent: brand.amber, line: brand.cream },
  cream: { bg: brand.cream, fg: brand.bark, muted: brand.inkMuted, accent: brand.sageDark, line: brand.bark },
  sage: { bg: brand.sage, fg: brand.bark, muted: "#2F3B2C", accent: brand.bark, line: brand.bark },
  amber: { bg: brand.amber, fg: brand.bark, muted: "#6A4A10", accent: brand.bark, line: brand.bark },
  slate: { bg: brand.slate, fg: brand.cream, muted: "#BFD0DD", accent: brand.amber, line: brand.cream },
} as const;

export const fonts = {
  display: "roca, Roca, Georgia, serif",
  body: "Outfit, system-ui, sans-serif",
  label: "'Afacad Flux', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
};

/** Matt's Adobe Fonts kit (Roca). Kits only serve domains listed in the kit's settings. */
export const ROCA_KIT = "https://use.typekit.net/aac5uoe.css";
