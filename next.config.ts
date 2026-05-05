import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, immutable",
          },
        ],
      },
      {
        source: "/manutencao",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
  },
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dcdn-us.mitiendanube.com",
      },
      {
        protocol: "https",
        hostname: "**.nuvemshop.com.br",
      },
      {
        protocol: "https",
        hostname: "**.tiendanube.com",
      },
      {
        protocol: "https",
        hostname: "cdn.nuvemshop.com.br",
      },
    ],
  },
};

export default nextConfig;
