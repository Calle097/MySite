import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export: `pnpm build` writes plain HTML/CSS/JS to ./out,
  // served by Caddy on the VPS — no Node process in production.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
