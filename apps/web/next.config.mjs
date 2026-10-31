import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// In the npm-workspaces monorepo, dependencies (including `next`) are hoisted
// to the repo-root node_modules. Next 14 otherwise picks the nearest lockfile
// (apps/web) as the tracing root and leaves `next` out of the server bundle,
// which crashes serverless deploys. Docker builds copy apps/web alone, so
// there is no monorepo root there and the default is kept.
const monorepoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outputFileTracingRoot = existsSync(resolve(monorepoRoot, "package.json"))
  ? monorepoRoot
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot,
  },
  output:
    process.env.NEXT_STANDALONE === "true" ||
    process.env.OUTPUT_STANDALONE === "true"
      ? "standalone"
      : undefined,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/media/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/assets/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

