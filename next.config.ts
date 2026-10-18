import type { NextConfig } from "next";

// Static export: the hub is plain HTML/JS with no server, so it can sit on GitHub Pages (or
// anywhere). On Pages it lives under /gearbook-creative, set by the deploy workflow.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // The Remotion compositions are shared between the dashboard (@remotion/player) and the CLI renders.
  transpilePackages: ["remotion", "@remotion/player"],
};

export default nextConfig;
