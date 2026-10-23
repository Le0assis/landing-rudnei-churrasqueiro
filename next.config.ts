import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // O dev server escuta em 0.0.0.0, mas o navegador entra por 127.0.0.1.
  // Sem isso o Next bloqueia o WebSocket de desenvolvimento e a página não hidrata.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    localPatterns: [
      { pathname: "/placeholders/**", search: "" },
      { pathname: "/api/media/**", search: "" },
      { pathname: "/photos/**", search: "" },
      { pathname: "/gallery/**", search: "" },
      { pathname: "/brand/**", search: "" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
        search: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
