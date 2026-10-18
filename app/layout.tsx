import type { Metadata } from "next";
import { Afacad_Flux, IBM_Plex_Mono, Newsreader, Outfit } from "next/font/google";
import { ROCA_KIT } from "@/lib/brand";
import "./globals.css";

// Roca (display) comes from Matt's Adobe Fonts kit, like the main site. The kit only serves
// domains listed in its Adobe settings; anywhere else headings fall back to Newsreader.
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["300", "400", "500", "600"] });
const afacad = Afacad_Flux({ subsets: ["latin"], variable: "--font-afacad" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex-mono", weight: ["400", "500", "600"] });
const fallbackSerif = Newsreader({ subsets: ["latin"], variable: "--font-fallback-serif", style: ["normal", "italic"], weight: ["300", "400"] });

export const metadata: Metadata = {
  title: "GearBook Creative",
  description: "GearBook's creative mods: the motion library, the scout that reads every reel, and Pulse.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${afacad.variable} ${plexMono.variable} ${fallbackSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={ROCA_KIT} />
      </head>
      <body>{children}</body>
    </html>
  );
}
