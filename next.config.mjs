/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  // ── Next.js 16.3 Speed Optimizations ───────────────────────────────
  // cacheComponents disabled: Clerk auth uses usePathname() internally
  // which conflicts with cacheComponents prerendering requirements.
  // Kept reactCompiler and other optimizations that are fully compatible.
  // cacheComponents: true,  // ← disable until Clerk is compatible

  // React Compiler — auto-memoizes components (promoted from experimental in v16)
  reactCompiler: true,

  experimental: {
    // staleTimes — extend client router cache to reduce re-fetches
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // Bundle optimization: dedupe common packages (barrel-file tree-shaking)
    optimizePackageImports: [
      "@phosphor-icons/react",
      "three",
      "rehype-autolink-headings",
    ],
  },

  // Image optimization defaults
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 31536000, // 1 year for static images
  },

  // Turbopack for dev speed + production build
  turbopack: {
    root: __dirname,
  },

  // Log slow fetches to identify bottlenecks
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Cache-Control headers for static assets
  async headers() {
    return [
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
