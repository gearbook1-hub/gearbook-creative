import type { NextConfig } from "next";

// Static export: the hub is plain HTML/JS with no server, so it can sit on GitHub Pages (or
// anywhere). On Pages it lives under /gearbook-creative, set by the deploy workflow.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Motion pieces are plain HTML under public/pieces; the dashboard iframes them under the base path.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
