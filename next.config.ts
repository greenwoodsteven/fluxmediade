import type { NextConfig } from "next";

// Static export: `next build` writes plain HTML/CSS/JS to out/ (served by Apache on netcup).
// No API routes, middleware, rewrites or image optimizer — see the Stage 1 plan, §3.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: import.meta.dirname },
  experimental: { globalNotFound: true },
};

export default nextConfig;
